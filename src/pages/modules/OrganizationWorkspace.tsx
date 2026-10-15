import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Building2, Users, Cpu, ShieldCheck, Briefcase, 
  Layers, CheckCircle2, AlertTriangle, ArrowUpRight, 
  Activity, Landmark, GraduationCap, Factory, HeartPulse,
  UserCheck, Hash, Shield, Award, Wrench
} from 'lucide-react';

import OrgOverview from './OrgOverview';
import IndustryModule from './IndustryModule';
import { OrganizationalPortalBackdrop } from '../../components/OrganizationalPortalBackdrop';

export const OrganizationWorkspace = () => {
  const { organization, role, user } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'overview';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'industry', label: 'Industry Intelligence', icon: Cpu },
    { id: 'departments', label: 'Departments', icon: Layers },
    { id: 'operations', label: 'Operations & Projects', icon: Briefcase },
    { id: 'workforce', label: 'Workforce & Roles', icon: Users },
    { id: 'profile', label: 'Institutional Profile', icon: ShieldCheck }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header with Realistic Blended Architectural Command Node */}
      <OrganizationalPortalBackdrop
        themeColor={currentOrg.themeColor}
        secondaryColor={currentOrg.secondaryColor}
        accentColor={currentOrg.accentColor}
        nodeBadgeText={`${currentOrg.sector} • COMMAND NODE`}
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
              <Building2 size={16} /> Institutional Topology &bull; {currentOrg.sector}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F6FDFF', margin: 0, letterSpacing: '-0.5px' }}>
              {currentOrg.name}
            </h1>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
              {currentOrg.description}
            </p>
          </div>

          {/* Global Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', background: 'rgba(13, 35, 77, 0.6)', border: '1px solid rgba(46, 155, 248, 0.25)', textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(246, 253, 255, 0.55)', textTransform: 'uppercase' }}>Tenant Status</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6AE7F7', boxShadow: '0 0 8px #6AE7F7' }} />
                Active Enterprise License
              </div>
            </div>
          </div>
        </div>
      </OrganizationalPortalBackdrop>

      {/* Primary KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>{currentOrg.statLabel}</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>{currentOrg.statValue}</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '0.25rem' }}>
            <ArrowUpRight size={14} /> Capacity monitored live
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(106, 231, 247, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Institutional Health</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>{currentOrg.healthScore}%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Optimal operational status
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Baseline AI Risk Delta</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>{currentOrg.aiRiskScore}%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Within ISO-31000 safety zone
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Active Divisions</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>{currentOrg.departments.length} Units</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            100% telemetry synced
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
            <OrgOverview />
          </div>
        )}

        {/* TAB 2: INDUSTRY INTELLIGENCE */}
        {activeTab === 'industry' && (
          <div>
            <IndustryModule />
          </div>
        )}

        {/* TAB 3: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Institutional Departmental Topology
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Active departments, telemetry endpoints, and current health ratings across {currentOrg.name}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {currentOrg.departments.map((dept, idx) => {
                const health = Math.round(88 + (idx * 3) % 11);
                return (
                  <div
                    key={idx}
                    style={{
                      padding: '1.75rem',
                      borderRadius: '18px',
                      background: 'rgba(13, 35, 77, 0.45)',
                      border: '1px solid rgba(46, 155, 248, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF' }}>{dept}</span>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6AE7F7', background: 'rgba(106, 231, 247, 0.15)', padding: '3px 8px', borderRadius: '6px' }}>
                        {health}% Health
                      </span>
                    </div>

                    <div style={{ width: '100%', height: '6px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${health}%`, height: '100%', background: 'linear-gradient(90deg, #1554E8, #6AE7F7)', borderRadius: '3px' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.65)' }}>
                      <span>Active Incidents: 0</span>
                      <span>Mitigation Rate: 100%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: OPERATIONS & PROJECTS */}
        {activeTab === 'operations' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Strategic Operations & Project Initiatives
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Ongoing institutional transformation tracks, infrastructure maintenance, and resilience benchmarks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { title: 'ISO 27001 & SOC2 Type II Continuous Adherence', lead: 'Security Operations', progress: 95, status: 'Active', target: 'Q4 2026' },
                { title: 'Zero-Trust Role-Based Access Sieve Deployment', lead: 'IAM Architecture', progress: 88, status: 'In Validation', target: 'Q4 2026' },
                { title: 'Unified Data Fabric & Multi-Cloud Redundancy Protocol', lead: 'Infrastructure', progress: 78, status: 'Active Sprint', target: 'Q1 2027' }
              ].map((proj, idx) => (
                <div key={idx} style={{
                  padding: '1.5rem 1.75rem',
                  borderRadius: '16px',
                  background: 'rgba(13, 35, 77, 0.45)',
                  border: '1px solid rgba(46, 155, 248, 0.18)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: '#6AE7F7', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {proj.lead} &bull; Target: {proj.target}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F6FDFF' }}>
                      {proj.title}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ minWidth: '130px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.75)', marginBottom: '0.25rem' }}>
                        <span>Completion</span>
                        <span style={{ fontWeight: 800, color: '#2E9BF8' }}>{proj.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(246, 253, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${proj.progress}%`, height: '100%', background: 'linear-gradient(90deg, #1554E8, #2E9BF8)', borderRadius: '3px' }} />
                      </div>
                    </div>

                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6AE7F7', background: 'rgba(106, 231, 247, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '8px' }}>
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: WORKFORCE & ROLES */}
        {activeTab === 'workforce' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Clearance Roles & Workforce Privileges
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Authorized operational tiers and role configurations defined for {currentOrg.name}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {currentOrg.roles.map(r => (
                <div
                  key={r.id}
                  style={{
                    padding: '1.75rem',
                    borderRadius: '18px',
                    background: r.id === role ? 'rgba(21, 84, 232, 0.25)' : 'rgba(13, 35, 77, 0.45)',
                    border: r.id === role ? '2px solid #2E9BF8' : '1px solid rgba(46, 155, 248, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF' }}>{r.title}</span>
                    {r.id === role && (
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6AE7F7', background: 'rgba(106, 231, 247, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                        YOUR ROLE
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#2E9BF8', fontWeight: 700 }}>
                    Clearance: {r.accessLevel} (Tier {r.levelNumber})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(246, 253, 255, 0.65)' }}>
                    Permissions: {r.permissions.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: INSTITUTIONAL PROFILE */}
        {activeTab === 'profile' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Institutional Zero-Trust Verification Credentials
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Cryptographic certificates, active tenant identity, and session authentication telemetry.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Institution ID</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>{currentOrg.id.toUpperCase()}-ENTERPRISE-01</div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Operator Identity</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF' }}>{user?.name || 'Administrator'} ({currentRole.title})</div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Clearance Tier</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6AE7F7' }}>{currentRole.accessLevel}</div>
              </div>

              <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(13, 35, 77, 0.5)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>HMAC Security Signature</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>HMAC-SHA256: VALIDATED</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrganizationWorkspace;
