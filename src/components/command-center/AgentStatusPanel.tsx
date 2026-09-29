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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#F2F4F2' }}>
                      {agent.id}
                      <span style={{ marginLeft: '8px', fontWeight: 400, color: '#A7ADAB', fontSize: '11px' }}>
                        {agent.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: isOffline ? '#F25D5D' : '#68706D', marginTop: '1px' }}>
                      {agent.task}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : '#F2F4F2',
                    }}
                  >
                    {isOffline ? 'OFFLINE' : `${agent.battery}%`}
                  </div>
                  <div style={{ fontSize: '9px', color: '#68706D' }}>
                    {isOffline ? '0% SIG' : `${agent.signal}% SIG`}
                  </div>
                </div>
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
