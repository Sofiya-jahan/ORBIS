import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AIIntelligenceCore } from '../components/AIIntelligenceCore';
import { DemoModal } from '../components/DemoModal';
import { Play, Shield, Activity, Cpu, ArrowUpRight, Globe, Lock, Terminal, Zap } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const AnimatedMetric = ({ value, label, suffix = '', precision = 2 }: { value: string; label: string; suffix?: string; precision?: number }) => {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    let start = 0;
    const target = parseFloat(value.replace(/,/g, ''));
    const duration = 2200;
    const steps = 60;
    const stepVal = target / steps;

    const interval = setInterval(() => {
      start += stepVal;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setDisplay(start % 1 === 0 ? start.toString() : start.toFixed(precision));
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value, precision]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <div style={{
        fontSize: '2.8rem',
        fontWeight: 900,
        fontFamily: 'monospace',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #00E5FF 60%, #4F8CFF 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 25px rgba(0,229,255,0.4)',
        letterSpacing: '-1px',
      }}>
        {display}{suffix}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.65)',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '2px',
      }}>
        {label}
      </div>
    </div>
  );
};

export const Landing = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { isAuthenticated, organization, role } = useAuthStore();

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleInitialize = () => {
    if (isAuthenticated) {
      if (organization && role) {
        navigate('/dashboard');
      } else {
        navigate('/organization');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: '#050D16',
        color: 'white',
        overflowX: 'hidden',
        minHeight: '100vh',
        position: 'relative',
        fontFamily: 'var(--font-family, system-ui, sans-serif)',
      }}
    >
      {/* 4K Real-time 3D AI Product Experience Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />

      {/* Volumetric Scanlines & Dynamic Ambient Glow */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 65% 50%, rgba(0,229,255,0.08) 0%, transparent 60%)',
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: 'transform 0.2s ease-out',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 25% 75%, rgba(123,97,255,0.05) 0%, transparent 50%)',
        }} />
        <div className="command-grid" />
      </div>

      {/* Top Enterprise Command Header */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        padding: '2rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00E5FF 0%, #7B61FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0,229,255,0.4)',
          }}>
            <Shield size={24} color="#050D16" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '2px', fontFamily: 'var(--font-heading)' }}>
              IPRAP
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '1.5px', color: '#00E5FF', textTransform: 'uppercase' }}>
              AUTONOMOUS RISK OPERATING SYSTEM
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{
            background: 'rgba(8, 21, 34, 0.7)',
            border: '1px solid rgba(0,229,255,0.25)',
            borderRadius: '20px',
            padding: '0.5rem 1.25rem',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FFB2', boxShadow: '0 0 10px #00FFB2' }} className="pulse-beacon" />
            <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
              FEED: 1.84M TX/S // QUANTUM LATTICE ARMED
            </span>
          </div>

          <button
            onClick={() => setShowDemo(true)}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#00E5FF'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            <Play size={14} fill="white" />
            PRODUCT SHOWCASE
          </button>
        </div>
      </header>

      {/* Main Command Center Stage */}
      <main style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1, alignItems: 'center' }}>
        
        {/* LEFT PANE: Mission Typography & High-Impact Directives (48%) */}
        <div style={{ flex: '0 0 50%', padding: '0 4rem 0 5rem', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            
            {/* Mission Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', marginBottom: '1.5rem' }}>
              <Zap size={14} color="#00E5FF" />
              <span style={{ color: '#00E5FF', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                GLOBAL SOVEREIGN & CAPITAL DEFENSE
              </span>
            </div>

            {/* Monumental Headline */}
            <h1 style={{
              fontSize: '4.8rem',
              fontWeight: 900,
              fontFamily: 'var(--font-heading)',
              lineHeight: '1.05',
              letterSpacing: '-1.5px',
              margin: '0 0 1.5rem 0',
            }}>
              The Operating <br />
              System for <br />
              <span style={{
                background: 'linear-gradient(135deg, #00E5FF 0%, #4F8CFF 50%, #7B61FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 40px rgba(0,229,255,0.3)',
              }}>
                Predictive Risk
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(255,255,255,0.65)',
              maxWidth: '520px',
              lineHeight: '1.65',
              marginBottom: '2.5rem',
              fontWeight: 400,
            }}>
              Anticipate geopolitical anomalies, liquidity crises, and cyber incursions before they manifest. IPRAP transforms chaos into actionable foresight for institutional leaders.
            </p>

            {/* Action Directives */}
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(0,229,255,0.5)' }}
                whileTap={{ scale: 0.96 }}
                onClick={handleInitialize}
                style={{
                  padding: '1.2rem 2.8rem',
                  fontSize: '1rem',
                  fontWeight: 800,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #00E5FF 0%, #4F8CFF 100%)',
                  color: '#050D16',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0,229,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                INITIALIZE COMMAND <ArrowUpRight size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowDemo(true)}
                style={{
                  padding: '1.2rem 2.2rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  borderRadius: '12px',
                  background: 'rgba(8, 21, 34, 0.6)',
                  border: '1px solid rgba(0,229,255,0.3)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backdropFilter: 'blur(15px)',
                }}
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(0,229,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={12} fill="#00E5FF" color="#00E5FF" />
                </div>
                WATCH DEMO
              </motion.button>
            </div>

            {/* Live Real-time Telemetry Metrics */}
            <div style={{
              display: 'flex',
              gap: '3.5rem',
              marginTop: '4rem',
              borderTop: '1px solid rgba(255,255,255,0.12)',
              paddingTop: '2.5rem',
            }}>
              <AnimatedMetric value="99.98" suffix="%" label="Interception Rate" />
              <AnimatedMetric value="1.84" suffix="B" label="Records Processed/s" />
              <AnimatedMetric value="420" suffix="+" label="Institutional Nodes" precision={0} />
            </div>

          </motion.div>
        </div>

        {/* RIGHT PANE: Living 3D Geospatial Intelligence Core (52%) */}
        <div style={{ flex: '0 0 50%', height: '100vh', position: 'relative' }}>
          <AIIntelligenceCore />
        </div>

      </main>

      <style>{`
        .command-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(0,229,255,0.035) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(0,229,255,0.035) 1px, transparent 1px);
          background-size: 60px 60px;
          mask-image: radial-gradient(circle at 60% 50%, black 0%, transparent 80%);
          -webkit-mask-image: radial-gradient(circle at 60% 50%, black 0%, transparent 80%);
        }
        @keyframes pulseGlow {
          0% { opacity: 0.4; }
          50% { opacity: 1; }
          100% { opacity: 0.4; }
        }
        .pulse-beacon { animation: pulseGlow 1.8s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default Landing;
