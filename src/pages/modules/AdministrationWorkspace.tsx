import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Settings, Shield, Users, Key, Bell, 
  FileText, CheckCircle2, AlertTriangle, 
  RefreshCw, Lock, Terminal, Sliders, ShieldCheck
} from 'lucide-react';

import AdminSecurity from './AdminSecurity';
import NotificationsPage from './NotificationsPage';
import { OrganizationalPortalBackdrop } from '../../components/OrganizationalPortalBackdrop';

export const AdministrationWorkspace = () => {
  const { organization, role, user, theme, setTheme } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'security';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'security', label: 'Security & Encryption', icon: Shield },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'logs', label: 'System Audit Logs', icon: Terminal },
    { id: 'notifications', label: 'Notification Center', icon: Bell },
    { id: 'settings', label: 'System Configuration', icon: Settings }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header with Realistic Blended Zero-Trust Architectural Security Gateway */}
      <OrganizationalPortalBackdrop
        themeColor={currentOrg.themeColor}
        secondaryColor={currentOrg.secondaryColor}
        accentColor={currentOrg.accentColor}
        nodeBadgeText="ZERO-TRUST HARDWARE HSM ONLINE"
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
              <Settings size={16} /> Enterprise Administration &bull; {currentOrg.name}
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F6FDFF', margin: 0, letterSpacing: '-0.5px' }}>
              Platform Administration
            </h1>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
              Centralized platform configuration, cryptographic zero-trust posture, institutional user roles, and tamper-evident audit logging.
            </p>
          </div>

          {/* Global Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button 
              onClick={() => setTab('security')}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
            >
              <ShieldCheck size={16} /> Security Posture
            </button>
          </div>
        </div>
      </OrganizationalPortalBackdrop>

      {/* Primary KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(106, 231, 247, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Cryptographic Posture</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>AES-256</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            HMAC session signature active
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Adaptive Rate Limiter</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>5 / 45s</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Brute-force lockout armed
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Configured Roles</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>{currentOrg.roles.length} Tiers</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', marginTop: '0.25rem' }}>
            RBAC zero-trust isolated
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Session Lifetime</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>8.0 Hours</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Tamper-evident verification
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
        
        {/* TAB 1: SECURITY & ENCRYPTION */}
        {activeTab === 'security' && (
          <div>
            <AdminSecurity />
          </div>
        )}

        {/* TAB 2: USERS & ROLES */}
        {activeTab === 'users' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Institutional RBAC Clearance Matrix
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Role definitions, clearance levels, and granular module permissions mapped for {currentOrg.name}.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {currentOrg.roles.map(r => (
                <div key={r.id} style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(13, 35, 77, 0.45)', border: '1px solid rgba(46, 155, 248, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#F6FDFF' }}>{r.title}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6AE7F7', background: 'rgba(106, 231, 247, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                      Level {r.levelNumber}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#2E9BF8', fontWeight: 700 }}>
                    Clearance: {r.accessLevel}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)' }}>
                    Permissions:
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                      {r.permissions.map((p, pIdx) => (
                        <span key={pIdx} style={{ fontSize: '0.72rem', background: 'rgba(21, 84, 232, 0.2)', border: '1px solid rgba(46, 155, 248, 0.25)', padding: '2px 6px', borderRadius: '4px', color: '#F6FDFF' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SYSTEM AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div>
            <AdminSecurity />
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div>
            <NotificationsPage />
          </div>
        )}

        {/* TAB 5: SYSTEM CONFIGURATION */}
        {activeTab === 'settings' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              System Configuration & Tenant Defaults
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Institutional branding, visual theme, telemetry intervals, and API key management.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              <div style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(13, 35, 77, 0.45)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.75rem' }}>
                  Platform Interface Theme
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(246, 253, 255, 0.7)', marginBottom: '1.25rem' }}>
                  Enterprise dark navy design system active across all authenticated modules.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={() => setTheme('dark')}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.65rem', fontSize: '0.82rem' }}
                  >
                    Enterprise Dark (Default)
                  </button>
                  <button 
                    onClick={() => setTheme('light')}
                    className="btn btn-secondary"
                    style={{ flex: 1, padding: '0.65rem', fontSize: '0.82rem' }}
                  >
                    High-Contrast Light
                  </button>
                </div>
              </div>

              <div style={{ padding: '1.75rem', borderRadius: '18px', background: 'rgba(13, 35, 77, 0.45)', border: '1px solid rgba(46, 155, 248, 0.2)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.75rem' }}>
                  Telemetry Ingestion Rate
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(246, 253, 255, 0.7)', marginBottom: '1.25rem' }}>
                  Automated background health polling and Bayesian risk recalculation interval.
                </p>
                <div style={{ padding: '0.75rem 1rem', background: 'rgba(7, 17, 46, 0.8)', borderRadius: '10px', color: '#6AE7F7', fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>
                  Every 60 Seconds &bull; High Reliability Mode
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdministrationWorkspace;
