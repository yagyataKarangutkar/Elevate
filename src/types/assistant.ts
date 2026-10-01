import type { Agent, AgentId, MissionEvent } from './index';

export interface AssistantEvidenceItem {
  label: string;
  value: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
}

export interface AssistantAction {
  label: string;
  type: 'highlight_agent' | 'view_decision' | 'view_event' | 'show_replan';
  agentId?: AgentId;
  eventId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  evidence?: AssistantEvidenceItem[];
  action?: AssistantAction;
  technicalDetails?: { [key: string]: string };
}

export interface MissionAssistantContext {
  mission: {
    name: string;
    objective: string;
    phase: string;
    status: 'FEASIBLE' | 'RECOVERING' | 'BLOCKED';
    confidence: number;
    survivorsFound: number;
    areaScanned: number;
    timeElapsedSeconds: number;
    tasksTotal: number;
    tasksCompleted: number;
  };
  agents: Agent[];
  events: MissionEvent[];
  routeBlocked: boolean;
  d3Offline: boolean;
  d2RelayActive: boolean;
  groundFailed: boolean;
  approvalRequired: boolean;
  replanApproved: boolean;
  lifelineRecommendation?: string;
}

export interface AssistantResponse {
  answer: string;
  evidence?: AssistantEvidenceItem[];
  action?: AssistantAction;
  technicalDetails?: { [key: string]: string };
  relatedAgentId?: AgentId;
  relatedEventId?: string;
}
