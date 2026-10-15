import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Scale, ShieldCheck, FileText, CheckCircle2, 
  Clock, GitPullRequest, Award, AlertTriangle, 
  Download, Plus, Search, Calendar, FileSpreadsheet
} from 'lucide-react';

import ComplianceAudit from './ComplianceAudit';
import WorkflowTasks from './WorkflowTasks';
import EnterpriseReports from './EnterpriseReports';

export const GovernanceWorkspace = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = searchParams.get('tab') || 'compliance';
  const setTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: 'compliance', label: 'Compliance & Controls', icon: Scale },
    { id: 'audits', label: 'Audits & Verification', icon: ShieldCheck },
    { id: 'reports', label: 'Reports & Exports', icon: FileText },
    { id: 'approvals', label: 'Approvals & Tasks', icon: Clock },
    { id: 'policies', label: 'Policy Repository', icon: FileSpreadsheet }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div className="glass-card" style={{
        padding: '2rem 2.5rem',
        background: 'rgba(7, 17, 46, 0.92)',
        border: '1px solid rgba(46, 155, 248, 0.25)',
        borderRadius: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#6AE7F7', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>
            <Scale size={16} /> Governance, Risk & Compliance (GRC) &bull; {currentOrg.name}
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F6FDFF', margin: 0, letterSpacing: '-0.5px' }}>
            Centralized Governance Workspace
          </h1>
          <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.95rem', margin: '0.4rem 0 0', maxWidth: '720px' }}>
            Unified command for continuous regulatory compliance, internal and external audits, automated workflow approval queues, and board-ready reporting.
          </p>
        </div>

        {/* Global Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setTab('reports')}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.4rem', fontSize: '0.88rem' }}
          >
            <Download size={16} /> Generate Audit Report
          </button>
          <button 
            onClick={() => setTab('approvals')}
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.8rem 1.25rem', fontSize: '0.88rem' }}
          >
            <Clock size={16} /> View Task Queue
          </button>
        </div>
      </div>

      {/* Primary KPIs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(106, 231, 247, 0.25)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Compliance Adherence</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>98.6%</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Across SOC2, HIPAA & ISO-27001
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Verified Controls</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#2E9BF8', fontFamily: "'JetBrains Mono', monospace" }}>47 / 48</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            1 control pending final sign-off
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Pending Approvals</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>3 Tasks</div>
          <div style={{ fontSize: '0.8rem', color: '#6AE7F7', marginTop: '0.25rem' }}>
            Within 24-hr response SLA
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(7, 17, 46, 0.88)', border: '1px solid rgba(46, 155, 248, 0.2)', borderRadius: '18px' }}>
          <div style={{ color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>Next External Audit</div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#F6FDFF', fontFamily: "'JetBrains Mono', monospace" }}>34 Days</div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(246, 253, 255, 0.75)', marginTop: '0.25rem' }}>
            Automated evidence pre-compiled
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
        
        {/* TAB 1: COMPLIANCE */}
        {activeTab === 'compliance' && (
          <div>
            <ComplianceAudit />
          </div>
        )}

        {/* TAB 2: AUDITS */}
        {activeTab === 'audits' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Institutional Audit Records & Continuous Verification
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Comprehensive historical records of completed third-party audits, continuous automated checks, and auditor findings.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'SOC 2 Type II Annual Security & Privacy Audit', status: 'Passed (Zero Deficiencies)', date: 'Completed Oct 2025', auditor: 'Big 4 Assurance LLP', score: '100%' },
                { name: 'HIPAA Security Rule Automated Control Sieve', status: 'Passed (Nominal)', date: 'Continuous (Daily Check)', auditor: 'ORBIS Sovereign Engine', score: '99.2%' },
                { name: 'ISO/IEC 27001:2022 ISMS Surveillance Audit', status: 'Passed (Certified)', date: 'Completed Aug 2025', auditor: 'Global Certifications', score: '98.5%' }
              ].map((audit, i) => (
                <div key={i} style={{
                  padding: '1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(13, 35, 77, 0.45)',
                  border: '1px solid rgba(46, 155, 248, 0.2)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#6AE7F7', fontWeight: 700, marginBottom: '0.25rem' }}>
                      {audit.date} &bull; Auditor: {audit.auditor}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F6FDFF' }}>
                      {audit.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.65)' }}>Score</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#6AE7F7', fontFamily: "'JetBrains Mono', monospace" }}>{audit.score}</div>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6AE7F7', background: 'rgba(106, 231, 247, 0.15)', padding: '0.4rem 0.9rem', borderRadius: '8px' }}>
                      {audit.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <EnterpriseReports />
          </div>
        )}

        {/* TAB 4: APPROVALS & TASKS */}
        {activeTab === 'approvals' && (
          <div>
            <WorkflowTasks />
          </div>
        )}

        {/* TAB 5: POLICY REPOSITORY */}
        {activeTab === 'policies' && (
          <div className="glass-card" style={{ padding: '2.5rem', background: 'rgba(7, 17, 46, 0.92)', border: '1px solid rgba(46, 155, 248, 0.25)', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#F6FDFF', margin: '0 0 0.5rem' }}>
              Enterprise Governance Policy Library
            </h2>
            <p style={{ color: 'rgba(246, 253, 255, 0.75)', fontSize: '0.92rem', margin: '0 0 2rem' }}>
              Master repository of institutional risk governance policies, operating bylaws, and versioned compliance standards.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {[
                { title: 'POL-01: Zero-Trust Identity & Session Security Policy', version: 'v4.2', updated: '12 days ago', status: 'Active & Enforced' },
                { title: 'POL-02: Cryptographic Key Management & Rotation Standard', version: 'v3.1', updated: '1 month ago', status: 'Active & Enforced' },
                { title: 'POL-03: Incident Escalation & Mandatory Disclosure Protocol', version: 'v5.0', updated: '2 months ago', status: 'Active & Enforced' },
                { title: 'POL-04: Third-Party Vendor Risk Assessment Framework', version: 'v2.8', updated: '3 weeks ago', status: 'Active & Enforced' }
              ].map((pol, i) => (
                <div key={i} style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(13, 35, 77, 0.45)', border: '1px solid rgba(46, 155, 248, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#2E9BF8', background: 'rgba(46, 155, 248, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
                      {pol.version}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(246, 253, 255, 0.55)' }}>
                      Updated {pol.updated}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#F6FDFF' }}>
                    {pol.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6AE7F7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} /> {pol.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default GovernanceWorkspace;
