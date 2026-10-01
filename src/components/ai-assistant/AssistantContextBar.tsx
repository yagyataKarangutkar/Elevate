import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database } from 'lucide-react';
import type { MissionAssistantContext } from '../../types/assistant';

interface AssistantContextBarProps {
  ctx: MissionAssistantContext;
}

export const AssistantContextBar: React.FC<AssistantContextBarProps> = ({ ctx }) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <div
      style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.02)',
        fontSize: '10.5px',
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          background: 'transparent',
          border: 'none',
          color: '#A7ADAB',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Database size={11} color="#78D6A3" />
          <span>Using current mission data</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#68706D' }}>
          <span>{expanded ? 'Hide detail' : '4 robots · 9 tasks'}</span>
          {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </div>
      </button>

      {expanded && (
        <div
          style={{
            padding: '8px 20px 12px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            color: '#8D9693',
            fontSize: '10px',
          }}
        >
          <div>
            • 4 active swarm agents
            <br />
            • 9 total mission tasks
            <br />
            • Feasibility: <span style={{ color: '#78D6A3' }}>{ctx.mission.status}</span>
          </div>
          <div>
            • {ctx.events.length} recorded events
            <br />
            • Confidence: {ctx.mission.confidence}%
            <br />
            • Survivors: {ctx.mission.survivorsFound} confirmed
          </div>
        </div>
      )}
    </div>
  );
};
