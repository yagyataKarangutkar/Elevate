import { useState, useEffect } from 'react';
import { ArrowRight, Volume2, VolumeX, Menu, X } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileNav = windowWidth < 768;

  const handleAudioToggle = () => {
    const current = toggleAudio();
    setAudioActive(current);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
    { id: 'mission-creation', label: 'Live Demo' },
  ];

  const handleMobileNavClick = (sectionId: string) => {
    playUiTick();
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '64px',
          background: 'rgba(5, 6, 7, 0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobileNav ? '0 16px' : '0 48px',
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

        {/* Center Desktop Nav Links */}
        {!isMobileNav && (
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
        )}

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

          {/* Desktop Enter Mission Control CTA */}
          {!isMobileNav && (
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
                gap: '6px',
                backdropFilter: 'blur(6px)',
                transition: 'all 0.2s ease',
              }}
            >
              <span>Try a Mission</span>
              <ArrowRight size={12} />
            </button>
          )}

          {/* Mobile Hamburger Button (Spec §9) */}
          {isMobileNav && (
            <button
              onClick={() => {
                playUiTick();
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              aria-label="Toggle Navigation Menu"
              style={{
                background: mobileMenuOpen ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: '#F2F4F2',
                padding: '6px 8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Drawer Menu (Spec §9 & §10) */}
      {isMobileNav && mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 6, 7, 0.98)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            zIndex: 49,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                fontSize: '10px',
                color: '#68706D',
                fontFamily: '"JetBrains Mono", monospace',
                letterSpacing: '0.1em',
                marginBottom: '4px',
              }}
            >
              NAVIGATION
            </div>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleMobileNavClick(link.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  color: '#F2F4F2',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>{link.label}</span>
                <ArrowRight size={13} color="#68706D" />
              </button>
            ))}
          </div>

          <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => {
                playSuccessChirp();
                setMobileMenuOpen(false);
                onEnterMissionControl();
              }}
              style={{
                width: '100%',
                background: '#F2F4F2',
                color: '#050607',
                border: 'none',
                borderRadius: '6px',
                padding: '14px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <span>TRY A MISSION →</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
