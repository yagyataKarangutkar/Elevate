import type { MissionEvent } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface EventFeedPanelProps {
  events: MissionEvent[];
  selectedEventId?: string | null;
  onSelectEvent?: (evt: MissionEvent) => void;
  onOpenLogModal?: () => void;
}

export const EventFeedPanel: React.FC<EventFeedPanelProps> = ({
  events,
  selectedEventId,
  onSelectEvent,
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: '#A7ADAB',
            }}
          >
            MISSION EVENT FEED
          </span>
          <span style={{ fontSize: '9px', color: '#68706D' }}>(Click to view on map)</span>
        </div>
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
          gap: '8px',
          paddingRight: '4px',
        }}
      >
        {events.map((evt) => {
          const isCritical = evt.level === 'critical';
          const isWarning = evt.level === 'warning';
          const isSuccess = evt.level === 'success';
          const isSelected = selectedEventId === evt.id;

          const textColor = isCritical ? '#F25D5D' : isWarning ? '#F0AE63' : isSuccess ? '#78D6A3' : '#F2F4F2';
          const severityLabel = isCritical ? 'CRITICAL' : isWarning ? 'WARNING' : 'INFO';

          return (
            <div
              key={evt.id}
              onClick={() => onSelectEvent?.(evt)}
              style={{
                display: 'grid',
                gridTemplateColumns: '46px 1fr',
                gap: '8px',
                fontSize: '11px',
                lineHeight: 1.4,
                padding: '6px 8px',
                background: isSelected 
                  ? 'rgba(255, 255, 255, 0.08)' 
                  : isCritical 
                  ? 'rgba(242, 93, 93, 0.06)' 
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isSelected 
                    ? 'rgba(255, 255, 255, 0.35)' 
                    : isCritical 
                    ? 'rgba(242, 93, 93, 0.25)' 
                    : 'rgba(255, 255, 255, 0.06)'
                }`,
                borderRadius: '4px',
                borderLeft: isCritical ? '3px solid #F25D5D' : isWarning ? '3px solid #F0AE63' : '3px solid #78D6A3',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ color: '#68706D', fontSize: '10px' }}>{evt.timestamp}</span>
                <span 
                  style={{ 
                    fontSize: '8px', 
                    fontWeight: 700, 
                    color: textColor,
                    letterSpacing: '0.04em' 
                  }}
                >
                  {severityLabel}
                </span>
              </div>
              <div>
                <div style={{ color: textColor, fontWeight: isCritical ? 600 : 500 }}>
                  {evt.title}
                </div>
                {evt.detail && (
                  <div style={{ color: '#A7ADAB', fontSize: '10px', marginTop: '2px', lineHeight: 1.4 }}>
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
