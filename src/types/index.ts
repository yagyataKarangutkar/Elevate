export type AgentId = 'D1' | 'D2' | 'D3' | 'G1';

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
