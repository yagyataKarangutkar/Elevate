import { useState, useEffect } from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { ArrowRight } from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';

interface LandingHeroProps {
  onEnterMissionControl: () => void;
  onExplorePlan: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onEnterMissionControl,
  onExplorePlan,
}) => {
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

  return (
    <section
      style={{
        position: 'relative',
        minHeight: isStacked ? 'auto' : 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: isMobile ? '20px 16px' : isTablet ? '24px 32px' : '24px 48px',
        overflow: 'hidden',
      }}
    >
      {/* Main Split / Stack Layout */}
      <div
        style={{
          display: isStacked ? 'flex' : 'grid',
          flexDirection: isStacked ? 'column' : undefined,
          gridTemplateColumns: isStacked ? undefined : 'minmax(380px, 460px) 1fr',
          gap: isMobile ? '20px' : '32px',
          alignItems: 'center',
          flex: 1,
          minHeight: isStacked ? 'auto' : '560px',
          position: 'relative',
        }}
      >
        {/* Text & CTA Zone */}
        <div
          style={{
            zIndex: 10,
            maxWidth: isStacked ? '100%' : '460px',
            pointerEvents: 'auto',
            width: '100%',
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
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78D6A3' }} />
            <span>AI AUTONOMOUS SWARM COMMAND PLATFORM</span>
          </div>

          {/* Hero Title per Spec Section 6 & 8 */}
          <h1
            style={{
              fontSize: 'clamp(28px, 5.5vw, 44px)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#F2F4F2',
              marginBottom: '14px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Give the swarm a goal.
            <br />
            <span style={{ color: '#A7ADAB', fontWeight: 300 }}>
              MissionMind figures out what to do next.
            </span>
          </h1>

          {/* Supporting description per Spec Section 6 */}
          <p
            style={{
              color: '#8D9693',
              fontSize: isMobile ? '13px' : '14px',
              lineHeight: 1.6,
              marginBottom: isMobile ? '20px' : '28px',
              maxWidth: '460px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            MissionMind coordinates 3 drones and 1 GroundBot to search, adapt and rescue — without needing you to control every robot.
          </p>

          {/* CTA Buttons (Touch target min 44px per Spec §25 & §46) */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <button
              onClick={() => {
                playSuccessChirp();
                onEnterMissionControl();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#F2F4F2',
                padding: '12px 24px',
                minHeight: '44px',
                borderRadius: '6px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                letterSpacing: '0.04em',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s ease',
                flex: isMobile ? '1 1 160px' : 'none',
              }}
            >
              <span>Try a Mission</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                playUiTick();
                onExplorePlan();
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#A7ADAB',
                padding: '12px 18px',
                minHeight: '44px',
                borderRadius: '6px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                flex: isMobile ? '1 1 140px' : 'none',
              }}
            >
              <span>See How It Works ↓</span>
            </button>
          </div>
        </div>

        {/* Right / Center 3D Swarm Model Container (Spec §11–§14: ALWAYS rendered on phone!) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: isMobile ? '380px' : isTablet ? '460px' : '100%',
            minHeight: isMobile ? '360px' : '520px',
            overflow: 'hidden',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.01)',
          }}
        >
          <SwarmCanvas mode="hero" interactive={true} />
        </div>
      </div>

      {/* Bottom Telemetry Strip per Spec Section 7 & 22 */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '16px',
          marginTop: isStacked ? '20px' : '0',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: isMobile ? '12px' : '13px',
            fontWeight: 500,
            color: '#F2F4F2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78D6A3' }} />
          <span>4 robots ready to work together</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: isMobile ? '12px' : '24px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: isMobile ? '10px' : '11px',
            color: '#68706D',
            letterSpacing: '0.06em',
          }}
        >
          <div>
            <strong style={{ color: '#F2F4F2', fontWeight: 600 }}>4</strong> AGENTS
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</div>
          <div>
            <strong style={{ color: '#78D6A3', fontWeight: 600 }}>3</strong> ACTIVE
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</div>
          <div>
            <strong style={{ color: '#A7ADAB', fontWeight: 600 }}>1</strong> STANDBY
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.15)' }}>|</div>
          <div style={{ color: '#78D6A3', fontWeight: 600 }}>
            MISSION READY
          </div>
        </div>
      </div>
    </section>
  );
};
