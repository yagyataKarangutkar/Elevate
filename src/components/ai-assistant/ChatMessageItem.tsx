import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, MapPin, ShieldAlert, ArrowRight } from 'lucide-react';
import type { ChatMessage, AssistantAction } from '../../types/assistant';

interface ChatMessageItemProps {
  message: ChatMessage;
  onAction?: (action: AssistantAction) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, onAction }) => {
  const [showTechDetails, setShowTechDetails] = useState<boolean>(false);
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          marginBottom: '16px',
        }}
      >
        <div
          style={{
            maxWidth: '85%',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '8px 8px 2px 8px',
            padding: '10px 14px',
            color: '#F2F4F2',
            fontSize: '13px',
            fontFamily: '"Inter", sans-serif',
            lineHeight: 1.45,
          }}
        >
          {message.text}
        </div>
        <span
          style={{
            fontSize: '9.5px',
            color: '#68706D',
            fontFamily: '"JetBrains Mono", monospace',
            marginTop: '4px',
            marginRight: '2px',
          }}
        >
          {message.timestamp}
        </span>
      </div>
    );
  }

  // Assistant message
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '92%',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px 8px 8px 2px',
          padding: '14px 16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78D6A3' }}>
            <Sparkles size={11} />
            <span style={{ fontWeight: 700, letterSpacing: '0.06em' }}>MISSIONMIND AI</span>
          </div>
          <span style={{ color: '#68706D' }}>{message.timestamp}</span>
        </div>

        {/* Text */}
        <div
          style={{
            color: '#F2F4F2',
            fontSize: '13px',
            lineHeight: 1.5,
            fontFamily: '"Inter", sans-serif',
            whiteSpace: 'pre-line',
            marginBottom: message.evidence || message.action ? '12px' : '0',
          }}
        >
          {message.text}
        </div>

        {/* Evidence Grid (Spec §24: 2–4 relevant data points) */}
        {message.evidence && message.evidence.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: message.action || message.technicalDetails ? '12px' : '0',
            }}
          >
            {message.evidence.map((ev, i) => {
              const color =
                ev.status === 'good'
                  ? '#78D6A3'
                  : ev.status === 'warning'
                  ? '#F0AE63'
                  : ev.status === 'critical'
                  ? '#F25D5D'
                  : '#A7ADAB';
              return (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    fontSize: '10.5px',
                    fontFamily: '"JetBrains Mono", monospace',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ color: '#68706D' }}>{ev.label}:</span>
                  <span style={{ color, fontWeight: 600 }}>{ev.value}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button (Spec §21, §53, §54: Map-linked answers) */}
        {message.action && onAction && (
          <div style={{ marginBottom: message.technicalDetails ? '10px' : '0' }}>
            <button
              onClick={() => onAction(message.action!)}
              style={{
                background: 'rgba(120, 214, 163, 0.1)',
                border: '1px solid rgba(120, 214, 163, 0.3)',
                borderRadius: '4px',
                color: '#78D6A3',
                padding: '6px 12px',
                fontSize: '11px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              {message.action.type === 'highlight_agent' && <MapPin size={11} />}
              {message.action.type === 'view_decision' && <ShieldAlert size={11} />}
              {message.action.type === 'show_replan' && <ArrowRight size={11} />}
              <span>{message.action.label}</span>
            </button>
          </div>
        )}

        {/* Technical Details Accordion (Spec §23: Progressive Disclosure) */}
        {message.technicalDetails && (
          <div style={{ marginTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '8px' }}>
            <button
              onClick={() => setShowTechDetails(!showTechDetails)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#68706D',
                cursor: 'pointer',
                fontSize: '10px',
                fontFamily: '"JetBrains Mono", monospace',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0,
              }}
            >
              <span>{showTechDetails ? 'Hide technical details' : 'View technical details'}</span>
              {showTechDetails ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>

            {showTechDetails && (
              <div
                style={{
                  marginTop: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                  padding: '8px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                }}
              >
                {Object.entries(message.technicalDetails).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ color: '#68706D' }}>{k}:</span>
                    <span style={{ color: '#A7ADAB' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
