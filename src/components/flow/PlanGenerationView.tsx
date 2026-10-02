import { useState, useEffect } from 'react';
import { FlowNavbar } from './FlowNavbar';
import { Loader2, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import type { FlowStep } from '../../types';

interface PlanGenerationViewProps {
  objective: string;
  onNavigate: (step: FlowStep) => void;
  onGenerationComplete: () => void;
}

interface StepItem {
  id: string;
  num: number;
  label: string;
  detail: string;
}

const PLANNING_SEQUENCE: StepItem[] = [
  {
    id: 'step-1',
    num: 1,
    label: 'UNDERSTANDING YOUR GOAL',
    detail: 'Reading your mission goal and analyzing disaster parameters.',
  },
  {
    id: 'step-2',
    num: 2,
    label: 'BREAKING IT INTO TASKS',
    detail: 'Splitting your goal into search sectors, communication links, and rescue tasks.',
  },
  {
    id: 'step-3',
    num: 3,
    label: 'CHOOSING THE RIGHT ROBOTS',
    detail: 'Matching drone sensors and GroundBot rescue capabilities to each task.',
  },
  {
    id: 'step-4',
    num: 4,
    label: 'PLANNING THE SAFEST ROUTES',
    detail: 'Checking flight paths, signal coverage, and ground traversability.',
  },
  {
    id: 'step-5',
    num: 5,
    label: 'PLAN READY',
    detail: 'All tasks assigned. Mission can be completed safely.',
  },
];

export const PlanGenerationView: React.FC<PlanGenerationViewProps> = ({
  objective,
  onNavigate,
  onGenerationComplete,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(1);
  const [progressPercent, setProgressPercent] = useState<number>(20);
  const [isFeasible, setIsFeasible] = useState<boolean>(false);

  useEffect(() => {
    // Step 1: READING MISSION (0ms - 450ms)
    const t1 = setTimeout(() => {
      // Step 2: DECOMPOSING TASKS
      setCurrentStepIndex(2);
      setProgressPercent(40);
      playUiTick();
    }, 450);

    const t2 = setTimeout(() => {
      // Step 3: MATCHING CAPABILITIES
      setCurrentStepIndex(3);
      setProgressPercent(60);
      playUiTick();
    }, 900);

    const t3 = setTimeout(() => {
      // Step 4: CHECKING CONSTRAINTS
      setCurrentStepIndex(4);
      setProgressPercent(80);
      playUiTick();
    }, 1350);

    const t4 = setTimeout(() => {
      // Step 5: VALIDATING PLAN
      setCurrentStepIndex(5);
      setProgressPercent(100);
      playUiTick();
    }, 1800);

    const t5 = setTimeout(() => {
      // Display: MISSION FEASIBLE
      setIsFeasible(true);
      playSuccessChirp();
    }, 2250);

    const t6 = setTimeout(() => {
      // Transition to Mission Plan screen
      onGenerationComplete();
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [onGenerationComplete]);

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
        currentStep="plan_generation"
        onNavigate={onNavigate}
        title="03. PLAN GENERATION PIPELINE"
      />

      <main
        style={{
          flex: 1,
          maxWidth: '820px',
          width: '100%',
          margin: '0 auto',
          padding: 'clamp(28px, 6vw, 60px) clamp(16px, 4vw, 24px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: '640px' }}>
          {/* Eyebrow & Live Status Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: isFeasible ? '#78D6A3' : '#A7ADAB',
                letterSpacing: '0.12em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'color 0.3s ease',
              }}
            >
              {isFeasible ? (
                <>
                  <ShieldCheck size={14} color="#78D6A3" />
                  <span style={{ fontWeight: 600 }}>PLAN READY · MISSION CAN BE COMPLETED</span>
                </>
              ) : (
                <>
                  <Loader2 size={13} className="spin" color="#78D6A3" />
                  <span>BUILDING YOUR MISSION PLAN</span>
                </>
              )}
            </div>

            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '12px',
                color: isFeasible ? '#78D6A3' : '#F2F4F2',
                fontWeight: 600,
              }}
            >
              {isFeasible ? '100%' : `${progressPercent}%`}
            </div>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '3px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: '#78D6A3',
                transition: 'width 0.4s ease-out',
                boxShadow: isFeasible ? '0 0 12px #78D6A3' : '0 0 8px rgba(120, 214, 163, 0.4)',
              }}
            />
          </div>

          {/* Mission Objective Card */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '16px 20px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
                marginBottom: '4px',
                letterSpacing: '0.08em',
              }}
            >
              MISSION OBJECTIVE
            </div>
            <div
              style={{
                fontSize: '14px',
                color: '#F2F4F2',
                fontFamily: '"Inter", sans-serif',
              }}
            >
              "{objective}"
            </div>
          </div>

          {/* Sequential Planning Steps */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px',
            }}
          >
            {PLANNING_SEQUENCE.map((st) => {
              const isCompleted = currentStepIndex > st.num || isFeasible;
              const isCurrent = currentStepIndex === st.num && !isFeasible;

              return (
                <div
                  key={st.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    opacity: isCompleted || isCurrent ? 1 : 0.3,
                    transition: 'opacity 0.25s ease',
                  }}
                >
                  {/* Step status icon */}
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      border: `1px solid ${
                        isCompleted
                          ? '#78D6A3'
                          : isCurrent
                          ? '#ffffff'
                          : 'rgba(255, 255, 255, 0.15)'
                      }`,
                      background: isCompleted
                        ? 'rgba(120, 214, 163, 0.15)'
                        : isCurrent
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {isCompleted ? (
                      <Check size={12} color="#78D6A3" strokeWidth={3} />
                    ) : isCurrent ? (
                      <Loader2 size={12} className="spin" color="#ffffff" />
                    ) : (
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: '"JetBrains Mono", monospace',
                          color: '#68706D',
                        }}
                      >
                        {st.num}
                      </span>
                    )}
                  </div>

                  {/* Step details */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '12px',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: isCompleted ? '#78D6A3' : isCurrent ? '#F2F4F2' : '#68706D',
                      }}
                    >
                      {st.label}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: isCompleted || isCurrent ? '#A7ADAB' : '#454C4A',
                        marginTop: '2px',
                        lineHeight: 1.4,
                      }}
                    >
                      {st.detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MISSION FEASIBLE Banner (when complete) */}
          {isFeasible && (
            <div
              style={{
                marginTop: '20px',
                background: 'rgba(120, 214, 163, 0.1)',
                border: '1px solid rgba(120, 214, 163, 0.35)',
                borderRadius: '6px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'fadeIn 0.25s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Check size={16} color="#78D6A3" strokeWidth={3} />
                <span
                  style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#78D6A3',
                    letterSpacing: '0.06em',
                  }}
                >
                  STATUS: MISSION FEASIBLE
                </span>
              </div>
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  color: '#A7ADAB',
                }}
              >
                Opening Mission Plan...
              </span>
            </div>
          )}

          {/* Manual proceed button */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => {
                playSuccessChirp();
                onGenerationComplete();
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
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#F2F4F2';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#A7ADAB';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }}
            >
              <span>{isFeasible ? 'View Plan Details Now' : 'Skip Sequence'}</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
