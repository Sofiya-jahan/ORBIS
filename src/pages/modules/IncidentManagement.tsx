import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  AlertOctagon, Plus, Search, Filter, CheckCircle2, 
  Clock, ShieldAlert, FileText, Upload, ChevronRight,
  Database, Cloud, Image as ImageIcon, Loader2
} from 'lucide-react';
import { saveIncidentToNeon, loadIncidentsFromNeon } from '../../services/neonService';
import { uploadIncidentEvidence } from '../../services/supabaseStorage';
import { validateFileUpload, sanitizeInput } from '../../services/securityService';

export const IncidentManagement = () => {
  const { organization, user } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  
  const [activeTab, setActiveTab] = useState<'register' | 'report' | 'investigation'>('register');
  const [incidents, setIncidents] = useState<any[]>([
    {
      id: 'INC-2026-084',
      title: 'Telemetry Node Drift on Cluster 4',
      department: currentOrg.departments[0] || 'Core',
      severity: 'High',
      reporter: 'Automated Neural Sentry',
      reportedAt: '12 mins ago',
      status: 'Under Investigation',
      rootCause: 'Transient network bottleneck causing sensor sample packet loss.',
      evidenceCount: 3,
      evidenceUrls: []
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
      evidenceCount: 1,
      evidenceUrls: []
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
      evidenceCount: 2,
      evidenceUrls: []
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState(currentOrg.departments[0] || 'Core');
  const [newSeverity, setNewSeverity] = useState('Medium');
  const [newDesc, setNewDesc] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [evidencePreview, setEvidencePreview] = useState<string | null>(null);
  const [fileSecurityError, setFileSecurityError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    if (currentOrg.departments && currentOrg.departments.length > 0) {
      setNewDept(currentOrg.departments[0]);
    }
  }, [currentOrg]);

  // Load incidents from Neon DB strictly partitioned by current organization
  useEffect(() => {
    let isMounted = true;
    const fetchIncidents = async () => {
      try {
        const saved = await loadIncidentsFromNeon(currentOrg.id);
        if (isMounted && saved && saved.length > 0) {
          setIncidents(prev => {
            const ids = new Set(saved.map(s => s.id));
            const filteredPrev = prev.filter(p => !ids.has(p.id));
            return [...saved.map(s => ({
              id: s.id,
              title: s.title,
              department: s.department,
              severity: s.severity,
              reporter: s.reporter,
              reportedAt: s.reported_at,
              status: s.status,
              rootCause: s.root_cause,
              evidenceCount: s.evidence_count,
              evidenceUrls: s.evidence_urls || []
            })), ...filteredPrev];
          });
        }
      } catch (err) {
        console.warn('Neon DB Incident fetch warning:', err);
      }
    };
    fetchIncidents();
    return () => { isMounted = false; };
  }, [currentOrg.id]);

  const handleEvidenceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Secure file sieve check
    const validation = validateFileUpload(file, { maxSizeBytes: 10 * 1024 * 1024 });
    if (!validation.valid) {
      setFileSecurityError(validation.error || 'File failed security sieve.');
      setEvidenceFile(null);
      setEvidencePreview(null);
      e.target.value = '';
      return;
    }

    setFileSecurityError('');
    setEvidenceFile(file);
    setEvidencePreview(URL.createObjectURL(file));
  };

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    setFileSecurityError('');

    // Input sanitization against XSS & script injection
    const sanitizedTitle = sanitizeInput(newTitle);
    const sanitizedDesc = sanitizeInput(newDesc);
    const sanitizedDept = sanitizeInput(newDept);

    if (!sanitizedTitle) {
      setFileSecurityError('Incident title is required and must contain valid characters.');
      return;
    }

    setIsSubmitting(true);
    const incidentId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const evidenceUrls: string[] = [];

    // If an image evidence is provided, upload directly to Supabase Storage
    if (evidenceFile) {
      try {
        const uploadResult = await uploadIncidentEvidence(evidenceFile, incidentId);
        if (uploadResult.url) {
          evidenceUrls.push(uploadResult.url);
        }
      } catch (err) {
        console.warn('Supabase evidence image upload warning:', err);
      }
    }

    const newInc = {
      id: incidentId,
      title: sanitizedTitle,
      department: sanitizedDept,
      severity: newSeverity,
      reporter: user?.name || 'Authorized Sentry',
      reportedAt: 'Just now',
      status: 'Under Investigation',
      rootCause: sanitizedDesc || 'Pending root-cause analysis.',
      evidenceCount: evidenceUrls.length,
      evidenceUrls: evidenceUrls
    };

    // Save incident record to Neon DB
    saveIncidentToNeon({
      id: newInc.id,
      title: newInc.title,
      department: newInc.department,
      severity: newInc.severity,
      reporter: newInc.reporter,
      reported_at: newInc.reportedAt,
      status: newInc.status,
      root_cause: newInc.rootCause,
      evidence_count: newInc.evidenceCount,
      evidence_urls: newInc.evidenceUrls,
      organization: currentOrg.id
    }).catch(err => console.error('Failed to save incident to Neon DB:', err));

    setIncidents(prev => [newInc, ...prev]);
    setIsSubmitting(false);
    setReportSuccess(true);
    
    setTimeout(() => {
      setReportSuccess(false);
      setActiveTab('register');
      setNewTitle('');
      setNewDesc('');
      setEvidenceFile(null);
      setEvidencePreview(null);
      setFileSecurityError('');
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

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.4rem 0.75rem', borderRadius: '12px',
            background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.25)',
            fontSize: '0.75rem', color: '#00E5FF', fontWeight: 700
          }}>
            <Database size={13} />
            INCIDENT LOGS // ENCRYPTED
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.4rem 0.75rem', borderRadius: '12px',
            background: 'rgba(21, 84, 232, 0.15)', border: '1px solid rgba(46, 155, 248, 0.3)',
            fontSize: '0.75rem', color: '#6AE7F7', fontWeight: 700
          }}>
            <Cloud size={13} />
            EVIDENCE VAULT // VERIFIED
          </div>
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
                    {inc.evidenceUrls && inc.evidenceUrls.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Cloud size={10} /> Cloud Evidence:
                        </span>
                        {inc.evidenceUrls.map((url: string, idx: number) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" title="View Encrypted Evidence Attachment">
                            <img src={url} alt="Evidence" style={{ width: '22px', height: '22px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #6AE7F7' }} />
                          </a>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {inc.department}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <span style={{
                      padding: '0.25rem 0.65rem', borderRadius: '100px', fontSize: '0.72rem', fontWeight: '800',
                      background: inc.severity === 'High' ? 'rgba(239,68,68,0.15)' : inc.severity === 'Medium' ? 'rgba(245,158,11,0.15)' : 'rgba(106, 231, 247, 0.15)',
                      color: inc.severity === 'High' ? '#EF4444' : inc.severity === 'Medium' ? '#F59E0B' : '#6AE7F7',
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
            <div style={{ padding: '2rem', textAlign: 'center', color: '#6AE7F7', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
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

              <div>
                <label className="label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Cloud size={14} color="#6AE7F7" />
                  Evidence Attachment / Screenshot (Encrypted Cloud)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <label style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1.25rem',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px dashed rgba(46, 155, 248, 0.35)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}>
                    <Upload size={16} />
                    <span>{evidenceFile ? evidenceFile.name : 'Attach Evidence Image...'}</span>
                    <input type="file" accept="image/*" onChange={handleEvidenceSelect} style={{ display: 'none' }} />
                  </label>
                  {evidencePreview && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={evidencePreview} alt="Preview" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #6AE7F7' }} />
                      <button 
                        type="button" 
                        onClick={() => { setEvidenceFile(null); setEvidencePreview(null); }} 
                        style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {fileSecurityError && (
                <div style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#EF4444',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <ShieldAlert size={18} />
                  <span>{fileSecurityError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{
                  background: currentOrg.themeColor,
                  padding: '1rem',
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Encrypting & Saving Incident Record...
                  </>
                ) : (
                  'Submit Incident Report'
                )}
              </button>
            </form>
          )}
        </div>
      )}

    </div>
  );
};

export default IncidentManagement;
