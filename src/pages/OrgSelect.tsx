import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Building2, Landmark, GraduationCap, Briefcase, Activity, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const organizations = [
  { 
    id: 'hospital', 
    name: 'Healthcare', 
    icon: Activity, 
    color: '#0B6EFD',
    bgImage: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2000&auto=format&fit=crop',
    description: 'Medical risk, patient predictive analytics, and resource optimization.',
    stats: { label: 'Active Patients', value: '14.2k+' }
  },
  { 
    id: 'bank', 
    name: 'Financial Services', 
    icon: Landmark, 
    color: '#FFD700',
    bgImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop',
    description: 'Fraud detection, market risk, and compliance monitoring AI.',
    stats: { label: 'Transactions/sec', value: '8.5k' }
  },
  { 
    id: 'college', 
    name: 'Education', 
    icon: GraduationCap, 
    color: '#C084FC',
    bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop',
    description: 'Student success prediction and smart campus management.',
    stats: { label: 'Students Tracked', value: '45k+' }
  },
  { 
    id: 'company', 
    name: 'Corporate', 
    icon: Briefcase, 
    color: '#10B981',
    bgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    description: 'Enterprise resource planning and operational risk intelligence.',
    stats: { label: 'Risk Models', value: '124' }
  },
  { 
    id: 'government', 
    name: 'Public Sector', 
    icon: Building2, 
    color: '#90A4AE',
    bgImage: 'https://images.unsplash.com/photo-1523292562811-8fa7962ba5c2?q=80&w=2000&auto=format&fit=crop',
    description: 'Public service analytics, smart city planning, and security.',
    stats: { label: 'Citizens Served', value: '2.4M' }
  }
];

const OrgSelect = () => {
  const setOrganization = useAuthStore(state => state.setOrganization);
  const navigate = useNavigate();
  const [hoveredOrg, setHoveredOrg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (orgId: string) => {
    setIsTransitioning(true);
    // Add a slight delay for the beautiful transition effect before navigating
    setTimeout(() => {
      setOrganization(orgId);
      navigate('/role-selection');
    }, 600);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--bg-primary)', 
      color: 'white',
      padding: '4rem 2rem',
      position: 'relative',
      overflow: 'hidden',
      opacity: isTransitioning ? 0 : 1,
      transition: 'opacity 0.6s ease-in-out',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* Background glow effects based on hovered org */}
      <div style={{
        position: 'absolute', inset: 0,
        background: hoveredOrg 
          ? `radial-gradient(circle at center, ${organizations.find(o => o.id === hoveredOrg)?.color}22 0%, transparent 70%)`
          : 'radial-gradient(circle at center, rgba(0,212,255,0.1) 0%, transparent 70%)',
        transition: 'background 0.5s ease',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in">
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px', fontFamily: 'var(--font-heading)' }}>
            Select Workspace
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
            Choose your deployment sector to configure the AI models and dashboard environment.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '2rem',
          padding: '1rem'
        }}>
          {organizations.map((org, index) => {
            const isHovered = hoveredOrg === org.id;
            return (
              <div 
                key={org.id}
                className="animate-fade-in-delayed"
                style={{ animationDelay: `${index * 0.1}s` }}
                onMouseEnter={() => setHoveredOrg(org.id)}
                onMouseLeave={() => setHoveredOrg(null)}
                onClick={() => handleSelect(org.id)}
              >
                <div style={{
                  position: 'relative',
                  height: '420px',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transform: isHovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
                  boxShadow: isHovered ? `0 30px 60px rgba(0,0,0,0.5), 0 0 40px ${org.color}33` : '0 10px 30px rgba(0,0,0,0.5)',
                  transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                  border: `1px solid ${isHovered ? org.color : 'rgba(255,255,255,0.1)'}`
                }}>
                  {/* Background Image */}
                  <div style={{
                    position: 'absolute', inset: -20,
                    backgroundImage: `url(${org.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 6s ease-out',
                    zIndex: 0
                  }} />

                  {/* Glass Overlay */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isHovered 
                      ? 'linear-gradient(to top, rgba(2,6,23,0.95) 0%, rgba(2,6,23,0.4) 60%, rgba(2,6,23,0.2) 100%)'
                      : 'linear-gradient(to top, rgba(2,6,23,0.98) 0%, rgba(2,6,23,0.7) 50%, rgba(2,6,23,0.5) 100%)',
                    backdropFilter: isHovered ? 'blur(4px)' : 'blur(8px)',
                    transition: 'all 0.4s ease',
                    zIndex: 1
                  }} />

                  {/* Content */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    padding: '2.5rem',
                    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end'
                  }}>
                    {/* Top Icon */}
                    <div style={{
                      position: 'absolute', top: '2.5rem', left: '2.5rem',
                      width: '64px', height: '64px', borderRadius: '16px',
                      background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: isHovered ? org.color : 'white',
                      transition: 'all 0.3s ease',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}>
                      <org.icon size={32} />
                    </div>

                    {/* Text */}
                    <div style={{
                      transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                      transition: 'transform 0.4s ease'
                    }}>
                      <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: 'white' }}>
                        {org.name}
                      </h2>
                      <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: '1.6', marginBottom: '1.5rem', opacity: isHovered ? 1 : 0.7, transition: 'opacity 0.3s' }}>
                        {org.description}
                      </p>

                      {/* Stats - Only visible heavily on hover */}
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '1rem',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.4s ease 0.1s',
                        padding: '1rem', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)'
                      }}>
                        <TrendingUp size={20} color={org.color} />
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            {org.stats.label}
                          </div>
                          <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white' }}>
                            {org.stats.value}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrgSelect;
