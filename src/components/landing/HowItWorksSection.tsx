import React, { useState } from 'react';
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
  const currentStep = STEPS[activeStepIndex];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '90px 48px',
        maxWidth: '1360px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: '#68706D',
          letterSpacing: '0.12em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78D6A3' }} />
        <span>HOW IT WORKS · THE 7-STEP MISSION JOURNEY</span>
      </div>

      {/* Section Header */}
      <div style={{ marginBottom: '40px' }}>
        <h2
          style={{
            fontSize: '36px',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#F2F4F2',
            lineHeight: 1.2,
            marginBottom: '12px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          One objective. Continuous coordination. Adaptive recovery.
        </h2>
        <p
          style={{
            color: '#A7ADAB',
            fontSize: '15px',
            lineHeight: 1.6,
            maxWidth: '680px',
            margin: 0,
            fontFamily: '"Inter", sans-serif',
          }}
        >
          See how MissionMind takes one plain-English goal, plans tasks across multiple robots, adapts when things go wrong, and brings you in only when human judgement is needed.
        </p>
      </div>

      {/* Interactive 7 Steps Stepper Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '8px',
          marginBottom: '28px',
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
                padding: '12px 10px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
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

      {/* Main Focus Card for Active Step */}
      <div
        style={{
          background: '#080A0B',
          border: '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '8px',
          padding: '36px',
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '40px',
          alignItems: 'center',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Left Side: Step Narrative */}
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#78D6A3',
              letterSpacing: '0.1em',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>STEP 0{currentStep.step} OF 07</span>
            <span style={{ color: 'rgba(255, 255, 255, 0.2)' }}>•</span>
            <span style={{ color: '#A7ADAB' }}>{currentStep.title}</span>
          </div>

          <h3
            style={{
              fontSize: '28px',
              fontWeight: 400,
              color: '#F2F4F2',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: '14px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {currentStep.headline}
          </h3>

          <p
            style={{
              fontSize: '15px',
              color: '#A7ADAB',
              lineHeight: 1.6,
              marginBottom: '24px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {currentStep.supporting}
          </p>

          {/* Example Quote / Action Box */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '16px 20px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '13px',
              color: '#F2F4F2',
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              marginBottom: '20px',
            }}
          >
            {currentStep.example}
          </div>

          {currentStep.technicalLabel && (
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
                letterSpacing: '0.08em',
              }}
            >
              TECHNICAL SUB-LAYER: <span style={{ color: '#A7ADAB' }}>{currentStep.technicalLabel}</span>
            </div>
          )}
        </div>

        {/* Right Side: Visual Context & Telemetry Snapshot */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#A7ADAB',
                letterSpacing: '0.06em',
                fontWeight: 600,
              }}
            >
              STAGE VERIFICATION
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '10px',
                color: '#78D6A3',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <ShieldCheck size={12} />
              <span>ACTIVE FLOW</span>
            </span>
          </div>

          {/* Key metrics / preview items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentStep.previewData?.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '12px',
                  padding: '8px 10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '4px',
                }}
              >
                <span style={{ color: '#8D9693' }}>{item.label}</span>
                <span style={{ color: '#F2F4F2', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick CTA to try mission */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              onClick={() => {
                playUiTick();
                setActiveStepIndex((prev) => (prev + 1) % STEPS.length);
              }}
              style={{
                flex: 1,
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#F2F4F2',
                padding: '10px 14px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <span>Next Step ({activeStepIndex + 1}/7)</span>
              <ArrowRight size={12} />
            </button>

            {onTryMission && (
              <button
                onClick={onTryMission}
                style={{
                  background: '#F2F4F2',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#050607',
                  padding: '10px 16px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>Try a Mission →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
