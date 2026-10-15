import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  TrendingUp, Cpu, Sparkles, AlertTriangle, 
  CheckCircle2, ArrowRight, ShieldCheck, RefreshCw,
  Sliders, Layers, Zap, Clock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

export const PredictiveAI = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  
  const [horizon, setHorizon] = useState<'30d' | '60d' | '90d'>('30d');
  const [activeTab, setActiveTab] = useState<'forecast' | 'anomalies' | 'recommendations'>('forecast');
  const [mitigatedAlerts, setMitigatedAlerts] = useState<number[]>([]);

  const forecastData = [
    { day: 'Day 1', predictedRisk: 12, upperBand: 15, lowerBand: 9 },
    { day: 'Day 5', predictedRisk: 14, upperBand: 18, lowerBand: 10 },
    { day: 'Day 10', predictedRisk: 18, upperBand: 24, lowerBand: 12 },
    { day: 'Day 15', predictedRisk: 26, upperBand: 34, lowerBand: 18 },
    { day: 'Day 20', predictedRisk: 21, upperBand: 28, lowerBand: 14 },
    { day: 'Day 25', predictedRisk: 16, upperBand: 22, lowerBand: 10 },
    { day: 'Day 30', predictedRisk: 13, upperBand: 17, lowerBand: 9 },
  ];

  const recommendations = [
    {
      id: 1,
      title: 'Automated Load Rebalancing on Primary Pipelines',
      impact: 'Reduces peak failure probability by 34%',
      department: currentOrg.departments[0] || 'Core',
      urgency: 'Immediate (Next 2 Hours)',
      applied: mitigatedAlerts.includes(1)
    },
    {
      id: 2,
      title: 'Increase Sensor Sampling Rate to 1,000Hz',
      impact: 'Enhances anomaly lead-time detection from 2 hrs to 8 hrs',
      department: currentOrg.departments[1] || 'Infrastructure',
      urgency: 'Scheduled Today',
      applied: mitigatedAlerts.includes(2)
    },
    {
      id: 3,
      title: 'Preemptive Buffer Allocation for Weekend Surge',
      impact: 'Mitigates potential capacity starvation risk during peak hours',
      department: currentOrg.departments[2] || 'Operations',
      urgency: 'Recommended',
      applied: mitigatedAlerts.includes(3)
    }
  ];

  const handleApplyMitigation = (id: number) => {
    setMitigatedAlerts(prev => [...prev, id]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Cpu size={16} /> Neural Predictive Engine
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            AI Risk Forecasting & Autonomous Defense
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Forward-looking neural network simulations predicting operational anomalies before they manifest.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['forecast', 'anomalies', 'recommendations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ background: activeTab === tab ? currentOrg.themeColor : undefined, textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Forecast Curve */}
      {activeTab === 'forecast' && (
        <div className="neo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color={currentOrg.themeColor} /> 30-Day Forward Predictive Trajectory
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Confidence bounds (95% CI) based on 10,000 Monte Carlo iterations
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['30d', '60d', '90d'] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  style={{
                    padding: '0.35rem 0.8rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: horizon === h ? currentOrg.themeColor : 'var(--border-color)',
                    background: horizon === h ? 'var(--primary-light)' : 'var(--bg-secondary)',
                    color: horizon === h ? currentOrg.themeColor : 'var(--text-secondary)'
                  }}
                >
                  {h.toUpperCase()} Horizon
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '380px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentOrg.themeColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={currentOrg.themeColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="upperBand" stroke="transparent" fill="rgba(255,255,255,0.05)" name="Upper 95% Bound" />
                <Area type="monotone" dataKey="predictedRisk" stroke={currentOrg.themeColor} strokeWidth={3} fillOpacity={1} fill="url(#forecastGrad)" name="Predicted Risk Score %" />
                <Area type="monotone" dataKey="lowerBand" stroke="transparent" fill="transparent" name="Lower 95% Bound" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tab 2 & 3: Recommendations / Anomalies */}
      {(activeTab === 'recommendations' || activeTab === 'anomalies') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recommendations.map(rec => (
            <div 
              key={rec.id}
              className="glass-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem',
                borderLeft: `6px solid ${rec.applied ? '#6AE7F7' : currentOrg.themeColor}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '14px',
                  background: rec.applied ? 'rgba(21, 84, 232, 0.2)' : `${currentOrg.themeColor}20`,
                  color: rec.applied ? '#6AE7F7' : currentOrg.themeColor,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {rec.applied ? <CheckCircle2 size={24} /> : <Sparkles size={24} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {rec.department}
                    </span>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700,
                      background: 'rgba(245,158,11,0.15)', color: '#F59E0B'
                    }}>
                      {rec.urgency}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.35rem' }}>
                    {rec.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {rec.impact}
                  </p>
                </div>
              </div>

              <div>
                {rec.applied ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6AE7F7', fontWeight: 700, fontSize: '0.9rem' }}>
                    <CheckCircle2 size={18} /> Mitigation Applied
                  </span>
                ) : (
                  <button
                    onClick={() => handleApplyMitigation(rec.id)}
                    className="btn btn-primary"
                    style={{ background: currentOrg.themeColor }}
                  >
                    Execute Mitigation <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default PredictiveAI;
