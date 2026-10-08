import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  ShieldAlert, Grid, CheckSquare, GitPullRequest, 
  Search, Filter, Plus, ArrowUpRight, CheckCircle2, 
  AlertTriangle, Clock, Sliders, Shield, Zap
} from 'lucide-react';

export const RiskRegister = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);

  const mockRisks = [
    {
      id: 'RSK-104',
      title: 'High-Frequency Ingress Volatility Spike',
      department: currentOrg.departments[0] || 'Core Operations',
      category: 'Operational / Cyber',
      probability: 4, // 1-5
      impact: 4, // 1-5
      score: 16,
      severity: 'Critical',
      owner: 'Lead Risk Analyst',
      status: 'Active Mitigation',
      mitigation: 'Implement dynamic buffer queues and isolate secondary ingress clusters.',
      lastReviewed: 'Today, 09:30 AM'
    },
    {
      id: 'RSK-108',
      title: 'Regulatory Audit Compliance Gap on Policy v4',
      department: currentOrg.departments[1] || 'Compliance',
      category: 'Regulatory / Legal',
      probability: 2,
      impact: 5,
      score: 10,
      severity: 'High',
      owner: 'Chief Compliance Officer',
      status: 'Under Review',
      mitigation: 'Automate weekly SOC2 / HIPAA evidence collection pipelines.',
      lastReviewed: 'Yesterday'
    },
    {
      id: 'RSK-112',
      title: 'Third-Party Vendor API Latency Degradation',
      department: currentOrg.departments[2] || 'Infrastructure',
      category: 'Vendor / Supply',
      probability: 3,
      impact: 3,
      score: 9,
      severity: 'Medium',
      owner: 'Infrastructure Lead',
      status: 'Monitored',
      mitigation: 'Failover route activated across multi-region standby endpoints.',
      lastReviewed: '2 days ago'
    },
    {
      id: 'RSK-119',
      title: 'Operator Fatigue Variance in Shift Rotation',
      department: currentOrg.departments[3] || 'Operations',
      category: 'Human Factors',
      probability: 3,
      impact: 2,
      score: 6,
      severity: 'Low',
      owner: 'HR / Operations Lead',
      status: 'Scheduled',
      mitigation: 'Introduce automated shift pacing and mandatory rest intervals.',
      lastReviewed: '4 days ago'
    }
  ];

  const filteredRisks = mockRisks.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterSeverity === 'all') return true;
    return r.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <ShieldAlert size={16} /> Risk Management Module
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Enterprise Risk Register & Inventory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Centralized registry of operational, strategic, and financial risks for {currentOrg.name}.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          style={{ background: currentOrg.themeColor, padding: '0.75rem 1.4rem' }}
          onClick={() => alert('New Risk Assessment Wizard opened.')}
        >
          <Plus size={18} /> Register New Risk
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search risk ID, title, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.65rem 1rem 0.65rem 2.6rem',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'critical', 'high', 'medium', 'low'].map(s => (
            <button
              key={s}
              onClick={() => setFilterSeverity(s)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: filterSeverity === s ? currentOrg.themeColor : 'var(--border-color)',
                background: filterSeverity === s ? `${currentOrg.themeColor}20` : 'var(--bg-secondary)',
                color: filterSeverity === s ? currentOrg.themeColor : 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Risk Table */}
      <div className="neo-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk ID & Title</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prob x Impact</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Owner</th>
              <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRisks.map((risk, idx) => (
              <tr 
                key={risk.id}
                onClick={() => setSelectedRisk(selectedRisk === idx ? null : idx)}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  background: selectedRisk === idx ? 'var(--primary-light)' : 'transparent',
                  transition: 'background 0.2s'
                }}
              >
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#FFFFFF' }}>{risk.title}</div>
                  <div style={{ fontSize: '0.75rem', color: currentOrg.themeColor, fontFamily: 'var(--font-mono)' }}>{risk.id} &bull; {risk.category}</div>
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {risk.department}
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.9rem', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
                  {risk.probability} &times; {risk.impact} = <span style={{ color: currentOrg.themeColor }}>{risk.score}</span>
                </td>
                <td style={{ padding: '1.1rem 1.25rem' }}>
                  <span style={{
                    padding: '0.25rem 0.65rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: '800',
                    background: risk.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : risk.severity === 'High' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                    color: risk.severity === 'Critical' ? '#EF4444' : risk.severity === 'High' ? '#F59E0B' : '#10B981',
                    textTransform: 'uppercase'
                  }}>
                    {risk.severity}
                  </span>
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {risk.owner}
                </td>
                <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {risk.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expandable Selected Risk Detail Panel */}
      {selectedRisk !== null && filteredRisks[selectedRisk] && (
        <div className="glass-card animate-fade-in" style={{ padding: '1.75rem', borderLeft: `6px solid ${currentOrg.themeColor}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              Root Cause & Active Mitigation Plan for {filteredRisks[selectedRisk].id}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Last Review: {filteredRisks[selectedRisk].lastReviewed}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Primary Root Cause
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                Covariance analysis indicates external stress vector exceeding nominal baseline thresholds during peak processing windows.
              </div>
            </div>
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Prescribed Mitigation Workflow
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {filteredRisks[selectedRisk].mitigation}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default RiskRegister;
