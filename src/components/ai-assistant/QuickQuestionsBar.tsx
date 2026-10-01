import React from 'react';

interface QuickQuestionsBarProps {
  questions: string[];
  onSelect: (q: string) => void;
}

export const QuickQuestionsBar: React.FC<QuickQuestionsBarProps> = ({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div
      style={{
        padding: '12px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.01)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          color: '#68706D',
          fontFamily: '"JetBrains Mono", monospace',
          letterSpacing: '0.08em',
          marginBottom: '8px',
        }}
      >
        QUICK QUESTIONS
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {questions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '4px',
              color: '#F2F4F2',
              padding: '5px 10px',
              fontSize: '11px',
              fontFamily: '"Inter", sans-serif',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
            }}
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
