import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { useOrganizationTheme } from '../hooks/useOrganizationTheme';
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
import { formatUserName } from '../utils/userUtils';

export const Dashboard = () => {
  const { organization, role, user } = useAuthStore();
  const { chartPalette, gridStroke, tooltipStyle, themeColors } = useOrganizationTheme();
  const navigate = useNavigate();
  const [activeTimeframe, setActiveTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];
  const roleCategory = currentRole?.roleCategory || 'executive';

  const getRolePerspective = () => {
    const r = (role || '').toLowerCase();
    const title = (currentRole?.title || '').toLowerCase();
    if (r.includes('cfo') || title.includes('financial') || title.includes('treasury')) return 'finance';
    if (r.includes('hr') || title.includes('people') || title.includes('human')) return 'hr';
    if (r.includes('compliance') || title.includes('regulatory') || title.includes('legal')) return 'compliance';
    if (r.includes('ciso') || title.includes('security') || title.includes('cyber') || title.includes('data')) return 'security';
    if (r.includes('cro') || title.includes('risk') || title.includes('safety')) return 'risk_manager';
    if (r.includes('ceo') || r.includes('director') || r.includes('dean') || title.includes('chief executive') || roleCategory === 'executive') return 'ceo';
    return 'operations';
  };
  const rolePerspective = getRolePerspective();

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
    { name: 'Low Risk (Trivial)', value: 68, color: chartPalette[0] },
    { name: 'Moderate Exposure', value: 24, color: chartPalette[1] },
    { name: 'Critical Attention', value: 8, color: chartPalette[2] || '#EF4444' }
  ];

  // 1. Employee / Specialist Minimal Focused Dashboard
  if (roleCategory === 'employee') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Welcome Header */}
        <div className="neo-card" style={{ 
          padding: '2rem', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          background: 'var(--card-gradient, linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%))',
          border: '1px solid var(--border-color)',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor || 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <ShieldCheck size={18} /> {currentOrg.name} &bull; Operational Portal
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              Welcome, {formatUserName(user?.name, user?.email)}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Your workspace is filtered to show your assigned active tasks, departmental alerts, and direct incident filings.
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/risk-center?tab=timeline')}
            className="btn btn-primary"
            style={{ padding: '0.85rem 1.5rem', fontSize: '0.9rem' }}
          >
            <AlertTriangle size={18} /> File New Incident
          </button>
        </div>

        {/* 3 Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="neo-card" style={{ padding: '1.75rem', background: 'var(--card-bg, var(--bg-secondary))', border: '1px solid var(--border-color)', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
              My Assigned Tasks
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: currentOrg.themeColor || 'var(--primary)', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
              4 Pending
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              2 due before end of shift (17:00)
            </div>
          </div>

          <div className="neo-card" style={{ padding: '1.75rem', background: 'var(--card-bg, var(--bg-secondary))', border: '1px solid var(--border-color)', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
              Department Status
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#10B981', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
              Optimal (98%)
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Zero critical escalation flags
            </div>
          </div>

          <div className="neo-card" style={{ padding: '1.75rem', background: 'var(--card-bg, var(--bg-secondary))', border: '1px solid var(--border-color)', borderRadius: '18px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
              Unread System Alerts
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--accent)', marginBottom: '0.5rem', fontFamily: "'JetBrains Mono', monospace" }}>
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
      <div className="neo-card animate-fade-in" style={{ 
        padding: '2.5rem', 
        borderRadius: '24px', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'var(--card-gradient, linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%))',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Ambient Top Glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(var(--primary-rgb), 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.35rem 0.85rem',
                borderRadius: '100px',
                fontSize: '0.75rem',
                fontWeight: 700,
                background: 'var(--hover-bg)',
                color: currentOrg.themeColor || 'var(--primary)',
                border: '1px solid var(--border-color)'
              }}>
                <Sparkles size={14} /> AI Risk Surveillance Active
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>
                {currentOrg.sector} &bull; {currentRole.title}
              </span>
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '0.75rem', lineHeight: 1.15, color: 'var(--text-primary)', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              Predictive Risk & Intelligence Matrix
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
              Autonomous telemetry correlating <strong style={{ color: currentOrg.themeColor || 'var(--primary)' }}>{currentOrg.statValue}</strong> across {currentOrg.departments.length} key departments. Systemic vulnerability index evaluated at <strong style={{ color: currentOrg.secondaryColor || 'var(--secondary)' }}>{currentOrg.aiRiskScore}%</strong> with high algorithmic stability.
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
                  stroke="var(--border-color)"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke={currentOrg.themeColor || 'var(--primary)'}
                  strokeWidth="3.2"
                  strokeDasharray={`${currentOrg.healthScore}, 100`}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${currentOrg.themeColor || 'var(--primary)'})` }}
                />
              </svg>
              <div style={{ position: 'absolute', fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
                {currentOrg.healthScore}%
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
                Organizational Health
              </span>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: currentOrg.themeColor || 'var(--primary)' }}>
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
            {(['24h', '7d', '30d', '90d'] as const).map(tf => {
              const isActive = activeTimeframe === tf;
              return (
                <button
                  key={tf}
                  onClick={() => setActiveTimeframe(tf)}
                  style={{
                    padding: '0.45rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--primary)' : 'var(--border-color)',
                    background: isActive ? 'var(--primary-gradient)' : 'var(--bg-secondary)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {tf.toUpperCase()}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={handleRefresh}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.55rem 1.15rem', borderRadius: '10px',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} color={currentOrg.themeColor || 'var(--primary)'} />
              Sync Telemetry
            </button>

            <button
              onClick={() => navigate('/dashboard/governance?tab=reports')}
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.82rem' }}
            >
              <FileText size={15} /> Executive Report
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row (4 Primary Metrics) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {[
          { label: 'Systemic AI Risk Score', value: `${currentOrg.aiRiskScore}%`, change: '-2.4%', positive: true, icon: TrendingUp, color: currentOrg.themeColor || 'var(--primary)' },
          { label: 'Active Sector Telemetry', value: currentOrg.statValue, change: '+14%', positive: true, icon: Activity, color: currentOrg.secondaryColor || 'var(--secondary)' },
          { label: 'Unmitigated Anomalies', value: '3 Active', change: '-4 today', positive: true, icon: AlertTriangle, color: 'var(--accent)' },
          { label: 'Regulatory Adherence', value: '100% Compliant', change: '0 Flags', positive: true, icon: ShieldCheck, color: '#10B981' }
        ].map((kpi, idx) => (
          <div 
            key={idx} 
            className="neo-card animate-fade-in-delayed" 
            style={{ 
              padding: '1.6rem', 
              animationDelay: `${idx * 0.08}s`, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              background: 'var(--card-bg, var(--bg-secondary))',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
                {kpi.label}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
                {kpi.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', fontWeight: '700', color: kpi.positive ? '#10B981' : '#EF4444' }}>
                {kpi.positive ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
                {kpi.change} vs prior baseline
              </div>
            </div>
            <div style={{
              width: '46px', height: '46px', borderRadius: '14px',
              backgroundColor: 'var(--hover-bg)', color: kpi.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <kpi.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Role-Based Intelligence Deck: Adaptive to User Role */}
      <div className="neo-card" style={{
        padding: '2rem 2.25rem',
        background: 'var(--card-gradient, linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%))',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: currentOrg.themeColor || 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
              <ShieldCheck size={16} /> Tailored Role Intelligence &bull; {currentRole.title}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              {rolePerspective === 'ceo' && 'Executive & Board Oversight Deck'}
              {rolePerspective === 'risk_manager' && 'Risk Center & Mitigation Intelligence Deck'}
              {rolePerspective === 'hr' && 'People & Workforce Risk Intelligence Deck'}
              {rolePerspective === 'finance' && 'Financial Risk & Capital Exposure Deck'}
              {rolePerspective === 'compliance' && 'Regulatory Compliance & Audit Posture Deck'}
              {rolePerspective === 'security' && 'Cyber Threat & Zero-Trust Defense Deck'}
              {rolePerspective === 'operations' && 'Operational Health & Shift Directives Deck'}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => navigate('/dashboard/risk-center')}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
            >
              Risk Center &rarr;
            </button>
            <button
              onClick={() => navigate('/dashboard/ai-intelligence')}
              className="btn btn-ai"
              style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
            >
              AI Copilot &rarr;
            </button>
          </div>
        </div>

        {/* 4 Role-Specific Tactical KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {rolePerspective === 'ceo' && [
            { label: 'Strategic Risk Delta', val: 'Low (-2.8%)', note: 'Within Board bounds', color: '#10B981' },
            { label: 'Capital Exposure At Risk', val: '$2.4M Safe', note: '100% hedged / insured', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Board Foresight Index', val: '94.2 / 100', note: 'Algorithmic stability', color: 'var(--accent)' },
            { label: 'Operating Margin Integrity', val: '99.2%', note: '0 critical escalations', color: '#10B981' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}

          {rolePerspective === 'risk_manager' && [
            { label: '5x5 Matrix Peak Cell', val: '2 Critical', note: 'Score >= 16 (Tier 1)', color: '#EF4444' },
            { label: 'Mitigation Progress Rate', val: '87.5%', note: '21 of 24 risks controlled', color: '#10B981' },
            { label: 'Residual Risk Index', val: '14.2 / 100', note: 'Within ISO-31000 tolerance', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Open Incidents Triage', val: '0 Uncontained', note: 'All incidents triaged', color: '#10B981' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}

          {rolePerspective === 'hr' && [
            { label: 'Staff Fatigue & Burnout Risk', val: '12% (Low)', note: '0 division alerts', color: '#10B981' },
            { label: 'Workforce Coverage Ratio', val: '96.4%', note: 'All shifts staffed', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Retention Stability Index', val: '94.8 / 100', note: 'Top decile benchmark', color: 'var(--accent)' },
            { label: 'Attendance Anomaly Delta', val: '0.4% Dev', note: 'Within normal variation', color: '#10B981' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}

          {rolePerspective === 'finance' && [
            { label: 'Value-at-Risk (VaR 99%)', val: '0.04%', note: 'Parametric 24h risk', color: '#10B981' },
            { label: 'Operating Capital Liquidity', val: '$48.2M', note: 'Optimal cash reserves', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Anomalous Transaction Flags', val: '0 Active', note: 'Zero fraud ingress', color: '#10B981' },
            { label: 'Budget Variance Delta', val: '+0.6%', note: 'Favorable operational delta', color: 'var(--accent)' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}

          {rolePerspective === 'compliance' && [
            { label: 'Regulatory Framework Score', val: '98.6%', note: 'SOC2 & HIPAA Compliant', color: '#10B981' },
            { label: 'Active Policy Violations', val: '0 Flags', note: 'Zero non-compliance issues', color: '#10B981' },
            { label: 'Continuous Control Evidence', val: '47 / 48', note: '1 awaiting sign-off', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Upcoming Audit Countdown', val: '34 Days', note: 'Automated pack ready', color: 'var(--accent)' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}

          {rolePerspective === 'security' && [
            { label: 'Lattice Cryptographic Posture', val: 'AES-256 HMAC', note: 'Session tokens signed', color: '#10B981' },
            { label: 'Zero-Day Vulnerability Score', val: 'A+ Rated', note: 'Zero open CVEs', color: '#10B981' },
            { label: 'Rate Limiter Quarantine', val: '0 Locked', note: '5 attempts / 45s gate active', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Tamper-Evident Audit Trail', val: '100% Synced', note: 'Immutable security log', color: 'var(--accent)' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}

          {rolePerspective === 'operations' && [
            { label: 'Operational Uptime SLA', val: '99.98%', note: 'Zero facility disruptions', color: '#10B981' },
            { label: 'Shift Directives Pending', val: '3 Directives', note: 'All supervisors notified', color: currentOrg.secondaryColor || 'var(--secondary)' },
            { label: 'Safety Incidents Logged', val: '0 Critical', note: 'Safe operating window', color: '#10B981' },
            { label: 'Readiness Index', val: '100%', note: 'Equipment & staff calibrated', color: 'var(--accent)' }
          ].map((item, i) => (
            <div key={i} style={{ padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', fontFamily: "'JetBrains Mono', monospace" }}>{item.label}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.val}</div>
              <div style={{ fontSize: '0.75rem', color: item.color, marginTop: '0.25rem', fontWeight: 700 }}>{item.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Visualizations Row: 24-Hour Predictive Trajectory + Risk Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Trajectory Area Chart */}
        <div className="neo-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
                <Clock size={18} color={chartPalette[0]} /> Predictive Trajectory & Anomaly Curve
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Forward-looking neural projection for {currentOrg.name}
              </p>
            </div>
            <span style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: 'var(--hover-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--border-color)',
              fontFamily: "'JetBrains Mono', monospace"
            }}>
              Confidence: 98.4%
            </span>
          </div>

          <div style={{ height: '320px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trajectoryData}>
                <defs>
                  <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartPalette[0]} stopOpacity={0.6}/>
                    <stop offset="50%" stopColor={chartPalette[1]} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={chartPalette[0]} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anomalyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartPalette[2] || '#EF4444'} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={chartPalette[2] || '#EF4444'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={tooltipStyle}
                  itemStyle={{ fontWeight: '700' }}
                />
                <Area type="monotone" dataKey="systemicRisk" stroke={chartPalette[0]} strokeWidth={3} fillOpacity={1} fill="url(#riskGrad)" name="Systemic Risk %" />
                <Area type="monotone" dataKey="anomalyIndex" stroke={chartPalette[2] || '#EF4444'} strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#anomalyGrad)" name="Anomaly Signals" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="neo-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '0.25rem', color: 'var(--text-primary)', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
              Risk Exposure Distribution
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>
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
                  contentStyle={tooltipStyle}
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
                <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Secondary Row: Department Comparison Bar Chart + Sector Specific Modules Quick Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Department Comparison */}
        <div className="neo-card" style={{ 
          padding: '1.75rem',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
                Department Risk Comparison
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Relative exposure & mitigation scores</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard/analytics?tab=heatmaps')}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700 }}
            >
              Full Heatmap &rarr;
            </button>
          </div>

          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentRiskData}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip contentStyle={tooltipStyle} />
                <Bar dataKey="score" fill={chartPalette[0]} radius={[6, 6, 0, 0]} name="Exposure Index" />
                <Bar dataKey="mitigated" fill={chartPalette[1]} radius={[6, 6, 0, 0]} name="Mitigation Readiness %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Organization Specific Dynamic Modules Panel */}
        <div className="neo-card" style={{ 
          padding: '1.75rem', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" }}>
                {currentOrg.name.split('&')[0]} Modules
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Dynamic sector modules enabled for {currentRole.title}</p>
            </div>
            <span style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '100px',
              fontSize: '0.72rem',
              fontWeight: 700,
              background: 'var(--hover-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--border-color)'
            }}>
              {currentOrg.industryModules.length} Modules Live
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1, overflowY: 'auto' }}>
            {currentOrg.industryModules.map((mod) => (
              <div 
                key={mod.id}
                onClick={() => navigate('/dashboard/organization?tab=industry')}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.background = 'var(--hover-bg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'var(--hover-bg)', color: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Cpu size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-primary)' }}>{mod.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{mod.kpi1.label}: <strong style={{ color: 'var(--text-primary)' }}>{mod.kpi1.value}</strong></div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {mod.activeAlertsCount > 0 && (
                    <span style={{ padding: '0.2rem 0.55rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.35)' }}>
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
