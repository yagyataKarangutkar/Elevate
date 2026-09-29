import { useState, useEffect } from 'react';
import { TacticalMap } from './TacticalMap';
import { AgentStatusPanel } from './AgentStatusPanel';
import { MissionProgressPanel } from './MissionProgressPanel';
import { EventFeedPanel } from './EventFeedPanel';
import { ApprovalOverlay } from './ApprovalOverlay';
import { DecisionExplanationModal } from './DecisionExplanationModal';
import type { Agent, AgentId, MissionEvent } from '../../types';
import {
  Layers,
  Map,
  Users,
  FileText,
  Activity,
  Sliders,
  Radio,
  Volume2,
  VolumeX,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import {
  playUiTick,
  playAlertAlarm,
  playSuccessChirp,
  playReplanningTone,
  toggleAudio,
} from '../../utils/audio';

interface CommandCenterProps {
  onCompleteMission: () => void;
  onExitToLanding: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onCompleteMission,
  onExitToLanding,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [audioActive, setAudioActive] = useState<boolean>(true);
  const [showSimMenu, setShowSimMenu] = useState<boolean>(false);
  const [showReasoningModal, setShowReasoningModal] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);

  // Mission State
  const [confidence, setConfidence] = useState<number>(91);
  const [areaScanned, setAreaScanned] = useState<number>(62);
  const [survivorsFound, setSurvivorsFound] = useState<number>(1);
  const [timeSeconds, setTimeSeconds] = useState<number>(1904); // 00:31:44
  const [isReplanning, setIsReplanning] = useState<boolean>(false);
  const [replanApproved, setReplanApproved] = useState<boolean>(false);
  const [d3Offline, setD3Offline] = useState<boolean>(false);
  const [approvalRequired, setApprovalRequired] = useState<boolean>(false);

  // Initial Agents matching visual reference
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'D1',
      code: 'DRONE-01',
      name: 'Drone 01',
      type: 'drone',
      role: 'Recon',
      status: 'active',
      battery: 72,
      signal: 98,
      task: 'Searching Sector A',
      coords: { x: 320, y: 180 },
    },
    {
      id: 'D2',
      code: 'DRONE-02',
      name: 'Drone 02',
      type: 'drone',
      role: 'Survey',
      status: 'active',
      battery: 81,
      signal: 96,
      task: 'Searching Sector B',
      coords: { x: 280, y: 360 },
    },
    {
      id: 'D3',
      code: 'DRONE-03',
      name: 'Drone 03',
      type: 'drone',
      role: 'Relay',
      status: 'active',
      battery: 68,
      signal: 94,
      task: 'Relay link active',
      coords: { x: 570, y: 200 },
    },
    {
      id: 'G1',
      code: 'GROUNDBOT-01',
      name: 'GroundBot',
      type: 'ground',
      role: 'Support',
      status: 'active',
      battery: 64,
      signal: 92,
      task: 'Standby / Extraction',
      coords: { x: 520, y: 430 },
    },
  ]);

  // Initial Events matching visual reference
  const [events, setEvents] = useState<MissionEvent[]>([
    {
      id: 'e1',
      timestamp: '00:28',
      timeSec: 1680,
      title: 'Drone-03 battery critical.',
      detail: 'Task reassigned to GroundBot.',
      level: 'warning',
      agentId: 'D3',
    },
    {
      id: 'e2',
      timestamp: '00:25',
      timeSec: 1500,
      title: 'Communication lost with Drone-03.',
      detail: 'Relay deployed (Drone-01).',
      level: 'critical',
      agentId: 'D3',
    },
    {
      id: 'e3',
      timestamp: '00:20',
      timeSec: 1200,
      title: 'Route to Sector B blocked.',
      detail: 'Replanning in progress...',
      level: 'warning',
    },
    {
      id: 'e4',
      timestamp: '00:14',
      timeSec: 840,
      title: 'Survivor detected in Sector A.',
      detail: 'GroundBot dispatched.',
      level: 'info',
      agentId: 'G1',
    },
    {
      id: 'e5',
      timestamp: '00:08',
      timeSec: 480,
      title: 'Mission plan updated.',
      detail: 'Confidence: 91%.',
      level: 'success',
    },
    {
      id: 'e6',
      timestamp: '00:03',
      timeSec: 180,
      title: 'All agents online.',
      level: 'info',
    },
  ]);

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sound Mute Toggle
  const handleToggleAudio = () => {
    const current = toggleAudio();
    setAudioActive(current);
  };

  /**
   * Primary MVP Demonstration: Trigger Communication Lost with Drone-03
   */
  const triggerCommunicationLost = () => {
    setShowSimMenu(false);
    playAlertAlarm();

    // 1. Immediately drop D3 signal, battery & status
    setD3Offline(true);
    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'D3'
          ? {
              ...a,
              status: 'offline',
              battery: 18,
              signal: 0,
              task: 'OFFLINE — MESH SEPARATED',
            }
          : a
      )
    );

    // 2. Add event log
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: formatTimer(timeSeconds).substring(3),
        timeSec: timeSeconds,
        title: 'Communication lost with Drone-03.',
        detail: 'Signal 0% — mesh link disconnected.',
        level: 'critical',
        agentId: 'D3',
      },
      ...prev,
    ]);

    // 3. Drop confidence and trigger replanning
    setConfidence(67);
    setIsReplanning(true);

    setTimeout(() => {
      playReplanningTone();
      // Drop confidence to 42% (below threshold)
      setConfidence(42);
      setIsReplanning(false);
      setApprovalRequired(true);
      playAlertAlarm();
    }, 2200);
  };

  /**
   * Human Approval Actions
   */
  const handleApproveReplan = () => {
    setApprovalRequired(false);
    setReplanApproved(true);
    setConfidence(91);

    // Update GroundBot status and task
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === 'G1') {
          return {
            ...a,
            task: 'Executing Ridge Vector Delta rescue run',
            status: 'active',
          };
        }
        if (a.id === 'D1') {
          return {
            ...a,
            task: 'Mesh Relay Active (replacing D3)',
          };
        }
        return a;
      })
    );

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: formatTimer(timeSeconds).substring(3),
        timeSec: timeSeconds,
        title: 'Human operator approved replan.',
        detail: 'GroundBot dispatched to survivor coordinates.',
        level: 'success',
      },
      ...prev,
    ]);

    // Advance survivor counter to 3/3 and area scanned to 100%
    setTimeout(() => {
      setSurvivorsFound(3);
      setAreaScanned(100);
      playSuccessChirp();
      setEvents((prev) => [
        {
          id: `evt-${Date.now() + 1}`,
          timestamp: formatTimer(timeSeconds + 4).substring(3),
          timeSec: timeSeconds + 4,
          title: 'All survivors secured. Mission accomplished.',
          level: 'success',
        },
        ...prev,
      ]);
    }, 4500);
  };

  const handleRejectReplan = () => {
    setApprovalRequired(false);
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: formatTimer(timeSeconds).substring(3),
        timeSec: timeSeconds,
        title: 'Operator rejected autonomous vector.',
        detail: 'Manual telemetry override commanded.',
        level: 'warning',
      },
      ...prev,
    ]);
  };

  /**
   * Reset simulation to clean state
   */
  const handleResetSimulation = () => {
    setShowSimMenu(false);
    setD3Offline(false);
    setIsReplanning(false);
    setReplanApproved(false);
    setApprovalRequired(false);
    setConfidence(91);
    setSurvivorsFound(1);
    setAreaScanned(62);
    setAgents([
      {
        id: 'D1',
        code: 'DRONE-01',
        name: 'Drone 01',
        type: 'drone',
        role: 'Recon',
        status: 'active',
        battery: 72,
        signal: 98,
        task: 'Searching Sector A',
        coords: { x: 320, y: 180 },
      },
      {
        id: 'D2',
        code: 'DRONE-02',
        name: 'Drone 02',
        type: 'drone',
        role: 'Survey',
        status: 'active',
        battery: 81,
        signal: 96,
        task: 'Searching Sector B',
        coords: { x: 280, y: 360 },
      },
      {
        id: 'D3',
        code: 'DRONE-03',
        name: 'Drone 03',
        type: 'drone',
        role: 'Relay',
        status: 'active',
        battery: 68,
        signal: 94,
        task: 'Relay link active',
        coords: { x: 570, y: 200 },
      },
      {
        id: 'G1',
        code: 'GROUNDBOT-01',
        name: 'GroundBot',
        type: 'ground',
        role: 'Support',
        status: 'active',
        battery: 64,
        signal: 92,
        task: 'Standby / Extraction',
        coords: { x: 520, y: 430 },
      },
    ]);
    playSuccessChirp();
  };

  const navItems = [
    { label: 'Overview', icon: <Layers size={14} /> },
    { label: 'Mission Plan', icon: <FileText size={14} /> },
    { label: 'Agents', icon: <Users size={14} /> },
    { label: 'Map', icon: <Map size={14} /> },
    { label: 'Events', icon: <Activity size={14} /> },
    { label: 'Logs', icon: <Radio size={14} /> },
    { label: 'Settings', icon: <Sliders size={14} /> },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#050607',
        color: '#F2F4F2',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header Topbar matching visual reference */}
      <header
        style={{
          height: '48px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: '#080A0B',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Logo Mark */}
          <div
            onClick={onExitToLanding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '1.5px solid #ffffff',
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '4px', height: '4px', background: '#ffffff' }} />
            </div>
            <span>MissionMind</span>
          </div>

          <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.15)' }} />

          {/* Mission Tag & Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
            }}
          >
            <span style={{ color: '#F2F4F2', fontWeight: 600 }}>MISSION 07</span>
            <span style={{ color: '#68706D' }}>/</span>
            <span style={{ color: '#A7ADAB' }}>EARTHQUAKE RESCUE</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#78D6A3',
                  boxShadow: '0 0 8px #78D6A3',
                }}
              />
              <span style={{ color: '#78D6A3', fontWeight: 600 }}>ACTIVE</span>
            </div>
            <span style={{ color: '#68706D' }}>|</span>
            <span style={{ color: '#F2F4F2' }}>{formatTimer(timeSeconds)}</span>
          </div>
        </div>

        {/* Right Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Audio toggle */}
          <button
            onClick={handleToggleAudio}
            title={audioActive ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: audioActive ? '#F2F4F2' : '#68706D',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* SIMULATE EVENT Trigger Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                playUiTick();
                setShowSimMenu(!showSimMenu);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                borderRadius: '4px',
                color: '#F2F4F2',
                padding: '6px 12px',
                fontSize: '11px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Zap size={12} color="#F0AE63" />
              <span>SIMULATE EVENT</span>
            </button>

            {/* Simulation Options Dropdown */}
            {showSimMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  width: '260px',
                  background: '#080A0B',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
                  padding: '8px',
                  zIndex: 100,
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                <div style={{ fontSize: '10px', color: '#68706D', padding: '6px 8px' }}>
                  SIMULATION CONTROLS
                </div>

                <button
                  onClick={triggerCommunicationLost}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'rgba(242, 93, 93, 0.1)',
                    border: '1px solid rgba(242, 93, 93, 0.3)',
                    borderRadius: '4px',
                    color: '#F25D5D',
                    fontSize: '11px',
                    cursor: 'pointer',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertTriangle size={13} />
                  <span>COMMUNICATION LOST (D3)</span>
                </button>

                <button
                  onClick={() => {
                    setShowSimMenu(false);
                    setShowReasoningModal(true);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#A7ADAB',
                    fontSize: '11px',
                    cursor: 'pointer',
                    marginBottom: '6px',
                  }}
                >
                  View AI Reasoning ("Why GroundBot?")
                </button>

                <button
                  onClick={handleResetSimulation}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    color: '#A7ADAB',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Reset Simulation
                </button>
              </div>
            )}
          </div>

          {/* Complete Mission button */}
          <button
            onClick={() => {
              playSuccessChirp();
              onCompleteMission();
            }}
            style={{
              background: '#F2F4F2',
              color: '#050607',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer',
            }}
          >
            Complete Mission →
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Narrow Sidebar */}
        <aside
          style={{
            width: '180px',
            borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            background: '#080A0B',
            padding: '16px 10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flexShrink: 0,
          }}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  playUiTick();
                  setActiveTab(item.label);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isActive ? '#F2F4F2' : '#68706D',
                  fontSize: '12px',
                  fontWeight: isActive ? 500 : 400,
                  fontFamily: '"Inter", sans-serif',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderLeft: isActive ? '2px solid #ffffff' : '2px solid transparent',
                  transition: 'all 0.15s ease',
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <div style={{ marginTop: 'auto', padding: '12px 6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ fontSize: '10px', color: '#68706D', fontFamily: '"JetBrains Mono", monospace' }}>
              AUTONOMOUS MESH
            </div>
            <div style={{ fontSize: '11px', color: '#78D6A3', marginTop: '2px', fontFamily: '"JetBrains Mono", monospace' }}>
              {d3Offline ? 'DEGRADED (3/4)' : 'FULL SYNC (4/4)'}
            </div>
          </div>
        </aside>

        {/* Center Live Map Viewport */}
        <main style={{ flex: 1, padding: '14px', position: 'relative', overflow: 'hidden' }}>
          <TacticalMap
            agents={agents}
            survivorCoords={{ x: 440, y: 330 }}
            isReplanning={isReplanning}
            replanApproved={replanApproved}
            d3Offline={d3Offline}
            onSelectAgent={(id) => setSelectedAgentId(id)}
            selectedAgentId={selectedAgentId}
          />
        </main>

        {/* Right Side Panels: Status, Progress, Feed */}
        <aside
          style={{
            width: '320px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
            background: '#080A0B',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flexShrink: 0,
            overflowY: 'auto',
          }}
        >
          {/* Agent Status */}
          <AgentStatusPanel
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={(id) => setSelectedAgentId(id)}
          />

          {/* Mission Progress */}
          <MissionProgressPanel
            areaScanned={areaScanned}
            survivorsFound={survivorsFound}
            totalSurvivors={3}
            timeElapsed={formatTimer(timeSeconds)}
            confidence={confidence}
          />

          {/* Event Feed */}
          <EventFeedPanel
            events={events}
            onOpenLogModal={() => setShowReasoningModal(true)}
          />
        </aside>
      </div>

      {/* Human Approval Interrupt Overlay (Section 39-41) */}
      {approvalRequired && (
        <ApprovalOverlay
          confidence={confidence}
          onApprove={handleApproveReplan}
          onReject={handleRejectReplan}
          onOpenReasoning={() => setShowReasoningModal(true)}
        />
      )}

      {/* AI Decision Reasoning Inspector ("Why GroundBot?") Modal */}
      <DecisionExplanationModal
        isOpen={showReasoningModal}
        onClose={() => setShowReasoningModal(false)}
      />
    </div>
  );
};
