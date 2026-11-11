import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Helper component to render a 3D laser beam cylinder between two points
function LaserBeam3D({ start, end, color, glowColor, isAnimated = true, radius = 0.035 }) {
  const meshRef = useRef();
  const pulseRef = useRef();

  const { position, quaternion, length } = useMemo(() => {
    const vStart = new THREE.Vector3(...start);
    const vEnd = new THREE.Vector3(...end);
    const dir = new THREE.Vector3().subVectors(vEnd, vStart);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);

    const quat = new THREE.Quaternion();
    if (len > 0.001) {
      quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    }

    return { position: mid, quaternion: quat, length: len };
  }, [start, end]);

  // Subtle pulse animation
  useFrame(({ clock }) => {
    if (isAnimated && pulseRef.current) {
      const t = clock.getElapsedTime();
      const scale = 1 + 0.08 * Math.sin(t * 8);
      pulseRef.current.scale.set(scale, 1, scale);
    }
  });

  if (length < 0.01) return null;

  return (
    <group position={position} quaternion={quaternion}>
      {/* Outer translucent glow beam */}
      <mesh ref={pulseRef}>
        <cylinderGeometry args={[radius * 2.8, radius * 2.8, length, 16]} />
        <meshBasicMaterial color={glowColor || color} transparent opacity={0.25} />
      </mesh>

      {/* Core vibrant laser beam */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[radius, radius, length, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={color}
          emissiveIntensity={3.5}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
}

// Helper to draw an angle arc in 3D
function AngleArc3D({ startAngleDeg, endAngleDeg, radius = 1.1, color = '#22d3ee', originY = 0.1 }) {
  const points = useMemo(() => {
    const pts = [];
    const minDeg = Math.min(startAngleDeg, endAngleDeg);
    const maxDeg = Math.max(startAngleDeg, endAngleDeg);
    const steps = 24;

    for (let i = 0; i <= steps; i++) {
      const deg = minDeg + ((maxDeg - minDeg) * i) / steps;
      const rad = (deg * Math.PI) / 180;
      // Normal is along +Y, angle measured from +Y
      const x = radius * Math.sin(rad);
      const y = originY + radius * Math.cos(rad);
      pts.push(new THREE.Vector3(x, y, 0));
    }
    return pts;
  }, [startAngleDeg, endAngleDeg, radius, originY]);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={color} linewidth={2} />
    </line>
  );
}

export default function ReflectionScene3D({
  angle = 45,
  laserDistance = 5.2,
  showNormal = true,
  showAngles = true,
  showIncidentRay = true,
  showReflectedRay = true,
  showCoplanarPlane = false,
  showProtractor = true,
  isAnimated = true,
  laserPower = true,
  targetAngle = 55,
  targetHit = false,
  controlsRef,
}) {
  const originY = 0.1; // Surface of mirror

  // Calculate Incident laser emitter coordinates in X-Y plane (Z = 0)
  const rad = (angle * Math.PI) / 180;
  const incidentStartX = -laserDistance * Math.sin(rad);
  const incidentStartY = originY + laserDistance * Math.cos(rad);
  const incidentStart = [incidentStartX, incidentStartY, 0];

  // Point of incidence O
  const originPoint = [0, originY, 0];

  // Reflected ray endpoint (by law of reflection, angle of reflection = angle of incidence)
  const reflectedEndX = laserDistance * Math.sin(rad);
  const reflectedEndY = originY + laserDistance * Math.cos(rad);
  const reflectedEnd = [reflectedEndX, reflectedEndY, 0];

  // Target coordinates at targetAngle (55°)
  const radTarget = (targetAngle * Math.PI) / 180;
  const targetX = laserDistance * Math.sin(radTarget);
  const targetY = originY + laserDistance * Math.cos(radTarget);

  // Midpoints for labels with minimum separation to prevent overlap at small angles
  const labelArcRadius = 1.35;
  const minLabelSeparation = 0.85; // Guarantees badges never overlap each other or normal line
  const calculatedOffset = labelArcRadius * Math.sin(rad / 2);
  const labelXOffset = Math.max(minLabelSeparation, calculatedOffset);

  const incLabelX = -labelXOffset;
  const incLabelY = originY + Math.max(0.85, labelArcRadius * Math.cos(rad / 2));

  const refLabelX = labelXOffset;
  const refLabelY = originY + Math.max(0.85, labelArcRadius * Math.cos(rad / 2));

  // Table protractor degree tick markers
  const protractorTicks = useMemo(() => {
    const ticks = [];
    for (let deg = -80; deg <= 80; deg += 10) {
      const isMajor = deg % 30 === 0;
      const isZero = deg === 0;
      const tickRad = (deg * Math.PI) / 180;
      const r1 = 3.6;
      const r2 = isMajor ? 3.9 : 3.75;
      const x1 = r1 * Math.sin(tickRad);
      const y1 = originY + 0.005;
      const z1 = r1 * Math.cos(tickRad) * 0.45; // ellipse on table

      const x2 = r2 * Math.sin(tickRad);
      const y2 = originY + 0.005;
      const z2 = r2 * Math.cos(tickRad) * 0.45;

      ticks.push({ x1, y1, z1, x2, y2, z2, deg, isMajor, isZero });
    }
    return ticks;
  }, [originY]);

  return (
    <>
      {/* Orbit Controls with sensible camera limits */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minDistance={3.5}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2 + 0.08}
        target={[0, 1.2, 0]}
      />

      {/* Lighting */}
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 12, 6]} intensity={1.3} castShadow />
      <directionalLight position={[-6, 8, -4]} intensity={0.6} />
      {/* Glowing point light at point of incidence O */}
      {laserPower && (
        <pointLight position={[0, originY + 0.1, 0]} intensity={2.0} color="#00f0ff" distance={3.5} />
      )}

      {/* 3D OPTICAL BENCH / TABLE */}
      <group position={[0, -0.05, 0]}>
        {/* Table top slab */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[14, 0.1, 7]} />
          <meshStandardMaterial color="#0b1120" roughness={0.7} metalness={0.3} />
        </mesh>

        {/* Ambient Grid Helper on table */}
        <gridHelper args={[14, 28, '#0891b2', '#1e293b']} position={[0, 0.055, 0]} />

        {/* Protractor scale on table */}
        {showProtractor && (
          <group position={[0, 0.06, 0]}>
            {protractorTicks.map((t, idx) => (
              <group key={idx}>
                <line>
                  <bufferGeometry
                    attach="geometry"
                    onUpdate={(self) =>
                      self.setFromPoints([
                        new THREE.Vector3(t.x1, t.y1, t.z1),
                        new THREE.Vector3(t.x2, t.y2, t.z2),
                      ])
                    }
                  />
                  <lineBasicMaterial attach="material" color={t.isZero ? '#22d3ee' : t.isMajor ? '#94a3b8' : '#334155'} />
                </line>
                {t.isMajor && (
                  <Html position={[t.x2 * 1.08, t.y2, t.z2 * 1.08]} center distanceFactor={14}>
                    <span className="text-[9px] font-mono font-bold text-slate-400 select-none">
                      {Math.abs(t.deg)}°
                    </span>
                  </Html>
                )}
              </group>
            ))}
          </group>
        )}
      </group>

      {/* 1. 3D PLANE MIRROR ASSEMBLY */}
      <group position={[0, originY, 0]}>
        {/* Mirror Frame / Backing Stand */}
        <mesh position={[0, -0.04, 0]}>
          <boxGeometry args={[8.8, 0.08, 2.2]} />
          <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Highly Reflective Mirror Glass Surface */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[8.5, 0.02, 1.9]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.96}
            roughness={0.06}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* Silver Reflective Sheen Front Bevel */}
        <mesh position={[0, 0.012, 0]}>
          <boxGeometry args={[8.4, 0.005, 0.04]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.6} />
        </mesh>

        {/* Optical Bench Clamps on Mirror Edges */}
        <mesh position={[-4.3, 0.06, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.25, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[4.3, 0.06, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 0.25, 16]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* 3D Label on Mirror Base */}
        <Html position={[0, -0.05, 1.3]} center distanceFactor={13}>
          <div className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-bold text-slate-300 tracking-wider uppercase select-none pointer-events-none whitespace-nowrap shadow-lg">
            Plane Mirror (Reflective Surface)
          </div>
        </Html>
      </group>

      {/* 2. POINT OF INCIDENCE O */}
      <group position={originPoint}>
        <mesh position={[0, 0.015, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00f0ff"
            emissiveIntensity={laserPower ? 4.0 : 0.5}
          />
        </mesh>

        {/* Pulsing ring at point O */}
        {laserPower && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.08, 0.16, 24]} />
            <meshBasicMaterial color="#00f0ff" transparent opacity={0.6} side={THREE.DoubleSide} />
          </mesh>
        )}

        <Html position={[0, -0.28, 0.65]} center distanceFactor={12}>
          <div className="text-[10px] font-mono font-bold text-cyan-300 select-none pointer-events-none">
            Point O
          </div>
        </Html>
      </group>

      {/* 3. NORMAL LINE (PERPENDICULAR TO MIRROR) */}
      {showNormal && (
        <group>
          {/* Dashed line rendered as striped tubes */}
          {Array.from({ length: 12 }).map((_, i) => {
            const segY1 = originY + i * 0.32;
            const segY2 = originY + i * 0.32 + 0.18;
            return (
              <LaserBeam3D
                key={i}
                start={[0, segY1, 0]}
                end={[0, segY2, 0]}
                color="#38bdf8"
                glowColor="#0284c7"
                radius={0.015}
                isAnimated={false}
              />
            );
          })}

          {/* 90° right-angle indicator square at mirror surface */}
          <group position={[0, originY, 0]}>
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) =>
                  self.setFromPoints([
                    new THREE.Vector3(0, 0.3, 0),
                    new THREE.Vector3(0.3, 0.3, 0),
                    new THREE.Vector3(0.3, 0, 0),
                  ])
                }
              />
              <lineBasicMaterial attach="material" color="#38bdf8" linewidth={2} />
            </line>
          </group>

          {/* Normal 3D Badge */}
          <Html position={[0, originY + 3.9, 0]} center distanceFactor={12}>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide select-none pointer-events-none shadow-xl whitespace-nowrap">
              Normal Line (N) 90°
            </div>
          </Html>
        </group>
      )}

      {/* 4. LIGHT SOURCE (3D LASER EMITTER) */}
      <group position={incidentStart}>
        {/* Laser Housing body pointing towards (0, originY, 0) */}
        {(() => {
          const vStart = new THREE.Vector3(...incidentStart);
          const vTarget = new THREE.Vector3(0, originY, 0);
          const dir = new THREE.Vector3().subVectors(vTarget, vStart).normalize();
          const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

          return (
            <group quaternion={quat}>
              {/* Emitter cylinder */}
              <mesh position={[0, -0.3, 0]}>
                <cylinderGeometry args={[0.16, 0.22, 0.65, 20]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
              </mesh>
              {/* Nozzle front ring */}
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.12, 0.16, 0.1, 20]} />
                <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.8} />
              </mesh>
              {/* Power LED Indicator */}
              <mesh position={[0.2, -0.3, 0]}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshStandardMaterial
                  color={laserPower ? '#22d3ee' : '#ef4444'}
                  emissive={laserPower ? '#22d3ee' : '#ef4444'}
                  emissiveIntensity={3.0}
                />
              </mesh>
            </group>
          );
        })()}

        <Html position={[0, 0.45, 0]} center distanceFactor={12}>
          <div className="px-2 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/30 text-[10px] font-bold text-cyan-300 select-none pointer-events-none whitespace-nowrap">
            Laser Emitter
          </div>
        </Html>
      </group>

      {/* 5. INCIDENT RAY (CYAN) */}
      {laserPower && showIncidentRay && (
        <group>
          <LaserBeam3D
            start={incidentStart}
            end={originPoint}
            color="#00f0ff"
            glowColor="#22d3ee"
            isAnimated={isAnimated}
            radius={0.038}
          />
        </group>
      )}

      {/* 6. REFLECTED RAY (VIOLET) */}
      {laserPower && showReflectedRay && (
        <group>
          <LaserBeam3D
            start={originPoint}
            end={reflectedEnd}
            color="#c084fc"
            glowColor="#a855f7"
            isAnimated={isAnimated}
            radius={0.038}
          />
        </group>
      )}

      {/* 7. COPLANAR PLANE VISUALIZATION (2nd Law of Reflection) */}
      {showCoplanarPlane && (
        <group position={[0, originY + 2.0, 0]}>
          <mesh>
            <planeGeometry args={[laserDistance * 2.2, 4.2]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.14}
              side={THREE.DoubleSide}
              roughness={0.5}
            />
          </mesh>
          <Html position={[0, 2.2, 0]} center distanceFactor={12}>
            <div className="px-2.5 py-1 rounded-md bg-violet-950/90 border border-violet-500/40 text-violet-200 text-[10px] font-bold select-none pointer-events-none shadow-lg whitespace-nowrap">
              Plane of Incidence (Coplanar: Incident + Normal + Reflected)
            </div>
          </Html>
        </group>
      )}

      {/* 8. ANGLE MEASUREMENTS & ARCS */}
      {showAngles && angle > 2 && (
        <group>
          {/* Angle of Incidence Arc */}
          <AngleArc3D
            startAngleDeg={-angle}
            endAngleDeg={0}
            radius={1.1}
            color="#22d3ee"
            originY={originY}
          />

          {/* Angle of Reflection Arc */}
          <AngleArc3D
            startAngleDeg={0}
            endAngleDeg={angle}
            radius={1.1}
            color="#c084fc"
            originY={originY}
          />

          {/* Angle of Incidence Badge */}
          <Html position={[incLabelX, incLabelY, 0]} center distanceFactor={12}>
            <div className="px-2 py-0.5 rounded-lg bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 font-mono text-[11px] font-extrabold select-none pointer-events-none shadow-lg whitespace-nowrap">
              ∠i = {angle}°
            </div>
          </Html>

          {/* Angle of Reflection Badge */}
          <Html position={[refLabelX, refLabelY, 0]} center distanceFactor={12}>
            <div className="px-2 py-0.5 rounded-lg bg-violet-950/90 border border-violet-400/50 text-violet-300 font-mono text-[11px] font-extrabold select-none pointer-events-none shadow-lg whitespace-nowrap">
              ∠r = {angle}°
            </div>
          </Html>
        </group>
      )}

      {/* 9. TARGET DETECTOR SENSOR AT 55° */}
      <group position={[targetX, targetY, 0]}>
        {/* Sensor Housing */}
        <mesh rotation={[0, 0, -radTarget]}>
          <cylinderGeometry args={[0.28, 0.28, 0.15, 24]} />
          <meshStandardMaterial
            color={targetHit && laserPower ? '#10b981' : '#334155'}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        {/* Target Bullseye Rings */}
        <mesh position={[0, 0, 0.08]} rotation={[0, 0, -radTarget]}>
          <ringGeometry args={[0.08, 0.22, 24]} />
          <meshBasicMaterial
            color={targetHit && laserPower ? '#34d399' : '#64748b'}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[0, 0, 0.09]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={targetHit && laserPower ? '#ffffff' : '#475569'}
            emissive={targetHit && laserPower ? '#10b981' : '#000000'}
            emissiveIntensity={targetHit && laserPower ? 3.0 : 0}
          />
        </mesh>

        {/* Target Label */}
        <Html position={[0, 0.45, 0]} center distanceFactor={12}>
          <div
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold select-none pointer-events-none whitespace-nowrap shadow-xl border ${
              targetHit && laserPower
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-400'
            }`}
          >
            {targetHit && laserPower ? '🎯 SENSOR TARGET HIT (55°)' : 'Sensor Target (55°)'}
          </div>
        </Html>
      </group>
    </>
  );
}
