export type AgentId = 'D1' | 'D2' | 'D3' | 'G1' | 'G2';

export type AgentStatus = 'active' | 'warning' | 'critical' | 'offline' | 'completed';

export type AgentType = 'drone' | 'ground';

export interface Agent {
  id: AgentId;
  code: string;
  name: string;
  type: AgentType;
  role: string;
  status: AgentStatus;
  battery: number;
  signal: number;
  task: string;
  coords: { x: number; y: number; z?: number };
  targetCoords?: { x: number; y: number };
  speed?: string;
  altitude?: string;
}

export type MissionPhase = 
  | 'idle' 
  | 'planning' 
  | 'executing' 
  | 'replanning' 
  | 'awaiting_approval' 
  | 'completed';

export interface MissionEvent {
  id: string;
  timestamp: string;
  timeSec: number;
  title: string;
  detail?: string;
  agentId?: AgentId;
  level: 'info' | 'warning' | 'critical' | 'success';
  priority?: boolean;
}

export interface CompletedMissionTelemetry {
  tasksCompleted: string;
  survivorsFound: number;
  firstDetection: string;
  coverage: string;
  criticalUpdates: string;
  deadlineStatus: string;
  events: MissionEvent[];
}

export interface DecisionFactor {
  label: string;
  detail: string;
  status: 'good' | 'warning' | 'critical';
}

export interface MissionPlanTask {
  id: string;
  stepNum: string;
  agentId: AgentId;
  agentName: string;
  taskName: string;
  role: string;
  status: 'pending' | 'active' | 'completed' | 'reassigned';
}

export interface MissionState {
  id: string;
  name: string;
  objective: string;
  phase: MissionPhase;
  confidence: number;
  areaScanned: number;
  survivorsFound: number;
  totalSurvivors: number;
  timeElapsedSeconds: number;
  replanCount: number;
  agents: Agent[];
  events: MissionEvent[];
  approvalRequired: boolean;
  selectedAgentForInspection: AgentId | null;
}

export type FlowStep =
  | 'landing'
  | 'mission_input'
  | 'plan_generation'
  | 'mission_plan'
  | 'command_center'
  | 'mission_recovery'
  | 'mission_complete'
  | 'results';

export interface MissionAgentConfig {
  id: AgentId;
  name: string;
  type: string;
  capabilities: string[];
  battery: number;
  signal: number;
}

export interface MissionConfig {
  objective: string;
  selectedAgentIds: AgentId[];
  agents: MissionAgentConfig[];
}
