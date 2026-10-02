import { useState, useEffect } from 'react';
import { TacticalMap } from './TacticalMap';
import { AgentStatusPanel } from './AgentStatusPanel';
import { TaskStatusPanel, INITIAL_DEMO_TASKS, type TaskItem } from './TaskStatusPanel';
import { MissionProgressPanel } from './MissionProgressPanel';
import { EventFeedPanel } from './EventFeedPanel';
import { ApprovalOverlay } from './ApprovalOverlay';
import { DecisionExplanationModal } from './DecisionExplanationModal';
import { LifelineRecoveryModal } from './LifelineRecoveryModal';
import { RecoveryEngine, type LifelineInterventionProposal } from '../../engine';
import type { Agent, AgentId, MissionEvent, CompletedMissionTelemetry } from '../../types';
import {
  Layers,
  Map,
  Users,
  FileText,
  Activity,
  Sliders,
  Radio,
  Volume2,
  VolumeX,
  AlertTriangle,
  Zap,
  Target,
  RefreshCw,
  Slash,
  CheckCircle2,
  X,
  Sparkles,
  Menu,
} from 'lucide-react';
import { MissionAssistantDrawer } from '../ai-assistant';
import type { MissionAssistantContext } from '../../types/assistant';
import {
  playUiTick,
  playAlertAlarm,
  playSuccessChirp,
  playReplanningTone,
  toggleAudio,
} from '../../utils/audio';

interface CommandCenterProps {
  onCompleteMission: (telemetry?: CompletedMissionTelemetry) => void;
  onExitToLanding: () => void;
  onProceedToRecovery?: () => void;
}

const INITIAL_DEMO_AGENTS: Agent[] = [
  {
    id: 'D1',
    code: 'DRONE-01',
    name: 'DRONE-01',
    type: 'drone',
    role: 'Thermal Imaging & Search',
    status: 'active',
    battery: 82,
    signal: 96,
    task: 'Thermal Scan Zone A',
    coords: { x: 320, y: 170 },
  },
  {
    id: 'D2',
    code: 'DRONE-02',
    name: 'DRONE-02',
    type: 'drone',
    role: 'Optical Camera & Survey',
    status: 'active',
    battery: 74,
    signal: 94,
    task: 'Visual Scan Zone B',
    coords: { x: 260, y: 350 },
  },
  {
    id: 'D3',
    code: 'DRONE-03',
    name: 'DRONE-03',
    type: 'drone',
    role: 'Communication Relay',
    status: 'active',
    battery: 61,
    signal: 91,
    task: 'Communication Relay Zone C',
    coords: { x: 570, y: 190 },
  },
  {
    id: 'G1',
    code: 'GROUND-01',
    name: 'GROUND-01',
    type: 'ground',
    role: 'Survivor Rescue & Aid Payload',
    status: 'active',
    battery: 91,
    signal: 98,
    task: 'Rescue Survivor & Deliver Aid',
    coords: { x: 520, y: 430 },
  },
];

const INITIAL_DEMO_EVENTS: MissionEvent[] = [
  {
    id: 'e5',
    timestamp: '14:14',
    timeSec: 14,
    title: 'Drone-02 entered Zone B',
    detail: 'Visual grid scan in progress.',
    level: 'info',
    agentId: 'D2',
  },
  {
    id: 'e4',
    timestamp: '14:10',
    timeSec: 10,
    title: 'Drone-01 entered Zone A',
    detail: 'Thermal imaging sweep active.',
    level: 'info',
    agentId: 'D1',
  },
  {
    id: 'e3',
    timestamp: '14:06',
    timeSec: 6,
    title: 'Zone A prioritized',
    detail: 'High survivor probability (91 danger index).',
    level: 'warning',
  },
  {
    id: 'e2',
    timestamp: '14:03',
    timeSec: 3,
    title: 'PLAN GENERATED',
    detail: '9 tasks assigned across 4 agents. Feasibility confirmed.',
    level: 'success',
  },
  {
    id: 'e1',
    timestamp: '14:01',
    timeSec: 1,
    title: 'MISSION START',
    detail: 'Earthquake rescue directive loaded. Autonomous swarm initialized.',
    level: 'info',
  },
];

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onCompleteMission,
  onExitToLanding,
  onProceedToRecovery,
}) => {
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [audioActive, setAudioActive] = useState<boolean>(true);
  const [showSimMenu, setShowSimMenu] = useState<boolean>(false);
  const [showReasoningModal, setShowReasoningModal] = useState<boolean>(false);
  const [selectedAgentId, setSelectedAgentId] = useState<AgentId | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MissionEvent | null>(null);

  // Real Mission Simulation State
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_DEMO_TASKS);
  const [missionStatus, setMissionStatus] = useState<'FEASIBLE' | 'RECOVERING' | 'BLOCKED'>('FEASIBLE');
  const [confidence, setConfidence] = useState<number>(94);
  const [areaScanned, setAreaScanned] = useState<number>(45);
  const [survivorsFound, setSurvivorsFound] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(34); // live timer
  const [isReplanning, setIsReplanning] = useState<boolean>(false);
  const [replanApproved, setReplanApproved] = useState<boolean>(false);
  const [d3Offline, setD3Offline] = useState<boolean>(false);
  const [d2RelayActive, setD2RelayActive] = useState<boolean>(false);
  const [routeBlocked, setRouteBlocked] = useState<boolean>(false);
  const [alternateRouteActive, setAlternateRouteActive] = useState<boolean>(false);
  const [groundFailed, setGroundFailed] = useState<boolean>(false);
  const [showSurvivor, setShowSurvivor] = useState<boolean>(false);
  const [survivorCoords, setSurvivorCoords] = useState<{ x: number; y: number }>({ x: 290, y: 150 });
  const [showAlternateRouteModal, setShowAlternateRouteModal] = useState<boolean>(false);
  const [showBlockedInspector, setShowBlockedInspector] = useState<boolean>(false);
  const [lifelineProposal, setLifelineProposal] = useState<LifelineInterventionProposal | null>(null);
  const [showLifelineModal, setShowLifelineModal] = useState<boolean>(false);
  const [approvalRequired, setApprovalRequired] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : true
  );
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setIsDesktop(w >= 1024);
      setIsMobile(w < 768);
      if (w >= 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Agents & Events
  const [agents, setAgents] = useState<Agent[]>(INITIAL_DEMO_AGENTS);
  const [events, setEvents] = useState<MissionEvent[]>(INITIAL_DEMO_EVENTS);

  // Live Assistant Context derived from simulation state
  const assistantContext: MissionAssistantContext = {
    mission: {
      name: 'Earthquake Search & Rescue',
      objective: 'Searching the affected area and rescuing survivors.',
      phase: activeTab.toLowerCase(),
      status: missionStatus,
      confidence,
      survivorsFound,
      areaScanned,
      timeElapsedSeconds: timeSeconds,
      tasksTotal: tasks.length,
      tasksCompleted: tasks.filter((t) => t.status === 'COMPLETED').length,
    },
    agents,
    events,
    routeBlocked,
    d3Offline,
    d2RelayActive,
    groundFailed,
    approvalRequired,
    replanApproved,
    lifelineRecommendation: lifelineProposal ? 'Deploy GroundBot 02 reserve' : undefined,
  };

  // Live Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Sound Mute Toggle
  const handleToggleAudio = () => {
    const current = toggleAudio();
    setAudioActive(current);
  };

  // EVENT 1 — SURVIVOR DETECTED
  const handleSurvivorDetected = () => {
    playAlertAlarm();
    setShowSurvivor(true);
    setSurvivorsFound(4);
    setSurvivorCoords({ x: 290, y: 150 });

    const nowStr = '14:21';
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-2`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'CRITICAL UPDATE PRIORITISED',
        detail: 'Survivor location telemetry elevated to Tier-1 tactical priority over routine sweep.',
        level: 'critical',
        priority: true,
      },
      {
        id: `evt-${Date.now()}-1`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'SURVIVOR DETECTED',
        detail: 'Thermal signature confirmed at coordinates [290, 150]. Sector A-04 prioritized. 4 survivors located.',
        level: 'critical',
        priority: true,
        agentId: 'D1',
      },
      ...prev,
    ]);

    // Update relevant task in state:
    setTasks((prev) =>
      prev.map((t) => {
        if (t.number === '06') {
          return { ...t, status: 'COMPLETED' };
        }
        if (t.number === '07') {
          return { ...t, status: 'IN PROGRESS', priority: '01', zone: 'ZONE A' };
        }
        if (t.number === '08') {
          return { ...t, status: 'READY' };
        }
        return t;
      })
    );
  };

  // EVENT 2 — DRONE-3 SIGNAL LOSS
  const handleDrone3SignalLoss = () => {
    playAlertAlarm();
    setD3Offline(true);
    const nowStr = '14:24';

    setAgents((prev) =>
      prev.map((a) =>
        a.id === 'D3'
          ? {
              ...a,
              status: 'warning',
              signal: 12,
              battery: 61,
              task: 'COMMUNICATION DEGRADED (12%)',
            }
          : a
      )
    );

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-d3`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'SIGNAL LOSS',
        detail: 'Drone-03 Signal Loss (91% → 12%). Status: DEGRADED. Signal dropped below operational threshold.',
        level: 'warning',
        agentId: 'D3',
      },
      ...prev,
    ]);

    setTimeout(() => {
      playReplanningTone();
      setEvents((prev) => [
        {
          id: `evt-${Date.now()}-analysis`,
          timestamp: '14:25',
          timeSec: timeSeconds + 1,
          title: 'RECOVERY ANALYSIS',
          detail: 'Evaluating swarm topology for communication relay fallback.',
          level: 'warning',
        },
        ...prev,
      ]);

      setTimeout(() => {
        playSuccessChirp();
        setD2RelayActive(true);

        setAgents((prev) =>
          prev.map((a) => {
            if (a.id === 'D2') {
              return {
                ...a,
                role: 'Optical Camera & Active Relay',
                task: 'Relay Link Active (Bridging Drone-03)',
              };
            }
            if (a.id === 'D3') {
              return {
                ...a,
                signal: 86,
                task: 'Relay-Linked via Drone-02',
              };
            }
            return a;
          })
        );

        setTasks((prev) =>
          prev.map((t) => {
            if (t.number === '03') {
              return { ...t, agent: 'DRONE-02', moved: true, capability: 'Relay + Optical' };
            }
            if (t.number === '07') {
              return { ...t, agent: 'DRONE-02', moved: true, capability: 'Communication relay' };
            }
            return t;
          })
        );

        setEvents((prev) => [
          {
            id: `evt-${Date.now()}-plan`,
            timestamp: '14:25',
            timeSec: timeSeconds + 2,
            title: 'PLAN UPDATED — 2 OF 9 TASKS MOVED',
            detail: 'Task 03 & 07 reassigned to Drone-02. 7 unaffected tasks remain unchanged.',
            level: 'success',
          },
          {
            id: `evt-${Date.now()}-lifeline`,
            timestamp: '14:25',
            timeSec: timeSeconds + 2,
            title: 'LIFELINE FOUND',
            detail: 'Drone-02 can restore communication for Drone-03 via high-gain relay.',
            level: 'success',
            agentId: 'D2',
          },
          ...prev,
        ]);
      }, 1200);
    }, 800);
  };

  // EVENT 3 — ROUTE BLOCKED
  const handleRouteBlocked = () => {
    playAlertAlarm();
    setRouteBlocked(true);
    const nowStr = '14:26';

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-blocked`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'ROUTE BLOCKED',
        detail: 'Ground-01 primary traversal corridor blocked by collapsed rubble.',
        level: 'critical',
        agentId: 'G1',
      },
      ...prev,
    ]);

    setTimeout(() => {
      playReplanningTone();
      setAlternateRouteActive(true);
      setShowAlternateRouteModal(true);

      setAgents((prev) =>
        prev.map((a) =>
          a.id === 'G1'
            ? {
                ...a,
                task: 'Alternate Route B (3.2 km, 11 min)',
              }
            : a
        )
      );

      setEvents((prev) => [
        {
          id: `evt-${Date.now()}-alt`,
          timestamp: '14:27',
          timeSec: timeSeconds + 1,
          title: 'LIFELINE FOUND',
          detail: 'Alternate Route B preserves the mission deadline and return reserve. Only affected route modified.',
          level: 'success',
          agentId: 'G1',
        },
        ...prev,
      ]);
    }, 900);
  };

  // EVENT 4 — GROUND ROBOT FAILURE
  const handleGroundRobotFailure = () => {
    playAlertAlarm();
    setGroundFailed(true);
    setMissionStatus('BLOCKED');
    setShowBlockedInspector(true);
    const nowStr = '14:29';

    const updatedAgents = agents.map((a) =>
      a.id === 'G1'
        ? {
            ...a,
            status: 'offline' as const,
            battery: 91,
            signal: 0,
            task: 'OFFLINE — DRIVE MOTOR FAILURE',
          }
        : a
    );
    setAgents(updatedAgents);

    const updatedTasks = tasks.map((t) => {
      if (t.number === '08' || t.number === '09') {
        return {
          ...t,
          status: 'UNASSIGNED' as const,
          agent: 'UNASSIGNED',
        };
      }
      return t;
    });
    setTasks(updatedTasks);

    const proposal = RecoveryEngine.evaluateRecovery(updatedAgents, updatedTasks, timeSeconds);
    setLifelineProposal(proposal);

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-lifeline-found`,
        timestamp: '14:30',
        timeSec: timeSeconds + 1,
        title: 'LIFELINE FOUND',
        detail: `Reserve Ground-02 available at forward depot. Latest dispatch 14:32 restores feasibility.`,
        level: 'success',
      },
      {
        id: `evt-${Date.now()}-impossible`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'REASSIGNMENT IMPOSSIBLE',
        detail: 'No available swarm agent can satisfy the payload/rescue constraints.',
        level: 'critical',
      },
      {
        id: `evt-${Date.now()}-blocked`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'MISSION BLOCKED',
        detail: `Blocking constraint: ${proposal.blockingConstraint}`,
        level: 'critical',
      },
      {
        id: `evt-${Date.now()}-g1-off`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'GROUND ROBOT FAILURE',
        detail: 'Ground-01 drive failure. Ground-01 OFFLINE. Tasks 08 & 09 marked UNASSIGNED.',
        level: 'critical',
        agentId: 'G1',
      },
      ...prev,
    ]);

    setTimeout(() => {
      setShowLifelineModal(true);
    }, 600);
  };

  // LIFELINE HUMAN APPROVAL ACTIONS
  const handleApproveLifeline = () => {
    setShowLifelineModal(false);
    setShowBlockedInspector(false);
    playSuccessChirp();

    const ground02: Agent = {
      id: 'G2' as AgentId,
      code: 'GROUND-02',
      name: 'GROUND-02',
      type: 'ground',
      role: 'Survivor Rescue & Aid Payload',
      status: 'active',
      battery: 100,
      signal: 99,
      task: 'DISPATCHED: Rescue Survivor & Deliver Aid',
      coords: { x: 520, y: 520 },
    };

    setAgents((prev) => {
      if (prev.some((a) => a.name === 'GROUND-02')) return prev;
      return [...prev, ground02];
    });

    setTasks((prev) =>
      prev.map((t) => {
        if (t.number === '08') {
          return {
            ...t,
            agent: 'GROUND-02',
            status: 'IN PROGRESS' as const,
            moved: true,
          };
        }
        if (t.number === '09') {
          return {
            ...t,
            agent: 'GROUND-02',
            status: 'READY' as const,
            moved: true,
          };
        }
        return t;
      })
    );

    setMissionStatus('RECOVERING');
    setConfidence(88);

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-g2-entered`,
        timestamp: '14:32',
        timeSec: timeSeconds + 1,
        title: 'GROUND-02 DISPATCHED',
        detail: 'Ground-02 reserve unit deployed from forward depot. Transit vector active.',
        level: 'success',
        agentId: 'G1',
      },
      {
        id: `evt-${Date.now()}-apprv`,
        timestamp: '14:31',
        timeSec: timeSeconds,
        title: 'HUMAN APPROVAL',
        detail: 'Operator approved 1 compatible spare ground robot.',
        level: 'success',
      },
      ...prev,
    ]);

    setTimeout(() => {
      setMissionStatus('FEASIBLE');
      setConfidence(96);
      setAreaScanned(87);
      setSurvivorsFound(4);
      playSuccessChirp();

      setEvents((prev) => [
        {
          id: `evt-${Date.now()}-feas`,
          timestamp: '14:35',
          timeSec: timeSeconds + 2,
          title: 'FEASIBILITY RESTORED',
          detail: 'Swarm operations synchronized. Mission achievable.',
          level: 'success',
        },
        ...prev,
      ]);

      setTimeout(() => {
        setAreaScanned(87);
        setSurvivorsFound(4);
        setTasks((prev) =>
          prev.map((t) => ({ ...t, status: 'COMPLETED' as const }))
        );
        setEvents((prev) => [
          {
            id: `evt-${Date.now()}-comp`,
            timestamp: '14:41',
            timeSec: timeSeconds + 4,
            title: 'MISSION COMPLETE',
            detail: '9 / 9 tasks completed. 4 survivors secured. Mission deadline preserved.',
            level: 'success',
          },
          {
            id: `evt-${Date.now()}-aid`,
            timestamp: '14:38',
            timeSec: timeSeconds + 3,
            title: 'SURVIVOR SECURED & AID DELIVERED',
            detail: 'Ground-02 reached coordinates [290, 150]. Extraction completed.',
            level: 'success',
          },
          ...prev,
        ]);
      }, 3000);
    }, 1800);
  };

  // Build simulator telemetry for Mission Completion and Replay
  const buildCompletionTelemetry = (): CompletedMissionTelemetry => {
    const completedCount = tasks.filter((t) => t.status === 'COMPLETED').length;
    const tasksCompletedStr = `${completedCount === 0 ? 9 : completedCount} / ${tasks.length} TASKS COMPLETED`;
    const finalSurvivors = survivorsFound > 0 ? survivorsFound : 4;
    const detectionEvt = events.find((e) =>
      e.title.toUpperCase().includes('SURVIVOR DETECTED')
    );
    const firstDetectionStr = detectionEvt ? detectionEvt.timestamp : '14:21';
    const coverageStr = `${Math.min(100, Math.max(87, areaScanned))}%`;
    const criticalUpdatesStr = '100%';
    const deadlineStatusStr = 'PRESERVED';
    const chronologicalEvents = [...events].reverse();

    return {
      tasksCompleted: tasksCompletedStr,
      survivorsFound: finalSurvivors,
      firstDetection: firstDetectionStr,
      coverage: coverageStr,
      criticalUpdates: criticalUpdatesStr,
      deadlineStatus: deadlineStatusStr,
      events: chronologicalEvents,
    };
  };

  const handleRejectLifeline = () => {
    setShowLifelineModal(false);
    playAlertAlarm();
    const nowStr = formatTimer(timeSeconds).substring(3);

    // Keep mission blocked. Show: INTERVENTION REJECTED. Do not continue mission.
    setMissionStatus('BLOCKED');

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}-rej`,
        timestamp: nowStr,
        timeSec: timeSeconds,
        title: 'INTERVENTION REJECTED',
        detail: 'Operator rejected spare robot dispatch. Mission remains in BLOCKED state. Swarm halted.',
        level: 'critical',
      },
      ...prev,
    ]);
  };

  const handleResetScenario = () => {
    playSuccessChirp();
    setD3Offline(false);
    setShowSurvivor(false);
    setRouteBlocked(false);
    setAlternateRouteActive(false);
    setD2RelayActive(false);
    setGroundFailed(false);
    setMissionStatus('FEASIBLE');
    setShowAlternateRouteModal(false);
    setShowBlockedInspector(false);
    setShowLifelineModal(false);
    setLifelineProposal(null);
    setIsReplanning(false);
    setReplanApproved(false);
    setApprovalRequired(false);
    setConfidence(94);
    setSurvivorsFound(0);
    setAreaScanned(45);
    setAgents(INITIAL_DEMO_AGENTS);
    setEvents(INITIAL_DEMO_EVENTS);
    setTasks(INITIAL_DEMO_TASKS);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (evt: MissionEvent) => {
    playUiTick();
    setSelectedEvent(evt);
    if (evt.agentId) {
      setSelectedAgentId(evt.agentId);
    }
  };

  /**
   * Primary MVP Demonstration: Trigger Communication Lost with Drone-03
   */
  const triggerCommunicationLost = () => {
    setShowSimMenu(false);
    handleDrone3SignalLoss();

    // Drop confidence and trigger replanning
    setConfidence(67);
    setIsReplanning(true);

    setTimeout(() => {
      playReplanningTone();
      setConfidence(42);
      setIsReplanning(false);
      setApprovalRequired(true);
      playAlertAlarm();
    }, 2200);
  };

  /**
   * Human Approval Actions
   */
  const handleApproveReplan = () => {
    setApprovalRequired(false);
    setReplanApproved(true);
    setConfidence(91);

    // Update GroundBot status and task
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === 'G1') {
          return {
            ...a,
            task: 'Executing Ridge Vector Delta rescue run',
            status: 'active',
          };
        }
        if (a.id === 'D1') {
          return {
            ...a,
            task: 'Mesh Relay Active (replacing D3)',
          };
        }
        return a;
      })
    );

    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: formatTimer(timeSeconds).substring(3),
        timeSec: timeSeconds,
        title: 'Human operator approved replan.',
        detail: 'GroundBot dispatched to survivor coordinates.',
        level: 'success',
      },
      ...prev,
    ]);

    // Advance survivor counter to 3/3 and area scanned to 100%
    setTimeout(() => {
      setSurvivorsFound(3);
      setAreaScanned(100);
      playSuccessChirp();
      setEvents((prev) => [
        {
          id: `evt-${Date.now() + 1}`,
          timestamp: formatTimer(timeSeconds + 4).substring(3),
          timeSec: timeSeconds + 4,
          title: 'All survivors secured. Mission accomplished.',
          level: 'success',
        },
        ...prev,
      ]);
    }, 4500);
  };

  const handleRejectReplan = () => {
    setApprovalRequired(false);
    setEvents((prev) => [
      {
        id: `evt-${Date.now()}`,
        timestamp: formatTimer(timeSeconds).substring(3),
        timeSec: timeSeconds,
        title: 'Operator rejected autonomous vector.',
        detail: 'Manual telemetry override commanded.',
        level: 'warning',
      },
      ...prev,
    ]);
  };

  /**
   * Reset simulation to clean state
   */
  const handleResetSimulation = () => {
    setShowSimMenu(false);
    setD3Offline(false);
    setIsReplanning(false);
    setReplanApproved(false);
    setApprovalRequired(false);
    setConfidence(91);
    setSurvivorsFound(1);
    setAreaScanned(62);
    setAgents([
      {
        id: 'D1',
        code: 'DRONE-01',
        name: 'Drone 01',
        type: 'drone',
        role: 'Recon',
        status: 'active',
        battery: 72,
        signal: 98,
        task: 'Searching Sector A',
        coords: { x: 320, y: 180 },
      },
      {
        id: 'D2',
        code: 'DRONE-02',
        name: 'Drone 02',
        type: 'drone',
        role: 'Survey',
        status: 'active',
        battery: 81,
        signal: 96,
        task: 'Searching Sector B',
        coords: { x: 280, y: 360 },
      },
      {
        id: 'D3',
        code: 'DRONE-03',
        name: 'Drone 03',
        type: 'drone',
        role: 'Relay',
        status: 'active',
        battery: 68,
        signal: 94,
        task: 'Relay link active',
        coords: { x: 570, y: 200 },
      },
      {
        id: 'G1',
        code: 'GROUNDBOT-01',
        name: 'GroundBot',
        type: 'ground',
        role: 'Support',
        status: 'active',
        battery: 64,
        signal: 92,
        task: 'Standby / Extraction',
        coords: { x: 520, y: 430 },
      },
    ]);
    playSuccessChirp();
  };

  const navItems = [
    { label: 'Overview', subtitle: 'See what is happening right now.', icon: <Layers size={14} /> },
    { label: 'Mission Plan', subtitle: 'See what each robot is supposed to do.', icon: <FileText size={14} /> },
    { label: 'Agents', subtitle: 'See the health and status of every robot.', icon: <Users size={14} /> },
    { label: 'Map', subtitle: 'View real-time tactical positioning.', icon: <Map size={14} /> },
    { label: 'Events', subtitle: 'See what changed during the mission.', icon: <Activity size={14} /> },
    { label: 'Logs', subtitle: 'See the detailed system record.', icon: <Radio size={14} /> },
    { label: 'Settings', subtitle: 'Configure simulation & alerts.', icon: <Sliders size={14} /> },
  ];

  const renderSidebarNav = (onItemClick?: () => void) => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.label;
          return (
            <button
              key={item.label}
              onClick={() => {
                playUiTick();
                setActiveTab(item.label);
                onItemClick?.();
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '4px',
                border: 'none',
                background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: isActive ? '#F2F4F2' : '#68706D',
                fontSize: '11px',
                fontWeight: isActive ? 500 : 400,
                fontFamily: '"Inter", sans-serif',
                textAlign: 'left',
                cursor: 'pointer',
                borderLeft: isActive ? '2px solid #78D6A3' : '2px solid transparent',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ marginTop: '2px', color: isActive ? '#78D6A3' : '#68706D' }}>
                {item.icon}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: isActive ? '#F2F4F2' : '#A7ADAB', fontWeight: 600 }}>{item.label}</span>
                <span style={{ fontSize: '9.5px', color: '#68706D', marginTop: '1px', lineHeight: 1.25 }}>
                  {item.subtitle}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* DEMO / SIMULATION CONTROLS */}
      <div
        style={{
          marginTop: '12px',
          padding: '10px 8px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '6px',
          fontFamily: '"JetBrains Mono", monospace',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: '#A7ADAB',
            fontWeight: 600,
            letterSpacing: '0.08em',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Zap size={11} color="#F0AE63" />
          <span>DEMO CONTROLS</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <button
            onClick={() => {
              handleSurvivorDetected();
              onItemClick?.();
            }}
            style={{
              padding: '6px 8px',
              background: showSurvivor ? 'rgba(240, 174, 99, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: showSurvivor ? '1px solid #F0AE63' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '4px',
              color: showSurvivor ? '#F0AE63' : '#F2F4F2',
              fontSize: '9.5px',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Target size={11} />
            <span>SURVIVOR DETECTED</span>
          </button>

          <button
            onClick={() => {
              handleDrone3SignalLoss();
              onItemClick?.();
            }}
            style={{
              padding: '6px 8px',
              background: d3Offline ? 'rgba(242, 93, 93, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: d3Offline ? '1px solid #F25D5D' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '4px',
              color: d3Offline ? '#F25D5D' : '#F2F4F2',
              fontSize: '9.5px',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Radio size={11} />
            <span>DRONE-3 SIGNAL LOSS</span>
          </button>

          <button
            onClick={() => {
              handleRouteBlocked();
              onItemClick?.();
            }}
            style={{
              padding: '6px 8px',
              background: routeBlocked ? 'rgba(240, 174, 99, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: routeBlocked ? '1px solid #F0AE63' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '4px',
              color: routeBlocked ? '#F0AE63' : '#F2F4F2',
              fontSize: '9.5px',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Slash size={11} />
            <span>ROUTE BLOCKED</span>
          </button>

          <button
            onClick={() => {
              handleGroundRobotFailure();
              onItemClick?.();
            }}
            style={{
              padding: '6px 8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '4px',
              color: '#F2F4F2',
              fontSize: '9.5px',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <AlertTriangle size={11} />
            <span>GROUND ROBOT FAILURE</span>
          </button>

          <button
            onClick={() => {
              handleResetScenario();
              onItemClick?.();
            }}
            style={{
              padding: '6px 8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              color: '#A7ADAB',
              fontSize: '9.5px',
              fontWeight: 600,
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '2px',
              transition: 'all 0.15s ease',
            }}
          >
            <RefreshCw size={11} />
            <span>RESET SCENARIO</span>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'auto', padding: '12px 6px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ fontSize: '10px', color: '#68706D', fontFamily: '"JetBrains Mono", monospace' }}>
          AUTONOMOUS MESH
        </div>
        <div style={{ fontSize: '11px', color: '#78D6A3', marginTop: '2px', fontFamily: '"JetBrains Mono", monospace' }}>
          {d3Offline ? 'DEGRADED (3/4)' : 'FULL SYNC (4/4)'}
        </div>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#050607',
        color: '#F2F4F2',
        overflow: 'hidden',
      }}
    >
      {/* 1. Header Topbar per Spec Section 19 */}
      <header
        style={{
          minHeight: '56px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '8px 12px' : '0 20px',
          background: '#080A0B',
          zIndex: 40,
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px' }}>
          {!isDesktop && (
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle Mission Menu"
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '4px',
                color: '#F2F4F2',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '36px',
                minHeight: '36px',
              }}
            >
              {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}

          {/* Logo Mark */}
          <div
            onClick={onExitToLanding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                border: '1.5px solid #ffffff',
                transform: 'rotate(45deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ width: '4px', height: '4px', background: '#ffffff' }} />
            </div>
            <span>MissionMind</span>
          </div>

          <div style={{ width: '1px', height: '24px', background: 'rgba(255, 255, 255, 0.12)' }} />

          {/* Mission Title + Plain-English Story Sentence per Spec Section 19 */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ color: '#F2F4F2', fontWeight: 700, fontSize: '12px', letterSpacing: '0.04em' }}>
                EARTHQUAKE RESCUE
              </span>
              <span
                style={{
                  background: 'rgba(120, 214, 163, 0.12)',
                  border: '1px solid rgba(120, 214, 163, 0.35)',
                  color: '#78D6A3',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                ACTIVE
              </span>
              <span style={{ color: '#68706D' }}>•</span>
              <span style={{ color: '#A7ADAB', fontSize: '11px' }}>T+ {formatTimer(timeSeconds)}</span>
              {!isMobile && (
                <>
                  <span style={{ color: '#68706D' }}>•</span>
                  <span style={{ color: '#A7ADAB', fontSize: '11px' }}>4 AGENTS</span>
                </>
              )}
            </div>
            {!isMobile && (
              <div style={{ fontSize: '11px', color: '#8D9693', fontFamily: '"Inter", sans-serif', marginTop: '1px' }}>
                Searching the affected area and rescuing survivors.
              </div>
            )}
          </div>
        </div>

        {/* Right Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px', flexWrap: 'wrap' }}>
          {/* Audio toggle */}
          <button
            onClick={handleToggleAudio}
            title={audioActive ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '4px',
              color: audioActive ? '#F2F4F2' : '#68706D',
              padding: '6px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {audioActive ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>

          {/* SIMULATE EVENT Trigger Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                playUiTick();
                setShowSimMenu(!showSimMenu);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                borderRadius: '4px',
                color: '#F2F4F2',
                padding: '6px 10px',
                fontSize: '11px',
                fontFamily: '"JetBrains Mono", monospace',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Zap size={12} color="#F0AE63" />
              <span>{isMobile ? 'SIMULATE' : 'SIMULATE EVENT'}</span>
            </button>

            {/* Simulation Options Dropdown & Backdrop */}
            {showSimMenu && (
              <>
                <div
                  onClick={() => setShowSimMenu(false)}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 998,
                    background: isMobile ? 'rgba(0, 0, 0, 0.65)' : 'transparent',
                    backdropFilter: isMobile ? 'blur(3px)' : 'none',
                    WebkitBackdropFilter: isMobile ? 'blur(3px)' : 'none',
                  }}
                />

                <div
                  style={{
                    position: isMobile ? 'fixed' : 'absolute',
                    top: isMobile ? '80px' : '100%',
                    left: isMobile ? '12px' : 'auto',
                    right: isMobile ? '12px' : 0,
                    margin: isMobile ? '0 auto' : '8px 0 0 0',
                    maxWidth: isMobile ? '400px' : '300px',
                    width: isMobile ? 'calc(100vw - 24px)' : '300px',
                    maxHeight: isMobile ? 'calc(100vh - 100px)' : 'auto',
                    overflowY: isMobile ? 'auto' : 'visible',
                    background: '#0B0F12',
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    borderRadius: '8px',
                    boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.08)',
                    padding: '12px',
                    zIndex: 999,
                    fontFamily: '"JetBrains Mono", monospace',
                    animation: 'slideUp 0.15s ease-out',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '8px',
                      marginBottom: '8px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={13} color="#F0AE63" />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#F2F4F2', letterSpacing: '0.05em' }}>
                        SIMULATION SCENARIOS
                      </span>
                    </div>
                    <button
                      onClick={() => setShowSimMenu(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#8E9693',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                      }}
                    >
                      <X size={15} />
                    </button>
                  </div>

                  <div style={{ fontSize: '9px', color: '#68706D', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: 600 }}>
                    INJECT RUNTIME EVENTS
                  </div>

                  {/* Option 1: Communication Lost */}
                  <button
                    onClick={() => {
                      triggerCommunicationLost();
                      setShowSimMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 10px',
                      background: 'rgba(242, 93, 93, 0.12)',
                      border: '1px solid rgba(242, 93, 93, 0.35)',
                      borderRadius: '5px',
                      color: '#F25D5D',
                      fontSize: '11px',
                      cursor: 'pointer',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                      minHeight: '44px',
                    }}
                  >
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>COMMUNICATION LOST (D3)</div>
                      <div style={{ fontSize: '9.5px', color: '#E89292', marginTop: '2px', fontFamily: '"Inter", sans-serif' }}>
                        Drone-03 drops to 12% signal. Swarm triggers relay replan.
                      </div>
                    </div>
                  </button>

                  {/* Option 2: Route Blocked */}
                  <button
                    onClick={() => {
                      handleRouteBlocked();
                      setShowSimMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 10px',
                      background: 'rgba(240, 174, 99, 0.1)',
                      border: '1px solid rgba(240, 174, 99, 0.3)',
                      borderRadius: '5px',
                      color: '#F0AE63',
                      fontSize: '11px',
                      cursor: 'pointer',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                      minHeight: '44px',
                    }}
                  >
                    <Slash size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>ROUTE BLOCKED (G1)</div>
                      <div style={{ fontSize: '9.5px', color: '#D4B592', marginTop: '2px', fontFamily: '"Inter", sans-serif' }}>
                        Ground rubble collapse; prompts alternate corridor.
                      </div>
                    </div>
                  </button>

                  {/* Option 3: Ground Robot Failure */}
                  <button
                    onClick={() => {
                      handleGroundRobotFailure();
                      setShowSimMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 10px',
                      background: 'rgba(242, 93, 93, 0.08)',
                      border: '1px solid rgba(242, 93, 93, 0.25)',
                      borderRadius: '5px',
                      color: '#FF8585',
                      fontSize: '11px',
                      cursor: 'pointer',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                      minHeight: '44px',
                    }}
                  >
                    <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>DRIVE FAILURE (G1)</div>
                      <div style={{ fontSize: '9.5px', color: '#D69E9E', marginTop: '2px', fontFamily: '"Inter", sans-serif' }}>
                        Drive motor stalls; triggers Lifeline reserve dispatch.
                      </div>
                    </div>
                  </button>

                  {/* Option 4: Survivor Detected */}
                  <button
                    onClick={() => {
                      handleSurvivorDetected();
                      setShowSimMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '9px 10px',
                      background: 'rgba(56, 229, 77, 0.08)',
                      border: '1px solid rgba(56, 229, 77, 0.25)',
                      borderRadius: '5px',
                      color: '#5CE877',
                      fontSize: '11px',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '9px',
                      minHeight: '44px',
                    }}
                  >
                    <Target size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>SURVIVOR DETECTED</div>
                      <div style={{ fontSize: '9.5px', color: '#97D8A7', marginTop: '2px', fontFamily: '"Inter", sans-serif' }}>
                        Thermal hit at [290, 150]; elevates priority sweep.
                      </div>
                    </div>
                  </button>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {/* View AI Reasoning */}
                    <button
                      onClick={() => {
                        setShowSimMenu(false);
                        setShowReasoningModal(true);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        background: 'rgba(92, 225, 230, 0.08)',
                        border: '1px solid rgba(92, 225, 230, 0.25)',
                        borderRadius: '4px',
                        color: '#5CE1E6',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '40px',
                      }}
                    >
                      <Sparkles size={14} />
                      <span>View AI Reasoning ("Why GroundBot?")</span>
                    </button>

                    {/* Reset Simulation */}
                    <button
                      onClick={() => {
                        handleResetSimulation();
                        handleResetScenario();
                        setShowSimMenu(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '4px',
                        color: '#A7ADAB',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        minHeight: '40px',
                      }}
                    >
                      <RefreshCw size={13} />
                      <span>Reset Simulation</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Ask MissionMind AI Chat Trigger Button (Spec §4 & §52) */}
          <button
            onClick={() => {
              playUiTick();
              setIsChatOpen(!isChatOpen);
            }}
            title="Ask MissionMind AI about the mission"
            style={{
              background: isChatOpen ? 'rgba(120, 214, 163, 0.16)' : 'rgba(255, 255, 255, 0.08)',
              border: isChatOpen ? '1px solid #78D6A3' : '1px solid rgba(255, 255, 255, 0.28)',
              borderRadius: '4px',
              color: isChatOpen ? '#78D6A3' : '#F2F4F2',
              padding: '6px 10px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={12} color={isChatOpen ? '#78D6A3' : '#F0AE63'} />
            <span>{isMobile ? 'Ask AI' : 'Ask MissionMind'}</span>
          </button>

          {/* Recovery Stage button */}
          {onProceedToRecovery && (
            <button
              onClick={() => {
                playSuccessChirp();
                onProceedToRecovery();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#F2F4F2',
                border: '1px solid rgba(255, 255, 255, 0.28)',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '10.5px',
                fontWeight: 600,
                fontFamily: '"JetBrains Mono", monospace',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{isMobile ? 'Recovery →' : 'Recovery Stage →'}</span>
            </button>
          )}

          {/* Complete Mission button */}
          <button
            onClick={() => {
              playSuccessChirp();
              onCompleteMission(buildCompletionTelemetry());
            }}
            style={{
              background: '#F2F4F2',
              color: '#050607',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 10px',
              fontSize: '10.5px',
              fontWeight: 600,
              fontFamily: '"JetBrains Mono", monospace',
              cursor: 'pointer',
            }}
          >
            {isMobile ? 'Complete →' : 'Complete Mission →'}
          </button>
        </div>
      </header>

      {/* 2. Main Workspace Layout */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          overflow: isDesktop ? 'hidden' : 'auto',
        }}
      >
        {/* Left Sidebar on Desktop */}
        {isDesktop && (
          <aside
            style={{
              width: '210px',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#080A0B',
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              flexShrink: 0,
              overflowY: 'auto',
            }}
          >
            {renderSidebarNav()}
          </aside>
        )}

        {/* Mobile Left Sidebar Drawer */}
        {!isDesktop && mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(6px)',
              zIndex: 100,
            }}
          >
            <aside
              onClick={(e) => e.stopPropagation()}
              style={{
                width: 'min(300px, 85vw)',
                height: '100%',
                borderRight: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#080A0B',
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#78D6A3', fontFamily: '"JetBrains Mono", monospace' }}>
                  MISSION MENU
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#A7ADAB', cursor: 'pointer', padding: '6px' }}
                >
                  <X size={18} />
                </button>
              </div>
              {renderSidebarNav(() => setMobileSidebarOpen(false))}
            </aside>
          </div>
        )}

        {/* Center Live Map Viewport */}
        <main
          style={{
            flex: isDesktop ? 1 : 'none',
            height: isDesktop ? '100%' : (isMobile ? 'clamp(360px, 50vh, 460px)' : 'clamp(420px, 55vh, 520px)'),
            minHeight: '360px',
            padding: isMobile ? '8px' : '14px',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: isDesktop ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            flexShrink: 0,
          }}
        >
          {/* Mission Complete Overlay Banner when all tasks are finished */}
          {tasks.every((t) => t.status === 'COMPLETED') && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 60,
                width: 'min(500px, calc(100% - 24px))',
                background: 'rgba(8, 10, 11, 0.95)',
                border: '1px solid #78D6A3',
                boxShadow: '0 8px 32px rgba(120, 214, 163, 0.25)',
                borderRadius: '6px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                fontFamily: '"JetBrains Mono", monospace',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#78D6A3" />
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#78D6A3', letterSpacing: '0.08em' }}>
                    MISSION COMPLETE · 9 / 9 TASKS COMPLETED
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#A7ADAB', marginTop: '2px' }}>
                    4 Survivors Found · 87% Coverage · Deadline Preserved
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  playSuccessChirp();
                  onCompleteMission(buildCompletionTelemetry());
                }}
                style={{
                  background: '#78D6A3',
                  color: '#050607',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '7px 16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>REPLAY MISSION →</span>
              </button>
            </div>
          )}

          <TacticalMap
            agents={agents}
            survivorCoords={survivorCoords}
            isReplanning={isReplanning}
            replanApproved={replanApproved}
            d3Offline={d3Offline}
            showSurvivor={showSurvivor}
            routeBlocked={routeBlocked}
            alternateRouteActive={alternateRouteActive}
            d2RelayActive={d2RelayActive}
            groundFailed={groundFailed}
            onSelectAgent={(id) => setSelectedAgentId(id)}
            selectedAgentId={selectedAgentId}
          />

          {/* Interactive Event Story Toast per Spec Section 22 & 24 */}
          {selectedEvent && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: isMobile ? '12px' : '20px',
                left: isMobile ? '12px' : 'auto',
                maxWidth: 'min(360px, calc(100% - 24px))',
                background: 'rgba(8, 10, 11, 0.95)',
                border: `1px solid ${
                  selectedEvent.level === 'critical' ? '#F25D5D' : selectedEvent.level === 'warning' ? '#F0AE63' : '#78D6A3'
                }`,
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8)',
                borderRadius: '6px',
                padding: '14px 16px',
                zIndex: 55,
                backdropFilter: 'blur(8px)',
                fontFamily: '"JetBrains Mono", monospace',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    color: selectedEvent.level === 'critical' ? '#F25D5D' : selectedEvent.level === 'warning' ? '#F0AE63' : '#78D6A3',
                    letterSpacing: '0.08em',
                  }}
                >
                  EVENT HIGHLIGHT · {selectedEvent.timestamp}
                </span>
                <button
                  onClick={() => setSelectedEvent(null)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#68706D',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ fontSize: '13px', fontWeight: 600, color: '#F2F4F2', marginBottom: '6px', fontFamily: '"Inter", sans-serif' }}>
                {selectedEvent.title}
              </div>

              <div style={{ fontSize: '11px', color: '#A7ADAB', lineHeight: 1.5, fontFamily: '"Inter", sans-serif' }}>
                {selectedEvent.detail}
              </div>

              {selectedEvent.agentId && (
                <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '10px', color: '#78D6A3' }}>
                  Target highlighted on tactical map: Agent {selectedEvent.agentId}
                </div>
              )}
            </div>
          )}

          {/* Minimal Change Explanation Banner per Spec Section 26 */}
          {d2RelayActive && !alternateRouteActive && (
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '12px',
                maxWidth: 'min(360px, calc(100% - 24px))',
                background: 'rgba(8, 10, 11, 0.95)',
                border: '1px solid #78D6A3',
                borderRadius: '6px',
                padding: '12px 16px',
                zIndex: 50,
                fontFamily: '"JetBrains Mono", monospace',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ fontSize: '10px', color: '#78D6A3', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '4px' }}>
                ADAPTIVE REPLAN COMPLETED
              </div>
              <div style={{ fontSize: '13px', color: '#F2F4F2', fontWeight: 600, fontFamily: '"Inter", sans-serif' }}>
                2 of 9 tasks changed
              </div>
              <div style={{ fontSize: '11px', color: '#A7ADAB', marginTop: '2px', fontFamily: '"Inter", sans-serif' }}>
                7 of 9 tasks stayed the same. The rest of the swarm remained stable.
              </div>
            </div>
          )}

          {/* Alternate Route B Feasibility Overlay */}
          {showAlternateRouteModal && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '12px',
                maxWidth: 'min(380px, calc(100% - 24px))',
                width: '100%',
                background: 'rgba(8, 10, 11, 0.95)',
                border: '1px solid rgba(120, 214, 163, 0.4)',
                borderRadius: '6px',
                padding: '14px 16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                fontFamily: '"JetBrains Mono", monospace',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#78D6A3', fontSize: '11px', fontWeight: 600 }}>
                  <CheckCircle2 size={13} />
                  <span>LIFELINE FOUND — ALTERNATE ROUTE B</span>
                </div>
                <button
                  onClick={() => setShowAlternateRouteModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#68706D',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ fontSize: '10.5px', color: '#A7ADAB', marginBottom: '10px', lineHeight: 1.4 }}>
                Alternate Route B preserves the mission deadline and return reserve.
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '6px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '10px',
                  marginBottom: '10px',
                }}
              >
                <div><span style={{ color: '#68706D' }}>Distance:</span> <strong style={{ color: '#F2F4F2' }}>3.2 km</strong></div>
                <div><span style={{ color: '#68706D' }}>Travel time:</span> <strong style={{ color: '#F2F4F2' }}>11 min</strong></div>
                <div><span style={{ color: '#68706D' }}>Battery required:</span> <strong style={{ color: '#F2F4F2' }}>18%</strong></div>
                <div><span style={{ color: '#68706D' }}>Return reserve:</span> <strong style={{ color: '#78D6A3' }}>22%</strong></div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: '#68706D' }}>Deadline remaining:</span> <strong style={{ color: '#F2F4F2' }}>14 min</strong>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                <span style={{ color: '#68706D' }}>EVALUATION RESULT:</span>
                <span style={{ color: '#78D6A3', fontWeight: 700, letterSpacing: '0.05em' }}>FEASIBLE</span>
              </div>
            </div>
          )}

          {/* Mission Blocked Constraint Inspector */}
          {showBlockedInspector && missionStatus === 'BLOCKED' && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '12px',
                maxWidth: 'min(420px, calc(100% - 24px))',
                width: '100%',
                background: 'rgba(8, 10, 11, 0.96)',
                border: '1px solid rgba(242, 93, 93, 0.5)',
                borderRadius: '6px',
                padding: '16px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.9)',
                fontFamily: '"JetBrains Mono", monospace',
                zIndex: 50,
                backdropFilter: 'blur(8px)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F25D5D', fontSize: '12px', fontWeight: 700 }}>
                  <AlertTriangle size={14} />
                  <span>MISSION BLOCKED</span>
                </div>
                <button
                  onClick={() => setShowBlockedInspector(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#68706D',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <X size={14} />
                </button>
              </div>

              <div style={{ fontSize: '11px', color: '#F2F4F2', fontWeight: 600, marginBottom: '4px' }}>
                Blocking constraint:
              </div>
              <div style={{ fontSize: '10.5px', color: '#F0AE63', marginBottom: '12px', lineHeight: 1.4 }}>
                Ground transport + aid payload + rescue capability required.
              </div>

              <div style={{ fontSize: '10px', color: '#A7ADAB', marginBottom: '6px', fontWeight: 600 }}>
                REMAINING SWARM AGENTS EVALUATION:
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  background: 'rgba(242, 93, 93, 0.04)',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid rgba(242, 93, 93, 0.2)',
                  fontSize: '10px',
                  marginBottom: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#F2F4F2' }}>DRONE-01:</span>
                  <span style={{ color: '#F25D5D', fontWeight: 600 }}>INVALID — cannot carry aid payload</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#F2F4F2' }}>DRONE-02:</span>
                  <span style={{ color: '#F25D5D', fontWeight: 600 }}>INVALID — cannot perform ground rescue</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#F2F4F2' }}>DRONE-03:</span>
                  <span style={{ color: '#F25D5D', fontWeight: 600 }}>INVALID — communication capability only</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#F25D5D', fontWeight: 700, fontSize: '11px', letterSpacing: '0.04em' }}>
                  REASSIGNMENT IMPOSSIBLE
                </span>
                {onProceedToRecovery && (
                  <button
                    onClick={() => {
                      playSuccessChirp();
                      onProceedToRecovery();
                    }}
                    style={{
                      background: 'rgba(242, 93, 93, 0.15)',
                      border: '1px solid rgba(242, 93, 93, 0.4)',
                      borderRadius: '4px',
                      color: '#F2F4F2',
                      padding: '5px 10px',
                      fontSize: '10px',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Initialize Lifeline →
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* Right Side Panels: Status, Progress, Feed */}
        <aside
          style={{
            width: isDesktop ? '350px' : '100%',
            borderLeft: isDesktop ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
            background: '#080A0B',
            padding: isMobile ? '16px 12px' : '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            flexShrink: 0,
            overflowY: isDesktop ? 'auto' : 'visible',
          }}
        >
          {/* On mobile, per Spec §27: Mission Progress first */}
          {!isDesktop && (
            <MissionProgressPanel
              areaScanned={areaScanned}
              survivorsFound={survivorsFound}
              totalSurvivors={3}
              timeElapsed={formatTimer(timeSeconds)}
              confidence={confidence}
            />
          )}

          {/* Agent Status */}
          <AgentStatusPanel
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={(id) => setSelectedAgentId(id)}
          />

          {/* Task Status */}
          <TaskStatusPanel tasks={tasks} />

          {/* Event Feed per Spec Section 22, 23 & 24 */}
          <EventFeedPanel
            events={events}
            selectedEventId={selectedEvent?.id}
            onSelectEvent={handleSelectEvent}
            onOpenLogModal={() => setShowReasoningModal(true)}
          />

          {/* Mission Progress on Desktop */}
          {isDesktop && (
            <MissionProgressPanel
              areaScanned={areaScanned}
              survivorsFound={survivorsFound}
              totalSurvivors={3}
              timeElapsed={formatTimer(timeSeconds)}
              confidence={confidence}
            />
          )}
        </aside>
      </div>

      {/* Human Approval Interrupt Overlay (Section 39-41) */}
      {approvalRequired && (
        <ApprovalOverlay
          confidence={confidence}
          onApprove={handleApproveReplan}
          onReject={handleRejectReplan}
          onOpenReasoning={() => setShowReasoningModal(true)}
        />
      )}

      {/* AI Decision Reasoning Inspector ("Why GroundBot?") Modal */}
      <DecisionExplanationModal
        isOpen={showReasoningModal}
        onClose={() => setShowReasoningModal(false)}
      />

      {/* Lifeline Recovery Modal (Core USP Visual Climax) */}
      <LifelineRecoveryModal
        proposal={lifelineProposal}
        isOpen={showLifelineModal}
        onApprove={handleApproveLifeline}
        onReject={handleRejectLifeline}
      />

      {/* MissionMind AI Chat Assistant Drawer (Addon Spec) */}
      <MissionAssistantDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        ctx={assistantContext}
        onHighlightAgent={(id) => {
          setSelectedAgentId(id);
          setActiveTab('Overview');
        }}
        onOpenDecision={() => {
          if (lifelineProposal) {
            setShowLifelineModal(true);
          } else {
            setShowReasoningModal(true);
          }
        }}
        onSelectEvent={(eventId) => {
          const ev = events.find((e) => e.id === eventId);
          if (ev) setSelectedEvent(ev);
          setActiveTab('Events');
        }}
        onShowReplan={() => {
          setActiveTab('Tasks');
        }}
      />
    </div>
  );
};
