import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  BarChart2, Layers, TrendingUp, Activity, 
  Download, Calendar, Filter, Sparkles 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, RadarChart, 
  PolarGrid, PolarAngleAxis, Radar, ComposedChart, Line 
} from 'recharts';

export const EnterpriseAnalytics = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  const departmentData = currentOrg.departments.map((dept, i) => ({
    name: dept,
    riskScore: 12 + (i * 9) % 35,
    efficiency: 85 + (i * 4) % 15,
    compliance: 92 + (i * 3) % 8,
    incidents: 1 + (i % 4)
  }));

  const radarData = [
    { metric: 'Cyber Security Posture', value: 96, fullMark: 100 },
    { metric: 'Operational Resilience', value: 92, fullMark: 100 },
    { metric: 'Regulatory Compliance', value: 99, fullMark: 100 },
    { metric: 'Supply Continuity', value: 88, fullMark: 100 },
    { metric: 'Workforce Wellness', value: 91, fullMark: 100 },
    { metric: 'Financial Risk Buffer', value: 94, fullMark: 100 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <BarChart2 size={16} /> Advanced Analytics & Intelligence
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Cross-Departmental Performance & Risk Heatmaps
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Comprehensive multi-dimensional evaluation across all operating units in {currentOrg.name}.
          </p>
        </div>

        <button 
          onClick={() => alert('Generating full multidimensional analytics bundle...')}
          className="btn btn-primary"
          style={{ background: currentOrg.themeColor }}
        >
          <Download size={16} /> Export Raw Datasets
        </button>
      </div>

      {/* Primary Analytics Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Department Comparison Bar */}
        <div className="neo-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                Department Risk vs. Operational Efficiency
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                Normalized scores across all operating divisions
              </p>
            </div>
            <span className="badge badge-primary">{currentOrg.departments.length} Units Benchmarked</span>
          </div>

          <div style={{ height: '340px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
                <Bar dataKey="riskScore" fill="#EF4444" radius={[6, 6, 0, 0]} name="Risk Index" />
                <Bar dataKey="efficiency" fill={currentOrg.themeColor} radius={[6, 6, 0, 0]} name="Operational Efficiency %" />
                <Line type="monotone" dataKey="compliance" stroke="#6AE7F7" strokeWidth={3} name="Compliance Adherence %" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enterprise Radar */}
        <div className="neo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.25rem', color: '#F6FDFF', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              6-Pillar Resilience Radar
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.65)', fontSize: '0.82rem' }}>
              Overall structural health breakdown
            </p>
          </div>

          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="rgba(46, 155, 248, 0.15)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(246, 253, 255, 0.75)', fontSize: 10 }} />
                <Radar name="Pillar Health" dataKey="value" stroke="#6AE7F7" fill="#1554E8" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6AE7F7', fontWeight: '700', fontFamily: "'JetBrains Mono', monospace" }}>
            Enterprise Resilience Index: 93.3% (Top 5th Percentile)
          </div>
        </div>

      </div>

    </div>
  );
};

export default EnterpriseAnalytics;
