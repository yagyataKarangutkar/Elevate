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
  focusedAgentId = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenPins, setScreenPins] = useState<ScreenAgentPin[]>([]);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [selectedMobileAgent, setSelectedMobileAgent] = useState<string | null>(null);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 360;
    let height = container.clientHeight || 420;
    const isMobile = width < 640;
    setIsMobileView(isMobile);

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050607, isMobile ? 0.025 : 0.035);

    // Calculate adaptive FOV to guarantee all 4 models stay in view on narrow aspect ratios
    const aspect = width / height;
    const adaptiveFov = isMobile
      ? Math.max(42, Math.min(54, 38 / Math.min(aspect, 1)))
      : 38;

    const camera = new THREE.PerspectiveCamera(adaptiveFov, aspect, 0.1, 100);
    if (mode === 'hero') {
      camera.position.set(0, isMobile ? 8.0 : 7.5, isMobile ? 22.0 : 17.5);
    } else if (mode === 'roverOnly') {
      camera.position.set(isMobile ? 2.4 : 2.8, isMobile ? 2.8 : 3.2, isMobile ? 6.2 : 5.5);
    } else if (mode === 'droneOnly') {
      camera.position.set(isMobile ? 2.0 : 2.2, isMobile ? 2.2 : 2.4, isMobile ? 5.2 : 4.4);
    } else {
      camera.position.set(0, 5, isMobile ? 15 : 12);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x050607, 0);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Realistic Studio & Tactical Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(6, 12, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x78d6a3, 0.9);
    rimLight.position.set(-8, 3, -6);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x4fa3e2, 0.7);
    fillLight.position.set(0, -6, 8);
    scene.add(fillLight);

    // 3. Terrain
    if (mode !== 'roverOnly' && mode !== 'droneOnly') {
      const terrain = createTopographicalTerrain();
      if (isMobile) {
        terrain.scale.set(0.85, 0.85, 0.85);
      }
      scene.add(terrain);
    }

    // 4. Agents Setup (Mobile composition per Spec §18: D2 top, D1 left, D3 right, GroundBot center-bottom)
    const d1Data = createQuadcopterDrone();
    const d2Data = createQuadcopterDrone();
    const d3Data = createQuadcopterDrone();
    const gbData = createGroundBotRover();

    const mobileBasePositions = {
      D1: new THREE.Vector3(-3.0, 2.7, -0.2),
      D2: new THREE.Vector3(0.1, 4.4, -2.6),
      D3: new THREE.Vector3(3.0, 2.5, 0.4),
      G1: new THREE.Vector3(0.0, -1.0, 3.2),
    };

    const desktopBasePositions = {
      D1: new THREE.Vector3(-4.8, 2.8, -0.5),
      D2: new THREE.Vector3(0.3, 4.6, -3.2),
      D3: new THREE.Vector3(5.2, 2.4, 0.8),
      G1: new THREE.Vector3(-0.6, -1.0, 3.8),
    };

    const activePositions = isMobile ? mobileBasePositions : desktopBasePositions;

    const agentObjects = [
      { id: 'D1', group: d1Data.group, rotors: d1Data.rotors, basePos: activePositions.D1, speed: 1.1, name: 'DRONE 01', role: 'Search', battery: 72 },
      { id: 'D2', group: d2Data.group, rotors: d2Data.rotors, basePos: activePositions.D2, speed: 0.9, name: 'DRONE 02', role: 'Search', battery: 81 },
      { id: 'D3', group: d3Data.group, rotors: d3Data.rotors, basePos: activePositions.D3, speed: 1.2, name: 'DRONE 03', role: 'Relay + Search', battery: 68 },
      { id: 'G1', group: gbData.group, wheels: gbData.wheels, mast: gbData.sensorMast, basePos: activePositions.G1, speed: 0.5, name: 'GROUNDBOT 01', role: 'Rescue Support', battery: 64 },
    ];

    let droneOnlyRotors: THREE.Group[] = [];
    let singleRoverData: ReturnType<typeof createGroundBotRover> | null = null;

    if (mode === 'roverOnly') {
      singleRoverData = createGroundBotRover();
      singleRoverData.group.position.set(0, -0.6, 0);
      singleRoverData.group.rotation.y = -Math.PI / 4;
      scene.add(singleRoverData.group);

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

    // 5. Communication Links & Data Packets (Spec §18)
    const commPacketCount = 5;
    const packetMeshes: THREE.Mesh[] = [];
    const packetGeo = new THREE.SphereGeometry(isMobile ? 0.09 : 0.08, 6, 6);
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

    // Mouse / Touch tracking for subtle parallax tilt
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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
        mouseX = x * 0.5; // subtler on mobile
        mouseY = y * 0.5;
      }
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // ResizeObserver for reliable non-zero dimensions across all viewports
    const updateSize = () => {
      if (!container) return;
      width = container.clientWidth || 360;
      height = container.clientHeight || 420;
      const mobile = width < 640;
      setIsMobileView(mobile);

      const asp = width / height;
      camera.aspect = asp;
      camera.fov = mobile
        ? Math.max(42, Math.min(54, 38 / Math.min(asp, 1)))
        : 38;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        updateSize();
      });
      resizeObserver.observe(container);
    }
    window.addEventListener('resize', updateSize);

    // Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      if (mode === 'hero') {
        const defaultY = isMobile ? 8.0 : 7.5;
        targetCam.x = mouseX * (isMobile ? 0.8 : 1.5);
        targetCam.y = defaultY + mouseY * (isMobile ? 0.6 : 1.0);
        camera.position.lerp(targetCam, 0.04);
        camera.lookAt(0, 1.2, 0);
      } else if (mode === 'roverOnly') {
        targetCam.x = (isMobile ? 2.4 : 2.8) + mouseX * 0.8;
        targetCam.y = (isMobile ? 2.8 : 3.2) + mouseY * 0.6;
        camera.position.lerp(targetCam, 0.05);
        camera.lookAt(0, 0.4, 0);
        if (singleRoverData) {
          singleRoverData.sensorMast.rotation.y = Math.sin(elapsed * 0.7) * 0.5;
          singleRoverData.lidar.rotation.y += 0.08;
          singleRoverData.frontSteering.forEach((pivot) => {
            pivot.rotation.y = Math.sin(elapsed * 0.9) * 0.22;
          });
          singleRoverData.wheels.forEach((w) => {
            w.rotation.z += 0.015;
          });
          if (singleRoverData.roboticArm) {
            singleRoverData.roboticArm.rotation.y = Math.sin(elapsed * 0.5) * 0.15;
          }
        }
      } else if (mode === 'droneOnly') {
        targetCam.x = (isMobile ? 2.0 : 2.2) + mouseX * 0.8;
        targetCam.y = (isMobile ? 2.2 : 2.4) + mouseY * 0.6;
        camera.position.lerp(targetCam, 0.05);
        camera.lookAt(0, 0, 0);
        droneOnlyRotors.forEach((rotor) => {
          rotor.rotation.y += 0.35;
        });
      }

      // Animate agent objects
      if (mode !== 'roverOnly' && mode !== 'droneOnly') {
        if (gbData.lidar) {
          gbData.lidar.rotation.y += 0.08;
        }
        if (gbData.frontSteering) {
          gbData.frontSteering.forEach((pivot) => {
            pivot.rotation.y = Math.sin(elapsed * 0.9) * 0.22;
          });
        }
        if (gbData.wheels) {
          gbData.wheels.forEach((w) => {
            w.rotation.z += 0.015;
          });
        }
        if (gbData.roboticArm) {
          gbData.roboticArm.rotation.y = Math.sin(elapsed * 0.5) * 0.15;
        }
        agentObjects.forEach((agent) => {
          if ('rotors' in agent && agent.rotors) {
            agent.group.position.y = agent.basePos.y + Math.sin(elapsed * 2.2 * agent.speed) * 0.12;
            agent.group.position.x = agent.basePos.x + Math.sin(elapsed * 1.4 * agent.speed) * 0.08;
            agent.group.rotation.z = Math.sin(elapsed * 1.8 * agent.speed) * 0.03;
            agent.group.rotation.x = Math.cos(elapsed * 1.5 * agent.speed) * 0.02;

            agent.rotors.forEach((rotor) => {
              rotor.rotation.y += 0.35;
            });
          }

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

            if (packetMeshes[idx]) {
              const t = (elapsed * 0.55 + idx * 0.2) % 1;
              packetMeshes[idx].position.lerpVectors(pair[0], pair[1], t);
            }
          });
        }

        // Project 3D positions to screen coordinates for telemetry pins
        const newPins: ScreenAgentPin[] = agentObjects.map((agent) => {
          const vector = new THREE.Vector3();
          agent.group.getWorldPosition(vector);
          vector.y += agent.id.startsWith('D') ? 0.9 : 1.3;
          vector.project(camera);

          const x = ((vector.x + 1) * width) / 2;
          const y = ((-vector.y + 1) * height) / 2;
          const visible = vector.z < 1;

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
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', updateSize);
      resizeObserver?.disconnect();
      renderer.dispose();
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [mode, interactive, propAgents]);

  const activeMobileAgent = propAgents?.find((a) => a.id === selectedMobileAgent) ||
    (selectedMobileAgent ? {
      id: selectedMobileAgent,
      name: selectedMobileAgent === 'G1' ? 'GROUNDBOT 01' : `DRONE 0${selectedMobileAgent.slice(1)}`,
      role: selectedMobileAgent === 'G1' ? 'Rescue Support' : selectedMobileAgent === 'D3' ? 'Relay + Search' : 'Search',
      battery: selectedMobileAgent === 'D1' ? 72 : selectedMobileAgent === 'D2' ? 81 : selectedMobileAgent === 'D3' ? 68 : 64,
      status: selectedMobileAgent === 'D3' && propAgents?.some(p => p.id === 'D3' && p.status === 'offline') ? 'offline' : 'active',
      signal: 94,
    } : null);

  return (
    <div
      className="swarm-canvas-container"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: isMobileView ? '360px' : '480px',
        overflow: 'hidden',
      }}
    >
      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: isMobileView ? '360px' : '480px', display: 'block' }} />

      {/* Floating 2D Projected Telemetry Labels (Spec §19 & §20) */}
      {mode === 'hero' && (
        <div className="swarm-telemetry-overlay" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {screenPins.map((pin) => {
            if (!pin.visible) return null;
            const isHovered = hoveredAgent === pin.id || focusedAgentId === pin.id || selectedMobileAgent === pin.id;
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
                  touchAction: 'manipulation',
                }}
                onMouseEnter={() => setHoveredAgent(pin.id)}
                onMouseLeave={() => setHoveredAgent(null)}
                onClick={() => {
                  setSelectedMobileAgent(pin.id);
                  onSelectAgent?.(pin.id);
                }}
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
                        ? 'rgba(242, 93, 93, 0.18)'
                        : isHovered
                        ? 'rgba(255, 255, 255, 0.16)'
                        : 'rgba(8, 10, 11, 0.88)',
                      border: `1px solid ${
                        isOffline
                          ? 'rgba(242, 93, 93, 0.85)'
                          : isWarning
                          ? 'rgba(240, 174, 99, 0.85)'
                          : isHovered
                          ? 'rgba(255, 255, 255, 0.8)'
                          : 'rgba(255, 255, 255, 0.2)'
                      }`,
                      backdropFilter: 'blur(8px)',
                      padding: isMobileView ? '3px 8px' : '4px 10px',
                      borderRadius: '4px',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: isMobileView ? '10px' : '11px',
                      letterSpacing: '0.04em',
                      color: isOffline ? '#F25D5D' : '#F2F4F2',
                      boxShadow: isHovered
                        ? '0 0 16px rgba(255, 255, 255, 0.25)'
                        : '0 4px 12px rgba(0, 0, 0, 0.6)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: isOffline ? '#F25D5D' : isWarning ? '#F0AE63' : '#78D6A3',
                          boxShadow: `0 0 6px ${isOffline ? '#F25D5D' : '#78D6A3'}`,
                        }}
                      />
                      <span>{isMobileView ? pin.id : pin.name}</span>
                      {isMobileView && (
                        <span style={{ color: isOffline ? '#F25D5D' : '#78D6A3', fontSize: '9px', fontWeight: 500 }}>
                          {isOffline ? 'OFF' : `${pin.battery}%`}
                        </span>
                      )}
                    </div>
                    {!isMobileView && (
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
                    )}
                  </div>

                  {/* Stem line */}
                  <div
                    style={{
                      width: '1px',
                      height: isMobileView ? '8px' : '14px',
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

          {/* Coordinates Tag (Hidden or compact on mobile) */}
          {!isMobileView && (
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
          )}
        </div>
      )}

      {/* Selected Mobile Agent Detail Bottom Card (Spec §20 & §53) */}
      {isMobileView && activeMobileAgent && (
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            background: 'rgba(8, 10, 11, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '6px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: '"JetBrains Mono", monospace',
            zIndex: 30,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#F2F4F2', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: activeMobileAgent.status === 'offline' ? '#F25D5D' : '#78D6A3',
                }}
              />
              <span>{activeMobileAgent.name}</span>
              <span style={{ fontSize: '9px', color: '#A7ADAB', fontWeight: 400 }}>({activeMobileAgent.role})</span>
            </div>
            <div style={{ fontSize: '10px', color: '#8D9693', marginTop: '2px' }}>
              Status: <span style={{ color: activeMobileAgent.status === 'offline' ? '#F25D5D' : '#78D6A3' }}>{activeMobileAgent.status?.toUpperCase() || 'ACTIVE'}</span> · Battery: {activeMobileAgent.battery}%
            </div>
          </div>
          <button
            onClick={() => setSelectedMobileAgent(null)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '3px',
              color: '#A7ADAB',
              padding: '4px 8px',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
