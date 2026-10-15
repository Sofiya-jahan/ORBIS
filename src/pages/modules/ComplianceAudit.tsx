import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { Scale, ShieldCheck, FileCheck, AlertTriangle, Download, Lock } from 'lucide-react';

export const ComplianceAudit = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  const policies = [
    { id: 'POL-01', name: 'Zero-Trust Access & Key Rotation Protocol', standard: 'SOC2 Type II / ISO 27001', adherence: '100%', status: 'Compliant' },
    { id: 'POL-02', name: 'Automated AI Model Bias & Fairness Guardrail', standard: 'EU AI Act / NIST AI RMF', adherence: '98.4%', status: 'Compliant' },
    { id: 'POL-03', name: 'Incident Notification SLA (Under 60 Mins)', standard: 'Statutory / Board Policy', adherence: '100%', status: 'Compliant' },
    { id: 'POL-04', name: 'Continuous Evidence Hash Immutability', standard: 'Blockchain / Cryptographic Log', adherence: '100%', status: 'Compliant' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Scale size={16} /> Governance, Risk & Compliance (GRC)
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Regulatory Compliance & Audit Readiness
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Automated statutory control verification and immutable cryptographic audit logging for {currentOrg.name}.
          </p>
        </div>

        <button 
          onClick={() => alert('Generating official compliance audit certification packet...')}
          className="btn btn-primary"
          style={{ background: currentOrg.themeColor }}
        >
          <FileCheck size={16} /> Generate GRC Audit Pack
        </button>
      </div>

      {/* Compliance Overview KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Overall Adherence Score
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#6AE7F7', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            99.6%
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            48 of 48 statutory controls passed
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Open Violations
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            0 Critical
          </div>
          <div style={{ fontSize: '0.85rem', color: '#6AE7F7', fontWeight: 600 }}>
            Zero uncontained regulatory breaches
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            Next Scheduled External Audit
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#2E9BF8', marginBottom: '0.4rem', fontFamily: "'JetBrains Mono', monospace" }}>
            42 Days
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            All automated evidence pre-packaged
          </div>
        </div>
      </div>

      {/* Policies Table */}
      <div className="neo-card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            Active Institutional Controls & Policy Matrix
          </h2>
          <span className="badge badge-success">Continuous Compliance Active</span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Control ID & Name</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Standard / Framework</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Adherence</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#FFFFFF' }}>{p.name}</div>
                  <div style={{ fontSize: '0.75rem', color: currentOrg.themeColor, fontFamily: 'var(--font-mono)' }}>{p.id}</div>
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {p.standard}
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.9rem', fontWeight: 800, color: '#6AE7F7', fontFamily: 'var(--font-mono)' }}>
                  {p.adherence}
                </td>
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <span className="badge badge-success">{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ComplianceAudit;
