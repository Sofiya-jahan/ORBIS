import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { 
  ShieldCheck, ArrowRight, Shield, Award, Users, Stethoscope, 
  HeartPulse, Activity, ShieldAlert, Scale, Server, UserCheck,
  Wrench, Factory, Cpu, Terminal, Landmark, TrendingUp,
  Building2, GraduationCap, HardHat, Zap, Truck, FileText,
  ShoppingBag, Flame, Lock, ChevronLeft, Sun, Moon
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Award, Users, Stethoscope, HeartPulse, Activity, ShieldAlert, Scale,
  Server, UserCheck, Wrench, Factory, Cpu, Terminal, Landmark,
  TrendingUp, Building2, GraduationCap, HardHat, Zap, Truck,
  FileText, ShoppingBag, Flame, ShieldCheck
};

export const RoleSelect = () => {
  const { organization, setRole, theme, setTheme } = useAuthStore();
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLight = theme === 'light';

  // If no organization selected, redirect back to organization selection
  if (!organization || !ORGANIZATIONS[organization]) {
    return <Navigate to="/organization" replace />;
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
      backgroundColor: isLight ? '#F8FAFC' : '#07112E',
      backgroundImage: isLight
        ? 'radial-gradient(circle at 50% 15%, rgba(21, 84, 232, 0.05) 0%, transparent 65%), radial-gradient(circle at 10% 90%, rgba(46, 155, 248, 0.04) 0%, transparent 55%)'
        : 'radial-gradient(circle at 50% 15%, rgba(13, 35, 77, 0.8) 0%, transparent 65%), radial-gradient(circle at 10% 90%, rgba(21, 84, 232, 0.15) 0%, transparent 55%)',
      color: isLight ? '#0F172A' : '#F6FDFF',
      padding: '2.5rem 2rem 5rem 2rem',
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      position: 'relative',
      opacity: isTransitioning ? 0.4 : 1,
      transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.4s ease-in-out',
      fontFamily: "var(--font-family, 'Inter', sans-serif)"
    }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
        width: '90vw', height: '480px',
        background: `radial-gradient(ellipse at center, ${currentOrg.themeColor}${isLight ? '12' : '22'} 0%, rgba(122, 72, 255, ${isLight ? '0.04' : '0.1'}) 40%, transparent 70%)`,
        zIndex: 0, pointerEvents: 'none'
      }} />

      {/* Top Header Actions */}
      <div style={{
        width: '100%',
        maxWidth: '1280px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2.5rem',
        position: 'relative',
        zIndex: 2
      }}>
        <button
          onClick={() => navigate('/organization')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.75)',
            border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(46, 155, 248, 0.3)',
            borderRadius: '12px',
            padding: '0.65rem 1.3rem',
            color: isLight ? '#1554E8' : '#6AE7F7',
            cursor: 'pointer',
            fontSize: '0.88rem',
            fontWeight: 700,
            transition: 'all 0.2s ease',
            fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
            boxShadow: isLight ? '0 2px 6px rgba(0,0,0,0.05)' : '0 4px 15px rgba(0,0,0,0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = isLight ? '#1554E8' : '#2E9BF8';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = isLight ? '#CBD5E1' : 'rgba(46, 155, 248, 0.3)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ChevronLeft size={16} /> Switch Organization ({currentOrg.name})
        </button>

        <button
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          aria-label="Toggle Theme"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            background: isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.75)',
            border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(46, 155, 248, 0.3)',
            borderRadius: '12px',
            padding: '0.6rem 1.15rem',
            color: isLight ? '#0F172A' : '#F6FDFF',
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
            boxShadow: isLight ? '0 2px 6px rgba(0,0,0,0.05)' : '0 4px 15px rgba(0,0,0,0.5)',
            transition: 'all 0.2s ease'
          }}
        >
          {isLight ? <Moon size={15} color="#1554E8" /> : <Sun size={15} color="#F59E0B" />}
          <span>{isLight ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem', position: 'relative', zIndex: 1 }} className="animate-fade-in">
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1.3rem', borderRadius: '100px', 
          backgroundColor: isLight ? 'rgba(21, 84, 232, 0.08)' : 'rgba(21, 84, 232, 0.15)', 
          border: isLight ? '1px solid rgba(21, 84, 232, 0.22)' : '1px solid rgba(106, 231, 247, 0.35)',
          marginBottom: '1.25rem', 
          color: isLight ? '#1554E8' : '#6AE7F7', 
          fontSize: '0.8rem', fontWeight: '800',
          letterSpacing: '1.5px',
          fontFamily: "'JetBrains Mono', monospace",
          boxShadow: isLight ? '0 2px 10px rgba(21, 84, 232, 0.08)' : '0 0 20px rgba(21, 84, 232, 0.2)'
        }}>
          <Lock size={14} color={isLight ? '#1554E8' : '#6AE7F7'} /> PHASE 02: ROLE-BASED ACCESS PROTOCOL
        </div>

        <h1 style={{ 
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
          fontWeight: '800', 
          marginBottom: '0.75rem', 
          letterSpacing: '-1px', 
          fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
          color: isLight ? '#0F172A' : '#F6FDFF'
        }}>
          Select Your Access Role
        </h1>

        <p style={{ 
          color: isLight ? '#475569' : 'rgba(246, 253, 255, 0.75)', 
          fontSize: '1.18rem', 
          maxWidth: '640px', 
          margin: '0 auto', 
          lineHeight: 1.6, 
          fontFamily: "var(--font-family, 'Inter', sans-serif)" 
        }}>
          Only roles authenticated for <span style={{ color: currentOrg.themeColor, fontWeight: 700, textDecoration: 'underline', textDecorationColor: currentOrg.secondaryColor }}>{currentOrg.name}</span> are available. Permissions dynamically dictate your dashboard modules.
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
              className="animate-fade-in-delayed"
              style={{ 
                animationDelay: `${index * 0.06}s`,
                padding: '2.25rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '20px',
                background: isLight
                  ? '#FFFFFF'
                  : isHovered 
                    ? 'linear-gradient(145deg, rgba(13, 35, 77, 0.95), rgba(21, 84, 232, 0.25))' 
                    : 'rgba(13, 35, 77, 0.7)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: isLight
                  ? `1.5px solid ${isHovered ? currentOrg.themeColor : '#E2E8F0'}`
                  : isHovered 
                    ? '1px solid #6AE7F7' 
                    : '1px solid rgba(46, 155, 248, 0.22)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                boxShadow: isHovered 
                  ? isLight
                    ? `0 20px 40px rgba(0, 0, 0, 0.08), 0 0 25px ${currentOrg.themeColor}25`
                    : '0 24px 48px rgba(0, 0, 0, 0.8), 0 0 35px rgba(21, 84, 232, 0.35)' 
                  : isLight
                    ? '0 4px 18px rgba(0, 0, 0, 0.05)'
                    : '0 8px 32px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '320px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleSelect(role.id)}
            >
              {/* Top accent line on hover */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                background: `linear-gradient(90deg, ${currentOrg.themeColor}, ${currentOrg.secondaryColor}, ${currentOrg.accentColor})`,
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }} />

              <div>
                {/* Top Role Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ 
                    width: '60px', height: '60px', borderRadius: '16px', 
                    backgroundColor: isLight ? '#F1F5F9' : (isHovered ? 'rgba(21, 84, 232, 0.3)' : 'rgba(7, 17, 46, 0.85)'),
                    color: currentOrg.themeColor,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? `0 0 24px ${currentOrg.themeColor}40` : 'none',
                    border: isLight 
                      ? `1.5px solid ${isHovered ? currentOrg.themeColor : '#E2E8F0'}`
                      : `1px solid ${isHovered ? '#6AE7F7' : 'rgba(46, 155, 248, 0.3)'}`
                  }}>
                    <RoleIcon size={28} />
                  </div>

                  <div style={{ 
                    padding: '0.4rem 0.95rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700',
                    backgroundColor: isLight ? 'rgba(21, 84, 232, 0.08)' : 'rgba(21, 84, 232, 0.15)', 
                    color: isLight ? '#1554E8' : '#6AE7F7',
                    border: isLight ? '1px solid rgba(21, 84, 232, 0.22)' : '1px solid rgba(106, 231, 247, 0.35)',
                    letterSpacing: '1px',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}>
                    {role.accessLevel}
                  </div>
                </div>

                <h2 style={{ 
                  fontSize: '1.55rem', 
                  fontWeight: '800', 
                  marginBottom: '0.6rem', 
                  color: isLight ? '#0F172A' : '#F6FDFF', 
                  lineHeight: 1.25,
                  fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)"
                }}>
                  {role.title}
                </h2>

                <p style={{ 
                  color: isLight ? '#475569' : 'rgba(246, 253, 255, 0.75)', 
                  fontSize: '0.94rem', 
                  lineHeight: '1.6', 
                  marginBottom: '1.5rem', 
                  fontFamily: "var(--font-family, 'Inter', sans-serif)" 
                }}>
                  {role.desc}
                </p>
              </div>

              {/* Bottom Modules Allowed & Action Bar */}
              <div>
                <div style={{ 
                  borderTop: isLight ? '1px solid #E2E8F0' : '1px solid rgba(46, 155, 248, 0.16)', 
                  paddingTop: '1.1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between' 
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.45rem', 
                    fontSize: '0.8rem', 
                    color: isLight ? '#1554E8' : '#6AE7F7', 
                    fontFamily: "'JetBrains Mono', monospace" 
                  }}>
                    <ShieldCheck size={16} color={isLight ? '#1554E8' : '#6AE7F7'} />
                    <span>{role.permissions.includes('all') ? 'Full Platform Clearance' : `${role.permissions.length} Modules Authorized`}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.88rem',
                    fontWeight: '700',
                    color: isHovered ? currentOrg.themeColor : (isLight ? '#0F172A' : '#F6FDFF'),
                    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                    letterSpacing: '0.5px',
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
