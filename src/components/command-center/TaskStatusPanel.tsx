import React from 'react';

export interface TaskItem {
  id: string;
  number: string;
  name: string;
  agent: string;
  capability: string;
  status: 'IN PROGRESS' | 'READY' | 'QUEUED' | 'COMPLETED' | 'UNASSIGNED' | 'BLOCKED';
  priority: '01' | '02' | '03';
  zone: string;
  moved?: boolean;
}

interface TaskStatusPanelProps {
  tasks?: TaskItem[];
}

export const INITIAL_DEMO_TASKS: TaskItem[] = [
  {
    id: 't1',
    number: '01',
    name: 'Survey Zone A',
    agent: 'DRONE-02',
    capability: 'Aerial search & Mapping',
    status: 'IN PROGRESS',
    priority: '01',
    zone: 'ZONE A',
  },
  {
    id: 't2',
    number: '02',
    name: 'Thermal Scan Zone A',
    agent: 'DRONE-01',
    capability: 'Thermal imaging',
    status: 'READY',
    priority: '01',
    zone: 'ZONE A',
  },
  {
    id: 't3',
    number: '03',
    name: 'Survey Zone B',
    agent: 'DRONE-03',
    capability: 'Mapping',
    status: 'QUEUED',
    priority: '02',
    zone: 'ZONE B',
  },
  {
    id: 't4',
    number: '04',
    name: 'Visual Scan Zone B',
    agent: 'DRONE-02',
    capability: 'Optical camera',
    status: 'QUEUED',
    priority: '02',
    zone: 'ZONE B',
  },
  {
    id: 't5',
    number: '05',
    name: 'Survey Zone C',
    agent: 'DRONE-03',
    capability: 'Visual search',
    status: 'QUEUED',
    priority: '03',
    zone: 'ZONE C',
  },
  {
    id: 't6',
    number: '06',
    name: 'Identify Survivors',
    agent: 'DRONE-01',
    capability: 'Thermal imaging & Search',
    status: 'QUEUED',
    priority: '01',
    zone: 'ZONE A',
  },
  {
    id: 't7',
    number: '07',
    name: 'Confirm Survivor Location',
    agent: 'DRONE-03',
    capability: 'Communication relay',
    status: 'QUEUED',
    priority: '01',
    zone: 'ZONE A',
  },
  {
    id: 't8',
    number: '08',
    name: 'Deliver Aid Kit',
    agent: 'GROUND-01',
    capability: 'Aid payload & Ground move',
    status: 'QUEUED',
    priority: '01',
    zone: 'ZONE A',
  },
  {
    id: 't9',
    number: '09',
    name: 'Rescue Survivor',
    agent: 'GROUND-01',
    capability: 'Survivor rescue',
    status: 'QUEUED',
    priority: '01',
    zone: 'ZONE A',
  },
];

export const TaskStatusPanel: React.FC<TaskStatusPanelProps> = ({
  tasks = INITIAL_DEMO_TASKS,
}) => {
  return (
    <div
      style={{
        background: '#080A0B',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '6px',
        padding: '16px',
        fontFamily: '"JetBrains Mono", monospace',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            color: '#A7ADAB',
          }}
        >
          TASK STATUS
        </span>
        <span
          style={{
            fontSize: '10px',
            color: '#78D6A3',
          }}
        >
          {tasks.length} TASKS SCHEDULED
        </span>
      </div>

      <div
        style={{
          maxHeight: '220px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          paddingRight: '4px',
        }}
      >
        {tasks.map((task) => {
          const isProgress = task.status === 'IN PROGRESS';
          const isReady = task.status === 'READY';
          const isCompleted = task.status === 'COMPLETED';
          const isUnassigned = task.status === 'UNASSIGNED';
          const isBlocked = task.status === 'BLOCKED';

          const statusColor = isUnassigned || isBlocked
            ? '#F25D5D'
            : isCompleted || isProgress
            ? '#78D6A3'
            : isReady
            ? '#F2F4F2'
            : '#68706D';

          return (
            <div
              key={task.id}
              style={{
                background: isUnassigned
                  ? 'rgba(242, 93, 93, 0.08)'
                  : task.moved
                  ? 'rgba(240, 174, 99, 0.08)'
                  : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${
                  isUnassigned
                    ? 'rgba(242, 93, 93, 0.4)'
                    : task.moved
                    ? 'rgba(240, 174, 99, 0.4)'
                    : 'rgba(255, 255, 255, 0.06)'
                }`,
                borderRadius: '4px',
                padding: '8px 10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#68706D', fontWeight: 600 }}>{task.number}</span>
                  <span style={{ fontSize: '11px', color: '#F2F4F2', fontWeight: 500 }}>{task.name}</span>
                  {task.moved && (
                    <span
                      style={{
                        fontSize: '8px',
                        padding: '1px 4px',
                        borderRadius: '2px',
                        background: 'rgba(240, 174, 99, 0.2)',
                        color: '#F0AE63',
                        border: '1px solid rgba(240, 174, 99, 0.4)',
                        fontWeight: 700,
                      }}
                    >
                      MOVED
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '9px',
                    padding: '1px 5px',
                    borderRadius: '2px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: statusColor,
                    border: `1px solid ${statusColor}33`,
                    fontWeight: 600,
                  }}
                >
                  {task.status}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px' }}>
                <span style={{ color: isUnassigned ? '#F25D5D' : '#78D6A3', fontWeight: isUnassigned ? 600 : 400 }}>
                  {task.agent}
                </span>
                <span style={{ color: '#68706D' }}>{task.zone} · P-{task.priority}</span>
              </div>

              <div style={{ fontSize: '9px', color: '#A7ADAB', fontStyle: 'italic' }}>
                Req: {task.capability}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
