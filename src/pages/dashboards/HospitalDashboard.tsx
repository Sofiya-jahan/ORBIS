import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ComposedChart, Bar, Line, Legend
} from 'recharts';
import { Users, AlertCircle, Activity, HeartPulse, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

// Sample Data
const riskTrendData = [
  { time: '00:00', critical: 12, moderate: 45, low: 120 },
  { time: '04:00', critical: 8, moderate: 30, low: 90 },
  { time: '08:00', critical: 25, moderate: 80, low: 200 },
  { time: '12:00', critical: 30, moderate: 95, low: 250 },
  { time: '16:00', critical: 20, moderate: 70, low: 180 },
  { time: '20:00', critical: 15, moderate: 50, low: 140 },
  { time: '24:00', critical: 10, moderate: 40, low: 110 },
];

const diseaseDistData = [
  { name: 'Cardiology', value: 400, color: '#0B6EFD' },
  { name: 'Neurology', value: 300, color: '#3EC6FF' },
  { name: 'Oncology', value: 300, color: '#00E0FF' },
  { name: 'Orthopedics', value: 200, color: '#455A64' },
];

const resourceData = [
  { subject: 'ICU Beds', A: 120, fullMark: 150 },
  { subject: 'Ventilators', A: 98, fullMark: 150 },
  { subject: 'Staff', A: 86, fullMark: 150 },
  { subject: 'Ambulances', A: 99, fullMark: 150 },
  { subject: 'Medication', A: 85, fullMark: 150 },
  { subject: 'Surgical Ops', A: 65, fullMark: 150 },
];

const performanceData = [
  { name: 'Dr. Smith', patients: 120, avgTime: 15, satisfaction: 4.8 },
  { name: 'Dr. Patel', patients: 98, avgTime: 22, satisfaction: 4.5 },
  { name: 'Dr. Lee', patients: 145, avgTime: 12, satisfaction: 4.9 },
  { name: 'Dr. Jones', patients: 80, avgTime: 30, satisfaction: 4.2 },
];

const HospitalDashboard = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Immersive Hero Section */}
      <div className="neo-card" style={{ 
        position: 'relative', height: '280px', borderRadius: '24px', overflow: 'hidden',
        display: 'flex', alignItems: 'center', padding: '3rem',
        background: 'url("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop") center/cover no-repeat'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,6,23,0.9) 0%, rgba(2,6,23,0.6) 50%, transparent 100%)', zIndex: 1 }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
            <Activity size={24} />
            <span style={{ fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.875rem' }}>AI Healthcare Intelligence</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem', lineHeight: '1.2' }}>
            Predictive Patient <br/>Risk Analytics
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.1rem' }}>
            Real-time cognitive monitoring of ward vitals, predicting clinical deterioration up to 8 hours in advance.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Active Patients', value: '1,432', change: '+12%', icon: Users, color: '#0B6EFD' },
          { label: 'Critical Cases', value: '45', change: '-5%', icon: AlertCircle, color: '#ef4444' },
          { label: "Today's Admissions", value: '128', change: '+24%', icon: HeartPulse, color: '#10b981' },
          { label: 'Avg System AI Risk', value: '14.2%', change: '-2.1%', icon: TrendingUp, color: '#f59e0b' }
        ].map((kpi, i) => (
          <div key={i} className="glass-card animate-fade-in-delayed" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>{kpi.label}</div>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{kpi.value}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: kpi.change.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.change} from yesterday
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <kpi.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Real-time Risk Timeline (Area) */}
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--primary)" /> 24-Hour Patient Risk Trajectory
          </h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={riskTrendData}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorModerate" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
                <Area type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorCritical)" />
                <Area type="monotone" dataKey="moderate" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorModerate)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Disease Distribution (Donut) */}
        <div className="neo-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Admissions by Department</h3>
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={diseaseDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {diseaseDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
              {diseaseDistData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '4px', backgroundColor: d.color }}></div>
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        
        {/* Resource Allocation (Radar) */}
        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Resource Saturation</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={resourceData}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Radar name="Usage" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Performance (Composed Chart) */}
        <div className="neo-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem' }}>Physician Performance Metrics</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="patients" barSize={40} fill="var(--primary)" radius={[4, 4, 0, 0]} name="Patients Treated" />
                <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="var(--success)" strokeWidth={3} name="Satisfaction Score (out of 5)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HospitalDashboard;
