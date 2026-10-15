import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  FileText, FileSpreadsheet, Download, CheckCircle2, 
  Loader2, Sparkles, Share2, Printer, Eye 
} from 'lucide-react';

export const EnterpriseReports = () => {
  const { organization, role, user } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const reports = [
    {
      title: 'Q4 Board Risk & Solvency Intelligence Dossier',
      category: 'Executive Summary',
      generated: 'Today, 08:00 AM',
      pages: '24 Pages',
      desc: 'Complete overview of organizational health score, Monte Carlo 30-day forecast, and department breakdown.'
    },
    {
      title: 'Real-Time Incident Investigation & Root-Cause Audit',
      category: 'Incident Management',
      generated: 'Yesterday, 17:30',
      pages: '12 Pages',
      desc: 'Detailed telemetry logs, human factor correlation, and resolved mitigation work orders.'
    },
    {
      title: 'Statutory GRC & Regulatory Compliance Certificate',
      category: 'Compliance & Audit',
      generated: '2 days ago',
      pages: '8 Pages',
      desc: 'Formal signed verification of policy adherence, zero critical breaches, and audit readiness.'
    }
  ];

  const handleExport = (format: string, reportTitle: string) => {
    setDownloadingFormat(`${format}-${reportTitle}`);
    setTimeout(() => {
      setDownloadingFormat(null);
      setDownloadSuccess(`Successfully compiled and exported ${reportTitle} (${format.toUpperCase()})`);
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 1200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <FileText size={16} /> Enterprise Reporting Engine
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Automated Intelligence & Audit Reports
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Generate and export board-ready analytics dossiers, compliance certificates, and risk registers for {currentOrg.name}.
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
        {reports.map((rep, idx) => (
          <div 
            key={idx}
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
                    &bull; Generated: {rep.generated} &bull; {rep.pages}
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

            {/* Export Format Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {(['PDF', 'Excel', 'PowerPoint'] as const).map(fmt => {
                const isCompiling = downloadingFormat === `${fmt}-${rep.title}`;
                return (
                  <button
                    key={fmt}
                    onClick={() => handleExport(fmt, rep.title)}
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
                    onMouseEnter={(e) => {
                      if (!downloadingFormat) {
                        e.currentTarget.style.borderColor = currentOrg.themeColor;
                        e.currentTarget.style.color = currentOrg.themeColor;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!downloadingFormat) {
                        e.currentTarget.style.borderColor = 'var(--border-color)';
                        e.currentTarget.style.color = 'var(--text-primary)';
                      }
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

    </div>
  );
};

export default EnterpriseReports;
