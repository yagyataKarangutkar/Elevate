import React, { useState, useEffect } from 'react';
import { FlowNavbar } from './FlowNavbar';
import {
  ArrowRight,
  Check,
  Battery,
  Wifi,
  AlertTriangle,
  Bot,
  Plane,
} from 'lucide-react';
import { playUiTick, playReplanningTone, playAlertAlarm } from '../../utils/audio';
import type { AgentId, FlowStep, MissionAgentConfig, MissionConfig } from '../../types';

interface MissionInputViewProps {
  onNavigate: (step: FlowStep) => void;
  onGeneratePlan: (config: MissionConfig) => void;
  initialObjective?: string;
  initialSelectedAgentIds?: AgentId[];
}

export const DEMO_AGENTS: MissionAgentConfig[] = [
  {
    id: 'D1',
    name: 'DRONE 01',
    type: 'Drone',
    capabilities: ['Thermal search', 'Aerial mapping', 'Hazard detection'],
    battery: 82,
    signal: 96,
  },
  {
    id: 'D2',
    name: 'DRONE 02',
    type: 'Drone',
    capabilities: ['Optical camera', 'Aerial sweep', 'Corridor survey'],
    battery: 74,
    signal: 94,
  },
  {
    id: 'D3',
    name: 'DRONE 03',
    type: 'Drone',
    capabilities: ['Relay bridge', 'Search support', 'Mesh link'],
    battery: 61,
    signal: 91,
  },
  {
    id: 'G1',
    name: 'GROUNDBOT 01',
    type: 'Ground',
    capabilities: ['Rescue support', 'Aid payload', 'Ground extraction'],
    battery: 91,
    signal: 98,
  },
];

const PRESETS = [
  'Find survivors in the affected area',
  'Search Sector A and Sector B',
  'Find survivors and bring help to Sector C',
];

export const MissionInputView: React.FC<MissionInputViewProps> = ({
  onNavigate,
  onGeneratePlan,
  initialObjective = 'Search the earthquake zone and rescue survivors.',
  initialSelectedAgentIds = ['D1', 'D2', 'D3', 'G1'],
}) => {
  const [objective, setObjective] = useState<string>(initialObjective);
  const [selectedAgentIds, setSelectedAgentIds] = useState<AgentId[]>(initialSelectedAgentIds);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  const toggleAgent = (id: AgentId) => {
    playUiTick();
    setErrorMessage(null);
    setSelectedAgentIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((a) => a !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    playUiTick();
    setErrorMessage(null);
    setSelectedAgentIds(['D1', 'D2', 'D3', 'G1']);
  };

  const handleDeselectAll = () => {
    playUiTick();
    setSelectedAgentIds([]);
  };

  const handleGenerate = () => {
    // 1. Validate mission text exists
    if (!objective.trim()) {
      playAlertAlarm();
      setErrorMessage('Please provide a mission objective before generating a plan.');
      return;
    }

    // 2. Validate at least one agent is selected
    if (selectedAgentIds.length === 0) {
      playAlertAlarm();
      setErrorMessage('At least one agent must be selected to execute the mission.');
      return;
    }

    setErrorMessage(null);
    playReplanningTone();

    // 3. Save mission configuration and navigate
    const missionConfig: MissionConfig = {
      objective: objective.trim(),
      selectedAgentIds,
      agents: DEMO_AGENTS.filter((a) => selectedAgentIds.includes(a.id)),
    };

    onGeneratePlan(missionConfig);
  };

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
        currentStep="mission_input"
        onNavigate={onNavigate}
        title="02. MISSION INPUT CONFIGURATION"
      />

      <main
        style={{
          flex: 1,
          maxWidth: '1080px',
          width: '100%',
          margin: '0 auto',
          padding: isMobile ? '24px 16px 48px' : '40px 24px 64px',
          display: 'flex',
          flexDirection: 'column',
          gap: isMobile ? '20px' : '28px',
        }}
      >
        {/* Header Eyebrow & Title per Spec Section 13 */}
        <div>
          <div
            style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#68706D',
              letterSpacing: '0.12em',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#78D6A3',
                display: 'inline-block',
              }}
            />
            <span>STAGE 02 · MISSION GOAL</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(24px, 5.5vw, 32px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '8px',
              fontFamily: '"Inter", sans-serif',
              color: '#F2F4F2',
            }}
          >
            What should the swarm do?
          </h1>

          <p
            style={{
              color: '#A7ADAB',
              fontSize: isMobile ? '13px' : '14px',
              maxWidth: '680px',
              lineHeight: 1.6,
            }}
          >
            Give MissionMind a goal in one sentence.
          </p>
        </div>

        {/* 1. MISSION OBJECTIVE SECTION */}
        <section
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '6px',
            padding: isMobile ? '16px' : '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label
              htmlFor="mission-objective-input"
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#A7ADAB',
                letterSpacing: '0.06em',
                fontWeight: 500,
              }}
            >
              MISSION GOAL
            </label>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
              }}
            >
              PLAIN ENGLISH DIRECTIVE
            </span>
          </div>

          <textarea
            id="mission-objective-input"
            value={objective}
            onChange={(e) => {
              setObjective(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            placeholder="e.g. Search the earthquake zone and rescue survivors."
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.16)',
              borderRadius: '4px',
              padding: '14px 16px',
              color: '#F2F4F2',
              fontFamily: '"Inter", sans-serif',
              fontSize: '14px',
              lineHeight: 1.6,
              outline: 'none',
              resize: 'none',
              transition: 'border-color 0.2s ease',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)')}
          />

          {/* Quick preset chips */}
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
              QUICK DEMO PRESETS:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESETS.map((preset, idx) => {
                const isSelected = objective === preset;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playUiTick();
                      setObjective(preset);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    style={{
                      background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${
                        isSelected ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)'
                      }`,
                      borderRadius: '16px',
                      color: isSelected ? '#F2F4F2' : '#A7ADAB',
                      fontSize: '11px',
                      fontFamily: '"JetBrains Mono", monospace',
                      padding: '4px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.color = '#F2F4F2';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        e.currentTarget.style.color = '#A7ADAB';
                      }
                    }}
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 2. AGENT SELECTION SECTION (BELOW OBJECTIVE INPUT) */}
        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: '12px',
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  color: '#A7ADAB',
                  letterSpacing: '0.06em',
                  fontWeight: 500,
                }}
              >
                SWARM AGENT ALLOCATION
              </div>
              <div style={{ fontSize: isMobile ? '11px' : '12px', color: '#68706D', marginTop: '2px' }}>
                Select available aerial and ground assets to deploy for this objective.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: isMobile ? 'space-between' : 'flex-end',
                width: isMobile ? '100%' : 'auto',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '11px',
                  color: selectedAgentIds.length > 0 ? '#78D6A3' : '#F25D5D',
                }}
              >
                {selectedAgentIds.length} OF {DEMO_AGENTS.length} SELECTED
              </span>

              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '3px',
                    color: '#A7ADAB',
                    fontSize: '10px',
                    fontFamily: '"JetBrains Mono", monospace',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F2F4F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ADAB')}
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '3px',
                    color: '#A7ADAB',
                    fontSize: '10px',
                    fontFamily: '"JetBrains Mono", monospace',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#F2F4F2')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#A7ADAB')}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* 4 Demo Agents Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
            }}
          >
            {DEMO_AGENTS.map((agent) => {
              const isSelected = selectedAgentIds.includes(agent.id);

              return (
                <div
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  style={{
                    background: isSelected ? '#080A0B' : '#050607',
                    border: `1px solid ${
                      isSelected ? 'rgba(255, 255, 255, 0.28)' : 'rgba(255, 255, 255, 0.08)'
                    }`,
                    borderRadius: '6px',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '14px',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 2px 12px rgba(0, 0, 0, 0.35)' : 'none',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.currentTarget.style.background = '#080A0B';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.background = '#050607';
                    }
                  }}
                >
                  {/* Top Bar: Name, Type, Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '4px',
                          background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {agent.type === 'Drone' ? (
                          <Plane size={13} color={isSelected ? '#F2F4F2' : '#68706D'} />
                        ) : (
                          <Bot size={13} color={isSelected ? '#F2F4F2' : '#68706D'} />
                        )}
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: isSelected ? '#F2F4F2' : '#A7ADAB',
                          }}
                        >
                          {agent.name}
                        </div>
                        <div
                          style={{
                            fontFamily: '"JetBrains Mono", monospace',
                            fontSize: '10px',
                            color: '#68706D',
                          }}
                        >
                          TYPE: {agent.type.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    {/* Custom Checkbox */}
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '3px',
                        border: `1px solid ${
                          isSelected ? '#78D6A3' : 'rgba(255, 255, 255, 0.2)'
                        }`,
                        background: isSelected ? 'rgba(120, 214, 163, 0.15)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {isSelected && <Check size={12} color="#78D6A3" strokeWidth={3} />}
                    </div>
                  </div>

                  {/* Capabilities List */}
                  <div>
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '9px',
                        color: '#68706D',
                        letterSpacing: '0.04em',
                        marginBottom: '6px',
                      }}
                    >
                      CAPABILITIES:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {agent.capabilities.map((cap, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: isSelected ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                            border: `1px solid ${
                              isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.05)'
                            }`,
                            borderRadius: '3px',
                            padding: '2px 7px',
                            fontSize: '10px',
                            fontFamily: '"JetBrains Mono", monospace',
                            color: isSelected ? '#A7ADAB' : '#68706D',
                          }}
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Stats: Battery & Signal */}
                  <div
                    style={{
                      borderTop: `1px solid ${
                        isSelected ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'
                      }`,
                      paddingTop: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Battery size={13} color={agent.battery > 70 ? '#78D6A3' : '#F0AE63'} />
                      <span style={{ color: isSelected ? '#F2F4F2' : '#68706D' }}>
                        {agent.battery}%
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Wifi size={13} color="#78D6A3" />
                      <span style={{ color: isSelected ? '#F2F4F2' : '#68706D' }}>
                        {agent.signal}%
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '9px',
                        color: isSelected ? '#78D6A3' : '#68706D',
                        fontWeight: 600,
                      }}
                    >
                      {isSelected ? 'READY' : 'STANDBY'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Validation Warning Alert */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(242, 93, 93, 0.1)',
              border: '1px solid rgba(242, 93, 93, 0.3)',
              borderRadius: '4px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#F25D5D',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
            }}
          >
            <AlertTriangle size={14} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 3. BOTTOM ACTIONS: Return and GENERATE PLAN */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            flexDirection: isMobile ? 'column-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              playUiTick();
              onNavigate('landing');
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#A7ADAB',
              padding: '12px 18px',
              minHeight: '44px',
              borderRadius: '4px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
            ← Return to Landing
          </button>

          {/* CREATE PLAN CTA button per Spec Section 13 & 46 */}
          <button
            type="button"
            onClick={handleGenerate}
            style={{
              background: '#F2F4F2',
              color: '#050607',
              border: 'none',
              borderRadius: '4px',
              padding: '14px 28px',
              minHeight: '44px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 2px 12px rgba(255, 255, 255, 0.15)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>Create Plan</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};
