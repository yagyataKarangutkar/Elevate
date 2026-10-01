import React, { useState } from 'react';
import { SwarmCanvas } from '../3d/SwarmCanvas';
import { 
  Cpu, 
  BatteryCharging, 
  Activity, 
  Zap, 
  Eye, 
  Maximize2, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';
import { playUiTick } from '../../utils/audio';

interface BlueprintSpec {
  id: 'specter' | 'argus' | 'aegis';
  name: string;
  designation: string;
  role: string;
  category: 'Aerial Unit' | 'Ground Unit' | 'Mesh Relay';
  canvasMode: 'droneOnly' | 'roverOnly' | 'inspector';
  summary: string;
  statusBadge: string;
  primaryMetric: { label: string; value: string };
  secondaryMetric: { label: string; value: string };
  specs: {
    airframe: string;
    propulsion: string;
    avionics: string;
    sensors: string;
    battery: string;
    encryption: string;
  };
  subsystems: {
    code: string;
    title: string;
    desc: string;
    status: 'OPTIMAL' | 'STANDBY' | 'SYNCED';
  }[];
  telemetry: {
    meshHealth: number;
    powerEfficiency: number;
    latencyMs: number;
    sensorAccuracy: number;
  };
}

const BLUEPRINTS_DATA: Record<string, BlueprintSpec> = {
  specter: {
    id: 'specter',
    name: 'AeroQuad Specter X-4',
    designation: 'UAV-REC-04',
    role: 'Tactical Reconnaissance & Rapid Topographic Mapping',
    category: 'Aerial Unit',
    canvasMode: 'droneOnly',
    summary:
      'High-agility carbon-composite quadcopter equipped with dual-axis stabilized FLIR thermal optics and an onboard neural coprocessor for autonomous human and hazard detection in GPS-denied environments.',
    statusBadge: 'MISSION READY',
    primaryMetric: { label: 'MAX LOITER TIME', value: '38 MIN' },
    secondaryMetric: { label: 'AI THROUGHPUT', value: '45 TOPS' },
    specs: {
      airframe: 'Hexagonal Toray T700 Carbon-Fiber Monocoque with Folding Arms',
      propulsion: '4x 980kV Brushless Outrunner Motors with Low-Acoustic 10" Props',
      avionics: 'Dual-Redundant STM32H7 Flight Controller + Jetson Orin AI Core',
      sensors: '4K Sony STARVIS 2 CMOS + FLIR Boson 640 LWIR + 360° Sonar Array',
      battery: '6S 5,200mAh High-Density Semi-Solid State Li-Po Pack',
      encryption: 'FIPS 140-3 Level 3 Hardware Crypto (AES-256-GCM Swarm Mesh)',
    },
    subsystems: [
      {
        code: 'SYS-01',
        title: 'Neural Vision Coprocessor',
        desc: 'Zero-latency edge inferencing running YOLO-Pose for survivor discovery under dense rubble.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-02',
        title: 'Micro-Gimbal Thermal FLIR',
        desc: 'Continuous radiometric temperature tracking with differential thermal anomaly highlighting.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-03',
        title: 'Ad-Hoc P2P Swarm Node',
        desc: 'Dynamically joins and bridges high-bandwidth RF mesh links between aerial and ground units.',
        status: 'SYNCED',
      },
      {
        code: 'SYS-04',
        title: 'Optical Flow Odometry',
        desc: 'Centimeter-level position hold even when global GNSS satellite signals are jammed or degraded.',
        status: 'STANDBY',
      },
    ],
    telemetry: {
      meshHealth: 98,
      powerEfficiency: 92,
      latencyMs: 14,
      sensorAccuracy: 99.4,
    },
  },
  argus: {
    id: 'argus',
    name: 'GroundBot Argus Terra-6',
    designation: 'UGV-RES-01',
    role: 'Hazardous Breach, Heavy Extraction & Ground Payload Delivery',
    category: 'Ground Unit',
    canvasMode: 'roverOnly',
    summary:
      'Heavy-duty robotic ground platform engineered with four independent planetary-geared drive hubs, continuous 3D LiDAR terrain mapping, and an integrated survivor life-support canister dispenser.',
    statusBadge: 'ARMED & SYNCED',
    primaryMetric: { label: 'PAYLOAD CAPACITY', value: '18.5 KG' },
    secondaryMetric: { label: 'INCLINE CLIMB', value: '45° GRADE' },
    specs: {
      airframe: 'Titanium-Reinforced Tubular Spaceframe with IP67 Submersion Seals',
      propulsion: '4x High-Torque In-Wheel Permanent Magnet Brushless Hub Motors',
      avionics: 'Quad-Core RISC-V Safety CPU + Embedded Cuda Real-Time Planner',
      sensors: '128-Beam 3D Solid-State LiDAR (120m) + Dual Stereo Depth Cams',
      battery: '48V 24Ah Modular Swappable LFP Cell Stack with Pre-Heaters',
      encryption: 'Post-Quantum Kyber-768 Telemetry Encapsulation',
    },
    subsystems: [
      {
        code: 'SYS-01',
        title: 'Solid-State LiDAR Turret',
        desc: 'Generates millimeter-accurate volumetric point clouds of collapsed subterranean voids.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-02',
        title: 'Independent Torque Vectoring',
        desc: 'Active slip control and skid steering over mud, scree, rebar, and water-logged terrain.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-03',
        title: 'Survivor First-Aid Deployer',
        desc: 'Sealed pneumatic payload bay containing thermal blankets, hydration, and emergency radios.',
        status: 'STANDBY',
      },
      {
        code: 'SYS-04',
        title: 'High-Gain Ground Gateway',
        desc: 'Penetrates thick reinforced concrete walls to establish continuous telemetry relay.',
        status: 'SYNCED',
      },
    ],
    telemetry: {
      meshHealth: 95,
      powerEfficiency: 88,
      latencyMs: 18,
      sensorAccuracy: 98.9,
    },
  },
  aegis: {
    id: 'aegis',
    name: 'StratoRelay Aegis M-2',
    designation: 'UAV-RLY-02',
    role: 'Dynamic High-Altitude Backbone Relay & Swarm Command Anchor',
    category: 'Mesh Relay',
    canvasMode: 'inspector',
    summary:
      'High-altitude long-endurance autonomous node providing localized GPS-independent triangulation, high-throughput tactical backhaul, and automated failover routing for up to 32 simultaneous swarm agents.',
    statusBadge: 'BACKHAUL ACTIVE',
    primaryMetric: { label: 'BANDWIDTH BACKHAUL', value: '1.2 GBPS' },
    secondaryMetric: { label: 'OPERATING RADIUS', value: '25 KM' },
    specs: {
      airframe: 'Ultra-Lightweight Kevlar/Carbon Honeycomb with Solar-Embossed Wing Skin',
      propulsion: 'High-Efficiency Contra-Rotating Low-Noise Brushless Turbofans',
      avionics: 'Triple-Modular Redundant (TMR) Radiation-Tolerant Swarm Coordinator',
      sensors: 'Long-Range RF Direction Finding + Multiband Spectrum Analyzer',
      battery: 'Solid-State Lithium-Sulfur Pack with Micro-Solar Energy Harvesting',
      encryption: 'Quantum-Resistant Lattice-Based Multi-Agent Consensus Protocol',
    },
    subsystems: [
      {
        code: 'SYS-01',
        title: 'Swarm Consensus Arbiter',
        desc: 'Validates multi-agent mission plan updates and resolves path collision claims in 4ms.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-02',
        title: 'Adaptive Frequency Hopping',
        desc: 'Continuous real-time jamming mitigation scanning 400 MHz to 6 GHz RF bands.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-03',
        title: 'Solar Energy Management',
        desc: 'Dynamically matches loiter altitude to atmospheric thermal currents to extend mission duration.',
        status: 'OPTIMAL',
      },
      {
        code: 'SYS-04',
        title: 'Edge Command Terminal',
        desc: 'Hosts the local MissionMind simulation engine to evaluate emergency replan branches.',
        status: 'SYNCED',
      },
    ],
    telemetry: {
      meshHealth: 99.8,
      powerEfficiency: 96,
      latencyMs: 8,
      sensorAccuracy: 99.9,
    },
  },
};

export const BlueprintSection: React.FC = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<'specter' | 'argus' | 'aegis'>('specter');
  const [activeTab, setActiveTab] = useState<'specs' | 'subsystems' | 'telemetry'>('specs');

  const unit = BLUEPRINTS_DATA[selectedUnitId];

  const handleSelectUnit = (id: 'specter' | 'argus' | 'aegis') => {
    playUiTick();
    setSelectedUnitId(id);
  };

  const handleTabChange = (tab: 'specs' | 'subsystems' | 'telemetry') => {
    playUiTick();
    setActiveTab(tab);
  };

  return (
    <section
      id="blueprints"
      style={{
        padding: '90px 48px',
        maxWidth: '1360px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '11px',
          color: '#68706D',
          letterSpacing: '0.12em',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#78D6A3' }} />
        <span>03. FLEET CAPABILITIES & AGENT SPECIFICATIONS</span>
      </div>

      {/* Header and intro per Spec Section 11 & 38 */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px',
          marginBottom: '36px',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#F2F4F2',
              lineHeight: 1.2,
              marginBottom: '12px',
              fontFamily: '"Inter", sans-serif',
            }}
          >
            The Swarm Fleet: Built to search, adapt and rescue.
          </h2>
          <p
            style={{
              color: '#A7ADAB',
              fontSize: '15px',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: 0,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            Inspect how each aerial and ground unit functions within MissionMind's autonomous missions, with full engineering details available on demand.
          </p>
        </div>

        {/* Unit Selector Pills */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {(['specter', 'argus', 'aegis'] as const).map((id) => {
            const item = BLUEPRINTS_DATA[id];
            const isSelected = selectedUnitId === id;
            return (
              <button
                key={id}
                onClick={() => handleSelectUnit(id)}
                style={{
                  background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: isSelected ? '#FFFFFF' : '#8D9693',
                  border: isSelected ? '1px solid rgba(255, 255, 255, 0.22)' : '1px solid transparent',
                  borderRadius: '6px',
                  padding: '8px 14px',
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: '12px',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isSelected ? '#78D6A3' : '#454C49',
                  }}
                />
                {item.designation}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Blueprint Showcase Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.25fr 1fr',
          gap: '28px',
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: 3D Wireframe Viewer + HUD Overlay */}
        <div
          style={{
            position: 'relative',
            background: '#080A0B',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '10px',
            overflow: 'hidden',
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top HUD Bar */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '11px',
              color: '#8D9693',
              zIndex: 10,
              background: 'rgba(8, 10, 11, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#F2F4F2', fontWeight: 600 }}>{unit.name}</span>
              <span style={{ color: '#454C49' }}>/</span>
              <span style={{ color: '#78D6A3' }}>{unit.statusBadge}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={12} color="#78D6A3" />
                <span>TELEMETRY SYNC</span>
              </div>
              <div style={{ color: '#454C49' }}>•</div>
              <div>INTERACTIVE 3D SCHEMATIC</div>
            </div>
          </div>

          {/* 3D Canvas Area */}
          <div style={{ flex: 1, position: 'relative', minHeight: '380px' }}>
            <SwarmCanvas mode={unit.canvasMode} interactive={true} />

            {/* Floating Technical HUD Tags */}
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                display: 'flex',
                gap: '16px',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: '11px',
                color: '#68706D',
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  background: 'rgba(5, 6, 7, 0.85)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '9px', color: '#8D9693', marginBottom: '2px' }}>
                  {unit.primaryMetric.label}
                </div>
                <div style={{ fontSize: '13px', color: '#F2F4F2', fontWeight: 600 }}>
                  {unit.primaryMetric.value}
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(5, 6, 7, 0.85)',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ fontSize: '9px', color: '#8D9693', marginBottom: '2px' }}>
                  {unit.secondaryMetric.label}
                </div>
                <div style={{ fontSize: '13px', color: '#78D6A3', fontWeight: 600 }}>
                  {unit.secondaryMetric.value}
                </div>
              </div>
            </div>

            {/* Corner Crosshair Decorations */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                width: '8px',
                height: '8px',
                borderLeft: '1px solid rgba(255, 255, 255, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '8px',
                height: '8px',
                borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Bottom Summary Bar */}
          <div
            style={{
              padding: '14px 20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(5, 6, 7, 0.7)',
              fontSize: '13px',
              color: '#A7ADAB',
              lineHeight: 1.5,
              fontFamily: '"Inter", sans-serif',
            }}
          >
            {unit.summary}
          </div>
        </div>

        {/* Right Column: Spec Matrix & Interactive Subsystems */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Sub-Tabs: Specs | Subsystems | Telemetry */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '10px',
              gap: '18px',
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '12px',
            }}
          >
            {[
              { id: 'specs', label: 'TECHNICAL DETAILS' },
              { id: 'subsystems', label: 'SUBSYSTEMS' },
              { id: 'telemetry', label: 'SWARM METRICS' },
            ].map((t) => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabChange(t.id as any)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isActive ? '#F2F4F2' : '#68706D',
                    cursor: 'pointer',
                    padding: '4px 0',
                    position: 'relative',
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  {t.label}
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '-11px',
                        left: 0,
                        right: 0,
                        height: '2px',
                        background: '#78D6A3',
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab 1: Detailed Specifications Matrix */}
          {activeTab === 'specs' && (
            <div
              style={{
                display: 'grid',
                gap: '10px',
                flex: 1,
              }}
            >
              {[
                { label: 'AIRFRAME / CHASSIS', val: unit.specs.airframe, icon: <Maximize2 size={13} color="#78D6A3" /> },
                { label: 'PROPULSION & MOTORS', val: unit.specs.propulsion, icon: <Zap size={13} color="#E5A84B" /> },
                { label: 'AVIONICS & COMPUTE', val: unit.specs.avionics, icon: <Cpu size={13} color="#4FA3E2" /> },
                { label: 'SENSOR PAYLOAD', val: unit.specs.sensors, icon: <Eye size={13} color="#78D6A3" /> },
                { label: 'POWER & CELLS', val: unit.specs.battery, icon: <BatteryCharging size={13} color="#E5A84B" /> },
                { label: 'SECURITY & CIPHER', val: unit.specs.encryption, icon: <ShieldCheck size={13} color="#4FA3E2" /> },
              ].map((spec, i) => (
                <div
                  key={i}
                  onMouseEnter={() => playUiTick()}
                  style={{
                    background: '#080A0B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    transition: 'border-color 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: '10px',
                      color: '#8D9693',
                      letterSpacing: '0.08em',
                      marginBottom: '4px',
                    }}
                  >
                    {spec.icon}
                    <span>{spec.label}</span>
                  </div>
                  <div
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '13px',
                      color: '#F2F4F2',
                      lineHeight: 1.4,
                    }}
                  >
                    {spec.val}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Subsystems Breakdown */}
          {activeTab === 'subsystems' && (
            <div
              style={{
                display: 'grid',
                gap: '12px',
                flex: 1,
              }}
            >
              {unit.subsystems.map((sub, i) => (
                <div
                  key={i}
                  onMouseEnter={() => playUiTick()}
                  style={{
                    background: '#080A0B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '14px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: '10px',
                          color: '#78D6A3',
                          background: 'rgba(120, 214, 163, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '3px',
                        }}
                      >
                        {sub.code}
                      </span>
                      <span
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#F2F4F2',
                        }}
                      >
                        {sub.title}
                      </span>
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '10px',
                        color: sub.status === 'OPTIMAL' ? '#78D6A3' : '#A7ADAB',
                      }}
                    >
                      <CheckCircle2 size={12} />
                      <span>{sub.status}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '12px',
                      color: '#8D9693',
                      lineHeight: 1.5,
                    }}
                  >
                    {sub.desc}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Real-Time Diagnostics & Telemetry */}
          {activeTab === 'telemetry' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                flex: 1,
              }}
            >
              {[
                {
                  label: 'SWARM MESH LINK INTEGRITY',
                  val: `${unit.telemetry.meshHealth}%`,
                  percent: unit.telemetry.meshHealth,
                  color: '#78D6A3',
                  desc: 'P2P heartbeat packet delivery within 50ms window',
                },
                {
                  label: 'POWER CONVERSION EFFICIENCY',
                  val: `${unit.telemetry.powerEfficiency}%`,
                  percent: unit.telemetry.powerEfficiency,
                  color: '#E5A84B',
                  desc: 'Regulated ESC bus drain against dynamic motor load',
                },
                {
                  label: 'NEURAL INFERENCE LATENCY',
                  val: `${unit.telemetry.latencyMs} ms`,
                  percent: Math.min(100, Math.round(100 - unit.telemetry.latencyMs * 2)),
                  color: '#4FA3E2',
                  desc: 'Real-time multi-sensor fusion pipeline execution cycle',
                },
                {
                  label: 'LOCALIZATION ACCURACY',
                  val: `${unit.telemetry.sensorAccuracy}%`,
                  percent: unit.telemetry.sensorAccuracy,
                  color: '#78D6A3',
                  desc: 'Optical flow + visual odometry confidence index',
                },
              ].map((met, i) => (
                <div
                  key={i}
                  style={{
                    background: '#080A0B',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '6px',
                    padding: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#8D9693' }}>{met.label}</span>
                    <span style={{ fontSize: '13px', color: met.color, fontWeight: 600 }}>{met.val}</span>
                  </div>

                  {/* Progress Meter Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '5px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      borderRadius: '3px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                    }}
                  >
                    <div
                      style={{
                        width: `${met.percent}%`,
                        height: '100%',
                        background: met.color,
                        borderRadius: '3px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>

                  <div
                    style={{
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '11px',
                      color: '#68706D',
                    }}
                  >
                    {met.desc}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
