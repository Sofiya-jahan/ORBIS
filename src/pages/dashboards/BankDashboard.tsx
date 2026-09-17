import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Cell, AreaChart, Area
} from 'recharts';
import { Landmark, TrendingUp, AlertTriangle, ShieldCheck, DollarSign, Activity } from 'lucide-react';

// Sample Data
const fraudTrendData = [
  { day: 'Mon', attempts: 120, prevented: 118, loss: 2 },
  { day: 'Tue', attempts: 240, prevented: 235, loss: 5 },
  { day: 'Wed', attempts: 150, prevented: 148, loss: 2 },
  { day: 'Thu', attempts: 320, prevented: 310, loss: 10 },
  { day: 'Fri', attempts: 210, prevented: 205, loss: 5 },
  { day: 'Sat', attempts: 180, prevented: 178, loss: 2 },
  { day: 'Sun', attempts: 140, prevented: 139, loss: 1 },
];

const transactionVolume = [
  { time: '09:00', volume: 4000 },
  { time: '12:00', volume: 8500 },
  { time: '15:00', volume: 6200 },
  { time: '18:00', volume: 9000 },
  { time: '21:00', volume: 3000 },
];

const BankDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Premium Hero Section */}
      <div className="neo-card" style={{ 
        position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '3rem',
        background: 'url("https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,8,19,0.95) 0%, rgba(2,8,19,0.7) 60%, transparent 100%)', zIndex: 1 }} />
        
        {/* Animated grid background effect */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px', zIndex: 1, opacity: 0.5 }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '650px' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--accent)' }}>
            <Landmark size={24} />
            <span style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Financial Risk Intelligence</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: '1.2' }}>
            Next-Gen Fraud <br/>Detection Models
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
            Monitoring 1.2M transactions per second with advanced cognitive AI to prevent financial anomalies in real-time.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Fraud Prevented', value: '$2.4M', change: '+14%', icon: ShieldCheck, color: '#10b981' },
          { label: 'Active Threats', value: '12', change: '-3', icon: AlertTriangle, color: '#ef4444' },
          { label: 'Transaction Vol', value: '142k/hr', change: '+5%', icon: Activity, color: '#0B6EFD' },
          { label: 'Model Confidence', value: '99.2%', change: '+0.1%', icon: TrendingUp, color: '#FFD700' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card animate-fade-in-delayed" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderTop: `2px solid ${kpi.color}` }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{kpi.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: kpi.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.change} vs last week
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Fraud Prevention Trend (Bar + Line) */}
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={18} color="var(--primary)" /> 7-Day Fraud Prevention Analytics
          </h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fraudTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  cursor={{ fill: 'var(--bg-tertiary)' }}
                />
                <Bar dataKey="attempts" fill="var(--secondary)" radius={[4, 4, 0, 0]} name="Total Attempts" />
                <Bar dataKey="prevented" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Prevented" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-time Volume (Area) */}
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Global Transaction Vol</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transactionVolume}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Transaction List */}
      <div className="neo-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Flagged Transactions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.875rem' }}>ID</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.875rem' }}>Location</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.875rem' }}>Amount</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.875rem' }}>AI Risk Score</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'TXN-8842', loc: 'Moscow, RU', amt: '$42,500.00', risk: 94, status: 'Blocked' },
                { id: 'TXN-8843', loc: 'London, UK', amt: '$1,200.00', risk: 45, status: 'Review' },
                { id: 'TXN-8844', loc: 'New York, US', amt: '$8,400.00', risk: 88, status: 'Blocked' },
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={{ padding: '1rem', fontWeight: '500', color: 'var(--primary)' }}>{row.id}</td>
                  <td style={{ padding: '1rem' }}>{row.loc}</td>
                  <td style={{ padding: '1rem', fontWeight: '600' }}>{row.amt}</td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ flex: 1, height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.risk}%`, height: '100%', background: row.risk > 80 ? 'var(--danger)' : 'var(--warning)' }} />
                      </div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{row.risk}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600',
                      background: row.status === 'Blocked' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: row.status === 'Blocked' ? 'var(--danger)' : 'var(--warning)'
                    }}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default BankDashboard;
