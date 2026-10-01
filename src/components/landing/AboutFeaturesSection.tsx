import React from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { Network, ShieldCheck, GitFork, Compass } from 'lucide-react';
import { playUiTick } from '../../utils/audio';

export const AboutFeaturesSection: React.FC = () => {
  const capabilities = [
    {
      icon: <Compass size={16} color="#78D6A3" />,
      title: 'Give one goal',
      desc: 'Tell MissionMind what you want to achieve. You do not need to control every robot yourself.',
      techLabel: 'Mission-driven control',
    },
    {
      icon: <Network size={16} color="#78D6A3" />,
      title: 'Let the AI make the plan',
      desc: 'MissionMind breaks your goal into smaller tasks and gives each task to the robot that fits it best.',
      techLabel: 'Task allocation',
    },
    {
      icon: <GitFork size={16} color="#78D6A3" />,
      title: 'Watch the swarm adapt',
      desc: 'When a route is blocked, a robot fails or communication drops, MissionMind changes the plan instead of starting over.',
      techLabel: 'Adaptive replanning',
    },
    {
      icon: <ShieldCheck size={16} color="#78D6A3" />,
      title: 'Step in only when needed',
      desc: 'MissionMind works on its own when it is confident. If the situation becomes uncertain, it asks you before continuing.',
      techLabel: 'Human-in-the-loop autonomy',
    },
  ];

  return (
    <section
      id="about"
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
        }}
      >
        02. ABOUT MISSIONMIND
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Editorial & 4 Cards */}
        <div>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F2F4F2',
              lineHeight: 1.2,
              marginBottom: '16px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            One goal. Four robots. One coordinated mission.
          </h2>

          <p
            style={{
              color: '#A7ADAB',
              fontSize: '15px',
              lineHeight: 1.65,
              maxWidth: '520px',
              marginBottom: '36px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            MissionMind turns a simple rescue objective into a coordinated plan, then keeps adapting when the situation changes.
          </p>

          {/* 4 Feature Capability Cards per Spec Section 10 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                onMouseEnter={() => playUiTick()}
                style={{
                  background: '#080A0B',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  padding: '18px',
                  transition: 'all 0.25s ease',
                  cursor: 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = '#080A0B';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>{cap.icon}</div>
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '9px',
                        color: '#68706D',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {cap.techLabel}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#F2F4F2',
                      marginBottom: '6px',
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {cap.title}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#8D9693',
                      lineHeight: 1.5,
                      fontFamily: '"Inter", sans-serif',
                    }}
                  >
                    {cap.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Drone Wireframe Showcase with Tags */}
        <div
          style={{
            position: 'relative',
            height: '420px',
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <SwarmCanvas mode="inspector" interactive={true} />

          {/* Technical feature badges matching top-right screenshot */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
              color: '#68706D',
              pointerEvents: 'none',
              textAlign: 'right',
            }}
          >
            <div>DRONES</div>
            <div>GROUND ROBOTS</div>
            <div>RELAY NODES</div>
            <div style={{ color: '#78D6A3' }}>REAL-TIME SYNC</div>
          </div>
        </div>
      </div>
    </section>
  );
};
