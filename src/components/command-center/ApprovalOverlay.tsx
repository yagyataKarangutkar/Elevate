import { useState } from 'react';
import { AlertTriangle, Check, ArrowRight, ChevronDown, Bot, Pause, XCircle } from 'lucide-react';
import { playSuccessChirp, playAlertAlarm, playUiTick } from '../../utils/audio';

interface ApprovalOverlayProps {
  confidence: number;
  onApprove: () => void;
  onReject: () => void;
  onOpenReasoning: () => void;
}

export const ApprovalOverlay: React.FC<ApprovalOverlayProps> = ({
  confidence: _confidence,
  onApprove,
  onReject,
  onOpenReasoning,
}) => {
  const [showAlternativeMenu, setShowAlternativeMenu] = useState<boolean>(false);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 6, 7, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(12px, 3vw, 24px)',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#080A0B',
          border: '1px solid rgba(240, 174, 99, 0.5)',
          borderRadius: '8px',
          padding: 'clamp(18px, 4vw, 30px)',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.85), 0 0 24px rgba(240, 174, 99, 0.12)',
          fontFamily: '"JetBrains Mono", monospace',
          position: 'relative',
        }}
      >
        {/* Header with Human Decision Indicator per Spec Section 28 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              background: 'rgba(240, 174, 99, 0.15)',
              border: '1px solid #F0AE63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={20} color="#F0AE63" />
          </div>
          <div>
            <div
              style={{
                fontSize: '10px',
                color: '#F0AE63',
                letterSpacing: '0.12em',
                fontWeight: 600,
              }}
            >
              AUTONOMY STATE: HUMAN APPROVAL
            </div>
            <h2
              style={{
                fontSize: '20px',
                color: '#F2F4F2',
                fontWeight: 500,
                fontFamily: '"Inter", sans-serif',
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              MissionMind needs your decision
            </h2>
          </div>
        </div>

        <p
          style={{
            fontSize: '13px',
            color: '#A7ADAB',
            lineHeight: 1.6,
            marginBottom: '20px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          The current situation is too uncertain for MissionMind to continue alone.
        </p>

        {/* 3 Clear Blocks per Spec Section 28 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {/* Block 1: WHAT HAPPENED? */}
          <div
            style={{
              background: 'rgba(242, 93, 93, 0.08)',
              border: '1px solid rgba(242, 93, 93, 0.25)',
              borderRadius: '6px',
              padding: '12px 16px',
            }}
          >
            <div style={{ fontSize: '10px', color: '#F25D5D', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 600 }}>
              1. WHAT HAPPENED?
            </div>
            <div style={{ fontSize: '13px', color: '#F2F4F2', fontFamily: '"Inter", sans-serif' }}>
              Drone 03 lost communication in Sector C.
            </div>
          </div>

          {/* Block 2: WHAT DOES MISSIONMIND RECOMMEND? */}
          <div
            style={{
              background: 'rgba(120, 214, 163, 0.08)',
              border: '1px solid rgba(120, 214, 163, 0.25)',
              borderRadius: '6px',
              padding: '12px 16px',
            }}
          >
            <div style={{ fontSize: '10px', color: '#78D6A3', letterSpacing: '0.08em', marginBottom: '4px', fontWeight: 600 }}>
              2. WHAT DOES MISSIONMIND RECOMMEND?
            </div>
            <div style={{ fontSize: '13px', color: '#F2F4F2', fontFamily: '"Inter", sans-serif' }}>
              Use GroundBot to continue the rescue.
            </div>
          </div>

          {/* Block 3: WHY? */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontSize: '10px', color: '#A7ADAB', letterSpacing: '0.08em', fontWeight: 600 }}>
                3. WHY GROUNDBOT?
              </div>
              <button
                onClick={() => {
                  playUiTick();
                  onOpenReasoning();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#78D6A3',
                  fontSize: '10px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                View Full Metrics →
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#D0D5D3', fontFamily: '"Inter", sans-serif', lineHeight: 1.5 }}>
              It has enough battery, a reachable route and a strong connection.
            </div>
          </div>
        </div>

        {/* Structured reasons table per Spec Section 29 */}
        <div
          style={{
            background: '#050607',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '20px',
            fontSize: '11px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
            <span>Distance</span>
            <span style={{ color: '#F2F4F2' }}>240 m</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
            <span>Battery</span>
            <span style={{ color: '#78D6A3' }}>Enough (64%)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
            <span>Signal</span>
            <span style={{ color: '#78D6A3' }}>Strong (96% mesh)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
            <span>Route</span>
            <span style={{ color: '#78D6A3' }}>Reachable (cleared)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
            <span>Risk</span>
            <span style={{ color: '#F0AE63' }}>Medium</span>
          </div>
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '6px', marginTop: '2px', color: '#78D6A3', fontWeight: 600 }}>
            GroundBot is the safest available option for this task.
          </div>
        </div>

        {/* Pre-approval Consequence per Spec Section 30 */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            borderLeft: '3px solid #78D6A3',
            padding: '8px 12px',
            marginBottom: '24px',
            fontSize: '12px',
            fontFamily: '"Inter", sans-serif',
            color: '#F2F4F2',
          }}
        >
          <strong>If you approve:</strong> GroundBot will leave its current position and move to the rescue zone.
        </div>

        {/* Action Buttons & Alternative Flow per Spec Section 28 & 31 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                playSuccessChirp();
                onApprove();
              }}
              style={{
                flex: '1 1 200px',
                minHeight: '44px',
                background: '#F2F4F2',
                color: '#050607',
                border: 'none',
                borderRadius: '4px',
                padding: '12px 18px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
            >
              <span>Approve Plan</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                playUiTick();
                setShowAlternativeMenu(!showAlternativeMenu);
              }}
              style={{
                flex: '1 1 180px',
                minHeight: '44px',
                background: 'transparent',
                color: '#A7ADAB',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                padding: '12px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>Choose another option</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Alternative Options Dropdown per Spec Section 31 */}
          {showAlternativeMenu && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <button
                onClick={() => {
                  setShowAlternativeMenu(false);
                  onApprove();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#78D6A3',
                  fontSize: '11px',
                  padding: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Check size={12} />
                <span>Continue with recommendation (GroundBot)</span>
              </button>

              <button
                onClick={() => {
                  setShowAlternativeMenu(false);
                  onApprove();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F2F4F2',
                  fontSize: '11px',
                  padding: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Bot size={12} />
                <span>Choose Drone 01 (Aerial thermal only)</span>
              </button>

              <button
                onClick={() => {
                  setShowAlternativeMenu(false);
                  playAlertAlarm();
                  onReject();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F0AE63',
                  fontSize: '11px',
                  padding: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Pause size={12} />
                <span>Pause mission (Hold positions)</span>
              </button>

              <button
                onClick={() => {
                  setShowAlternativeMenu(false);
                  playAlertAlarm();
                  onReject();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F25D5D',
                  fontSize: '11px',
                  padding: '8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <XCircle size={12} />
                <span>Cancel mission</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
