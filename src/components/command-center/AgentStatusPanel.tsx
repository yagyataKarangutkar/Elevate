import type { Agent, AgentId } from '../../types';
import { playUiTick } from '../../utils/audio';

interface AgentStatusPanelProps {
  agents: Agent[];
  selectedAgentId?: AgentId | null;
  onSelectAgent: (id: AgentId) => void;
}

export const AgentStatusPanel: React.FC<AgentStatusPanelProps> = ({
  agents,
  selectedAgentId,
  onSelectAgent,
}) => {
  return (
    <div
      style={{
        background: '#080A0B',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        padding: '16px',
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#A7ADAB',
          }}
        >
          AGENT STATUS
        </span>
        <span
          style={{
            fontSize: '10px',
            color: '#68706D',
          }}
        >
          {agents.filter((a) => a.status === 'active').length} / {agents.length} OPERATIONAL
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {agents.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          const isOffline = agent.status === 'offline';
          const isWarning = agent.status === 'warning' || agent.battery < 20;

          const dotColor = isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : '#78D6A3';

          return (
            <div
              key={agent.id}
              onClick={() => {
                playUiTick();
                onSelectAgent(agent.id);
              }}
              style={{
                padding: '10px 12px',
                borderRadius: '4px',
                background: isSelected
                  ? 'rgba(255, 255, 255, 0.06)'
                  : isOffline
                  ? 'rgba(242, 93, 93, 0.06)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isSelected
                    ? 'rgba(255, 255, 255, 0.3)'
                    : isOffline
                    ? 'rgba(242, 93, 93, 0.4)'
                    : isWarning
                    ? 'rgba(240, 174, 99, 0.3)'
                    : 'rgba(255, 255, 255, 0.06)'
                }`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Status dot */}
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: dotColor,
                      boxShadow: `0 0 6px ${dotColor}`,
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#F2F4F2', letterSpacing: '0.04em' }}>
                    {agent.name || agent.code || agent.id}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                  <span style={{ color: isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : '#F2F4F2', fontWeight: 500 }}>
                    {isOffline ? 'OFFLINE' : `${agent.battery}% battery`}
                  </span>
                  <span style={{ color: '#68706D' }}>•</span>
                  <span style={{ color: isOffline ? '#F25D5D' : '#A7ADAB' }}>
                    {isOffline ? '0% signal' : `${agent.signal}% signal`}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: isOffline ? '#F25D5D' : '#8A928F', marginTop: '2px', display: 'flex', gap: '6px' }}>
                <span style={{ color: '#68706D', fontSize: '10px', fontWeight: 600 }}>TASK:</span>
                <span style={{ color: isOffline ? '#F25D5D' : '#D0D5D3' }}>{agent.task}</span>
              </div>

              {/* Battery progress thin bar */}
              <div
                style={{
                  marginTop: '8px',
                  height: '2px',
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '1px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: isOffline ? '0%' : `${agent.battery}%`,
                    background: dotColor,
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
