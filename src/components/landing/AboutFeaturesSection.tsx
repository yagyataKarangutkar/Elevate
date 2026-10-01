import React, { useState, useEffect } from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { Network, ShieldCheck, GitFork, Compass } from 'lucide-react';

export const AboutFeaturesSection: React.FC = () => {
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
        02. ABOUT MISSIONMIND
      </div>

      <div
        style={{
          display: isStacked ? 'flex' : 'grid',
          flexDirection: isStacked ? 'column' : undefined,
          gridTemplateColumns: isStacked ? undefined : '1.2fr 1fr',
          gap: isMobile ? '28px' : '48px',
          alignItems: 'center',
        }}
      >
        {/* Left Side: Editorial & 4 Cards */}
        <div style={{ width: '100%' }}>
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
            One goal. Four robots. One coordinated mission.
          </h2>

          <p
            style={{
              color: '#A7ADAB',
              fontSize: isMobile ? '13px' : '15px',
              lineHeight: 1.6,
              maxWidth: '520px',
              marginBottom: isMobile ? '24px' : '36px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            MissionMind turns a simple rescue objective into a coordinated plan, then keeps adapting when the situation changes.
          </p>

          {/* 4 Feature Capability Cards per Spec Section 10 */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '14px',
            }}
          >
            {capabilities.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: isMobile ? '16px 14px' : '20px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      background: 'rgba(120, 214, 163, 0.1)',
                      border: '1px solid rgba(120, 214, 163, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '9.5px',
                      fontFamily: '"JetBrains Mono", monospace',
                      color: '#68706D',
                    }}
                  >
                    0{idx + 1}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: isMobile ? '14px' : '15px',
                    fontWeight: 600,
                    color: '#F2F4F2',
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {item.title}
                </div>

                <div
                  style={{
                    fontSize: isMobile ? '12px' : '12.5px',
                    color: '#8D9693',
                    lineHeight: 1.5,
                    fontFamily: '"Inter", sans-serif',
                  }}
                >
                  {item.desc}
                </div>

                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '10px',
                    fontFamily: '"JetBrains Mono", monospace',
                    color: '#78D6A3',
                    background: 'rgba(120, 214, 163, 0.08)',
                    padding: '2px 6px',
                    borderRadius: '3px',
                    width: 'fit-content',
                  }}
                >
                  {item.techLabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: 3D Swarm Model Display (Spec §23: ALWAYS visible on mobile!) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '340px' : isTablet ? '420px' : '520px',
            minHeight: isMobile ? '320px' : '460px',
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          <SwarmCanvas mode="hero" interactive={true} />
        </div>
      </div>
    </section>
  );
};
