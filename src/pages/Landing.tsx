import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EnterpriseCommandPreview, type SectorSimulationConfig } from '../components/EnterpriseCommandPreview';
import { DemoModal } from '../components/DemoModal';
import { 
  Play, Shield, Activity, Cpu, ArrowUpRight, Lock, 
  Zap, CheckCircle2, ChevronRight, Layers,
  ShieldCheck, Landmark, HeartPulse, Truck, RefreshCw, AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// -------------------------------------------------------------
// Interactive Sovereign Sectors for Real-Time Simulation Bar
// -------------------------------------------------------------
const SECTOR_SIMULATIONS: SectorSimulationConfig[] = [
  {
    id: 'banking',
    name: 'Central Banking & Capital',
    icon: Landmark,
    code: 'SEC-FIN-01',
    exposure: '4.2% Anomaly Delta',
    latency: '4.2 ms',
    containment: '99.99%',
    status: 'Nominal',
    headline: 'Autonomous Liquidity & Cross-Border Sovereign Stress Containment',
    details: 'Detecting synthetic volatility cascades, foreign exchange dislocations, and collateral haircut shocks in real time.'
  },
  {
    id: 'energy',
    name: 'Sovereign Energy & Power Grid',
    icon: Zap,
    code: 'SEC-NRG-02',
    exposure: '1.8% Harmonic Drift',
    latency: '11.2 ms',
    containment: '100.0%',
    status: 'Secured',
    headline: 'SCADA Intercept & Predictive Load Cascade Neutralization',
    details: 'Zero-day protection across 38,000 sub-stations and high-voltage transmission interconnects against cyber-physical drift.'
  },
  {
    id: 'healthcare',
    name: 'Metropolitan Healthcare',
    icon: HeartPulse,
    code: 'SEC-MED-03',
    exposure: '0.9% Ingress Variance',
    latency: '8.1 ms',
    containment: '99.98%',
    status: 'Calibrated',
    headline: 'Clinical Telemetry & Critical Biomedical Device Defense',
    details: 'Safeguarding ICU telemetry nodes, patient privacy vectors, and pharmaceutical cold-chain vaccine storage units.'
  },
  {
    id: 'aerospace',
    name: 'Aerospace & Defense',
    icon: ShieldCheck,
    code: 'SEC-DEF-04',
    exposure: '0.0% Breach Delta',
    latency: '4.6 ms',
    containment: '100.0%',
    status: 'Armed',
    headline: 'Hypersonic Telemetry & Sovereign Orbital Coordinate Shield',
    details: 'Real-time sensor fusion with zero-latency threat triage and autonomous electronic counter-measures.'
  },
  {
    id: 'supply',
    name: 'Global Maritime Supply Chain',
    icon: Truck,
    code: 'SEC-LOG-05',
    exposure: '3.1% Port Bottleneck',
    latency: '14.8 ms',
    containment: '99.92%',
    status: 'Optimizing',
    headline: 'Maritime Chokepoint & Deep-Sea Vessel Disruption Routing',
    details: 'Predictive rerouting algorithms avoiding geopolitical blockades across critical international maritime straits.'
  }
];

const AnimatedMetric = ({ value, label, suffix = '', precision = 2 }: { value: string; label: string; suffix?: string; precision?: number }) => {
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    let start = 0;
    const target = parseFloat(value.replace(/,/g, ''));
    const duration = 2000;
    const steps = 50;
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
        fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
        fontWeight: 800,
        fontFamily: "'Space Grotesk', -apple-system, sans-serif",
        background: 'linear-gradient(180deg, #F6FDFF 0%, #6AE7F7 55%, #2E9BF8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 35px rgba(106, 231, 247, 0.45)',
        letterSpacing: '-1px',
      }}>
        {display}{suffix}
      </div>
      <div style={{
        color: '#6AE7F7',
        fontSize: '0.75rem',
        fontWeight: 700,
        fontFamily: "'JetBrains Mono', 'Space Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
      }}>
        {label}
      </div>
    </div>
  );
};

export const Landing = () => {
  const [showDemo, setShowDemo] = useState(false);
  const [activeSectorIdx, setActiveSectorIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSectorSimulating, setIsSectorSimulating] = useState(false);
  const [simStage, setSimStage] = useState(0);
  const navigate = useNavigate();

  const { isAuthenticated, organization, role } = useAuthStore();

  const activeSector = SECTOR_SIMULATIONS[activeSectorIdx];
  const SectorIcon = activeSector.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth - 0.5) * 20;
    const y = (clientY / window.innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const handleInitialize = () => {
    navigate('/organization');
  };

  const triggerSectorStressTest = () => {
    if (isSectorSimulating) return;
    setIsSectorSimulating(true);
    setSimStage(1);

    setTimeout(() => {
      setSimStage(2);
    }, 1200);

    setTimeout(() => {
      setSimStage(3);
    }, 2400);

    setTimeout(() => {
      setIsSectorSimulating(false);
      setSimStage(0);
    }, 4000);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: '#07112E',
        backgroundImage: 'radial-gradient(circle at 50% 10%, rgba(13, 35, 77, 0.8) 0%, transparent 60%)',
        color: '#F6FDFF',
        overflowX: 'hidden',
        minHeight: '100vh',
        position: 'relative',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 4K Real-time 3D AI Product Experience Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />

      {/* Volumetric Scanlines & Dynamic Ambient Sapphire + Violet Atmosphere */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 70% 35%, rgba(21, 84, 232, 0.22) 0%, transparent 60%)',
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
          transition: 'transform 0.2s ease-out',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 75%, rgba(122, 72, 255, 0.14) 0%, transparent 50%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(46, 155, 248, 0.15) 0%, transparent 70%)',
        }} />
        <div className="command-grid" />
      </div>

      {/* Top Sovereign Command Header */}
      <header style={{
        position: 'relative',
        zIndex: 20,
        padding: '1.5rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Brand Lockup */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: '12px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(21, 84, 232, 0.5)',
            border: '1px solid rgba(46, 155, 248, 0.4)',
            background: '#07112E'
          }}>
            <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              letterSpacing: '1.5px',
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              color: '#F6FDFF',
              lineHeight: 1
            }}>
              ORBIS
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#6AE7F7',
              textTransform: 'uppercase',
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: '4px'
            }}>
              SOVEREIGN RISK OPERATING SYSTEM
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Status Pill & Direct Access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            background: 'rgba(13, 35, 77, 0.8)',
            border: '1px solid rgba(46, 155, 248, 0.3)',
            borderRadius: '24px',
            padding: '0.5rem 1.25rem',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6AE7F7', boxShadow: '0 0 12px #6AE7F7' }} className="pulse-beacon" />
            <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#6AE7F7' }}>
              QKD 256-BIT LATTICE // NOMINAL
            </span>
          </div>

          <button
            onClick={() => setShowDemo(true)}
            style={{
              background: 'rgba(13, 35, 77, 0.75)',
              border: '1px solid rgba(46, 155, 248, 0.35)',
              borderRadius: '10px',
              padding: '0.6rem 1.25rem',
              color: '#F6FDFF',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#6AE7F7';
              e.currentTarget.style.background = 'rgba(21, 84, 232, 0.2)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(106, 231, 247, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.35)';
              e.currentTarget.style.background = 'rgba(13, 35, 77, 0.75)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Play size={12} fill="#6AE7F7" color="#6AE7F7" />
            Product Showcase
          </button>

          <button
            onClick={() => navigate('/organization')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(46, 155, 248, 0.35)',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              color: '#6AE7F7',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#F6FDFF';
              e.currentTarget.style.borderColor = '#2E9BF8';
              e.currentTarget.style.background = 'rgba(21, 84, 232, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#6AE7F7';
              e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.35)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => navigate('/organization')}
            style={{
              background: 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.25rem',
              color: '#F6FDFF',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(21, 84, 232, 0.45)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(46, 155, 248, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(21, 84, 232, 0.45)';
            }}
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Command Center Stage */}
      <main style={{
        display: 'flex',
        minHeight: 'calc(100vh - 100px)',
        position: 'relative',
        zIndex: 1,
        alignItems: 'center',
        paddingTop: '1rem',
        paddingBottom: '3rem'
      }}>
        
        {/* LEFT PANE: Mission Typography (52%) */}
        <div style={{ flex: '0 0 52%', padding: '0 3.5rem 0 4.5rem', position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            
            {/* Mission Tag with Sapphire Aura & Cyan Accent */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '24px',
              background: 'rgba(21, 84, 232, 0.15)',
              border: '1px solid rgba(46, 155, 248, 0.35)',
              boxShadow: '0 0 20px rgba(21, 84, 232, 0.2)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6AE7F7', boxShadow: '0 0 8px #6AE7F7' }} />
              <span style={{
                color: '#6AE7F7',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                AUTONOMOUS SYSTEMIC DEFENSE MATRIX
              </span>
            </div>

            {/* Monumental Headline */}
            <h1 style={{
              fontSize: 'clamp(3.4rem, 5.8vw, 5rem)',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              lineHeight: '1.06',
              letterSpacing: '-1.5px',
              margin: '0 0 1.25rem 0',
              color: '#F6FDFF'
            }}>
              The Architecture of <br />
              Certainty in an Era of <br />
              <span style={{
                background: 'linear-gradient(135deg, #F6FDFF 0%, #6AE7F7 45%, #2E9BF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 50px rgba(106, 231, 247, 0.4)',
              }}>
                Systemic Volatility.
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: 'rgba(246, 253, 255, 0.75)',
              maxWidth: '560px',
              lineHeight: '1.7',
              marginBottom: '2.25rem',
              fontWeight: 400,
            }}>
              ORBIS autonomously intercepts systemic anomalies, liquidity cascades, and sovereign infrastructure vulnerabilities before propagation—powered by ORBIS Neural Risk Engine v4.2.
            </p>

            {/* Action Directives */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(21, 84, 232, 0.6)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleInitialize}
                style={{
                  padding: '1.15rem 2.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.75px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)',
                  color: '#F6FDFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(21, 84, 232, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                INITIALIZE COMMAND PORTAL <ArrowUpRight size={17} strokeWidth={2.5} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#2E9BF8', backgroundColor: 'rgba(21, 84, 232, 0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/organization')}
                style={{
                  padding: '1.15rem 2rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  borderRadius: '12px',
                  background: 'rgba(13, 35, 77, 0.85)',
                  border: '1px solid rgba(46, 155, 248, 0.35)',
                  color: '#F6FDFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(15px)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  boxShadow: '0 4px 18px rgba(0,0,0,0.4)'
                }}
              >
                Create Account
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#8671F9', backgroundColor: 'rgba(122, 72, 255, 0.2)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDemo(true)}
                style={{
                  padding: '1.15rem 2rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  borderRadius: '12px',
                  background: 'rgba(13, 35, 77, 0.8)',
                  border: '1px solid rgba(122, 72, 255, 0.35)',
                  color: '#F6FDFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backdropFilter: 'blur(15px)',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(122, 72, 255, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play size={11} fill="#8671F9" color="#8671F9" />
                </div>
                Live 4K Simulation
              </motion.button>
            </div>

            {/* Live Real-time Telemetry Metrics */}
            <div style={{
              display: 'flex',
              gap: '3rem',
              marginTop: '3rem',
              borderTop: '1px solid rgba(46, 155, 248, 0.16)',
              paddingTop: '2rem',
            }}>
              <AnimatedMetric value="99.98" suffix="%" label="Interception Velocity" />
              <AnimatedMetric value="1.84" suffix="B" label="Records Processed/s" />
              <AnimatedMetric value="13" suffix=" Sectors" label="Sovereign Nodes Active" precision={0} />
            </div>

          </motion.div>
        </div>

        {/* RIGHT PANE: Grounded Sovereign Command Console Preview (48%) */}
        <div style={{
          flex: '0 0 48%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 3.5rem 0 0',
          position: 'relative'
        }}>
          <EnterpriseCommandPreview 
            activeSector={activeSector}
            onTriggerSimulation={() => {}}
          />
        </div>

      </main>

      {/* -------------------------------------------------------------
          INTERACTIVE SECTOR THREAT SIMULATOR BAR (Live Stimulation Harness)
          ------------------------------------------------------------- */}
      <section style={{
        maxWidth: '1280px',
        margin: '1.5rem auto 5rem auto',
        padding: '0 2rem',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          background: 'rgba(13, 35, 77, 0.75)',
          border: isSectorSimulating ? '1px solid rgba(255, 92, 92, 0.5)' : '1px solid rgba(46, 155, 248, 0.25)',
          borderRadius: '24px',
          padding: '2.25rem',
          backdropFilter: 'blur(24px)',
          boxShadow: isSectorSimulating 
            ? '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 92, 92, 0.25)' 
            : '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(21, 84, 232, 0.2)',
          transition: 'all 0.4s ease'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#6AE7F7', letterSpacing: '1.5px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                LIVE SECTOR THREAT HARNESS // SELECT ACTIVE TENANT
              </div>
              <h3 style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#F6FDFF',
                margin: '4px 0 0 0',
                fontFamily: "'Space Grotesk', -apple-system, sans-serif"
              }}>
                Multi-Sector Autonomous Surveillance Matrix
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={triggerSectorStressTest}
                disabled={isSectorSimulating}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '100px',
                  background: isSectorSimulating ? 'rgba(255, 92, 92, 0.2)' : 'linear-gradient(135deg, rgba(21, 84, 232, 0.25) 0%, rgba(106, 231, 247, 0.25) 100%)',
                  border: isSectorSimulating ? '1px solid rgba(255, 92, 92, 0.5)' : '1px solid rgba(106, 231, 247, 0.45)',
                  color: isSectorSimulating ? '#FF8F8F' : '#6AE7F7',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: isSectorSimulating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: isSectorSimulating ? '0 0 15px rgba(255, 92, 92, 0.3)' : '0 0 15px rgba(21, 84, 232, 0.25)'
                }}
              >
                <Zap size={13} className={isSectorSimulating ? 'animate-pulse' : ''} />
                {isSectorSimulating ? 'SIMULATING SURGE...' : 'RUN LIVE STRESS SIMULATION'}
              </button>

              <button
                onClick={() => setShowDemo(true)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '100px',
                  background: 'rgba(122, 72, 255, 0.15)',
                  border: '1px solid rgba(134, 113, 249, 0.35)',
                  color: '#8671F9',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={12} fill="#8671F9" />
                4K REAL-TIME SIM
              </button>
            </div>
          </div>

          {/* Sector Selector Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.75rem'
          }}>
            {SECTOR_SIMULATIONS.map((sec, idx) => {
              const Icon = sec.icon;
              const isSelected = activeSectorIdx === idx;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectorIdx(idx)}
                  style={{
                    padding: '1rem 1.15rem',
                    borderRadius: '14px',
                    background: isSelected ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)' : 'rgba(7, 17, 46, 0.65)',
                    border: isSelected ? '1px solid #6AE7F7' : '1px solid rgba(46, 155, 248, 0.15)',
                    color: isSelected ? '#F6FDFF' : 'rgba(246, 253, 255, 0.65)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? '0 8px 25px rgba(21, 84, 232, 0.45)' : 'none',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    background: isSelected ? 'rgba(255, 255, 255, 0.2)' : 'rgba(21, 84, 232, 0.2)',
                    color: isSelected ? '#F6FDFF' : '#6AE7F7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={17} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                      color: isSelected ? '#F6FDFF' : '#F6FDFF'
                    }}>
                      {sec.name}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: isSelected ? '#D9FBFF' : 'rgba(246, 253, 255, 0.5)', fontFamily: "'JetBrains Mono', monospace" }}>
                      {sec.code}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Sector Telemetry Display Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              style={{
                background: 'rgba(7, 17, 46, 0.95)',
                border: isSectorSimulating ? '1px solid rgba(255, 92, 92, 0.4)' : '1px solid rgba(46, 155, 248, 0.25)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                gap: '1.75rem',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.4rem' }}>
                  <SectorIcon size={17} color="#6AE7F7" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>
                    {activeSector.name.toUpperCase()} // ACTIVE HARNESS
                  </span>
                </div>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#F6FDFF',
                  margin: '0 0 0.4rem 0',
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif"
                }}>
                  {activeSector.headline}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(246, 253, 255, 0.7)', margin: 0, lineHeight: 1.55 }}>
                  {activeSector.details}
                </p>

                {isSectorSimulating && (
                  <div style={{
                    marginTop: '0.85rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '8px',
                    background: 'rgba(255, 92, 92, 0.15)',
                    border: '1px solid rgba(255, 92, 92, 0.35)',
                    fontSize: '0.72rem',
                    color: '#FF8F8F',
                    fontFamily: "'JetBrains Mono', monospace",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>
                      {simStage === 1 && 'STAGE 1: Ingesting high-amplitude anomaly wave...'}
                      {simStage === 2 && 'STAGE 2: Neural Risk Engine evaluating graph weights...'}
                      {simStage === 3 && 'STAGE 3: Autonomous circuit breaker locked. Contained!'}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ borderLeft: '1px solid rgba(46, 155, 248, 0.16)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  Anomaly Vector
                </div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: isSectorSimulating && simStage === 1 ? '#FF5C5C' : '#F6FDFF',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '2px'
                }}>
                  {isSectorSimulating && simStage === 1 ? '+16.8% Surge' : activeSector.exposure}
                </div>
                <div style={{ fontSize: '0.62rem', color: 'rgba(246, 253, 255, 0.55)', marginTop: '2px' }}>
                  {isSectorSimulating ? 'Variance Spike' : 'Variance Envelope'}
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(46, 155, 248, 0.16)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  Inference Latency
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
                  {activeSector.latency}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#6AE7F7', marginTop: '2px' }}>
                  Sub-second Neural Intercept
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(46, 155, 248, 0.16)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  Containment Index
                </div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#6AE7F7',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '2px'
                }}>
                  {isSectorSimulating && simStage === 3 ? '100.0%' : activeSector.containment}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#6AE7F7', marginTop: '2px' }}>
                  Autonomous Mitigation
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* -------------------------------------------------------------
          INSTITUTIONAL PILLARS & STATUTORY GOVERNANCE STRIP
          ------------------------------------------------------------- */}
      <section style={{
        maxWidth: '1280px',
        margin: '0 auto 5rem auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 5
      }}>
        {[
          {
            num: '01',
            title: 'Autonomous Circuit Breakers',
            desc: 'Sub-second algorithmic mitigation execution isolating compromised sub-networks before contagion spreads.'
          },
          {
            num: '02',
            title: '100K-Path Monte Carlo',
            desc: 'Recursive predictive simulation engine identifying black-swan tail-risk across correlated macro variables.'
          },
          {
            num: '03',
            title: 'Explainable AI & SHAP Weights',
            desc: 'Zero black-box obscurity. Every anomaly score is deconstructed into exact Shapley feature importance vectors.'
          },
          {
            num: '04',
            title: 'Post-Quantum Sovereign Shield',
            desc: 'Lattice-based cryptography securing multi-tenant data pipelines against next-generation quantum decryptors.'
          }
        ].map((pillar) => (
          <div
            key={pillar.num}
            style={{
              background: 'rgba(13, 35, 77, 0.65)',
              border: '1px solid rgba(46, 155, 248, 0.16)',
              borderRadius: '18px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(106, 231, 247, 0.5)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(21, 84, 232, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.16)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.85rem' }}>
              // {pillar.num}
            </div>
            <h4 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#F6FDFF',
              margin: '0 0 0.65rem 0',
              fontFamily: "'Space Grotesk', -apple-system, sans-serif"
            }}>
              {pillar.title}
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'rgba(246, 253, 255, 0.75)', lineHeight: 1.65, margin: 0 }}>
              {pillar.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer Branding Strip */}
      <footer style={{
        borderTop: '1px solid rgba(46, 155, 248, 0.16)',
        padding: '2rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
        color: 'rgba(246, 253, 255, 0.55)',
        fontSize: '0.82rem',
      }}>
        <div>
          &copy; {new Date().getFullYear()} ORBIS &bull; Organizational Risk and Business Intelligence System. Enterprise Neural Architecture.
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#6AE7F7' }}>
          <span>ISO 31000</span>
          <span>NIST CSF 2.0</span>
          <span>BASEL III</span>
          <span>SOC 2 TYPE II</span>
        </div>
      </footer>

      <style>{`
        .command-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(46, 155, 248, 0.05) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(46, 155, 248, 0.05) 1px, transparent 1px);
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
