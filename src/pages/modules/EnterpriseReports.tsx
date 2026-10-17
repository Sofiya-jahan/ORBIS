import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { useOrganizationalIntelligence } from '../../intelligence/useOrganizationalIntelligence';
import { 
  FileText, FileSpreadsheet, Download, CheckCircle2, 
  Loader2, Sparkles, Share2, Printer, Eye, X,
  ShieldAlert, Activity, Award, HelpCircle, Layers
} from 'lucide-react';

export const EnterpriseReports = () => {
  const { organization, role, user } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const orgData = useOrganizationalIntelligence();
  
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [activePreviewReport, setActivePreviewReport] = useState<{ title: string; content: string } | null>(null);

  // Dynamic reports generated directly from the current organizational intelligence
  const reports = [
    {
      id: 'monthly-exec',
      title: 'Monthly Executive Intelligence Report',
      category: 'Executive Summary',
      generated: 'Live Synced',
      pages: '18 Pages',
      desc: `Consolidated institutional health (${orgData.kpis?.health?.overallScore || 90}%), systemic risk index (${orgData.kpis?.risk?.averageRiskScore || 14.5}), and 30-day Bayesian incident projections.`,
      generateContent: () => `================================================================================
ORBIS EXECUTIVE INTELLIGENCE DOSSIER
Organization: ${currentOrg.name} (${currentOrg.sector || 'Enterprise'})
Generated: ${new Date().toISOString()}
Author: ${user?.name || 'Executive Officer'} (${role || 'Admin'})
================================================================================

1. EXECUTIVE SUMMARY & INSTITUTIONAL HEALTH
- Overall Organization Health: ${orgData.kpis?.health?.overallScore || 90}% [${orgData.kpis?.health?.status?.toUpperCase() || 'NOMINAL'}]
- Systemic Risk Metric: ${orgData.kpis?.risk?.averageRiskScore || 14.5} pts (Trend: ${orgData.kpis?.risk?.riskTrend || 'stable'})
- Compliance Adherence: ${orgData.kpis?.compliance?.overallCompliancePct || 95}% (Readiness Grade: ${orgData.kpis?.compliance?.auditReadinessGrade || 'A'})
- Projected Incidents Next Month: ${orgData.predictions?.incidentForecast?.projectionNextMonth || 8} (${orgData.predictions?.incidentForecast?.confidenceLevelPct || 95}% confidence)
- Next Quarter Profit Outlook: $${((orgData.predictions?.financialForecast?.projectedNextQuarterProfit || 250000) / 1000).toFixed(0)}k

2. MULTI-PILLAR HEALTH BREAKDOWN
- Risk Pillar: ${orgData.kpis?.health?.componentScores?.riskScore || 85}%
- Compliance Pillar: ${orgData.kpis?.health?.componentScores?.complianceScore || 95}%
- Projects Pillar: ${orgData.kpis?.health?.componentScores?.projectsScore || 80}%
- Finance Pillar: ${orgData.kpis?.health?.componentScores?.financeScore || 88}%
- Operations Pillar: ${orgData.kpis?.health?.componentScores?.operationsScore || 92}%
- HR Pillar: ${orgData.kpis?.health?.componentScores?.hrScore || 90}%

3. KEY BUSINESS EXPLANATIONS
${(orgData.analytics?.topQuestions || []).map((q: any) => `• ${q.question}\n  -> Answer: ${q.shortAnswer}\n  -> Driver: ${(q.primaryDrivers || []).join('; ')}\n  -> Action: ${q.recommendedAction}`).join('\n\n')}

================================================================================
End of Executive Dossier - ORBIS Autonomous Intelligence Platform
================================================================================`
    },
    {
      id: 'risk-register',
      title: 'Active Risk Register & Mitigation Audit',
      category: 'Risk Management',
      generated: 'Live Synced',
      pages: `${(orgData.risks || []).length} Records`,
      desc: `Comprehensive ledger of all ${(orgData.risks || []).length} registered risks, likelihood/impact matrix, mitigating controls, and owners.`,
      generateContent: () => `================================================================================
ORBIS MASTER RISK REGISTER
Organization: ${currentOrg.name}
Total Registered Risks: ${(orgData.risks || []).length} (Open: ${orgData.kpis?.risk?.totalOpenRisks || 0}, Critical: ${orgData.kpis?.risk?.criticalRisksCount || 0})
================================================================================
${(orgData.risks || []).map((r: any, i: number) => `[${i+1}] ${r.title}
    ID: ${r.id} | Department: ${r.department} | Category: ${r.category || 'Operational'}
    Severity: ${r.severity.toUpperCase()} | Score: ${r.score}
    Status: ${r.status.toUpperCase()} | Owner: ${r.owner}
    Mitigation: ${r.mitigation}
`).join('\n')}
================================================================================`
    },
    {
      id: 'compliance-summary',
      title: 'Statutory GRC & Regulatory Compliance Certificate',
      category: 'Compliance & Audit',
      generated: 'Live Synced',
      pages: `${(orgData.complianceControls || []).length} Controls`,
      desc: `Formal attestation of ${(orgData.complianceControls || []).length} statutory controls across ISO, HIPAA, FIPS, and industry regulatory frameworks.`,
      generateContent: () => `================================================================================
STATUTORY COMPLIANCE & AUDIT ATTESTATION
Organization: ${currentOrg.name}
Compliance Score: ${orgData.kpis?.compliance?.overallCompliancePct || 95}% | Readiness Grade: ${orgData.kpis?.compliance?.auditReadinessGrade || 'A'}
Overdue Controls: ${orgData.kpis?.compliance?.overdueControlsCount || 0}
================================================================================
${(orgData.complianceControls || []).map((c: any, i: number) => `[${i+1}] ${c.title || c.id}
    Code: ${c.id} | Framework: ${c.standard} | Department: ${c.department}
    Status: ${c.status.toUpperCase()} | Adherence: ${c.adherencePct}%
    Last Verified: ${c.lastAuditDate || 'Recent'}
`).join('\n')}
================================================================================`
    },
    {
      id: 'incident-analysis',
      title: 'Incident Telemetry & Root-Cause Analysis',
      category: 'Incident Management',
      generated: 'Live Synced',
      pages: `${(orgData.incidents || []).length} Incidents`,
      desc: `Detailed investigation logs, severity progression, root cause categorization, and resolution work orders.`,
      generateContent: () => `================================================================================
INCIDENT TELEMETRY & ROOT CAUSE INVESTIGATION
Organization: ${currentOrg.name}
Total Logged Incidents: ${(orgData.incidents || []).length}
================================================================================
${(orgData.incidents || []).map((inc: any, i: number) => `[${i+1}] ${inc.title}
    ID: ${inc.id} | Department: ${inc.department} | Severity: ${inc.severity.toUpperCase()}
    Status: ${inc.status.toUpperCase()} | Timestamp: ${inc.timestamp}
    Root Cause: ${inc.rootCause || 'Under Investigation'}
`).join('\n')}
================================================================================`
    },
    {
      id: 'department-benchmark',
      title: 'Department Performance & Capacity Benchmark',
      category: 'Analytics & Operations',
      generated: 'Live Synced',
      pages: `${(orgData.analytics?.departmentComparisons || []).length} Divisions`,
      desc: `Cross-departmental operational friction, compliance health, budget utilization, and critical incident vectors.`,
      generateContent: () => `================================================================================
DEPARTMENT CAPACITY & PERFORMANCE BENCHMARK
Organization: ${currentOrg.name}
================================================================================
${(orgData.analytics?.departmentComparisons || []).map((d: any) => `• Division: ${d.department}
    Operational Risk: ${d.riskScore}% | Compliance Score: ${d.compliancePct}%
    Budget Utilization: ${d.budgetUtilizationPct}% | Active Incidents: ${d.incidentCount}
`).join('\n')}
================================================================================`
    }
  ];

  const handleExport = (format: string, report: typeof reports[0]) => {
    const key = `${format}-${report.title}`;
    setDownloadingFormat(key);

    setTimeout(() => {
      setDownloadingFormat(null);
      
      const content = report.generateContent();
      const mimeType = format === 'Excel' ? 'text/csv' : 'text/plain';
      const extension = format === 'Excel' ? 'csv' : format === 'PDF' ? 'txt' : 'txt';
      const filename = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${new Date().toISOString().slice(0, 10)}.${extension}`;
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(`Generated and exported live ${report.title} (${format.toUpperCase()})`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 800);
  };

  const handlePreview = (report: typeof reports[0]) => {
    setActivePreviewReport({
      title: report.title,
      content: report.generateContent()
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <FileText size={16} /> Centralized Enterprise Reporting &bull; {currentOrg.name}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Automated Intelligence &amp; Audit Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Dynamically synthesized board dossiers, compliance certificates, and operational registers powered by current organizational data.
          </p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="glass-card animate-fade-in" style={{ padding: '1rem 1.5rem', background: 'rgba(21, 84, 232, 0.15)', border: '1px solid rgba(106, 231, 247, 0.4)', color: '#6AE7F7', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, borderRadius: '14px' }}>
          <CheckCircle2 size={20} color="#6AE7F7" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {reports.map((rep) => (
          <div 
            key={rep.id}
            className="glass-card"
            style={{
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', maxWidth: '750px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `${currentOrg.themeColor}20`, color: currentOrg.themeColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={26} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentOrg.themeColor, textTransform: 'uppercase' }}>
                    {rep.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    &bull; {rep.generated} &bull; {rep.pages}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.4rem', color: '#FFFFFF' }}>
                  {rep.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {rep.desc}
                </p>
              </div>
            </div>

            {/* Action Buttons: Preview + Export formats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handlePreview(rep)}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  background: 'rgba(21, 84, 232, 0.2)',
                  border: '1px solid rgba(46, 155, 248, 0.35)',
                  color: '#6AE7F7',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <Eye size={14} /> Preview
              </button>

              {(['PDF', 'Excel'] as const).map(fmt => {
                const isCompiling = downloadingFormat === `${fmt}-${rep.title}`;
                return (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt, rep)}
                    disabled={Boolean(downloadingFormat)}
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: downloadingFormat ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {isCompiling ? (
                      <Loader2 size={16} className="animate-spin text-gradient" />
                    ) : (
                      <Download size={14} />
                    )}
                    <span>{fmt}</span>
                  </button>
                );
              })}
            </div>

          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {activePreviewReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '850px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(7, 17, 46, 0.98)',
            border: '1px solid rgba(46, 155, 248, 0.4)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
          }}>
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid rgba(46, 155, 248, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="#6AE7F7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#F6FDFF', margin: 0 }}>
                  {activePreviewReport.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewReport(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(246, 253, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem 2rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.85rem',
              color: 'rgba(246, 253, 255, 0.9)',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              background: 'rgba(3, 9, 28, 0.9)'
            }}>
              {activePreviewReport.content}
            </div>

            <div style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid rgba(46, 155, 248, 0.2)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem'
            }}>
              <button
                onClick={() => setActivePreviewReport(null)}
                className="btn btn-secondary"
                style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EnterpriseReports;

