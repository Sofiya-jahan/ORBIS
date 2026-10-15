import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { Building2, Activity, TrendingUp, ShieldCheck, Cpu, Layers, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrgOverview = () => {
  const { organization } = useAuthStore();
  const navigate = useNavigate();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2.5rem', background: 'var(--bg-secondary)', borderLeft: `6px solid ${currentOrg.themeColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: currentOrg.themeColor, fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Building2 size={16} /> Enterprise Tenant Overview
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '0.6rem' }}>
              {currentOrg.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '720px', lineHeight: 1.6 }}>
              {currentOrg.description}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              onClick={() => navigate('/organization')}
              className="btn btn-secondary"
            >
              Change Organization <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Tenant KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Overall Health Score
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#6AE7F7', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            {currentOrg.healthScore}%
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Systemic operational stability index
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            AI Risk Probability
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2E9BF8', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            {currentOrg.aiRiskScore}%
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Evaluated against {currentOrg.statValue}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Sector Modules
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            {currentOrg.industryModules.length} Modules
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Active AI intelligence pipelines
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Authorized Access Roles
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            {currentOrg.roles.length} Roles
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Level 1 Staff to Level 5 Executive
          </div>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="neo-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Active Operating Departments & Units ({currentOrg.departments.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
          {currentOrg.departments.map((dept) => (
            <div key={dept} style={{ padding: '1.25rem', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6AE7F7', boxShadow: '0 0 10px #6AE7F7' }} />
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{dept}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6AE7F7' }}>Nominal</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OrgOverview;
