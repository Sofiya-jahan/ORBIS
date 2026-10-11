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
        background: 'linear-gradient(180deg, #FFFFFF 0%, #34D399 55%, #10B981 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textShadow: '0 0 35px rgba(16, 185, 129, 0.45)',
        letterSpacing: '-1px',
      }}>
        {display}{suffix}
      </div>
      <div style={{
        color: '#E5C07B',
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
        backgroundColor: '#070A0E',
        color: '#FFFFFF',
        overflowX: 'hidden',
        minHeight: '100vh',
        position: 'relative',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* 4K Real-time 3D AI Product Experience Modal */}
      <DemoModal isOpen={showDemo} onClose={() => setShowDemo(false)} />

      {/* Volumetric Scanlines & Dynamic Ambient Emerald + Gold Atmosphere */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 70% 35%, rgba(16, 185, 129, 0.22) 0%, transparent 60%)',
          transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
          transition: 'transform 0.2s ease-out',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 20% 75%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
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
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <Shield size={24} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              letterSpacing: '1.5px',
              fontFamily: "'Space Grotesk', -apple-system, sans-serif",
              color: '#FFFFFF',
              lineHeight: 1
            }}>
              IPRAP
            </div>
            <div style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '2px',
              color: '#E5C07B',
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
            background: 'rgba(10, 18, 23, 0.82)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '24px',
            padding: '0.5rem 1.25rem',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 25px rgba(0, 0, 0, 0.6)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 12px #34D399' }} className="pulse-beacon" />
            <span style={{ fontSize: '0.72rem', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: '#34D399' }}>
              QKD 256-BIT LATTICE // NOMINAL
            </span>
          </div>

          <button
            onClick={() => setShowDemo(true)}
            style={{
              background: 'rgba(10, 18, 23, 0.75)',
              border: '1px solid rgba(229, 192, 123, 0.35)',
              borderRadius: '10px',
              padding: '0.6rem 1.25rem',
              color: '#FFFFFF',
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
              e.currentTarget.style.borderColor = '#E5C07B';
              e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(229, 192, 123, 0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(229, 192, 123, 0.35)';
              e.currentTarget.style.background = 'rgba(10, 18, 23, 0.75)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Play size={12} fill="#E5C07B" color="#E5C07B" />
            Product Showcase
          </button>

          <button
            onClick={() => navigate('/organization')}
            style={{
              background: 'transparent',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '10px',
              padding: '0.6rem 1.2rem',
              color: '#34D399',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#34D399';
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Sign In
          </button>

          <button
            onClick={() => navigate('/organization')}
            style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.25rem',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              cursor: 'pointer',
              boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 18px rgba(16, 185, 129, 0.4)';
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
            
            {/* Mission Tag with Emerald Aura & Gold Accent */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '24px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.15)',
              marginBottom: '1.5rem'
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
              <span style={{
                color: '#34D399',
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
              color: '#FFFFFF'
            }}>
              The Architecture of <br />
              Certainty in an Era of <br />
              <span style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #34D399 45%, #E5C07B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 50px rgba(16, 185, 129, 0.4)',
              }}>
                Systemic Volatility.
              </span>
            </h1>

            <p style={{
              fontSize: '1.15rem',
              color: '#CBD5E1',
              maxWidth: '560px',
              lineHeight: '1.7',
              marginBottom: '2.25rem',
              fontWeight: 400,
            }}>
              IPRAP autonomously intercepts systemic anomalies, liquidity cascades, and sovereign infrastructure vulnerabilities before propagation—powered by NVIDIA Nemotron-3 120B reasoning.
            </p>

            {/* Action Directives */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 35px rgba(16, 185, 129, 0.6)' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleInitialize}
                style={{
                  padding: '1.15rem 2.5rem',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  letterSpacing: '0.75px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Space Grotesk', sans-serif"
                }}
              >
                INITIALIZE COMMAND PORTAL <ArrowUpRight size={17} strokeWidth={2.5} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, borderColor: '#10B981', backgroundColor: 'rgba(16, 185, 129, 0.15)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/organization')}
                style={{
                  padding: '1.15rem 2rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  borderRadius: '10px',
                  background: 'rgba(10, 18, 23, 0.85)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  color: '#FFFFFF',
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
                whileHover={{ scale: 1.03, borderColor: '#E5C07B', backgroundColor: 'rgba(245, 158, 11, 0.15)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowDemo(true)}
                style={{
                  padding: '1.15rem 2rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                  borderRadius: '10px',
                  background: 'rgba(10, 18, 23, 0.8)',
                  border: '1px solid rgba(229, 192, 123, 0.35)',
                  color: '#CBD5E1',
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
                  background: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play size={11} fill="#E5C07B" color="#E5C07B" />
                </div>
                Live 4K Simulation
              </motion.button>
            </div>

            {/* Live Real-time Telemetry Metrics */}
            <div style={{
              display: 'flex',
              gap: '3rem',
              marginTop: '3rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
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
          background: 'rgba(10, 18, 23, 0.88)',
          border: isSectorSimulating ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '24px',
          padding: '2.25rem',
          backdropFilter: 'blur(20px)',
          boxShadow: isSectorSimulating 
            ? '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(239, 68, 68, 0.2)' 
            : '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(16, 185, 129, 0.15)',
          transition: 'all 0.4s ease'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: '#E5C07B', letterSpacing: '1.5px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                LIVE SECTOR THREAT HARNESS // SELECT ACTIVE TENANT
              </div>
              <h3 style={{
                fontSize: '1.85rem',
                fontWeight: 800,
                color: '#FFFFFF',
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
                  background: isSectorSimulating ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(0, 198, 255, 0.2) 100%)',
                  border: isSectorSimulating ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.4)',
                  color: isSectorSimulating ? '#F87171' : '#34D399',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: isSectorSimulating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s',
                  boxShadow: isSectorSimulating ? '0 0 15px rgba(239, 68, 68, 0.3)' : '0 0 15px rgba(16, 185, 129, 0.2)'
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
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(229, 192, 123, 0.35)',
                  color: '#E5C07B',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Play size={12} fill="#E5C07B" />
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
                    background: isSelected ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.15) 100%)' : 'rgba(16, 26, 34, 0.5)',
                    border: isSelected ? '1px solid #34D399' : '1px solid rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#FFFFFF' : '#94A3B8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.25s ease',
                    boxShadow: isSelected ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
                    textAlign: 'left'
                  }}
                >
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: '8px',
                    background: isSelected ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'rgba(16, 185, 129, 0.12)',
                    color: isSelected ? '#FFFFFF' : '#34D399',
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
                      color: isSelected ? '#FFFFFF' : '#CBD5E1'
                    }}>
                      {sec.name}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: isSelected ? '#E5C07B' : '#64748B', fontFamily: "'JetBrains Mono', monospace" }}>
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
                background: 'rgba(7, 12, 16, 0.94)',
                border: isSectorSimulating ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.25)',
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
                  <SectorIcon size={17} color="#34D399" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34D399', fontFamily: "'JetBrains Mono', monospace" }}>
                    {activeSector.name.toUpperCase()} // ACTIVE HARNESS
                  </span>
                </div>
                <h4 style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: '0 0 0.4rem 0',
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif"
                }}>
                  {activeSector.headline}
                </h4>
                <p style={{ fontSize: '0.88rem', color: '#94A3B8', margin: 0, lineHeight: 1.55 }}>
                  {activeSector.details}
                </p>

                {isSectorSimulating && (
                  <div style={{
                    marginTop: '0.85rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    fontSize: '0.72rem',
                    color: '#F87171',
                    fontFamily: "'JetBrains Mono', monospace",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <RefreshCw size={12} className="animate-spin" />
                    <span>
                      {simStage === 1 && 'STAGE 1: Ingesting high-amplitude anomaly wave...'}
                      {simStage === 2 && 'STAGE 2: Nemotron-3 120B evaluating risk graph weights...'}
                      {simStage === 3 && 'STAGE 3: Autonomous circuit breaker locked. Contained!'}
                    </span>
                  </div>
                )}
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#E5C07B', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  Anomaly Vector
                </div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: isSectorSimulating && simStage === 1 ? '#EF4444' : '#FFFFFF',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '2px'
                }}>
                  {isSectorSimulating && simStage === 1 ? '+16.8% Surge' : activeSector.exposure}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#94A3B8', marginTop: '2px' }}>
                  {isSectorSimulating ? 'Variance Spike' : 'Variance Envelope'}
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#E5C07B', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  Inference Latency
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34D399', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
                  {activeSector.latency}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#34D399', marginTop: '2px' }}>
                  Sub-second Neural Intercept
                </div>
              </div>

              <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '1.25rem' }}>
                <div style={{ fontSize: '0.68rem', color: '#E5C07B', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>
                  Containment Index
                </div>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 800,
                  color: '#10B981',
                  fontFamily: "'JetBrains Mono', monospace",
                  marginTop: '2px'
                }}>
                  {isSectorSimulating && simStage === 3 ? '100.0%' : activeSector.containment}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#10B981', marginTop: '2px' }}>
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
              background: 'rgba(10, 18, 23, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '2rem',
              backdropFilter: 'blur(16px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(16, 185, 129, 0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#E5C07B', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.85rem' }}>
              // {pillar.num}
            </div>
            <h4 style={{
              fontSize: '1.35rem',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: '0 0 0.65rem 0',
              fontFamily: "'Space Grotesk', -apple-system, sans-serif"
            }}>
              {pillar.title}
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.65, margin: 0 }}>
              {pillar.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer Branding Strip */}
      <footer style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '2rem 4rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        zIndex: 5,
        color: '#94A3B8',
        fontSize: '0.82rem',
      }}>
        <div>
          &copy; {new Date().getFullYear()} IPRAP &bull; Intelligent Predictive Risk Analytics Platform. Powered by NVIDIA Nemotron-3 120B.
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.72rem', color: '#E5C07B' }}>
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
            linear-gradient(rgba(142, 182, 155, 0.04) 1px, transparent 1px), 
            linear-gradient(90deg, rgba(142, 182, 155, 0.04) 1px, transparent 1px);
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
