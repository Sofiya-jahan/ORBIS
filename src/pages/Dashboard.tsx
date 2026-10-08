import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, 
  PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, Legend, RadarChart, 
  PolarGrid, PolarAngleAxis, Radar 
} from 'recharts';
import { 
  ShieldCheck, ShieldAlert, Activity, TrendingUp, AlertTriangle, 
  Cpu, Users, Clock, CheckCircle2, ArrowUpRight, ArrowDownRight, 
  Sparkles, RefreshCw, FileText, ChevronRight, Layers, Eye, 
  Sliders, Bot, ExternalLink, Zap, Flame, Award, HeartPulse,
  Wrench, Building2, Landmark, Factory, Scale
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { organization, role, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTimeframe, setActiveTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];
  const roleCategory = currentRole?.roleCategory || 'executive';

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Mock Dynamic Telemetry Data based on timeframe
  const trajectoryData = [
    { time: '00:00', systemicRisk: 12, anomalyIndex: 8, confidence: 98 },
    { time: '04:00', systemicRisk: 10, anomalyIndex: 6, confidence: 97 },
    { time: '08:00', systemicRisk: 28, anomalyIndex: 22, confidence: 95 },
    { time: '12:00', systemicRisk: 34, anomalyIndex: 29, confidence: 94 },
    { time: '16:00', systemicRisk: 22, anomalyIndex: 18, confidence: 96 },
    { time: '20:00', systemicRisk: 18, anomalyIndex: 14, confidence: 98 },
    { time: '24:00', systemicRisk: 14, anomalyIndex: 9, confidence: 99 },
  ];

  const departmentRiskData = currentOrg.departments.map((dept, idx) => ({
    name: dept,
    score: Math.round(15 + (idx * 11) % 45),
    mitigated: Math.round(75 + (idx * 7) % 25)
  }));

  const riskDistributionData = [
    { name: 'Low Risk (Trivial)', value: 68, color: '#10B981' },
    { name: 'Moderate Exposure', value: 24, color: '#F59E0B' },
    { name: 'Critical Attention', value: 8, color: '#EF4444' }
  ];

  // 1. Employee / Specialist Minimal Focused Dashboard
  if (roleCategory === 'employee') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Welcome Header */}
        <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} /> {currentOrg.name} &bull; Operational Portal
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              Welcome, {user?.name || 'Specialist'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Your workspace is filtered to show your assigned active tasks, departmental alerts, and direct incident filings.
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/incidents')}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.9rem' }}
          >
            <AlertTriangle size={18} /> File New Incident
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              My Assigned Tasks
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              4 Pending
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              2 due before end of shift (17:00)
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Department Status
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#10B981', marginBottom: '0.5rem' }}>
              Optimal (98%)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Zero critical escalation flags
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Unread System Alerts
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#F59E0B', marginBottom: '0.5rem' }}>
              1 Alert
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Scheduled protocol maintenance at 22:00
            </div>
          </div>
        </div>

        {/* Assigned Tasks Table */}
        <div className="neo-card" style={{ padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} color={currentOrg.themeColor} /> Active Task Queue
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { title: 'Complete Shift Protocol Checklist', priority: 'High', due: 'In 2 hours', status: 'In Progress' },
              { title: 'Verify Sector Sensor Calibration', priority: 'Medium', due: 'In 4 hours', status: 'Pending' },
              { title: 'Acknowledge Monthly Safety Compliance Brief', priority: 'Low', due: 'Tomorrow', status: 'Pending' },
              { title: 'Inspect Emergency Backup Station', priority: 'High', due: 'In 1 hour', status: 'In Progress' }
            ].map((task, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '1rem 1.25rem', borderRadius: '12px', background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <CheckCircle2 size={18} color="var(--primary)" />
                  <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{task.title}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700',
                    background: task.priority === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: task.priority === 'High' ? '#EF4444' : '#F59E0B'
                  }}>
                    {task.priority} Priority
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Executive / Managerial / Technical Master Dashboards
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top Header & AI Executive Summary Banner */}
      <div className="glass-card animate-fade-in" style={{ 
        padding: '2.5rem', 
        position: 'relative', 
        overflow: 'hidden',
        borderLeft: `6px solid ${currentOrg.themeColor}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span className="badge badge-primary" style={{ background: `${currentOrg.themeColor}20`, color: currentOrg.themeColor, border: `1px solid ${currentOrg.themeColor}50` }}>
                <Sparkles size={14} /> AI Risk Surveillance Active
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {currentOrg.sector} &bull; {currentRole.title}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '0.75rem', lineHeight: 1.15, fontFamily: 'var(--font-heading)' }}>
              Predictive Risk & Intelligence Matrix
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Autonomous telemetry correlating <strong>{currentOrg.statValue}</strong> across {currentOrg.departments.length} key departments. Systemic vulnerability index evaluated at <strong>{currentOrg.aiRiskScore}%</strong> with high stability.
            </p>
          </div>

          {/* Health Score Circular Dial */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            padding: '1.25rem 1.75rem',
            borderRadius: '20px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ position: 'relative', width: '72px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="72" height="72" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={currentOrg.themeColor}
                  strokeWidth="3.2"
                  strokeDasharray={`${currentOrg.healthScore}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div style={{ position: 'absolute', fontSize: '1.1rem', fontWeight: '800', color: '#FFFFFF' }}>
                {currentOrg.healthScore}%
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                Organizational Health
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#10B981' }}>
                Nominal Condition
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Confidence: 99.4%
              </span>
            </div>
          </div>

        </div>

        {/* Timeframe & Action Bar */}
        <div style={{ 
          marginTop: '1.75rem', 
          paddingTop: '1.25rem', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['24h', '7d', '30d', '90d'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                style={{
                  padding: '0.4rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: activeTimeframe === tf ? currentOrg.themeColor : 'var(--border-color)',
                  background: activeTimeframe === tf ? `${currentOrg.themeColor}25` : 'var(--bg-secondary)',
                  color: activeTimeframe === tf ? currentOrg.themeColor : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleRefresh}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '10px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Sync Telemetry
            </button>

            <button
              onClick={() => navigate('/dashboard/reports')}
              className="btn btn-primary"
              style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem', background: currentOrg.themeColor }}
            >
              <FileText size={15} /> Executive Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (4 Primary Metrics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Systemic AI Risk Score', value: `${currentOrg.aiRiskScore}%`, change: '-2.4%', positive: true, icon: TrendingUp, color: '#10B981' },
          { label: 'Active Sector Telemetry', value: currentOrg.statValue, change: '+14%', positive: true, icon: Activity, color: currentOrg.themeColor },
          { label: 'Unmitigated Anomalies', value: '3 Active', change: '-4 today', positive: true, icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Regulatory Adherence', value: '100% Compliant', change: '0 Flags', positive: true, icon: ShieldCheck, color: '#00E5FF' }
        ].map((kpi, idx) => (
          <div key={idx} className="glass-card animate-fade-in-delayed" style={{ padding: '1.5rem', animationDelay: `${idx * 0.08}s`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                {kpi.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: '700', color: kpi.positive ? 'var(--success)' : 'var(--danger)' }}>
                {kpi.positive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                {kpi.change} vs prior baseline
              </div>
            </div>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              backgroundColor: `${kpi.color}15`, color: kpi.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${kpi.color}30`
            }}>
              <kpi.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Visualizations Row: 24-Hour Predictive Trajectory + Risk Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Trajectory Area Chart */}
        <div className="neo-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={18} color={currentOrg.themeColor} /> Predictive Trajectory & Anomaly Curve
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                Forward-looking neural projection for {currentOrg.name}
              </p>
            </div>
            <span className="badge badge-success">Confidence: 98.4%</span>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentOrg.themeColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={currentOrg.themeColor} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '12px', boxShadow: 'var(--shadow-lg)' }}
                  itemStyle={{ fontWeight: '700' }}
                />
                <Area type="monotone" dataKey="systemicRisk" stroke={currentOrg.themeColor} strokeWidth={3} fillOpacity={1} fill="url(#riskGrad)" name="Systemic Risk %" />
                <Area type="monotone" dataKey="anomalyIndex" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#anomalyGrad)" name="Anomaly Signals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="neo-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.25rem' }}>
              Risk Exposure Distribution
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
              Severity breakdown across active registers
            </p>
          </div>

          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {riskDistributionData.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: item.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                </div>
                <span style={{ fontWeight: '800', color: 'var(--text-primary)' }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Secondary Row: Department Comparison Bar Chart + Sector Specific Modules Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Department Comparison */}
        <div className="neo-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Department Risk Comparison</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Relative exposure & mitigation scores</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/analytics/comparison')}
              style={{ background: 'none', border: 'none', color: currentOrg.themeColor, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
            >
              Full Heatmap &rarr;
            </button>
          </div>

          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '10px' }} />
                <Bar dataKey="score" fill={currentOrg.themeColor} radius={[6, 6, 0, 0]} name="Exposure Index" />
                <Bar dataKey="mitigated" fill="#10B981" radius={[6, 6, 0, 0]} name="Mitigation Readiness %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Organization Specific Dynamic Modules Panel */}
        <div className="neo-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800' }}>{currentOrg.name.split('&')[0]} Modules</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Dynamic sector modules enabled for {currentRole.title}</p>
            </div>
            <span className="badge badge-primary">{currentOrg.industryModules.length} Modules Live</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
            {currentOrg.industryModules.map((mod) => (
              <div 
                key={mod.id}
                onClick={() => navigate(`/dashboard/industry/${mod.id}`)}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: `${currentOrg.themeColor}20`, color: currentOrg.themeColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Cpu size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#FFFFFF' }}>{mod.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{mod.kpi1.label}: <strong style={{ color: 'var(--text-primary)' }}>{mod.kpi1.value}</strong></div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {mod.activeAlertsCount > 0 && (
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>
                      {mod.activeAlertsCount} Alerts
                    </span>
                  )}
                  <ChevronRight size={18} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
