import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  ShieldCheck, ArrowRight, Shield, Award, Users, Stethoscope, 
  HeartPulse, Activity, ShieldAlert, Scale, Server, UserCheck,
  Wrench, Factory, Cpu, Terminal, Landmark, TrendingUp,
  Building2, GraduationCap, HardHat, Zap, Truck, FileText,
  ShoppingBag, Flame, Lock, ChevronLeft
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Award, Users, Stethoscope, HeartPulse, Activity, ShieldAlert, Scale,
  Server, UserCheck, Wrench, Factory, Cpu, Terminal, Landmark,
  TrendingUp, Building2, GraduationCap, HardHat, Zap, Truck,
  FileText, ShoppingBag, Flame, ShieldCheck
};

export const RoleSelect = () => {
  const { organization, setRole } = useAuthStore();
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // If no organization selected, redirect back to organization selection
  if (!organization || !ORGANIZATIONS[organization]) {
    navigate('/organization');
    return null;
  }

  const currentOrg = ORGANIZATIONS[organization];
  const roles = currentOrg.roles;

  const handleSelect = (roleId: string) => {
    setIsTransitioning(true);
    setRole(roleId);
    setTimeout(() => {
      navigate('/login');
    }, 450);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '3rem 2rem 5rem 2rem',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      position: 'relative',
      opacity: isTransitioning ? 0.4 : 1,
      transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.4s ease-in-out',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* Background glow tailored to organization */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '400px',
        background: `radial-gradient(ellipse at center, ${currentOrg.themeColor}18 0%, transparent 70%)`,
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Top Breadcrumb / Back Button */}
      <div style={{ width: '100%', maxWidth: '1280px', marginBottom: '2rem', position: 'relative', zIndex: 2 }}>
        <button
          onClick={() => navigate('/organization')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '0.6rem 1.2rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
            e.currentTarget.style.borderColor = 'var(--border-color)';
          }}
        >
          <ChevronLeft size={16} /> Switch Organization ({currentOrg.name})
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }} className="animate-fade-in">
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.4rem 1.1rem', borderRadius: '100px', 
          backgroundColor: `${currentOrg.themeColor}18`, 
          border: `1px solid ${currentOrg.themeColor}40`,
          marginBottom: '1.25rem', color: currentOrg.themeColor, 
          fontSize: '0.85rem', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          <Lock size={14} /> PHASE 2: ROLE-BASED ACCESS CONTROL
        </div>

        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: '800', 
          marginBottom: '0.75rem', 
          letterSpacing: '-1px', 
          fontFamily: 'var(--font-heading)' 
        }}>
          Select Your Access Role
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
          Only roles authenticated for <span style={{ color: currentOrg.themeColor, fontWeight: 700 }}>{currentOrg.name}</span> are available. Permissions dynamically dictate your dashboard modules.
        </p>
      </div>

      {/* Dynamic Roles Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
        gap: '1.75rem', 
        maxWidth: '1280px', 
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {roles.map((role, index) => {
          const isHovered = hoveredRole === role.id;
          const RoleIcon = iconMap[role.iconName] || Shield;

          return (
            <div 
              key={role.id}
              className="glass-card animate-fade-in-delayed"
              style={{ 
                animationDelay: `${index * 0.06}s`,
                padding: '2.25rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderColor: isHovered ? currentOrg.themeColor : 'var(--border-color)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered ? `0 20px 40px rgba(0,0,0,0.5), 0 0 25px ${currentOrg.themeColor}30` : 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px'
              }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleSelect(role.id)}
            >
              {/* Top accent line on hover */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: currentOrg.themeColor,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }} />

              <div>
                {/* Top Role Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    width: '60px', height: '60px', borderRadius: '16px', 
                    backgroundColor: isHovered ? currentOrg.themeColor : 'var(--bg-tertiary)',
                    color: isHovered ? '#FFFFFF' : currentOrg.themeColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? `0 0 20px ${currentOrg.themeColor}50` : 'none',
                    border: `1px solid ${isHovered ? currentOrg.themeColor : 'var(--border-color)'}`
                  }}>
                    <RoleIcon size={30} />
                  </div>

                  <div style={{ 
                    padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700',
                    backgroundColor: 'var(--bg-tertiary)', 
                    color: role.levelNumber >= 4 ? '#10B981' : role.levelNumber >= 3 ? currentOrg.themeColor : '#94A3B8',
                    border: '1px solid var(--border-color)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {role.accessLevel}
                  </div>
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.6rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                  {role.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {role.desc}
                </p>
              </div>

              {/* Bottom Modules Allowed & Action Bar */}
              <div>
                <div style={{ 
                  borderTop: '1px solid var(--border-color)', 
                  paddingTop: '1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <ShieldCheck size={16} color={currentOrg.themeColor} />
                    <span>{role.permissions.includes('all') ? 'Full Platform Clearance' : `${role.permissions.length} Modules Authorized`}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: isHovered ? currentOrg.themeColor : 'var(--text-secondary)',
                    transition: 'color 0.2s ease'
                  }}>
                    <span>Authenticate</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default RoleSelect;
