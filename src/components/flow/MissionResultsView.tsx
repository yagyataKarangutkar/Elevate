import { useState } from 'react';
import { FlowNavbar } from './FlowNavbar';
import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Play,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import { playUiTick, playSuccessChirp } from '../../utils/audio';
import { ComparisonEngine, type ComparisonStrategyResult } from '../../engine';
import type { FlowStep } from '../../types';

interface MissionResultsViewProps {
  onNavigate: (step: FlowStep) => void;
  onRestart: () => void;
}

export const MissionResultsView: React.FC<MissionResultsViewProps> = ({
  onNavigate,
  onRestart,
}) => {
  // Execute comparative benchmark from simulator engine
  const [benchmarkData, setBenchmarkData] = useState<{
    staticPlan: ComparisonStrategyResult;
    fullReplan: ComparisonStrategyResult;
    missionMind: ComparisonStrategyResult;
  }>(() => ComparisonEngine.runBenchmark());

  const [activeStrategyTab, setActiveStrategyTab] = useState<
    'ALL' | 'STATIC' | 'FULL_REPLAN' | 'MISSIONMIND'
  >('ALL');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Trigger live re-run of the simulator benchmark
  const handleRunBenchmark = () => {
    playUiTick();
    setIsSimulating(true);
    setTimeout(() => {
      setBenchmarkData(ComparisonEngine.runBenchmark());
      setIsSimulating(false);
      playSuccessChirp();
    }, 600);
  };

  const { staticPlan, fullReplan, missionMind } = benchmarkData;

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
        currentStep="results"
        onNavigate={onNavigate}
        title="08. FINAL MISSION COMPARISON"
      />

      <main
        style={{
          flex: 1,
          maxWidth: '1100px',
          width: '100%',
          margin: '0 auto',
          padding: '36px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
                gap: '6px',
              }}
            >
              <CheckCircle2 size={13} />
              <span>FINAL STAGE 08 · MISSION STRATEGY BENCHMARK</span>
            </div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                marginBottom: '8px',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              Did adaptation help?
            </h1>
            <p
              style={{
                color: '#A7ADAB',
                fontSize: '14px',
                maxWidth: '680px',
                fontFamily: '"Inter", sans-serif',
                lineHeight: 1.5,
              }}
            >
              Same mission. Same failures. Different response.
            </p>
          </div>

          {/* Run Live Benchmark Button */}
          <button
            onClick={handleRunBenchmark}
            disabled={isSimulating}
            style={{
              background: isSimulating ? 'rgba(255, 255, 255, 0.1)' : '#F2F4F2',
              border: 'none',
              color: '#050607',
              borderRadius: '4px',
              padding: '10px 18px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
              cursor: isSimulating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            {isSimulating ? (
              <Activity size={14} className="animate-spin" />
            ) : (
              <Play size={13} fill="#050607" />
            )}
            <span>{isSimulating ? 'SIMULATING...' : 'RE-RUN BENCHMARK'}</span>
          </button>
        </div>

        {/* Strategy Overview Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
          }}
        >
          {/* 1. STATIC PLAN */}
          <div
            onClick={() => {
              playUiTick();
              setActiveStrategyTab('STATIC');
            }}
            style={{
              background: '#080A0B',
              border: activeStrategyTab === 'STATIC' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', fontWeight: 700, color: '#A7ADAB', letterSpacing: '0.06em' }}>
                1. STATIC PLAN
              </div>
              <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(242, 93, 93, 0.15)', color: '#F25D5D', borderRadius: '3px', fontFamily: '"JetBrains Mono", monospace' }}>
                ZERO ADAPTATION
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#A7ADAB', lineHeight: 1.5, margin: '0 0 6px', fontFamily: '"Inter", sans-serif' }}>
              When Drone 03 failed, its area went unsearched. When GroundBot was blocked, the rescue was delayed indefinitely.
            </p>
            <div style={{ fontSize: '10.5px', color: '#F25D5D', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
              Result: Mission failed · 1 survivor reached · 45 min
            </div>
          </div>

          {/* 2. FULL RE-PLAN */}
          <div
            onClick={() => {
              playUiTick();
              setActiveStrategyTab('FULL_REPLAN');
            }}
            style={{
              background: '#080A0B',
              border: activeStrategyTab === 'FULL_REPLAN' ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', fontWeight: 700, color: '#F0AE63', letterSpacing: '0.06em' }}>
                2. FULL RE-PLAN
              </div>
              <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(240, 174, 99, 0.15)', color: '#F0AE63', borderRadius: '3px', fontFamily: '"JetBrains Mono", monospace' }}>
                GLOBAL REBUILD
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#A7ADAB', lineHeight: 1.5, margin: '0 0 6px', fontFamily: '"Inter", sans-serif' }}>
              When a failure happens, discards everything and rebuilds the plan. Disrupts all robots and delays the rescue.
            </p>
            <div style={{ fontSize: '10.5px', color: '#F0AE63', fontWeight: 600, fontFamily: '"JetBrains Mono", monospace' }}>
              Result: Heavy churn · 17 tasks moved · Timeout risk
            </div>
          </div>

          {/* 3. MISSIONMIND LIFELINE */}
          <div
            onClick={() => {
              playUiTick();
              setActiveStrategyTab('MISSIONMIND');
            }}
            style={{
              background: '#080A0B',
              border: activeStrategyTab === 'MISSIONMIND' ? '1px solid #78D6A3' : '1px solid rgba(120, 214, 163, 0.35)',
              borderRadius: '6px',
              padding: '18px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              boxShadow: activeStrategyTab === 'MISSIONMIND' ? '0 0 16px rgba(120, 214, 163, 0.15)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '11px', fontWeight: 700, color: '#78D6A3', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={12} color="#78D6A3" />
                <span>3. MISSIONMIND</span>
              </div>
              <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(120, 214, 163, 0.15)', color: '#78D6A3', borderRadius: '3px', fontFamily: '"JetBrains Mono", monospace' }}>
                ADAPTIVE RECOVERY
              </span>
            </div>
            <p style={{ fontSize: '11.5px', color: '#A7ADAB', lineHeight: 1.5, margin: '0 0 6px', fontFamily: '"Inter", sans-serif' }}>
              When Drone 03 failed, Drone 02 expanded its route. When GroundBot was blocked, MissionMind found an alternate route.
            </p>
            <div style={{ fontSize: '10.5px', color: '#78D6A3', fontWeight: 700, fontFamily: '"JetBrains Mono", monospace' }}>
              Result: Mission completed · 3 survivors reached · 14 min
            </div>
          </div>
        </div>

        {/* FINAL TABLE AS SPECIFIED */}
        <div
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '8px',
            overflow: 'hidden',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {/* Table Header Bar */}
          <div
            style={{
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.02)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#F2F4F2', letterSpacing: '0.06em' }}>
              SIMULATOR BENCHMARK MATRIX
            </div>
            <div style={{ fontSize: '10px', color: '#68706D' }}>
              SAME SCENARIO: 4 AGENTS · 9 TASKS · 4 DISRUPTIVE FAILURES
            </div>
          </div>

          {/* Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  background: 'rgba(255, 255, 255, 0.01)',
                }}
              >
                <th
                  style={{
                    padding: '14px 20px',
                    color: '#68706D',
                    fontWeight: 600,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    width: '28%',
                  }}
                >
                  METRIC
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    color: '#A7ADAB',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    width: '24%',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  STATIC PLAN
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    color: '#F0AE63',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    width: '24%',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  FULL RE-PLAN
                </th>
                <th
                  style={{
                    padding: '14px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    width: '24%',
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  MISSIONMIND
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Survivors found */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 500 }}>
                  Survivors found
                </td>
                <td style={{ padding: '14px 20px', color: '#F25D5D', fontWeight: 600, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {staticPlan.survivorsFound} <span style={{ fontSize: '10px', color: '#68706D' }}>(extraction failed)</span>
                </td>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 600, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {fullReplan.survivorsFound} <span style={{ fontSize: '10px', color: '#F0AE63' }}>(late extraction)</span>
                </td>
                <td
                  style={{
                    padding: '14px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  {missionMind.survivorsFound} <span style={{ fontSize: '10px', color: '#78D6A3' }}>secured</span>
                </td>
              </tr>

              {/* Row 2: First detection */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 500 }}>
                  First detection
                </td>
                <td style={{ padding: '14px 20px', color: '#A7ADAB', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {staticPlan.firstDetection}
                </td>
                <td style={{ padding: '14px 20px', color: '#A7ADAB', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {fullReplan.firstDetection}
                </td>
                <td
                  style={{
                    padding: '14px 20px',
                    color: '#F2F4F2',
                    fontWeight: 600,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  {missionMind.firstDetection}
                </td>
              </tr>

              {/* Row 3: Coverage */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 500 }}>
                  Coverage
                </td>
                <td style={{ padding: '14px 20px', color: '#F25D5D', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {staticPlan.coverage}
                </td>
                <td style={{ padding: '14px 20px', color: '#F0AE63', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {fullReplan.coverage}
                </td>
                <td
                  style={{
                    padding: '14px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  {missionMind.coverage}
                </td>
              </tr>

              {/* Row 4: Tasks moved */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 500 }}>
                  Tasks moved
                </td>
                <td style={{ padding: '14px 20px', color: '#68706D', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {staticPlan.tasksMoved} <span style={{ fontSize: '10px' }}>(rigid)</span>
                </td>
                <td style={{ padding: '14px 20px', color: '#F25D5D', fontWeight: 600, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {fullReplan.tasksMoved} <span style={{ fontSize: '10px', color: '#F0AE63' }}>(heavy churn)</span>
                </td>
                <td
                  style={{
                    padding: '14px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  {missionMind.tasksMoved} <span style={{ fontSize: '10px', color: '#A7ADAB' }}>(only affected)</span>
                </td>
              </tr>

              {/* Row 5: Human commands */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 500 }}>
                  Human commands
                </td>
                <td style={{ padding: '14px 20px', color: '#68706D', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {staticPlan.humanCommands}
                </td>
                <td style={{ padding: '14px 20px', color: '#F0AE63', fontWeight: 600, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {fullReplan.humanCommands} <span style={{ fontSize: '10px' }}>(multiple overrides)</span>
                </td>
                <td
                  style={{
                    padding: '14px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  {missionMind.humanCommands} <span style={{ fontSize: '10px', color: '#A7ADAB' }}>(single approval)</span>
                </td>
              </tr>

              {/* Row 6: Critical-update delay */}
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <td style={{ padding: '14px 20px', color: '#F2F4F2', fontWeight: 500 }}>
                  Critical-update delay
                </td>
                <td style={{ padding: '14px 20px', color: '#F25D5D', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {staticPlan.criticalUpdateDelay}
                </td>
                <td style={{ padding: '14px 20px', color: '#F0AE63', borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  {fullReplan.criticalUpdateDelay}
                </td>
                <td
                  style={{
                    padding: '14px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                  }}
                >
                  {missionMind.criticalUpdateDelay}
                </td>
              </tr>

              {/* Row 7: Mission completed */}
              <tr>
                <td style={{ padding: '16px 20px', color: '#F2F4F2', fontWeight: 600 }}>
                  Mission completed
                </td>
                <td style={{ padding: '16px 20px', color: '#F25D5D', fontWeight: 700, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  NO
                </td>
                <td style={{ padding: '16px 20px', color: '#F0AE63', fontWeight: 700, borderLeft: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  NO <span style={{ fontSize: '10px' }}>(TIMEOUT)</span>
                </td>
                <td
                  style={{
                    padding: '16px 20px',
                    color: '#78D6A3',
                    fontWeight: 700,
                    borderLeft: '1px solid rgba(120, 214, 163, 0.3)',
                    background: 'rgba(120, 214, 163, 0.04)',
                    fontSize: '13px',
                  }}
                >
                  YES <span style={{ fontSize: '10px', color: '#78D6A3' }}>(PRESERVED)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Spec Section 36 Verbatim Key Takeaway */}
        <div
          style={{
            background: 'rgba(120, 214, 163, 0.08)',
            border: '1px solid rgba(120, 214, 163, 0.35)',
            borderRadius: '6px',
            padding: '22px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={17} color="#78D6A3" />
            <span
              style={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '14px',
                fontWeight: 700,
                color: '#78D6A3',
                letterSpacing: '0.02em',
              }}
            >
              Without adaptation, a plan is only good until the first failure.
            </span>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#F2F4F2',
              lineHeight: 1.6,
              margin: 0,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
            }}
          >
            MissionMind keeps the swarm working toward the goal, no matter what changes. When disruptions occur, it makes the smallest safe change rather than leaving tasks stranded or throwing the entire swarm into chaos.
          </p>
        </div>

        {/* Detailed Event Reaction Breakdown */}
        <div
          style={{
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '6px',
            padding: '20px',
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '10px',
            }}
          >
            <div style={{ fontSize: '11px', color: '#68706D', letterSpacing: '0.08em' }}>
              SIMULATED EVENT RESPONSE COMPARISON
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['ALL', 'STATIC', 'FULL_REPLAN', 'MISSIONMIND'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    playUiTick();
                    setActiveStrategyTab(tab);
                  }}
                  style={{
                    background: activeStrategyTab === tab ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    border: activeStrategyTab === tab ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                    color: activeStrategyTab === tab ? '#F2F4F2' : '#68706D',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {tab === 'ALL' ? 'VIEW ALL' : tab.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {missionMind.eventResponses.map((mmResp, idx) => {
              const spResp = staticPlan.eventResponses[idx];
              const frResp = fullReplan.eventResponses[idx];

              return (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '4px',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#F2F4F2', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={13} color="#A7ADAB" />
                    <span>EVENT {idx + 1}: {mmResp.eventTitle}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '11px' }}>
                    {/* Static Plan Response */}
                    {(activeStrategyTab === 'ALL' || activeStrategyTab === 'STATIC') && (
                      <div style={{ borderLeft: '2px solid #F25D5D', paddingLeft: '8px' }}>
                        <div style={{ color: '#F25D5D', fontWeight: 600, marginBottom: '2px' }}>STATIC PLAN</div>
                        <div style={{ color: '#68706D', lineHeight: 1.4 }}>{spResp.actionTaken}</div>
                        <div style={{ color: '#68706D', fontSize: '9.5px', marginTop: '4px' }}>Tasks moved: 0</div>
                      </div>
                    )}

                    {/* Full Replan Response */}
                    {(activeStrategyTab === 'ALL' || activeStrategyTab === 'FULL_REPLAN') && (
                      <div style={{ borderLeft: '2px solid #F0AE63', paddingLeft: '8px' }}>
                        <div style={{ color: '#F0AE63', fontWeight: 600, marginBottom: '2px' }}>FULL RE-PLAN</div>
                        <div style={{ color: '#A7ADAB', lineHeight: 1.4 }}>{frResp.actionTaken}</div>
                        <div style={{ color: '#F0AE63', fontSize: '9.5px', marginTop: '4px' }}>Tasks moved: {frResp.tasksMovedCount}</div>
                      </div>
                    )}

                    {/* MissionMind Response */}
                    {(activeStrategyTab === 'ALL' || activeStrategyTab === 'MISSIONMIND') && (
                      <div style={{ borderLeft: '2px solid #78D6A3', paddingLeft: '8px' }}>
                        <div style={{ color: '#78D6A3', fontWeight: 600, marginBottom: '2px' }}>MISSIONMIND</div>
                        <div style={{ color: '#F2F4F2', lineHeight: 1.4 }}>{mmResp.actionTaken}</div>
                        <div style={{ color: '#78D6A3', fontSize: '9.5px', marginTop: '4px' }}>Tasks moved: {mmResp.tasksMovedCount} (isolated)</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            onClick={() => {
              playUiTick();
              onNavigate('mission_complete');
            }}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: '#A7ADAB',
              padding: '10px 18px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Mission Replay</span>
          </button>

          <button
            onClick={() => {
              playSuccessChirp();
              onRestart();
            }}
            style={{
              background: '#F2F4F2',
              color: '#050607',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 24px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RotateCcw size={13} />
            <span>Restart Mission Flow</span>
          </button>
        </div>
      </main>
    </div>
  );
};
