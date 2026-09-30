/**
 * MissionMind Mission Engine
 * Models mission telemetry, tracks status transitions,
 * detects failures, and identifies affected tasks and blocking constraints.
 */

import type { Agent } from '../types';
import type { TaskItem } from '../components/command-center/TaskStatusPanel';
import { ConstraintEngine } from './constraintEngine';

export type MissionFeasibilityStatus = 'FEASIBLE' | 'RECOVERING' | 'BLOCKED';

export interface MissionAnalysisResult {
  status: MissionFeasibilityStatus;
  affectedTasks: TaskItem[];
  blockingConstraints: string[];
  offlineAgents: Agent[];
  remainingOnlineAgents: Agent[];
  reassignmentCandidateFailures: {
    agentName: string;
    reason: string;
  }[];
}

export class MissionEngine {
  /**
   * Inspects current mission state to identify offline agents, unassigned tasks,
   * and blocking constraints.
   */
  static analyzeMission(agents: Agent[], tasks: TaskItem[]): MissionAnalysisResult {
    const offlineAgents = agents.filter((a) => a.status === 'offline');
    const remainingOnlineAgents = agents.filter((a) => a.status !== 'offline');

    // Find affected tasks (either assigned to offline agents or marked UNASSIGNED)
    const affectedTasks = tasks.filter((t) => {
      const assignedAgent = agents.find((a) => a.name === t.agent || a.code === t.agent);
      return t.status === 'UNASSIGNED' || (assignedAgent && assignedAgent.status === 'offline');
    });

    const blockingConstraints: string[] = [];
    const reassignmentFailures: { agentName: string; reason: string }[] = [];

    // If there are affected tasks, check if any remaining online agent can take them
    if (affectedTasks.length > 0) {
      // Check each affected task against remaining agents
      for (const task of affectedTasks) {
        let canAnyAgentHandle = false;

        for (const candidate of remainingOnlineAgents) {
          const validation = ConstraintEngine.validateAllConstraints({
            agent: candidate,
            task,
          });

          if (validation.valid) {
            canAnyAgentHandle = true;
            break;
          } else {
            // Document the exact failure reason per agent
            if (candidate.type === 'drone') {
              if (task.capability.toLowerCase().includes('payload')) {
                reassignmentFailures.push({
                  agentName: candidate.name,
                  reason: 'INVALID — cannot carry aid payload',
                });
              } else if (task.capability.toLowerCase().includes('rescue') || task.capability.toLowerCase().includes('ground')) {
                reassignmentFailures.push({
                  agentName: candidate.name,
                  reason: 'INVALID — cannot perform ground rescue',
                });
              } else {
                reassignmentFailures.push({
                  agentName: candidate.name,
                  reason: 'INVALID — communication capability only',
                });
              }
            }
          }
        }

        if (!canAnyAgentHandle) {
          blockingConstraints.push(
            'No remaining agent can satisfy the ground transport + aid payload requirements.'
          );
        }
      }
    }

    // Deduplicate reassignment failures
    const uniqueFailures = Array.from(
      new Map(reassignmentFailures.map((item) => [item.agentName, item])).values()
    );

    const isBlocked = blockingConstraints.length > 0;

    return {
      status: isBlocked ? 'BLOCKED' : 'FEASIBLE',
      affectedTasks,
      blockingConstraints: Array.from(new Set(blockingConstraints)),
      offlineAgents,
      remainingOnlineAgents,
      reassignmentCandidateFailures: uniqueFailures,
    };
  }
}
