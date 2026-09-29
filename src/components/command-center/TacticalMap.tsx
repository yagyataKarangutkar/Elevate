import { useRef, useEffect, useState, useMemo } from 'react';
import type { Agent, AgentId } from '../../types';
import { Compass, ZoomIn, ZoomOut, RotateCcw, AlertTriangle } from 'lucide-react';
import { playUiTick } from '../../utils/audio';

interface TacticalMapProps {
  agents: Agent[];
  survivorCoords: { x: number; y: number };
  isReplanning?: boolean;
  replanApproved?: boolean;
  d3Offline?: boolean;
  onSelectAgent?: (id: AgentId) => void;
  selectedAgentId?: AgentId | null;
}

export const TacticalMap: React.FC<TacticalMapProps> = ({
  agents,
  survivorCoords,
  isReplanning = false,
  replanApproved = false,
  d3Offline = false,
  onSelectAgent,
  selectedAgentId = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [hoveredAgent, setHoveredAgent] = useState<AgentId | null>(null);

  // Flight paths / waypoints for agents
  const routes = useMemo(() => {
    return {
      // D1 reconnaissance sweep in sector A
      D1: [
        { x: 260, y: 180 },
        { x: 310, y: 150 },
        { x: 370, y: 190 },
        { x: 320, y: 220 },
      ],
      // D2 survey path
      D2: [
        { x: 220, y: 340 },
        { x: 280, y: 390 },
        { x: 350, y: 360 },
        { x: 290, y: 310 },
      ],
      // D3 relay path
      D3: [
        { x: 580, y: 170 },
        { x: 620, y: 210 },
        { x: 560, y: 240 },
        { x: 530, y: 190 },
      ],
      // G1 GroundBot path
      G1: replanApproved
        ? [
            { x: 520, y: 440 },
            { x: 480, y: 380 },
            { x: 440, y: 340 }, // Reaches survivor
          ]
        : [
            { x: 540, y: 460 },
            { x: 520, y: 430 },
            { x: 550, y: 410 },
          ],
      // Blocked route from D3 / Sector B to Survivor
      blockedRoute: [
        { x: 560, y: 210 },
        { x: 520, y: 260 },
        { x: 480, y: 290 },
        { x: 440, y: 320 },
      ],
      // Safe rescue route to Survivor
      safeRescueRoute: [
        { x: 520, y: 430 },
        { x: 470, y: 380 },
        { x: 440, y: 330 },
      ],
    };
  }, [replanApproved]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.02;
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 550);

      // Coordinate scaling based on zoom
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      // Apply center zoom
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoomLevel, zoomLevel);
      ctx.translate(-width / 2, -height / 2);

      // Perspective tilt if 3D mode
      if (viewMode === '3d') {
        // Subtle isometric projection transform
        ctx.transform(1, -0.05, 0.05, 0.95, 0, 10);
      }

      // 1. Dark Topographical Background Contours
      drawTopographicalContours(ctx, width, height, time);

      // 2. Wireframe Buildings / City Blocks in Sector A/B (matching reference)
      drawWireframeBuildings(ctx);

      // 3. Grid & Coordinate Crosshairs
      drawTacticalGrid(ctx, width, height);

      // 4. Draw Routes
      // Blocked Route (Red Dashed)
      drawDashedRoute(ctx, routes.blockedRoute, '#F25D5D', 'BLOCKED ROUTE (DEBRIS)', true, time);

      // Safe Rescue Route
      drawDashedRoute(
        ctx,
        routes.safeRescueRoute,
        isReplanning ? '#F0AE63' : '#78D6A3',
        isReplanning ? 'REPLANNING ROUTE...' : 'SAFE EXTRACTION ROUTE',
        false,
        time
      );

      // 5. Communication Mesh Links between Agents
      drawCommunicationMesh(ctx, agents, d3Offline, time);

      // 6. Survivor Marker (Pulsing Radar Rings)
      drawSurvivorTarget(ctx, survivorCoords.x, survivorCoords.y, time);

      // 7. Draw Agents (with positions calculated along flight paths)
      agents.forEach((agent) => {
        let posX = agent.coords.x;
        let posY = agent.coords.y;

        // Dynamic motion along waypoints
        if (agent.id === 'D1') {
          const t = (time * 0.4) % (Math.PI * 2);
          posX = 320 + Math.cos(t) * 45;
          posY = 180 + Math.sin(t) * 25;
        } else if (agent.id === 'D2') {
          const t = (time * 0.35 + 1.2) % (Math.PI * 2);
          posX = 280 + Math.cos(t) * 50;
          posY = 360 + Math.sin(t) * 30;
        } else if (agent.id === 'D3') {
          if (!d3Offline) {
            const t = (time * 0.45 + 2.5) % (Math.PI * 2);
            posX = 570 + Math.cos(t) * 35;
            posY = 200 + Math.sin(t) * 20;
          } else {
            // Stranded at failure coordinates
            posX = 575;
            posY = 195;
          }
        } else if (agent.id === 'G1') {
          if (replanApproved) {
            // GroundBot advancing towards survivor
            const progress = Math.min(1, ((time * 0.15) % 1.5));
            posX = 520 - progress * (520 - 440);
            posY = 430 - progress * (430 - 330);
          } else {
            const t = Math.sin(time * 0.2) * 10;
            posX = 520 + t;
            posY = 430;
          }
        }

        drawAgentMarker(
          ctx,
          agent,
          posX,
          posY,
          hoveredAgent === agent.id || selectedAgentId === agent.id,
          time
        );
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [viewMode, zoomLevel, agents, survivorCoords, isReplanning, replanApproved, d3Offline, hoveredAgent, selectedAgentId, routes]);

  // Topographic contour curves
  const drawTopographicalContours = (
    ctx: CanvasRenderingContext2D,
    w: number,
    _h: number,
    time: number
  ) => {
    ctx.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.strokeStyle = i % 3 === 0 ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.05)';
      const cy = 80 + i * 45;
      ctx.moveTo(0, cy);
      for (let x = 0; x <= w; x += 30) {
        const yOffset =
          Math.sin(x * 0.008 + i * 0.4 + time * 0.05) * 22 +
          Math.cos(x * 0.015 + i * 0.6) * 14;
        ctx.lineTo(x, cy + yOffset);
      }
      ctx.stroke();
    }
  };

  // Wireframe city block / rubble geometry in bottom-left
  const drawWireframeBuildings = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1;

    const buildings = [
      { x: 150, y: 390, w: 42, h: 26, z: 24 },
      { x: 200, y: 380, w: 55, h: 32, z: 34 },
      { x: 170, y: 430, w: 60, h: 30, z: 20 },
      { x: 240, y: 420, w: 45, h: 38, z: 42 },
      { x: 130, y: 440, w: 35, h: 25, z: 16 },
    ];

    buildings.forEach((b) => {
      // Base
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      // Isometric Top
      ctx.strokeRect(b.x - b.z * 0.4, b.y - b.z * 0.5, b.w, b.h);
      // Pillars
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - b.z * 0.4, b.y - b.z * 0.5);
      ctx.moveTo(b.x + b.w, b.y);
      ctx.lineTo(b.x + b.w - b.z * 0.4, b.y - b.z * 0.5);
      ctx.moveTo(b.x + b.w, b.y + b.h);
      ctx.lineTo(b.x + b.w - b.z * 0.4, b.y + b.h - b.z * 0.5);
      ctx.moveTo(b.x, b.y + b.h);
      ctx.lineTo(b.x - b.z * 0.4, b.y + b.h - b.z * 0.5);
      ctx.stroke();
    });
  };

  const drawTacticalGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const step = 60;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const drawDashedRoute = (
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    color: string,
    label: string,
    isBlocked: boolean,
    time: number
  ) => {
    if (points.length < 2) return;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash(isBlocked ? [6, 6] : [8, 4]);
    ctx.lineDashOffset = -time * 14;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();

    // Route waypoint dots
    points.forEach((p, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, idx === points.length - 1 ? 3.5 : 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Label tag
    const midPoint = points[Math.floor(points.length / 2)];
    if (midPoint) {
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = color;
      ctx.fillText(label, midPoint.x + 10, midPoint.y - 6);
    }
    ctx.restore();
  };

  const drawCommunicationMesh = (
    ctx: CanvasRenderingContext2D,
    agentsList: Agent[],
    offlineD3: boolean,
    time: number
  ) => {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.lineDashOffset = -time * 8;

    // Draw lines between active agents
    for (let i = 0; i < agentsList.length; i++) {
      for (let j = i + 1; j < agentsList.length; j++) {
        const a1 = agentsList[i];
        const a2 = agentsList[j];

        // Break connection if D3 is offline
        if (offlineD3 && (a1.id === 'D3' || a2.id === 'D3')) {
          continue;
        }

        ctx.beginPath();
        ctx.moveTo(a1.coords.x, a1.coords.y);
        ctx.lineTo(a2.coords.x, a2.coords.y);
        ctx.stroke();

        // Traveling data packet
        const t = (time * 0.4 + (i + j) * 0.25) % 1;
        const px = a1.coords.x + (a2.coords.x - a1.coords.x) * t;
        const py = a1.coords.y + (a2.coords.y - a1.coords.y) * t;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  };

  const drawSurvivorTarget = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number
  ) => {
    ctx.save();
    // Expanding pulse radar rings
    const ring1 = ((time * 20) % 45);
    const ring2 = (((time * 20) + 22) % 45);

    ctx.strokeStyle = 'rgba(240, 174, 99, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, ring1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y, ring2, 0, Math.PI * 2);
    ctx.stroke();

    // Center pin
    ctx.fillStyle = '#F0AE63';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Badge label
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#F0AE63';
    ctx.fillText('✦ Survivor #1', x + 12, y + 4);

    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(240, 174, 99, 0.7)';
    ctx.fillText('CONFIRMED VITALS', x + 12, y + 14);

    ctx.restore();
  };

  const drawAgentMarker = (
    ctx: CanvasRenderingContext2D,
    agent: Agent,
    x: number,
    y: number,
    isHovered: boolean,
    time: number
  ) => {
    ctx.save();

    const isOffline = agent.status === 'offline';
    const isWarning = agent.status === 'warning' || agent.battery < 20;

    const mainColor = isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : '#78D6A3';

    // Hover / selection halo
    if (isHovered) {
      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Outer wireframe glyph
    if (agent.type === 'drone') {
      // Drone cross-rotor symbol
      ctx.strokeStyle = isOffline ? '#F25D5D' : '#ffffff';
      ctx.lineWidth = 1.2;

      // Central ring
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.stroke();

      // 4 rotor points
      const armDist = 10;
      const angle = time * 2;
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((rot) => {
        const rx = x + Math.cos(angle + rot) * armDist;
        const ry = y + Math.sin(angle + rot) * armDist;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(rx, ry);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(rx, ry, 2, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else {
      // GroundBot rover rectangular glyph with wheels
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(x - 9, y - 6, 18, 12);
      // Wheels
      [-11, 7].forEach((wx) => {
        [-8, 4].forEach((wy) => {
          ctx.strokeRect(x + wx, y + wy, 4, 4);
        });
      });
    }

    // Tag badge
    const badgeText = `${agent.id}`;
    ctx.font = '600 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#050607';

    // Badge bubble
    const bx = x + 14;
    const by = y - 10;
    ctx.fillStyle = isOffline ? 'rgba(242, 93, 93, 0.9)' : 'rgba(8, 10, 11, 0.9)';
    ctx.strokeStyle = isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.fillRect(bx, by, 36, 16);
    ctx.strokeRect(bx, by, 36, 16);

    ctx.fillStyle = isOffline ? '#ffffff' : mainColor;
    ctx.fillText(badgeText, bx + 6, by + 12);

    if (isHovered || isOffline) {
      // Extended hover pill
      const subText = isOffline ? 'OFFLINE (COMM LOST)' : `${agent.role} · ${agent.battery}%`;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = isOffline ? '#F25D5D' : '#A7ADAB';
      ctx.fillText(subText, bx + 42, by + 12);
    }

    ctx.restore();
  };

  return (
    <div
      className="tactical-map-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: '#050607',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const my = e.clientY - rect.top;
          const found = agents.find((a) => {
            const dx = a.coords.x - mx;
            const dy = a.coords.y - my;
            return Math.sqrt(dx * dx + dy * dy) < 30;
          });
          setHoveredAgent(found ? found.id : null);
        }}
        onClick={() => {
          if (hoveredAgent && onSelectAgent) {
            playUiTick();
            onSelectAgent(hoveredAgent);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'crosshair',
        }}
      />

      {/* Compass Rose in Top Left matching visual reference */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          color: '#A7ADAB',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(5, 6, 7, 0.65)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Compass size={14} color="#F2F4F2" />
        </div>
        <span>N</span>
      </div>

      {/* Replan alert banner if active */}
      {isReplanning && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(240, 174, 99, 0.15)',
            border: '1px solid #F0AE63',
            color: '#F0AE63',
            padding: '6px 14px',
            borderRadius: '4px',
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '11px',
            letterSpacing: '0.08em',
            animation: 'pulse 1.5s infinite',
            zIndex: 10,
          }}
        >
          <AlertTriangle size={14} />
          <span>REPLANNING MISSION ROUTES — ADAPTING TO MESH SEPARATION</span>
        </div>
      )}

      {/* Map Mode & Zoom Controls (Bottom Right) matching visual reference */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          gap: '4px',
          zIndex: 10,
        }}
      >
        <button
          onClick={() => {
            playUiTick();
            setViewMode('3d');
          }}
          style={{
            background: viewMode === '3d' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(8, 10, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#F2F4F2',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", monospace',
            cursor: 'pointer',
          }}
        >
          3D
        </button>
        <button
          onClick={() => {
            playUiTick();
            setViewMode('2d');
          }}
          style={{
            background: viewMode === '2d' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(8, 10, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#F2F4F2',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '11px',
            fontFamily: '"JetBrains Mono", monospace',
            cursor: 'pointer',
          }}
        >
          2D
        </button>
        <button
          onClick={() => {
            playUiTick();
            setZoomLevel((z) => Math.max(0.7, z - 0.15));
          }}
          title="Zoom Out"
          style={{
            background: 'rgba(8, 10, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#F2F4F2',
            padding: '5px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ZoomOut size={12} />
        </button>
        <button
          onClick={() => {
            playUiTick();
            setZoomLevel((z) => Math.min(1.8, z + 0.15));
          }}
          title="Zoom In"
          style={{
            background: 'rgba(8, 10, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#F2F4F2',
            padding: '5px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ZoomIn size={12} />
        </button>
        <button
          onClick={() => {
            playUiTick();
            setZoomLevel(1.0);
          }}
          title="Reset View"
          style={{
            background: 'rgba(8, 10, 11, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#A7ADAB',
            padding: '5px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <RotateCcw size={12} />
        </button>
      </div>

      {/* Legend Box in Bottom Left matching visual reference */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(8, 10, 11, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '6px',
          padding: '8px 12px',
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '10px',
          color: '#A7ADAB',
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        <div style={{ color: '#68706D', fontWeight: 600, fontSize: '9px', letterSpacing: '0.06em' }}>
          TERRAIN & ROUTING
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '18px', height: '2px', background: '#78D6A3' }} />
          <span>Safe Route</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '18px',
              height: '2px',
              background: 'repeating-linear-gradient(90deg, #F25D5D, #F25D5D 4px, transparent 4px, transparent 7px)',
            }}
          />
          <span>Blocked Route</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              width: '18px',
              height: '2px',
              background: 'repeating-linear-gradient(90deg, #ffffff, #ffffff 3px, transparent 3px, transparent 6px)',
            }}
          />
          <span>Communication Link</span>
        </div>
      </div>
    </div>
  );
};
