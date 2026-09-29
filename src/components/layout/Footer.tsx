export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: '#050607',
        padding: '48px 48px 32px',
        color: '#A7ADAB',
        fontSize: '12px',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '32px',
          marginBottom: '32px',
        }}
      >
        {/* Left: Brand & Motto */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#F2F4F2',
              fontWeight: 600,
              fontSize: '14px',
              marginBottom: '10px',
            }}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '1.2px solid #ffffff',
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '3px', height: '3px', background: '#ffffff' }} />
            </div>
            <span>MissionMind</span>
          </div>
          <p
            style={{
              margin: 0,
              color: '#68706D',
              maxWidth: '340px',
              lineHeight: 1.6,
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
            }}
          >
            Autonomy when confident.
            <br />
            Human control when necessary.
          </p>
        </div>

        {/* Center: Navigation links */}
        <div style={{ display: 'flex', gap: '48px' }}>
          <div>
            <div
              style={{
                color: '#F2F4F2',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              PLATFORM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <a href="#home" style={{ color: '#8D9693', textDecoration: 'none' }}>Overview</a>
              <a href="#about" style={{ color: '#8D9693', textDecoration: 'none' }}>Multi-Agent Mesh</a>
              <a href="#mission-creation" style={{ color: '#8D9693', textDecoration: 'none' }}>Task Planner</a>
              <a href="#about" style={{ color: '#8D9693', textDecoration: 'none' }}>Supervision Engine</a>
            </div>
          </div>

          <div>
            <div
              style={{
                color: '#F2F4F2',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              SYSTEM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#8D9693' }}>Heterogeneous Swarm</span>
              <span style={{ color: '#8D9693' }}>Contour Terrain twin</span>
              <span style={{ color: '#8D9693' }}>Telemetric Logs</span>
              <span style={{ color: '#8D9693' }}>API & Docs</span>
            </div>
          </div>
        </div>

        {/* Right: Technical Coordinates & Abstract Wave */}
        <div
          style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
            color: '#68706D',
            textAlign: 'right',
            lineHeight: 1.6,
          }}
        >
          <div>SYS ID: MM-SWARM-2026-X</div>
          <div>SIMULATION ENGINE: DETERMINISTIC v4.2</div>
          <div style={{ color: '#78D6A3', marginTop: '4px' }}>● 100% OPERATIONAL INTEGRITY</div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          color: '#454C4A',
        }}
      >
        <div>© 2026 MissionMind. All rights reserved.</div>
        <div>SECURE PROTOCOL // AUTONOMOUS SWARM COMMAND</div>
      </div>
    </footer>
  );
};
