import React, { useRef, useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Minimize, Brain, Shield, Activity, Database, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// -------------------------------------------------------------
// Web Audio Telemetry Synthesizer (Zero External Dependencies)
// -------------------------------------------------------------
class TelemetryAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private oscDrone: OscillatorNode | null = null;
  private gainDrone: GainNode | null = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.oscDrone = this.ctx.createOscillator();
      this.gainDrone = this.ctx.createGain();
      this.oscDrone.type = 'sine';
      this.oscDrone.frequency.setValueAtTime(55, this.ctx.currentTime);
      this.gainDrone.gain.setValueAtTime(0.035, this.ctx.currentTime);
      
      this.oscDrone.connect(this.gainDrone);
      this.gainDrone.connect(this.ctx.destination);
      this.oscDrone.start();
    } catch (e) {
      console.log('WebAudio not supported');
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.gainDrone && this.ctx) {
      this.gainDrone.gain.setTargetAtTime(muted ? 0 : 0.035, this.ctx.currentTime, 0.1);
    }
  }

  playBeep(freq: number = 880, duration: number = 0.08) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  stop() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

// -------------------------------------------------------------
// Chapter 1 3D Scene: Photorealistic Earth Hologram & Global Telemetry
// -------------------------------------------------------------
const EarthTextureGlobe = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const lightsRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  const [atmosMap, normalMap, cloudsMap, lightsMap, specMap] = useTexture([
    '/textures/planets/earth_atmos_2048.jpg',
    '/textures/planets/earth_normal_2048.jpg',
    '/textures/planets/earth_clouds_2048.png',
    '/textures/planets/earth_lights_2048.png',
    '/textures/planets/earth_specular_2048.jpg',
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.12;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.16;
    if (lightsRef.current) lightsRef.current.rotation.y += delta * 0.12;
    if (ring1Ref.current) ring1Ref.current.rotation.z += delta * 0.15;
    if (ring2Ref.current) ring2Ref.current.rotation.z -= delta * 0.18;
  });

  return (
    <group rotation={[0.25, 0, 0.2]}>
      {/* Photorealistic Earth Surface */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.0, 64, 64]} />
        <meshStandardMaterial
          map={atmosMap}
          normalMap={normalMap}
          roughnessMap={specMap}
          roughness={0.65}
          metalness={0.05}
        />
      </mesh>

      {/* Night City Lights Layer */}
      <mesh ref={lightsRef}>
        <sphereGeometry args={[2.008, 64, 64]} />
        <meshBasicMaterial
          map={lightsMap}
          blending={THREE.AdditiveBlending}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Volumetric Atmospheric Clouds */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.03, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.65}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric Fresnel Soft Glow */}
      <mesh>
        <sphereGeometry args={[2.14, 48, 48]} />
        <meshBasicMaterial
          color="#00C6FF"
          transparent
          opacity={0.09}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Equatorial Telemetry Orbit 1 */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.65, 0.012, 16, 120]} />
        <meshBasicMaterial color="#00E599" transparent opacity={0.65} />
      </mesh>

      {/* Equatorial Telemetry Orbit 2 */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3.5, 0.3, 0]}>
        <torusGeometry args={[2.85, 0.01, 16, 120]} />
        <meshBasicMaterial color="#00C6FF" transparent opacity={0.45} />
      </mesh>

      {/* Orbiting Satellite Data Beacons */}
      <mesh position={[2.5, 0.8, 0.2]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#00FFB2" />
      </mesh>
      <mesh position={[-2.3, -1.2, 0.5]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#00C6FF" />
      </mesh>
    </group>
  );
};

// Procedural Fallback if texture is loading
const EarthProceduralFallback = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0.2]}>
      <mesh>
        <sphereGeometry args={[2.0, 48, 48]} />
        <meshStandardMaterial color="#072032" emissive="#00C6FF" emissiveIntensity={0.25} roughness={0.4} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.02, 32, 32]} />
        <meshStandardMaterial color="#00E599" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

const Chapter1EarthScene = () => (
  <Suspense fallback={<EarthProceduralFallback />}>
    <EarthTextureGlobe />
  </Suspense>
);

// -------------------------------------------------------------
// Chapter 2 3D Scene: Cognitive Neural Synapse Network
// -------------------------------------------------------------
const Chapter2NeuralScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  const nucleusRef = useRef<THREE.Mesh>(null);
  const innerSphereRef = useRef<THREE.Mesh>(null);

  const { points, lineGeometry } = useMemo(() => {
    const nodeCount = 96;
    const coords: THREE.Vector3[] = [];
    const linePositions: number[] = [];

    // Distribute nodes in a balanced spherical cluster
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.4 + Math.random() * 0.75;
      coords.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ));
    }

    // Connect close neighbors with synaptic links
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const dist = coords[i].distanceTo(coords[j]);
        if (dist < 1.1) {
          linePositions.push(coords[i].x, coords[i].y, coords[i].z);
          linePositions.push(coords[j].x, coords[j].y, coords[j].z);
        }
      }
    }

    const flatPoints = new Float32Array(coords.length * 3);
    for (let i = 0; i < coords.length; i++) {
      flatPoints[i * 3] = coords[i].x;
      flatPoints[i * 3 + 1] = coords[i].y;
      flatPoints[i * 3 + 2] = coords[i].z;
    }

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

    return { points: flatPoints, lineGeometry: lineGeom };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.16;
      groupRef.current.rotation.x += delta * 0.06;
    }
    if (nucleusRef.current) {
      nucleusRef.current.rotation.y -= delta * 0.18;
      nucleusRef.current.rotation.z += delta * 0.1;
    }
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y += delta * 0.22;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Synaptic Laser Network Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#8B5CF6" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </lineSegments>

      {/* Neural Synapse Glowing Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} color="#00E5FF" transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </points>

      {/* Inner Solid Cognitive Nucleus (Bioluminescent Depth) */}
      <mesh ref={innerSphereRef}>
        <sphereGeometry args={[0.88, 32, 32]} />
        <meshStandardMaterial
          color="#15062E"
          emissive="#6D28D9"
          emissiveIntensity={0.8}
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Pulsating Quantum Grid Shell */}
      <mesh ref={nucleusRef}>
        <icosahedronGeometry args={[1.22, 1]} />
        <meshStandardMaterial
          color="#3B0764"
          emissive="#A855F7"
          emissiveIntensity={0.85}
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Internal Quantum Pulsar Light */}
      <pointLight color="#A855F7" intensity={2.4} distance={6} />
    </group>
  );
};

// -------------------------------------------------------------
// Chapter 3 3D Scene: Translucent Quantum Shield Matrix
// -------------------------------------------------------------
const Chapter3ShieldScene = () => {
  const outerShieldRef = useRef<THREE.Mesh>(null);
  const midShieldRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (outerShieldRef.current) {
      outerShieldRef.current.rotation.y = t * 0.22;
      outerShieldRef.current.rotation.z = t * 0.12;
    }
    if (midShieldRef.current) {
      midShieldRef.current.rotation.y = -t * 0.18;
      midShieldRef.current.rotation.x = t * 0.1;
    }
    if (coreRef.current) {
      const s = 1 + Math.sin(t * 3) * 0.04;
      coreRef.current.scale.set(s, s, s);
      coreRef.current.rotation.y = t * 0.35;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.25;
    }
  });

  return (
    <group>
      {/* Inner Levitating Quantum Crystal Core */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.05, 0]} />
        <meshStandardMaterial
          color="#00FFB2"
          emissive="#00C48C"
          emissiveIntensity={0.85}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Intermediate Glassmorphic Forcefield Dodecahedron */}
      <mesh ref={midShieldRef}>
        <dodecahedronGeometry args={[1.65, 0]} />
        <meshPhysicalMaterial
          color="#00E5FF"
          transmission={0.88}
          roughness={0.1}
          opacity={0.5}
          transparent
          ior={1.4}
        />
      </mesh>

      {/* Outer Geodesic Hexagonal Quarantine Shell */}
      <mesh ref={outerShieldRef}>
        <icosahedronGeometry args={[2.05, 1]} />
        <meshStandardMaterial
          color="#00FFB2"
          emissive="#008855"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Equatorial Shield Energy Ring - Fits within viewport */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.2, 0.015, 16, 90]} />
        <meshBasicMaterial color="#00FFB2" transparent opacity={0.7} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Chapter 4 3D Scene: Executive Foresight Gyroscopic Manifold
// -------------------------------------------------------------
const Chapter4ForesightScene = () => {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);
  const ring3 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const beacon1 = useRef<THREE.Mesh>(null);
  const beacon2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.14;
      ring1.current.rotation.y = t * 0.2;
    }
    if (ring2.current) {
      ring2.current.rotation.y = -t * 0.16;
      ring2.current.rotation.z = t * 0.22;
    }
    if (ring3.current) {
      ring3.current.rotation.x = t * 0.18;
      ring3.current.rotation.z = -t * 0.13;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.28;
      coreRef.current.rotation.x = Math.sin(t * 0.5) * 0.15;
    }
    if (beacon1.current) {
      beacon1.current.position.x = Math.cos(t * 0.8) * 1.5;
      beacon1.current.position.z = Math.sin(t * 0.8) * 1.5;
    }
    if (beacon2.current) {
      beacon2.current.position.y = Math.cos(t * 0.6) * 1.4;
      beacon2.current.position.x = Math.sin(t * 0.6) * 1.4;
    }
  });

  return (
    <group>
      {/* Outer Gyro Ring 1 - Royal Electric Blue */}
      <mesh ref={ring1}>
        <torusGeometry args={[1.95, 0.018, 16, 120]} />
        <meshStandardMaterial color="#1554E8" emissive="#2E9BF8" emissiveIntensity={0.85} metalness={0.92} roughness={0.12} />
      </mesh>

      {/* Intermediate Telemetry Ring 2 - Primary Purple */}
      <mesh ref={ring2}>
        <torusGeometry args={[1.62, 0.016, 16, 120]} />
        <meshStandardMaterial color="#4148F1" emissive="#7A48FF" emissiveIntensity={0.8} metalness={0.95} roughness={0.1} />
      </mesh>

      {/* Inner Accelerator Ring 3 - Highlight Cyan */}
      <mesh ref={ring3}>
        <torusGeometry args={[1.32, 0.014, 16, 100]} />
        <meshStandardMaterial color="#6AE7F7" emissive="#2E9BF8" emissiveIntensity={0.75} metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Center Faceted Diamond Core - Radiant Sky Blue */}
      <mesh ref={coreRef}>
        <octahedronGeometry args={[0.92, 0]} />
        <meshStandardMaterial
          color="#2E9BF8"
          emissive="#1554E8"
          emissiveIntensity={0.75}
          roughness={0.15}
          metalness={0.92}
        />
      </mesh>

      {/* Orbiting Executive Satellites */}
      <mesh ref={beacon1}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      <mesh ref={beacon2}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#00FFB2" />
      </mesh>

      {/* Internal Luminous Emitter */}
      <pointLight color="#34D399" intensity={2.6} distance={6} />
    </group>
  );
};

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated, organization, role } = useAuthStore();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isChaosActive, setIsChaosActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<TelemetryAudioEngine | null>(null);

  const totalDuration = 60; // 60-second comprehensive demo

  const handleSimulateChaos = () => {
    if (isChaosActive) return;
    setIsChaosActive(true);
    audioRef.current?.playBeep(1200, 0.15);

    setTimeout(() => {
      audioRef.current?.playBeep(1040, 0.1);
    }, 1500);

    setTimeout(() => {
      setIsChaosActive(false);
      audioRef.current?.playBeep(880, 0.08);
    }, 3200);
  };

  // Initialize audio synth
  useEffect(() => {
    if (isOpen) {
      audioRef.current = new TelemetryAudioEngine();
      audioRef.current.init();
      audioRef.current.setMuted(isMuted);
    }
    return () => {
      audioRef.current?.stop();
      audioRef.current = null;
    };
  }, [isOpen]);

  useEffect(() => {
    audioRef.current?.setMuted(isMuted);
  }, [isMuted]);

  // Playback timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= totalDuration) {
            return 0; // loop
          }
          // Periodic telemetry audio chirp
          if (Math.floor(prev * 2) % 6 === 0) {
            audioRef.current?.playBeep(600 + Math.random() * 400, 0.05);
          }
          return +(prev + 0.1).toFixed(1);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, totalDuration]);

  // Current Active Chapter based on timestamp
  const currentChapter = useMemo(() => {
    if (currentTime < 15) return 0;
    if (currentTime < 30) return 1;
    if (currentTime < 45) return 2;
    return 3;
  }, [currentTime]);

  const chapters = [
    { id: 0, time: 0, title: 'Autonomous Ingestion', subtitle: 'Global Telemetry & 1.8B Stream Processing', icon: Database, color: '#2E9BF8' },
    { id: 1, time: 15, title: 'Neural Risk Topology', subtitle: 'Deep Bayesian Prediction & Graph Anomaly Engine', icon: Brain, color: '#7A48FF' },
    { id: 2, time: 30, title: 'Autonomous Shield', subtitle: 'Quantum Cryptographic Threat Quarantine', icon: Shield, color: '#6AE7F7' },
    { id: 3, time: 45, title: 'Executive Foresight', subtitle: 'Enterprise Resilience & Compliance Verification', icon: Activity, color: '#8671F9' },
  ];

  const handleSeek = (time: number) => {
    setCurrentTime(time);
    audioRef.current?.playBeep(920, 0.08);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleGetStarted = () => {
    onClose();
    navigate('/organization');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: '#040F18',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
            boxSizing: 'border-box',
          }}
        >
          {/* Top Bar Navigation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            padding: '1.25rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(4, 15, 24, 0.95) 0%, rgba(4, 15, 24, 0.6) 70%, transparent 100%)',
            backdropFilter: 'blur(10px)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 198, 255, 0.2) 100%)',
                border: '1px solid rgba(0, 229, 153, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 15px rgba(0, 229, 153, 0.2)',
              }}>
                <Zap size={22} color="#00E599" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    color: '#FFFFFF',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
                  }}>
                    ORBIS PRODUCT EXPERIENCE
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(0, 229, 153, 0.12)',
                    border: '1px solid rgba(0, 229, 153, 0.35)',
                    color: '#00E599',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '0.75px',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    4K REAL-TIME
                  </span>
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.75rem', letterSpacing: '0.2px', marginTop: '2px' }}>
                  Next-Gen Enterprise Risk Intelligence Architecture Showcase
                </div>
              </div>
            </div>

            {/* Top Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <button
                onClick={handleGetStarted}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00E599 0%, #00C6FF 100%)',
                  border: 'none',
                  color: '#040F18',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.3px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 20px rgba(0, 229, 153, 0.3)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Launch Platform <ChevronRight size={15} />
              </button>
              
              <button
                onClick={onClose}
                aria-label="Close modal"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.16)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* 3D Visual Simulation Stage */}
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <Canvas camera={{ position: [0, 0, 7.2], fov: 45 }}>
                <ambientLight intensity={0.65} />
                <directionalLight position={[10, 8, 8]} intensity={1.1} />
                <directionalLight position={[-10, -5, -6]} intensity={0.5} color="#00C6FF" />
                <pointLight position={[0, 0, 0]} intensity={1.2} distance={7} color="#00E599" />
                <Stars radius={70} count={2200} factor={2.5} fade speed={0.8} />
                
                {currentChapter === 0 && <Chapter1EarthScene />}
                {currentChapter === 1 && <Chapter2NeuralScene />}
                {currentChapter === 2 && <Chapter3ShieldScene />}
                {currentChapter === 3 && <Chapter4ForesightScene />}
              </Canvas>
            </div>

            {/* Dynamic Real-time HUD Telemetry Overlays */}
            <div style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              padding: '5rem 2.5rem 8.5rem 2.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}>
              
              {/* Left Live Telemetry HUD Card */}
              <motion.div
                key={`left-${currentChapter}`}
                initial={{ opacity: 0, x: -25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '340px',
                  maxHeight: 'calc(100vh - 200px)',
                  background: 'rgba(7, 20, 35, 0.84)',
                  border: `1px solid ${chapters[currentChapter].color}40`,
                  borderRadius: '14px',
                  padding: '1.25rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `0 15px 40px rgba(0,0,0,0.7), 0 0 25px ${chapters[currentChapter].color}15`,
                  pointerEvents: 'auto'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '0.85rem',
                  borderBottom: `1px solid ${chapters[currentChapter].color}25`,
                  paddingBottom: '0.75rem',
                }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: `${chapters[currentChapter].color}18`,
                    border: `1px solid ${chapters[currentChapter].color}50`,
                  }}>
                    {React.createElement(chapters[currentChapter].icon, { size: 18, color: chapters[currentChapter].color })}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.68rem',
                      color: chapters[currentChapter].color,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>
                      PHASE 0{currentChapter + 1} OF 04
                    </div>
                    <div style={{
                      fontSize: '1.1rem',
                      color: 'white',
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
                    }}>
                      {chapters[currentChapter].title}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.45, marginBottom: '1rem' }}>
                  {chapters[currentChapter].subtitle}
                </div>

                {/* Chapter-Specific Live Metrics */}
                <div style={{ display: 'grid', gap: '0.65rem' }}>
                  {currentChapter === 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Ingestion Velocity</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isChaosActive ? '#EF4444' : '#00C6FF' }}>
                          {isChaosActive ? '3,892,100 tx/s (+111%)' : '1,842,910 tx/s'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cross-Border Feeds</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00FFB2' }}>42 Global Nodes</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Packet Verification</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isChaosActive ? '#FCD34D' : '#00C6FF' }}>
                          {isChaosActive ? 'Auto-Scaling Active' : 'Zero Latency Buffer'}
                        </span>
                      </div>
                    </>
                  )}
                  {currentChapter === 1 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Bayesian Correlation</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#7A5CFF' }}>99.87% Accuracy</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Latent Vectors</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#FFC857' }}>
                          {isChaosActive ? '24,500 Dimensions (Deep Trace)' : '14,780 Dimensions'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Anomaly Confidence</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isChaosActive ? '#F87171' : '#00FFB2' }}>
                          {isChaosActive ? 'Critical (p < 0.000001)' : 'High (p < 0.0001)'}
                        </span>
                      </div>
                    </>
                  )}
                  {currentChapter === 2 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Interception Status</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00FFB2' }}>
                          {isChaosActive ? 'Quarantine Locked' : 'Auto-Isolated'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Quarantine Latency</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00C6FF' }}>
                          {isChaosActive ? '2.1 ms (Accelerated)' : '4.2 ms'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Residual Risk Index</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00FFB2' }}>0.000% (Neutralized)</span>
                      </div>
                    </>
                  )}
                  {currentChapter === 3 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>ROI Impact</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00FFB2' }}>
                          {isChaosActive ? '+$186M Loss Prevented' : '+$142M Loss Prevented'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Compliance Posture</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00C6FF' }}>SOC2 / ISO Compliant</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Autonomous Readiness</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#00FFB2' }}>100% Armed</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Interactive Chaos Simulation Button */}
                <button
                  onClick={handleSimulateChaos}
                  disabled={isChaosActive}
                  style={{
                    marginTop: '1rem',
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    background: isChaosActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    border: `1px solid ${isChaosActive ? '#EF4444' : `${chapters[currentChapter].color}55`}`,
                    color: isChaosActive ? '#FCA5A5' : '#FFFFFF',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: isChaosActive ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontFamily: "'Space Grotesk', sans-serif",
                    transition: 'all 0.2s',
                    boxShadow: isChaosActive ? '0 0 15px rgba(239, 68, 68, 0.3)' : 'none'
                  }}
                >
                  <Zap size={13} className={isChaosActive ? 'animate-pulse' : ''} />
                  {isChaosActive ? 'AUTONOMOUS INTERCEPT IN PROGRESS...' : 'INJECT CHAOS TEST TELEMETRY'}
                </button>
              </motion.div>

              {/* Right Live Visual Graph HUD Card */}
              <motion.div
                key={`right-${currentChapter}`}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 25 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '300px',
                  maxHeight: 'calc(100vh - 200px)',
                  background: 'rgba(7, 20, 35, 0.84)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  padding: '1.25rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
                }}
              >
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.65)',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                  fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
                }}>
                  NEURAL COMPUTE STREAM
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '5px',
                  height: '80px',
                  marginBottom: '0.85rem',
                  padding: '6px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}>
                  {[65, 80, 45, 95, 70, 88, 60, 92, 78, 100, 85, 90].map((val, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: isChaosActive ? `${Math.min(100, val + 25)}%` : `${val}%`,
                        background: `linear-gradient(to top, rgba(0,198,255,0.2), ${isChaosActive ? '#EF4444' : chapters[currentChapter].color})`,
                        borderRadius: '2px',
                        transition: 'height 0.4s ease',
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: isChaosActive ? '#EF4444' : '#00FFB2', boxShadow: `0 0 8px ${isChaosActive ? '#EF4444' : '#00FFB2'}` }} />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', fontFamily: "'JetBrains Mono', monospace" }}>
                    EXECUTION LATENCY: {isChaosActive ? '2.1ms (Burst)' : '1.2ms'}
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Floating Glassmorphic Video Controller Dock */}
          <div style={{
            position: 'absolute',
            bottom: '1.25rem',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'min(1150px, calc(100vw - 3rem))',
            zIndex: 35,
            background: 'rgba(6, 16, 24, 0.88)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '0.85rem 1.4rem',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 229, 153, 0.08)',
            boxSizing: 'border-box',
          }}>
            {/* Interactive Scrubbable Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '5px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '3px',
                cursor: 'pointer',
                position: 'relative',
                marginBottom: '0.85rem',
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                handleSeek(ratio * totalDuration);
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${(currentTime / totalDuration) * 100}%`,
                  background: `linear-gradient(90deg, #00C6FF, #7A5CFF)`,
                  borderRadius: '3px',
                  boxShadow: '0 0 10px #00C6FF',
                  transition: 'width 0.1s linear',
                }}
              />

              {chapters.map((ch) => (
                <div
                  key={ch.id}
                  style={{
                    position: 'absolute',
                    left: `${(ch.time / totalDuration) * 100}%`,
                    top: '-3.5px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: currentTime >= ch.time ? ch.color : 'rgba(255,255,255,0.4)',
                    border: '2px solid #020610',
                    transform: 'translateX(-50%)',
                    boxShadow: currentTime >= ch.time ? `0 0 8px ${ch.color}` : 'none',
                  }}
                />
              ))}
            </div>

            {/* Controls Bar: Play, Mute, Chapters, Timer, Fullscreen */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              width: '100%',
            }}>
              
              {/* Left Controls: Play / Mute / Timer */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexShrink: 0,
              }}>
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    audioRef.current?.playBeep(700, 0.05);
                  }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  {isPlaying ? <Pause size={16} fill="white" /> : <Play size={16} fill="white" style={{ marginLeft: 2 }} />}
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isMuted ? 'rgba(255,255,255,0.4)' : '#00C6FF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    flexShrink: 0,
                  }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}>
                    {isMuted ? 'MUTED' : 'AUDIO'}
                  </span>
                </button>

                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.82rem',
                  flexShrink: 0,
                }}>
                  0:{Math.floor(currentTime).toString().padStart(2, '0')} / 1:00
                </span>
              </div>

              {/* Center: Interactive Chapter Selector Pills */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                flexShrink: 1,
                justifyContent: 'center',
              }}>
                {chapters.map((ch) => {
                  const isActive = currentChapter === ch.id;
                  const Icon = ch.icon;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => handleSeek(ch.time)}
                      style={{
                        padding: '0.38rem 0.75rem',
                        borderRadius: '6px',
                        background: isActive ? `${ch.color}22` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${isActive ? ch.color : 'rgba(255,255,255,0.1)'}`,
                        color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease',
                        boxShadow: isActive ? `0 0 12px ${ch.color}35` : 'none',
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
                      }}
                    >
                      <Icon size={12} color={ch.color} />
                      <span style={{ color: ch.color, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                        0{ch.id + 1}
                      </span>
                      <span>{ch.title}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Fullscreen & Status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                flexShrink: 0,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#00FFB2',
                  fontSize: '0.68rem',
                  letterSpacing: '0.75px',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
                  SYNTH PIPELINE ARMED
                </div>

                <button
                  onClick={toggleFullscreen}
                  aria-label="Toggle fullscreen"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '3px',
                  }}
                >
                  {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
                </button>
              </div>

            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DemoModal;
