import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { useOrganizationalIntelligence } from '../../intelligence/useOrganizationalIntelligence';
import { 
  ShieldAlert, Grid, CheckSquare, GitPullRequest, 
  Search, Filter, Plus, ArrowUpRight, CheckCircle2, 
  AlertTriangle, Clock, Sliders, Shield, Zap, X
} from 'lucide-react';

export const RiskRegister = () => {
  const { organization, user } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const { data: orgData, createRisk, applyRiskMitigation, closeRisk } = useOrganizationalIntelligence();
  
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<number | null>(null);

  // New Risk Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState(currentOrg.departments[0] || 'Core');
  const [newCategory, setNewCategory] = useState('Operational / Cyber');
  const [newProbability, setNewProbability] = useState<number>(3);
  const [newImpact, setNewImpact] = useState<number>(3);
  const [newMitigation, setNewMitigation] = useState('');

  const risksList = orgData?.risks || [];

  const filteredRisks = risksList.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterSeverity === 'all') return true;
    return r.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  const handleCreateRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createRisk({
      title: newTitle,
      department: newDept,
      probability: newProbability,
      impact: newImpact,
      category: newCategory,
      mitigation: newMitigation || 'Mitigation work order dispatched.',
      userName: user?.name
    });

    setNewTitle('');
    setNewMitigation('');
    setShowAddModal(false);
  };

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
          onClick={() => setShowAddModal(true)}
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
                    background: risk.severity === 'Critical' ? 'rgba(239,68,68,0.15)' : risk.severity === 'High' ? 'rgba(245,158,11,0.15)' : 'rgba(106, 231, 247, 0.15)',
                    color: risk.severity === 'Critical' ? '#EF4444' : risk.severity === 'High' ? '#F59E0B' : '#6AE7F7',
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>
              Root Cause & Active Mitigation Plan for {filteredRisks[selectedRisk].id}
            </h3>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button 
                onClick={() => applyRiskMitigation(filteredRisks[selectedRisk].id, 'Preemptive buffer allocation deployed and verified.')}
                className="btn btn-secondary"
                style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
              >
                Apply Mitigation
              </button>
              {filteredRisks[selectedRisk].status !== 'closed' && (
                <button 
                  onClick={() => closeRisk(filteredRisks[selectedRisk].id)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                >
                  Close Risk
                </button>
              )}
            </div>
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

      {/* New Risk Modal Dialog */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          backdropFilter: 'blur(8px)'
        }}>
          <div className="neo-card" style={{ width: '520px', maxWidth: '90vw', padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>Register New Risk Event</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateRisk} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Risk Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Ingress Telemetry Node Congestion Spike"
                  required
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.3rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Department</label>
                  <select 
                    value={newDept} 
                    onChange={e => setNewDept(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.3rem' }}
                  >
                    {currentOrg.departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Category</label>
                  <input 
                    type="text" 
                    value={newCategory} 
                    onChange={e => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.3rem' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Probability (1-5): {newProbability}</label>
                  <input 
                    type="range" min="1" max="5" 
                    value={newProbability} 
                    onChange={e => setNewProbability(Number(e.target.value))}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Impact (1-5): {newImpact}</label>
                  <input 
                    type="range" min="1" max="5" 
                    value={newImpact} 
                    onChange={e => setNewImpact(Number(e.target.value))}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Mitigation Plan</label>
                <textarea 
                  value={newMitigation} 
                  onChange={e => setNewMitigation(e.target.value)}
                  placeholder="Outline preventive actions or automated controls..."
                  rows={3}
                  style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', marginTop: '0.3rem' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ background: currentOrg.themeColor }}>Publish to Hub</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RiskRegister;
