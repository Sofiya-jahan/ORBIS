import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ShieldCheck, Loader2, Fingerprint, Lock, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const preLoginSequence = [
  { text: "Establishing Secure Connection...", icon: Globe },
  { text: "Verifying Authentication Protocols...", icon: Fingerprint },
  { text: "Initializing Encrypted Session...", icon: Lock }
];

const LoginBackground = () => {
  const globeRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.1;
      globeRef.current.rotation.x = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00C6FF" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#7A5CFF" />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={globeRef} position={[0, 0, 0]}>
          <sphereGeometry args={[2.5, 64, 64]} />
          <meshStandardMaterial 
            color="#071423" 
            emissive="#00C6FF" 
            emissiveIntensity={0.2} 
            wireframe={true} 
            transparent 
            opacity={0.3} 
          />
        </mesh>
        
        {/* Inner solid core */}
        <Sphere args={[2.4, 32, 32]}>
          <MeshDistortMaterial color="#000" distort={0.2} speed={2} roughness={1} />
        </Sphere>
      </Float>
    </>
  );
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sequenceStep, setSequenceStep] = useState(0);
  const [showLogin, setShowLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/landing';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (sequenceStep < preLoginSequence.length) {
      const timer = setTimeout(() => {
        setSequenceStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setShowLogin(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [sequenceStep]);

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
      navigate('/authentication');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#071423', color: 'white', overflow: 'hidden' }}>
      
      {/* LEFT SIDE - Glass Login Form (40%) */}
      <div style={{ 
        flex: '0 0 45%', minWidth: '500px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 10,
        backgroundColor: 'rgba(7, 20, 35, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '20px 0 50px rgba(0,0,0,0.5)'
      }}>
        
        <AnimatePresence mode="wait">
          {!showLogin ? (
            <motion.div
              key="sequence"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
            >
              {sequenceStep < preLoginSequence.length && (() => {
                const CurrentIcon = preLoginSequence[sequenceStep].icon;
                return (
                  <motion.div
                    key={sequenceStep}
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
                  >
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                      <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed #00C6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,198,255,0.2)' }}>
                        <CurrentIcon size={32} color="#00C6FF" />
                      </div>
                    </motion.div>
                    <h3 style={{ fontFamily: 'monospace', fontSize: '1.1rem', color: '#00C6FF', letterSpacing: '1px' }}>
                      {preLoginSequence[sequenceStep].text}
                    </h3>
                  </motion.div>
                );
              })()}
            </motion.div>
          ) : (
            <motion.div 
              key="login"
              initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              style={{ width: '100%', maxWidth: '420px', padding: '2.5rem' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'linear-gradient(135deg, #00C6FF 0%, #7A5CFF 100%)', borderRadius: '12px', padding: '12px', boxShadow: '0 0 20px rgba(0,198,255,0.4)' }}>
                    <ShieldCheck size={28} color="white" />
                  </div>
                  <span style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>IPRAP</span>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', lineHeight: '1.2', fontFamily: 'var(--font-heading)' }}>
                  {isSignUp ? 'Initialize Access' : 'Secure Authorization'}
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>
                  {isSignUp ? 'Register credentials to join the platform' : 'Enter your credentials to access the platform'}
                </p>
              </div>

              {error && (
                <div style={{ backgroundColor: 'rgba(255, 77, 109, 0.1)', border: '1px solid rgba(255, 77, 109, 0.3)', color: '#FF4D6D', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Work Email</label>
                  <input 
                    type="email" placeholder="name@enterprise.com" 
                    value={email} onChange={(e) => setEmail(e.target.value)} required 
                    style={{
                      width: '100%', padding: '1.25rem', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.2s',
                      backdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.background = 'rgba(0,198,255,0.05)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: '600', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>Decryption Key (Password)</label>
                    {!isSignUp && <a href="#" style={{ fontSize: '0.875rem', color: '#00C6FF', textDecoration: 'none' }}>Forgot password?</a>}
                  </div>
                  <input 
                    type="password" placeholder="••••••••" 
                    value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6}
                    style={{
                      width: '100%', padding: '1.25rem', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white', fontSize: '1rem', outline: 'none', transition: 'all 0.2s',
                      backdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => { e.target.style.borderColor = '#00C6FF'; e.target.style.background = 'rgba(0,198,255,0.05)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.background = 'rgba(255,255,255,0.03)'; }}
                  />
                </div>

                {!isSignUp && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" id="remember" style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: '#00C6FF' }} />
                    <label htmlFor="remember" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>Maintain session for 30 days</label>
                  </div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,198,255,0.4)' }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={loading} 
                  style={{ 
                    width: '100%', padding: '1.25rem', borderRadius: '12px', marginTop: '1rem',
                    background: 'linear-gradient(135deg, #00C6FF 0%, #0077ff 100%)', color: 'white',
                    border: 'none', fontSize: '1.1rem', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : (isSignUp ? 'Authorize Node' : 'Authenticate')}
                </motion.button>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', margin: '2.5rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ padding: '0 1rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Or connect via SSO</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button style={{ 
                  flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  Google
                </button>
                <button style={{ 
                  flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}>
                  Microsoft
                </button>
              </div>

              <p style={{ textAlign: 'center', marginTop: '2.5rem', fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)' }}>
                {isSignUp ? 'Already have an account?' : "Unregistered node?"}{' '}
                <button 
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
                  style={{ color: '#00C6FF', textDecoration: 'none', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {isSignUp ? 'Sign in' : 'Request Access'}
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT SIDE - Cinematic Enterprise Visualization (55%) */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* ThreeJS Background */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Canvas camera={{ position: [0, 0, 5] }}>
            <LoginBackground />
          </Canvas>
        </div>

        {/* Floating UI Overlay */}
        <div style={{ position: 'absolute', inset: 0, padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', pointerEvents: 'none' }}>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.5 }}
            style={{ width: '350px', background: 'rgba(7,20,35,0.6)', border: '1px solid rgba(0,198,255,0.3)', borderRadius: '16px', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '2rem' }}
          >
            <div style={{ color: '#00C6FF', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '1rem' }}>SYSTEM STATUS</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Nodes Online</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00FFB2' }}>99.9%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Threat Level</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#00C6FF' }}>NORMAL</span>
            </div>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 1 }}
            style={{ fontSize: '5rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '1rem', maxWidth: '800px', lineHeight: 1.1, textShadow: '0 0 40px rgba(0,198,255,0.3)' }}
          >
            Global <br/>Risk Command.
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}
            style={{ width: '80px', height: '4px', background: '#00C6FF', marginBottom: '2rem', boxShadow: '0 0 10px #00C6FF' }}
          />

          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2 }}
            style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.7)', maxWidth: '500px', fontWeight: 300, lineHeight: 1.6 }}
          >
            Secure, cognitive monitoring of cross-sector physical and digital assets in real-time.
          </motion.p>
        </div>

      </div>
    </div>
  );
};

export default Login;
