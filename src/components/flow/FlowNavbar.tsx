import { useState } from 'react';
import { Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { toggleAudio, playUiTick } from '../../utils/audio';
import type { FlowStep } from '../../types';

interface FlowNavbarProps {
  currentStep: FlowStep;
  onNavigate: (step: FlowStep) => void;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

const STAGES: { key: FlowStep; label: string; stepNum: string }[] = [
  { key: 'landing', label: 'LANDING', stepNum: '01' },
  { key: 'mission_input', label: 'INPUT', stepNum: '02' },
  { key: 'plan_generation', label: 'PLANNING', stepNum: '03' },
  { key: 'mission_plan', label: 'PLAN', stepNum: '04' },
  { key: 'command_center', label: 'COMMAND', stepNum: '05' },
  { key: 'mission_recovery', label: 'RECOVERY', stepNum: '06' },
  { key: 'mission_complete', label: 'COMPLETE', stepNum: '07' },
  { key: 'results', label: 'RESULTS', stepNum: '08' },
];

export const FlowNavbar: React.FC<FlowNavbarProps> = ({
  currentStep,
  onNavigate,
  title,
  showBack = true,
  onBack,
}) => {
  const [audioActive, setAudioActive] = useState<boolean>(true);

  const handleAudioToggle = () => {
    const current = toggleAudio();
    setAudioActive(current);
  };

  const currentIndex = STAGES.findIndex((s) => s.key === currentStep);

  return (
    <header
      style={{
        height: '52px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: '#080A0B',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left: Brand + Back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {showBack && (
          <button
            onClick={() => {
              playUiTick();
              if (onBack) {
                onBack();
              } else {
                onNavigate('landing');
              }
            }}
            title="Return to Landing"
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#A7ADAB',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontFamily: '"JetBrains Mono", monospace',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#F2F4F2';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#A7ADAB';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <ArrowLeft size={12} />
            <span>EXIT</span>
          </button>
        )}

        <div
          onClick={() => {
            playUiTick();
            onNavigate('landing');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '13px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              border: '1.5px solid #ffffff',
              transform: 'rotate(45deg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '4px', height: '4px', background: '#ffffff' }} />
          </div>
          <span style={{ color: '#F2F4F2' }}>MissionMind</span>
        </div>

        {title && (
          <>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255, 255, 255, 0.12)' }} />
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#68706D',
                letterSpacing: '0.04em',
              }}
            >
              {title}
            </span>
          </>
        )}
      </div>

      {/* Center: Stage Progression Breadcrumbs */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
        }}
      >
        {STAGES.map((stage, idx) => {
          const isActive = stage.key === currentStep;
          const isPassed = idx < currentIndex;

          return (
            <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  playUiTick();
                  onNavigate(stage.key);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 6px',
                  borderRadius: '3px',
                  color: isActive
                    ? '#F2F4F2'
                    : isPassed
                    ? '#78D6A3'
                    : '#454C4A',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#A7ADAB';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = isPassed ? '#78D6A3' : '#454C4A';
                  }
                }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6 }}>{stage.stepNum}</span>
                <span>{stage.label}</span>
              </button>
              {idx < STAGES.length - 1 && (
                <span style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '9px' }}>→</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
      </div>
    </header>
  );
};
