import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Activity, Cpu, AlertTriangle, 
  CheckCircle2, Lock, Zap, Layers, RefreshCw, 
  Radio, Play, ShieldAlert, Sparkles, Terminal, ChevronRight
} from 'lucide-react';

export interface SectorSimulationConfig {
  id: string;
  name: string;
  icon?: any;
  code: string;
  exposure: string;
  latency: string;
  containment: string;
  status: string;
  headline: string;
  details: string;
}

interface ThreatFeedItem {
  id: string;
  time: string;
  sector: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'Intercepted' | 'Neutralized' | 'Analyzing' | 'Contained';
  latency: string;
}

interface EnterpriseCommandPreviewProps {
  activeSector?: SectorSimulationConfig;
  onTriggerSimulation?: () => void;
}

const SECTOR_THREAT_TEMPLATES: Record<string, { type: string; severity: ThreatFeedItem['severity']; desc: string; shap: string }[]> = {
  banking: [
    { type: 'Synthetic Liquidity Shock', severity: 'critical', desc: 'Cross-border FX arbitrage anomaly on offshore swap hub', shap: '+0.89' },
    { type: 'High-Frequency Arbitrage Drift', severity: 'high', desc: 'Sub-millisecond order spoofing detected on clearing gateway', shap: '+0.74' },
    { type: 'Collateral Re-hypothecation Disconnect', severity: 'medium', desc: 'Mismatch between tri-party repo valuation streams', shap: '+0.52' }
  ],
  energy: [
    { type: 'SCADA Harmonic Drift', severity: 'critical', desc: 'Microgrid frequency desync on 500kV interconnect', shap: '+0.91' },
    { type: 'Substation Voltage Cascade', severity: 'high', desc: 'Reactive power surge exceeding NERC stability envelope', shap: '+0.81' },
    { type: 'Turbine Rotor Phase Jitter', severity: 'medium', desc: 'Vibration telemetry spike on hydro-electric generator #4', shap: '+0.48' }
  ],
  healthcare: [
    { type: 'Telemetry Ingress Anomaly', severity: 'critical', desc: 'Continuous cardiac monitor telemetry packet mismatch in ICU', shap: '+0.93' },
    { type: 'Cold-Chain Cryo Thermal Drift', severity: 'high', desc: 'Vaccine distribution ultra-low temperature deviation warning', shap: '+0.76' },
    { type: 'Diagnostic PACS Access Spurt', severity: 'medium', desc: 'Unusual bulk imaging queries outside clinical shifts', shap: '+0.44' }
  ],
  aerospace: [
    { type: 'Orbital Packet Desync', severity: 'critical', desc: 'Telemetry jitter detected on low-earth orbit constellation telemetry', shap: '+0.96' },
    { type: 'Hypersonic Telemetry Trajectory Drift', severity: 'high', desc: 'Inertial guidance sensor correlation variance exceedance', shap: '+0.84' },
    { type: 'Avionics Bus Ingress Variance', severity: 'medium', desc: 'MIL-STD-1553 bus packet timing anomaly mitigated', shap: '+0.55' }
  ],
  supply: [
    { type: 'Maritime Chokepoint Bottleneck', severity: 'high', desc: 'Vessel transit delay cascade radiating from Malacca strait', shap: '+0.78' },
    { type: 'Container Telemetry Tampering', severity: 'medium', desc: 'Smart seal integrity anomaly detected at transshipment dock', shap: '+0.63' },
    { type: 'Intermodal Freight Routing Cascade', severity: 'high', desc: 'Rail freight yard congestion requiring algorithmic reroute', shap: '+0.71' }
  ]
};

export const EnterpriseCommandPreview: React.FC<EnterpriseCommandPreviewProps> = ({ 
  activeSector,
  onTriggerSimulation 
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'matrix' | 'reasoning'>('live');
  const [healthScore, setHealthScore] = useState(99.4);
  const [pulseCount, setPulseCount] = useState(1842);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  const sectorKey = activeSector?.id || 'banking';

  // Sector-tailored live feeds
  const [feedItems, setFeedItems] = useState<ThreatFeedItem[]>([
    { id: 'TR-9021', time: '14:22:04', sector: 'Central Banking', type: 'Synthetic Liquidity Shock', severity: 'critical', status: 'Intercepted', latency: '4.2 ms' },
    { id: 'TR-9022', time: '14:21:49', sector: 'Power Grid', type: 'SCADA Harmonic Drift', severity: 'medium', status: 'Neutralized', latency: '11.2 ms' },
    { id: 'TR-9023', time: '14:21:12', sector: 'Healthcare', type: 'Telemetry Ingress Anomaly', severity: 'low', status: 'Contained', latency: '8.1 ms' },
    { id: 'TR-9024', time: '14:20:38', sector: 'Aerospace', type: 'Orbital Packet Desync', severity: 'high', status: 'Intercepted', latency: '4.6 ms' },
  ]);

  // Periodic heartbeat tick
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + Math.floor(Math.random() * 6) + 2);
      if (!isSimulating) {
        setHealthScore(prev => {
          const delta = (Math.random() - 0.5) * 0.15;
          return parseFloat(Math.min(99.9, Math.max(98.9, prev + delta)).toFixed(1));
        });
      }
    }, 2400);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Trigger interactive chaos simulation test
  const handleRunSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimulationStep(1);
    setHealthScore(92.4);

    // Step 1: Anomaly Injected
    const templates = SECTOR_THREAT_TEMPLATES[sectorKey] || SECTOR_THREAT_TEMPLATES.banking;
    const chosen = templates[Math.floor(Math.random() * templates.length)];
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    const newId = `TR-${Math.floor(9000 + Math.random() * 999)}`;

    const newThreat: ThreatFeedItem = {
      id: newId,
      time: timeStr,
      sector: activeSector?.name || 'Sovereign Core',
      type: chosen.type,
      severity: chosen.severity,
      status: 'Analyzing',
      latency: '2.1 ms'
    };

    setFeedItems(prev => [newThreat, ...prev.slice(0, 4)]);

    // Step 2: Nemotron Reasoning
    setTimeout(() => {
      setSimulationStep(2);
      setFeedItems(prev => prev.map(item => item.id === newId ? { ...item, status: 'Contained' } : item));
    }, 1200);

    // Step 3: Autonomous Quarantine & Containment
    setTimeout(() => {
      setSimulationStep(3);
      setHealthScore(99.8);
      setFeedItems(prev => prev.map(item => item.id === newId ? { ...item, status: 'Neutralized' } : item));
    }, 2400);

    // Step 4: Finished
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationStep(0);
      if (onTriggerSimulation) onTriggerSimulation();
    }, 3800);
  };

  const currentTemplate = useMemo(() => {
    const list = SECTOR_THREAT_TEMPLATES[sectorKey] || SECTOR_THREAT_TEMPLATES.banking;
    return list[0];
  }, [sectorKey]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '640px',
      margin: '0 auto',
      position: 'relative',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif"
    }}>
      
      {/* Ambient Radial Radiance */}
      <div style={{
        position: 'absolute',
        inset: '-20px',
        background: isSimulating 
          ? 'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.25) 0%, rgba(16, 185, 129, 0.15) 50%, transparent 75%)'
          : 'radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.22) 0%, rgba(0, 198, 255, 0.1) 50%, transparent 75%)',
        filter: 'blur(45px)',
        zIndex: 0,
        pointerEvents: 'none',
        transition: 'all 0.6s ease'
      }} />

      {/* Main Grounded Command Terminal Console */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(9, 18, 24, 0.94)',
        backdropFilter: 'blur(30px)',
        border: isSimulating ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '24px',
        boxShadow: isSimulating 
          ? '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(239, 68, 68, 0.25)'
          : '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 45px rgba(16, 185, 129, 0.18)',
        overflow: 'hidden',
        transition: 'all 0.4s ease'
      }}>
        
        {/* Terminal Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: 'rgba(6, 13, 18, 0.96)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isSimulating ? '#EF4444' : '#10B981',
              boxShadow: isSimulating ? '0 0 12px #EF4444' : '0 0 10px #10B981',
              transition: 'all 0.3s'
            }} />
            <div>
              <div style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#FFFFFF',
                letterSpacing: '0.5px',
                fontFamily: "'Space Grotesk', -apple-system, sans-serif"
              }}>
                IPRAP // SOVEREIGN RISK SENTINEL
              </div>
              <div style={{
                fontSize: '0.65rem',
                color: isSimulating ? '#F87171' : '#34D399',
                fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.5px'
              }}>
                {isSimulating ? 'CHAOS SIMULATION ENGAGED • INTERCEPTING' : `NODE: ${activeSector?.code || 'SEC-FIN-01'} • REASONING ARMED`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {/* Interactive Chaos Simulation Trigger Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '8px',
                background: isSimulating 
                  ? 'rgba(239, 68, 68, 0.2)' 
                  : 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(0, 198, 255, 0.2) 100%)',
                border: isSimulating ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(16, 185, 129, 0.5)',
                color: isSimulating ? '#F87171' : '#34D399',
                fontSize: '0.7rem',
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                cursor: isSimulating ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.2s',
                boxShadow: isSimulating ? '0 0 12px rgba(239, 68, 68, 0.3)' : '0 0 12px rgba(16, 185, 129, 0.2)'
              }}
              title="Trigger real-time chaotic anomaly simulation"
            >
              <Zap size={12} className={isSimulating ? 'animate-pulse' : ''} />
              {isSimulating ? 'SIMULATING...' : 'TEST SIMULATION'}
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '20px',
              padding: '0.3rem 0.75rem'
            }}>
              <Radio size={11} color="#10B981" />
              <span style={{ fontSize: '0.68rem', color: '#E2E8F0', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                {pulseCount.toLocaleString()} OPS/S
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic Key Numbers Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          background: 'rgba(16, 185, 129, 0.15)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ padding: '0.9rem 1.25rem', background: 'rgba(9, 18, 24, 0.95)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              System Health
            </div>
            <div style={{
              fontSize: '1.45rem',
              fontWeight: 800,
              color: isSimulating ? '#F87171' : '#10B981',
              fontFamily: "'JetBrains Mono', monospace",
              marginTop: '2px',
              transition: 'color 0.3s'
            }}>
              {healthScore}%
            </div>
            <div style={{ fontSize: '0.65rem', color: isSimulating ? '#F87171' : '#34D399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              {isSimulating ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
              {isSimulating ? 'Mitigating Surge' : 'Nominal Lattice'}
            </div>
          </div>

          <div style={{ padding: '0.9rem 1.25rem', background: 'rgba(9, 18, 24, 0.95)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Containment Latency
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E5C07B', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
              {activeSector?.latency || '4.6 ms'}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Zap size={10} /> Zero-Lag Intercept
            </div>
          </div>

          <div style={{ padding: '0.9rem 1.25rem', background: 'rgba(9, 18, 24, 0.95)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              AI Model Engine
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Space Grotesk', sans-serif", marginTop: '4px' }}>
              Nemotron-3
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
              120B Dual Reasoning
            </div>
          </div>
        </div>

        {/* Live Simulation Progress Banner */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '0.5rem 1.4rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.72rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#FECACA'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={12} className="animate-spin text-red-400" />
                <span>
                  {simulationStep === 1 && 'STAGE 1/3: Simulated Anomaly Surge Injected (+12.4% Delta)'}
                  {simulationStep === 2 && 'STAGE 2/3: Nemotron Cognitive Model Synthesizing Latent Vectors...'}
                  {simulationStep === 3 && 'STAGE 3/3: Autonomous Circuit Breaker Executed. Lattice Restored!'}
                </span>
              </div>
              <span style={{ color: '#34D399', fontWeight: 700 }}>
                {simulationStep === 3 ? '100% CONTAINED' : 'PROCESSING'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigator */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '0.4rem 1.25rem 0 1.25rem',
          gap: '0.75rem',
          background: 'rgba(7, 15, 20, 0.88)'
        }}>
          {[
            { id: 'live', label: 'Live Threat Feed', icon: Activity },
            { id: 'matrix', label: 'Sector Exposure Matrix', icon: Layers },
            { id: 'reasoning', label: 'Neural Decision Audit', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '0.55rem 0.5rem',
                  border: 'none',
                  background: 'none',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  fontFamily: "'Space Grotesk', -apple-system, sans-serif",
                  cursor: 'pointer',
                  borderBottom: isActive ? '2px solid #10B981' : '2px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} color={isActive ? '#10B981' : '#94A3B8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div style={{ padding: '1.25rem', minHeight: '250px' }}>
          {activeTab === 'live' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem',
                fontSize: '0.66rem',
                fontFamily: "'JetBrains Mono', monospace",
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <span>Real-Time Intercept Log // Tenant: {activeSector?.name || 'All Sectors'}</span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={10} className="animate-spin" /> Stream Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {feedItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.9rem',
                      background: 'rgba(12, 24, 30, 0.75)',
                      border: item.severity === 'critical' ? '1px solid rgba(239, 68, 68, 0.35)' : '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '10px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: 30,
                        height: 30,
                        borderRadius: '7px',
                        background: item.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border: `1px solid ${item.severity === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.35)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.severity === 'critical' ? '#F87171' : '#34D399',
                        flexShrink: 0
                      }}>
                        {item.severity === 'critical' ? <AlertTriangle size={14} /> : <ShieldCheck size={14} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>
                          {item.type}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace" }}>
                          {item.sector} • <span style={{ color: '#E5C07B' }}>{item.id}</span> • {item.time} ({item.latency})
                        </div>
                      </div>
                    </div>

                    <div style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: '6px',
                      background: item.status === 'Analyzing' 
                        ? 'rgba(239, 68, 68, 0.2)' 
                        : 'rgba(16, 185, 129, 0.15)',
                      border: item.status === 'Analyzing' 
                        ? '1px solid rgba(239, 68, 68, 0.4)' 
                        : '1px solid rgba(16, 185, 129, 0.35)',
                      color: item.status === 'Analyzing' ? '#F87171' : '#34D399',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace"
                    }}>
                      {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div>
              <div style={{ fontSize: '0.66rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Multi-Sector Risk Variance Distribution (Real-Time Ingestion)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { id: 'banking', sector: 'Central Banking & Sovereign Capital', risk: 14, color: '#10B981', status: 'Secured' },
                  { id: 'energy', sector: 'Power Grid SCADA Telemetry', risk: 22, color: '#34D399', status: 'Optimal' },
                  { id: 'healthcare', sector: 'Metropolitan Healthcare Systems', risk: 8, color: '#10B981', status: 'Optimal' },
                  { id: 'aerospace', sector: 'Aerospace & Defense Coordinates', risk: 4, color: '#10B981', status: 'Hardened' },
                  { id: 'supply', sector: 'Maritime Logistics & Supply Transit', risk: 36, color: '#E5C07B', status: 'Mitigating' },
                ].map((sec) => {
                  const isCurrent = sec.id === sectorKey;
                  return (
                    <div 
                      key={sec.id}
                      style={{
                        padding: '0.4rem 0.6rem',
                        borderRadius: '8px',
                        background: isCurrent ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                        border: isCurrent ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid transparent'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <span style={{ color: isCurrent ? '#FFFFFF' : '#CBD5E1', fontWeight: isCurrent ? 800 : 600 }}>
                          {sec.sector} {isCurrent && '★'}
                        </span>
                        <span style={{ color: sec.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                          {sec.risk}% Exposure ({sec.status})
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: `${sec.risk}%`,
                          height: '100%',
                          background: `linear-gradient(90deg, #10B981 0%, ${sec.color} 100%)`,
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'reasoning' && (
            <div>
              <div style={{ fontSize: '0.66rem', color: '#94A3B8', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                NVIDIA Nemotron-3 120B Synthesized Reasoning Trace // Active Sector: {activeSector?.name || 'Central Banking'}
              </div>
              <div style={{
                background: 'rgba(6, 14, 18, 0.9)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '10px',
                padding: '0.9rem',
                fontSize: '0.78rem',
                lineHeight: 1.55,
                color: '#CBD5E1',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                <div style={{ color: '#E5C07B', marginBottom: '0.35rem', fontWeight: 700 }}>
                  &gt; REASONING_KERNEL: Intercept Analysis Completed (Confidence: 99.87%)
                </div>
                <div style={{ color: '#94A3B8' }}>
                  {activeSector 
                    ? `Sector context "${activeSector.name}" (${activeSector.code}) evaluated. Anomaly candidate "${currentTemplate.type}" isolated. ${currentTemplate.desc}. Autonomous circuit breaker deployed.`
                    : 'Cross-sector correlation evaluated across 14 sovereign data streams. Anomaly isolated to offshore clearing vector TR-9021. Autonomous counter-measure dispatched.'
                  }
                </div>
                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.7rem', paddingTop: '0.7rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.7rem' }}>
                  <span style={{ color: '#10B981' }}>✔ SHAP Weight: {currentTemplate.shap}</span>
                  <span style={{ color: '#34D399' }}>✔ Audit Immutable</span>
                  <span style={{ color: '#E5C07B' }}>✔ Latency: {activeSector?.latency || '4.2 ms'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Telemetry Stamp */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.4rem',
          background: 'rgba(6, 13, 18, 0.96)',
          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
          fontSize: '0.66rem',
          color: '#94A3B8',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={11} color="#10B981" />
            <span>FIPS 140-3 LEVEL 4 QUANTUM HARDENED</span>
          </div>
          <span style={{ color: '#E5C07B' }}>IPRAP SOVEREIGN MATRIX</span>
        </div>

      </div>

    </div>
  );
};
export default EnterpriseCommandPreview;
