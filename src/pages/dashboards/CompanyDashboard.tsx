import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { Briefcase, TrendingUp, AlertTriangle, Building2, BarChart2 } from 'lucide-react';

const revenueRiskData = [
  { month: 'Jan', projected: 4000, actual: 3800, risk: 200 },
  { month: 'Feb', projected: 4500, actual: 4600, risk: 0 },
  { month: 'Mar', projected: 4200, actual: 3900, risk: 300 },
  { month: 'Apr', projected: 5000, actual: 4800, risk: 200 },
];

const CompanyDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="neo-card" style={{ 
        position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '3rem',
        background: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,128,96,0.95) 0%, rgba(0,128,96,0.6) 50%, transparent 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'white' }}>
            <Briefcase size={24} />
            <span style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Enterprise Intelligence</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: '1.2' }}>
            Corporate Risk <br/>& Revenue Modeling
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Predictive modeling of operational bottlenecks and revenue forecasting using enterprise-wide data.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Total Revenue', value: '$24.5M', change: '+8%', icon: TrendingUp, color: '#10B981' },
          { label: 'Operational Risks', value: '14', change: '-2', icon: AlertTriangle, color: '#ef4444' },
          { label: 'Active Projects', value: '128', change: '+12%', icon: Briefcase, color: '#3b82f6' },
          { label: 'Resource Efficiency', value: '92%', change: '+4%', icon: BarChart2, color: '#f59e0b' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card animate-fade-in-delayed" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderTop: `2px solid ${kpi.color}` }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{kpi.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: kpi.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.change} vs last quarter
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="neo-card" style={{ padding: '1.5rem', height: '400px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Revenue vs Risk Forecast</h3>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueRiskData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }} />
            <Area type="monotone" dataKey="projected" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} name="Projected Rev" />
            <Area type="monotone" dataKey="actual" stroke="var(--success)" fill="var(--success)" fillOpacity={0.2} name="Actual Rev" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CompanyDashboard;
