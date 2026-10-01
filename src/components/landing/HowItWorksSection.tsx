import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Cpu, 
  Radio, 
  AlertTriangle, 
  RefreshCw, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { playUiTick } from '../../utils/audio';

interface HowItWorksStep {
  step: number;
  title: string;
  headline: string;
  example: string;
  supporting: string;
  technicalLabel?: string;
  icon: React.ReactNode;
  previewData?: { label: string; value: string }[];
}

const STEPS: HowItWorksStep[] = [
  {
    step: 1,
    title: 'GIVE THE MISSION',
    headline: 'You give the mission',
    example: '"Search the affected area and rescue survivors."',
    supporting: 'You describe the goal. MissionMind handles the robot-by-robot planning.',
    technicalLabel: 'Mission Objective Input',
    icon: <Target size={18} color="#F2F4F2" />,
    previewData: [
      { label: 'Input Type', value: 'Natural Language' },
      { label: 'Target Fleet', value: '4 Swarm Agents' },
    ],
  },
  {
    step: 2,
    title: 'MAKE A PLAN',
    headline: 'MissionMind makes a plan',
    example: 'Drone 01 → Search Sector A\nDrone 02 → Search Sector B\nDrone 03 → Relay + Search\nGroundBot → Rescue Support',
    supporting: 'The AI splits the mission into tasks and assigns them to the right agents.',
    technicalLabel: 'Autonomous Task Allocation',
    icon: <Cpu size={18} color="#78D6A3" />,
    previewData: [
      { label: 'Plan Status', value: 'Confirmed Feasible' },
      { label: 'Tasks Created', value: '9 Subtasks' },
    ],
  },
  {
    step: 3,
    title: 'SWARM EXECUTES',
    headline: 'The swarm gets to work',
    example: '3 Drones launch aerial sweeps · GroundBot positions for aid payload delivery.',
    supporting: 'The robots work together while MissionMind monitors the mission in real time.',
    technicalLabel: 'P2P Mesh Coordination',
    icon: <Radio size={18} color="#4FA3E2" />,
    previewData: [
      { label: 'Swarm Link', value: 'Active Telemetry' },
      { label: 'Sync Rate', value: '100 Hz Continuous' },
    ],
  },
  {
    step: 4,
    title: 'SOMETHING CHANGES',
    headline: 'Something changes',
    example: 'Drone 03 lost communication in Sector C.',
    supporting: 'MissionMind checks what has been affected before changing anything.',
    technicalLabel: 'Anomaly & Failure Detection',
    icon: <AlertTriangle size={18} color="#F0AE63" />,
    previewData: [
      { label: 'Failure Type', value: 'Signal Drop (12%)' },
      { label: 'Impacted Area', value: 'Sector C Relay' },
    ],
  },
  {
    step: 5,
    title: 'SWARM ADAPTS',
    headline: 'MissionMind adapts',
    example: '2 of 9 tasks changed · 7 of 9 tasks stayed the same.',
    supporting: 'Only the affected parts of the plan are changed. The rest stays stable.',
    technicalLabel: 'Minimal Re-planning Engine',
    icon: <RefreshCw size={18} color="#78D6A3" />,
    previewData: [
      { label: 'Tasks Reassigned', value: '2 Tasks (D2 Bridges)' },
      { label: 'Plan Disruption', value: 'Minimal (22%)' },
    ],
  },
  {
    step: 6,
    title: 'HUMAN DECISION',
    headline: 'MissionMind asks you when needed',
    example: 'Mission confidence is too low to continue alone.\nRecommended action: Send GroundBot to the rescue zone.',
    supporting: 'You stay in control when a decision needs human judgement.',
    technicalLabel: 'Human-in-the-Loop Autonomy',
    icon: <UserCheck size={18} color="#F0AE63" />,
    previewData: [
      { label: 'Autonomy State', value: 'Approval Required' },
      { label: 'Action Proposed', value: 'Deploy GroundBot 01' },
    ],
  },
  {
    step: 7,
    title: 'MISSION COMPLETE',
    headline: 'Mission complete',
    example: '3 survivors found · 4 robots deployed · All objectives achieved.',
    supporting: 'MissionMind completes the mission and records what happened.',
    technicalLabel: 'Telemetry & Blackbox Sealed',
    icon: <CheckCircle2 size={18} color="#78D6A3" />,
    previewData: [
      { label: 'Survivors', value: 'Secured' },
      { label: 'Deadline', value: 'Preserved' },
    ],
  },
];

interface HowItWorksSectionProps {
  onTryMission?: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onTryMission }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;
  const isStacked = windowWidth < 1024;

  const currentStep = STEPS[activeStepIndex];

  return (
    <section
      id="how-it-works"
      style={{
        padding: isMobile ? '60px 16px' : isTablet ? '72px 32px' : '90px 48px',
        maxWidth: '1360px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: isMobile ? '10px' : '11px',
          color: '#68706D',
          letterSpacing: '0.12em',
          marginBottom: '14px',
        }}
      >
        01. HOW MISSIONMIND WORKS
      </div>

      {/* Section Header */}
      <div style={{ marginBottom: isMobile ? '24px' : '36px' }}>
        <h2
          style={{
            fontSize: 'clamp(26px, 4.5vw, 36px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#F2F4F2',
            lineHeight: 1.2,
            marginBottom: '14px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          From goal to execution — in seven steps.
        </h2>
        <p
          style={{
            color: '#A7ADAB',
            fontSize: isMobile ? '13px' : '15px',
            lineHeight: 1.6,
            maxWidth: '680px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          See how MissionMind takes one plain-English goal, plans tasks across multiple robots, adapts when things go wrong, and brings you in only when human judgement is needed.
        </p>
      </div>

      {/* Interactive 7 Steps Stepper Strip (Responsive horizontal scroll / wrap on phone) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(auto-fill, minmax(130px, 1fr))' : 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '24px',
        }}
      >
        {STEPS.map((s, idx) => {
          const isActive = idx === activeStepIndex;
          return (
            <button
              key={s.step}
              onClick={() => {
                playUiTick();
                setActiveStepIndex(idx);
              }}
              style={{
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isActive ? '#78D6A3' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '6px',
                padding: isMobile ? '10px 8px' : '12px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '10px',
                    color: isActive ? '#78D6A3' : '#68706D',
                    fontWeight: 600,
                  }}
                >
                  0{s.step}
                </span>
                <span style={{ opacity: isActive ? 1 : 0.4 }}>{s.icon}</span>
              </div>
              <div
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '11px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#F2F4F2' : '#8D9693',
                  lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {s.headline}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Focus Card for Active Step (Responsive 1-col on mobile, 2-col on desktop) */}
      <div
        style={{
          background: '#080A0B',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '8px',
          padding: isMobile ? '20px 16px' : '36px',
          display: isStacked ? 'flex' : 'grid',
          flexDirection: isStacked ? 'column' : undefined,
          gridTemplateColumns: isStacked ? undefined : '1.2fr 1fr',
          gap: isMobile ? '24px' : '40px',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Left Side: Story Details */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#78D6A3',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              padding: '3px 8px',
              background: 'rgba(120, 214, 163, 0.1)',
              borderRadius: '3px',
              border: '1px solid rgba(120, 214, 163, 0.25)',
            }}
          >
            <span>STEP 0{currentStep.step}</span>
            <span>·</span>
            <span>{currentStep.title}</span>
          </div>

          <h3
            style={{
              fontSize: isMobile ? '20px' : '26px',
              fontWeight: 500,
              color: '#F2F4F2',
              marginBottom: '12px',
              letterSpacing: '-0.02em',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {currentStep.headline}
          </h3>

          <p
            style={{
              fontSize: isMobile ? '13px' : '14px',
              color: '#A7ADAB',
              lineHeight: 1.6,
              marginBottom: '20px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {currentStep.supporting}
          </p>

          {/* Example callout box */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '6px',
              padding: '14px 16px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: isMobile ? '11px' : '12px',
              color: '#F2F4F2',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
              marginBottom: '20px',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '4px' }}>
              EXAMPLE IN ACTION
            </div>
            {currentStep.example}
          </div>

          {currentStep.technicalLabel && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#68706D', fontFamily: '"JetBrains Mono", monospace' }}>
              <ShieldCheck size={13} color="#78D6A3" />
              <span>Technical core: {currentStep.technicalLabel}</span>
            </div>
          )}
        </div>

        {/* Right Side: Step Interactive Telemetry Preview */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: isMobile ? '16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '10px' }}>
            <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', color: '#8D9693' }}>
              STEP {currentStep.step} / 07 TELEMETRY
            </span>
            <span style={{ fontSize: '10px', color: '#78D6A3', fontFamily: '"JetBrains Mono", monospace' }}>
              ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {currentStep.previewData?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: isMobile ? '11px' : '12px',
                }}
              >
                <span style={{ color: '#68706D' }}>{item.label}</span>
                <span style={{ color: '#F2F4F2', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {onTryMission && (
            <button
              onClick={onTryMission}
              style={{
                marginTop: '10px',
                background: '#F2F4F2',
                color: '#050607',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 14px',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Try Live in Mission Control</span>
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
