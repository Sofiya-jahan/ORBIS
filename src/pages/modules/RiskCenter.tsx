import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  ShieldAlert, Grid, CheckSquare, GitPullRequest, 
  AlertOctagon, Plus, Search, Filter, Download, 
  ArrowUpRight, Clock, ShieldCheck, Activity, Layers, 
  SlidersHorizontal, ChevronRight, Sparkles, FileText
} from 'lucide-react';

// Reuse existing risk components as specialized sub-views
import RiskRegister from './RiskRegister';
import RiskMatrix from './RiskMatrix';
import IncidentManagement from './IncidentManagement';

export const RiskCenter = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  // Assessment calculator state
  const [calcLikelihood, setCalcLikelihood] = useState<number>(3);
  const [calcImpact, setCalcImpact] = useState<number>(4);
  const calculatedScore = calcLikelihood * calcImpact;
  const calculatedTier = calculatedScore >= 16 ? 'Critical' : calculatedScore >= 10 ? 'High' : calculatedScore >= 5 ? 'Medium' : 'Low';
  const tierColor = calculatedTier === 'Critical' ? '#EF4444' : calculatedTier === 'High' ? '#F59E0B' : calculatedTier === 'Medium' ? '#2E9BF8' : '#6AE7F7';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ShieldAlert },
    { id: 'register', label: 'Risk Register', icon: Layers },
    { id: 'matrix', label: '5x5 Matrix', icon: Grid },
    { id: 'assessment', label: 'Assessment', icon: CheckSquare },
    { id: 'mitigation', label: 'Mitigation', icon: GitPullRequest },
    { id: 'timeline', label: 'Timeline & Incidents', icon: AlertOctagon },
    { id: 'history', label: 'History & Audits', icon: Clock }
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
            <ShieldAlert size={16} /> ORBIS Risk Intelligence &bull; {currentOrg.name}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F6FDFF', margin: 0, letterSpacing: '-0.5px' }}>
            Enterprise Risk Center
          </h1>
          <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '680px' }}>
            Unified workspace consolidating risk registers, 5x5 Bayesian matrices, qualitative assessments, mitigation tracking, and incident timelines.
          </p>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setTab('register')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
          >
            <Plus size={16} /> File New Risk
          </button>
          <button 
            onClick={() => setTab('timeline')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.25rem', fontSize: '0.88rem' }}
          >
            <AlertOctagon size={16} /> Log Incident
          </button>
        </div>
      </div>

      {/* Primary KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Total Active Risks</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>24</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem' }}>
            <ArrowUpRight size={14} /> 2 newly cataloged this week
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Critical Severity</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#EF4444', fontFamily: "'JetBrains Mono', monospace" }}>2</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Immediate executive escalation active
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(106, 231, 247, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Mitigation Velocity</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>87.5%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            21 of 24 risks with active controls
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Residual Exposure</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>14.2 / 100</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Within safe enterprise tolerance bounds
          </div>
        </div>
      </div>

      {/* Modern Navigation Tabs */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Quick Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              
              {/* Risk Breakdown Card */}
              <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.9)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F6FDFF', margin: 0 }}>
                    Risk Severity Distribution
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#6AE7F7', fontWeight: 700 }}>24 Total Registered</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#EF4444', fontWeight: 700 }}>Critical Severity (Score &ge; 16)</span>
                      <span style={{ color: '#F6FDFF', fontWeight: 800 }}>2 risks (8.3%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '8.3%', height: '100%', background: '#EF4444', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#F59E0B', fontWeight: 700 }}>High Exposure (Score 10 - 15)</span>
                      <span style={{ color: '#F6FDFF', fontWeight: 800 }}>5 risks (20.8%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '20.8%', height: '100%', background: '#F59E0B', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#2E9BF8', fontWeight: 700 }}>Medium Exposure (Score 5 - 9)</span>
                      <span style={{ color: '#F6FDFF', fontWeight: 800 }}>11 risks (45.8%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '45.8%', height: '100%', background: '#2E9BF8', borderRadius: '4px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: '#6AE7F7', fontWeight: 700 }}>Low Exposure (Score 1 - 4)</span>
                      <span style={{ color: '#F6FDFF', fontWeight: 800 }}>6 risks (25.0%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '25.0%', height: '100%', background: '#6AE7F7', borderRadius: '4px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
                  <button 
                    onClick={() => setTab('matrix')}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.82rem', padding: '0.65rem' }}
                  >
                    View 5x5 Matrix &rarr;
                  </button>
                  <button 
                    onClick={() => setTab('register')}
                    className="btn btn-secondary"
                    style={{ flex: 1, fontSize: '0.82rem', padding: '0.65rem' }}
                  >
                    Browse Register &rarr;
                  </button>
                </div>
              </div>

              {/* AI Risk Digest */}
              <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.9)', border: '1px solid rgba(134, 113, 249, 0.25)', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#8671F9', fontWeight: 800, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  <Sparkles size={16} /> Autonomous Risk Digest
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F6FDFF', margin: '0 0 0.75rem' }}>
                  Key Risk Drivers for {currentOrg.name}
                </h3>
                <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
                  ORBIS Bayesian synthesis detected a 4.2% elevation in supply-chain and access latency over the last 48 hours. Zero unmitigated critical incidents have escalated beyond Tier 2 containment.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(21, 84, 232, 0.1)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#F6FDFF' }}>
                      <Activity size={16} color="#6AE7F7" /> Primary Risk Engine
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6AE7F7', background: 'rgba(106, 231, 247, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>ONLINE</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'rgba(21, 84, 232, 0.1)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#F6FDFF' }}>
                      <ShieldCheck size={16} color="#2E9BF8" /> Controls Coverage
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2E9BF8' }}>87.5% Bound</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Matrix & Register Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F6FDFF', margin: 0 }}>
                  Immediate Priority Risks
                </h2>
                <button 
                  onClick={() => setTab('register')}
                  style={{ background: 'none', border: 'none', color: '#2E9BF8', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  View All 24 Risks <ChevronRight size={16} />
                </button>
              </div>

              {/* Embedding the full RiskRegister view directly */}
              <RiskRegister />
            </div>
          </div>
        )}

        {/* TAB 2: REGISTER */}
        {activeTab === 'register' && (
          <div>
            <RiskRegister />
          </div>
        )}

        {/* TAB 3: MATRIX */}
        {activeTab === 'matrix' && (
          <div>
            <RiskMatrix />
          </div>
        )}

        {/* TAB 4: ASSESSMENT CALCULATOR */}
        {activeTab === 'assessment' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
                Qualitative & Quantitative Risk Assessment Calculator
              </h2>
              <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: 0 }}>
                Compute standardized enterprise risk exposure using 5x5 Likelihood and Severity scoring metrics aligned with ISO 31000 standards.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              
              {/* Likelihood Selector */}
              <div style={{ background: 'rgba(13, 35, 77, 0.5)', padding: '1.75rem', borderRadius: '18px', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.5rem' }}>
                  1. Likelihood Level (1 - 5)
                </label>
                <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.65)', marginBottom: '1.25rem' }}>
                  Probability of event occurrence over the next 12-month operating window.
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setCalcLikelihood(lvl)}
                      style={{
                        flex: 1,
                        padding: '0.85rem 0',
                        borderRadius: '10px',
                        border: calcLikelihood === lvl ? '2px solid #2E9BF8' : '1px solid rgba(46, 155, 248, 0.2)',
                        background: calcLikelihood === lvl ? 'rgba(46, 155, 248, 0.25)' : 'rgba(7, 17, 46, 0.7)',
                        color: calcLikelihood === lvl ? '#F6FDFF' : 'rgba(246, 253, 255, 0.65)',
                        fontWeight: 900,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Selector */}
              <div style={{ background: 'rgba(13, 35, 77, 0.5)', padding: '1.75rem', borderRadius: '18px', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.5rem' }}>
                  2. Impact Severity (1 - 5)
                </label>
                <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.65)', marginBottom: '1.25rem' }}>
                  Financial, operational, clinical, regulatory or reputational consequence.
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(imp => (
                    <button
                      key={imp}
                      onClick={() => setCalcImpact(imp)}
                      style={{
                        flex: 1,
                        padding: '0.85rem 0',
                        borderRadius: '10px',
                        border: calcImpact === imp ? '2px solid #1554E8' : '1px solid rgba(46, 155, 248, 0.2)',
                        background: calcImpact === imp ? 'rgba(21, 84, 232, 0.35)' : 'rgba(7, 17, 46, 0.7)',
                        color: calcImpact === imp ? '#F6FDFF' : 'rgba(246, 253, 255, 0.65)',
                        fontWeight: 900,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {imp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Risk Output Card */}
            <div style={{
              marginTop: '2rem',
              padding: '2rem',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(7, 17, 46, 0.95) 0%, rgba(13, 35, 77, 0.9) 100%)',
              border: `2px solid ${tierColor}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: `0 10px 30px ${tierColor}25`
            }}>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: tierColor, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.25rem' }}>
                  Calculated Risk Score: Likelihood ({calcLikelihood}) &times; Impact ({calcImpact})
                </div>
                <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>
                  {calculatedScore} <span style={{ fontSize: '1.4rem', color: tierColor, fontWeight: 800 }}>({calculatedTier} Risk Tier)</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
                  {calculatedTier === 'Critical' 
                    ? 'Mandatory board disclosure and immediate mitigation protocol required within 24 hours.' 
                    : calculatedTier === 'High' 
                    ? 'Executive oversight and weekly control status reviews required.'
                    : calculatedTier === 'Medium'
                    ? 'Standard departmental control monitoring and monthly re-assessment.'
                    : 'Low residual exposure; continuous automated telemetry monitoring.'}
                </div>
              </div>

              <button 
                onClick={() => setTab('register')}
                className="btn btn-primary"
                style={{ padding: '0.9rem 1.8rem', fontSize: '0.92rem' }}
              >
                Catalog This Assessment &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: MITIGATION */}
        {activeTab === 'mitigation' && (
          <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F6FDFF', margin: '0 0 0.35rem' }}>
                  Active Mitigation Plans & Root Cause Resolution
                </h2>
                <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.88rem', margin: 0 }}>
                  Tracking active control assignments, mitigation velocities, and root-cause remediations across institutional operations.
                </p>
              </div>
              <button 
                onClick={() => setTab('register')}
                className="btn btn-primary"
                style={{ fontSize: '0.82rem', padding: '0.65rem 1.25rem' }}
              >
                + Assign New Control
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'Core Telemetry Latency Spike Mitigation', dept: 'Infrastructure', owner: 'DevOps Lead', progress: 92, status: 'In Review', priority: 'High', color: '#F59E0B' },
                { title: 'Vendor Security Third-Party Protocol Review', dept: 'Legal & Risk', owner: 'Chief Risk Officer', progress: 100, status: 'Mitigated', priority: 'Critical', color: '#6AE7F7' },
                { title: 'Clinical Credentialing Pipeline Verification', dept: 'Operations', owner: 'Compliance Officer', progress: 65, status: 'Active Sprint', priority: 'Medium', color: '#2E9BF8' },
                { title: 'Automated IAM Session Revocation Gateway', dept: 'Cyber Security', owner: 'SecOps Team', progress: 80, status: 'Active Sprint', priority: 'High', color: '#F59E0B' }
              ].map((item, idx) => (
                <div key={idx} style={{
                  padding: '1.25rem 1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(13, 35, 77, 0.45)',
                  border: '1px solid rgba(46, 155, 248, 0.18)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{ maxWidth: '480px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: item.color, background: `${item.color}20`, padding: '2px 8px', borderRadius: '6px' }}>
                        {item.priority}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'rgba(246, 253, 255, 0.55)', fontWeight: 600 }}>
                        {item.dept} &bull; {item.owner}
                      </span>
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#F6FDFF' }}>
                      {item.title}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ minWidth: '140px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.75)', marginBottom: '0.25rem' }}>
                        <span>Progress</span>
                        <span style={{ fontWeight: 800, color: '#6AE7F7' }}>{item.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.progress}%`, height: '100%', background: 'linear-gradient(90deg, #1554E8, #6AE7F7)', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: item.status === 'Mitigated' ? '#6AE7F7' : '#F6FDFF', padding: '0.35rem 0.85rem', background: 'rgba(7, 17, 46, 0.8)', borderRadius: '8px', border: '1px solid rgba(46, 155, 248, 0.25)' }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: TIMELINE & INCIDENTS */}
        {activeTab === 'timeline' && (
          <div>
            <IncidentManagement />
          </div>
        )}

        {/* TAB 7: HISTORY & AUDITS */}
        {activeTab === 'history' && (
          <div className="glass-card" style={{ padding: '2rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.22)', borderRadius: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Historical Risk Audit Trail & Modifications
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.88rem', margin: '0 0 1.5rem' }}>
              Immutable cryptographic ledger recording every risk creation, score recalculation, and mitigation milestone.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { time: '14 minutes ago', event: 'Risk RSK-084 reassessed from Score 16 to 12 following security patch deployment', actor: 'Chief Risk Officer' },
                { time: '2 hours ago', event: 'New Risk RSK-085 logged in Clinical Infrastructure', actor: 'Operations Supervisor' },
                { time: 'Yesterday 18:30', event: 'Mitigation Plan MP-021 approved for quarterly regulatory adherence', actor: 'Compliance Lead' },
                { time: '3 days ago', event: 'Risk Matrix calibration completed for 2026 Enterprise baseline', actor: 'System Administrator' }
              ].map((log, idx) => (
                <div key={idx} style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '12px',
                  background: 'rgba(13, 35, 77, 0.35)',
                  border: '1px solid rgba(46, 155, 248, 0.15)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Clock size={16} color="#6AE7F7" />
                    <div>
                      <div style={{ fontSize: '0.88rem', color: '#F6FDFF', fontWeight: 600 }}>{log.event}</div>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.55)' }}>Authorized by: {log.actor}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#2E9BF8', fontFamily: "'Space Mono', monospace", whiteSpace: 'nowrap' }}>
                    {log.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default RiskCenter;
