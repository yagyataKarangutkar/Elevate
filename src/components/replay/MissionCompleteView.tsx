import { useState, useEffect, useRef } from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import {
  Play,
  Pause,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ChevronDown,
  Clock,
  ShieldCheck,
  Target,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import type { CompletedMissionTelemetry, MissionEvent } from '../../types';

interface ReplayTimelineNode {
  id: string;
  stepNumber: number;
  label: string;
  timestamp: string;
  title: string;
  whatHappened: string;
  whatMissionMindDid: string;
  tacticalImpact: string;
  level: 'info' | 'warning' | 'critical' | 'success';
  agentId?: string;
}

interface MissionCompleteViewProps {
  missionData?: CompletedMissionTelemetry | null;
  onRestartMission: () => void;
  onReturnToCommandCenter: () => void;
  onProceedToResults?: () => void;
}

// 8 Canonical Stages per Spec Section 34:
// MISSION STARTED ↓ ROBOTS ASSIGNED ↓ SURVIVOR FOUND ↓ ROUTE BLOCKED ↓
// COMMUNICATION LOST ↓ PLAN CHANGED ↓ HUMAN APPROVED ↓ RESCUE COMPLETED
const CANONICAL_STAGES = [
  {
    label: 'MISSION STARTED',
    search: ['MISSION START', 'MISSION INITIALIZED'],
    defaultTime: '14:01',
    defaultTitle: 'Mission Started',
    whatHappened: 'Earthquake rescue directive loaded for the affected zone.',
    whatMissionMindDid: 'Deployed 4 robots (3 drones, 1 GroundBot) and initialized swarm communications.',
    tacticalImpact: 'Search grid established across Sectors A, B, and C.',
    level: 'info' as const,
  },
  {
    label: 'ROBOTS ASSIGNED',
    search: ['PLAN GENERATED', 'ROBOTS ASSIGNED'],
    defaultTime: '14:03',
    defaultTitle: 'Robots Assigned — 9 Tasks Distributed',
    whatHappened: 'Overall objective broken into 9 search and rescue tasks.',
    whatMissionMindDid: 'Assigned search sectors to Drones 01, 02, 03 and rescue path to GroundBot 01.',
    tacticalImpact: 'Optimal routes calculated; zero resource conflicts across all robots.',
    level: 'success' as const,
  },
  {
    label: 'SURVIVOR FOUND',
    search: ['SURVIVOR DETECTED', 'SURVIVOR FOUND'],
    defaultTime: '14:21',
    defaultTitle: 'Survivor Found in Sector A',
    whatHappened: 'Drone 01 detected thermal heat signatures in Sector A rubble.',
    whatMissionMindDid: 'Confirmed 3 survivors and immediately queued GroundBot 01 with aid payload.',
    tacticalImpact: 'High-priority rescue waypoint dispatched to GroundBot.',
    level: 'critical' as const,
    agentId: 'DRONE 01',
  },
  {
    label: 'ROUTE BLOCKED',
    search: ['ROUTE BLOCKED'],
    defaultTime: '14:24',
    defaultTitle: 'GroundBot Route Blocked by Debris',
    whatHappened: 'Collapsed building wall blocked GroundBot 01 primary route.',
    whatMissionMindDid: 'Computed alternate safe detour around the rubble in 0.8 seconds.',
    tacticalImpact: 'Alternate path added only +2 minutes; mission deadline fully preserved.',
    level: 'warning' as const,
    agentId: 'GROUNDBOT 01',
  },
  {
    label: 'COMMUNICATION LOST',
    search: ['SIGNAL LOSS', 'COMMUNICATION LOST'],
    defaultTime: '14:26',
    defaultTitle: 'Drone 03 Communication Lost',
    whatHappened: 'Telemetry heartbeat lost from Drone 03 in Sector C.',
    whatMissionMindDid: 'Isolated the failure and checked remaining swarm capabilities.',
    tacticalImpact: 'Identified Drone 02 as optimal unit to expand coverage into Sector C.',
    level: 'critical' as const,
    agentId: 'DRONE 03',
  },
  {
    label: 'PLAN CHANGED',
    search: ['PLAN CHANGED', 'LIFELINE FOUND', 'RECOVERY'],
    defaultTime: '14:28',
    defaultTitle: 'Plan Changed — Minimal Adaptation',
    whatHappened: 'Drone 02 took over Sector C while GroundBot continued extraction.',
    whatMissionMindDid: 'Reassigned only 2 affected tasks; left remaining 7 tasks completely unchanged.',
    tacticalImpact: '2 of 9 tasks changed · 7 of 9 tasks stayed the same.',
    level: 'success' as const,
    agentId: 'DRONE 02',
  },
  {
    label: 'HUMAN APPROVED',
    search: ['HUMAN APPROVAL', 'APPROVAL'],
    defaultTime: '14:31',
    defaultTitle: 'Human Decision Approved',
    whatHappened: 'Final payload delivery near collapsed structure required operator authorization.',
    whatMissionMindDid: 'Presented clear consequence preview and obtained operator verification.',
    tacticalImpact: 'Safe rescue path confirmed with full human accountability.',
    level: 'success' as const,
  },
  {
    label: 'RESCUE COMPLETED',
    search: ['MISSION COMPLETE', 'SURVIVOR SECURED', 'RESCUE COMPLETED'],
    defaultTime: '14:41',
    defaultTitle: 'Rescue Completed — All Objectives Accomplished',
    whatHappened: '3 survivors secured and medical aid package delivered.',
    whatMissionMindDid: 'Guided all robots back into safe hold formation and archived telemetry.',
    tacticalImpact: 'Mission completed 4 minutes ahead of the 14:45 operational deadline.',
    level: 'success' as const,
  },
];

export const MissionCompleteView: React.FC<MissionCompleteViewProps> = ({
  missionData,
  onRestartMission,
  onReturnToCommandCenter,
  onProceedToResults,
}) => {
  const replaySectionRef = useRef<HTMLDivElement>(null);

  // Construct replay timeline
  const [timelineNodes, setTimelineNodes] = useState<ReplayTimelineNode[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  useEffect(() => {
    const recordedEvents: MissionEvent[] = missionData?.events || [];

    const nodes: ReplayTimelineNode[] = CANONICAL_STAGES.map((stage, idx) => {
      const match = recordedEvents.find((evt) =>
        stage.search.some((s) => evt.title.toUpperCase().includes(s))
      );

      return {
        id: match?.id || `stage-${idx}`,
        stepNumber: idx + 1,
        label: stage.label,
        timestamp: match?.timestamp || stage.defaultTime,
        title: match?.title || stage.defaultTitle,
        whatHappened: match?.detail || stage.whatHappened,
        whatMissionMindDid: stage.whatMissionMindDid,
        tacticalImpact: stage.tacticalImpact,
        level: match?.level || stage.level,
        agentId: match?.agentId ? match.agentId.toString() : stage.agentId,
      };
    });

    setTimelineNodes(nodes);
    setCurrentStep(nodes.length - 1);
  }, [missionData]);

  // Replay ticker
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timelineNodes.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2200 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timelineNodes.length]);

  const activeNode = timelineNodes[currentStep] || timelineNodes[0];

  const scrollToReplay = () => {
    playUiTick();
    replaySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050607',
        color: '#F2F4F2',
        padding: '36px 24px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1180px' }}>
        {/* Top Header Badge & Spec Section 33 Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#78D6A3',
              letterSpacing: '0.12em',
              marginBottom: '10px',
              padding: '4px 12px',
              background: 'rgba(120, 214, 163, 0.1)',
              border: '1px solid rgba(120, 214, 163, 0.3)',
              borderRadius: '20px',
            }}
          >
            <CheckCircle2 size={13} />
            <span>MISSION COMPLETE · OBJECTIVE ACCOMPLISHED</span>
          </div>

          {/* Spec Section 33: "Mission complete. The swarm completed the rescue objective." */}
          <h1
            style={{
              fontSize: '34px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              marginBottom: '10px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Mission complete. The swarm completed the rescue objective.
          </h1>
          <p style={{ color: '#A7ADAB', fontSize: '14px', maxWidth: '640px', margin: '0 auto', fontFamily: '"Inter", sans-serif' }}>
            Four robots worked together, adapted to disruptions autonomously, and rescued all detected survivors.
          </p>
        </div>

        {/* 1. Prominent Outcome First Banner - Spec Section 33 */}
        <div
          style={{
            background: 'rgba(120, 214, 163, 0.08)',
            border: '1px solid rgba(120, 214, 163, 0.35)',
            borderRadius: '8px',
            padding: '18px 24px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={24} color="#78D6A3" />
            <div>
              {/* Spec Section 33 verbatim: "3 survivors found · 4 robots deployed · 2 tasks reassigned" */}
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#78D6A3', letterSpacing: '0.04em' }}>
                3 survivors found · 4 robots deployed · 2 tasks reassigned
              </div>
              <div style={{ fontSize: '12px', color: '#A7ADAB', marginTop: '3px', fontFamily: '"Inter", sans-serif' }}>
                All search sectors covered and medical aid payload delivered within safety limits.
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(120, 214, 163, 0.15)',
              border: '1px solid rgba(120, 214, 163, 0.3)',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '11px',
              color: '#78D6A3',
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}
          >
            OBJECTIVE MET
          </div>
        </div>

        {/* 2. Replay Story Summary Banner - Spec Section 33 & 34 */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '16px 24px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Sparkles size={18} color="#F0AE63" />
            <div>
              <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '2px' }}>
                WHAT CHANGED DURING THE MISSION?
              </div>
              <div style={{ fontSize: '13px', color: '#F2F4F2', fontWeight: 600 }}>
                1 communication failure · 1 blocked route · 2 tasks reassigned · 1 human decision
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={scrollToReplay}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#F2F4F2',
                padding: '7px 14px',
                borderRadius: '4px',
                fontSize: '11px',
                cursor: 'pointer',
                fontFamily: '"JetBrains Mono", monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>View Replay ↓</span>
            </button>
          </div>
        </div>

        {/* 3. Summary Metrics in a Clean Row - Spec Section 33 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '14px',
            marginBottom: '24px',
          }}
        >
          {/* Time Elapsed */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '16px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '6px' }}>
              TIME ELAPSED
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#F2F4F2' }}>
              14 min 32 sec
            </div>
            <div style={{ fontSize: '10.5px', color: '#78D6A3', marginTop: '4px' }}>
              4 min ahead of 14:45 deadline
            </div>
          </div>

          {/* Swarm Efficiency */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '16px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '6px' }}>
              SWARM EFFICIENCY
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#78D6A3' }}>
              94%
            </div>
            <div style={{ fontSize: '10.5px', color: '#A7ADAB', marginTop: '4px' }}>
              Coordinated flight coverage
            </div>
          </div>

          {/* Adaptations */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '16px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '6px' }}>
              ADAPTATIONS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#78D6A3' }}>
              2
            </div>
            <div style={{ fontSize: '10.5px', color: '#A7ADAB', marginTop: '4px' }}>
              Smallest safe changes made
            </div>
          </div>

          {/* Human Interventions */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '16px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '6px' }}>
              HUMAN INTERVENTIONS
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: '#F0AE63' }}>
              1
            </div>
            <div style={{ fontSize: '10.5px', color: '#A7ADAB', marginTop: '4px' }}>
              Only when needed
            </div>
          </div>
        </div>

        {/* 4. Swarm 3D Visual in Safe Return State */}
        <div
          style={{
            height: '280px',
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '28px',
          }}
        >
          <SwarmCanvas mode="hero" interactive={true} />
          <div
            style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#78D6A3',
              background: 'rgba(8, 10, 11, 0.85)',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(120, 214, 163, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#78D6A3', display: 'inline-block' }} />
            <span>SWARM RETURNED TO SAFE BASE FORMATION</span>
          </div>
        </div>

        {/* 5. REPLAY MISSION SECTION (Screen 7 per Spec Section 34 & 35) */}
        <div
          ref={replaySectionRef}
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '28px',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {/* Replay Header & Controls - Spec Section 34 & 35 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '16px', color: '#F2F4F2', fontWeight: 600, letterSpacing: '0.04em' }}>
                Here is how the swarm completed the mission.
              </div>
              <div style={{ fontSize: '11px', color: '#A7ADAB', marginTop: '3px', fontFamily: '"Inter", sans-serif' }}>
                Step-by-step playback of autonomous swarm decisions and human approvals.
              </div>
            </div>

            {/* Controls: [ ◀ Previous ] [ Play/Pause ] [ Next ▶ ] Speed: 1x · 2x · 4x */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  fontSize: '10px',
                  color: '#68706D',
                  marginRight: '6px',
                  letterSpacing: '0.08em',
                }}
              >
                EVENT {String(currentStep + 1).padStart(2, '0')} / {String(timelineNodes.length).padStart(2, '0')}
              </div>

              <button
                onClick={() => {
                  playUiTick();
                  setCurrentStep((p) => Math.max(0, p - 1));
                }}
                disabled={currentStep === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F2F4F2',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.4 : 1,
                  fontSize: '11px',
                }}
              >
                ◀ Previous
              </button>

              <button
                onClick={() => {
                  playUiTick();
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  background: '#F2F4F2',
                  border: 'none',
                  color: '#050607',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => {
                  playUiTick();
                  setCurrentStep((p) => Math.min(timelineNodes.length - 1, p + 1));
                }}
                disabled={currentStep === timelineNodes.length - 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F2F4F2',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: currentStep === timelineNodes.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === timelineNodes.length - 1 ? 0.4 : 1,
                  fontSize: '11px',
                }}
              >
                Next ▶
              </button>

              <button
                onClick={() => {
                  playUiTick();
                  setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1));
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#A7ADAB',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {playbackSpeed}×
              </button>
            </div>
          </div>

          {/* Scrubber bar showing all events as interactive dots - Spec Section 35 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${timelineNodes.length}, 1fr)`,
              gap: '6px',
              marginBottom: '20px',
            }}
          >
            {timelineNodes.map((node, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <div
                  key={node.id}
                  onClick={() => {
                    playUiTick();
                    setCurrentStep(idx);
                  }}
                  title={`${node.timestamp} · ${node.label}`}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: isActive
                        ? '#78D6A3'
                        : isPast
                        ? 'rgba(120, 214, 163, 0.5)'
                        : 'rgba(255, 255, 255, 0.12)',
                      boxShadow: isActive ? '0 0 10px rgba(120, 214, 163, 0.8)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  />
                  <div style={{ fontSize: '9px', color: isActive ? '#78D6A3' : '#68706D' }}>
                    {node.timestamp}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline + Inspector Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '24px',
            }}
          >
            {/* Left: Vertical Timeline (8 Stages per Spec Section 34) */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                borderRight: '1px solid rgba(255, 255, 255, 0.08)',
                paddingRight: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: '#68706D',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                MISSION SEQUENCE
              </div>

              {timelineNodes.map((node, idx) => {
                const isSelected = idx === currentStep;
                const isPast = idx < currentStep;
                const isLast = idx === timelineNodes.length - 1;

                const nodeColor =
                  node.level === 'critical'
                    ? '#F25D5D'
                    : node.level === 'warning'
                    ? '#F0AE63'
                    : node.level === 'success'
                    ? '#78D6A3'
                    : '#A7ADAB';

                return (
                  <div key={node.id} style={{ display: 'flex', flexDirection: 'column' }}>
                    <button
                      onClick={() => {
                        playUiTick();
                        setCurrentStep(idx);
                      }}
                      style={{
                        textAlign: 'left',
                        padding: '7px 10px',
                        background: isSelected
                          ? 'rgba(255, 255, 255, 0.08)'
                          : isPast
                          ? 'rgba(255, 255, 255, 0.02)'
                          : 'transparent',
                        border: isSelected
                          ? '1px solid rgba(255, 255, 255, 0.35)'
                          : '1px solid transparent',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: nodeColor,
                            boxShadow: isSelected ? `0 0 6px ${nodeColor}` : 'none',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#F2F4F2' : isPast ? '#A7ADAB' : '#68706D',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {node.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '9.5px',
                          color: isSelected ? '#78D6A3' : '#68706D',
                        }}
                      >
                        {node.timestamp}
                      </span>
                    </button>

                    {/* Down Arrow Connector (↓) between steps */}
                    {!isLast && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          paddingLeft: '13px',
                          height: '14px',
                          color: isPast ? 'rgba(120, 214, 163, 0.4)' : 'rgba(255, 255, 255, 0.15)',
                        }}
                      >
                        <ChevronDown size={12} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right: Active Event Details Inspector - Spec Section 34 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeNode && (
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '20px',
                  }}
                >
                  {/* Event Meta Topbar */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '14px',
                      paddingBottom: '12px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {activeNode.level === 'critical' ? (
                        <AlertTriangle size={15} color="#F25D5D" />
                      ) : activeNode.level === 'warning' ? (
                        <Radio size={15} color="#F0AE63" />
                      ) : activeNode.level === 'success' ? (
                        <CheckCircle2 size={15} color="#78D6A3" />
                      ) : (
                        <Target size={15} color="#A7ADAB" />
                      )}

                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color:
                            activeNode.level === 'critical'
                              ? '#F25D5D'
                              : activeNode.level === 'warning'
                              ? '#F0AE63'
                              : activeNode.level === 'success'
                              ? '#78D6A3'
                              : '#F2F4F2',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {activeNode.label}
                      </span>

                      {activeNode.agentId && (
                        <span
                          style={{
                            fontSize: '9.5px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            color: '#F2F4F2',
                          }}
                        >
                          ROBOT: {activeNode.agentId}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#68706D', fontSize: '11px' }}>
                      <Clock size={12} />
                      <span>{activeNode.timestamp} UTC</span>
                    </div>
                  </div>

                  {/* Event Headline */}
                  <div
                    style={{
                      fontSize: '16px',
                      color: '#F2F4F2',
                      fontWeight: 600,
                      marginBottom: '14px',
                    }}
                  >
                    {activeNode.title}
                  </div>

                  {/* What Happened (Plain English) - Spec Section 34 */}
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#F2F4F2',
                      lineHeight: 1.5,
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '4px' }}>
                      WHAT HAPPENED?
                    </div>
                    {activeNode.whatHappened}
                  </div>

                  {/* What MissionMind Did (Plain English) - Spec Section 34 */}
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#78D6A3',
                      lineHeight: 1.5,
                      background: 'rgba(120, 214, 163, 0.05)',
                      border: '1px solid rgba(120, 214, 163, 0.2)',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#78D6A3', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 600 }}>
                      WHAT MISSIONMIND DID
                    </div>
                    {activeNode.whatMissionMindDid}
                  </div>

                  {/* Tactical Impact */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      padding: '12px 14px',
                      borderRadius: '4px',
                    }}
                  >
                    <ShieldCheck size={16} color="#A7ADAB" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em' }}>
                        MISSION IMPACT
                      </div>
                      <div style={{ fontSize: '12px', color: '#A7ADAB', marginTop: '2px', lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>
                        {activeNode.tacticalImpact}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. Bottom Navigation CTAs - Spec Section 33 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              playUiTick();
              onReturnToCommandCenter();
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              color: '#F2F4F2',
              padding: '12px 24px',
              borderRadius: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            ← Back to Command Center
          </button>

          {onProceedToResults ? (
            <button
              onClick={() => {
                playSuccessChirp();
                onProceedToResults();
              }}
              style={{
                background: '#F2F4F2',
                border: 'none',
                color: '#050607',
                padding: '12px 28px',
                borderRadius: '6px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>View Strategy Comparison</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => {
                playSuccessChirp();
                onRestartMission();
              }}
              style={{
                background: '#F2F4F2',
                border: 'none',
                color: '#050607',
                padding: '12px 28px',
                borderRadius: '6px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <RotateCcw size={14} />
              <span>Start Another Mission</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
