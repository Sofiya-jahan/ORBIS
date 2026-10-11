import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Activity, Cpu, AlertTriangle, TrendingUp, 
  CheckCircle2, Lock, Zap, Layers, RefreshCw, BarChart3,
  Server, Shield, Radio, Terminal
} from 'lucide-react';

interface ThreatFeedItem {
  id: string;
  time: string;
  sector: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'Intercepted' | 'Neutralized' | 'Analyzing' | 'Contained';
}

const INITIAL_FEEDS: ThreatFeedItem[] = [
  { id: 'TR-9021', time: '14:22:04', sector: 'Central Banking', type: 'Synthetic Liquidity Shock', severity: 'critical', status: 'Intercepted' },
  { id: 'TR-9022', time: '14:21:49', sector: 'Power Grid', type: 'SCADA Harmonic Drift', severity: 'medium', status: 'Neutralized' },
  { id: 'TR-9023', time: '14:21:12', sector: 'Healthcare', type: 'Telemetry Ingress Anomaly', severity: 'low', status: 'Contained' },
  { id: 'TR-9024', time: '14:20:38', sector: 'Aerospace', type: 'Orbital Packet Desync', severity: 'high', status: 'Intercepted' },
];

export const EnterpriseCommandPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'matrix' | 'reasoning'>('live');
  const [healthScore, setHealthScore] = useState(99.4);
  const [feedItems, setFeedItems] = useState<ThreatFeedItem[]>(INITIAL_FEEDS);
  const [pulseCount, setPulseCount] = useState(1842);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseCount(prev => prev + Math.floor(Math.random() * 5) + 1);
      setHealthScore(prev => {
        const delta = (Math.random() - 0.5) * 0.2;
        return parseFloat(Math.min(99.9, Math.max(98.8, prev + delta)).toFixed(1));
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: '620px',
      margin: '0 auto',
      position: 'relative',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      
      {/* Ambient Glow Backdrop */}
      <div style={{
        position: 'absolute',
        inset: '-20px',
        background: 'radial-gradient(circle at 60% 40%, rgba(16, 185, 129, 0.18) 0%, rgba(229, 192, 123, 0.08) 50%, transparent 75%)',
        filter: 'blur(40px)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* Main Grounded Command Terminal Console */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'rgba(9, 18, 23, 0.92)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(16, 185, 129, 0.35)',
        borderRadius: '24px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.85), 0 0 45px rgba(16, 185, 129, 0.15)',
        overflow: 'hidden'
      }}>
        
        {/* Terminal Title Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.1rem 1.6rem',
          background: 'rgba(6, 13, 17, 0.95)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              boxShadow: '0 0 10px #10B981'
            }} />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                IPRAP // SOVEREIGN RISK SENTINEL
              </div>
              <div style={{ fontSize: '0.65rem', color: '#34D399', fontFamily: "'Space Mono', monospace", letterSpacing: '1px' }}>
                SURVEILLANCE NODE v4.8 • CONTINUOUS REASONING
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '0.3rem 0.8rem'
          }}>
            <Radio size={12} color="#10B981" />
            <span style={{ fontSize: '0.68rem', color: '#E2E8F0', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
              {pulseCount.toLocaleString()} OPS/SEC
            </span>
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
          <div style={{ padding: '1rem 1.4rem', background: 'rgba(9, 18, 23, 0.95)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>
              System Health
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#10B981', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
              {healthScore}%
            </div>
            <div style={{ fontSize: '0.65rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <CheckCircle2 size={10} /> Nominal Lattice
            </div>
          </div>

          <div style={{ padding: '1rem 1.4rem', background: 'rgba(9, 18, 23, 0.95)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>
              Containment Latency
            </div>
            <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#E5C07B', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
              4.6 ms
            </div>
            <div style={{ fontSize: '0.65rem', color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
              <Zap size={10} /> Zero-Lag Intercept
            </div>
          </div>

          <div style={{ padding: '1rem 1.4rem', background: 'rgba(9, 18, 23, 0.95)' }}>
            <div style={{ fontSize: '0.62rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace", textTransform: 'uppercase', letterSpacing: '1px' }}>
              AI Model Engine
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Times New Roman', Times, serif", marginTop: '4px' }}>
              Nemotron-3
            </div>
            <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginTop: '2px' }}>
              120B Dual Reasoning
            </div>
          </div>
        </div>

        {/* Tab Navigator */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          padding: '0.5rem 1.4rem 0 1.4rem',
          gap: '1rem',
          background: 'rgba(7, 15, 19, 0.85)'
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
                  padding: '0.65rem 0.5rem',
                  border: 'none',
                  background: 'none',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  fontFamily: "'Times New Roman', Times, serif",
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
        <div style={{ padding: '1.4rem', minHeight: '260px' }}>
          {activeTab === 'live' && (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.9rem',
                fontSize: '0.68rem',
                fontFamily: "'Space Mono', monospace",
                color: '#94A3B8',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                <span>Real-Time Intercept Log</span>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <RefreshCw size={10} className="animate-spin" /> Auto-sync 100ms
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {feedItems.map(item => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      background: 'rgba(12, 24, 30, 0.7)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      borderRadius: '12px',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: item.severity === 'critical' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        border: `1px solid ${item.severity === 'critical' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.35)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.severity === 'critical' ? '#F87171' : '#34D399',
                        flexShrink: 0
                      }}>
                        {item.severity === 'critical' ? <AlertTriangle size={15} /> : <ShieldCheck size={15} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF' }}>
                          {item.type}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace" }}>
                          {item.sector} • <span style={{ color: '#E5C07B' }}>{item.id}</span> • {item.time}
                        </div>
                      </div>
                    </div>

                    <div style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      color: '#34D399',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      fontFamily: "'Space Mono', monospace"
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
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginBottom: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Multi-Sector Risk Variance Distribution
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { sector: 'Central Banking & Sovereign Capital', risk: 14, color: '#10B981', status: 'Secured' },
                  { sector: 'Power Grid SCADA Telemetry', risk: 22, color: '#34D399', status: 'Optimal' },
                  { sector: 'Metropolitan Healthcare Systems', risk: 8, color: '#10B981', status: 'Optimal' },
                  { sector: 'Maritime Logistics & Supply Transit', risk: 36, color: '#E5C07B', status: 'Mitigating' },
                  { sector: 'Aerospace & Defense Coordinates', risk: 4, color: '#10B981', status: 'Hardened' },
                ].map((sec, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                      <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{sec.sector}</span>
                      <span style={{ color: sec.color, fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                        {sec.risk}% Exposure ({sec.status})
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${sec.risk}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, #10B981 0%, ${sec.color} 100%)`,
                        borderRadius: '3px'
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reasoning' && (
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94A3B8', fontFamily: "'Space Mono', monospace", marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                NVIDIA Nemotron-3 120B Synthesized Reasoning Trace
              </div>
              <div style={{
                background: 'rgba(6, 14, 18, 0.85)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1rem',
                fontSize: '0.82rem',
                lineHeight: 1.6,
                color: '#CBD5E1',
                fontFamily: "'Space Mono', monospace"
              }}>
                <div style={{ color: '#E5C07B', marginBottom: '0.4rem', fontWeight: 700 }}>
                  &gt; REASONING_KERNEL: Intercept Analysis Completed (Confidence: 99.84%)
                </div>
                <div style={{ color: '#94A3B8' }}>
                  Cross-sector correlation evaluated across 14 sovereign data streams. Anomaly isolated to offshore clearing vector TR-9021. Autonomous counter-measure dispatched. No cascading liquidity contagion detected.
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '0.72rem' }}>
                  <span style={{ color: '#10B981' }}>✔ SHAP Value: +0.89</span>
                  <span style={{ color: '#34D399' }}>✔ Audit Trail Immutable</span>
                  <span style={{ color: '#E5C07B' }}>✔ Zero Human Latency</span>
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
          padding: '0.8rem 1.4rem',
          background: 'rgba(6, 13, 17, 0.95)',
          borderTop: '1px solid rgba(16, 185, 129, 0.2)',
          fontSize: '0.68rem',
          color: '#94A3B8',
          fontFamily: "'Space Mono', monospace"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={12} color="#10B981" />
            <span>FIPS 140-3 LEVEL 4 QUANTUM HARDENED</span>
          </div>
          <span style={{ color: '#E5C07B' }}>IPRAP SOVEREIGN MATRIX</span>
        </div>

      </div>

    </div>
  );
};
export default EnterpriseCommandPreview;
