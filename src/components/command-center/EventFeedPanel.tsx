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

          const isPrioritized = evt.priority;
          return (
            <div
              key={evt.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '42px 1fr',
                gap: '8px',
                fontSize: '11px',
                lineHeight: 1.4,
                padding: isPrioritized ? '6px 8px' : '4px 0',
                background: isPrioritized ? 'rgba(242, 93, 93, 0.08)' : 'transparent',
                border: isPrioritized ? '1px solid rgba(242, 93, 93, 0.35)' : 'none',
                borderRadius: isPrioritized ? '4px' : '0',
                borderLeft: isPrioritized
                  ? '3px solid #F25D5D'
                  : isCritical
                  ? '2px solid #F25D5D'
                  : 'none',
                paddingLeft: isPrioritized ? '8px' : isCritical ? '6px' : '0',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ color: '#68706D', fontSize: '10px' }}>{evt.timestamp}</span>
                {isPrioritized && (
                  <span style={{ fontSize: '8px', color: '#F25D5D', fontWeight: 700 }}>PRIO-1</span>
                )}
              </div>
              <div>
                <div style={{ color: textColor, fontWeight: isPrioritized ? 600 : 400 }}>{evt.title}</div>
                {evt.detail && (
                  <div style={{ color: isPrioritized ? '#D0D5D3' : '#68706D', fontSize: '9px', marginTop: '1px' }}>
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
