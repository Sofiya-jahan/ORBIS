import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  User, Mail, Building2, Briefcase, Hash, Phone, Clock, 
  ShieldCheck, Upload, Loader2, Database, Cloud, CheckCircle2 
} from 'lucide-react';
import { uploadProfileAvatar } from '../services/supabaseStorage';

const Profile = () => {
  const { user, organization, role, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [contactInput, setContactInput] = useState(user?.contact || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading avatar to Supabase Storage...');

    try {
      const { url, error } = await uploadProfileAvatar(file, user.id);
      if (url) {
        updateUser({ photoURL: url });
        setUploadStatus(error || 'Avatar stored in Supabase & synced to Neon DB!');
        setTimeout(() => setUploadStatus(null), 4500);
      }
    } catch (err: any) {
      setUploadStatus(`Storage failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: nameInput,
      contact: contactInput,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header with Neon DB & Supabase Architecture Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>User Profile & Storage</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage personal credentials, synchronized across Neon DB & Supabase Storage.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.4rem 0.8rem', borderRadius: '12px',
            background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.25)',
            fontSize: '0.75rem', color: '#00E5FF', fontWeight: 700
          }}>
            <Database size={13} />
            NEON DB // ALL STORAGE
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.4rem 0.8rem', borderRadius: '12px',
            background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.75rem', color: '#10B981', fontWeight: 700
          }}>
            <Cloud size={13} />
            SUPABASE // IMAGE STORAGE
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div style={{
          padding: '0.85rem 1.25rem',
          borderRadius: '12px',
          background: 'rgba(0, 229, 255, 0.1)',
          border: '1px solid rgba(0, 229, 255, 0.3)',
          color: '#00E5FF',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} />
          {uploadStatus}
        </div>
      )}

      {/* Hidden file input for Supabase image upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarSelect} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Profile Overview Card */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2rem', flexWrap: 'wrap' }}>
        
        {/* Avatar with Supabase Upload Trigger */}
        <div style={{ position: 'relative' }}>
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.name} 
              style={{ 
                width: '108px', 
                height: '108px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '3px solid var(--primary)',
                boxShadow: '0 0 25px rgba(var(--primary-rgb), 0.3)'
              }} 
            />
          ) : (
            <div style={{ 
              width: '108px', height: '108px', borderRadius: '50%', 
              backgroundColor: 'var(--primary)', color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2.8rem', fontWeight: 'bold',
              boxShadow: '0 0 25px rgba(var(--primary-rgb), 0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}

          {/* Upload Button Overlay */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{
              position: 'absolute',
              bottom: '2px',
              right: '2px',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'var(--primary-gradient)',
              border: '2px solid var(--bg-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
              transition: 'transform 0.2s',
            }}
            title="Upload new image to Supabase Storage"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={15} />}
          </button>
        </div>
        
        <div style={{ flex: 1, minWidth: '240px' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>{user.name}</h2>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Mail size={16} /> {user.email}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Upload to Supabase
          </button>
        </div>
      </div>

      {/* Details Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', '@media (max-width: 768px)': { gridTemplateColumns: '1fr' } } as any}>
        
        {/* Personal Details Form with Neon DB Sync */}
        <form onSubmit={handleSaveProfile} className="card">
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={20} className="text-gradient" /> Personal Information
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="label">Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={nameInput} 
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">Contact Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input 
                  type="text" 
                  className="input-field" 
                  value={contactInput} 
                  onChange={(e) => setContactInput(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }} 
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {saveSuccess && (
            <div style={{ marginTop: '1rem', color: '#10B981', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Changes saved & synced to Neon DB!
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Save Changes to Neon DB
          </button>
        </form>

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
