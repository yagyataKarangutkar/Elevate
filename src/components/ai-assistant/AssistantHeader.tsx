import React from 'react';
import { Sparkles, X } from 'lucide-react';

interface AssistantHeaderProps {
  onClose: () => void;
}

export const AssistantHeader: React.FC<AssistantHeaderProps> = ({ onClose }) => {
  return (
    <div
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(8, 10, 11, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'rgba(120, 214, 163, 0.15)',
            border: '1px solid rgba(120, 214, 163, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Sparkles size={15} color="#78D6A3" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '13px',
                fontWeight: 700,
                color: '#F2F4F2',
                letterSpacing: '0.04em',
              }}
            >
              MissionMind AI
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '9px',
                color: '#78D6A3',
                background: 'rgba(120, 214, 163, 0.1)',
                padding: '1px 6px',
                borderRadius: '3px',
                border: '1px solid rgba(120, 214, 163, 0.25)',
              }}
            >
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: '#78D6A3',
                  boxShadow: '0 0 6px #78D6A3',
                }}
              />
              LIVE CONTEXT
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#8D9693', fontFamily: '"Inter", sans-serif', marginTop: '2px' }}>
            Your mission, explained.
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        aria-label="Close Assistant"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '4px',
          color: '#A7ADAB',
          padding: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
};
