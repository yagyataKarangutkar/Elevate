import { AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { playSuccessChirp, playAlertAlarm, playUiTick } from '../../utils/audio';

interface ApprovalOverlayProps {
  confidence: number;
  onApprove: () => void;
  onReject: () => void;
  onOpenReasoning: () => void;
}

export const ApprovalOverlay: React.FC<ApprovalOverlayProps> = ({
  confidence,
  onApprove,
  onReject,
  onOpenReasoning,
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 6, 7, 0.78)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        animation: 'fadeIn 0.25s ease',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          background: '#080A0B',
          border: '1px solid rgba(240, 174, 99, 0.5)',
          borderRadius: '8px',
          padding: '28px',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.8), 0 0 20px rgba(240, 174, 99, 0.1)',
          fontFamily: '"JetBrains Mono", monospace',
          position: 'relative',
        }}
      >
        {/* Header with Warning Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              background: 'rgba(240, 174, 99, 0.15)',
              border: '1px solid #F0AE63',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AlertTriangle size={18} color="#F0AE63" />
          </div>
          <div>
            <div
              style={{
                fontSize: '11px',
                color: '#F0AE63',
                letterSpacing: '0.1em',
                fontWeight: 600,
              }}
            >
              HUMAN APPROVAL REQUIRED
            </div>
            <div style={{ fontSize: '14px', color: '#F2F4F2', fontWeight: 500, fontFamily: '"Inter", sans-serif' }}>
              Autonomy Threshold Breach
            </div>
          </div>
        </div>

        <p
          style={{
            fontSize: '12px',
            color: '#A7ADAB',
            lineHeight: 1.6,
            marginBottom: '20px',
            fontFamily: '"Inter", sans-serif',
          }}
        >
          Mission confidence has dropped to{' '}
          <strong style={{ color: '#F25D5D' }}>{confidence}%</strong> due to mesh communication loss with Drone-03.
          MissionMind has calculated a revised rescue vector, but requires human operator sign-off before committing GroundBot into Sector B.
        </p>

        {/* AI Recommendation Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '14px',
            marginBottom: '20px',
          }}
        >
          <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '6px' }}>
            AI RECOMMENDATION
          </div>
          <div style={{ fontSize: '12px', color: '#F2F4F2', fontWeight: 500 }}>
            Reassign GroundBot 01 to primary survivor extraction via Ridge Vector Delta; switch Drone-01 to mesh relay mode.
          </div>
        </div>

        {/* Decision Factors Table matching spec */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <span style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em' }}>
              DECISION FACTORS
            </span>
            <button
              onClick={() => {
                playUiTick();
                onOpenReasoning();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#A7ADAB',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <span>Explain Reasoning</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
              <span>Terrain access</span>
              <span style={{ color: '#78D6A3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> Ground access validated
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
              <span>Battery level (GroundBot)</span>
              <span style={{ color: '#78D6A3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> 64% (Sufficient for 48m)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
              <span>Mesh signal link</span>
              <span style={{ color: '#78D6A3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> 96% via Drone-01
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
              <span>Distance to survivor</span>
              <span style={{ color: '#78D6A3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Check size={12} /> 240m (Optimal route)
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#A7ADAB' }}>
              <span>Route risk</span>
              <span style={{ color: '#F0AE63', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertTriangle size={12} /> Route A rubble blocked
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
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
              padding: '12px',
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
            <span>APPROVE REPLAN</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={() => {
              playAlertAlarm();
              onReject();
            }}
            style={{
              flex: 1,
              background: 'transparent',
              color: '#F25D5D',
              border: '1px solid rgba(242, 93, 93, 0.4)',
              borderRadius: '4px',
              padding: '12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            REJECT / MANUAL OVERRIDE
          </button>
        </div>
      </div>
    </div>
  );
};
