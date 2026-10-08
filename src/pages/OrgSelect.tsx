import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS, type OrganizationConfig } from '../config/platformConfig';
import { 
  Activity, Landmark, GraduationCap, Factory, Cpu, Building2, 
  ShieldCheck, ShoppingBag, HardHat, Zap, Truck, Scale, Flame,
  Search, ArrowRight, TrendingUp, ShieldAlert, Sparkles, Check
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Activity, Landmark, GraduationCap, Factory, Cpu, Building2,
  ShieldCheck, ShoppingBag, HardHat, Zap, Truck, Scale, Flame
};

export const OrgSelect = () => {
  const setOrganization = useAuthStore(state => state.setOrganization);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const orgList = Object.values(ORGANIZATIONS);

  const categories = [
    { id: 'all', label: 'All Industries (13)' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'finance', label: 'Finance & Banking' },
    { id: 'tech', label: 'Tech & Cloud' },
    { id: 'industrial', label: 'Industrial & Energy' },
    { id: 'public', label: 'Public Sector & Legal' }
  ];

  const filteredOrgs = orgList.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'healthcare') return org.id === 'hospital';
    if (selectedCategory === 'finance') return org.id === 'bank' || org.id === 'insurance';
    if (selectedCategory === 'tech') return org.id === 'it' || org.id === 'startup';
    if (selectedCategory === 'industrial') return ['manufacturing', 'energy', 'construction', 'logistics'].includes(org.id);
    if (selectedCategory === 'public') return ['government', 'university', 'lawfirm', 'retail'].includes(org.id);
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
      backgroundColor: 'var(--bg-primary)', 
      color: 'var(--text-primary)',
      padding: '3.5rem 2rem 5rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      opacity: isTransitioning ? 0.4 : 1,
      transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
      transition: 'all 0.4s ease-in-out',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hoveredOrg && ORGANIZATIONS[hoveredOrg]
          ? `radial-gradient(circle at center 20%, ${ORGANIZATIONS[hoveredOrg].themeColor}22 0%, transparent 65%)`
          : 'radial-gradient(circle at center 20%, rgba(11,110,253,0.12) 0%, transparent 60%)',
        transition: 'background 0.5s ease',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1440px', margin: '0 auto' }}>
        
        {/* Header Title Section */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.4rem 1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary)',
            color: 'var(--primary)',
            fontSize: '0.8rem',
            fontWeight: '700',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={15} /> PHASE 1: ENTERPRISE TENANT SELECTION
          </div>
          
          <h1 style={{ 
            fontSize: '3.2rem', 
            fontWeight: '800', 
            marginBottom: '0.85rem', 
            letterSpacing: '-1px', 
            fontFamily: 'var(--font-heading)',
            lineHeight: 1.15
          }}>
            Select Organization Workspace
          </h1>
          
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
            IPRAP dynamically configures neural risk models, compliance frameworks, telemetry pipelines, and access tiers for your specific sector.
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
            <Search size={20} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by industry name, risk sector, or keywords (e.g. Hospital, Bank, SCADA, Fraud, HIPAA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '1.1rem 1.25rem 1.1rem 3.25rem',
                borderRadius: '16px',
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                outline: 'none',
                boxShadow: 'var(--shadow-md)',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px var(--primary-light)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-md)';
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--primary)' : 'var(--border-color)',
                  background: selectedCategory === cat.id ? 'var(--primary-light)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 13 Industry Grid */}
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
                    ? `0 24px 50px rgba(0,0,0,0.6), 0 0 35px ${org.themeColor}35` 
                    : '0 8px 24px rgba(0,0,0,0.3)',
                  transition: 'all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  border: `1px solid ${isHovered ? org.themeColor : 'var(--border-color)'}`,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Background Sector Image */}
                  <div style={{
                    position: 'absolute', inset: -15,
                    backgroundImage: `url(${org.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                    transition: 'transform 5s ease-out',
                    zIndex: 0
                  }} />

                  {/* Dark Glass Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isHovered 
                      ? 'linear-gradient(to top, rgba(7,20,36,0.98) 0%, rgba(7,20,36,0.75) 45%, rgba(7,20,36,0.4) 100%)'
                      : 'linear-gradient(to top, rgba(7,20,36,0.95) 0%, rgba(7,20,36,0.8) 50%, rgba(7,20,36,0.55) 100%)',
                    backdropFilter: 'blur(6px)',
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
                        background: 'rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: `1px solid ${isHovered ? org.themeColor : 'rgba(255,255,255,0.15)'}`,
                        color: org.themeColor,
                        transition: 'all 0.3s ease',
                        boxShadow: isHovered ? `0 0 20px ${org.themeColor}50` : 'none'
                      }}>
                        <IconComponent size={28} />
                      </div>

                      <div style={{
                        padding: '0.35rem 0.85rem',
                        borderRadius: '100px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#CBD5E1',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        letterSpacing: '0.5px'
                      }}>
                        {org.roles.length} Access Roles
                      </div>
                    </div>

                    {/* Bottom Area: Name, Description, Telemetry */}
                    <div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: org.themeColor, 
                        fontWeight: '700', 
                        textTransform: 'uppercase', 
                        letterSpacing: '1px',
                        marginBottom: '0.35rem' 
                      }}>
                        {org.sector}
                      </div>

                      <h2 style={{ fontSize: '1.65rem', fontWeight: '800', marginBottom: '0.6rem', color: '#FFFFFF', lineHeight: 1.2 }}>
                        {org.name}
                      </h2>

                      <p style={{ 
                        color: '#94A3B8', 
                        fontSize: '0.88rem', 
                        lineHeight: '1.5', 
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
                        background: isHovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isHovered ? org.themeColor + '40' : 'rgba(255,255,255,0.08)'}`,
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <TrendingUp size={16} color={org.themeColor} />
                          <div>
                            <div style={{ fontSize: '0.65rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                              {org.statLabel}
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#FFFFFF' }}>
                              {org.statValue}
                            </div>
                          </div>
                        </div>

                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          background: isHovered ? org.themeColor : 'rgba(255,255,255,0.08)',
                          color: isHovered ? '#FFFFFF' : '#94A3B8',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.3s ease',
                          transform: isHovered ? 'translateX(3px)' : 'translateX(0)'
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
          <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
            <ShieldAlert size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No matching industry found</h3>
            <p>Try searching for a different term or clear the filter.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrgSelect;
