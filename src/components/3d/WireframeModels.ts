import * as THREE from 'three';

// Material generator for glowing technical wireframes
export function createWireframeMaterial(color = 0xffffff, opacity = 0.85, lineWidth = 1): THREE.LineBasicMaterial {
  return new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity,
    linewidth: lineWidth,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

export function createWireframeMeshMaterial(color = 0xffffff, wireframeOpacity = 0.45): THREE.MeshBasicMaterial {
  return new THREE.MeshBasicMaterial({
    color: new THREE.Color(color),
    wireframe: true,
    transparent: true,
    opacity: wireframeOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
}

/**
 * Creates a detailed 3D technical wireframe Quadcopter Drone
 * Includes: Central fuselage, 4 carbon-fiber arms, 4 motor nacelles,
 * spinning rotor discs, dual landing skids, gimbal sensor camera, and antenna.
 */
export function createQuadcopterDrone(): { group: THREE.Group; rotors: THREE.Group[] } {
  const group = new THREE.Group();
  const wireMat = createWireframeMaterial(0xffffff, 0.9);
  const dimWireMat = createWireframeMaterial(0xdde5e8, 0.45);
  const glowMat = createWireframeMeshMaterial(0xffffff, 0.25);

  // 1. Central fuselage (hexagonal avionics body)
  const bodyGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.28, 6);
  const bodyWire = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeo), wireMat);
  group.add(bodyWire);

  // Body top dome / antenna mount
  const domeGeo = new THREE.ConeGeometry(0.3, 0.25, 6);
  const domeWire = new THREE.LineSegments(new THREE.EdgesGeometry(domeGeo), dimWireMat);
  domeWire.position.y = 0.25;
  group.add(domeWire);

  // Mini GPS antenna
  const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.35, 4);
  const antWire = new THREE.LineSegments(new THREE.EdgesGeometry(antGeo), wireMat);
  antWire.position.set(0, 0.4, 0);
  group.add(antWire);

  // 2. Gimbal Sensor / Camera Pod under belly
  const gimbalGeo = new THREE.SphereGeometry(0.22, 8, 6);
  const gimbalWire = new THREE.LineSegments(new THREE.EdgesGeometry(gimbalGeo), wireMat);
  gimbalWire.position.set(0.18, -0.22, 0);
  group.add(gimbalWire);

  // Camera lens ring
  const lensGeo = new THREE.TorusGeometry(0.1, 0.02, 6, 12);
  const lens = new THREE.LineSegments(new THREE.EdgesGeometry(lensGeo), wireMat);
  lens.rotation.y = Math.PI / 2;
  lens.position.set(0.32, -0.22, 0);
  group.add(lens);

  // 3. Four Diagonal Carbon-Fiber Arms
  const armAngles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
  const armLength = 1.6;
  const rotors: THREE.Group[] = [];

  armAngles.forEach((angle) => {
    const armGroup = new THREE.Group();
    armGroup.rotation.y = angle;

    // Dual-rail tubular arm
    const rail1Geo = new THREE.BoxGeometry(armLength, 0.04, 0.08);
    const rail1 = new THREE.LineSegments(new THREE.EdgesGeometry(rail1Geo), wireMat);
    rail1.position.x = armLength / 2 + 0.3;
    armGroup.add(rail1);

    // Diagonal brace
    const braceGeo = new THREE.BoxGeometry(armLength * 0.7, 0.03, 0.04);
    const brace = new THREE.LineSegments(new THREE.EdgesGeometry(braceGeo), dimWireMat);
    brace.position.set((armLength / 2 + 0.3) * 0.8, -0.06, 0);
    brace.rotation.z = -0.08;
    armGroup.add(brace);

    // Motor Mount / Nacelle at tip
    const motorGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.22, 8);
    const motorWire = new THREE.LineSegments(new THREE.EdgesGeometry(motorGeo), wireMat);
    const motorX = armLength + 0.3;
    motorWire.position.set(motorX, 0.08, 0);
    armGroup.add(motorWire);

    // Rotor disc guard ring
    const guardGeo = new THREE.TorusGeometry(0.55, 0.015, 6, 24);
    const guardWire = new THREE.LineSegments(new THREE.EdgesGeometry(guardGeo), dimWireMat);
    guardWire.rotation.x = Math.PI / 2;
    guardWire.position.set(motorX, 0.18, 0);
    armGroup.add(guardWire);

    // Spinning Rotor unit
    const rotorGroup = new THREE.Group();
    rotorGroup.position.set(motorX, 0.2, 0);

    // Propeller twin blades
    const propGeo = new THREE.BoxGeometry(1.0, 0.015, 0.09);
    const prop = new THREE.LineSegments(new THREE.EdgesGeometry(propGeo), wireMat);
    rotorGroup.add(prop);

    // Faint rotor blur disc mesh
    const blurGeo = new THREE.CircleGeometry(0.52, 16);
    const blur = new THREE.Mesh(blurGeo, glowMat);
    blur.rotation.x = -Math.PI / 2;
    rotorGroup.add(blur);

    armGroup.add(rotorGroup);
    rotors.push(rotorGroup);

    group.add(armGroup);
  });

  // 4. Landing Gear (Dual Skids with Struts)
  [-0.6, 0.6].forEach((zOffset) => {
    // Horizontal skid tube
    const skidGeo = new THREE.BoxGeometry(2.0, 0.04, 0.04);
    const skid = new THREE.LineSegments(new THREE.EdgesGeometry(skidGeo), wireMat);
    skid.position.set(0, -0.7, zOffset);
    group.add(skid);

    // Skid upturned tips
    const tipFrontGeo = new THREE.BoxGeometry(0.25, 0.04, 0.04);
    const tipFront = new THREE.LineSegments(new THREE.EdgesGeometry(tipFrontGeo), wireMat);
    tipFront.position.set(1.05, -0.62, zOffset);
    tipFront.rotation.z = 0.55;
    group.add(tipFront);

    const tipBackGeo = new THREE.BoxGeometry(0.25, 0.04, 0.04);
    const tipBack = new THREE.LineSegments(new THREE.EdgesGeometry(tipBackGeo), wireMat);
    tipBack.position.set(-1.05, -0.62, zOffset);
    tipBack.rotation.z = -0.55;
    group.add(tipBack);

    // Struts from fuselage to skid
    [-0.55, 0.55].forEach((xOffset) => {
      const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.65, 4);
      const strut = new THREE.LineSegments(new THREE.EdgesGeometry(strutGeo), dimWireMat);
      strut.position.set(xOffset, -0.42, zOffset * 0.7);
      strut.rotation.x = zOffset > 0 ? -0.35 : 0.35;
      group.add(strut);
    });
  });

  return { group, rotors };
}

/**
 * Creates a detailed 3D technical wireframe GroundBot 01 Rover
 * Includes: Rugged rectangular chassis, 4 large all-terrain wheels with spokes and tread rings,
 * articulated sensor mast with rotating LiDAR puck and twin stereo cameras, roll cage & antennae.
 */
export function createGroundBotRover(): { group: THREE.Group; wheels: THREE.Group[]; sensorMast: THREE.Group } {
  const group = new THREE.Group();
  const wireMat = createWireframeMaterial(0xffffff, 0.9);
  const dimWireMat = createWireframeMaterial(0xdde5e8, 0.45);
  const accentMat = createWireframeMaterial(0xffffff, 0.95);

  // 1. Lower Main Chassis
  const lowerHullGeo = new THREE.BoxGeometry(2.4, 0.55, 1.4);
  const lowerHull = new THREE.LineSegments(new THREE.EdgesGeometry(lowerHullGeo), wireMat);
  lowerHull.position.y = 0.45;
  group.add(lowerHull);

  // Upper Electronics Enclosure with angled bevels
  const upperHullGeo = new THREE.BoxGeometry(1.6, 0.45, 1.1);
  const upperHull = new THREE.LineSegments(new THREE.EdgesGeometry(upperHullGeo), wireMat);
  upperHull.position.set(-0.15, 0.85, 0);
  group.add(upperHull);

  // Battery compartment side panels
  [-0.65, 0.65].forEach((z) => {
    const packGeo = new THREE.BoxGeometry(1.4, 0.35, 0.15);
    const pack = new THREE.LineSegments(new THREE.EdgesGeometry(packGeo), dimWireMat);
    pack.position.set(-0.1, 0.5, z);
    group.add(pack);
  });

  // Front Bullbar / bumper
  const bumperGeo = new THREE.BoxGeometry(0.2, 0.3, 1.55);
  const bumper = new THREE.LineSegments(new THREE.EdgesGeometry(bumperGeo), accentMat);
  bumper.position.set(1.3, 0.35, 0);
  group.add(bumper);

  // 2. Four Heavy-Duty Wheels
  const wheelPositions = [
    { x: 0.85, z: 0.95 },
    { x: -0.85, z: 0.95 },
    { x: 0.85, z: -0.95 },
    { x: -0.85, z: -0.95 },
  ];
  const wheels: THREE.Group[] = [];

  wheelPositions.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, 0.38, pos.z);

    // Tire outer cylinder
    const tireGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.38, 14);
    const tire = new THREE.LineSegments(new THREE.EdgesGeometry(tireGeo), wireMat);
    tire.rotation.x = Math.PI / 2;
    wheelGroup.add(tire);

    // Tire tread rings
    [-0.12, 0, 0.12].forEach((offset) => {
      const ringGeo = new THREE.TorusGeometry(0.485, 0.015, 4, 14);
      const ring = new THREE.LineSegments(new THREE.EdgesGeometry(ringGeo), dimWireMat);
      ring.position.z = offset;
      wheelGroup.add(ring);
    });

    // Hub spokes (cross spokes)
    const spoke1Geo = new THREE.BoxGeometry(0.8, 0.04, 0.04);
    const spoke1 = new THREE.LineSegments(new THREE.EdgesGeometry(spoke1Geo), wireMat);
    spoke1.position.z = pos.z > 0 ? 0.16 : -0.16;
    wheelGroup.add(spoke1);

    const spoke2 = spoke1.clone();
    spoke2.rotation.z = Math.PI / 2;
    wheelGroup.add(spoke2);

    // Suspension wishbone arm to chassis
    const suspGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 4);
    const susp = new THREE.LineSegments(new THREE.EdgesGeometry(suspGeo), dimWireMat);
    susp.position.set(pos.x, 0.45, pos.z * 0.7);
    susp.rotation.x = pos.z > 0 ? 0.45 : -0.45;
    group.add(susp);

    wheels.push(wheelGroup);
    group.add(wheelGroup);
  });

  // 3. Sensor Mast with Pan/Tilt Turret & Rotating LiDAR Puck
  const sensorMast = new THREE.Group();
  sensorMast.position.set(0.45, 1.1, 0);

  // Vertical mast pole
  const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.7, 6);
  const pole = new THREE.LineSegments(new THREE.EdgesGeometry(poleGeo), wireMat);
  pole.position.y = 0.35;
  sensorMast.add(pole);

  // Turret head platform
  const headGeo = new THREE.BoxGeometry(0.35, 0.18, 0.35);
  const head = new THREE.LineSegments(new THREE.EdgesGeometry(headGeo), wireMat);
  head.position.y = 0.75;
  sensorMast.add(head);

  // Rotating LiDAR puck on top
  const lidarGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.16, 12);
  const lidar = new THREE.LineSegments(new THREE.EdgesGeometry(lidarGeo), accentMat);
  lidar.position.y = 0.92;
  sensorMast.add(lidar);

  // Stereo cameras
  [-0.1, 0.1].forEach((z) => {
    const camGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
    const cam = new THREE.LineSegments(new THREE.EdgesGeometry(camGeo), wireMat);
    cam.position.set(0.2, 0.75, z);
    sensorMast.add(cam);
  });

  group.add(sensorMast);

  // Dual Rear Communication Antennae
  [-0.35, 0.35].forEach((z) => {
    const antGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.1, 4);
    const ant = new THREE.LineSegments(new THREE.EdgesGeometry(antGeo), dimWireMat);
    ant.position.set(-0.9, 1.4, z);
    ant.rotation.z = 0.12;
    group.add(ant);
  });

  return { group, wheels, sensorMast };
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
      // Perlin-like pseudo-elevation wave displacement
      const wave = Math.sin(angle * 3) * 0.45 + Math.cos(angle * 5) * 0.25 + Math.sin(angle * 2 + i * 0.5) * 0.6;
      const r = radius + wave;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      // Height profile: peaks in background, flatter in center mission zone
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
