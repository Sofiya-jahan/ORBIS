import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  Activity, Landmark, GraduationCap, Factory, Cpu, Building2, 
  ShieldCheck, ShoppingBag, HardHat, Zap, Truck, Scale, Flame,
  Search, ArrowRight, TrendingUp, ShieldAlert, Sparkles, ChevronLeft
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Activity, Landmark, GraduationCap, Factory, Cpu, Building2,
  ShieldCheck, ShoppingBag, HardHat, Zap, Truck, Scale, Flame
};

export const OrgSelect = () => {
  const { theme, setOrganization } = useAuthStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isLight = theme === 'light';
  const orgList = Object.values(ORGANIZATIONS);

  const categories = [
    { id: 'all', label: 'All Industries (7)' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance & Banking' },
    { id: 'tech', label: 'Tech & Cloud' },
    { id: 'industrial', label: 'Industrial & Energy' },
    { id: 'public', label: 'Public Sector & Academics' }
  ];

  const filteredOrgs = orgList.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'healthcare') return org.id === 'hospital';
    if (selectedCategory === 'finance') return org.id === 'bank';
    if (selectedCategory === 'tech') return org.id === 'it';
    if (selectedCategory === 'industrial') return org.id === 'manufacturing' || org.id === 'energy';
    if (selectedCategory === 'public') return org.id === 'government' || org.id === 'university';
    return true;
  });

  const handleSelect = (orgId: string) => {
    setIsTransitioning(true);
    setOrganization(orgId);
    setTimeout(() => {
      navigate('/role-selection');
    }, 450);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: isLight ? '#F7F9FC' : '#07112E', 
      backgroundImage: isLight 
        ? 'radial-gradient(circle at 50% 15%, rgba(21, 84, 232, 0.05) 0%, transparent 65%), radial-gradient(circle at 10% 90%, rgba(46, 155, 248, 0.04) 0%, transparent 55%)'
        : 'radial-gradient(circle at 50% 15%, rgba(13, 35, 77, 0.8) 0%, transparent 65%), radial-gradient(circle at 10% 90%, rgba(21, 84, 232, 0.15) 0%, transparent 55%)',
      color: isLight ? '#172033' : '#F6FDFF',
      padding: '2.5rem 2rem 5rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      opacity: isTransitioning ? 0.4 : 1,
      transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.4s ease-in-out',
      fontFamily: "var(--font-family, 'Inter', sans-serif)"
    }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hoveredOrg && ORGANIZATIONS[hoveredOrg]
          ? `radial-gradient(circle at center 20%, ${ORGANIZATIONS[hoveredOrg].themeColor}${isLight ? '18' : '25'} 0%, transparent 65%)`
          : isLight
            ? 'radial-gradient(circle at center 15%, rgba(21, 84, 232, 0.08) 0%, rgba(122, 72, 255, 0.04) 40%, transparent 70%)'
            : 'radial-gradient(circle at center 15%, rgba(21, 84, 232, 0.18) 0%, rgba(122, 72, 255, 0.1) 40%, transparent 70%)',
        transition: 'background 0.5s ease',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Top Navigation & Utility Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.75)',
              border: isLight ? '1px solid #DCE5F2' : '1px solid rgba(46, 155, 248, 0.3)',
              borderRadius: '12px',
              padding: '0.6rem 1.2rem',
              color: isLight ? '#1554E8' : '#6AE7F7',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 700,
              transition: 'all 0.2s ease',
              fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
              boxShadow: isLight ? '0 2px 6px rgba(15, 23, 42, 0.04)' : '0 4px 15px rgba(0,0,0,0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = isLight ? '#1554E8' : '#2E9BF8';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isLight ? '#DCE5F2' : 'rgba(46, 155, 248, 0.3)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <ChevronLeft size={16} /> Home
          </button>

          <ThemeToggle variant="compact" />
        </div>

        {/* Header Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: isLight ? '0 6px 20px rgba(21, 84, 232, 0.2)' : '0 0 35px rgba(21, 84, 232, 0.55)',
              border: isLight ? '1px solid rgba(21, 84, 232, 0.3)' : '1px solid rgba(46, 155, 248, 0.4)',
              background: isLight ? '#FFFFFF' : '#07112E'
            }}>
              <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.5rem 1.25rem',
            borderRadius: '24px',
            background: isLight ? 'rgba(21, 84, 232, 0.08)' : 'rgba(21, 84, 232, 0.15)',
            border: isLight ? '1px solid rgba(21, 84, 232, 0.22)' : '1px solid rgba(106, 231, 247, 0.35)',
            color: isLight ? '#1554E8' : '#6AE7F7',
            fontSize: '0.78rem',
            fontWeight: '800',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            fontFamily: "'JetBrains Mono', monospace",
            marginBottom: '1.25rem',
            boxShadow: isLight ? '0 2px 10px rgba(21, 84, 232, 0.08)' : '0 0 20px rgba(21, 84, 232, 0.2)'
          }}>
            <Sparkles size={14} color={isLight ? '#1554E8' : '#6AE7F7'} /> PHASE 1: ENTERPRISE TENANT SELECTION
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', 
            fontWeight: '800', 
            marginBottom: '0.85rem', 
            letterSpacing: '-1px', 
            fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
            lineHeight: 1.15,
            color: isLight ? '#0F172A' : '#F6FDFF'
          }}>
            Select Organization Workspace
          </h1>
          
          <p style={{ 
            color: isLight ? '#475569' : 'rgba(246, 253, 255, 0.75)', 
            fontSize: '1.18rem', 
            maxWidth: '680px', 
            margin: '0 auto', 
            lineHeight: 1.6, 
            fontFamily: "var(--font-family, 'Inter', sans-serif)" 
          }}>
            ORBIS dynamically configures neural risk models, compliance frameworks, telemetry pipelines, and access tiers for your specific sector.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '3rem',
          maxWidth: '880px',
          margin: '0 auto 3rem auto'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: isLight ? '#1554E8' : '#6AE7F7' }} />
            <input
              type="text"
              placeholder="Search by industry name, risk sector, or keywords (e.g. Hospital, Bank, SCADA, Fraud, HIPAA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1.1rem 1.25rem 1.1rem 3.25rem',
                borderRadius: '16px',
                background: isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.75)',
                border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(46, 155, 248, 0.28)',
                color: isLight ? '#0F172A' : '#F6FDFF',
                fontSize: '1rem',
                fontFamily: "var(--font-family, 'Inter', sans-serif)",
                outline: 'none',
                boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.06)' : '0 8px 24px rgba(0,0,0,0.6)',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = isLight ? '#1554E8' : '#2E9BF8';
                e.target.style.boxShadow = isLight ? '0 0 20px rgba(21, 84, 232, 0.2)' : '0 0 25px rgba(46, 155, 248, 0.35)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = isLight ? '#CBD5E1' : 'rgba(46, 155, 248, 0.28)';
                e.target.style.boxShadow = isLight ? '0 4px 16px rgba(0,0,0,0.06)' : '0 8px 24px rgba(0,0,0,0.6)';
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)",
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isSelected 
                      ? (isLight ? '#1554E8' : '#6AE7F7') 
                      : (isLight ? '#E2E8F0' : 'rgba(46, 155, 248, 0.25)'),
                    background: isSelected 
                      ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)' 
                      : (isLight ? '#FFFFFF' : 'rgba(13, 35, 77, 0.65)'),
                    color: isSelected 
                      ? '#FFFFFF' 
                      : (isLight ? '#475569' : 'rgba(246, 253, 255, 0.75)'),
                    boxShadow: isSelected 
                      ? '0 0 20px rgba(21, 84, 232, 0.35)' 
                      : (isLight ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'),
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7 Flagship Enterprise Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
          gap: '1.75rem',
          padding: '0.5rem'
        }}>
          {filteredOrgs.map((org, index) => {
            const isHovered = hoveredOrg === org.id;
            const IconComponent = iconMap[org.iconName] || Activity;

            return (
              <div 
                key={org.id}
                className="animate-fade-in-delayed"
                style={{ animationDelay: `${index * 0.04}s` }}
                onMouseEnter={() => setHoveredOrg(org.id)}
                onMouseLeave={() => setHoveredOrg(null)}
                onClick={() => handleSelect(org.id)}
              >
                <div style={{
                  position: 'relative',
                  height: '380px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: isHovered 
                    ? isLight 
                      ? `0 20px 40px rgba(0,0,0,0.1), 0 0 30px ${org.themeColor}30` 
                      : `0 24px 50px rgba(0,0,0,0.6), 0 0 35px ${org.themeColor}35`
                    : isLight 
                      ? '0 4px 18px rgba(0,0,0,0.06)' 
                      : '0 8px 24px rgba(0,0,0,0.3)',
                  transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  border: isLight
                    ? `1.5px solid ${isHovered ? org.themeColor : '#E2E8F0'}`
                    : `1px solid ${isHovered ? org.themeColor : 'rgba(46, 155, 248, 0.22)'}`,
                  background: isLight ? '#FFFFFF' : '#07112E',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Background Sector Image (Subtle watermark in light mode, atmospheric in dark mode) */}
                  {org.bgImage && (
                    <div style={{
                      position: 'absolute', inset: -15,
                      backgroundImage: `url(${org.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: isLight ? 0.08 : 0.45,
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      transition: 'transform 5s ease-out, opacity 0.3s ease',
                      zIndex: 0
                    }} />
                  )}

                  {/* Surface Glass Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isLight
                      ? isHovered
                        ? 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.92) 50%, rgba(255,255,255,0.85) 100%)'
                        : 'linear-gradient(to top, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.94) 50%, rgba(255,255,255,0.90) 100%)'
                      : isHovered 
                        ? 'linear-gradient(to top, rgba(7,17,46,0.98) 0%, rgba(13,35,77,0.85) 45%, rgba(7,17,46,0.6) 100%)'
                        : 'linear-gradient(to top, rgba(7,17,46,0.95) 0%, rgba(13,35,77,0.8) 50%, rgba(7,17,46,0.7) 100%)',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s ease',
                    zIndex: 1
                  }} />

                  {/* Card Content */}
                  <div style={{
                    position: 'relative', zIndex: 2,
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%'
                  }}>
                    {/* Top Row: Sector Badge + Icon */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '16px',
                        background: isLight ? '#F1F5F9' : 'rgba(7,17,46,0.85)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: isLight 
                          ? `1.5px solid ${isHovered ? org.themeColor : '#E2E8F0'}`
                          : `1px solid ${isHovered ? '#6AE7F7' : 'rgba(46,155,248,0.3)'}`,
                        color: org.themeColor,
                        transition: 'all 0.3s ease',
                        boxShadow: isHovered ? `0 0 25px ${org.themeColor}40` : 'none'
                      }}>
                        <IconComponent size={28} />
                      </div>

                      <div style={{
                        padding: '0.4rem 0.95rem',
                        borderRadius: '100px',
                        background: isLight ? 'rgba(21, 84, 232, 0.08)' : 'rgba(21, 84, 232, 0.15)',
                        border: isLight ? '1px solid rgba(21, 84, 232, 0.22)' : '1px solid rgba(106, 231, 247, 0.35)',
                        color: isLight ? '#1554E8' : '#6AE7F7',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        fontFamily: "'JetBrains Mono', monospace",
                        letterSpacing: '0.5px'
                      }}>
                        {org.roles.length} Access Roles
                      </div>
                    </div>

                    {/* Bottom Area: Name, Description, Telemetry */}
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: isLight ? org.themeColor : '#6AE7F7', 
                        fontWeight: '800', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1.5px',
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: '0.35rem' 
                      }}>
                        {org.sector}
                      </div>

                      <h2 style={{ 
                        fontSize: '1.65rem', 
                        fontWeight: '800', 
                        marginBottom: '0.6rem', 
                        color: isLight ? '#0F172A' : '#F6FDFF', 
                        lineHeight: 1.2, 
                        fontFamily: "var(--font-heading, 'Space Grotesk', sans-serif)" 
                      }}>
                        {org.name}
                      </h2>

                      {/* Clear, High-Contrast Description Text in Both Themes */}
                      <p style={{ 
                        color: isLight ? '#475569' : 'rgba(246, 253, 255, 0.75)', 
                        fontSize: '0.92rem', 
                        lineHeight: '1.55', 
                        fontFamily: "var(--font-family, 'Inter', sans-serif)",
                        marginBottom: '1.25rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {org.description}
                      </p>

                      {/* Live Telemetry Pill */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.75rem 1rem',
                        borderRadius: '14px',
                        background: isLight 
                          ? isHovered ? '#F1F5F9' : '#F8FAFC'
                          : isHovered ? 'rgba(21, 84, 232, 0.2)' : 'rgba(13, 35, 77, 0.65)',
                        border: isLight
                          ? `1px solid ${isHovered ? '#CBD5E1' : '#E2E8F0'}`
                          : `1px solid ${isHovered ? 'rgba(106, 231, 247, 0.45)' : 'rgba(46, 155, 248, 0.18)'}`,
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <TrendingUp size={16} color={isLight ? org.themeColor : '#6AE7F7'} />
                          <div>
                            <div style={{ 
                              fontSize: '0.65rem', 
                              color: isLight ? '#64748B' : 'rgba(246, 253, 255, 0.55)', 
                              textTransform: 'uppercase', 
                              letterSpacing: '0.5px' 
                            }}>
                              {org.statLabel}
                            </div>
                            <div style={{ 
                              fontSize: '0.95rem', 
                              fontWeight: '700', 
                              color: isLight ? '#0F172A' : '#F6FDFF' 
                            }}>
                              {org.statValue}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: isHovered 
                            ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)' 
                            : isLight ? '#E2E8F0' : 'rgba(46, 155, 248, 0.15)',
                          color: isHovered ? '#FFFFFF' : isLight ? '#475569' : '#F6FDFF',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          transform: isHovered ? 'translateX(3px)' : 'translateX(0)',
                          boxShadow: isHovered ? '0 0 12px rgba(46, 155, 248, 0.5)' : 'none'
                        }}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredOrgs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: isLight ? '#64748B' : 'var(--text-muted)' }}>
            <ShieldAlert size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: isLight ? '#0F172A' : 'var(--text-primary)', marginBottom: '0.5rem' }}>No matching industry found</h3>
            <p>Try searching for a different term or clear the filter.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrgSelect;
