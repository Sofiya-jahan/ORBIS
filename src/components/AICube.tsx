import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Stars } from '@react-three/drei';
import * as THREE from 'three';

const CubeFace = ({ position, rotation, label, color }: any) => {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[2.8, 2.8]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <planeGeometry args={[2.8, 2.8]} />
        <meshBasicMaterial color={color} wireframe />
      </mesh>
      <Html transform distanceFactor={1.5} position={[0, 0, 0.1]} occlude>
        <div style={{
          width: '240px', height: '240px', background: 'rgba(7, 26, 46, 0.8)',
          border: `1px solid ${color}`, borderRadius: '12px', padding: '1rem',
          display: 'flex', flexDirection: 'column', color: 'white',
          boxShadow: `0 0 20px ${color}40`, backdropFilter: 'blur(10px)'
        }}>
          <h4 style={{ fontSize: '14px', color, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {label}
          </h4>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
            {/* Fake animated bar chart */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                style={{ 
                  flex: 1, backgroundColor: color, opacity: 0.8,
                  height: `${Math.random() * 80 + 20}%`,
                  transition: 'height 0.5s ease'
                }} 
              />
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
};

const HolographicCube = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
      groupRef.current.rotation.y += 0.005;
      
      // Gentle floating
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  const dist = 1.4;

  return (
    <group ref={groupRef}>
      <CubeFace position={[0, 0, dist]} rotation={[0, 0, 0]} label="Global Risk Index" color="#00D4FF" />
      <CubeFace position={[0, 0, -dist]} rotation={[0, Math.PI, 0]} label="Cyber Threats" color="#FF4D6D" />
      <CubeFace position={[dist, 0, 0]} rotation={[0, Math.PI / 2, 0]} label="Financial Models" color="#00C853" />
      <CubeFace position={[-dist, 0, 0]} rotation={[0, -Math.PI / 2, 0]} label="Operational Status" color="#FFC107" />
      <CubeFace position={[0, dist, 0]} rotation={[-Math.PI / 2, 0, 0]} label="Healthcare Analytics" color="#7C4DFF" />
      <CubeFace position={[0, -dist, 0]} rotation={[Math.PI / 2, 0, 0]} label="System Architecture" color="#FFFFFF" />
    </group>
  );
};

export const AICube = () => {
  return (
    <div style={{ width: '100%', height: '500px', position: 'relative' }}>
      <Canvas camera={{ position: [4, 3, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00D4FF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7C4DFF" />
        
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
        
        <HolographicCube />
        
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
};
