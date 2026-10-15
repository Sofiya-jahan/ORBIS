import React, { useState, useRef } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  User, Mail, Building2, Briefcase, Hash, Phone, Clock, 
  ShieldCheck, Upload, Loader2, Lock, CheckCircle2, Shield, Camera,
  Sun, Moon, Palette, Check
} from 'lucide-react';
import { uploadProfileAvatar } from '../services/supabaseStorage';
import { validateFileUpload, sanitizeInput } from '../services/securityService';

export const Profile = () => {
  const { user, organization, role, updateUser, theme, setTheme } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [contactInput, setContactInput] = useState(user?.contact || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!user) return null;

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate avatar file with zero-trust sieve
    const sieve = validateFileUpload(file, { maxSizeBytes: 5 * 1024 * 1024 });
    if (!sieve.valid) {
      setUploadStatus(sieve.error || 'Avatar file rejected by security policy.');
      setTimeout(() => setUploadStatus(null), 4000);
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    setUploadStatus('Encrypting & uploading avatar image...');

    try {
      const { url, error } = await uploadProfileAvatar(file, user.id);
      if (url) {
        updateUser({ photoURL: url });
        setUploadStatus(error || 'Avatar successfully updated & synced!');
        setTimeout(() => setUploadStatus(null), 3500);
      }
    } catch (err: any) {
      setUploadStatus(`Upload failed: ${err.message || 'Unknown network error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = sanitizeInput(nameInput);
    const cleanContact = sanitizeInput(contactInput);

    updateUser({
      name: cleanName || user.name,
      contact: cleanContact,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      
      {/* Page Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <ShieldCheck size={16} /> Identity & Credential Governance
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.35rem', color: 'var(--text-primary)' }}>
            Executive Profile & Credentials
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage verified credentials, sovereign role clearance, and institutional security parameters.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.45rem 0.9rem', borderRadius: '12px',
            background: 'rgba(21, 84, 232, 0.15)', border: '1px solid rgba(46, 155, 248, 0.3)',
            fontSize: '0.75rem', color: '#6AE7F7', fontWeight: 800, letterSpacing: '0.5px',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <Shield size={14} />
            SOVEREIGN VAULT // ENCRYPTED
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '0.45rem 0.9rem', borderRadius: '12px',
            background: 'rgba(21, 84, 232, 0.15)', border: '1px solid rgba(46, 155, 248, 0.3)',
            fontSize: '0.75rem', color: '#2E9BF8', fontWeight: 800, letterSpacing: '0.5px',
            fontFamily: "'JetBrains Mono', monospace"
          }}>
            <Lock size={14} />
            ZERO-TRUST CLEARANCE
          </div>
        </div>
      </div>

      {uploadStatus && (
        <div style={{
          padding: '0.95rem 1.35rem',
          borderRadius: '12px',
          background: 'rgba(21, 84, 232, 0.15)',
          border: '1px solid rgba(106, 231, 247, 0.4)',
          color: '#6AE7F7',
          fontSize: '0.88rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle2 size={18} color="#6AE7F7" />
          {uploadStatus}
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleAvatarSelect} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Profile Overview Header Card */}
      <div className="neo-card" style={{ display: 'flex', alignItems: 'center', gap: '2.25rem', padding: '2.25rem', background: 'var(--bg-secondary)', flexWrap: 'wrap' }}>
        
        {/* Avatar with Upload Trigger */}
        <div style={{ position: 'relative' }}>
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.name} 
              style={{ 
                width: '116px', 
                height: '116px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: `3px solid ${currentOrg.themeColor}`,
                boxShadow: `0 0 30px ${currentOrg.themeColor}44`
              }} 
            />
          ) : (
            <div style={{ 
              width: '116px', height: '116px', borderRadius: '50%', 
              backgroundColor: currentOrg.themeColor, color: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '3rem', fontWeight: '800',
              boxShadow: `0 0 30px ${currentOrg.themeColor}44`,
              fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)"
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
              bottom: '4px',
              right: '4px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: currentOrg.themeColor,
              border: '2px solid var(--bg-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
              transition: 'all 0.2s ease',
            }}
            title="Upload new profile photo"
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
          </button>
        </div>
        
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              {user.name}
            </h2>
            <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
              Active Session
            </span>
          </div>

          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.92rem' }}>
            <Mail size={16} color="var(--text-muted)" /> {user.email}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ 
              padding: '0.35rem 0.9rem', 
              backgroundColor: `${currentOrg.themeColor}1a`, 
              color: currentOrg.themeColor, 
              border: `1px solid ${currentOrg.themeColor}44`,
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: '700',
              textTransform: 'capitalize',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Building2 size={14} /> {currentOrg.name}
            </span>
            <span style={{ 
              padding: '0.35rem 0.9rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              color: 'var(--text-primary)', 
              border: '1px solid var(--border-color)',
              borderRadius: '999px',
              fontSize: '0.82rem',
              fontWeight: '700',
              textTransform: 'capitalize',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <Briefcase size={14} color={currentOrg.themeColor} /> {currentRole.title}
            </span>
          </div>
        </div>
        
        <div>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem' }}
          >
            {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Change Profile Photo
          </button>
        </div>
      </div>

      {/* Organization Theme & Appearance Switcher Card */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Palette size={16} /> Dynamic Visual Identity // {currentOrg.name}
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Workspace Theme & Branding Mode
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.35rem' }}>
              Every organization has its own visual identity with dedicated Dark and Light modes. Your selection persists across sessions.
            </p>
          </div>

          {/* Active Org Branding Swatches */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.55rem 1rem', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Brand Swatches:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <div title={`Primary: ${currentOrg.themeColor}`} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: currentOrg.themeColor, boxShadow: `0 0 8px ${currentOrg.themeColor}88` }} />
              <div title={`Secondary: ${currentOrg.secondaryColor}`} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: currentOrg.secondaryColor, boxShadow: `0 0 8px ${currentOrg.secondaryColor}88` }} />
              <div title={`Accent: ${currentOrg.accentColor}`} style={{ width: '18px', height: '18px', borderRadius: '50%', backgroundColor: currentOrg.accentColor, boxShadow: `0 0 8px ${currentOrg.accentColor}88` }} />
            </div>
          </div>
        </div>

        {/* 2 Interactive Mode Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
          
          {/* Dark Mode Card */}
          <div 
            onClick={() => setTheme('dark')}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              cursor: 'pointer',
              background: theme === 'dark' ? 'var(--hover-bg)' : 'var(--bg-tertiary)',
              border: theme === 'dark' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: theme === 'dark' ? 'var(--shadow-glow, 0 0 25px rgba(0, 0, 0, 0.4))' : 'none',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative'
            }}
          >
            {theme === 'dark' && (
              <span style={{
                position: 'absolute', top: '1rem', right: '1rem',
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '0.2rem 0.6rem', borderRadius: '100px',
                background: 'var(--primary-gradient)', color: '#FFFFFF',
                fontSize: '0.72rem', fontWeight: 800
              }}>
                <Check size={12} /> Active
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: '#07112E', color: '#6AE7F7',
                border: '1px solid rgba(106, 231, 247, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 14px rgba(21, 84, 232, 0.3)'
              }}>
                <Moon size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Enterprise Dark
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Deep Navy, Glowing Accents & Glass Surfaces
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              Deep, immersive cockpit experience designed for command centers, mission monitoring, and low-light executive environments.
            </p>
          </div>

          {/* Light Mode Card */}
          <div 
            onClick={() => setTheme('light')}
            style={{
              padding: '1.5rem',
              borderRadius: '16px',
              cursor: 'pointer',
              background: theme === 'light' ? 'var(--hover-bg)' : 'var(--bg-tertiary)',
              border: theme === 'light' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
              boxShadow: theme === 'light' ? 'var(--shadow-glow, 0 0 25px rgba(0, 0, 0, 0.15))' : 'none',
              transition: 'all 0.25s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'relative'
            }}
          >
            {theme === 'light' && (
              <span style={{
                position: 'absolute', top: '1rem', right: '1rem',
                display: 'flex', alignItems: 'center', gap: '4px',
                padding: '0.2rem 0.6rem', borderRadius: '100px',
                background: 'var(--primary-gradient)', color: '#FFFFFF',
                fontSize: '0.72rem', fontWeight: 800
              }}>
                <Check size={12} /> Active
              </span>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: '#FFFFFF', color: '#1554E8',
                border: '1px solid #CBD5E1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
              }}>
                <Sun size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Executive Light
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  Crisp White, Clean Contrast & Subtle Borders
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
              High-contrast, paper-clean presentation tailored for boardroom presentations, daylight auditing, and compliance reviews.
            </p>
          </div>

        </div>
      </div>

      {/* Two Column Grid: Personal Details & Security Credentials */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.75rem' }}>
        
        {/* Column 1: Personal Details Form */}
        <form onSubmit={handleSaveProfile} className="neo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-secondary)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color={currentOrg.themeColor} /> Personal Information
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Update your display identity and operator contact telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Full Name */}
            <div className="form-group">
              <label className="label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={nameInput} 
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter full operator name"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.85rem 1rem 0.85rem 2.85rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-family)'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = currentOrg.themeColor;
                    e.target.style.boxShadow = `0 0 14px ${currentOrg.themeColor}33`;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="form-group">
              <label className="label">Contact Telemetry Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  value={contactInput} 
                  onChange={(e) => setContactInput(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.85rem 1rem 0.85rem 2.85rem',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-family)'
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = currentOrg.themeColor;
                    e.target.style.boxShadow = `0 0 14px ${currentOrg.themeColor}33`;
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-color)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Read-only Registered Email */}
            <div className="form-group">
              <label className="label">Institutional Email (Verified)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={user.email} 
                  disabled
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '0.85rem 1rem 0.85rem 2.85rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    cursor: 'not-allowed',
                    fontFamily: 'var(--font-family)'
                  }}
                />
              </div>
            </div>

          </div>

          {saveSuccess && (
            <div style={{ 
              padding: '0.75rem 1rem', 
              borderRadius: '10px', 
              background: 'rgba(106, 231, 247, 0.12)', 
              border: '1px solid rgba(106, 231, 247, 0.35)', 
              color: '#6AE7F7', 
              fontSize: '0.85rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <CheckCircle2 size={16} /> Profile changes successfully updated & encrypted!
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              background: currentOrg.themeColor, 
              padding: '0.95rem', 
              fontSize: '0.95rem', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '8px',
              marginTop: '0.5rem'
            }}
          >
            <CheckCircle2 size={18} /> Save Profile Changes
          </button>
        </form>

        {/* Column 2: Professional Details (Read-only) */}
        <div className="neo-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-secondary)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent)" /> Access & Security (Read Only)
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Active zero-trust permissions and session verification telemetry.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Building2 size={18} color="var(--text-muted)" /> <span>Organization</span>
              </div>
              <span style={{ fontWeight: '700', color: currentOrg.themeColor, fontSize: '0.95rem' }}>
                {currentOrg.name}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Briefcase size={18} color="var(--text-muted)" /> <span>Assigned Role</span>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {currentRole.title}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Shield size={18} color="var(--text-muted)" /> <span>Clearance Tier</span>
              </div>
              <span style={{ fontWeight: '700', color: '#6AE7F7', fontSize: '0.9rem' }}>
                {currentRole.accessLevel}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Hash size={18} color="var(--text-muted)" /> <span>Operator Token ID</span>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                {user.id}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <User size={18} color="var(--text-muted)" /> <span>Department</span>
              </div>
              <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                {user.department || 'Executive Operations'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <Clock size={18} color="var(--text-muted)" /> <span>Last Login Timestamp</span>
              </div>
              <span style={{ fontWeight: '600', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {user.lastLogin || new Date().toLocaleString()}
              </span>
            </div>

          </div>
          
          <div style={{ padding: '1.15rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Zero-Trust Governance:</strong> Organization and clearance tier parameters are cryptographically sealed to this session. To switch operational sectors, use the header switcher or re-authenticate through the sovereign verification gate.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
