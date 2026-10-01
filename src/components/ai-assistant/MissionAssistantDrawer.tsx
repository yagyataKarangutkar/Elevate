import React, { useState, useEffect, useRef } from 'react';
import { AssistantHeader } from './AssistantHeader';
import { AssistantContextBar } from './AssistantContextBar';
import { ChatMessageItem } from './ChatMessageItem';
import { QuickQuestionsBar } from './QuickQuestionsBar';
import { TypingIndicator } from './TypingIndicator';
import { MissionAssistantEngine } from '../../services/missionAssistantEngine';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import type {
  ChatMessage,
  MissionAssistantContext,
  AssistantAction,
} from '../../types/assistant';
import type { AgentId } from '../../types';
import { Send, AlertTriangle, ShieldAlert } from 'lucide-react';

interface MissionAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ctx: MissionAssistantContext;
  onHighlightAgent?: (agentId: AgentId) => void;
  onOpenDecision?: () => void;
  onSelectEvent?: (eventId?: string) => void;
  onShowReplan?: () => void;
}

export const MissionAssistantDrawer: React.FC<MissionAssistantDrawerProps> = ({
  isOpen,
  onClose,
  ctx,
  onHighlightAgent,
  onOpenDecision,
  onSelectEvent,
  onShowReplan,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [dismissedEventId, setDismissedEventId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, isTyping]);

  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Esc key listener (Spec §48, §49)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Dynamic quick questions based on live mission state (Spec §10, §31, §32)
  const quickQuestions = MissionAssistantEngine.getQuickQuestions(ctx);

  // Latest critical event banner (Spec §36)
  const latestEvent = ctx.events[0];
  const showEventBanner =
    latestEvent &&
    latestEvent.id !== dismissedEventId &&
    (latestEvent.level === 'critical' || latestEvent.level === 'warning');

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    playUiTick();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate natural response latency (Spec §34)
    setTimeout(() => {
      const response = MissionAssistantEngine.answerQuestion(query, ctx);
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: response.answer,
        evidence: response.evidence,
        action: response.action,
        technicalDetails: response.technicalDetails,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
      playSuccessChirp();

      // If response has related agent, highlight automatically
      if (response.relatedAgentId && onHighlightAgent) {
        onHighlightAgent(response.relatedAgentId);
      }
    }, 550);
  };

  const handleAction = (action: AssistantAction) => {
    playUiTick();
    if (action.type === 'highlight_agent' && action.agentId && onHighlightAgent) {
      onHighlightAgent(action.agentId);
    } else if (action.type === 'view_decision' && onOpenDecision) {
      onOpenDecision();
    } else if (action.type === 'view_event' && onSelectEvent) {
      onSelectEvent(action.eventId);
    } else if (action.type === 'show_replan' && onShowReplan) {
      onShowReplan();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {isMobile && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 1099,
          }}
        />
      )}
      <div
        style={{
          position: 'fixed',
          top: isMobile ? 'auto' : 0,
          right: 0,
          bottom: 0,
          left: isMobile ? 0 : 'auto',
          width: isMobile ? '100%' : 'min(420px, 94vw)',
          height: isMobile ? '90vh' : '100%',
          background: '#07090A',
          borderLeft: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.14)',
          borderTop: isMobile ? '1px solid rgba(120, 214, 163, 0.4)' : 'none',
          borderRadius: isMobile ? '16px 16px 0 0' : '0',
          boxShadow: isMobile ? '0 -8px 32px rgba(0, 0, 0, 0.8)' : '-8px 0 32px rgba(0, 0, 0, 0.7)',
          zIndex: 1100,
          display: 'flex',
          flexDirection: 'column',
          animation: isMobile ? 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)' : 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
      {/* 1. Header (Spec §7) */}
      <AssistantHeader onClose={onClose} />

      {/* 2. Context Indicator (Spec §8) */}
      <AssistantContextBar ctx={ctx} />

      {/* 3. Event Notification Strip if new event occurs (Spec §36) */}
      {showEventBanner && (
        <div
          style={{
            background: 'rgba(240, 174, 99, 0.12)',
            borderBottom: '1px solid rgba(240, 174, 99, 0.3)',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#F0AE63' }}>
            <AlertTriangle size={13} />
            <span style={{ fontWeight: 600 }}>Event: {latestEvent.title}</span>
          </div>
          <button
            onClick={() => {
              setDismissedEventId(latestEvent.id);
              handleSendMessage(`What happened with ${latestEvent.title}?`);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#F2F4F2',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '10.5px',
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Ask about it →
          </button>
        </div>
      )}

      {/* 4. Human Decision Card if approval is required (Spec §37) */}
      {ctx.approvalRequired && (
        <div
          style={{
            background: 'rgba(240, 174, 99, 0.08)',
            borderBottom: '1px solid rgba(240, 174, 99, 0.25)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={15} color="#F0AE63" />
            <div>
              <div style={{ fontSize: '10px', color: '#F0AE63', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 }}>
                HUMAN DECISION REQUIRED
              </div>
              <div style={{ fontSize: '11px', color: '#F2F4F2', fontFamily: '"Inter", sans-serif' }}>
                MissionMind recommends: Deploy GroundBot reserve
              </div>
            </div>
          </div>
          {onOpenDecision && (
            <button
              onClick={() => {
                playUiTick();
                onOpenDecision();
              }}
              style={{
                background: '#F0AE63',
                color: '#050607',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
              }}
            >
              View Decision
            </button>
          )}
        </div>
      )}

      {/* 5. Messages Feed */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {messages.length === 0 ? (
          // Initial Empty State (Spec §9)
          <div
            style={{
              margin: 'auto 0',
              textAlign: 'center',
              padding: '20px 10px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#F2F4F2',
                fontFamily: '"Inter", sans-serif',
                marginBottom: '8px',
              }}
            >
              What do you want to know?
            </div>
            <div
              style={{
                fontSize: '12.5px',
                color: '#8D9693',
                lineHeight: 1.5,
                fontFamily: '"Inter", sans-serif',
                maxWidth: '300px',
                margin: '0 auto 20px',
              }}
            >
              Ask me about the current mission, robot status, decisions, routes or recent events.
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} onAction={handleAction} />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 6. Context-Aware Quick Questions (Spec §10, §31, §32) */}
      <QuickQuestionsBar
        questions={quickQuestions}
        onSelect={(q) => handleSendMessage(q)}
      />

      {/* 7. Input Area (Spec §48, §49) */}
      <div
        style={{
          padding: '14px 20px',
          paddingBottom: 'calc(14px + env(safe-area-inset-bottom, 0px))',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(8, 10, 11, 0.98)',
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '6px',
            padding: '6px 10px',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ask MissionMind..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#F2F4F2',
              fontSize: '12.5px',
              fontFamily: '"Inter", sans-serif',
            }}
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send Message"
            style={{
              background: inputValue.trim() && !isTyping ? '#78D6A3' : 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '4px',
              color: inputValue.trim() && !isTyping ? '#050607' : '#68706D',
              width: isMobile ? '36px' : '28px',
              height: isMobile ? '36px' : '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputValue.trim() && !isTyping ? 'pointer' : 'default',
              transition: 'all 0.15s ease',
            }}
          >
            <Send size={13} />
          </button>
        </form>

        <div
          style={{
            fontSize: '9.5px',
            color: '#68706D',
            fontFamily: '"JetBrains Mono", monospace',
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span>Press Enter to send</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
    </>
  );
};
