import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  BarChart2, TrendingUp, Grid, Activity, Award, 
  ArrowUpRight, ArrowDownRight, Layers, Download, 
  Calendar, CheckCircle2, ChevronRight, Sliders
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip as RechartsTooltip, BarChart, Bar, 
  Legend, LineChart, Line 
} from 'recharts';

// Reuse existing EnterpriseAnalytics
import EnterpriseAnalytics from './EnterpriseAnalytics';

export const AnalyticsWorkspace = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Radar', icon: BarChart2 },
    { id: 'heatmaps', label: 'Heatmaps & Density', icon: Grid },
    { id: 'forecasts', label: 'Bayesian Forecasts', icon: TrendingUp },
    { id: 'performance', label: 'Performance & SLAs', icon: Award },
    { id: 'trends', label: 'Historical Trends', icon: Activity }
  ];

  // 12-Month Forecast Trend Data
  const forecastTrendData = [
    { month: 'Nov 2025', observedRisk: 22, projectedRisk: 21, costReduction: 12 },
    { month: 'Dec 2025', observedRisk: 20, projectedRisk: 19, costReduction: 15 },
    { month: 'Jan 2026', observedRisk: 18, projectedRisk: 17, costReduction: 18 },
    { month: 'Feb 2026', observedRisk: 15, projectedRisk: 15, costReduction: 24 },
    { month: 'Mar 2026', observedRisk: 14, projectedRisk: 13, costReduction: 32 },
    { month: 'Apr 2026', observedRisk: null, projectedRisk: 11, costReduction: 38 },
    { month: 'May 2026', observedRisk: null, projectedRisk: 10, costReduction: 42 },
    { month: 'Jun 2026', observedRisk: null, projectedRisk: 8, costReduction: 48 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'rgba(7, 17, 46, 0.92)',
        border: '1px solid rgba(46, 155, 248, 0.25)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
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
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F6FDFF', margin: 0, letterSpacing: '-0.5px' }}>
            Enterprise Analytics Workspace
          </h1>
          <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
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

      {/* Primary KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Resilience Index</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>91.4%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            6-pillar geometric mean
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Forecast Precision</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>96.2%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Bayesian back-tested accuracy
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Cost-Mitigation ROI</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>1 : 8.4</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', marginTop: '0.25rem' }}>
            $8.40 saved per $1 control deployed
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Longitudinal Trend</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>-12.8%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Net risk reduction over 90 days
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.35rem',
        background: 'rgba(7, 17, 46, 0.95)',
        border: '1px solid rgba(46, 155, 248, 0.22)',
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
                color: isActive ? '#F6FDFF' : 'rgba(246, 253, 255, 0.7)',
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

        {/* TAB 2: HEATMAPS & CONCENTRATION */}
        {activeTab === 'heatmaps' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Cross-Departmental Risk Concentration Heatmap
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Intensity matrix measuring multidimensional operational friction and systemic dependency between divisions.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '6px', textAlign: 'center', minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '0.8rem', textAlign: 'left', color: 'rgba(246, 253, 255, 0.65)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Division</th>
                    <th style={{ padding: '0.8rem', color: '#6AE7F7', fontSize: '0.8rem', textTransform: 'uppercase' }}>Operational</th>
                    <th style={{ padding: '0.8rem', color: '#2E9BF8', fontSize: '0.8rem', textTransform: 'uppercase' }}>Compliance</th>
                    <th style={{ padding: '0.8rem', color: '#8671F9', fontSize: '0.8rem', textTransform: 'uppercase' }}>Financial</th>
                    <th style={{ padding: '0.8rem', color: '#EF4444', fontSize: '0.8rem', textTransform: 'uppercase' }}>Cyber Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrg.departments.map((dept, i) => (
                    <tr key={i}>
                      <td style={{ padding: '1rem', textAlign: 'left', fontWeight: 700, color: '#F6FDFF', background: 'rgba(13, 35, 77, 0.4)', borderRadius: '10px' }}>
                        {dept}
                      </td>
                      {[
                        { val: 12 + (i * 7) % 35, color: '#6AE7F7' },
                        { val: 18 + (i * 11) % 40, color: '#2E9BF8' },
                        { val: 10 + (i * 5) % 25, color: '#8671F9' },
                        { val: 8 + (i * 9) % 30, color: '#EF4444' }
                      ].map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          style={{
                            padding: '1rem',
                            background: `rgba(${cell.color === '#6AE7F7' ? '106, 231, 247' : cell.color === '#2E9BF8' ? '46, 155, 248' : cell.color === '#8671F9' ? '134, 113, 249' : '239, 68, 68'}, ${0.1 + cell.val / 80})`,
                            border: `1px solid ${cell.color}35`,
                            borderRadius: '10px',
                            fontWeight: 800,
                            color: '#F6FDFF',
                            fontFamily: "'JetBrains Mono', monospace"
                          }}
                        >
                          {cell.val}%
                        </td>
                      ))}
                    </tr>
                  ))}
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
