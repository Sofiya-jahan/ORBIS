import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, Loader2, Fingerprint, Lock, Globe, ArrowRight, Shield, Activity, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// -------------------------------------------------------------
// 3D Planetary Threat Intelligence Globe for Login Right Pane
// -------------------------------------------------------------
const LoginEarthSentinel = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const [colorMap, normalMap, cloudsMap] = useTexture([
    '/textures/planets/earth_atmos_2048.jpg',
    '/textures/planets/earth_normal_2048.jpg',
    '/textures/planets/earth_clouds_2048.png',
  ]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.12;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.16;
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.5) * 0.05;
      ringRef.current.rotation.y = t * 0.2;
    }
  });

  return (
    <group rotation={[0, 0, 0.4]}>
      {/* Terrestrial Surface */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[2.2, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.8, 0.8)}
          roughness={0.6}
          metalness={0.15}
        />
      </mesh>

      {/* Cloud Atmosphere */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[2.22, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.8}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* High-Tech Orbital Security Coordinate Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.2, 0.015, 16, 120]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.35} />
      </mesh>
    </group>
  );
};

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated, organization, role } = useAuthStore();

  useEffect(() => {
    // If already fully authenticated and configured, allow dashboard access
    if (isAuthenticated && organization && role) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, organization, role, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      // Mandatory flow: proceed directly to Authentication Animation
      navigate('/authentication');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('demo@iprap.ai');
    setPassword('enterprise2026');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#050D16',
      color: 'white',
      overflow: 'hidden',
      fontFamily: 'var(--font-family, system-ui, sans-serif)',
    }}>
      
      {/* LEFT SIDE - Ultra-Crisp Enterprise Login Console (42%) */}
      <div style={{
        flex: '0 0 45%',
        minWidth: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'rgba(8, 21, 34, 0.95)',
        backdropFilter: 'blur(30px)',
        borderRight: '1px solid rgba(0, 229, 255, 0.15)',
        boxShadow: '30px 0 70px rgba(0,0,0,0.7)',
        padding: '3rem',
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          {/* Header Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 229, 255, 0.4)',
            }}>
              <ShieldCheck size={26} color="#050D16" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>
                IPRAP
              </div>
              <div style={{ fontSize: '0.7rem', color: '#00E5FF', letterSpacing: '1.5px', fontWeight: 700, textTransform: 'uppercase' }}>
                ENTERPRISE RISK TERMINAL
              </div>
            </div>
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>
            {isSignUp ? 'Provision Node' : 'Command Access'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            {isSignUp
              ? 'Register institutional security credentials into the global network.'
              : 'Enter cryptographically verified credentials to establish quantum session.'}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                backgroundColor: 'rgba(255, 77, 109, 0.12)',
                border: '1px solid rgba(255, 77, 109, 0.4)',
                color: '#FF4D6D',
                padding: '0.9rem 1.2rem',
                borderRadius: '12px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                fontWeight: 600,
              }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Institutional Email
              </label>
              <input
                type="email"
                placeholder="executive@institution.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00E5FF';
                  e.target.style.background = 'rgba(0,229,255,0.06)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Decryption Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    style={{ fontSize: '0.75rem', color: '#00E5FF', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Quick Demo Autofill
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: '100%',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#00E5FF';
                  e.target.style.background = 'rgba(0,229,255,0.06)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.15)';
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                }}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,229,255,0.5)' }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1.15rem',
                borderRadius: '12px',
                marginTop: '0.75rem',
                background: 'linear-gradient(135deg, #00E5FF 0%, #4F8CFF 100%)',
                color: '#050D16',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 800,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 10px 25px rgba(0,229,255,0.3)',
              }}
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : (
                <>
                  {isSignUp ? 'Provision Secure Account' : 'Authenticate Session'}
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>
            {isSignUp ? 'Already registered node?' : 'Unregistered institutional entity?'}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              style={{ color: '#00E5FF', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              {isSignUp ? 'Sign in' : 'Provision Access'}
            </button>
          </div>

        </div>
      </div>

      {/* RIGHT SIDE - 3D Planetary Threat Radar & Live Intelligence (55%) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Three.js Globe Canvas */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }}>
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 6, 8]} intensity={3.0} />
            <directionalLight position={[-10, -5, -6]} intensity={0.35} color="#7B61FF" />
            <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.8} />
            <React.Suspense fallback={null}>
              <LoginEarthSentinel />
            </React.Suspense>
          </Canvas>
        </div>

        {/* HUD Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          {/* Top Live Badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              background: 'rgba(8, 21, 34, 0.8)',
              border: '1px solid rgba(0,229,255,0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
              backdropFilter: 'blur(15px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00FFB2', boxShadow: '0 0 10px #00FFB2' }} />
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', fontWeight: 700 }}>
                GLOBAL RADAR: 42 NODES ONLINE
              </span>
            </div>
          </div>

          {/* Bottom Telemetry Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              maxWidth: '520px',
              background: 'rgba(8, 21, 34, 0.85)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(0,229,255,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <Cpu size={20} color="#00E5FF" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '2px', color: '#00E5FF', textTransform: 'uppercase' }}>
                COGNITIVE RISK RADAR // V4.0
              </span>
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.75rem', color: 'white' }}>
              Planetary Autonomous Defense
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Continuous real-time neural surveillance predicting vulnerabilities across banking liquidity, sovereign power grids, and enterprise cloud networks.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Threat Interception</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00FFB2', fontFamily: 'monospace' }}>99.98% Active</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Response Latency</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00E5FF', fontFamily: 'monospace' }}>&lt; 2.4 ms</div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  );
};

export default Login;
