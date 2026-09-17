import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars, Float, Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const EnterprisePanel = ({ position, label, color, metrics }: any) => {
  return (
    <Html position={position} center distanceFactor={15} zIndexRange={[100, 0]} occlude="blending">
      <div style={{
        background: 'rgba(7, 20, 35, 0.65)',
        border: `1px solid ${color}`,
        borderRadius: '16px',
        padding: '1.25rem',
        width: '280px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: `0 8px 32px ${color}30`,
        color: 'white',
        fontFamily: 'var(--font-family, system-ui, sans-serif)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        opacity: 0.9,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${color}40`, paddingBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: color }}>{label}</span>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }} className="pulse-dot" />
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {metrics.map((m: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>{m.name}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        .pulse-dot { animation: pulse 2s infinite; }
      `}</style>
    </Html>
  );
};

const CoreSystem = () => {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.2;
    }
    if (ringRef.current && ringRef2.current) {
      ringRef.current.rotation.x = t * 0.2;
      ringRef.current.rotation.y = t * 0.3;
      ringRef2.current.rotation.x = -t * 0.15;
      ringRef2.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central AI Core */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1.5, 64, 64]}>
          <MeshDistortMaterial 
            color="#00C6FF" 
            emissive="#0055FF" 
            emissiveIntensity={2} 
            distort={0.4} 
            speed={2} 
            roughness={0.2}
            metalness={0.8}
            wireframe={false}
          />
        </Sphere>
      </Float>

      {/* Glowing Rings */}
      <mesh ref={ringRef}>
        <torusGeometry args={[2.5, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00C6FF" transparent opacity={0.4} />
      </mesh>
      <mesh ref={ringRef2}>
        <torusGeometry args={[3.2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#7A5CFF" transparent opacity={0.3} />
      </mesh>

      {/* Orbiting Panels */}
      <group rotation={[0, 0, 0]}>
        <EnterprisePanel 
          position={[4, 1.5, 0]} label="Healthcare" color="#00C6FF"
          metrics={[{name: 'Live ECG', value: 'Monitoring'}, {name: 'Patient Risk', value: 'Low'}]}
        />
      </group>
      <group rotation={[0, Math.PI / 3, 0]}>
        <EnterprisePanel 
          position={[4.5, -1, 2]} label="Finance" color="#00FFB2"
          metrics={[{name: 'Fraud Detection', value: 'Active'}, {name: 'Transactions', value: '14.2M/s'}]}
        />
      </group>
      <group rotation={[0, (Math.PI / 3) * 2, 0]}>
        <EnterprisePanel 
          position={[3.8, 2, -2]} label="Government" color="#FFC857"
          metrics={[{name: 'Threat Level', value: 'Elevated'}, {name: 'Disaster Predict', value: 'Scanning'}]}
        />
      </group>
      <group rotation={[0, Math.PI, 0]}>
        <EnterprisePanel 
          position={[4.2, -1.5, -1]} label="Cyber Security" color="#FF4D6D"
          metrics={[{name: 'Firewall', value: 'Blocking'}, {name: 'Live Attacks', value: '4,102'}]}
        />
      </group>
      <group rotation={[0, (Math.PI / 3) * 4, 0]}>
        <EnterprisePanel 
          position={[4.8, 1, 1.5]} label="Manufacturing" color="#7A5CFF"
          metrics={[{name: 'IoT Sensors', value: 'Optimal'}, {name: 'Machine Health', value: '99.8%'}]}
        />
      </group>
    </group>
  );
};

export const AIIntelligenceCore = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#00C6FF" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#7A5CFF" />
        <pointLight position={[0, 0, 5]} intensity={1} color="#ffffff" />
        
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={1} fade speed={1} />
        
        <CoreSystem />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};
