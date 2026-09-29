import React from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { X, Check, AlertTriangle, Layers, Battery, Radio, Compass, ShieldAlert } from 'lucide-react';
import { playUiTick } from '../../utils/audio';

interface DecisionExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DecisionExplanationModal: React.FC<DecisionExplanationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 6, 7, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 110,
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
          maxWidth: '920px',
          background: '#080A0B',
          border: '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 0 50px rgba(0, 0, 0, 0.9)',
          position: 'relative',
        }}
      >
        {/* Top bar with close */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#68706D',
                letterSpacing: '0.1em',
              }}
            >
              05. AI DECISION
            </span>
          </div>
          <button
            onClick={() => {
              playUiTick();
              onClose();
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A7ADAB',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content body matching bottom-right screenshot */}
        <div style={{ padding: '28px' }}>
          <div style={{ marginBottom: '24px' }}>
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 500,
                color: '#F2F4F2',
                marginBottom: '6px',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              Why GroundBot?
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: '#A7ADAB',
                margin: 0,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              MissionMind explains the reasoning behind every automated decision.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '28px',
              alignItems: 'center',
            }}
          >
            {/* Left side: Decision Factors list */}
            <div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  color: '#68706D',
                  letterSpacing: '0.08em',
                  marginBottom: '14px',
                }}
              >
                Decision Factors
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Terrain Access */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Layers size={14} color="#A7ADAB" />
                    <span style={{ fontSize: '12px', color: '#F2F4F2' }}>Terrain Access</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#78D6A3' }}>
                    <Check size={13} />
                    <span>Ground access required</span>
                  </div>
                </div>

                {/* Battery Level */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Battery size={14} color="#A7ADAB" />
                    <span style={{ fontSize: '12px', color: '#F2F4F2' }}>Battery Level</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#78D6A3' }}>
                    <span>64%</span>
                    <span style={{ color: '#68706D' }}>Sufficient</span>
                  </div>
                </div>

                {/* Signal Strength */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Radio size={14} color="#A7ADAB" />
                    <span style={{ fontSize: '12px', color: '#F2F4F2' }}>Signal Strength</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#78D6A3' }}>
                    <span>96%</span>
                    <span style={{ color: '#68706D' }}>Strong</span>
                  </div>
                </div>

                {/* Distance to Target */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Compass size={14} color="#A7ADAB" />
                    <span style={{ fontSize: '12px', color: '#F2F4F2' }}>Distance to Target</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#78D6A3' }}>
                    <span>240 m</span>
                    <span style={{ color: '#68706D' }}>Optimal</span>
                  </div>
                </div>

                {/* Route Risk */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '4px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldAlert size={14} color="#A7ADAB" />
                    <span style={{ fontSize: '12px', color: '#F2F4F2' }}>Route Risk</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#F0AE63' }}>
                    <AlertTriangle size={13} />
                    <span>Route A blocked</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: 3D GroundBot preview & Decision block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  height: '180px',
                  background: '#050607',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <SwarmCanvas mode="roverOnly" interactive={false} />
              </div>

              {/* Decision Box */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '14px',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '4px' }}>
                  DECISION
                </div>
                <div style={{ fontSize: '13px', color: '#F2F4F2', fontWeight: 500, lineHeight: 1.5, marginBottom: '14px' }}>
                  GroundBot selected because mission feasibility remains above threshold.
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#A7ADAB', marginBottom: '6px' }}>
                    <span>Confidence Score</span>
                    <span>91%</span>
                  </div>
                  <div style={{ height: '3px', width: '100%', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '91%', background: '#ffffff' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
