import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Convert Lat/Lon coordinates to 3D Cartesian coordinates on a sphere
const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Major Global Enterprise & Risk Hubs
const GLOBAL_HUBS = [
  { name: 'New York Hub', lat: 40.7128, lon: -74.0060, color: '#00C6FF', role: 'Financial Core' },
  { name: 'London Sentinel', lat: 51.5074, lon: -0.1278, color: '#00FFB2', role: 'European Grid' },
  { name: 'Tokyo Neural Node', lat: 35.6762, lon: 139.6503, color: '#FFC857', role: 'APAC Center' },
  { name: 'Singapore Gateway', lat: 1.3521, lon: 103.8198, color: '#00C6FF', role: 'Trade Analytics' },
  { name: 'Frankfurt Hub', lat: 50.1109, lon: 8.6821, color: '#7A5CFF', role: 'Sovereign Risk' },
  { name: 'Dubai Nexus', lat: 25.2048, lon: 55.2708, color: '#FF9E00', role: 'Energy & Supply' },
  { name: 'Sydney Terminal', lat: -33.8688, lon: 151.2093, color: '#00E5FF', role: 'Oceania Feed' },
  { name: 'São Paulo Node', lat: -23.5505, lon: -46.6333, color: '#FF4D6D', role: 'LATAM Sentinel' },
  { name: 'San Francisco AI', lat: 37.7749, lon: -122.4194, color: '#00FF99', role: 'Autonomous Engine' },
  { name: 'Zurich Vault', lat: 47.3769, lon: 8.5417, color: '#38BDF8', role: 'Security Node' }
];

// Network connection routes between hubs
const CONNECTIONS = [
  [0, 1], // NYC - London
  [1, 4], // London - Frankfurt
  [4, 5], // Frankfurt - Dubai
  [5, 3], // Dubai - Singapore
  [3, 2], // Singapore - Tokyo
  [2, 8], // Tokyo - SF
  [8, 0], // SF - NYC
  [0, 7], // NYC - Sao Paulo
  [3, 6], // Singapore - Sydney
  [1, 9], // London - Zurich
];

// Great Circle Arc Component with animated traveling pulse
const NetworkArc = ({ start, end, radius, color }: { start: THREE.Vector3; end: THREE.Vector3; radius: number; color: string }) => {
  const pulseRef = useRef<THREE.Mesh>(null);
  
  const { curve, points } = useMemo(() => {
    // Calculate midpoint elevated above earth radius for realistic ballistic trajectory arc
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const distance = start.distanceTo(end);
    const altitude = radius + distance * 0.28;
    mid.normalize().multiplyScalar(altitude);
    
    const bezier = new THREE.QuadraticBezierCurve3(start, mid, end);
    return {
      curve: bezier,
      points: bezier.getPoints(50)
    };
  }, [start, end, radius]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = (clock.getElapsedTime() * 0.35 + (start.x + start.y)) % 1;
      const pos = curve.getPoint(t);
      pulseRef.current.position.copy(pos);
    }
  });

  return (
    <group>
      {/* Curved Arc Line */}
      {/* @ts-ignore */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color={color} transparent opacity={0.35} linewidth={1} />
      </line>

      {/* Traveling Data Pulse */}
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};

// Pulsing Hub Pin Marker
const HubMarker = ({ hub, radius }: { hub: typeof GLOBAL_HUBS[0]; radius: number }) => {
  const pos = useMemo(() => latLonToVector3(hub.lat, hub.lon, radius), [hub.lat, hub.lon, radius]);
  const normal = useMemo(() => pos.clone().normalize(), [pos]);
  const beaconRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 2 + hub.lat;
    if (ringRef.current) {
      const scale = 1 + (Math.sin(t) + 1) * 0.6;
      ringRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={pos}>
      {/* Core Node Beacon */}
      <mesh ref={beaconRef}>
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshBasicMaterial color={hub.color} />
      </mesh>

      {/* Pulsing Radar Ring */}
      <mesh ref={ringRef} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)}>
        <ringGeometry args={[0.04, 0.065, 24]} />
        <meshBasicMaterial color={hub.color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Vertical Telemetry Stem */}
      <mesh position={[normal.x * 0.08, normal.y * 0.08, normal.z * 0.08]}>
        <boxGeometry args={[0.006, 0.006, 0.16]} />
        <meshBasicMaterial color={hub.color} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// Atmospheric Glow Corona Shader (Rayleigh scattering outer glow halo)
const AtmosphereGlow = ({ radius }: { radius: number }) => {
  const atmosphereShader = useMemo(() => ({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);
        gl_FragColor = vec4(0.0, 0.65, 1.0, 1.0) * intensity * 1.8;
      }
    `
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[radius * 1.15, 64, 64]} />
      <shaderMaterial
        vertexShader={atmosphereShader.vertexShader}
        fragmentShader={atmosphereShader.fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  );
};

// Realistic Planet Earth 3D System
const RealisticEarth = () => {
  const earthRadius = 2.4;
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  // Load realistic high-resolution Earth textures (day, normal, specular, clouds, night lights)
  const [colorMap, normalMap, specularMap, cloudsMap, lightsMap] = useTexture([
    '/textures/planets/earth_atmos_2048.jpg',
    '/textures/planets/earth_normal_2048.jpg',
    '/textures/planets/earth_specular_2048.jpg',
    '/textures/planets/earth_clouds_2048.png',
    '/textures/planets/earth_lights_2048.png',
  ]);

  // Pre-calculate 3D positions for connections
  const hubVectors = useMemo(() => {
    return GLOBAL_HUBS.map(h => latLonToVector3(h.lat, h.lon, earthRadius));
  }, [earthRadius]);

  // Real Earth axial tilt: 23.4 degrees (0.409 rad)
  const earthTilt = 23.4 * (Math.PI / 180);

  useFrame((_, delta) => {
    // Realistic constant planetary rotation
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.05;
    }
    // Atmospheric clouds rotate independently slightly faster for dynamic weather
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.065;
    }
  });

  return (
    <group rotation={[0, 0, earthTilt]}>
      {/* Atmospheric Rayleigh Glow Corona */}
      <AtmosphereGlow radius={earthRadius} />

      {/* Rotating Planetary Group */}
      <group ref={earthGroupRef}>
        {/* 1. Earth Terrestrial Surface */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[earthRadius, 64, 64]} />
          <meshStandardMaterial
            map={colorMap}
            normalMap={normalMap}
            normalScale={new THREE.Vector2(0.85, 0.85)}
            roughnessMap={specularMap}
            roughness={0.55}
            metalness={0.1}
            emissiveMap={lightsMap}
            emissive={new THREE.Color('#ffc87a')}
            emissiveIntensity={0.55}
          />
        </mesh>

        {/* 2. Atmospheric Cloud Sphere */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[earthRadius * 1.012, 64, 64]} />
          <meshStandardMaterial
            map={cloudsMap}
            transparent
            opacity={0.82}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>

        {/* 3. Global Enterprise Risk Hub Markers */}
        {GLOBAL_HUBS.map((hub, idx) => (
          <HubMarker key={idx} hub={hub} radius={earthRadius} />
        ))}

        {/* 4. Telemetry Arcs & Data Flow */}
        {CONNECTIONS.map(([startIdx, endIdx], idx) => (
          <NetworkArc
            key={idx}
            start={hubVectors[startIdx]}
            end={hubVectors[endIdx]}
            radius={earthRadius}
            color={GLOBAL_HUBS[startIdx].color}
          />
        ))}

        {/* 5. Subtle High-Tech Equatorial Latitude Grid Rings */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[earthRadius * 1.28, 0.008, 16, 120]} />
          <meshBasicMaterial color="#00C6FF" transparent opacity={0.25} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0.3, 0]}>
          <torusGeometry args={[earthRadius * 1.45, 0.006, 16, 120]} />
          <meshBasicMaterial color="#7A5CFF" transparent opacity={0.2} />
        </mesh>
      </group>
    </group>
  );
};

// Enterprise HUD Panel Overlay in 3D Space
const EnterpriseHUDPanel = ({ position, label, sector, color, metrics }: any) => {
  return (
    <Html position={position} center distanceFactor={14} zIndexRange={[100, 0]}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(7, 20, 35, 0.85) 0%, rgba(13, 33, 58, 0.7) 100%)',
        border: `1px solid ${color}55`,
        borderLeft: `4px solid ${color}`,
        borderRadius: '14px',
        padding: '1.1rem 1.3rem',
        width: '260px',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: `0 12px 40px rgba(0,0,0,0.6), 0 0 24px ${color}25`,
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.65rem',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${color}30`, paddingBottom: '0.4rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.5)' }}>{sector}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.5px', color: '#ffffff' }}>{label}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} className="live-pulse" />
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: color, letterSpacing: '1px' }}>ONLINE</span>
          </div>
        </div>
        
        <div style={{ display: 'grid', gap: '0.4rem' }}>
          {metrics.map((m: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.65)' }}>{m.name}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: m.color || '#00C6FF' }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulseGlow {
          0% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
          100% { opacity: 0.4; transform: scale(0.9); }
        }
        .live-pulse { animation: pulseGlow 1.8s infinite ease-in-out; }
      `}</style>
    </Html>
  );
};

// Fallback Loader while photorealistic textures initialize
const EarthFallback = () => {
  return (
    <Html center>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        color: '#00C6FF',
        fontFamily: 'monospace'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(0,198,255,0.2)',
          borderTop: '3px solid #00C6FF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <span style={{ fontSize: '0.85rem', letterSpacing: '2px' }}>CALIBRATING GEOSPATIAL INTELLIGENCE...</span>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </Html>
  );
};

export const AIIntelligenceCore = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        <color attach="background" args={['transparent']} />

        {/* Atmospheric Space Lighting & Realistic Directional Sun Shadows */}
        {/* Deep space ambient base */}
        <ambientLight intensity={0.18} color="#0d1b2a" />
        
        {/* Powerful Sun Directional Light casting realistic planetary day/night terminator & shadows */}
        <directionalLight
          position={[12, 6, 9]}
          intensity={3.6}
          color="#fffaf0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        
        {/* Earth Horizon Specular Rim Light */}
        <directionalLight position={[-10, -5, -6]} intensity={0.35} color="#3b82f6" />
        
        {/* Space Starfield */}
        <Stars radius={120} depth={60} count={3000} factor={4} saturation={1} fade speed={0.8} />

        <Suspense fallback={<EarthFallback />}>
          <RealisticEarth />
          
          {/* Futuristic Enterprise Floating Telemetry Panels */}
          <EnterpriseHUDPanel
            position={[4.2, 2.0, 0.5]}
            sector="Finance & Liquidity"
            label="Global Capital Risk"
            color="#00FFB2"
            metrics={[
              { name: 'Cross-Border Inflow', value: '$84.2B/hr' },
              { name: 'Fraud Vulnerability', value: '0.002%', color: '#00FFB2' },
              { name: 'AI Threat Guard', value: 'ARMED' }
            ]}
          />

          <EnterpriseHUDPanel
            position={[4.6, -1.8, 1.2]}
            sector="Cyber Defense"
            label="Quantum Firewall"
            color="#00C6FF"
            metrics={[
              { name: 'Zero-Day Vectors', value: '0 Detected', color: '#00FFB2' },
              { name: 'Active Interceptions', value: '14,892/s' },
              { name: 'Integrity Rating', value: '99.99%' }
            ]}
          />

          <EnterpriseHUDPanel
            position={[-4.5, 1.6, -0.5]}
            sector="Sovereign & Govt"
            label="Disaster Sentinel"
            color="#FFC857"
            metrics={[
              { name: 'Atmospheric Scan', value: 'Nominal' },
              { name: 'Seismic Prediction', value: 'Stable (98.4%)' },
              { name: 'Supply Corridor', value: 'OPTIMAL' }
            ]}
          />

          <EnterpriseHUDPanel
            position={[-4.3, -2.1, 0.8]}
            sector="Healthcare & Biotech"
            label="Epidemic Intelligence"
            color="#FF4D6D"
            metrics={[
              { name: 'Outbreak Vector', value: 'Isolated' },
              { name: 'Vaccine Cold-Chain', value: '100.0%' },
              { name: 'Hospital Readiness', value: 'Grade A+' }
            ]}
          />
        </Suspense>

        {/* User Interactive Orbit Controls with Smooth Damping */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          autoRotate={true}
          autoRotateSpeed={0.6}
          rotateSpeed={0.7}
          enableDamping={true}
          dampingFactor={0.06}
          maxPolarAngle={Math.PI / 1.35}
          minPolarAngle={Math.PI / 3.5}
        />
      </Canvas>
    </div>
  );
};
