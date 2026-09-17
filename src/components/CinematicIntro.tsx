import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Volume2, VolumeX, FastForward, Shield, Brain, Activity, Globe2, Lock } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

// -------------------------------------------------------------
// Cinematic Web Audio Engine (Interstellar/Blade Runner Synth)
// -------------------------------------------------------------
class CinematicAudioDirector {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneOsc: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.08, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Deep cinematic sub-bass drone
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(45, this.ctx.currentTime);
      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      this.subOsc.connect(subGain);
      subGain.connect(this.masterGain);
      this.subOsc.start();

      // Atmospheric spatial hum
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(110, this.ctx.currentTime);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);
      const droneGain = this.ctx.createGain();
      droneGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      this.droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.masterGain);
      this.droneOsc.start();
    } catch (e) {
      console.log('WebAudio initialization delayed or unsupported');
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.08, this.ctx.currentTime, 0.1);
    }
  }

  playImpact() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      
      // Massive cinematic sub drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(90, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 1.8);
      
      gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 2.2);

      // Shimmer layer
      const shimmer = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(880, this.ctx.currentTime);
      shimmer.frequency.exponentialRampToValueAtTime(220, this.ctx.currentTime + 1.2);
      sGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      sGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
      shimmer.connect(sGain);
      sGain.connect(this.ctx.destination);
      shimmer.start();
      shimmer.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }

  playDataPulse(freq: number = 750) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }

  stop() {
    if (this.ctx) {
      try { this.ctx.close(); } catch (e) {}
      this.ctx = null;
    }
  }
}

// -------------------------------------------------------------
// 3D Visual Scenes for Sequential Intro Phases
// -------------------------------------------------------------
const Intro3DScene = ({ phase }: { phase: number }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Generate 2500 dynamic particles
  const { positions, colors } = useMemo(() => {
    const count = 2500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cCyan = new THREE.Color('#00E5FF');
    const cPurple = new THREE.Color('#7B61FF');
    const cBlue = new THREE.Color('#4F8CFF');

    for (let i = 0; i < count; i++) {
      const radius = 1.0 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const chosen = Math.random() > 0.6 ? cCyan : (Math.random() > 0.3 ? cPurple : cBlue);
      col[i * 3] = chosen.r;
      col[i * 3 + 1] = chosen.g;
      col[i * 3 + 2] = chosen.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * (phase >= 3 ? 0.3 : 0.08);
      pointsRef.current.rotation.x = t * 0.04;
      if (phase === 1) {
        pointsRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.1);
      }
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.4;
      coreRef.current.rotation.z += delta * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.5;
      ringRef.current.rotation.y = t * 0.3;
    }
  });

  return (
    <group>
      {/* 1. Global Interconnected Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={phase >= 4 ? 0.05 : 0.04} vertexColors transparent opacity={0.85} />
      </points>

      {/* 2. Holographic Neural Lattice Core (Emerges Phase 4+) */}
      {phase >= 4 && (
        <group ref={coreRef}>
          <mesh>
            <icosahedronGeometry args={[1.5, 2]} />
            <meshStandardMaterial
              color="#00E5FF"
              emissive="#0044ff"
              emissiveIntensity={1.2}
              wireframe
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.9, 0]} />
            <meshStandardMaterial color="#7B61FF" emissive="#7B61FF" emissiveIntensity={1.5} roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* 3. Orbiting Energy Rings */}
      {phase >= 3 && (
        <mesh ref={ringRef}>
          <torusGeometry args={[3.2, 0.015, 16, 120]} />
          <meshBasicMaterial color="#00CFFF" transparent opacity={0.4} />
        </mesh>
      )}
    </group>
  );
};

export const CinematicIntro: React.FC<IntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const audioDirector = useRef<CinematicAudioDirector | null>(null);

  // 18-Second Hollywood-Grade Storyboard Sequence
  useEffect(() => {
    const sequence = [
      { delay: 1800, nextPhase: 1 }, // Phase 0 -> 1: Spark of Intelligence
      { delay: 2600, nextPhase: 2 }, // Phase 1 -> 2: Neural Network Genesis
      { delay: 2800, nextPhase: 3 }, // Phase 2 -> 3: Global Planetary Topology
      { delay: 2800, nextPhase: 4 }, // Phase 3 -> 4: Multi-Sector Risk Signal Ingestion
      { delay: 3000, nextPhase: 5 }, // Phase 4 -> 5: Holographic AI Core Convergence
      { delay: 3200, nextPhase: 6 }, // Phase 5 -> 6: IPRAP Grand Identity Reveal
      { delay: 2600, nextPhase: 7 }, // Phase 6 -> 7: Smooth Fade to Landing
    ];

    let currentStep = 0;
    const runStep = () => {
      if (currentStep < sequence.length) {
        const step = sequence[currentStep];
        const timer = setTimeout(() => {
          setPhase(step.nextPhase);
          
          // Sound synchronization
          if (step.nextPhase === 6) {
            audioDirector.current?.playImpact();
          } else if (step.nextPhase >= 2 && step.nextPhase <= 5) {
            audioDirector.current?.playDataPulse(450 + step.nextPhase * 120);
          }
          
          currentStep++;
          if (step.nextPhase === 7) {
            handleComplete();
          } else {
            runStep();
          }
        }, step.delay);
        return timer;
      }
    };

    const initialTimer = runStep();
    return () => clearTimeout(initialTimer);
  }, []);

  // Initialize Web Audio on mount
  useEffect(() => {
    audioDirector.current = new CinematicAudioDirector();
    audioDirector.current.init();
    audioDirector.current.setMuted(isMuted);

    return () => {
      audioDirector.current?.stop();
      audioDirector.current = null;
    };
  }, []);

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      audioDirector.current?.setMuted(next);
      return next;
    });
  };

  const handleComplete = () => {
    setIsFadingOut(true);
    audioDirector.current?.stop();
    setTimeout(() => {
      onComplete();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={isFadingOut ? { opacity: 0, scale: 1.08, filter: 'blur(20px)' } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          backgroundColor: '#050D16',
          color: 'white',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-family, system-ui, sans-serif)',
        }}
      >
        {/* 3D WebGL Canvas Layer */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Canvas camera={{ position: [0, 0, 7.5], fov: 45 }}>
            <ambientLight intensity={0.25} />
            <pointLight position={[10, 10, 10]} intensity={2.5} color="#00E5FF" />
            <pointLight position={[-10, -10, -10]} intensity={1.5} color="#7B61FF" />
            <Stars radius={120} depth={60} count={3500} factor={4} fade speed={1.2} />
            <Intro3DScene phase={phase} />
          </Canvas>
        </div>

        {/* Cinematic Vignette & Ambient Radial Glow */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', background: 'radial-gradient(circle at center, rgba(0,229,255,0.06) 0%, rgba(5,13,22,0.95) 80%)' }} />

        {/* Top Control Overlay (Audio & Skip) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '2rem 3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00E5FF', boxShadow: '0 0 12px #00E5FF' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              COGNITIVE SEQUENCE // INITIALIZING
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button
              onClick={toggleMute}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: isMuted ? 'rgba(255,255,255,0.4)' : '#00E5FF',
                borderRadius: '20px',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
              }}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isMuted ? 'UNMUTE AUDIO' : 'CINEMATIC SOUND ON'}</span>
            </button>

            <button
              onClick={handleComplete}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                borderRadius: '20px',
                padding: '0.5rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backdropFilter: 'blur(10px)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <span>ENTER PLATFORM</span>
              <FastForward size={14} />
            </button>
          </div>
        </div>

        {/* Center Dynamic Storyboard Elements */}
        <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', maxWidth: '1000px', padding: '0 2rem' }}>
          
          {/* Phase 0 & 1: Genesis Spark */}
          <AnimatePresence>
            {(phase === 0 || phase === 1) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: 0.8 }}
              >
                <div style={{ fontSize: '0.85rem', letterSpacing: '6px', textTransform: 'uppercase', color: '#00E5FF', fontWeight: 700, marginBottom: '1rem' }}>
                  A NEW PARADIGM OF FORESIGHT
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '2px', color: 'white' }}>
                  Connecting Global Risk Signals
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2 & 3: Global Neural Topology */}
          <AnimatePresence>
            {(phase === 2 || phase === 3) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8 }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(123,97,255,0.15)', border: '1px solid rgba(123,97,255,0.4)', marginBottom: '1.5rem' }}>
                  <Globe2 size={16} color="#7B61FF" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '2px', color: '#7B61FF' }}>
                    1.8 BILLION TRANSACTIONS / SEC
                  </span>
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '1px', lineHeight: 1.15 }}>
                  Synthesizing Planetary Intelligence
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 4: Multi-Sector Threat Convergence */}
          <AnimatePresence>
            {phase === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.6 }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  {[
                    { icon: Brain, label: 'Capital Risk' },
                    { icon: Shield, label: 'Cyber Defense' },
                    { icon: Activity, label: 'Biotech & Health' },
                    { icon: Lock, label: 'Sovereign Grid' }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '10px',
                        background: 'rgba(7,20,35,0.8)',
                        border: '1px solid rgba(0,229,255,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem',
                        color: '#00E5FF',
                        fontWeight: 600,
                      }}
                    >
                      {React.createElement(item.icon, { size: 16 })}
                      {item.label}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800 }}>
                  Autonomous Threat Neutralization Active
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 5 & 6: IPRAP Grand Reveal */}
          <AnimatePresence>
            {(phase === 5 || phase === 6) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(15px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div style={{
                  display: 'inline-block',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '8px',
                  color: '#00E5FF',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                  textShadow: '0 0 20px rgba(0,229,255,0.6)'
                }}>
                  INTELLIGENT PREDICTIVE RISK ANALYTICS PLATFORM
                </div>

                <h1 style={{
                  fontSize: '6.5rem',
                  fontWeight: 900,
                  letterSpacing: '6px',
                  margin: '0 0 1.5rem 0',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #00E5FF 50%, #7B61FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 60px rgba(0,229,255,0.4)',
                }}>
                  IPRAP
                </h1>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', marginBottom: '2.5rem' }}>
                  {['PREDICT.', 'PREVENT.', 'PROTECT.'].map((word, idx) => (
                    <motion.span
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.2 }}
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 800,
                        letterSpacing: '5px',
                        color: idx === 0 ? '#00E5FF' : (idx === 1 ? '#00FFB2' : '#7B61FF'),
                        textShadow: '0 0 15px currentColor',
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.06, boxShadow: '0 0 40px rgba(0,229,255,0.6)' }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleComplete}
                  style={{
                    padding: '1.2rem 3.5rem',
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #00E5FF 0%, #4F8CFF 100%)',
                    color: '#050D16',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 10px 30px rgba(0,229,255,0.35)',
                  }}
                >
                  Enter Platform
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Bottom Sequence Progress Bar */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'rgba(255,255,255,0.1)',
          zIndex: 10,
        }}>
          <div
            style={{
              height: '100%',
              width: `${(phase / 6) * 100}%`,
              background: 'linear-gradient(90deg, #00E5FF, #7B61FF)',
              boxShadow: '0 0 12px #00E5FF',
              transition: 'width 0.8s ease',
            }}
          />
        </div>

      </motion.div>
    </AnimatePresence>
  );
};
