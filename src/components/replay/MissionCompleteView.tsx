import { useState, useEffect } from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { Play, Pause, ArrowRight, CheckCircle2 } from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';

interface TimelineEvent {
  time: string;
  timeSec: number;
  label: string;
  detail: string;
}

interface MissionCompleteViewProps {
  onRestartMission: () => void;
  onReturnToCommandCenter: () => void;
}

export const MissionCompleteView: React.FC<MissionCompleteViewProps> = ({
  onRestartMission,
  onReturnToCommandCenter,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(7);

  const timelineEvents: TimelineEvent[] = [
    { time: '00:00', timeSec: 0, label: 'Mission started', detail: 'Autonomous swarm initialized at staging coordinates.' },
    { time: '00:04', timeSec: 4, label: 'Agents assigned', detail: 'Sector A/B grid decomposition finalized.' },
    { time: '00:14', timeSec: 14, label: 'Survivor detected', detail: 'Thermal signature identified in Sector A structure.' },
    { time: '00:20', timeSec: 20, label: 'Route blocked', detail: 'Structural collapse detected on GroundBot Path Alpha.' },
    { time: '00:25', timeSec: 25, label: 'Communication lost', detail: 'Drone-03 mesh disconnection; signal 0%.' },
    { time: '00:28', timeSec: 28, label: 'Mission replanned', detail: 'Dynamic routing shifted Drone-01 to relay role.' },
    { time: '00:35', timeSec: 35, label: 'Human approval', detail: 'Operator authorized revised ground rescue run.' },
    { time: '00:48', timeSec: 48, label: 'Mission complete', detail: 'All 3 survivors secured. Swarm returned to safe hold.' },
  ];

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timelineEvents.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, timelineEvents.length]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050607',
        color: '#F2F4F2',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: '1280px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#78D6A3',
              letterSpacing: '0.12em',
              marginBottom: '12px',
              padding: '4px 12px',
              background: 'rgba(120, 214, 163, 0.1)',
              border: '1px solid rgba(120, 214, 163, 0.3)',
              borderRadius: '20px',
            }}
          >
            <CheckCircle2 size={13} />
            <span>MISSION 07 · OBJECTIVES ACCOMPLISHED</span>
          </div>

          <h1
            style={{
              fontSize: '36px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginBottom: '10px',
            }}
          >
            Mission Successful
          </h1>
          <p style={{ color: '#A7ADAB', fontSize: '15px', maxWidth: '640px', margin: '0 auto' }}>
            All objectives achieved. Agents returned to a safe operational state with complete swarm telemetry recorded.
          </p>
        </div>

        {/* Telemetry Stats Grid matching spec */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {[
            { label: 'MISSION DURATION', value: '00:48:32', color: '#F2F4F2' },
            { label: 'AGENTS DEPLOYED', value: '4 / 4', color: '#F2F4F2' },
            { label: 'SURVIVORS SECURED', value: '3 / 3', color: '#78D6A3' },
            { label: 'MISSION REPLANS', value: '2', color: '#F0AE63' },
            { label: 'FINAL CONFIDENCE', value: '94%', color: '#78D6A3' },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: '#080A0B',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '6px',
                padding: '16px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '6px' }}>
                {stat.label}
              </div>
              <div style={{ fontSize: '20px', fontWeight: 600, color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* 3D Swarm Formation in Safe State */}
        <div
          style={{
            height: '380px',
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '32px',
          }}
        >
          <SwarmCanvas mode="hero" interactive={true} />
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#78D6A3',
              background: 'rgba(8, 10, 11, 0.85)',
              padding: '6px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(120, 214, 163, 0.3)',
            }}
          >
            ● ALL 4 AGENTS COMM LINK RESTORED & SAFE
          </div>
        </div>

        {/* Interactive Mission Replay Timeline */}
        <div
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '32px',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#68706D', letterSpacing: '0.08em' }}>
                MISSION TIMELINE REPLAY
              </div>
              <div style={{ fontSize: '15px', color: '#F2F4F2', fontWeight: 500, marginTop: '2px' }}>
                {timelineEvents[currentStep].time} — {timelineEvents[currentStep].label}
              </div>
            </div>

            {/* Playback Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  playUiTick();
                  setCurrentStep((p) => Math.max(0, p - 1));
                }}
                disabled={currentStep === 0}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F2F4F2',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.4 : 1,
                }}
              >
                ◀
              </button>

              <button
                onClick={() => {
                  playUiTick();
                  setIsPlaying(!isPlaying);
                }}
                style={{
                  background: '#F2F4F2',
                  border: 'none',
                  color: '#050607',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '11px',
                }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  playUiTick();
                  setCurrentStep((p) => Math.min(timelineEvents.length - 1, p + 1));
                }}
                disabled={currentStep === timelineEvents.length - 1}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F2F4F2',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: currentStep === timelineEvents.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === timelineEvents.length - 1 ? 0.4 : 1,
                }}
              >
                ▶
              </button>

              <button
                onClick={() => {
                  playUiTick();
                  setPlaybackSpeed((s) => (s === 1 ? 2 : s === 2 ? 4 : 1));
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#A7ADAB',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {playbackSpeed}×
              </button>
            </div>
          </div>

          {/* Stepper scrubber bar */}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${timelineEvents.length}, 1fr)`, gap: '8px' }}>
            {timelineEvents.map((evt, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    playUiTick();
                    setCurrentStep(idx);
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      height: '4px',
                      borderRadius: '2px',
                      background: isActive ? '#ffffff' : isPast ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)',
                      boxShadow: isActive ? '0 0 8px #ffffff' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  />
                  <div style={{ fontSize: '10px', color: isActive ? '#F2F4F2' : '#68706D' }}>
                    {evt.time}
                  </div>
                  <div
                    style={{
                      fontSize: '10px',
                      color: isActive ? '#F2F4F2' : '#A7ADAB',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {evt.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Step Detail Box */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '4px',
              fontSize: '12px',
              color: '#A7ADAB',
            }}
          >
            <strong style={{ color: '#F2F4F2' }}>Telemetry Context:</strong>{' '}
            {timelineEvents[currentStep].detail}
          </div>
        </div>

        {/* Action CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              playUiTick();
              onReturnToCommandCenter();
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              color: '#F2F4F2',
              padding: '12px 24px',
              borderRadius: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            ← Back to Command Center
          </button>

          <button
            onClick={() => {
              playSuccessChirp();
              onRestartMission();
            }}
            style={{
              background: '#F2F4F2',
              border: 'none',
              color: '#050607',
              padding: '12px 28px',
              borderRadius: '6px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Launch New Mission</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
