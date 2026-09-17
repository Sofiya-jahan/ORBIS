import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Building2, Users, ShieldAlert, Activity, FileText } from 'lucide-react';

const publicServiceData = [
  { area: 'Transport', issues: 120, resolved: 100 },
  { area: 'Utilities', issues: 80, resolved: 65 },
  { area: 'Security', issues: 45, resolved: 40 },
  { area: 'Health', issues: 150, resolved: 130 },
];

const GovernmentDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="neo-card" style={{ 
        position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '3rem',
        background: 'url("https://images.unsplash.com/photo-1523292562811-8fa7962ba5c2?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(69,90,100,0.95) 0%, rgba(69,90,100,0.6) 50%, transparent 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'white' }}>
            <Building2 size={24} />
            <span style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Public Sector AI</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: '1.2' }}>
            Smart City <br/>Resource Analytics
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Monitoring public service requests, predicting infrastructural risks, and optimizing city resources.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Active Reports', value: '4,521', change: '-12%', icon: FileText, color: '#455A64' },
          { label: 'Critical Infrastructures', value: '8', change: '+2', icon: ShieldAlert, color: '#ef4444' },
          { label: 'Citizen Satisfaction', value: '88%', change: '+5%', icon: Users, color: '#10b981' },
          { label: 'Resource Load', value: '76%', change: '-4%', icon: Activity, color: '#f59e0b' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card animate-fade-in-delayed" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderTop: `2px solid ${kpi.color}` }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{kpi.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: kpi.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.change} vs last month
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="neo-card" style={{ padding: '1.5rem', height: '400px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Public Service Request Resolution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={publicServiceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="area" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }} />
            <Bar dataKey="issues" fill="var(--primary)" fillOpacity={0.3} name="Total Issues" />
            <Bar dataKey="resolved" fill="var(--primary)" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
