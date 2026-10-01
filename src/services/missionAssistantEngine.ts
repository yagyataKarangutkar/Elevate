import type {
  MissionAssistantContext,
  AssistantResponse,
} from '../types/assistant';

export class MissionAssistantEngine {
  /**
   * Generates dynamic contextual quick questions based on live mission state (Spec §10, §31, §32)
   */
  public static getQuickQuestions(ctx: MissionAssistantContext): string[] {
    if (ctx.approvalRequired) {
      return [
        'Why do you need me?',
        'Why GroundBot?',
        'What happens if I approve?',
        'What happens if I reject?',
      ];
    }

    if (ctx.d3Offline || ctx.routeBlocked || ctx.groundFailed) {
      return [
        ctx.d3Offline ? 'What happened to Drone 03?' : 'What went wrong?',
        'Why did the plan change?',
        'What changed?',
        'Is the mission still possible?',
      ];
    }

    if (ctx.mission.status === 'BLOCKED') {
      return [
        'Why is the mission blocked?',
        'What can we do next?',
        'Can we still complete the mission?',
        'How are the robots doing?',
      ];
    }

    // Default / normal state
    return [
      'What is happening right now?',
      'Why is the swarm doing this?',
      'Is the mission still possible?',
      'How are the robots doing?',
    ];
  }

  /**
   * Evaluates user query and returns structured, plain-English response
   */
  public static answerQuestion(
    query: string,
    ctx: MissionAssistantContext
  ): AssistantResponse {
    const q = query.toLowerCase().trim();

    // 1. APPROVAL: WHY DO YOU NEED ME / WHY ASK
    if (
      q.includes('why do you need me') ||
      q.includes('why are you asking') ||
      q.includes('why need me') ||
      q.includes('why human')
    ) {
      return {
        answer:
          'I need your decision because the current recovery options exceed autonomous risk thresholds. I require human authorization before dispatching emergency reserve assets.',
        evidence: [
          { label: 'Trigger', value: 'Uncertainty threshold reached', status: 'warning' },
          { label: 'Recommendation', value: 'Deploy GroundBot reserve', status: 'good' },
          { label: 'Risk Factor', value: 'Structural rubble proximity', status: 'warning' },
        ],
        action: {
          label: 'View Decision',
          type: 'view_decision',
        },
        technicalDetails: {
          'Safety Constraint': 'ISO-10218 Human-in-the-Loop requirement',
          'Confidence Score': `${ctx.mission.confidence}%`,
          'Reserve Unit': 'GroundBot 02',
        },
      };
    }

    // 2. APPROVAL: WHY GROUNDBOT
    if (
      q.includes('why groundbot') ||
      q.includes('why choose groundbot') ||
      q.includes('why ground')
    ) {
      return {
        answer:
          'GroundBot was recommended because it has a reachable ground corridor, full battery reserve, and is equipped to carry medical aid payloads directly to survivors.',
        evidence: [
          { label: 'Corridor', value: 'Alternate Path B reachable', status: 'good' },
          { label: 'Battery', value: '91% reserve', status: 'good' },
          { label: 'Payload', value: 'Emergency aid kit onboard', status: 'good' },
          { label: 'Risk Rating', value: 'Lowest available risk', status: 'good' },
        ],
        action: {
          label: 'Show GroundBot on Map',
          type: 'highlight_agent',
          agentId: 'G1',
        },
      };
    }

    // 3. APPROVAL: WHAT HAPPENS IF I APPROVE
    if (
      q.includes('what happens if i approve') ||
      q.includes('if i approve') ||
      q.includes('consequence of approval')
    ) {
      return {
        answer:
          'GroundBot will leave its staging location and proceed along the verified alternate path to the survivor rescue zone. The rest of the swarm will continue their current tasks unchanged.',
        evidence: [
          { label: 'Immediate Action', value: 'GroundBot dispatched to Zone A', status: 'good' },
          { label: 'Mission Impact', value: 'All 7 other tasks stay unchanged', status: 'good' },
          { label: 'ETA to Survivor', value: '11 minutes', status: 'neutral' },
        ],
        action: {
          label: 'View Decision',
          type: 'view_decision',
        },
      };
    }

    // 4. APPROVAL: WHAT HAPPENS IF I REJECT
    if (
      q.includes('what happens if i reject') ||
      q.includes('if i reject') ||
      q.includes('if reject')
    ) {
      return {
        answer:
          'MissionMind will not execute the recommended reserve dispatch. The rescue task will remain unassigned, and the swarm will hold position awaiting alternate operator commands.',
        evidence: [
          { label: 'Action', value: 'No reserve unit deployed', status: 'warning' },
          { label: 'Mission State', value: 'Swarm pauses on rescue objective', status: 'critical' },
          { label: 'Deadline Risk', value: 'Exceeds operational window', status: 'critical' },
        ],
      };
    }

    // 5. DRONE 03 / WHAT HAPPENED TO D3 / COMMUNICATION
    if (
      q.includes('drone 03') ||
      q.includes('drone-03') ||
      q.includes('d3') ||
      q.includes('offline') ||
      q.includes('signal loss')
    ) {
      const d3 = ctx.agents.find((a) => a.id === 'D3');
      const isOff = ctx.d3Offline || d3?.status === 'offline';
      return {
        answer: isOff
          ? 'Drone 03 lost communication in Sector C. Its signal dropped to 0%, so MissionMind marked it offline and reassigned its 2 search tasks to nearby Drone 02.'
          : 'Drone 03 is operating normally as communication relay in Sector C with 61% battery.',
        evidence: [
          { label: 'Status', value: isOff ? 'Offline (Lost Link)' : 'Active', status: isOff ? 'critical' : 'good' },
          { label: 'Signal', value: isOff ? '0%' : `${d3?.signal || 91}%`, status: isOff ? 'critical' : 'good' },
          { label: 'Sector', value: 'Sector C (East Corridor)', status: 'neutral' },
          { label: 'Reassignment', value: isOff ? 'Drone 02 covering Zone C' : 'None needed', status: 'good' },
        ],
        action: {
          label: 'Show D3 on Map',
          type: 'highlight_agent',
          agentId: 'D3',
        },
        technicalDetails: {
          'Agent ID': 'D3 (DRONE-03)',
          'Role': 'Communication Relay & Sector C Survey',
          'Last Heartbeat': isOff ? '14:26:12 UTC' : 'Live (<1s)',
          'Failure Mode': 'Optical line-of-sight obstruction',
        },
        relatedAgentId: 'D3',
      };
    }

    // 6. DRONE 02 / WHY D2 / RELAY
    if (q.includes('drone 02') || q.includes('drone-02') || q.includes('d2')) {
      const d2 = ctx.agents.find((a) => a.id === 'D2');
      return {
        answer: ctx.d2RelayActive
          ? 'Drone 02 expanded its coverage to include Sector C after Drone 03 dropped offline. It has 74% battery and sufficient range to bridge both sectors.'
          : 'Drone 02 is actively conducting visual survey sweep across Sector B.',
        evidence: [
          { label: 'Status', value: 'Active', status: 'good' },
          { label: 'Battery', value: `${d2?.battery || 74}%`, status: 'good' },
          { label: 'Assigned Task', value: ctx.d2RelayActive ? 'Search Sector B + C Relay' : 'Visual Scan Zone B', status: 'good' },
        ],
        action: {
          label: 'Show D2 on Map',
          type: 'highlight_agent',
          agentId: 'D2',
        },
        relatedAgentId: 'D2',
      };
    }

    // 7. DRONE 01 / SECTOR A / WHY D1
    if (q.includes('drone 01') || q.includes('drone-01') || q.includes('d1')) {
      const d1 = ctx.agents.find((a) => a.id === 'D1');
      return {
        answer:
          'Drone 01 is leading the thermal imaging sweep in Sector A. It was selected because it carries thermal sensors and was positioned closest to the primary survivor heat signatures.',
        evidence: [
          { label: 'Status', value: 'Active', status: 'good' },
          { label: 'Battery', value: `${d1?.battery || 82}%`, status: 'good' },
          { label: 'Role', value: 'Thermal Imaging & Search', status: 'good' },
          { label: 'Zone', value: 'Sector A', status: 'neutral' },
        ],
        action: {
          label: 'Show D1 on Map',
          type: 'highlight_agent',
          agentId: 'D1',
        },
        relatedAgentId: 'D1',
      };
    }

    // 8. WHAT CHANGED / WHY DID THE PLAN CHANGE / REPLAN
    if (
      q.includes('why did the plan change') ||
      q.includes('why did the mission change') ||
      q.includes('what changed') ||
      q.includes('replan') ||
      q.includes('tasks changed')
    ) {
      return {
        answer:
          'MissionMind adapted the plan to handle disruptions with the smallest safe change. Only 2 of 9 tasks changed, while 7 tasks remained completely unchanged.',
        evidence: [
          { label: 'Tasks Changed', value: '2 of 9 (isolated)', status: 'good' },
          { label: 'Tasks Unchanged', value: '7 of 9 (stable)', status: 'good' },
          { label: 'Stability Index', value: '78% plan preservation', status: 'good' },
        ],
        action: {
          label: 'Show What Changed',
          type: 'show_replan',
        },
        technicalDetails: {
          'Disruption 1': 'Drone 03 signal loss in Sector C',
          'Disruption 2': 'GroundBot route obstructed by debris',
          'Replanning Latency': '0.8 seconds',
          'Principle': 'Minimal perturbation / recovery ladder',
        },
      };
    }

    // 9. IS THE MISSION STILL POSSIBLE / CAN WE FINISH / FEASIBILITY
    if (
      q.includes('possible') ||
      q.includes('can we finish') ||
      q.includes('feasible') ||
      q.includes('still possible') ||
      q.includes('complete the mission')
    ) {
      const feasible = ctx.mission.status !== 'BLOCKED';
      return {
        answer: feasible
          ? 'Yes — the mission can still be completed. All required survivor extraction and search sectors are covered within safe battery return limits.'
          : 'The mission is currently blocked due to a ground drive failure, but can be restored immediately by approving the reserve robot.',
        evidence: [
          { label: 'Feasibility', value: feasible ? 'Confirmed Feasible' : 'Blocked (Awaiting Reserve)', status: feasible ? 'good' : 'critical' },
          { label: 'Confidence', value: `${ctx.mission.confidence}%`, status: feasible ? 'good' : 'warning' },
          { label: 'Estimated Time', value: '14 min (within 14:45 limit)', status: 'good' },
        ],
      };
    }

    // 10. WHAT IS HAPPENING RIGHT NOW / STATUS / WHAT IS THE SWARM DOING
    if (
      q.includes('happening') ||
      q.includes('what is the swarm doing') ||
      q.includes('current activity') ||
      q.includes('summary')
    ) {
      const d1 = ctx.agents.find((a) => a.id === 'D1');
      const d2 = ctx.agents.find((a) => a.id === 'D2');
      const d3 = ctx.agents.find((a) => a.id === 'D3');
      const g1 = ctx.agents.find((a) => a.id === 'G1');

      return {
        answer:
          `Drone 01 is sweeping Sector A, Drone 02 is scanning Sector B, Drone 03 is ${d3?.status === 'offline' ? 'offline' : 'on relay'}, and GroundBot is preparing rescue payload. Mission status: ${ctx.mission.status.toLowerCase()}.`,
        evidence: [
          { label: 'D1', value: `${d1?.task || 'Sector A'} (${d1?.battery}%)`, status: 'good' },
          { label: 'D2', value: `${d2?.task || 'Sector B'} (${d2?.battery}%)`, status: 'good' },
          { label: 'D3', value: d3?.status === 'offline' ? 'Offline' : `${d3?.battery}%`, status: d3?.status === 'offline' ? 'critical' : 'good' },
          { label: 'G1', value: `${g1?.task || 'Rescue'} (${g1?.battery}%)`, status: 'good' },
        ],
      };
    }

    // 11. HOW ARE THE ROBOTS DOING / AGENT HEALTH / BATTERY / SIGNAL
    if (
      q.includes('robots doing') ||
      q.includes('how are the robots') ||
      q.includes('health') ||
      q.includes('battery') ||
      q.includes('signal')
    ) {
      return {
        answer:
          'Three robots are operating with healthy battery and telemetry links. Drone 03 is offline, and GroundBot has enough reserve power for ground transit.',
        evidence: ctx.agents.map((a) => ({
          label: a.name,
          value: `${a.status.toUpperCase()} · Batt ${a.battery}% · Sig ${a.signal}%`,
          status: a.status === 'active' ? 'good' : a.status === 'warning' ? 'warning' : 'critical',
        })),
      };
    }

    // 12. SURVIVOR / WHERE ARE SURVIVORS
    if (q.includes('survivor') || q.includes('found') || q.includes('casualt')) {
      return {
        answer:
          ctx.mission.survivorsFound > 0
            ? `${ctx.mission.survivorsFound} survivors detected in Sector A structure cluster. Thermal coordinates are locked and GroundBot is assigned for extraction.`
            : 'No survivors confirmed yet. Drones 01 and 02 are actively sweeping Sectors A and B.',
        evidence: [
          { label: 'Detected', value: `${ctx.mission.survivorsFound} confirmed`, status: ctx.mission.survivorsFound > 0 ? 'good' : 'neutral' },
          { label: 'Location', value: 'Sector A [290, 150]', status: 'neutral' },
          { label: 'Priority', value: 'Tier-1 Emergency Extraction', status: 'warning' },
        ],
        action: {
          label: 'Show D1 on Map',
          type: 'highlight_agent',
          agentId: 'D1',
        },
      };
    }

    // 13. WHAT WENT WRONG / RECENT EVENTS / WHAT HAPPENED
    if (
      q.includes('what went wrong') ||
      q.includes('what happened') ||
      q.includes('recent') ||
      q.includes('events')
    ) {
      const recent = ctx.events.slice(0, 3);
      const eventSummary = recent.map((e) => `• ${e.title}: ${e.detail}`).join('\n');

      return {
        answer:
          recent.length > 0
            ? `Here are the latest recorded events:\n${eventSummary}`
            : 'All systems are currently executing without active faults.',
        evidence: recent.map((e) => ({
          label: e.timestamp,
          value: e.title,
          status: e.level === 'critical' ? 'critical' : e.level === 'warning' ? 'warning' : 'good',
        })),
        action: {
          label: 'View Event Feed',
          type: 'view_event',
        },
      };
    }

    // 14. DEFAULT / FALLBACK
    return {
      answer:
        'I am monitoring 4 swarm robots and 9 rescue tasks in real time. You can ask me about robot status, why routes changed, feasibility, or recent mission events.',
      evidence: [
        { label: 'Active Mission', value: ctx.mission.name, status: 'good' },
        { label: 'Swarm Status', value: `${ctx.agents.filter((a) => a.status === 'active').length} / ${ctx.agents.length} active`, status: 'neutral' },
        { label: 'Current Phase', value: ctx.mission.phase.toUpperCase(), status: 'neutral' },
      ],
    };
  }
}
