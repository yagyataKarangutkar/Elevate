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
  return (
    <section
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 48px',
        overflow: 'hidden',
      }}
    >
      {/* Main Split Grid: Left Text Zone & Right 3D Swarm Model Zone */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(420px, 460px) 1fr',
          gap: '24px',
          alignItems: 'center',
          flex: 1,
          minHeight: '580px',
          position: 'relative',
        }}
      >
        {/* Left Column: Text & CTA (Completely separated, no overlap) */}
        <div
          style={{
            zIndex: 10,
            maxWidth: '460px',
            pointerEvents: 'auto',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#68706D',
              letterSpacing: '0.12em',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78D6A3' }} />
            <span>AI AUTONOMOUS SWARM COMMAND PLATFORM</span>
          </div>

          {/* Hero Title per Spec Section 6 */}
          <h1
            style={{
              fontSize: '42px',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#F2F4F2',
              marginBottom: '16px',
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
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '32px',
              maxWidth: '440px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            MissionMind coordinates 3 drones and 1 GroundBot to search, adapt and rescue — without needing you to control every robot.
          </p>

          {/* CTA Buttons per Spec Section 6 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => {
                playSuccessChirp();
                onEnterMissionControl();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                color: '#F2F4F2',
                padding: '12px 24px',
                borderRadius: '6px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                letterSpacing: '0.04em',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
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
                border: 'none',
                color: '#A7ADAB',
                padding: '12px 16px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ADAB')}
            >
              <span>See How It Works ↓</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Swarm Digital Twin Model Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '580px',
            overflow: 'hidden',
          }}
        >
          <SwarmCanvas mode="hero" interactive={true} />
        </div>
      </div>

      {/* Bottom Telemetry Strip per Spec Section 7 */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: '13px',
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
            gap: '28px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            color: '#68706D',
            letterSpacing: '0.08em',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#78D6A3' }} />
            <span style={{ color: '#F2F4F2' }}>MISSION READY</span>
          </div>
        </div>
      </div>
    </section>
  );
};
