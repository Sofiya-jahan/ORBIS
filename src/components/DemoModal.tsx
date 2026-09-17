import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, Sphere, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, Volume2, VolumeX, X, Maximize, Minimize, Brain, Shield, Activity, Database, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
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
      
      // Ambient enterprise drone
      this.oscDrone = this.ctx.createOscillator();
      this.gainDrone = this.ctx.createGain();
      this.oscDrone.type = 'sine';
      this.oscDrone.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A hum
      this.gainDrone.gain.setValueAtTime(0.04, this.ctx.currentTime);
      
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
      this.gainDrone.gain.setTargetAtTime(muted ? 0 : 0.04, this.ctx.currentTime, 0.1);
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
      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
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
// Chapter 1 3D Scene: Global Ingestion & Earth Hologram
// -------------------------------------------------------------
const DemoEarthScene = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  const [colorMap, normalMap, cloudsMap] = useTexture([
    '/textures/planets/earth_atmos_2048.jpg',
    '/textures/planets/earth_normal_2048.jpg',
    '/textures/planets/earth_clouds_2048.png',
  ]);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.15;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.19;
  });

  return (
    <group rotation={[0, 0, 0.4]}>
      <mesh ref={earthRef}>
        <sphereGeometry args={[2.2, 48, 48]} />
        <meshStandardMaterial map={colorMap} normalMap={normalMap} roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.22, 48, 48]} />
        <meshStandardMaterial map={cloudsMap} transparent opacity={0.8} depthWrite={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[3.2, 0.015, 16, 100]} />
        <meshBasicMaterial color="#00C6FF" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0.4, 0]}>
        <torusGeometry args={[3.6, 0.012, 16, 100]} />
        <meshBasicMaterial color="#7A5CFF" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Chapter 2 3D Scene: Cognitive Neural Risk Constellation
// -------------------------------------------------------------
const NeuralTopologyScene = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const { positions, colors } = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c1 = new THREE.Color('#00C6FF');
    const c2 = new THREE.Color('#7A5CFF');
    const c3 = new THREE.Color('#FF4D6D');

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.2 + Math.random() * 1.5;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const chosenColor = Math.random() > 0.7 ? c3 : (Math.random() > 0.4 ? c1 : c2);
      col[i * 3] = chosenColor.r;
      col[i * 3 + 1] = chosenColor.g;
      col[i * 3 + 2] = chosenColor.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.12} vertexColors transparent opacity={0.9} />
      </points>
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial color="#0b1b36" wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Chapter 3 3D Scene: Quantum Threat Shield Matrix
// -------------------------------------------------------------
const ThreatShieldScene = () => {
  const shieldRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shieldRef.current) {
      shieldRef.current.rotation.y = t * 0.4;
      shieldRef.current.rotation.z = t * 0.25;
    }
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * 4) * 0.05;
      coreRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group>
      <mesh ref={coreRef}>
        <octahedronGeometry args={[1.6, 2]} />
        <meshStandardMaterial color="#00FFB2" emissive="#00FFB2" emissiveIntensity={0.6} wireframe={false} roughness={0.2} metalness={0.9} />
      </mesh>
      <mesh ref={shieldRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial color="#00C6FF" wireframe transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.2, 0.03, 16, 80]} />
        <meshBasicMaterial color="#00FFB2" transparent opacity={0.6} />
      </mesh>
    </group>
  );
};

// -------------------------------------------------------------
// Chapter 4 3D Scene: Executive Foresight Matrix
// -------------------------------------------------------------
const ExecutiveMatrixScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.1;
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <dodecahedronGeometry args={[2.0, 0]} />
        <meshStandardMaterial color="#7A5CFF" emissive="#3b1d96" emissiveIntensity={0.8} wireframe transparent opacity={0.7} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#00C6FF" emissive="#0077ff" emissiveIntensity={0.5} roughness={0.3} metalness={0.8} />
      </mesh>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<TelemetryAudioEngine | null>(null);

  const totalDuration = 60; // 60-second comprehensive demo

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
    { id: 0, time: 0, title: 'Autonomous Ingestion', subtitle: 'Global Telemetry & 1.8B Stream Processing', icon: Database, color: '#00C6FF' },
    { id: 1, time: 15, title: 'Neural Risk Topology', subtitle: 'Deep Bayesian Prediction & Graph Anomaly Engine', icon: Brain, color: '#7A5CFF' },
    { id: 2, time: 30, title: 'Autonomous Shield', subtitle: 'Quantum Cryptographic Threat Quarantine', icon: Shield, color: '#FF4D6D' },
    { id: 3, time: 45, title: 'Executive Foresight', subtitle: 'Enterprise Resilience & Compliance Verification', icon: Activity, color: '#00FFB2' },
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
    if (isAuthenticated) {
      if (organization && role) navigate('/dashboard');
      else navigate('/organization');
    } else {
      navigate('/login');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            backgroundColor: '#020610',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'var(--font-family, system-ui, sans-serif)',
          }}
        >
          {/* Top Bar Navigation */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            padding: '1.5rem 2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(2,6,16,0.95) 0%, transparent 100%)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0,198,255,0.2) 0%, rgba(122,92,255,0.2) 100%)',
                border: '1px solid rgba(0,198,255,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Zap size={22} color="#00C6FF" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800, letterSpacing: '1.5px' }}>
                    IPRAP PRODUCT EXPERIENCE
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(0,198,255,0.15)',
                    border: '1px solid rgba(0,198,255,0.4)',
                    color: '#00C6FF',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}>
                    4K REAL-TIME
                  </span>
                </div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                  Next-Gen Enterprise Risk Intelligence Architecture Showcase
                </div>
              </div>
            </div>

            {/* Top Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handleGetStarted}
                style={{
                  padding: '0.65rem 1.4rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00C6FF 0%, #0077ff 100%)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 20px rgba(0,198,255,0.3)',
                }}
              >
                Launch Platform <ChevronRight size={16} />
              </button>
              
              <button
                onClick={onClose}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* 3D Visual Simulation Stage */}
          <div style={{ flex: 1, position: 'relative' }}>
            {/* Real-time 3D Canvas Background */}
            <div style={{ position: 'absolute', inset: 0 }}>
              <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 8, 8]} intensity={3.0} />
                <directionalLight position={[-10, -5, -6]} intensity={0.4} color="#7A5CFF" />
                <Stars radius={80} count={2500} factor={3} fade speed={1} />
                
                <React.Suspense fallback={null}>
                  {currentChapter === 0 && <DemoEarthScene />}
                  {currentChapter === 1 && <NeuralTopologyScene />}
                  {currentChapter === 2 && <ThreatShieldScene />}
                  {currentChapter === 3 && <ExecutiveMatrixScene />}
                </React.Suspense>
              </Canvas>
            </div>

            {/* Dynamic Real-time HUD Telemetry Overlays */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', padding: '6rem 3rem 8rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {/* Left Live Telemetry HUD Card */}
              <motion.div
                key={`left-${currentChapter}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: '360px',
                  background: 'rgba(7, 20, 35, 0.75)',
                  border: `1px solid ${chapters[currentChapter].color}55`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `0 20px 50px rgba(0,0,0,0.8), 0 0 30px ${chapters[currentChapter].color}20`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', borderBottom: `1px solid ${chapters[currentChapter].color}30`, paddingBottom: '0.75rem' }}>
                  <div style={{ padding: '8px', borderRadius: '8px', background: `${chapters[currentChapter].color}20`, border: `1px solid ${chapters[currentChapter].color}60` }}>
                    {React.createElement(chapters[currentChapter].icon, { size: 20, color: chapters[currentChapter].color })}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: chapters[currentChapter].color, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                      PHASE 0{currentChapter + 1} OF 04
                    </div>
                    <div style={{ fontSize: '1.15rem', color: 'white', fontWeight: 800 }}>
                      {chapters[currentChapter].title}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {chapters[currentChapter].subtitle}
                </div>

                {/* Chapter-Specific Live Metrics */}
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {currentChapter === 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Ingestion Velocity</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00C6FF' }}>1,842,910 tx/s</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Cross-Border Feeds</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>42 Global Nodes</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Packet Verification</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00C6FF' }}>Zero Latency Buffer</span>
                      </div>
                    </>
                  )}
                  {currentChapter === 1 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Bayesian Correlation</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#7A5CFF' }}>99.87% Accuracy</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Latent Vectors</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#FFC857' }}>14,200 Dimensions</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Anomaly Confidence</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>High (p &lt; 0.0001)</span>
                      </div>
                    </>
                  )}
                  {currentChapter === 2 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Interception Status</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>Auto-Isolated</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Quarantine Latency</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00C6FF' }}>4.2 ms</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Residual Risk Index</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>0.001% (Safe)</span>
                      </div>
                    </>
                  )}
                  {currentChapter === 3 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>ROI Impact</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>+$142M Loss Prevented</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Compliance Posture</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00C6FF' }}>SOC2 / ISO Compliant</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Autonomous Readiness</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>100% Armed</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Right Live Visual Graph HUD Card */}
              <motion.div
                key={`right-${currentChapter}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6 }}
                style={{
                  width: '320px',
                  background: 'rgba(7, 20, 35, 0.75)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  NEURAL COMPUTE STREAM
                </div>

                {/* Animated Bars */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '90px', marginBottom: '1rem', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  {[65, 80, 45, 95, 70, 88, 60, 92, 78, 100, 85, 90].map((val, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        height: `${val}%`,
                        background: `linear-gradient(to top, rgba(0,198,255,0.2), ${chapters[currentChapter].color})`,
                        borderRadius: '3px',
                        transition: 'height 0.4s ease',
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00FFB2', boxShadow: '0 0 10px #00FFB2' }} />
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace' }}>
                    EXECUTION LATENCY: 1.2ms
                  </span>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Bottom Interactive Video Controller & Chapter Timeline */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 30,
            padding: '1.5rem 2.5rem 2rem 2.5rem',
            background: 'linear-gradient(to top, rgba(2,6,16,0.98) 0%, rgba(2,6,16,0.8) 70%, transparent 100%)',
          }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
              
              {/* Interactive Scrubbable Progress Bar */}
              <div
                style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  position: 'relative',
                  marginBottom: '1.25rem',
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  handleSeek(ratio * totalDuration);
                }}
              >
                {/* Progress fill */}
                <div
                  style={{
                    height: '100%',
                    width: `${(currentTime / totalDuration) * 100}%`,
                    background: `linear-gradient(90deg, #00C6FF, #7A5CFF)`,
                    borderRadius: '3px',
                    boxShadow: '0 0 12px #00C6FF',
                    transition: 'width 0.1s linear',
                  }}
                />

                {/* Chapter Breakpoint Indicators */}
                {chapters.map((ch) => (
                  <div
                    key={ch.id}
                    style={{
                      position: 'absolute',
                      left: `${(ch.time / totalDuration) * 100}%`,
                      top: '-3px',
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
                {/* Left Controls: Play / Mute / Timer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <button
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                      audioRef.current?.playBeep(700, 0.05);
                    }}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                  >
                    {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" style={{ marginLeft: 2 }} />}
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
                      gap: '6px',
                    }}
                  >
                    {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{isMuted ? 'UNMUTE' : 'AUDIO SYNTH'}</span>
                  </button>

                  <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '0.95rem' }}>
                    0:{Math.floor(currentTime).toString().padStart(2, '0')} / 1:00
                  </span>
                </div>

                {/* Center: Interactive Chapter Selector Pills */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  {chapters.map((ch) => {
                    const isActive = currentChapter === ch.id;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => handleSeek(ch.time)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          background: isActive ? `${ch.color}22` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${isActive ? ch.color : 'rgba(255,255,255,0.1)'}`,
                          color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                        }}
                      >
                        <span style={{ color: ch.color, fontWeight: 700 }}>0{ch.id + 1}</span>
                        {ch.title}
                      </button>
                    );
                  })}
                </div>

                {/* Right: Fullscreen & Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00FFB2', fontSize: '0.75rem', letterSpacing: '1px', fontWeight: 700 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00FFB2', boxShadow: '0 0 8px #00FFB2' }} />
                    SYNTH PIPELINE ARMED
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.7)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
                  </button>
                </div>

              </div>

            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};
