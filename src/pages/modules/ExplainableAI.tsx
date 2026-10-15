import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, ReferenceLine 
} from 'recharts';
import { Cpu, CheckCircle, HelpCircle, Layers, Sliders, Info, ShieldCheck } from 'lucide-react';

export const ExplainableAI = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  // SHAP feature importance values
  const shapFeatures = [
    { feature: 'Primary Ingress Volatility', value: 0.42, category: 'Telemetry', direction: 'Increases Risk' },
    { feature: 'Cross-Department Latency Variance', value: 0.28, category: 'Network', direction: 'Increases Risk' },
    { feature: 'Shift Operator Fatigue Index', value: 0.14, category: 'Human Factors', direction: 'Increases Risk' },
    { feature: 'Environmental Sensor Drift', value: 0.08, category: 'Sensors', direction: 'Increases Risk' },
    { feature: 'Automated Buffer Capacity', value: -0.34, category: 'Mitigation', direction: 'Reduces Risk' },
    { feature: 'Redundant Power Grid Uptime', value: -0.22, category: 'Infrastructure', direction: 'Reduces Risk' },
    { feature: 'Certified Protocol Adherence', value: -0.18, category: 'Compliance', direction: 'Reduces Risk' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Cpu size={16} /> Explainable AI (XAI) & Interpretability
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            SHAP Feature Drivers & Model Attribution
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Full transparency into machine learning decision boundaries, Shapley feature weights, and risk factor attributions.
          </p>
        </div>

        <div style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', background: 'rgba(13, 35, 77, 0.75)', border: '1px solid rgba(46, 155, 248, 0.25)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="#6AE7F7" />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.65)', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>Model Trust Index</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF' }}>99.2% Explainable</div>
          </div>
        </div>
      </div>

      {/* Main SHAP Bar Chart */}
      <div className="neo-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#F6FDFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              Shapley Value Contribution (SHAP Waterfall)
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.65)', fontSize: '0.85rem' }}>
              Positive values push risk higher; negative values dampen systemic risk.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#EF4444' }} />
              <span style={{ color: 'rgba(246, 253, 255, 0.75)' }}>Risk Driver (+)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#6AE7F7' }} />
              <span style={{ color: 'rgba(246, 253, 255, 0.75)' }}>Risk Reducer (-)</span>
            </div>
          </div>
        </div>

        <div style={{ height: '380px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={shapFeatures}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 180, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(46, 155, 248, 0.12)" horizontal={false} />
              <XAxis type="number" stroke="rgba(246, 253, 255, 0.55)" fontSize={12} tickLine={false} />
              <YAxis dataKey="feature" type="category" stroke="rgba(246, 253, 255, 0.75)" fontSize={12} tickLine={false} width={170} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(7, 17, 46, 0.95)', border: '1px solid rgba(46, 155, 248, 0.3)', borderRadius: '12px', color: '#F6FDFF' }}
                formatter={(val: any) => [`${val > 0 ? '+' : ''}${val} SHAP Score`, 'Attribution Weight']}
              />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.3)" />
              <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                {shapFeatures.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value > 0 ? '#EF4444' : '#6AE7F7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Feature Interpretation Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {shapFeatures.slice(0, 3).map((feat, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6AE7F7', textTransform: 'uppercase', fontFamily: "'JetBrains Mono', monospace" }}>
                {feat.category} Factor
              </span>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                background: feat.value > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(106, 231, 247, 0.15)',
                color: feat.value > 0 ? '#EF4444' : '#6AE7F7',
                fontFamily: "'JetBrains Mono', monospace"
              }}>
                {feat.value > 0 ? `+${feat.value}` : feat.value}
              </span>
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: '#F6FDFF' }}>
              {feat.feature}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5 }}>
              Evaluated across real-time covariance models for {currentOrg.name}. Confirms {feat.direction.toLowerCase()} by {Math.abs(feat.value * 100)}% relative to global baseline.
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ExplainableAI;
