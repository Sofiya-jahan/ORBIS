import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { GraduationCap, Users, BookOpen, Brain, TrendingUp } from 'lucide-react';

const studentData = [
  { term: 'Fall 24', success: 85, risk: 15 },
  { term: 'Spring 25', success: 88, risk: 12 },
  { term: 'Fall 25', success: 92, risk: 8 },
  { term: 'Spring 26', success: 95, risk: 5 },
];

const CollegeDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="neo-card" style={{ 
        position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '3rem',
        background: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop") center/cover no-repeat'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(91,61,245,0.95) 0%, rgba(91,61,245,0.6) 50%, transparent 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'white' }}>
            <GraduationCap size={24} />
            <span style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Smart Campus AI</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: '1.2' }}>
            Predictive Student <br/>Success Models
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>
            Analyzing engagement, attendance, and academic markers to predict and prevent student dropout rates.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Enrolled Students', value: '45,210', change: '+2%', icon: Users, color: '#5B3DF5' },
          { label: 'At-Risk Students', value: '1,240', change: '-15%', icon: Brain, color: '#ef4444' },
          { label: 'Active Courses', value: '3,450', change: '+5%', icon: BookOpen, color: '#10b981' },
          { label: 'Avg Graduation Prediction', value: '94%', change: '+1.2%', icon: TrendingUp, color: '#f59e0b' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card animate-fade-in-delayed" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderTop: `2px solid ${kpi.color}` }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{kpi.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: kpi.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.change} vs last year
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="neo-card" style={{ padding: '1.5rem', height: '400px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Student Success Trajectory</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={studentData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
            <XAxis dataKey="term" stroke="var(--text-secondary)" />
            <YAxis stroke="var(--text-secondary)" />
            <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-primary)', borderRadius: '8px' }} />
            <Bar dataKey="success" stackId="a" fill="var(--primary)" name="Success Rate %" />
            <Bar dataKey="risk" stackId="a" fill="var(--danger)" name="At-Risk %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CollegeDashboard;
