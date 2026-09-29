import type { MissionEvent } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface EventFeedPanelProps {
  events: MissionEvent[];
  onOpenLogModal?: () => void;
}

export const EventFeedPanel: React.FC<EventFeedPanelProps> = ({
  events,
  onOpenLogModal,
}) => {
  return (
    <div
      style={{
        background: '#080A0B',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        padding: '16px',
        fontFamily: '"JetBrains Mono", monospace',
        display: 'flex',
        flexDirection: 'column',
        height: '240px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
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
          EVENT FEED
        </span>
        <button
          onClick={onOpenLogModal}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#68706D',
            fontSize: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: 0,
          }}
        >
          <span>View Full Log</span>
          <ArrowUpRight size={11} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingRight: '4px',
        }}
      >
        {events.map((evt) => {
          const isCritical = evt.level === 'critical';
          const isWarning = evt.level === 'warning';
          const isSuccess = evt.level === 'success';

          const textColor = isCritical ? '#F25D5D' : isWarning ? '#F0AE63' : isSuccess ? '#78D6A3' : '#F2F4F2';

          return (
            <div
              key={evt.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr',
                gap: '8px',
                fontSize: '11px',
                lineHeight: 1.4,
                padding: '4px 0',
                borderLeft: isCritical ? '2px solid #F25D5D' : 'none',
                paddingLeft: isCritical ? '6px' : '0',
              }}
            >
              <span style={{ color: '#68706D', fontSize: '10px' }}>{evt.timestamp}</span>
              <div>
                <div style={{ color: textColor }}>{evt.title}</div>
                {evt.detail && (
                  <div style={{ color: '#68706D', fontSize: '9px', marginTop: '1px' }}>
                    {evt.detail}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
