import { useState } from 'react';
import { FlowNavbar } from './FlowNavbar';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Battery,
  AlertTriangle,
  Radio,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import type { FlowStep } from '../../types';

interface MissionRecoveryViewProps {
  onNavigate: (step: FlowStep) => void;
  onProceedToComplete: () => void;
}

export const MissionRecoveryView: React.FC<MissionRecoveryViewProps> = ({
  onNavigate,
  onProceedToComplete,
}) => {
  const [activeStep, setActiveStep] = useState<number>(4);

  const recoverySteps = [
    {
      step: 1,
      title: 'Detected the change',
      time: '0.4 seconds',
      desc: 'Telemetry heartbeat lost from Drone 03 in Sector C. Threat level evaluated immediately.',
      done: true,
    },
    {
      step: 2,
      title: 'Checked the current plan',
      time: '0.2 seconds',
      desc: 'Drone 03 cannot complete its 2 assigned search tasks in Sector C. Tasks flagged for re-routing.',
      done: true,
    },
    {
      step: 3,
      title: 'Found smallest safe change',
      time: '0.5 seconds',
      desc: 'Drone 02 is nearby with 81% battery to take over Sector C. GroundBot 01 continues to the rescue zone uninterrupted.',
      done: true,
    },
    {
      step: 4,
      title: 'New plan ready',
      time: 'Immediate',
      desc: 'Safe reassignment verified against speed, terrain, and battery reserves. Swarm continues seamlessly.',
      done: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050607',
        color: '#F2F4F2',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FlowNavbar
        currentStep="mission_recovery"
        onNavigate={onNavigate}
        title="06. MISSION RECOVERY"
      />

      <main
        style={{
          flex: 1,
          maxWidth: '1000px',
          width: '100%',
          margin: '0 auto',
          padding: '40px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Header - Spec Section 25: Plain English headline */}
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#F0AE63',
              letterSpacing: '0.12em',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <AlertTriangle size={13} color="#F0AE63" />
            <span>STAGE 06 · AUTONOMOUS ADAPTATION</span>
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              marginBottom: '10px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Something changed. Here is what MissionMind is doing.
          </h1>

          {/* What happened alert banner */}
          <div
            style={{
              background: 'rgba(240, 174, 99, 0.1)',
              border: '1px solid rgba(240, 174, 99, 0.3)',
              borderRadius: '6px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Radio size={18} color="#F0AE63" />
              <div>
                <span style={{ fontSize: '11px', color: '#F0AE63', fontFamily: '"JetBrains Mono", monospace', fontWeight: 600, display: 'block' }}>
                  WHAT HAPPENED?
                </span>
                <span style={{ fontSize: '14px', color: '#F2F4F2', fontWeight: 500 }}>
                  Drone 03 lost communication with the swarm in Sector C.
                </span>
              </div>
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                background: 'rgba(240, 174, 99, 0.2)',
                color: '#F0AE63',
                padding: '4px 8px',
                borderRadius: '4px',
              }}
            >
              RESOLVED IN 1.1s
            </span>
          </div>
        </div>

        {/* 4-Step Visual - Spec Section 25 */}
        <div
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#78D6A3',
              letterSpacing: '0.08em',
              fontWeight: 600,
            }}
          >
            WHAT MISSIONMIND DID (4-STEP RECOVERY)
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '12px',
            }}
          >
            {recoverySteps.map((s) => {
              const isSelected = activeStep === s.step;
              return (
                <div
                  key={s.step}
                  onClick={() => {
                    playUiTick();
                    setActiveStep(s.step);
                  }}
                  style={{
                    background: isSelected ? 'rgba(120, 214, 163, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: isSelected ? '1px solid #78D6A3' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '10px',
                        color: isSelected ? '#78D6A3' : '#68706D',
                        fontWeight: 700,
                      }}
                    >
                      STEP {s.step}
                    </span>
                    <CheckCircle2 size={13} color="#78D6A3" />
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#F2F4F2', fontFamily: '"Inter", sans-serif' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#78D6A3', fontFamily: '"JetBrains Mono", monospace' }}>
                    {s.time}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#A7ADAB', lineHeight: 1.45, fontFamily: '"Inter", sans-serif' }}>
                    {s.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Change Visual - Spec Section 26: Crucial for the story */}
        <div
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#F2F4F2',
                letterSpacing: '0.08em',
                fontWeight: 600,
              }}
            >
              ROBOT TASK ALLOCATION BEFORE & AFTER
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#78D6A3',
                background: 'rgba(120, 214, 163, 0.1)',
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid rgba(120, 214, 163, 0.25)',
              }}
            >
              MINIMAL DISRUPTION PRINCIPLE
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Drone 01 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                padding: '12px 18px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
              }}
            >
              <div style={{ color: '#F2F4F2' }}>
                <span style={{ fontWeight: 700, color: '#78D6A3' }}>Drone 01: </span>
                <span style={{ color: '#A7ADAB' }}>Searching Sector A</span>
              </div>
              <ChevronRight size={14} color="#68706D" />
              <div style={{ color: '#78D6A3', fontWeight: 600 }}>
                Unchanged <span style={{ fontSize: '10px', color: '#68706D', fontWeight: 400 }}>(still on track)</span>
              </div>
            </div>

            {/* Drone 02 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(120, 214, 163, 0.06)',
                border: '1px solid rgba(120, 214, 163, 0.3)',
                borderRadius: '6px',
                padding: '12px 18px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
              }}
            >
              <div style={{ color: '#F2F4F2' }}>
                <span style={{ fontWeight: 700, color: '#78D6A3' }}>Drone 02: </span>
                <span style={{ color: '#A7ADAB' }}>Searching Sector B</span>
              </div>
              <ChevronRight size={14} color="#78D6A3" />
              <div style={{ color: '#78D6A3', fontWeight: 700 }}>
                NOW SEARCHING SECTOR B + C <span style={{ fontSize: '10px', color: '#F0AE63', fontWeight: 400 }}>(expanded coverage)</span>
              </div>
            </div>

            {/* Drone 03 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(242, 93, 93, 0.06)',
                border: '1px solid rgba(242, 93, 93, 0.25)',
                borderRadius: '6px',
                padding: '12px 18px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
              }}
            >
              <div style={{ color: '#F2F4F2' }}>
                <span style={{ fontWeight: 700, color: '#F25D5D' }}>Drone 03: </span>
                <span style={{ color: '#A7ADAB' }}>Communication lost</span>
              </div>
              <ChevronRight size={14} color="#F25D5D" />
              <div style={{ color: '#F25D5D', fontWeight: 600 }}>
                OFFLINE <span style={{ fontSize: '10px', color: '#68706D', fontWeight: 400 }}>(tasks reassigned safely)</span>
              </div>
            </div>

            {/* GroundBot 01 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                gap: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '6px',
                padding: '12px 18px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
              }}
            >
              <div style={{ color: '#F2F4F2' }}>
                <span style={{ fontWeight: 700, color: '#78D6A3' }}>GroundBot 01: </span>
                <span style={{ color: '#A7ADAB' }}>Rescuing survivor in Sector A</span>
              </div>
              <ChevronRight size={14} color="#68706D" />
              <div style={{ color: '#78D6A3', fontWeight: 600 }}>
                Unchanged <span style={{ fontSize: '10px', color: '#68706D', fontWeight: 400 }}>(continues extraction)</span>
              </div>
            </div>
          </div>

          {/* Minimal Change Banner - Verbatim from Spec Section 26 */}
          <div
            style={{
              background: 'rgba(120, 214, 163, 0.08)',
              border: '1px solid rgba(120, 214, 163, 0.3)',
              borderRadius: '6px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={16} color="#78D6A3" />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#78D6A3', letterSpacing: '0.04em' }}>
                  2 of 9 tasks changed · 7 of 9 tasks stayed the same
                </span>
                <span style={{ fontSize: '11px', color: '#A7ADAB', display: 'block', marginTop: '2px', fontFamily: '"Inter", sans-serif' }}>
                  MissionMind only changes what it has to. The rest of the swarm keeps working.
                </span>
              </div>
            </div>
            <span style={{ fontSize: '11px', color: '#78D6A3', fontWeight: 600 }}>
              78% PLAN STABILITY
            </span>
          </div>
        </div>

        {/* Recovery Status Cards - Spec Section 27 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}
        >
          {/* Feasibility */}
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
              FEASIBILITY
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78D6A3', fontSize: '13px', fontWeight: 700 }}>
              <CheckCircle2 size={15} />
              <span>Mission can still be completed</span>
            </div>
          </div>

          {/* Time impact */}
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
              TIME IMPACT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F2F4F2', fontSize: '13px', fontWeight: 600 }}>
              <Clock size={15} color="#A7ADAB" />
              <span>+2 minutes to completion</span>
            </div>
          </div>

          {/* Battery impact */}
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
              BATTERY IMPACT
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78D6A3', fontSize: '12px', fontWeight: 600 }}>
              <Battery size={15} />
              <span>All robots return safely</span>
            </div>
          </div>

          {/* Decision needed */}
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
              DECISION NEEDED
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78D6A3', fontSize: '11px', fontWeight: 600 }}>
              <ShieldCheck size={15} />
              <span>Within safe limits (No human action needed)</span>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '20px',
          }}
        >
          <button
            onClick={() => {
              playUiTick();
              onNavigate('command_center');
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#A7ADAB',
              padding: '10px 18px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Command Center</span>
          </button>

          <button
            onClick={() => {
              playSuccessChirp();
              onProceedToComplete();
            }}
            style={{
              background: '#F2F4F2',
              color: '#050607',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 24px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Proceed to Mission Complete</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};
