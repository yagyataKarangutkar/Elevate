import { useState } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { toggleAudio, playUiTick, playSuccessChirp } from '../../utils/audio';

interface PublicNavbarProps {
  onEnterMissionControl: () => void;
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({
  onEnterMissionControl,
  activeSection: _activeSection = 'home',
  onNavigate,
}) => {
  const [audioActive, setAudioActive] = useState<boolean>(true);

  const handleAudioToggle = () => {
    const current = toggleAudio();
    setAudioActive(current);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'Features' },
    { id: 'blueprints', label: 'Blueprints' },
    { id: 'mission-creation', label: 'Mission Flow' },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        background: 'rgba(5, 6, 7, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
      }}
    >
      {/* Left: Logo Mark */}
      <div
        onClick={() => onNavigate('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '1.5px solid #ffffff',
            transform: 'rotate(45deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: '4px', height: '4px', background: '#ffffff' }} />
        </div>
        <span
          style={{
            fontWeight: 600,
            fontSize: '15px',
            letterSpacing: '-0.01em',
            color: '#F2F4F2',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          MissionMind
        </span>
      </div>

      {/* Center Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        {navLinks.map((link, idx) => (
          <button
            key={idx}
            onClick={() => {
              playUiTick();
              onNavigate(link.id);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A7ADAB',
              fontSize: '13px',
              fontFamily: '"Inter", sans-serif',
              cursor: 'pointer',
              padding: '6px 0',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F2F4F2';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A7ADAB';
            }}
          >
            {link.label}
          </button>
        ))}
      </nav>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Audio Toggle */}
        <button
          onClick={handleAudioToggle}
          title={audioActive ? 'Sound Effects Enabled' : 'Sound Effects Muted'}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.14)',
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

        {/* Enter Mission Control CTA */}
        <button
          onClick={() => {
            playSuccessChirp();
            onEnterMissionControl();
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.28)',
            color: '#F2F4F2',
            padding: '8px 16px',
            borderRadius: '4px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.2s ease',
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
          <span>Enter Mission Control</span>
          <ArrowRight size={13} />
        </button>
      </div>
    </header>
  );
};
