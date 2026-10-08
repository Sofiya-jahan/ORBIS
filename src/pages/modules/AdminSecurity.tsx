import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Settings, Users, ShieldCheck, Key, Lock, 
  ShieldAlert, RefreshCw, UserPlus, CheckCircle2 
} from 'lucide-react';

export const AdminSecurity = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  const [activeTab, setActiveTab] = useState<'users' | 'keys' | 'security'>('users');

  const mockUsers = [
    { name: 'Dr. Sarah Jenkins', email: 's.jenkins@org.internal', role: currentOrg.roles[0]?.title || 'Executive', level: 'Level 5 (Super Admin)', status: 'Active' },
    { name: 'Marcus Vance', email: 'm.vance@org.internal', role: currentOrg.roles[1]?.title || 'Risk Lead', level: 'Level 4 (Executive)', status: 'Active' },
    { name: 'Elena Rostova', email: 'e.rostova@org.internal', role: currentOrg.roles[2]?.title || 'Specialist', level: 'Level 2 (Specialist)', status: 'Active' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Settings size={16} /> Technical Administration & Security
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            User Provisioning & Security Controls
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            RBAC permissions matrix, encryption tokens, and security policies for {currentOrg.name}.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['users', 'keys', 'security'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
              style={{ background: activeTab === tab ? currentOrg.themeColor : undefined, textTransform: 'capitalize' }}
            >
              {tab === 'users' ? 'Users & Roles' : tab === 'keys' ? 'Security Keys' : 'Security Posture'}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Users & Roles */}
      {activeTab === 'users' && (
        <div className="neo-card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Provisioned Institutional Personnel</h2>
            <button 
              onClick={() => alert('New User Provisioning Modal opened.')}
              className="btn btn-primary"
              style={{ background: currentOrg.themeColor, padding: '0.5rem 1rem', fontSize: '0.82rem' }}
            >
              <UserPlus size={16} /> Provision User
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>User Name & Email</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Assigned Access Role</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Clearance Tier</th>
                <th style={{ padding: '1rem 1.25rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((u, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.92rem', color: '#FFFFFF' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: currentOrg.themeColor, fontWeight: 700 }}>
                    {u.role}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {u.level}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem' }}>
                    <span className="badge badge-success">{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Security Keys */}
      {activeTab === 'keys' && (
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Organization Security Encryption Tokens</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Manage the zero-knowledge authorization keys used to encrypt and verify operator sessions into {currentOrg.name}.
          </p>

          <div style={{ padding: '1.5rem', borderRadius: '14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Default Tenant PIN</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>****** (123456)</div>
            </div>
            <button 
              onClick={() => alert('New 256-bit encryption key rotated.')}
              className="btn btn-secondary"
            >
              Rotate Key
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Security Posture */}
      {activeTab === 'security' && (
        <div className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Zero-Trust Security & Integrity</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>256-bit AES / Lattice</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quantum Resistant Session Encryption</div>
            </div>
            <div style={{ padding: '1.25rem', borderRadius: '12px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
              <div style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.25rem' }}>100% Role Isolation</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Strict zero-leakage client-side RBAC</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSecurity;
