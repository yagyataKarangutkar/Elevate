import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, ArrowRight, ShieldAlert } from 'lucide-react';
import type { LifelineInterventionProposal } from '../../engine';
import { playSuccessChirp, playAlertAlarm } from '../../utils/audio';

interface LifelineRecoveryModalProps {
  proposal: LifelineInterventionProposal | null;
  isOpen: boolean;
  onApprove: () => void;
  onReject: () => void;
}

export const LifelineRecoveryModal: React.FC<LifelineRecoveryModalProps> = ({
  proposal,
  isOpen,
  onApprove,
  onReject,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen || !proposal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 6, 7, 0.82)',
        backdropFilter: 'blur(8px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#080A0B',
          border: '1px solid rgba(242, 93, 93, 0.45)',
          borderRadius: '8px',
          padding: isMobile ? '16px' : '26px',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(242, 93, 93, 0.12)',
          fontFamily: '"JetBrains Mono", monospace',
          position: 'relative',
        }}
      >
        {/* Header: MISSION BLOCKED Indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '4px',
                background: 'rgba(242, 93, 93, 0.15)',
                border: '1px solid #F25D5D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertTriangle size={18} color="#F25D5D" />
            </div>
            <div>
              <div style={{ fontSize: '14px', color: '#F25D5D', fontWeight: 700, letterSpacing: '0.05em' }}>
                MISSION BLOCKED
              </div>
              <div style={{ fontSize: '11px', color: '#A7ADAB', marginTop: '2px' }}>
                Swarm autonomy halted · Constraint violation
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(242, 93, 93, 0.12)',
              border: '1px solid rgba(242, 93, 93, 0.3)',
              fontSize: '10px',
              color: '#F25D5D',
              fontWeight: 600,
            }}
          >
            LADDER: LEVEL {proposal.ladderLevel}/6
          </div>
        </div>

        {/* 1. BLOCKING CONSTRAINT */}
        <div
          style={{
            background: 'rgba(242, 93, 93, 0.05)',
            border: '1px solid rgba(242, 93, 93, 0.25)',
            borderRadius: '6px',
            padding: '12px 14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ fontSize: '10px', color: '#F25D5D', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
            BLOCKING CONSTRAINT
          </div>
          <div style={{ fontSize: '11.5px', color: '#F2F4F2', lineHeight: 1.45, fontWeight: 500 }}>
            "{proposal.blockingConstraint}"
          </div>
        </div>

        {/* Candidate Evaluation Summary */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '8px' }}>
            REASSIGNMENT CHECK (REMAINING AGENTS)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {proposal.reassignmentCandidateEvaluations.map((c) => (
              <div
                key={c.agentName}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px 10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '4px',
                  fontSize: '10px',
                }}
              >
                <span style={{ color: '#F2F4F2', fontWeight: 500 }}>{c.agentName}</span>
                <span style={{ color: '#F25D5D', fontWeight: 600 }}>{c.reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. LIFELINE FOUND */}
        <div
          style={{
            background: 'rgba(120, 214, 163, 0.06)',
            border: '1px solid rgba(120, 214, 163, 0.4)',
            borderRadius: '6px',
            padding: '14px',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <CheckCircle2 size={15} color="#78D6A3" />
            <span style={{ fontSize: '11px', color: '#78D6A3', fontWeight: 700, letterSpacing: '0.08em' }}>
              LIFELINE FOUND
            </span>
          </div>
          <div style={{ fontSize: '13px', color: '#F2F4F2', fontWeight: 600, marginBottom: '6px' }}>
            "{proposal.title}"
          </div>
          <div style={{ fontSize: '10.5px', color: '#A7ADAB', lineHeight: 1.45 }}>
            {proposal.explanation}
          </div>
        </div>

        {/* 3. LATEST DISPATCH */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px',
            padding: '12px 14px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={15} color="#F0AE63" />
            <div>
              <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em' }}>
                LATEST DISPATCH
              </div>
              <div style={{ fontSize: '11px', color: '#A7ADAB' }}>
                Forward Depot reserve window
              </div>
            </div>
          </div>
          <div style={{ fontSize: '18px', color: '#F0AE63', fontWeight: 700, letterSpacing: '0.05em' }}>
            {proposal.latestDispatchTime}
          </div>
        </div>

        {/* 4. HUMAN APPROVAL REQUIRED & Action Buttons */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '16px' }}>
          <div
            style={{
              fontSize: '10.5px',
              color: '#F0AE63',
              letterSpacing: '0.08em',
              fontWeight: 700,
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldAlert size={13} color="#F0AE63" />
            <span>HUMAN APPROVAL REQUIRED</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '10px' : '12px',
            }}
          >
            <button
              onClick={() => {
                playSuccessChirp();
                onApprove();
              }}
              style={{
                flex: 1,
                background: '#F2F4F2',
                color: '#050607',
                border: 'none',
                borderRadius: '4px',
                padding: isMobile ? '14px 16px' : '12px',
                minHeight: '44px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>APPROVE DISPATCH</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                playAlertAlarm();
                onReject();
              }}
              style={{
                flex: isMobile ? 'none' : 1,
                background: 'transparent',
                color: '#F25D5D',
                border: '1px solid rgba(242, 93, 93, 0.4)',
                borderRadius: '4px',
                padding: isMobile ? '12px 16px' : '12px',
                minHeight: '44px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              REJECT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
