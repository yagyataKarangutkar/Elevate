/**
 * MissionMind Constraint Engine
 * Validates mission constraints: agent capability, task dependency,
 * route availability, deadline, battery, return reserve, payload,
 * communication, and resource availability.
 */

import type { Agent } from '../types';
import type { TaskItem } from '../components/command-center/TaskStatusPanel';

export type AgentCapability =
  | 'ground_movement'
  | 'aid_payload'
  | 'survivor_rescue'
  | 'optical_camera'
  | 'thermal_imaging'
  | 'aerial_search'
  | 'mapping'
  | 'communication_relay';

export interface ConstraintValidationResult {
  valid: boolean;
  violatedConstraints: string[];
  details: Record<string, boolean>;
}

export const AGENT_CAPABILITY_MAP: Record<string, AgentCapability[]> = {
  'DRONE-01': ['aerial_search', 'thermal_imaging', 'mapping'],
  'DRONE-02': ['aerial_search', 'optical_camera', 'mapping', 'communication_relay'],
  'DRONE-03': ['communication_relay', 'mapping', 'aerial_search'],
  'GROUND-01': ['ground_movement', 'aid_payload', 'survivor_rescue'],
  'GROUND-02': ['ground_movement', 'aid_payload', 'survivor_rescue'],
};

export const TASK_REQUIRED_CAPABILITIES: Record<string, AgentCapability[]> = {
  '01': ['aerial_search', 'mapping'],
  '02': ['thermal_imaging'],
  '03': ['mapping'],
  '04': ['optical_camera'],
  '05': ['aerial_search'],
  '06': ['thermal_imaging'],
  '07': ['communication_relay'],
  '08': ['aid_payload', 'ground_movement'],
  '09': ['survivor_rescue', 'ground_movement'],
};

export class ConstraintEngine {
  /**
   * Validates if an agent satisfies capabilities required for a task
   */
  static validateAgentCapability(agentCode: string, taskNumber: string): { valid: boolean; missing: AgentCapability[] } {
    const agentCaps = AGENT_CAPABILITY_MAP[agentCode] || [];
    const requiredCaps = TASK_REQUIRED_CAPABILITIES[taskNumber] || [];

    const missing = requiredCaps.filter((cap) => !agentCaps.includes(cap));
    return {
      valid: missing.length === 0,
      missing,
    };
  }

  /**
   * Validates all critical mission constraints for an agent attempting a task
   */
  static validateAllConstraints(params: {
    agent: Agent;
    task: TaskItem;
    isRouteBlocked?: boolean;
    batteryLevel?: number;
    requiredBattery?: number;
    returnReserve?: number;
    minReturnReserve?: number;
    timeRemainingSecs?: number;
    taskEstimatedSecs?: number;
  }): ConstraintValidationResult {
    const violated: string[] = [];
    const details: Record<string, boolean> = {};

    // 1. Agent operational status
    const isOnline = params.agent.status !== 'offline';
    details['agent_online'] = isOnline;
    if (!isOnline) {
      violated.push('Agent is offline');
    }

    // 2. Capability check
    const capCheck = this.validateAgentCapability(params.agent.name || params.agent.code, params.task.number);
    details['capability_match'] = capCheck.valid;
    if (!capCheck.valid) {
      violated.push(`Missing required capabilities: ${capCheck.missing.join(', ')}`);
    }

    // 3. Payload constraint
    if (params.task.capability.toLowerCase().includes('payload')) {
      const hasPayload = (AGENT_CAPABILITY_MAP[params.agent.name] || []).includes('aid_payload');
      details['payload_compatible'] = hasPayload;
      if (!hasPayload) {
        violated.push('Cannot carry aid payload');
      }
    }

    // 4. Ground rescue constraint
    if (params.task.capability.toLowerCase().includes('rescue') || params.task.name.toLowerCase().includes('rescue')) {
      const canRescue = (AGENT_CAPABILITY_MAP[params.agent.name] || []).includes('survivor_rescue');
      details['ground_rescue_capable'] = canRescue;
      if (!canRescue) {
        violated.push('Cannot perform ground rescue');
      }
    }

    // 5. Route availability
    if (params.isRouteBlocked) {
      details['route_available'] = false;
      violated.push('Traversing route is blocked by obstacles');
    } else {
      details['route_available'] = true;
    }

    // 6. Battery & return reserve
    const battery = params.batteryLevel ?? params.agent.battery;
    const reqBattery = params.requiredBattery ?? 15;
    const returnReserve = params.returnReserve ?? (battery - reqBattery);
    const minReserve = params.minReturnReserve ?? 20;

    const batteryOk = battery >= reqBattery && returnReserve >= minReserve;
    details['battery_and_reserve'] = batteryOk;
    if (!batteryOk) {
      violated.push(`Battery insufficient for task + ${minReserve}% return reserve`);
    }

    // 7. Deadline constraint
    if (params.timeRemainingSecs !== undefined && params.taskEstimatedSecs !== undefined) {
      const deadlineOk = params.timeRemainingSecs >= params.taskEstimatedSecs;
      details['deadline_adhered'] = deadlineOk;
      if (!deadlineOk) {
        violated.push('Task completion exceeds mission deadline');
      }
    }

    // 8. Communication link
    const commOk = params.agent.signal > 20;
    details['communication_link'] = commOk;
    if (!commOk) {
      violated.push('Signal degraded below operational threshold');
    }

    return {
      valid: violated.length === 0,
      violatedConstraints: violated,
      details,
    };
  }
}
