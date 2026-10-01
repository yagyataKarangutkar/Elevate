import React from 'react';
import { Activity } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 14px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        maxWidth: 'fit-content',
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '11px',
        color: '#78D6A3',
      }}
    >
      <Activity size={12} className="animate-spin" />
      <span>MissionMind is checking the mission...</span>
    </div>
  );
};
