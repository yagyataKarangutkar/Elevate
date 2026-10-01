import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { playUiTick, playSuccessChirp, playReplanningTone } from '../../utils/audio';

interface MissionCreationSectionProps {
  onStartMission: (objective: string) => void;
}

export const MissionCreationSection: React.FC<MissionCreationSectionProps> = ({
  onStartMission,
}) => {
  const [objective, setObjective] = useState<string>(
    'Search the affected area and rescue survivors.'
  );
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<number>(4); // 4 = ready

  const presets = [
    'Find survivors in the affected area',
    'Search Sector A and Sector B',
    'Find survivors and bring help to Sector C',
  ];

  const handleGenerate = () => {
    playReplanningTone();
    setIsGenerating(true);
    setGenerationStep(1);

    setTimeout(() => {
      setGenerationStep(2);
      playUiTick();
    }, 400);

    setTimeout(() => {
      setGenerationStep(3);
      playUiTick();
    }, 800);

    setTimeout(() => {
      setGenerationStep(4);
      playUiTick();
    }, 1200);

    setTimeout(() => {
      setGenerationStep(5);
      setIsGenerating(false);
      playSuccessChirp();
    }, 1600);
  };

  const steps = [
    {
      num: 1,
      title: 'UNDERSTANDING YOUR GOAL',
      desc: 'Interpreting disaster parameters and primary rescue objectives.',
    },
    {
      num: 2,
      title: 'BREAKING IT INTO TASKS',
      desc: 'Decomposing mission into aerial sweeps, relay, and ground aid.',
    },
    {
      num: 3,
      title: 'CHOOSING THE RIGHT ROBOTS',
      desc: 'Matching drone sensors and GroundBot capabilities to tasks.',
    },
    {
      num: 4,
      title: 'PLANNING THE SAFEST ROUTES',
      desc: 'Validating flight corridors and ground traversability.',
    },
    {
      num: 5,
      title: 'PLAN READY',
      desc: 'Swarm tasks confirmed feasible with zero initial conflicts.',
    },
  ];

  return (
    <section
      id="mission-creation"
      style={{
        padding: '80px 32px',
        maxWidth: '1360px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: '#68706D',
          letterSpacing: '0.12em',
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78D6A3' }} />
        <span>04. INTERACTIVE DEMO</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Input and Objectives */}
        <div>
          <h2
            style={{
              fontSize: '32px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F2F4F2',
              lineHeight: 1.25,
              marginBottom: '14px',
            }}
          >
            What should the swarm do?
          </h2>
          <p
            style={{
              color: '#A7ADAB',
              fontSize: '14px',
              lineHeight: 1.6,
              marginBottom: '28px',
              maxWidth: '480px',
            }}
          >
            Give MissionMind a goal in one sentence.
          </p>

          {/* Prompt Input Box */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '16px',
            }}
          >
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Search the affected area and rescue survivors."
              rows={3}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: '#F2F4F2',
                fontSize: '14px',
                fontFamily: '"Inter", sans-serif',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.5,
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  color: '#68706D',
                }}
              >
                SWARM ENGINE: READY
              </span>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.24)',
                  color: '#F2F4F2',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: '"JetBrains Mono", monospace',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                }}
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={13} className="spin" />
                    <span>Planning...</span>
                  </>
                ) : (
                  <>
                    <span>Create Plan →</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick preset chips per Spec Section 13 */}
          <div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
                marginBottom: '8px',
                letterSpacing: '0.04em',
              }}
            >
              TRY:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playUiTick();
                    setObjective(preset);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '20px',
                    color: '#A7ADAB',
                    fontSize: '11px',
                    fontFamily: '"JetBrains Mono", monospace',
                    padding: '5px 12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Stepper and Mission Plan Ready Panel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '24px',
            alignItems: 'start',
          }}
        >
          {/* Stepper matching visual reference */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {steps.map((st) => {
              const isDone = generationStep >= st.num;
              const isCurrent = generationStep === st.num;

              return (
                <div key={st.num} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      border: `1px solid ${
                        isDone ? '#ffffff' : 'rgba(255, 255, 255, 0.15)'
                      }`,
                      background: isCurrent
                        ? 'rgba(255, 255, 255, 0.15)'
                        : isDone
                        ? 'rgba(255, 255, 255, 0.05)'
                        : 'transparent',
                      color: isDone ? '#ffffff' : '#68706D',
                      fontSize: '11px',
                      fontFamily: '"JetBrains Mono", monospace',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {st.num}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: isDone ? '#F2F4F2' : '#68706D',
                      }}
                    >
                      {st.title}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: isDone ? '#A7ADAB' : '#454C4A',
                        marginTop: '2px',
                      }}
                    >
                      {st.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MISSION PLAN READY Card matching bottom-left screenshot */}
          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '6px',
              padding: '18px',
              fontFamily: '"JetBrains Mono", monospace',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div style={{ fontSize: '10px', color: '#68706D', letterSpacing: '0.08em', marginBottom: '4px' }}>
              READY TO START
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                paddingBottom: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <span style={{ fontSize: '11px', color: '#A7ADAB' }}>Mission Status</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#78D6A3' }}>Can be completed</span>
            </div>

            {/* Task list matching visual reference */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { id: 'D1', task: 'Search Sector A' },
                { id: 'D2', task: 'Search Sector B' },
                { id: 'D3', task: 'Relay + Search' },
                { id: 'G1', task: 'Rescue Support' },
              ].map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        padding: '1px 6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        fontSize: '10px',
                        color: '#F2F4F2',
                      }}
                    >
                      {item.id}
                    </span>
                    <span style={{ color: '#A7ADAB' }}>{item.task}</span>
                  </div>
                  <Check size={13} color="#78D6A3" />
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                playSuccessChirp();
                onStartMission(objective);
              }}
              style={{
                width: '100%',
                background: '#F2F4F2',
                color: '#050607',
                border: 'none',
                borderRadius: '4px',
                padding: '10px 14px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.04em',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s',
              }}
            >
              <span>Start Mission →</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
