import React from 'react';
import { Target, Users, Clock, ShieldCheck } from 'lucide-react';

interface MissionProgressPanelProps {
  areaScanned: number;
  survivorsFound: number;
  totalSurvivors: number;
  timeElapsed: string;
  confidence: number;
}

export const MissionProgressPanel: React.FC<MissionProgressPanelProps> = ({
  areaScanned,
  survivorsFound,
  totalSurvivors,
  timeElapsed,
  confidence,
}) => {
  const isConfidenceWarning = confidence < 50;

  return (
    <div
      style={{
        background: '#080A0B',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        padding: '16px',
        fontFamily: '"JetBrains Mono", monospace',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.08em',
          color: '#A7ADAB',
          marginBottom: '14px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        MISSION PROGRESS
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Area Scanned */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7ADAB', fontSize: '11px' }}>
            <Target size={13} color="#68706D" />
            <span>Area Scanned</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F2F4F2' }}>
            {areaScanned}%
          </span>
        </div>

        {/* Survivors Found */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7ADAB', fontSize: '11px' }}>
            <Users size={13} color="#68706D" />
            <span>Survivors Found</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F0AE63' }}>
            {survivorsFound} / {totalSurvivors}
          </span>
        </div>

        {/* Time Elapsed */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7ADAB', fontSize: '11px' }}>
            <Clock size={13} color="#68706D" />
            <span>Time Elapsed</span>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#F2F4F2' }}>
            {timeElapsed}
          </span>
        </div>

        {/* Confidence Meter */}
        <div style={{ marginTop: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A7ADAB', fontSize: '11px' }}>
              <ShieldCheck size={13} color={isConfidenceWarning ? '#F25D5D' : '#78D6A3'} />
              <span>Autonomy Confidence</span>
            </div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: isConfidenceWarning ? '#F25D5D' : '#F2F4F2',
              }}
            >
              {confidence}%
            </span>
          </div>
          <div
            style={{
              height: '3px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${confidence}%`,
                background: isConfidenceWarning ? '#F25D5D' : '#ffffff',
                boxShadow: isConfidenceWarning ? '0 0 8px #F25D5D' : '0 0 6px rgba(255, 255, 255, 0.6)',
                transition: 'all 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
