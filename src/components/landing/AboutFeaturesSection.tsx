import React from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { Network, ShieldCheck, GitFork, Compass } from 'lucide-react';
import { playUiTick } from '../../utils/audio';

export const AboutFeaturesSection: React.FC = () => {
  const capabilities = [
    {
      icon: <Network size={16} color="#A7ADAB" />,
      title: 'Multi-Agent Coordination',
      desc: 'Drones, ground robots and relay units work together as a single team.',
    },
    {
      icon: <ShieldCheck size={16} color="#A7ADAB" />,
      title: 'Confidence-Based Autonomy',
      desc: 'Acts independently when confident; escalates to a human when needed.',
    },
    {
      icon: <GitFork size={16} color="#A7ADAB" />,
      title: 'Adaptive Planning',
      desc: 'Replans in real-time when the environment changes or agents fail.',
    },
    {
      icon: <Compass size={16} color="#A7ADAB" />,
      title: 'Mission-Driven Intelligence',
      desc: 'Focuses on outcomes, not individual agent control.',
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
        02. ABOUT
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
            Built for real-world complexity.
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
            MissionMind combines AI planning, heterogeneous agents and adaptive replanning to keep your mission on track — even when the environment changes.
          </p>

          {/* 4 Feature Capability Cards */}
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
                <div style={{ marginBottom: '10px' }}>{cap.icon}</div>
                <div
                  style={{
                    fontSize: '13px',
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
