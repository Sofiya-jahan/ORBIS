import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// Sector Intelligence Satellites orbiting the Quantum Core
// -------------------------------------------------------------
interface SatelliteNode {
  name: string;
  code: string;
  sector: string;
  radius: number;
  speed: number;
  yOffset: number;
  color: string;
  status: string;
  metric: string;
}

const SATELLITE_NODES: SatelliteNode[] = [
  { name: 'Capital Liquidity', code: 'FIN-01', sector: 'Central Banking', radius: 3.2, speed: 0.45, yOffset: 0.8, color: '#E5C07B', status: 'Optimal', metric: 'VaR 0.04%' },
  { name: 'Sovereign Power Grid', code: 'NRG-04', sector: 'Critical Infrastructure', radius: 3.8, speed: -0.35, yOffset: -0.6, color: '#10B981', status: 'Secured', metric: '99.999%' },
  { name: 'Autonomous Defense', code: 'DEF-07', sector: 'Aerospace & Sovereignty', radius: 4.4, speed: 0.28, yOffset: 1.2, color: '#00F2FE', status: 'Armed', metric: '0 Threat Delta' },
  { name: 'Bio-Clinical Matrix', code: 'MED-09', sector: 'Public Health', radius: 3.5, speed: -0.52, yOffset: -1.1, color: '#34D399', status: 'Calibrated', metric: '100% Ingress' },
  { name: 'Global Supply Transit', code: 'LOG-12', sector: 'Maritime Logistics', radius: 4.1, speed: 0.38, yOffset: 0.2, color: '#F59E0B', status: 'Monitored', metric: '14.2m Latency' },
];

// -------------------------------------------------------------
// Interactive 3D Orbiting Satellite with Data Beacons & Laser Links
// -------------------------------------------------------------
const OrbitingSatellite = ({ node, index }: { node: SatelliteNode; index: number }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * node.speed + (index * Math.PI * 2) / SATELLITE_NODES.length;
    const x = Math.cos(t) * node.radius;
    const z = Math.sin(t) * node.radius;
    const y = node.yOffset + Math.sin(t * 1.5) * 0.3;

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }

    if (pulseRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 3 + index) * 0.25;
      pulseRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Node Sphere */}
      <mesh 
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial 
          color={node.color} 
          emissive={node.color} 
          emissiveIntensity={hovered ? 2.8 : 1.4} 
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>

      {/* Outer Hologram Radar Ring */}
      <mesh ref={pulseRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.18, 0.25, 32]} />
        <meshBasicMaterial color={node.color} transparent opacity={0.65} side={THREE.DoubleSide} />
      </mesh>

      {/* Interactive HUD Readout */}
      <Html distanceFactor={8} zIndexRange={[100, 0]}>
        <div style={{
          transform: 'translate3d(14px, -18px, 0)',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
          opacity: hovered ? 1 : 0.88,
        }}>
          <div style={{
            background: 'rgba(8, 14, 18, 0.94)',
            border: `1px solid ${hovered ? '#FFFFFF' : 'rgba(16, 185, 129, 0.35)'}`,
            borderRadius: '8px',
            padding: '6px 12px',
            backdropFilter: 'blur(14px)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8), 0 0 15px rgba(16, 185, 129, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, boxShadow: `0 0 8px ${node.color}` }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Times New Roman', serif", letterSpacing: '0.5px' }}>
                {node.name}
              </span>
              <span style={{ fontSize: '0.62rem', color: '#E5C07B', fontFamily: "'Space Mono', monospace" }}>
                [{node.code}]
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>
              <span>STATUS: <span style={{ color: '#34D399', fontWeight: 700 }}>{node.status.toUpperCase()}</span></span>
              <span style={{ color: node.color, fontWeight: 700 }}>{node.metric}</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

// -------------------------------------------------------------
// Kinetic Multi-Axis Gyroscopic Rings
// -------------------------------------------------------------
const GyroscopicManifold = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.15;
      ring1.current.rotation.y = t * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = -t * 0.18;
      ring2.current.rotation.z = t * 0.25;
    }
    if (ring3.current) {
      ring3.current.rotation.x = t * 0.22;
      ring3.current.rotation.z = -t * 0.14;
    }
  });

  return (
    <group>
      {/* Outer Gyroscopic Ring 1 - Imperial Emerald */}
      <mesh ref={ring1}>
        <torusGeometry args={[2.7, 0.016, 16, 120]} />
        <meshStandardMaterial color="#10B981" emissive="#059669" emissiveIntensity={0.9} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Intermediate Telemetry Ring 2 - Sovereign Champagne Gold */}
      <mesh ref={ring2}>
        <torusGeometry args={[2.3, 0.014, 16, 120]} />
        <meshStandardMaterial color="#E5C07B" emissive="#D97706" emissiveIntensity={0.85} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Inner Accelerator Ring 3 - Electric Cyan */}
      <mesh ref={ring3}>
        <torusGeometry args={[1.9, 0.012, 16, 100]} />
        <meshStandardMaterial color="#00F2FE" emissive="#0284C7" emissiveIntensity={0.8} metalness={0.9} roughness={0.15} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Luminous Crystalline Polyhedron Core
// -------------------------------------------------------------
const QuantumCore = () => {
  const coreRef = useRef<THREE.Group>(null);
  const innerNucleusRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.25;
      coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.15;
    }
    if (innerNucleusRef.current) {
      const scale = 0.85 + Math.sin(t * 2.2) * 0.08;
      innerNucleusRef.current.scale.set(scale, scale, scale);
      innerNucleusRef.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group ref={coreRef}>
      {/* Outer Faceted Geometric Cage (Icosahedron) - Radiant Emerald */}
      <mesh>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={1.3}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Intermediate Glass Lattice (Octahedron) - Champagne Gold */}
      <mesh>
        <octahedronGeometry args={[1.05, 0]} />
        <meshPhysicalMaterial
          color="#E5C07B"
          transmission={0.82}
          opacity={0.75}
          transparent
          roughness={0.08}
          ior={1.6}
          thickness={0.5}
        />
      </mesh>

      {/* Inner Glowing Quantum Nucleus - Pure Platinum Luster */}
      <mesh ref={innerNucleusRef}>
        <dodecahedronGeometry args={[0.65, 0]} />
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#34D399"
          emissiveIntensity={2.8}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>

      {/* Radiant Point Light Emitter */}
      <pointLight color="#34D399" intensity={3.5} distance={7} decay={2} />
    </group>
  );
};

// -------------------------------------------------------------
// Quantum Vector Particles Cloud
// -------------------------------------------------------------
const VectorRiskParticles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const count = 1800;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cEmerald = new THREE.Color('#10B981');
    const cGold = new THREE.Color('#E5C07B');
    const cCyan = new THREE.Color('#00F2FE');
    const cWhite = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      const radius = 1.6 + Math.random() * 4.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const rand = Math.random();
      const chosen = rand > 0.6 ? cEmerald : (rand > 0.35 ? cGold : (rand > 0.15 ? cCyan : cWhite));
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }

    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.05;
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t;
      pointsRef.current.rotation.x = t * 0.5;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.75} />
    </points>
  );
};

// -------------------------------------------------------------
// Master 3D Autonomous AI Risk Intelligence Core Canvas
// -------------------------------------------------------------
export const AIIntelligenceCore: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      
      {/* Three.js Canvas Scene */}
      <Canvas
        camera={{ position: [0, 0.4, 7.2], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[8, 8, 8]} intensity={2.2} color="#FFFFFF" />
        <directionalLight position={[-8, -6, -6]} intensity={1.8} color="#10B981" />

        <Stars radius={100} depth={50} count={2500} factor={3} fade speed={0.6} />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          {/* Central Quantum Polyhedron Core */}
          <QuantumCore />

          {/* Concentric Gyroscopic Coordinate Rings */}
          <GyroscopicManifold />

          {/* 3D Orbiting Sovereign Sector Satellites */}
          {SATELLITE_NODES.map((node, idx) => (
            <OrbitingSatellite key={node.code} node={node} index={idx} />
          ))}

          {/* Flowing Vector Particles Field */}
          <VectorRiskParticles />
        </Float>
      </Canvas>

      {/* Floating Tactical Telemetry Overlay HUD */}
      <div style={{
        position: 'absolute',
        bottom: '2.5rem',
        right: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
        zIndex: 5
      }}>
        <div style={{
          background: 'rgba(8, 14, 18, 0.94)',
          border: '1px solid rgba(229, 192, 123, 0.35)',
          borderRadius: '14px',
          padding: '0.85rem 1.35rem',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(16, 185, 129, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#E5C07B', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Space Mono', monospace" }}>
              NEMOTRON-3 120B ENGINE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
              <span style={{ fontSize: '0.65rem', color: '#10B981', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                SYNAPSE LIVE
              </span>
            </div>
          </div>

          <div style={{ fontSize: '0.82rem', color: '#FFFFFF', fontFamily: "'Times New Roman', serif", fontWeight: 700 }}>
            Quantum Entropy Index: 0.014 bits &bull; Lattice Armed
          </div>
        </div>
      </div>

    </div>
  );
};

export default AIIntelligenceCore;
