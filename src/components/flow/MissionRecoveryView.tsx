import { FlowNavbar } from './FlowNavbar';
import { ArrowRight, ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import type { FlowStep } from '../../types';

interface MissionRecoveryViewProps {
  onNavigate: (step: FlowStep) => void;
  onProceedToComplete: () => void;
}

export const MissionRecoveryView: React.FC<MissionRecoveryViewProps> = ({
  onNavigate,
  onProceedToComplete,
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050607',
        color: '#F2F4F2',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <FlowNavbar
        currentStep="mission_recovery"
        onNavigate={onNavigate}
        title="06. MISSION RECOVERY STAGE"
      />

      <main
        style={{
          flex: 1,
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto',
          padding: '60px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '36px',
            width: '100%',
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#F0AE63',
              letterSpacing: '0.12em',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <AlertTriangle size={14} color="#F0AE63" />
            <span>STAGE 06 · MISSION RECOVERY FLOW PLACEHOLDER</span>
          </div>

          <h2
            style={{
              fontSize: '28px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: '12px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Mission Recovery & Dynamic Lifeline
          </h2>

          <p
            style={{
              color: '#A7ADAB',
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}
          >
            This stage serves as the anchor point for the upcoming Lifeline recovery protocol and autonomous failure resolution engine. When enabled, unexpected agent disconnects or obstacle blocks are triaged here with human authorization checkpoints.
          </p>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              padding: '16px 20px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <RefreshCw size={20} color="#78D6A3" />
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#F2F4F2',
                }}
              >
                Autonomous Recovery Engine: Standby
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: '#68706D',
                  fontFamily: '"JetBrains Mono", monospace',
                  marginTop: '2px',
                }}
              >
                Lifeline simulation logic will be integrated in subsequent prompt tasks.
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '20px',
            }}
          >
            <button
              onClick={() => {
                playUiTick();
                onNavigate('command_center');
              }}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: '#A7ADAB',
                padding: '8px 16px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ArrowLeft size={12} />
              <span>Back to Command Center</span>
            </button>

            <button
              onClick={() => {
                playSuccessChirp();
                onProceedToComplete();
              }}
              style={{
                background: '#F2F4F2',
                color: '#050607',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 20px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Proceed to Mission Complete</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
