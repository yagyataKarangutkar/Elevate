import React from 'react';
import { FlowNavbar } from './FlowNavbar';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Layers,
  MapPin,
  Bot,
  Plane,
} from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import type { AgentId, FlowStep, MissionConfig } from '../../types';

interface MissionPlanViewProps {
  objective: string;
  selectedAgents: AgentId[];
  missionConfig?: MissionConfig;
  onNavigate: (step: FlowStep) => void;
  onContinueToCommandCenter: () => void;
}

interface DemoZone {
  id: string;
  name: string;
  danger: number;
  survivorProb: 'HIGH' | 'MEDIUM' | 'LOW';
  priority: string;
  color: string;
}

interface DemoTask {
  number: string;
  name: string;
  assignedAgent: string;
  agentType: 'Drone' | 'Ground';
  requiredCapability: string;
  status: 'READY' | 'QUEUED';
  priority: '01 (CRITICAL)' | '01 (HIGH)' | '02 (MEDIUM)' | '03 (LOW)';
  zone: string;
}

const DEMO_ZONES: DemoZone[] = [
  {
    id: 'zone-a',
    name: 'ZONE A',
    danger: 91,
    survivorProb: 'HIGH',
    priority: '01',
    color: '#F25D5D',
  },
  {
    id: 'zone-b',
    name: 'ZONE B',
    danger: 67,
    survivorProb: 'MEDIUM',
    priority: '02',
    color: '#F0AE63',
  },
  {
    id: 'zone-c',
    name: 'ZONE C',
    danger: 43,
    survivorProb: 'LOW',
    priority: '03',
    color: '#78D6A3',
  },
];

const DEMO_TASKS: DemoTask[] = [
  {
    number: '01',
    name: 'Survey Zone A',
    assignedAgent: 'DRONE-02',
    agentType: 'Drone',
    requiredCapability: 'Aerial search & Mapping',
    status: 'READY',
    priority: '01 (HIGH)',
    zone: 'ZONE A',
  },
  {
    number: '02',
    name: 'Thermal Scan Zone A',
    assignedAgent: 'DRONE-01',
    agentType: 'Drone',
    requiredCapability: 'Thermal imaging',
    status: 'READY',
    priority: '01 (CRITICAL)',
    zone: 'ZONE A',
  },
  {
    number: '03',
    name: 'Survey Zone B',
    assignedAgent: 'DRONE-03',
    agentType: 'Drone',
    requiredCapability: 'Mapping',
    status: 'QUEUED',
    priority: '02 (MEDIUM)',
    zone: 'ZONE B',
  },
  {
    number: '04',
    name: 'Visual Scan Zone B',
    assignedAgent: 'DRONE-02',
    agentType: 'Drone',
    requiredCapability: 'Optical camera',
    status: 'QUEUED',
    priority: '02 (MEDIUM)',
    zone: 'ZONE B',
  },
  {
    number: '05',
    name: 'Survey Zone C',
    assignedAgent: 'DRONE-03',
    agentType: 'Drone',
    requiredCapability: 'Communication relay / Visual search',
    status: 'QUEUED',
    priority: '03 (LOW)',
    zone: 'ZONE C',
  },
  {
    number: '06',
    name: 'Identify Survivors',
    assignedAgent: 'DRONE-01',
    agentType: 'Drone',
    requiredCapability: 'Thermal imaging & Aerial search',
    status: 'QUEUED',
    priority: '01 (HIGH)',
    zone: 'ZONE A',
  },
  {
    number: '07',
    name: 'Confirm Survivor Location',
    assignedAgent: 'DRONE-03',
    agentType: 'Drone',
    requiredCapability: 'Communication relay',
    status: 'QUEUED',
    priority: '01 (HIGH)',
    zone: 'ZONE A',
  },
  {
    number: '08',
    name: 'Deliver Aid Kit',
    assignedAgent: 'GROUND-01',
    agentType: 'Ground',
    requiredCapability: 'Aid payload & Ground movement',
    status: 'QUEUED',
    priority: '01 (CRITICAL)',
    zone: 'ZONE A',
  },
  {
    number: '09',
    name: 'Rescue Survivor',
    assignedAgent: 'GROUND-01',
    agentType: 'Ground',
    requiredCapability: 'Survivor rescue',
    status: 'QUEUED',
    priority: '01 (CRITICAL)',
    zone: 'ZONE A',
  },
];

export const MissionPlanView: React.FC<MissionPlanViewProps> = ({
  objective,
  selectedAgents,
  missionConfig,
  onNavigate,
  onContinueToCommandCenter,
}) => {
  const displayObjective = missionConfig?.objective || objective;
  const agentCount = missionConfig?.selectedAgentIds.length || selectedAgents.length || 4;

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
        currentStep="mission_plan"
        onNavigate={onNavigate}
        title="04. MISSION PLAN SPECIFICATION"
      />

      <main
        style={{
          flex: 1,
          maxWidth: '1160px',
          width: '100%',
          margin: '0 auto',
          padding: '36px 24px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Header Block per Spec Section 15 & 16 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#78D6A3',
                letterSpacing: '0.12em',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <ShieldCheck size={14} color="#78D6A3" />
              <span>STAGE 04 · PLAN READY</span>
            </div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '8px',
                fontFamily: '"Inter", sans-serif',
                color: '#F2F4F2',
              }}
            >
              Here is what MissionMind plans to do.
            </h1>
            <p
              style={{
                color: '#A7ADAB',
                fontSize: '14px',
                maxWidth: '640px',
              }}
            >
              All four robots have a suitable task and a reachable route. The mission can be completed as planned.
            </p>
          </div>

          {/* Feasible Status Stamp per Spec Section 16 */}
          <div
            style={{
              background: 'rgba(120, 214, 163, 0.1)',
              border: '1px solid rgba(120, 214, 163, 0.35)',
              borderRadius: '6px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <CheckCircle2 size={22} color="#78D6A3" />
            <div>
              <div
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#78D6A3',
                }}
              >
                Mission can be completed
              </div>
              <div
                style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '10px',
                  color: '#A7ADAB',
                  letterSpacing: '0.04em',
                  marginTop: '2px',
                }}
              >
                Feasibility: Confirmed · All routes reachable
              </div>
            </div>
          </div>
        </div>

        {/* 1. TOP MISSION SUMMARY BAR (9 TASKS | 4 AGENTS | 3 ZONES | 1 RESCUE OBJECTIVE) */}
        <section
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.14)',
            borderRadius: '6px',
            padding: '18px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#68706D', marginBottom: '4px' }}>
              SCHEDULED TASKS
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#F2F4F2', fontFamily: '"JetBrains Mono", monospace' }}>
              9 TASKS
            </div>
            <div style={{ fontSize: '11px', color: '#78D6A3', marginTop: '2px' }}>
              Decomposed & assigned
            </div>
          </div>

          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#68706D', marginBottom: '4px' }}>
              ACTIVE SWARM
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#F2F4F2', fontFamily: '"JetBrains Mono", monospace' }}>
              {agentCount} AGENTS
            </div>
            <div style={{ fontSize: '11px', color: '#A7ADAB', marginTop: '2px' }}>
              Heterogeneous fleet
            </div>
          </div>

          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#68706D', marginBottom: '4px' }}>
              OPERATIONAL SECTORS
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#F2F4F2', fontFamily: '"JetBrains Mono", monospace' }}>
              3 ZONES
            </div>
            <div style={{ fontSize: '11px', color: '#A7ADAB', marginTop: '2px' }}>
              Zones A, B & C
            </div>
          </div>

          <div>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#68706D', marginBottom: '4px' }}>
              PRIMARY TARGET
            </div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: '#F2F4F2', fontFamily: '"JetBrains Mono", monospace' }}>
              1 RESCUE OBJECTIVE
            </div>
            <div style={{ fontSize: '11px', color: '#A7ADAB', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Search & survivor recovery
            </div>
          </div>

          <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.08)', paddingLeft: '16px' }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '10px', color: '#68706D', marginBottom: '4px' }}>
              PLAN FEASIBILITY
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#78D6A3', fontFamily: '"JetBrains Mono", monospace' }}>
              FEASIBLE
            </div>
            <div style={{ fontSize: '11px', color: '#78D6A3', marginTop: '2px' }}>
              Validated · Zero conflicts
            </div>
          </div>
        </section>

        {/* Target Objective Directive Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '4px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ color: '#68706D' }}>TARGET DIRECTIVE:</span>
            <span style={{ color: '#F2F4F2', fontFamily: '"Inter", sans-serif' }}>"{displayObjective}"</span>
          </div>
          <span style={{ color: '#78D6A3' }}>P2P MESH: SYNCED</span>
        </div>

        {/* 2. THREE ZONES SECTION */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#A7ADAB',
                letterSpacing: '0.06em',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <MapPin size={13} />
              <span>DISASTER SECTOR CLASSIFICATION · 3 ZONES</span>
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
              }}
            >
              RISK & SURVIVOR PROBABILITY PROFILE
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            {DEMO_ZONES.map((zone) => (
              <div
                key={zone.id}
                style={{
                  background: '#080A0B',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '6px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: zone.color,
                        boxShadow: `0 0 8px ${zone.color}`,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#F2F4F2',
                      }}
                    >
                      {zone.name}
                    </span>
                  </div>

                  <span
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#A7ADAB',
                    }}
                  >
                    PRIORITY {zone.priority}
                  </span>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#68706D', marginBottom: '2px' }}>
                      DANGER INDEX
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Flame size={12} color={zone.color} />
                      <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '16px', fontWeight: 600, color: zone.color }}>
                        {zone.danger}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '9px', color: '#68706D', marginBottom: '2px' }}>
                      SURVIVOR PROBABILITY
                    </div>
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: zone.color,
                        marginTop: '3px',
                      }}
                    >
                      {zone.survivorProb}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. EXACTLY 9 DEMO TASKS MATRIX */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#A7ADAB',
                letterSpacing: '0.06em',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Layers size={13} />
              <span>SWARM TASK ASSIGNMENTS · 9 DEMO TASKS</span>
            </div>
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
              }}
            >
              CAPABILITY-BASED AUTO DISPATCH
            </span>
          </div>

          <div
            style={{
              background: '#080A0B',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              overflowX: 'auto',
            }}
          >
            <div style={{ minWidth: '700px' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '70px 2.2fr 1.4fr 2fr 110px 120px',
                padding: '12px 18px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '10px',
                color: '#68706D',
                letterSpacing: '0.06em',
              }}
            >
              <div>TASK #</div>
              <div>TASK NAME & SECTOR</div>
              <div>ASSIGNED AGENT</div>
              <div>REQUIRED CAPABILITY</div>
              <div>STATUS</div>
              <div style={{ textAlign: 'right' }}>PRIORITY</div>
            </div>

            {/* 9 Task Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {DEMO_TASKS.map((task, idx) => {
                const isReady = task.status === 'READY';
                const isCritical = task.priority.includes('CRITICAL');
                const isHigh = task.priority.includes('HIGH');

                return (
                  <div
                    key={task.number}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '70px 2.2fr 1.4fr 2fr 110px 120px',
                      padding: '14px 18px',
                      alignItems: 'center',
                      borderBottom: idx < DEMO_TASKS.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                      background: isReady ? 'rgba(255, 255, 255, 0.015)' : 'transparent',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isReady ? 'rgba(255, 255, 255, 0.015)' : 'transparent';
                    }}
                  >
                    {/* Task Number */}
                    <div
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#68706D',
                      }}
                    >
                      {task.number}
                    </div>

                    {/* Task Name & Sector Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#F2F4F2',
                          fontFamily: '"Inter", sans-serif',
                        }}
                      >
                        {task.name}
                      </span>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '9px',
                          color: task.zone === 'ZONE A' ? '#F25D5D' : task.zone === 'ZONE B' ? '#F0AE63' : '#78D6A3',
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '1px 5px',
                          borderRadius: '2px',
                        }}
                      >
                        {task.zone}
                      </span>
                    </div>

                    {/* Assigned Agent */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {task.agentType === 'Drone' ? (
                        <Plane size={13} color="#A7ADAB" />
                      ) : (
                        <Bot size={13} color="#78D6A3" />
                      )}
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#F2F4F2',
                        }}
                      >
                        {task.assignedAgent}
                      </span>
                    </div>

                    {/* Required Capability */}
                    <div style={{ paddingRight: '12px' }}>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '11px',
                          color: '#A7ADAB',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '3px',
                          padding: '3px 8px',
                          display: 'inline-block',
                        }}
                      >
                        {task.requiredCapability}
                      </span>
                    </div>

                    {/* Status */}
                    <div>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '10px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '3px',
                          color: isReady ? '#78D6A3' : '#68706D',
                          background: isReady ? 'rgba(120, 214, 163, 0.1)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${isReady ? 'rgba(120, 214, 163, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
                        }}
                      >
                        {task.status}
                      </span>
                    </div>

                    {/* Priority */}
                    <div
                      style={{
                        textAlign: 'right',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '11px',
                        color: isCritical ? '#F25D5D' : isHigh ? '#F0AE63' : '#A7ADAB',
                        fontWeight: isCritical || isHigh ? 600 : 400,
                      }}
                    >
                      {task.priority}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </section>

        {/* 4. BOTTOM MISSION SUMMARY BAR */}
        <section
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
            }}
          >
            <span style={{ color: '#F2F4F2', fontWeight: 600 }}>9 TASKS</span>
            <span style={{ color: '#68706D' }}>•</span>
            <span style={{ color: '#F2F4F2', fontWeight: 600 }}>{agentCount} AGENTS</span>
            <span style={{ color: '#68706D' }}>•</span>
            <span style={{ color: '#F2F4F2', fontWeight: 600 }}>3 ZONES</span>
            <span style={{ color: '#68706D' }}>•</span>
            <span style={{ color: '#F2F4F2', fontWeight: 600 }}>1 RESCUE OBJECTIVE</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
            }}
          >
            <span style={{ color: '#68706D' }}>STATUS:</span>
            <span style={{ color: '#78D6A3', fontWeight: 700, letterSpacing: '0.04em' }}>
              FEASIBLE
            </span>
          </div>
        </section>

        {/* Bottom Actions: Modify Input and ENTER COMMAND CENTER */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => {
              playUiTick();
              onNavigate('mission_input');
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#A7ADAB',
              padding: '10px 18px',
              borderRadius: '4px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
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
            <ArrowLeft size={13} />
            <span>Modify Mission Input</span>
          </button>

          {/* Primary CTA: START MISSION per Spec Section 15 & 46 */}
          <button
            type="button"
            onClick={() => {
              playSuccessChirp();
              onContinueToCommandCenter();
            }}
            style={{
              background: '#F2F4F2',
              color: '#050607',
              border: 'none',
              borderRadius: '4px',
              padding: '12px 28px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
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
            <span>Start Mission</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};
