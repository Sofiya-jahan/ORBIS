import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { useOrganizationalIntelligence } from '../../intelligence/useOrganizationalIntelligence';
import { 
  BarChart2, TrendingUp, Grid, Activity, Award, 
  ArrowUpRight, ArrowDownRight, Layers, Download, 
  Calendar, CheckCircle2, ChevronRight, Sliders,
  HelpCircle, ShieldAlert, AlertTriangle, ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, 
  Legend, LineChart, Line 
} from 'recharts';

// Reuse existing EnterpriseAnalytics
import EnterpriseAnalytics from './EnterpriseAnalytics';
import { OrganizationalPortalBackdrop } from '../../components/OrganizationalPortalBackdrop';

export const AnalyticsWorkspace = () => {
  const { organization, theme } = useAuthStore();
  const isLight = theme === 'light';
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const orgData = useOrganizationalIntelligence();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Radar', icon: BarChart2 },
    { id: 'questions', label: 'Executive Questions & Answers', icon: HelpCircle },
    { id: 'heatmaps', label: 'Heatmaps & Density', icon: Grid },
    { id: 'forecasts', label: 'Bayesian Forecasts', icon: TrendingUp },
    { id: 'performance', label: 'Performance & SLAs', icon: Award },
    { id: 'trends', label: 'Historical Trends', icon: Activity }
  ];

  // Dynamic forecast trajectory from Prediction Engine
  const forecastTrendData = orgData.predictions?.incidentForecast?.riskTrajectory?.length > 0
    ? orgData.predictions.incidentForecast.riskTrajectory.map(item => ({
        month: item.period,
        observedRisk: item.isProjected ? null : item.projectedValue,
        projectedRisk: item.projectedValue,
        costReduction: Math.round(item.projectedValue * 1.6)
      }))
    : [
        { month: 'Day 1', observedRisk: 22, projectedRisk: 21, costReduction: 12 },
        { month: 'Day 5', observedRisk: 20, projectedRisk: 19, costReduction: 15 },
        { month: 'Day 10', observedRisk: 18, projectedRisk: 17, costReduction: 18 },
        { month: 'Day 15', observedRisk: null, projectedRisk: 15, costReduction: 24 },
        { month: 'Day 20', observedRisk: null, projectedRisk: 13, costReduction: 32 },
        { month: 'Day 25', observedRisk: null, projectedRisk: 11, costReduction: 38 },
        { month: 'Day 30', observedRisk: null, projectedRisk: 10, costReduction: 42 },
      ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <OrganizationalPortalBackdrop
        themeColor={currentOrg.themeColor}
        secondaryColor={currentOrg.secondaryColor}
        accentColor={currentOrg.accentColor}
        nodeBadgeText="MULTI-PILLAR STATISTICAL RADAR &bull; PREDICTIVE MODELING"
        variant="banner"
      >
        <div style={{
          padding: '2rem 2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6AE7F7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
              <BarChart2 size={16} /> Advanced Quantitative Analytics &bull; {currentOrg.name}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.5px' }}>
              Enterprise Analytics Workspace
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
              Consolidated analytical intelligence: multi-pillar resilience radars, cross-departmental correlation heatmaps, and longitudinal predictive modeling.
            </p>
          </div>

          {/* Global Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => setTab('forecasts')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
            >
              <TrendingUp size={16} /> View Forecast Projections
            </button>
          </div>
        </div>
      </OrganizationalPortalBackdrop>

      {/* Primary KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Organization Health</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>{orgData.kpis?.health?.overallScore || 90}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Weighted multi-pillar &bull; {orgData.kpis?.health?.status || 'Nominal'}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Average Risk Score</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>{orgData.kpis?.risk?.averageRiskScore || 14.5}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {orgData.kpis?.risk?.totalOpenRisks || 0} open ({orgData.kpis?.risk?.criticalRisksCount || 0} critical)
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Next Month Forecast</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
            {orgData.predictions?.incidentForecast?.projectionNextMonth || 8} Incidents
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', marginTop: '0.25rem' }}>
            Linear trajectory ({orgData.predictions?.incidentForecast?.confidenceLevelPct || 94.6}% confidence)
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '18px' }}>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Compliance Adherence</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>{orgData.kpis?.compliance?.overallCompliancePct || 95}%</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Grade {orgData.kpis?.compliance?.auditReadinessGrade || 'A'} &bull; {orgData.kpis?.compliance?.overdueControlsCount || 0} overdue controls
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.35rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '16px',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.25rem',
                borderRadius: '12px',
                border: 'none',
                background: isActive 
                  ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)' 
                  : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 15px rgba(21, 84, 232, 0.4)' : 'none'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workspace based on Active Tab */}
      <div style={{ minHeight: '500px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <EnterpriseAnalytics />
          </div>
        )}

        {/* TAB 2: EXECUTIVE BUSINESS QUESTIONS (6 Drivers) */}
        {activeTab === 'questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6AE7F7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                <HelpCircle size={16} /> Central Analytics Engine &bull; Explainable Drivers
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
                6 Core Business Questions Answered
              </h2>
              <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: 0, maxWidth: '850px' }}>
                Every chart in ORBIS answers a specific operational question. These explanations are continuously computed from underlying organizational events and telemetry.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
              {(orgData.analytics?.topQuestions || []).map((q, idx) => (
                <div 
                  key={q.questionId || idx}
                  className="glass-card"
                  style={{
                    padding: '1.8rem',
                    background: 'rgba(7, 17, 46, 0.9)',
                    border: '1px solid rgba(46, 155, 248, 0.22)',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1.25rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6AE7F7', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Question {idx + 1}
                      </span>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 800, 
                        padding: '0.2rem 0.6rem', 
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#60A5FA',
                        fontFamily: "'JetBrains Mono', monospace"
                      }}>
                        {q.keyMetric}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F6FDFF', margin: '0 0 0.75rem', lineHeight: 1.4 }}>
                      {q.question}
                    </h3>

                    <p style={{ color: 'rgba(246, 253, 255, 0.9)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1rem' }}>
                      {q.shortAnswer}
                    </p>

                    <div style={{ padding: '0.85rem 1rem', borderRadius: '12px', background: 'rgba(13, 35, 77, 0.45)', border: '1px solid rgba(46, 155, 248, 0.15)', marginBottom: '0.5rem' }}>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(246, 253, 255, 0.55)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                        Primary Driver
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#6AE7F7', fontWeight: 600 }}>
                        {(q.primaryDrivers || []).join('; ')}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(46, 155, 248, 0.15)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.78rem', color: 'rgba(246, 253, 255, 0.65)' }}>
                      <strong>Action:</strong> {q.recommendedAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: HEATMAPS & CONCENTRATION */}
        {activeTab === 'heatmaps' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Cross-Departmental Risk Concentration Heatmap
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Dynamic matrix measuring multidimensional operational risk, compliance posture, budget utilization, and incidents across divisions.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '6px', textAlign: 'center', minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.8rem', textAlign: 'left', color: 'rgba(246, 253, 255, 0.65)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Division</th>
                    <th style={{ padding: '0.8rem', color: '#6AE7F7', fontSize: '0.8rem', textTransform: 'uppercase' }}>Operational Risk</th>
                    <th style={{ padding: '0.8rem', color: '#2E9BF8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Compliance %</th>
                    <th style={{ padding: '0.8rem', color: '#8671F9', fontSize: '0.8rem', textTransform: 'uppercase' }}>Budget Used %</th>
                    <th style={{ padding: '0.8rem', color: '#EF4444', fontSize: '0.8rem', textTransform: 'uppercase' }}>Active Incidents</th>
                  </tr>
                </thead>
                <tbody>
                  {(orgData.analytics?.departmentComparisons?.length || 0) > 0 ? (
                    orgData.analytics.departmentComparisons.map((dept, i) => (
                      <tr key={i}>
                        <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#F6FDFF', background: 'rgba(13, 35, 77, 0.4)', borderRadius: '10px' }}>
                          {dept.department}
                        </td>
                        <td
                          style={{
                            padding: '1rem',
                            background: `rgba(106, 231, 247, ${0.1 + dept.riskScore / 120})`,
                            border: '1px solid #6AE7F735',
                            borderRadius: '10px',
                            fontWeight: 800,
                            color: '#F6FDFF',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                        >
                          {dept.riskScore}%
                        </td>
                        <td
                          style={{
                            padding: '1rem',
                            background: `rgba(46, 155, 248, ${0.1 + dept.compliancePct / 130})`,
                            border: '1px solid #2E9BF835',
                            borderRadius: '10px',
                            fontWeight: 800,
                            color: '#F6FDFF',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                        >
                          {dept.compliancePct}%
                        </td>
                        <td
                          style={{
                            padding: '1rem',
                            background: `rgba(134, 113, 249, ${0.1 + dept.budgetUtilizationPct / 130})`,
                            border: '1px solid #8671F935',
                            borderRadius: '10px',
                            fontWeight: 800,
                            color: '#F6FDFF',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                        >
                          {dept.budgetUtilizationPct}%
                        </td>
                        <td
                          style={{
                            padding: '1rem',
                            background: dept.incidentCount > 0 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.15)',
                            border: dept.incidentCount > 0 ? '1px solid #EF444450' : '1px solid #10B98135',
                            borderRadius: '10px',
                            fontWeight: 800,
                            color: dept.incidentCount > 0 ? '#EF4444' : '#10B981',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                        >
                          {dept.incidentCount}
                        </td>
                      </tr>
                    ))
                  ) : (
                    currentOrg.departments.map((dept, i) => (
                      <tr key={i}>
                        <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#F6FDFF', background: 'rgba(13, 35, 77, 0.4)', borderRadius: '10px' }}>
                          {dept}
                        </td>
                        <td style={{ padding: '1rem', background: 'rgba(106, 231, 247, 0.2)', borderRadius: '10px', color: '#F6FDFF' }}>25%</td>
                        <td style={{ padding: '1rem', background: 'rgba(46, 155, 248, 0.2)', borderRadius: '10px', color: '#F6FDFF' }}>92%</td>
                        <td style={{ padding: '1rem', background: 'rgba(134, 113, 249, 0.2)', borderRadius: '10px', color: '#F6FDFF' }}>78%</td>
                        <td style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: '#10B981' }}>0</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FORECASTS */}
        {activeTab === 'forecasts' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              12-Month Bayesian Risk Trajectory & Cost Mitigation Delta
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Historical observed risk overlaid with deep neural predictions and estimated financial savings across operating quarters.
            </p>

            <div style={{ height: '380px', width: '100%', marginBottom: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={forecastTrendData}>
                  <defs>
                    <linearGradient id="colorObserved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1554E8" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#1554E8" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6AE7F7" stopOpacity={0.5}/>
                      <stop offset="95%" stopColor="#6AE7F7" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(246, 253, 255, 0.08)" />
                  <XAxis dataKey="month" stroke="rgba(246, 253, 255, 0.55)" fontSize={12} />
                  <YAxis stroke="rgba(246, 253, 255, 0.55)" fontSize={12} unit="%" />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 17, 46, 0.95)',
                      border: '1px solid rgba(46, 155, 248, 0.3)',
                      borderRadius: '12px',
                      color: '#F6FDFF',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="observedRisk" name="Observed Historical Risk" stroke="#1554E8" strokeWidth={3} fillOpacity={1} fill="url(#colorObserved)" />
                  <Area type="monotone" dataKey="projectedRisk" name="Bayesian Forecast" stroke="#6AE7F7" strokeWidth={3} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorProjected)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* TAB 4: PERFORMANCE & SLAS */}
        {activeTab === 'performance' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Operational Performance & Institutional SLA Compliance
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Rigorous verification of incident resolution timelines, control execution velocity, and compliance uptime.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                { label: 'Critical Incident Triage SLA', value: '< 15 mins', status: '100% Met', color: '#6AE7F7' },
                { label: 'Routine Control Verification', value: '4.2 hrs avg', status: '98.5% Met', color: '#2E9BF8' },
                { label: 'Regulatory Audit Evidence Uptime', value: '99.99%', status: 'Nominal', color: '#6AE7F7' },
                { label: 'Mean Time to Risk Resolution (MTTR)', value: '1.8 Days', status: 'Top Decile', color: '#8671F9' }
              ].map((sla, i) => (
                <div key={i} style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(13, 35, 77, 0.45)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.65)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {sla.label}
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace", marginBottom: '0.5rem' }}>
                    {sla.value}
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: sla.color }}>
                    {sla.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: TRENDS */}
        {activeTab === 'trends' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Longitudinal Systemic Trend Modeling
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Continuous multi-quarter trajectory mapping institutional stability and resilience gains.
            </p>

            <div style={{ height: '350px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(246, 253, 255, 0.08)" />
                  <XAxis dataKey="month" stroke="rgba(246, 253, 255, 0.55)" fontSize={12} />
                  <YAxis stroke="rgba(246, 253, 255, 0.55)" fontSize={12} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'rgba(7, 17, 46, 0.95)',
                      border: '1px solid rgba(46, 155, 248, 0.3)',
                      borderRadius: '12px',
                      color: '#F6FDFF'
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="costReduction" name="Cumulative Cost Avoidance ($k)" stroke="#6AE7F7" strokeWidth={3} dot={{ r: 5, fill: '#6AE7F7' }} />
                  <Line type="monotone" dataKey="observedRisk" name="Systemic Risk Metric" stroke="#1554E8" strokeWidth={3} dot={{ r: 5, fill: '#1554E8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AnalyticsWorkspace;
