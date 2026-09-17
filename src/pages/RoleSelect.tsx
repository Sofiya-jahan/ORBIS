import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Stethoscope, ShieldPlus, 
  Briefcase, Landmark, 
  GraduationCap, BookOpen,
  Building2, Users,
  Activity, ShieldCheck, Database, FileText
} from 'lucide-react';

const roleData: Record<string, any[]> = {
  hospital: [
    { id: 'doctor', title: 'Chief Medical Officer', icon: Stethoscope, access: 'Level 4 (High)', desc: 'Full access to patient predictive analytics and resource optimization.', perms: ['Patient Data', 'AI Diagnosis', 'Staff Allocation'] },
    { id: 'nurse', title: 'Head Nurse', icon: ShieldPlus, access: 'Level 3 (Med)', desc: 'Access to ward analytics and real-time patient monitoring.', perms: ['Ward Data', 'Vitals AI', 'Shifts'] }
  ],
  bank: [
    { id: 'manager', title: 'Risk Manager', icon: Briefcase, access: 'Level 4 (High)', desc: 'Comprehensive view of fraud detection and market risk models.', perms: ['Fraud AI', 'Market Risk', 'Compliance'] },
    { id: 'cashier', title: 'Branch Lead', icon: Landmark, access: 'Level 2 (Low)', desc: 'Local branch analytics and daily transaction monitoring.', perms: ['Branch Data', 'Daily Auth', 'Reports'] }
  ],
  college: [
    { id: 'principal', title: 'Dean / Principal', icon: GraduationCap, access: 'Level 4 (High)', desc: 'Campus-wide analytics, predictive student success, and faculty metrics.', perms: ['Campus AI', 'Student Risk', 'Budgets'] },
    { id: 'teacher', title: 'Professor', icon: BookOpen, access: 'Level 2 (Low)', desc: 'Class-specific performance predictions and attendance analytics.', perms: ['Class Data', 'Grading AI', 'Schedules'] }
  ],
  company: [
    { id: 'ceo', title: 'Chief Executive', icon: Building2, access: 'Level 5 (Max)', desc: 'Enterprise-wide operational risk intelligence and forecasting.', perms: ['Global AI', 'Revenue Risk', 'M&A'] },
    { id: 'manager', title: 'Project Manager', icon: Users, access: 'Level 3 (Med)', desc: 'Departmental risk, resource allocation, and project analytics.', perms: ['Dept Data', 'Resource AI', 'Reports'] }
  ],
  government: [
    { id: 'administrator', title: 'City Administrator', icon: Building2, access: 'Level 4 (High)', desc: 'Smart city analytics, public service risks, and security.', perms: ['City AI', 'Security', 'Budget'] },
    { id: 'clerk', title: 'Public Officer', icon: FileText, access: 'Level 2 (Low)', desc: 'Citizen request analytics and local departmental reporting.', perms: ['Local Data', 'Requests', 'Reports'] }
  ]
};

const RoleSelect = () => {
  const { organization, setRole } = useAuthStore();
  const navigate = useNavigate();
  const [hoveredRole, setHoveredRole] = useState<string | null>(null);

  if (!organization) {
    navigate('/org-select');
    return null;
  }

  const roles = roleData[organization] || [];

  const handleSelect = (roleId: string) => {
    setTimeout(() => {
      setRole(roleId);
      navigate('/security-key');
    }, 600);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '4rem 2rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade-in">
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem', 
          padding: '0.5rem 1rem', borderRadius: '20px', 
          backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          marginBottom: '1.5rem', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: '600',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Workspace: {organization}
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px', fontFamily: 'var(--font-heading)' }}>
          Select Access Role
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
          Your role determines the AI modules, data access levels, and analytical tools available in your dashboard.
        </p>
      </div>

      <div style={{ 
        display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', maxWidth: '1000px', width: '100%'
      }}>
        {roles.map((role, index) => {
          const isHovered = hoveredRole === role.id;
          return (
            <div 
              key={role.id}
              className="glass-card animate-fade-in-delayed"
              style={{ 
                animationDelay: `${index * 0.15}s`,
                width: '100%', maxWidth: '450px',
                padding: '2.5rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderColor: isHovered ? 'var(--primary)' : 'var(--border-color)',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
              }}
              onMouseEnter={() => setHoveredRole(role.id)}
              onMouseLeave={() => setHoveredRole(null)}
              onClick={() => handleSelect(role.id)}
            >
              {/* Animated Background Gradient on Hover */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
                background: 'var(--primary-gradient)',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }} />
              
              <div style={{
                position: 'absolute', inset: 0,
                background: 'var(--primary-gradient)',
                opacity: isHovered ? 0.05 : 0,
                transition: 'opacity 0.3s ease',
                zIndex: 0
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '16px', 
                    backgroundColor: isHovered ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: isHovered ? 'white' : 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: isHovered ? 'var(--shadow-glow)' : 'none'
                  }}>
                    <role.icon size={32} />
                  </div>
                  <div style={{ 
                    padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600',
                    backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}>
                    {role.access}
                  </div>
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.75rem' }}>{role.title}</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                  {role.desc}
                </p>

                <div>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Module Permissions
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    {role.perms.map((perm: string, i: number) => (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        padding: '0.5rem 0.75rem', borderRadius: '8px',
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.875rem', color: 'var(--text-secondary)'
                      }}>
                        <ShieldCheck size={14} color="var(--primary)" />
                        {perm}
                      </div>
                    ))}
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
