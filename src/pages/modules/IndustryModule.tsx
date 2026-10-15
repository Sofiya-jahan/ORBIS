import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Cpu, Activity, TrendingUp, AlertTriangle, CheckCircle2, 
  ShieldCheck, ArrowRight, ArrowUpRight, ArrowDownRight, 
  Sparkles, Layers, Sliders, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const IndustryModule = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { organization } = useAuthStore();
  
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentModule = currentOrg.industryModules.find(m => m.id === moduleId) || currentOrg.industryModules[0];

  const chartData = [
    { time: '00:00', value: 84, benchmark: 90 },
    { time: '04:00', value: 88, benchmark: 90 },
    { time: '08:00', value: 94, benchmark: 90 },
    { time: '12:00', value: 92, benchmark: 90 },
    { time: '16:00', value: 96, benchmark: 90 },
    { time: '20:00', value: 98, benchmark: 90 },
    { time: '24:00', value: 97, benchmark: 90 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderLeft: `6px solid ${currentOrg.themeColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: currentOrg.themeColor, fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Cpu size={16} /> {currentOrg.name} &bull; Sector Specific Intelligence
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '0.6rem' }}>
              {currentModule.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '720px', lineHeight: 1.6 }}>
              {currentModule.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Alert Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: currentModule.activeAlertsCount > 0 ? '#EF4444' : '#6AE7F7' }}>
                {currentModule.activeAlertsCount > 0 ? `${currentModule.activeAlertsCount} Priority Signals` : 'Nominal (0 Alerts)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Main KPIs from Module Definition */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[currentModule.kpi1, currentModule.kpi2, currentModule.kpi3].map((kpi, idx) => (
          <div key={idx} className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
              {kpi.label}
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', color: '#FFFFFF', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>
              {kpi.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: '700', color: kpi.positive ? 'var(--success)' : 'var(--warning)' }}>
              {kpi.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Real-Time Telemetry Curve */}
      <div className="neo-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              24-Hour Real-Time Telemetry Index
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Live continuous telemetry stream with anomaly bounding thresholds
            </p>
          </div>
          <span className="badge badge-success">Telemetry Live (1,000Hz)</span>
        </div>

        <div style={{ height: '340px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="moduleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentOrg.themeColor} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={currentOrg.themeColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} domain={[60, 100]} />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px' }} />
              <Area type="monotone" dataKey="value" stroke={currentOrg.themeColor} strokeWidth={3} fillOpacity={1} fill="url(#moduleGrad)" name="Operating Performance Index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Other Sector Modules Quick Switcher */}
      <div className="neo-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '1rem' }}>
          Other {currentOrg.name.split('&')[0]} Modules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {currentOrg.industryModules.filter(m => m.id !== currentModule.id).map(m => (
            <div
              key={m.id}
              onClick={() => navigate(`/dashboard/industry/${m.id}`)}
              style={{
                padding: '1.25rem',
                borderRadius: '14px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = currentOrg.themeColor;
                e.currentTarget.style.background = 'var(--primary-light)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--bg-tertiary)';
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#FFFFFF', marginBottom: '0.25rem' }}>
                {m.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                {m.kpi1.label}: <strong style={{ color: 'var(--text-primary)' }}>{m.kpi1.value}</strong>
              </div>
              <span style={{ fontSize: '0.8rem', color: currentOrg.themeColor, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                Launch Module <ArrowRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default IndustryModule;
