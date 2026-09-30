import * as THREE from 'three';

// Material generators for glowing technical wireframes & realistic CAD PBR surfaces
export function createWireframeMaterial(color = 0xffffff, opacity = 0.85, lineWidth = 1): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    linewidth: lineWidth,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

export function createWireframeMeshMaterial(color = 0xffffff, wireframeOpacity = 0.45): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity: wireframeOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

// Reusable PBR and tactical emissive materials
function createTacticalMaterials() {
  return {
    carbonHull: new THREE.MeshStandardMaterial({
      color: 0x121619,
      roughness: 0.32,
      metalness: 0.88,
    }),
    darkChassis: new THREE.MeshStandardMaterial({
      color: 0x090b0d,
      roughness: 0.55,
      metalness: 0.75,
    }),
    titaniumAlloy: new THREE.MeshStandardMaterial({
      color: 0x5a6872,
      roughness: 0.22,
      metalness: 0.95,
    }),
    goldStator: new THREE.MeshStandardMaterial({
      color: 0xbfa04b,
      roughness: 0.28,
      metalness: 0.85,
    }),
    rubberTread: new THREE.MeshStandardMaterial({
      color: 0x101315,
      roughness: 0.92,
      metalness: 0.12,
    }),
    opticalGlass: new THREE.MeshStandardMaterial({
      color: 0x153548,
      roughness: 0.08,
      metalness: 0.95,
      transparent: true,
      opacity: 0.88,
    }),
    sensorFLIR: new THREE.MeshStandardMaterial({
      color: 0x8a5418,
      roughness: 0.12,
      metalness: 0.92,
    }),
    ledGreen: new THREE.MeshStandardMaterial({
      color: 0x78d6a3,
      emissive: 0x78d6a3,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),
    ledRed: new THREE.MeshStandardMaterial({
      color: 0xf25d5d,
      emissive: 0xf25d5d,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),
    ledCyan: new THREE.MeshStandardMaterial({
      color: 0x4fa3e2,
      emissive: 0x4fa3e2,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),
    ledAmber: new THREE.MeshStandardMaterial({
      color: 0xf0ae63,
      emissive: 0xf0ae63,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    }),
    headlightWhite: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.8,
      roughness: 0.1,
    }),
    highVoltageCable: new THREE.MeshStandardMaterial({
      color: 0xff6600,
      roughness: 0.45,
      metalness: 0.15,
    }),
    warningYellow: new THREE.MeshStandardMaterial({
      color: 0xf5b700,
      roughness: 0.35,
      metalness: 0.5,
    }),
    steelCable: new THREE.MeshStandardMaterial({
      color: 0x8898a6,
      roughness: 0.25,
      metalness: 0.95,
    }),
    goldFoil: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.18,
      metalness: 0.92,
    }),
    solarCell: new THREE.MeshStandardMaterial({
      color: 0x0c1b29,
      roughness: 0.1,
      metalness: 0.9,
    }),
    laserScanBeam: new THREE.MeshBasicMaterial({
      color: 0x78d6a3,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    // Wireframe overlays
    wireWhite: createWireframeMaterial(0xffffff, 0.75),
    wireDim: createWireframeMaterial(0x9aa8ad, 0.35),
    wireGreen: createWireframeMaterial(0x78d6a3, 0.8),
    wireCyan: createWireframeMaterial(0x4fa3e2, 0.8),
  };
}

/**
 * Creates an ultra-realistic, highly detailed tactical Quadcopter Drone (AeroQuad Specter X-4)
 * Combines PBR carbon-composite physical volumes with precision HUD wireframe overlays.
 */
export function createQuadcopterDrone(): {
  group: THREE.Group;
  rotors: THREE.Group[];
  gimbal: THREE.Group;
} {
  const group = new THREE.Group();
  const mats = createTacticalMaterials();
  const rotors: THREE.Group[] = [];

  // ================= 1. CENTRAL FUSELAGE & CANOPY =================
  const fuselageGroup = new THREE.Group();

  // Aerodynamic main upper shell
  const mainHullGeo = new THREE.CylinderGeometry(0.58, 0.72, 0.26, 8);
  const mainHullMesh = new THREE.Mesh(mainHullGeo, mats.carbonHull);
  const mainHullWire = new THREE.LineSegments(new THREE.EdgesGeometry(mainHullGeo), mats.wireWhite);
  fuselageGroup.add(mainHullMesh);
  fuselageGroup.add(mainHullWire);

  // Chamfered aerodynamic top canopy plate
  const canopyGeo = new THREE.CylinderGeometry(0.38, 0.54, 0.14, 8);
  const canopyMesh = new THREE.Mesh(canopyGeo, mats.darkChassis);
  canopyMesh.position.y = 0.18;
  const canopyWire = new THREE.LineSegments(new THREE.EdgesGeometry(canopyGeo), mats.wireDim);
  canopyWire.position.y = 0.18;
  fuselageGroup.add(canopyMesh);
  fuselageGroup.add(canopyWire);

  // Recessed heat sink cooling vents on top
  for (let i = -2; i <= 2; i++) {
    const ventGeo = new THREE.BoxGeometry(0.24, 0.02, 0.035);
    const ventMesh = new THREE.Mesh(ventGeo, mats.titaniumAlloy);
    ventMesh.position.set(0, 0.26, i * 0.06);
    fuselageGroup.add(ventMesh);
  }

  // Top GPS Dome Puck with GNSS antenna beacon
  const gpsPuckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.08, 12);
  const gpsPuck = new THREE.Mesh(gpsPuckGeo, mats.darkChassis);
  gpsPuck.position.set(0, 0.3, -0.15);
  fuselageGroup.add(gpsPuck);

  const gpsBeaconGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const gpsBeacon = new THREE.Mesh(gpsBeaconGeo, mats.ledGreen);
  gpsBeacon.position.set(0, 0.36, -0.15);
  fuselageGroup.add(gpsBeacon);

  // Rear RF whip antenna with angled stalk
  const antennaGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 6);
  const antennaMesh = new THREE.Mesh(antennaGeo, mats.titaniumAlloy);
  antennaMesh.position.set(0, 0.35, -0.45);
  antennaMesh.rotation.x = -0.3;
  fuselageGroup.add(antennaMesh);

  // Dual Forward Stereoscopic Navigation Cameras
  [-0.14, 0.14].forEach((x) => {
    const camHousingGeo = new THREE.BoxGeometry(0.08, 0.07, 0.06);
    const camHousing = new THREE.Mesh(camHousingGeo, mats.darkChassis);
    camHousing.position.set(x, 0.08, 0.65);
    fuselageGroup.add(camHousing);

    const camLensGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10);
    const camLens = new THREE.Mesh(camLensGeo, mats.opticalGlass);
    camLens.rotation.x = Math.PI / 2;
    camLens.position.set(x, 0.08, 0.685);
    fuselageGroup.add(camLens);
  });

  // Belly Modular Battery Pack & Skid Rails
  const batteryGeo = new THREE.BoxGeometry(0.52, 0.22, 0.75);
  const batteryMesh = new THREE.Mesh(batteryGeo, mats.darkChassis);
  batteryMesh.position.set(0, -0.22, 0);
  const batteryWire = new THREE.LineSegments(new THREE.EdgesGeometry(batteryGeo), mats.wireDim);
  batteryWire.position.set(0, -0.22, 0);
  fuselageGroup.add(batteryMesh);
  fuselageGroup.add(batteryWire);

  // Downward Optical Flow & LiDAR Rangefinder sensor on belly
  const flowSensorGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.04, 10);
  const flowSensor = new THREE.Mesh(flowSensorGeo, mats.opticalGlass);
  flowSensor.position.set(0, -0.34, 0.1);
  fuselageGroup.add(flowSensor);

  group.add(fuselageGroup);

  // ================= 2. 3-AXIS GIMBAL & DUAL-SPECTRUM OPTICS =================
  const gimbal = new THREE.Group();
  gimbal.position.set(0, -0.24, 0.42);

  // Gimbal Base Yaw Motor
  const yawMotorGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.06, 12);
  const yawMotor = new THREE.Mesh(yawMotorGeo, mats.titaniumAlloy);
  gimbal.add(yawMotor);

  // U-shaped Pitch Arm / Fork
  const forkArmGeo = new THREE.TorusGeometry(0.16, 0.02, 6, 16, Math.PI);
  const forkArm = new THREE.Mesh(forkArmGeo, mats.titaniumAlloy);
  forkArm.rotation.x = Math.PI / 2;
  forkArm.position.y = -0.06;
  gimbal.add(forkArm);

  // Cylindrical Camera Barrel Pod
  const camPodGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.22, 14);
  const camPod = new THREE.Mesh(camPodGeo, mats.carbonHull);
  camPod.rotation.x = Math.PI / 2;
  camPod.position.set(0, -0.08, 0.08);

  // Primary 4K Optical Sensor Aperture
  const primaryLensGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16);
  const primaryLens = new THREE.Mesh(primaryLensGeo, mats.opticalGlass);
  primaryLens.rotation.x = Math.PI / 2;
  primaryLens.position.set(-0.04, -0.08, 0.2);
  gimbal.add(primaryLens);

  // Secondary FLIR Thermal Micro-Bolometer Aperture
  const flirLensGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 12);
  const flirLens = new THREE.Mesh(flirLensGeo, mats.sensorFLIR);
  flirLens.rotation.x = Math.PI / 2;
  flirLens.position.set(0.05, -0.08, 0.2);
  gimbal.add(flirLens);

  gimbal.add(camPod);
  group.add(gimbal);

  // ================= 3. FOUR DIAGONAL CARBON-FIBER ARMS & MOTORS =================
  const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  const armLength = 1.65;

  armAngles.forEach((angle, idx) => {
    const armGroup = new THREE.Group();
    armGroup.rotation.y = angle;

    // Aerodynamic profiled carbon main arm tube
    const armGeo = new THREE.CylinderGeometry(0.045, 0.06, armLength, 8);
    const armMesh = new THREE.Mesh(armGeo, mats.carbonHull);
    armMesh.rotation.z = Math.PI / 2;
    armMesh.position.x = armLength / 2 + 0.35;
    const armWire = new THREE.LineSegments(new THREE.EdgesGeometry(armGeo), mats.wireDim);
    armWire.rotation.z = Math.PI / 2;
    armWire.position.x = armLength / 2 + 0.35;
    armGroup.add(armMesh);
    armGroup.add(armWire);

    // Diagonal stiffening truss brace
    const braceGeo = new THREE.CylinderGeometry(0.02, 0.02, armLength * 0.72, 6);
    const braceMesh = new THREE.Mesh(braceGeo, mats.titaniumAlloy);
    braceMesh.position.set((armLength / 2 + 0.35) * 0.85, -0.08, 0);
    braceMesh.rotation.z = 1.48;
    armGroup.add(braceMesh);

    // Electronic Speed Controller (ESC) blister pack on arm
    const escGeo = new THREE.BoxGeometry(0.35, 0.05, 0.08);
    const escMesh = new THREE.Mesh(escGeo, mats.darkChassis);
    escMesh.position.set(armLength * 0.55 + 0.35, 0.05, 0);
    armGroup.add(escMesh);

    // Brushless Outrunner Motor Assembly at tip
    const motorTipX = armLength + 0.35;

    // Motor Stator Base
    const statorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 14);
    const statorMesh = new THREE.Mesh(statorGeo, mats.goldStator);
    statorMesh.position.set(motorTipX, 0.05, 0);
    armGroup.add(statorMesh);

    // Motor Rotating Bell Cap
    const bellGeo = new THREE.CylinderGeometry(0.19, 0.2, 0.16, 14);
    const bellMesh = new THREE.Mesh(bellGeo, mats.carbonHull);
    bellMesh.position.set(motorTipX, 0.16, 0);
    armGroup.add(bellMesh);

    // Motor Central Prop Nut / Shaft
    const nutGeo = new THREE.ConeGeometry(0.05, 0.08, 10);
    const nutMesh = new THREE.Mesh(nutGeo, mats.titaniumAlloy);
    nutMesh.position.set(motorTipX, 0.28, 0);
    armGroup.add(nutMesh);

    // Aerodynamic Prop Guard Ducts (Torus with radial struts)
    const guardGeo = new THREE.TorusGeometry(0.62, 0.02, 6, 28);
    const guardMesh = new THREE.Mesh(guardGeo, mats.darkChassis);
    guardMesh.rotation.x = Math.PI / 2;
    guardMesh.position.set(motorTipX, 0.24, 0);
    const guardWire = new THREE.LineSegments(new THREE.EdgesGeometry(guardGeo), mats.wireDim);
    guardWire.rotation.x = Math.PI / 2;
    guardWire.position.set(motorTipX, 0.24, 0);
    armGroup.add(guardMesh);
    armGroup.add(guardWire);

    // 4 radial support struts connecting guard to motor
    for (let s = 0; s < 4; s++) {
      const strutGeo = new THREE.BoxGeometry(0.42, 0.015, 0.025);
      const strutMesh = new THREE.Mesh(strutGeo, mats.titaniumAlloy);
      strutMesh.position.set(motorTipX, 0.24, 0);
      strutMesh.rotation.y = (s * Math.PI) / 2;
      strutMesh.translateX(0.38);
      armGroup.add(strutMesh);
    }

    // Wingtip Navigation LED Beacons
    // Front: Port (Red) / Starboard (Green), Rear: Cyan / White
    const navLedGeo = new THREE.SphereGeometry(0.03, 8, 8);
    let navLedMat = mats.ledGreen;
    if (idx === 0) navLedMat = mats.ledGreen; // Front Right
    else if (idx === 1) navLedMat = mats.ledRed; // Front Left
    else if (idx === 2) navLedMat = mats.ledCyan; // Rear Left
    else navLedMat = mats.ledAmber; // Rear Right

    const navLed = new THREE.Mesh(navLedGeo, navLedMat);
    navLed.position.set(motorTipX + 0.62, 0.24, 0);
    armGroup.add(navLed);

    // ================= ROTOR & DUAL AERODYNAMIC PROPELLERS =================
    const rotorUnit = new THREE.Group();
    rotorUnit.position.set(motorTipX, 0.25, 0);

    // Dual Blade Props with Realistic Pitch & Airfoil Camber
    [-1, 1].forEach((dir) => {
      const bladeGeo = new THREE.BoxGeometry(0.55, 0.018, 0.1);
      const bladeMesh = new THREE.Mesh(bladeGeo, mats.carbonHull);
      bladeMesh.position.x = dir * 0.3;
      bladeMesh.rotation.x = dir * 0.18; // Pitch twist angle
      const bladeWire = new THREE.LineSegments(new THREE.EdgesGeometry(bladeGeo), mats.wireWhite);
      bladeWire.position.x = dir * 0.3;
      bladeWire.rotation.x = dir * 0.18;
      rotorUnit.add(bladeMesh);
      rotorUnit.add(bladeWire);
    });

    // Spinning disc blur mesh
    const blurGeo = new THREE.CircleGeometry(0.58, 20);
    const blurMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
    });
    const blur = new THREE.Mesh(blurGeo, blurMat);
    blur.rotation.x = -Math.PI / 2;
    rotorUnit.add(blur);

    rotors.push(rotorUnit);
    armGroup.add(rotorUnit);

    group.add(armGroup);
  });

  // ================= 4. REINFORCED LANDING SKIDS & STRUTS =================
  [-0.65, 0.65].forEach((zOffset) => {
    const skidGroup = new THREE.Group();

    // Longitudinal skid tube
    const skidGeo = new THREE.CylinderGeometry(0.035, 0.035, 2.2, 8);
    const skidMesh = new THREE.Mesh(skidGeo, mats.carbonHull);
    skidMesh.rotation.x = Math.PI / 2;
    skidMesh.position.set(0, -0.74, zOffset);
    const skidWire = new THREE.LineSegments(new THREE.EdgesGeometry(skidGeo), mats.wireDim);
    skidWire.rotation.x = Math.PI / 2;
    skidWire.position.set(0, -0.74, zOffset);
    skidGroup.add(skidMesh);
    skidGroup.add(skidWire);

    // Upturned front and rear skid curves
    [1.15, -1.15].forEach((xEnd) => {
      const tipGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.32, 8);
      const tipMesh = new THREE.Mesh(tipGeo, mats.titaniumAlloy);
      tipMesh.position.set(0, -0.66, zOffset + (xEnd > 0 ? 1.22 : -1.22));
      tipMesh.rotation.x = (xEnd > 0 ? 1 : -1) * 0.7;
      skidGroup.add(tipMesh);
    });

    // Angled vertical carbon support struts from fuselage to skid
    [-0.5, 0.5].forEach((zStrut) => {
      const strutGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.68, 6);
      const strutMesh = new THREE.Mesh(strutGeo, mats.titaniumAlloy);
      strutMesh.position.set(0, -0.45, zStrut * 0.7);
      strutMesh.rotation.z = zOffset > 0 ? -0.32 : 0.32;
      skidGroup.add(strutMesh);
    });

    // Rubber shock dampening foot pads
    [-0.7, 0.7].forEach((zPad) => {
      const padGeo = new THREE.BoxGeometry(0.12, 0.04, 0.08);
      const padMesh = new THREE.Mesh(padGeo, mats.rubberTread);
      padMesh.position.set(0, -0.78, zOffset + zPad * 0.8);
      skidGroup.add(padMesh);
    });

    group.add(skidGroup);
  });

  return { group, rotors, gimbal };
}

/**
 * Creates an ultra-realistic, highly detailed tactical Heavy Ground Rover (GroundBot Argus Terra-6)
 * Features:
 * - Armored chassis with front winch, HazCams & GPR radar scanner
 * - Articulated multi-axis robotic manipulator arm with 2-jaw motorized gripper claw
 * - 4 extreme off-road wheels with 16 3D chevron lugs, 12 beadlock bolts & Brembo calipers
 * - Front steering knuckles and double-wishbone suspension with orange high-voltage conduits
 * - Upper deck solar array, gold MLI thermal foil, emergency E-STOP, and satellite dish
 * - Rotating LiDAR turret with forward-sweeping active laser scanning fan beam
 */
export function createGroundBotRover(): {
  group: THREE.Group;
  wheels: THREE.Group[];
  sensorMast: THREE.Group;
  lidar: THREE.Group;
  roboticArm: THREE.Group;
  frontSteering: THREE.Group[];
} {
  const group = new THREE.Group();
  const mats = createTacticalMaterials();
  const wheels: THREE.Group[] = [];
  const frontSteering: THREE.Group[] = [];

  // ================= 1. ARMORED CHASSIS & ROLL CAGE =================
  const chassis = new THREE.Group();

  // Lower Armored Tub / Hull
  const lowerTubGeo = new THREE.BoxGeometry(2.65, 0.52, 1.45);
  const lowerTubMesh = new THREE.Mesh(lowerTubGeo, mats.darkChassis);
  lowerTubMesh.position.y = 0.44;
  const lowerTubWire = new THREE.LineSegments(new THREE.EdgesGeometry(lowerTubGeo), mats.wireDim);
  lowerTubWire.position.y = 0.44;
  chassis.add(lowerTubMesh);
  chassis.add(lowerTubWire);

  // Sloped Front Skid Plate / Glacis Armor
  const skidPlateGeo = new THREE.BoxGeometry(0.5, 0.45, 1.4);
  const skidPlate = new THREE.Mesh(skidPlateGeo, mats.titaniumAlloy);
  skidPlate.position.set(1.32, 0.38, 0);
  skidPlate.rotation.z = -0.55;
  chassis.add(skidPlate);

  // Ground Penetrating Radar (GPR) bottom scanning antenna sled beneath hull
  const gprGeo = new THREE.BoxGeometry(1.6, 0.08, 0.9);
  const gprMesh = new THREE.Mesh(gprGeo, mats.warningYellow);
  gprMesh.position.set(0, 0.16, 0);
  chassis.add(gprMesh);

  // Upper Avionics Enclosure (with faceted bevels)
  const upperEnclosureGeo = new THREE.BoxGeometry(1.75, 0.5, 1.18);
  const upperEnclosure = new THREE.Mesh(upperEnclosureGeo, mats.carbonHull);
  upperEnclosure.position.set(-0.15, 0.86, 0);
  const upperWire = new THREE.LineSegments(new THREE.EdgesGeometry(upperEnclosureGeo), mats.wireWhite);
  upperWire.position.set(-0.15, 0.86, 0);
  chassis.add(upperEnclosure);
  chassis.add(upperWire);

  // Gold MLI Thermal Insulation Blanket section on upper deck
  const goldFoilGeo = new THREE.BoxGeometry(0.75, 0.02, 0.95);
  const goldFoilMesh = new THREE.Mesh(goldFoilGeo, mats.goldFoil);
  goldFoilMesh.position.set(-0.5, 1.12, 0);
  chassis.add(goldFoilMesh);

  // Solar Cell Array on upper roof deck
  const solarGeo = new THREE.BoxGeometry(0.5, 0.02, 0.85);
  const solarMesh = new THREE.Mesh(solarGeo, mats.solarCell);
  solarMesh.position.set(0.18, 1.12, 0);
  chassis.add(solarMesh);

  // Cooling heat sinks along upper roof
  for (let r = -2; r <= 2; r++) {
    const finGeo = new THREE.BoxGeometry(0.035, 0.045, 0.95);
    const fin = new THREE.Mesh(finGeo, mats.titaniumAlloy);
    fin.position.set(-0.2 + r * 0.12, 1.13, 0);
    chassis.add(fin);
  }

  // Side Rocker Panels & Modular Battery Packs
  [-0.72, 0.72].forEach((z) => {
    const rockSliderGeo = new THREE.BoxGeometry(2.1, 0.25, 0.16);
    const rockSlider = new THREE.Mesh(rockSliderGeo, mats.darkChassis);
    rockSlider.position.set(-0.05, 0.48, z);
    chassis.add(rockSlider);

    // Battery pack status LED strip
    const ledStripGeo = new THREE.BoxGeometry(0.6, 0.03, 0.02);
    const ledStrip = new THREE.Mesh(ledStripGeo, mats.ledCyan);
    ledStrip.position.set(-0.1, 0.52, z + (z > 0 ? 0.09 : -0.09));
    chassis.add(ledStrip);
  });

  // Titanium Tubular Roll Cage
  const cagePoles = [
    { start: new THREE.Vector3(0.68, 0.65, 0.6), end: new THREE.Vector3(0.55, 1.2, 0.56) },
    { start: new THREE.Vector3(0.68, 0.65, -0.6), end: new THREE.Vector3(0.55, 1.2, -0.56) },
    { start: new THREE.Vector3(-0.95, 0.65, 0.6), end: new THREE.Vector3(-0.85, 1.2, 0.56) },
    { start: new THREE.Vector3(-0.95, 0.65, -0.6), end: new THREE.Vector3(-0.85, 1.2, -0.56) },
  ];

  cagePoles.forEach((pole) => {
    const poleLength = pole.start.distanceTo(pole.end);
    const poleGeo = new THREE.CylinderGeometry(0.03, 0.03, poleLength, 6);
    const poleMesh = new THREE.Mesh(poleGeo, mats.titaniumAlloy);
    const midPoint = new THREE.Vector3().addVectors(pole.start, pole.end).multiplyScalar(0.5);
    poleMesh.position.copy(midPoint);
    poleMesh.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3().subVectors(pole.end, pole.start).normalize()
    );
    chassis.add(poleMesh);
  });

  // Longitudinal roll cage roof bars & Crossbar
  [-0.56, 0.56].forEach((zBar) => {
    const roofBarGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.45, 6);
    const roofBar = new THREE.Mesh(roofBarGeo, mats.titaniumAlloy);
    roofBar.rotation.x = Math.PI / 2;
    roofBar.position.set(-0.15, 1.2, zBar);
    chassis.add(roofBar);
  });

  const crossBarGeo = new THREE.CylinderGeometry(0.025, 0.025, 1.12, 6);
  const crossBar = new THREE.Mesh(crossBarGeo, mats.titaniumAlloy);
  crossBar.rotation.z = Math.PI / 2;
  crossBar.position.set(-0.15, 1.2, 0);
  chassis.add(crossBar);

  // Front Heavy-Duty Bullbar
  const bullbarGeo = new THREE.BoxGeometry(0.18, 0.38, 1.6);
  const bullbar = new THREE.Mesh(bullbarGeo, mats.titaniumAlloy);
  bullbar.position.set(1.44, 0.42, 0);
  chassis.add(bullbar);

  // Front Recovery Winch Assembly
  const winchHousingGeo = new THREE.BoxGeometry(0.22, 0.22, 0.38);
  const winchHousing = new THREE.Mesh(winchHousingGeo, mats.darkChassis);
  winchHousing.position.set(1.5, 0.42, 0);
  chassis.add(winchHousing);

  const winchSpoolGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.26, 12);
  const winchSpool = new THREE.Mesh(winchSpoolGeo, mats.steelCable);
  winchSpool.rotation.x = Math.PI / 2;
  winchSpool.position.set(1.52, 0.42, 0);
  chassis.add(winchSpool);

  // Forged Red Recovery Clevis Hook
  const hookGeo = new THREE.TorusGeometry(0.05, 0.015, 6, 12, Math.PI * 1.5);
  const hook = new THREE.Mesh(hookGeo, mats.ledRed);
  hook.position.set(1.64, 0.38, 0);
  hook.rotation.y = Math.PI / 2;
  chassis.add(hook);

  // Low-Mounted Hazard Avoidance Cameras (HazCams) on lower front bumper
  [-0.22, 0.22].forEach((zHaz) => {
    const hazGeo = new THREE.BoxGeometry(0.07, 0.06, 0.06);
    const haz = new THREE.Mesh(hazGeo, mats.darkChassis);
    haz.position.set(1.5, 0.26, zHaz);
    chassis.add(haz);

    const hazLens = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.02, 8), mats.opticalGlass);
    hazLens.rotation.z = Math.PI / 2;
    hazLens.position.set(1.54, 0.26, zHaz);
    chassis.add(hazLens);
  });

  // Twin High-Intensity Tactical LED Searchlights with Projector Lenses
  [-0.48, 0.48].forEach((zLight) => {
    const housingGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.14, 14);
    const housing = new THREE.Mesh(housingGeo, mats.darkChassis);
    housing.rotation.z = Math.PI / 2;
    housing.position.set(1.5, 0.5, zLight);
    chassis.add(housing);

    const emitterGeo = new THREE.CircleGeometry(0.1, 14);
    const emitter = new THREE.Mesh(emitterGeo, mats.headlightWhite);
    emitter.rotation.y = Math.PI / 2;
    emitter.position.set(1.575, 0.5, zLight);
    chassis.add(emitter);
  });

  // Rear Rescue Mission Payload Canister (Life support / beacon dispenser)
  const canisterGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.9, 16);
  const canisterMesh = new THREE.Mesh(canisterGeo, mats.titaniumAlloy);
  canisterMesh.rotation.x = Math.PI / 2;
  canisterMesh.position.set(-0.85, 0.95, 0);
  chassis.add(canisterMesh);

  const canisterBandGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.12, 16);
  const canisterBand = new THREE.Mesh(canisterBandGeo, mats.ledCyan);
  canisterBand.rotation.x = Math.PI / 2;
  canisterBand.position.set(-0.85, 0.95, 0);
  chassis.add(canisterBand);

  // Rear Emergency E-STOP Mushroom Button
  const estopBaseGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.03, 12);
  const estopBase = new THREE.Mesh(estopBaseGeo, mats.warningYellow);
  estopBase.position.set(-0.95, 1.13, -0.45);
  chassis.add(estopBase);

  const estopButtonGeo = new THREE.SphereGeometry(0.045, 10, 8);
  const estopButton = new THREE.Mesh(estopButtonGeo, mats.ledRed);
  estopButton.position.set(-0.95, 1.16, -0.45);
  chassis.add(estopButton);

  // Rear Steerable Parabolic Satellite Dish
  const dishGeo = new THREE.SphereGeometry(0.22, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2.2);
  const dish = new THREE.Mesh(dishGeo, mats.titaniumAlloy);
  dish.rotation.x = -Math.PI / 3;
  dish.rotation.y = Math.PI / 6;
  dish.position.set(-0.75, 1.35, -0.28);
  chassis.add(dish);

  const feedHorn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 6), mats.ledAmber);
  feedHorn.position.set(-0.75, 1.45, -0.28);
  chassis.add(feedHorn);

  group.add(chassis);

  // ================= 2. ARTICULATED ROBOTIC MANIPULATOR ARM WITH GRIPPER =================
  const roboticArm = new THREE.Group();
  roboticArm.position.set(0.55, 1.1, 0.42); // Front right upper deck

  // Turntable Base Servo
  const baseServo = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.1, 14), mats.darkChassis);
  roboticArm.add(baseServo);

  // Shoulder Joint
  const shoulder = new THREE.Group();
  shoulder.position.y = 0.08;
  const shoulderServo = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.16, 12), mats.titaniumAlloy);
  shoulderServo.rotation.x = Math.PI / 2;
  shoulder.add(shoulderServo);

  // Bicep Carbon Boom Arm
  const bicepArm = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.52, 8), mats.carbonHull);
  bicepArm.position.set(0.14, 0.22, 0);
  bicepArm.rotation.z = -0.55;
  shoulder.add(bicepArm);

  // Elbow Joint & Hydraulic Actuator
  const elbow = new THREE.Group();
  elbow.position.set(0.28, 0.42, 0);
  const elbowServo = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.14, 12), mats.titaniumAlloy);
  elbowServo.rotation.x = Math.PI / 2;
  elbow.add(elbowServo);

  // Forearm Segment
  const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.042, 0.46, 8), mats.titaniumAlloy);
  forearm.position.set(0.18, -0.1, 0);
  forearm.rotation.z = 1.1;
  elbow.add(forearm);

  // Wrist Rotator & 2-Jaw Motorized Gripper Claw
  const wrist = new THREE.Group();
  wrist.position.set(0.36, -0.22, 0);
  const wristServo = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.08, 10), mats.darkChassis);
  wrist.add(wristServo);

  // Gripper Jaws
  [-0.04, 0.04].forEach((zJaw) => {
    const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 0.03), mats.titaniumAlloy);
    jaw.position.set(0.08, 0, zJaw);
    const jawPad = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.015), mats.rubberTread);
    jawPad.position.set(0.08, 0, zJaw + (zJaw > 0 ? -0.01 : 0.01));
    wrist.add(jaw);
    wrist.add(jawPad);
  });

  // Miniature Laser Targeting Pointer in wrist center
  const laserPointer = new THREE.Mesh(new THREE.SphereGeometry(0.018, 6, 6), mats.ledGreen);
  laserPointer.position.set(0.08, 0, 0);
  wrist.add(laserPointer);

  elbow.add(wrist);
  shoulder.add(elbow);
  roboticArm.add(shoulder);
  group.add(roboticArm);

  // ================= 3. FOUR ALL-TERRAIN DEEP-TREAD WHEELS & SUSPENSION =================
  const wheelPositions = [
    { x: 0.95, z: 1.0, isFront: true },
    { x: -0.92, z: 1.0, isFront: false },
    { x: 0.95, z: -1.0, isFront: true },
    { x: -0.92, z: -1.0, isFront: false },
  ];

  wheelPositions.forEach((pos) => {
    // Steering knuckle group for front wheels (so they steer), static post for rear
    const steeringPivot = new THREE.Group();
    steeringPivot.position.set(pos.x, 0.42, pos.z);

    if (pos.isFront) {
      frontSteering.push(steeringPivot);
    }

    const wheelGroup = new THREE.Group();

    // Main Tire Rubber Cylinder
    const tireRadius = 0.54;
    const tireWidth = 0.44;
    const tireGeo = new THREE.CylinderGeometry(tireRadius, tireRadius, tireWidth, 22);
    const tireMesh = new THREE.Mesh(tireGeo, mats.rubberTread);
    tireMesh.rotation.x = Math.PI / 2;
    wheelGroup.add(tireMesh);

    // 16 3D Aggressive Off-Road Tire Tread Lugs around circumference
    const lugCount = 16;
    for (let l = 0; l < lugCount; l++) {
      const angle = (l / lugCount) * Math.PI * 2;
      const lugGeo = new THREE.BoxGeometry(0.1, 0.055, tireWidth * 0.92);
      const lug = new THREE.Mesh(lugGeo, mats.rubberTread);
      lug.position.set(
        Math.cos(angle) * (tireRadius + 0.025),
        Math.sin(angle) * (tireRadius + 0.025),
        0
      );
      lug.rotation.z = angle + 0.22 * (l % 2 === 0 ? 1 : -1); // Chevron stagger pattern
      wheelGroup.add(lug);
    }

    // Heavy Alloy Beadlock Wheel Rim
    const rimGeo = new THREE.CylinderGeometry(0.34, 0.34, tireWidth * 1.02, 18);
    const rimMesh = new THREE.Mesh(rimGeo, mats.titaniumAlloy);
    rimMesh.rotation.x = Math.PI / 2;
    wheelGroup.add(rimMesh);

    // 12 Miniature Beadlock Outer Hex Bolts around rim flange
    const boltCount = 12;
    for (let b = 0; b < boltCount; b++) {
      const bAngle = (b / boltCount) * Math.PI * 2;
      const boltGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.03, 6);
      const bolt = new THREE.Mesh(boltGeo, mats.steelCable);
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(
        Math.cos(bAngle) * 0.32,
        Math.sin(bAngle) * 0.32,
        pos.z > 0 ? 0.225 : -0.225
      );
      wheelGroup.add(bolt);
    }

    // 6-Spoke Wheel Star
    for (let s = 0; s < 6; s++) {
      const spokeGeo = new THREE.BoxGeometry(0.62, 0.065, 0.065);
      const spoke = new THREE.Mesh(spokeGeo, mats.titaniumAlloy);
      spoke.rotation.z = (s * Math.PI) / 3;
      spoke.position.z = pos.z > 0 ? 0.2 : -0.2;
      wheelGroup.add(spoke);
    }

    // Central Planetary Reduction Gearbox Hub Cap
    const hubCapGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.09, 12);
    const hubCap = new THREE.Mesh(hubCapGeo, mats.darkChassis);
    hubCap.rotation.x = Math.PI / 2;
    hubCap.position.z = pos.z > 0 ? 0.25 : -0.25;
    wheelGroup.add(hubCap);

    // Disc Brake Rotor with Gold Caliper
    const brakeDiscGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.025, 18);
    const brakeDisc = new THREE.Mesh(brakeDiscGeo, mats.titaniumAlloy);
    brakeDisc.rotation.x = Math.PI / 2;
    brakeDisc.position.z = pos.z > 0 ? -0.16 : 0.16;
    wheelGroup.add(brakeDisc);

    const caliperGeo = new THREE.BoxGeometry(0.14, 0.12, 0.08);
    const caliper = new THREE.Mesh(caliperGeo, mats.goldStator);
    caliper.position.set(0.14, 0.14, pos.z > 0 ? -0.16 : 0.16);
    wheelGroup.add(caliper);

    steeringPivot.add(wheelGroup);
    wheels.push(wheelGroup);

    // Double Wishbone Suspension Arm to Chassis
    const suspArmGeo = new THREE.CylinderGeometry(0.048, 0.048, 0.5, 6);
    const suspArm = new THREE.Mesh(suspArmGeo, mats.darkChassis);
    suspArm.position.set(0, 0.06, pos.z > 0 ? -0.25 : 0.25);
    suspArm.rotation.x = pos.z > 0 ? 0.45 : -0.45;
    steeringPivot.add(suspArm);

    // Coil-Over Shock Absorber Spring
    const shockSpringGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.36, 10);
    const shockSpring = new THREE.Mesh(shockSpringGeo, mats.goldStator);
    shockSpring.position.set(0, 0.2, pos.z > 0 ? -0.19 : 0.19);
    steeringPivot.add(shockSpring);

    // High-Voltage Rescue Orange Braided Cable routed into hub
    const cableGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.48, 6);
    const cable = new THREE.Mesh(cableGeo, mats.highVoltageCable);
    cable.position.set(-0.06, 0.1, pos.z > 0 ? -0.18 : 0.18);
    cable.rotation.z = -0.3;
    steeringPivot.add(cable);

    group.add(steeringPivot);
  });

  // ================= 4. SENSOR MAST WITH ROTATING LIDAR & ACTIVE LASER FAN =================
  const sensorMast = new THREE.Group();
  sensorMast.position.set(0.48, 1.1, -0.25); // Positioned on upper deck

  // Telescoping Mast Base Post
  const postGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.7, 8);
  const post = new THREE.Mesh(postGeo, mats.titaniumAlloy);
  post.position.y = 0.35;
  sensorMast.add(post);

  // Turret Pan/Tilt Base
  const turretBaseGeo = new THREE.BoxGeometry(0.4, 0.18, 0.38);
  const turretBase = new THREE.Mesh(turretBaseGeo, mats.darkChassis);
  turretBase.position.y = 0.72;
  sensorMast.add(turretBase);

  // Stereo Depth Navigation Cameras with Lens Sun Hoods
  [-0.12, 0.12].forEach((zCam) => {
    const camEyeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.07, 12);
    const camEye = new THREE.Mesh(camEyeGeo, mats.opticalGlass);
    camEye.rotation.z = Math.PI / 2;
    camEye.position.set(0.22, 0.72, zCam);
    sensorMast.add(camEye);

    const hoodGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.04, 12);
    const hood = new THREE.Mesh(hoodGeo, mats.titaniumAlloy);
    hood.rotation.z = Math.PI / 2;
    hood.position.set(0.24, 0.72, zCam);
    sensorMast.add(hood);
  });

  // Rotating Velodyne-Style 3D LiDAR Puck on Top
  const lidar = new THREE.Group();
  lidar.position.set(0, 0.92, 0);

  const lidarBodyGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.2, 16);
  const lidarBody = new THREE.Mesh(lidarBodyGeo, mats.carbonHull);
  lidar.add(lidarBody);

  // Glowing 360-degree Laser Aperture Ring
  const laserRingGeo = new THREE.CylinderGeometry(0.185, 0.185, 0.04, 16);
  const laserRing = new THREE.Mesh(laserRingGeo, mats.ledGreen);
  laserRing.position.y = 0.01;
  lidar.add(laserRing);

  // Top Cap with antenna stub
  const topCapGeo = new THREE.ConeGeometry(0.09, 0.07, 12);
  const topCap = new THREE.Mesh(topCapGeo, mats.titaniumAlloy);
  topCap.position.y = 0.14;
  lidar.add(topCap);

  // Active Laser Scan Fan / Projection Beam onto ground
  const scanFanGeo = new THREE.ConeGeometry(1.6, 2.2, 16, 1, true, -Math.PI / 3, (2 * Math.PI) / 3);
  const scanFan = new THREE.Mesh(scanFanGeo, mats.laserScanBeam);
  scanFan.rotation.x = Math.PI / 1.8;
  scanFan.position.set(0.8, -0.6, 0);
  lidar.add(scanFan);

  sensorMast.add(lidar);

  // Dual Rear Mesh Communication Antennas
  [-0.34, 0.34].forEach((zAnt) => {
    const antBaseGeo = new THREE.CylinderGeometry(0.035, 0.045, 0.14, 6);
    const antBase = new THREE.Mesh(antBaseGeo, mats.goldStator);
    antBase.position.set(-0.88, 1.22, zAnt);
    chassis.add(antBase);

    const whipGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.35, 6);
    const whip = new THREE.Mesh(whipGeo, mats.titaniumAlloy);
    whip.position.set(-0.88, 1.9, zAnt);
    whip.rotation.z = 0.15;
    chassis.add(whip);

    const whipTip = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), mats.ledCyan);
    whipTip.position.set(-0.7, 2.55, zAnt);
    chassis.add(whipTip);
  });

  group.add(sensorMast);

  return { group, wheels, sensorMast, lidar, roboticArm, frontSteering };
}

/**
 * Creates wireframe topographical contour terrain with layered elevations,
 * radar scanning rings, and technical coordinate markings.
 */
export function createTopographicalTerrain(): THREE.Group {
  const group = new THREE.Group();
  const contourMat = createWireframeMaterial(0x607078, 0.28);
  const primaryContourMat = createWireframeMaterial(0x9aa8ad, 0.45);
  const ringMat = createWireframeMaterial(0x789098, 0.25);

  // Concentric contour rings undulating as topographic mountain/ravine contours
  const contourLevels = 14;
  for (let i = 1; i <= contourLevels; i++) {
    const radius = i * 1.5;
    const segments = 48;
    const points: THREE.Vector3[] = [];

    for (let j = 0; j <= segments; j++) {
      const angle = (j / segments) * Math.PI * 2;
      const wave = Math.sin(angle * 3) * 0.45 + Math.cos(angle * 5) * 0.25 + Math.sin(angle * 2 + i * 0.5) * 0.6;
      const r = radius + wave;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = -1.2 + Math.sin(x * 0.12) * Math.cos(z * 0.12) * 1.2 - (radius > 12 ? (radius - 12) * 0.15 : 0);
      points.push(new THREE.Vector3(x, y, z));
    }

    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(lineGeo, i % 3 === 0 ? primaryContourMat : contourMat);
    group.add(line);
  }

  // Tactical Range Radar Rings on floor
  [4, 8, 12, 16, 20].forEach((r) => {
    const circleGeo = new THREE.BufferGeometry();
    const pts: THREE.Vector3[] = [];
    for (let a = 0; a <= 64; a++) {
      const theta = (a / 64) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(theta) * r, -1.3, Math.sin(theta) * r));
    }
    circleGeo.setFromPoints(pts);
    const circle = new THREE.LineLoop(circleGeo, ringMat);
    group.add(circle);
  });

  // Crosshair reference axes
  const axisGeo = new THREE.BufferGeometry();
  axisGeo.setFromPoints([
    new THREE.Vector3(-22, -1.3, 0),
    new THREE.Vector3(22, -1.3, 0),
    new THREE.Vector3(0, -1.3, -22),
    new THREE.Vector3(0, -1.3, 22),
  ]);
  const axisLines = new THREE.LineSegments(axisGeo, createWireframeMaterial(0x4a5860, 0.2));
  group.add(axisLines);

  return group;
}
