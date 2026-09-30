import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createQuadcopterDrone, createGroundBotRover, createTopographicalTerrain } from './WireframeModels';
import type { Agent } from '../../types';

interface SwarmCanvasProps {
  agents?: Agent[];
  onSelectAgent?: (id: string) => void;
  interactive?: boolean;
  mode?: 'hero' | 'inspector' | 'roverOnly' | 'droneOnly';
  focusedAgentId?: string | null;
}

interface ScreenAgentPin {
  id: string;
  name: string;
  role: string;
  battery: number;
  status: string;
  x: number;
  y: number;
  visible: boolean;
}

export const SwarmCanvas: React.FC<SwarmCanvasProps> = ({
  agents: propAgents,
  onSelectAgent,
  interactive = true,
  mode = 'hero',
  focusedAgentId = null
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenPins, setScreenPins] = useState<ScreenAgentPin[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 600;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, 0.035);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    if (mode === 'hero') {
      camera.position.set(0, 7.5, 17.5);
    } else if (mode === 'roverOnly') {
      camera.position.set(2.8, 3.2, 5.5);
    } else if (mode === 'droneOnly') {
      camera.position.set(2.2, 2.4, 4.4);
    } else {
      camera.position.set(0, 5, 12);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x050607, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Ambient subtle lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);

    // 3. Terrain
    if (mode !== 'roverOnly' && mode !== 'droneOnly') {
      const terrain = createTopographicalTerrain();
      scene.add(terrain);
    }

    // 4. Agents Setup
    const d1Data = createQuadcopterDrone();
    const d2Data = createQuadcopterDrone();
    const d3Data = createQuadcopterDrone();
    const gbData = createGroundBotRover();

    // Default hero layout matching visual reference
    // D2 top center (high survey), D1 left (recon), D3 right (relay), GroundBot bottom center (chassis on terrain)
    const agentObjects = [
      { id: 'D1', group: d1Data.group, rotors: d1Data.rotors, basePos: new THREE.Vector3(-4.8, 2.8, -0.5), speed: 1.1, name: 'DRONE-01', role: 'RECON', battery: 72 },
      { id: 'D2', group: d2Data.group, rotors: d2Data.rotors, basePos: new THREE.Vector3(0.3, 4.6, -3.2), speed: 0.9, name: 'DRONE-02', role: 'SURVEY', battery: 81 },
      { id: 'D3', group: d3Data.group, rotors: d3Data.rotors, basePos: new THREE.Vector3(5.2, 2.4, 0.8), speed: 1.2, name: 'DRONE-03', role: 'RELAY', battery: 68 },
      { id: 'G1', group: gbData.group, wheels: gbData.wheels, mast: gbData.sensorMast, basePos: new THREE.Vector3(-0.6, -1.0, 3.8), speed: 0.5, name: 'GROUND-BOT', role: 'RESCUE', battery: 64 },
    ];

    let droneOnlyRotors: THREE.Group[] = [];
    if (mode === 'roverOnly') {
      // Just focus on GroundBot
      const singleRover = createGroundBotRover();
      singleRover.group.position.set(0, -0.6, 0);
      singleRover.group.rotation.y = -Math.PI / 4;
      scene.add(singleRover.group);

      // Add faint inspection ground rings
      const ringGeo = new THREE.RingGeometry(2.4, 2.42, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.6;
      scene.add(ring);
    } else if (mode === 'droneOnly') {
      const singleDrone = createQuadcopterDrone();
      singleDrone.group.position.set(0, 0, 0);
      singleDrone.group.rotation.y = Math.PI / 6;
      droneOnlyRotors = singleDrone.rotors;
      scene.add(singleDrone.group);

      const ringGeo = new THREE.RingGeometry(2.2, 2.22, 48);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -0.8;
      scene.add(ring);
    } else {
      agentObjects.forEach((agent) => {
        agent.group.position.copy(agent.basePos);
        scene.add(agent.group);
      });
    }

    // 5. Communication Links & Data Packets (between Drones and GroundBot)
    const commPacketCount = 6;
    const packetMeshes: THREE.Mesh[] = [];
    const packetGeo = new THREE.SphereGeometry(0.08, 6, 6);
    const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });

    let commLinesGroup: THREE.Group | null = null;
    if (mode === 'hero') {
      commLinesGroup = new THREE.Group();
      scene.add(commLinesGroup);

      for (let i = 0; i < commPacketCount; i++) {
        const p = new THREE.Mesh(packetGeo, packetMat);
        packetMeshes.push(p);
        scene.add(p);
      }
    }

    // Mouse tracking for parallax tilt
    let mouseX = 0;
    let mouseY = 0;
    const targetCam = new THREE.Vector3().copy(camera.position);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x;
      mouseY = y;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Resize Observer
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      if (mode === 'hero') {
        targetCam.x = mouseX * 1.5;
        targetCam.y = 7.5 + mouseY * 1.0;
        camera.position.lerp(targetCam, 0.04);
        camera.lookAt(0, 1.2, 0);
      } else if (mode === 'roverOnly') {
        targetCam.x = 2.8 + mouseX * 0.8;
        targetCam.y = 3.2 + mouseY * 0.6;
        camera.position.lerp(targetCam, 0.05);
        camera.lookAt(0, 0.4, 0);
      } else if (mode === 'droneOnly') {
        targetCam.x = 2.2 + mouseX * 0.8;
        targetCam.y = 2.4 + mouseY * 0.6;
        camera.position.lerp(targetCam, 0.05);
        camera.lookAt(0, 0, 0);
        droneOnlyRotors.forEach((rotor) => {
          rotor.rotation.y += 0.35;
        });
      }

      // Animate agent objects
      if (mode !== 'roverOnly' && mode !== 'droneOnly') {
        agentObjects.forEach((agent) => {
          // Hover drift for drones
          if ('rotors' in agent && agent.rotors) {
            agent.group.position.y = agent.basePos.y + Math.sin(elapsed * 2.2 * agent.speed) * 0.12;
            agent.group.position.x = agent.basePos.x + Math.sin(elapsed * 1.4 * agent.speed) * 0.08;
            agent.group.rotation.z = Math.sin(elapsed * 1.8 * agent.speed) * 0.03;
            agent.group.rotation.x = Math.cos(elapsed * 1.5 * agent.speed) * 0.02;

            // Spin propellers fast
            agent.rotors.forEach((rotor) => {
              rotor.rotation.y += 0.35;
            });
          }

          // GroundBot rover animations
          if ('mast' in agent && agent.mast) {
            agent.mast.rotation.y = Math.sin(elapsed * 0.8) * 0.6;
          }
        });

        // Communication link lines updates & Data Packets animation
        if (commLinesGroup) {
          commLinesGroup.clear();
          const linePairs = [
            [d2Data.group.position, d1Data.group.position],
            [d2Data.group.position, d3Data.group.position],
            [d1Data.group.position, gbData.group.position],
            [d3Data.group.position, gbData.group.position],
            [d1Data.group.position, d3Data.group.position],
          ];

          const lineMat = new THREE.LineDashedMaterial({
            color: 0xffffff,
            dashSize: 0.35,
            gapSize: 0.25,
            transparent: true,
            opacity: 0.5,
          });

          linePairs.forEach((pair, idx) => {
            const geo = new THREE.BufferGeometry().setFromPoints(pair);
            const line = new THREE.Line(geo, lineMat);
            line.computeLineDistances();
            commLinesGroup?.add(line);

            // Move data packet along line
            if (packetMeshes[idx]) {
              const t = (elapsed * 0.55 + idx * 0.2) % 1;
              packetMeshes[idx].position.lerpVectors(pair[0], pair[1], t);
            }
          });
        }

        // Project 3D positions to screen coordinates for responsive telemetry tags
        const newPins: ScreenAgentPin[] = agentObjects.map((agent) => {
          const vector = new THREE.Vector3();
          agent.group.getWorldPosition(vector);
          vector.y += agent.id.startsWith('D') ? 0.9 : 1.3;
          vector.project(camera);

          const x = ((vector.x + 1) * width) / 2;
          const y = ((-vector.y + 1) * height) / 2;
          const visible = vector.z < 1;

          // Override status / battery if dynamic propAgents are provided
          const liveAgent = propAgents?.find((a) => a.id === agent.id);

          return {
            id: agent.id,
            name: liveAgent?.name || agent.name,
            role: liveAgent?.role || agent.role,
            battery: liveAgent?.battery ?? agent.battery,
            status: liveAgent?.status || 'ACTIVE',
            x,
            y,
            visible,
          };
        });

        setScreenPins(newPins);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [mode, interactive, propAgents]);

  return (
    <div className="swarm-canvas-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'block' }} />

      {/* Floating 2D Projected Telemetry Labels matching visual reference */}
      {mode === 'hero' && (
        <div className="swarm-telemetry-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {screenPins.map((pin) => {
            if (!pin.visible) return null;
            const isHovered = hoveredAgent === pin.id || focusedAgentId === pin.id;
            const isOffline = pin.status === 'offline';
            const isWarning = pin.battery < 20 || pin.status === 'warning';

            return (
              <div
                key={pin.id}
                className={`telemetry-callout-pin ${isHovered ? 'hovered' : ''} ${isOffline ? 'offline' : ''}`}
                style={{
                  position: 'absolute',
                  left: `${pin.x}px`,
                  top: `${pin.y}px`,
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'auto',
                  cursor: 'pointer',
                  zIndex: isHovered ? 20 : 10,
                }}
                onMouseEnter={() => setHoveredAgent(pin.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => onSelectAgent?.(pin.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      background: isOffline
                        ? 'rgba(242, 93, 93, 0.15)'
                        : isHovered
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(8, 10, 11, 0.85)',
                      border: `1px solid ${
                        isOffline
                          ? 'rgba(242, 93, 93, 0.8)'
                          : isWarning
                          ? 'rgba(240, 174, 99, 0.8)'
                          : isHovered
                          ? 'rgba(255, 255, 255, 0.65)'
                          : 'rgba(255, 255, 255, 0.18)'
                      }`,
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      color: isOffline ? '#F25D5D' : '#F2F4F2',
                      boxShadow: isHovered
                        ? '0 0 16px rgba(255, 255, 255, 0.2)'
                        : '0 4px 12px rgba(0, 0, 0, 0.6)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : '#78D6A3',
                          boxShadow: `0 0 6px ${isOffline ? '#F25D5D' : '#78D6A3'}`,
                        }}
                      />
                      <span>{pin.name}</span>
                    </div>
                    <div
                      style={{
                        fontSize: '9px',
                        color: isOffline ? '#F25D5D' : '#A7ADAB',
                        marginTop: '1px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span>{pin.role}</span>
                      <span>{isOffline ? 'OFFLINE' : `Battery ${pin.battery}%`}</span>
                    </div>
                  </div>

                  {/* Stem line pointing down to 3D object */}
                  <div
                    style={{
                      width: '1px',
                      height: '14px',
                      background: isOffline
                        ? 'rgba(242, 93, 93, 0.5)'
                        : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent)',
                    }}
                  />
                  <div
                    style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: isOffline ? '#F25D5D' : '#ffffff',
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Fixed Coordinates Tag from Visual Reference (Bottom Right of Swarm) */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              right: '32px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '10px',
              color: '#68706D',
              letterSpacing: '0.08em',
              textAlign: 'right',
              pointerEvents: 'none',
              lineHeight: 1.6,
            }}
          >
            <div>LAT 19.0760° N</div>
            <div>LON 72.8777° E</div>
            <div style={{ color: '#A7ADAB', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '5px' }}>
              <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#F0AE63' }} />
              <span>MISSION ZONE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
