import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  AlertOctagon, Plus, Search, Filter, CheckCircle2, 
  Clock, ShieldAlert, FileText, Upload, ChevronRight
} from 'lucide-react';

export const IncidentManagement = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  
  const [activeTab, setActiveTab] = useState<'register' | 'report' | 'investigation'>('register');
  const [incidents, setIncidents] = useState([
    {
      id: 'INC-2026-084',
      title: 'Telemetry Node Drift on Cluster 4',
      department: currentOrg.departments[0] || 'Core',
      severity: 'High',
      reporter: 'Automated Neural Sentry',
      reportedAt: '12 mins ago',
      status: 'Under Investigation',
      rootCause: 'Transient network bottleneck causing sensor sample packet loss.',
      evidenceCount: 3
    },
    {
      id: 'INC-2026-081',
      title: 'Near Miss: Unplanned Secondary Route Congestion',
      department: currentOrg.departments[1] || 'Operations',
      severity: 'Medium',
      reporter: 'Shift Supervisor',
      reportedAt: '3 hours ago',
      status: 'Mitigated',
      rootCause: 'Concurrent batch sync task scheduled during peak operational load.',
      evidenceCount: 1
    },
    {
      id: 'INC-2026-079',
      title: 'Scheduled Maintenance Voltage Variance',
      department: currentOrg.departments[2] || 'Facilities',
      severity: 'Low',
      reporter: 'Field Technician',
      reportedAt: 'Yesterday',
      status: 'Resolved',
      rootCause: 'Capacitor bank switchover latency stabilized.',
      evidenceCount: 2
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState(currentOrg.departments[0]);
  const [newSeverity, setNewSeverity] = useState('Medium');
  const [newDesc, setNewDesc] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newInc = {
      id: `INC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      department: newDept,
      severity: newSeverity,
      reporter: 'Authorized User',
      reportedAt: 'Just now',
      status: 'Under Investigation',
      rootCause: newDesc || 'Pending root-cause analysis.',
      evidenceCount: 0
    };

    setIncidents([newInc, ...incidents]);
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setActiveTab('register');
      setNewTitle('');
      setNewDesc('');
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <AlertOctagon size={16} /> Incident Lifecycle Management
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Incident Register & Rapid Investigation
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Report, track root causes, and audit active incidents across {currentOrg.name}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            className={`btn ${activeTab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ background: activeTab === 'register' ? currentOrg.themeColor : undefined }}
            onClick={() => setActiveTab('register')}
          >
            Incident Register
          </button>
          <button 
            className={`btn ${activeTab === 'report' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ background: activeTab === 'report' ? currentOrg.themeColor : undefined }}
            onClick={() => setActiveTab('report')}
          >
            <Plus size={16} /> Report Incident
          </button>
        </div>
      </div>

      {/* Tab 1: Incident Register */}
      {activeTab === 'register' && (
        <div className="neo-card" style={{ overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Incident ID & Title</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Department</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Severity</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reported At</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#FFFFFF' }}>{inc.title}</div>
                    <div style={{ fontSize: '0.75rem', color: currentOrg.themeColor, fontFamily: 'var(--font-mono)' }}>{inc.id} &bull; {inc.reporter}</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {inc.department}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: '800',
                      background: inc.severity === 'High' ? 'rgba(239,68,68,0.15)' : inc.severity === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)',
                      color: inc.severity === 'High' ? '#EF4444' : inc.severity === 'Medium' ? '#F59E0B' : '#10B981',
                      textTransform: 'uppercase'
                    }}>
                      {inc.severity}
                    </span>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {inc.reportedAt}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF' }}>
                    {inc.status}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <button 
                      onClick={() => alert(`Opening full root-cause investigation dossier for ${inc.id}`)}
                      style={{ background: 'none', border: 'none', color: currentOrg.themeColor, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      Investigate <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Report Incident Form */}
      {activeTab === 'report' && (
        <div className="glass-card" style={{ padding: '2.5rem', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            File Operational or Safety Incident
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
            Submissions are instantly routed to departmental risk owners and AI root-cause analyzers.
          </p>

          {reportSuccess ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#10B981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={48} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Incident Logged & Dispatched</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Returning to incident registry...</p>
            </div>
          ) : (
            <form onSubmit={handleCreateIncident} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label className="label">Incident Summary Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sudden pressure drop in auxiliary coolant loop..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="input-field"
                  >
                    {currentOrg.departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Estimated Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="input-field"
                  >
                    <option value="Critical">Critical (Immediate Stop)</option>
                    <option value="High">High (Severe Impact)</option>
                    <option value="Medium">Medium (Moderate Variance)</option>
                    <option value="Low">Low (Informational)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="label">Detailed Observation & Evidence Description</label>
                <textarea
                  placeholder="Describe the sequence of events, impacted systems, and immediate safety actions taken..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={4}
                  className="input-field"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ background: currentOrg.themeColor, padding: '1rem', marginTop: '0.5rem' }}
              >
                Submit Incident Report
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};

export default IncidentManagement;
