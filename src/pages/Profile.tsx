import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { User, Mail, Building2, Briefcase, Hash, Phone, Clock, ShieldCheck } from 'lucide-react';

const Profile = () => {
  const { user, organization, role } = useAuthStore();

  if (!user) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>User Profile</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and view your access levels.</p>
      </div>

      {/* Profile Overview Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem' }}>
        <div style={{ 
          width: '100px', height: '100px', borderRadius: '50%', 
          backgroundColor: 'var(--primary)', color: 'white', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: '2.5rem', fontWeight: 'bold' 
        }}>
          {user.name.charAt(0).toUpperCase()}
        </div>
        
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Mail size={16} /> {user.email}
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              backgroundColor: 'var(--primary-light)', 
              color: 'var(--primary)', 
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Building2 size={14} /> {organization}
            </span>
            <span style={{ 
              padding: '0.25rem 0.75rem', 
              backgroundColor: 'var(--bg-secondary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              borderRadius: '999px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <Briefcase size={14} /> {role}
            </span>
          </div>
        </div>
        
        <div>
          <button className="btn btn-secondary">Edit Profile</button>
        </div>
      </div>

      {/* Details Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } } as any}>
        
        {/* Personal Details */}
        <div className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} className="text-gradient" /> Personal Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input-field" defaultValue={user.name} />
            </div>
            <div>
              <label className="label">Contact Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input type="text" className="input-field" defaultValue={user.contact} style={{ paddingLeft: '2.75rem' }} />
              </div>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Save Changes</button>
        </div>

        {/* Professional Details (Read-only) */}
        <div className="card" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="var(--success)" /> Access & Security (Read Only)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Building2 size={18} /> <span>Organization</span>
              </div>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{organization}</span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Briefcase size={18} /> <span>Role</span>
              </div>
              <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{role}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Hash size={18} /> <span>Employee ID</span>
              </div>
              <span style={{ fontWeight: '600' }}>{user.id}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Users size={18} /> <span>Department</span>
              </div>
              <span style={{ fontWeight: '600' }}>{user.department}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                <Clock size={18} /> <span>Last Login</span>
              </div>
              <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>{user.lastLogin}</span>
            </div>

          </div>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> Organization and Role settings are securely locked for this session. To change access levels, you must log out and re-verify your identity.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

// Fallback Icon
function Users(props: any) { return <User {...props} />; }

export default Profile;
