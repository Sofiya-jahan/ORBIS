import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LayoutDashboard, PieChart, FileText, Activity, AlertTriangle, 
  Lightbulb, ClipboardList, User, Users, Settings, LogOut, Menu, 
  Search, Bell, Sun, Moon, MessageSquare, ChevronRight, Sparkles, Building2, Landmark, GraduationCap, Briefcase
} from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { organization, role, user, logout, theme, setTheme } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getOrgIcon = () => {
    switch (organization) {
      case 'hospital': return <Activity size={24} />;
      case 'bank': return <Landmark size={24} />;
      case 'college': return <GraduationCap size={24} />;
      case 'company': return <Briefcase size={24} />;
      case 'government': return <Building2 size={24} />;
      default: return <Activity size={24} />;
    }
  };

  // Dynamic menu
  const getMenuItems = () => {
    const baseItems = [
      { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    ];
    
    // Add specific items based on role/org
    if (organization === 'hospital') {
      baseItems.push({ name: 'Patient AI', icon: ClipboardList, path: '/dashboard/patients' });
    } else if (organization === 'bank') {
      baseItems.push({ name: 'Fraud Analytics', icon: AlertTriangle, path: '/dashboard/fraud-risk' });
    }
    
    baseItems.push(
      { name: 'Risk Prediction', icon: Activity, path: '/dashboard/risk-prediction' },
      { name: 'Advanced Analytics', icon: PieChart, path: '/dashboard/analytics' },
      { name: 'Smart Reports', icon: FileText, path: '/dashboard/reports' },
      { name: 'System Alerts', icon: Bell, path: '/dashboard/alerts' }
    );
    return baseItems;
  };

  const menuItems = getMenuItems();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    const segment = path.split('/').pop() || '';
    return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden' }}>
      
      {/* Floating Sidebar */}
      <div style={{ padding: '1rem', display: 'flex', zIndex: 50 }}>
        <aside className="neo-card" style={{ 
          width: sidebarOpen ? '260px' : '80px', 
          transition: 'width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
          height: 'calc(100vh - 2rem)',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Logo Area */}
          <div style={{ 
            height: '80px', display: 'flex', alignItems: 'center', 
            justifyContent: sidebarOpen ? 'space-between' : 'center', 
            padding: '0 1.5rem', borderBottom: '1px solid var(--border-color)' 
          }}>
            {sidebarOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: 'var(--primary)' }}>
                  {getOrgIcon()}
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.25rem', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
                  IPRAP <span style={{ color: 'var(--primary)', fontWeight: '500' }}>v2</span>
                </span>
              </div>
            ) : (
              <div style={{ color: 'var(--primary)' }}>{getOrgIcon()}</div>
            )}
          </div>

          {/* Navigation */}
          <nav className="custom-scrollbar" style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div 
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center',
                    margin: '0 1rem', padding: '0.75rem',
                    borderRadius: '12px', cursor: 'pointer',
                    color: isActive ? 'white' : 'var(--text-secondary)',
                    background: isActive ? 'var(--primary-gradient)' : 'transparent',
                    boxShadow: isActive ? '0 4px 15px rgba(var(--primary-rgb), 0.3)' : 'none',
                    transition: 'all 0.3s ease',
                    gap: '1rem', position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  <item.icon size={20} style={{ minWidth: '20px', marginLeft: sidebarOpen ? '0' : '0.25rem' }} />
                  {sidebarOpen && <span style={{ fontWeight: isActive ? '600' : '500', whiteSpace: 'nowrap' }}>{item.name}</span>}
                </div>
              );
            })}
          </nav>

          {/* Bottom Area */}
          <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            
            {sidebarOpen && (
              <div style={{ 
                padding: '1rem', borderRadius: '12px', background: 'var(--primary-light)', 
                border: '1px solid var(--primary)', color: 'var(--primary)', 
                marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
                  <Sparkles size={16} /> AI Assistant Active
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>System health is optimal. No critical anomalies detected.</div>
              </div>
            )}

            <div 
              onClick={handleLogout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', 
                cursor: 'pointer', borderRadius: '12px', color: 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <LogOut size={20} style={{ minWidth: '20px' }} />
              {sidebarOpen && <span style={{ fontWeight: '500' }}>Secure Logout</span>}
            </div>
          </div>
        </aside>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '1rem 1rem 1rem 0' }}>
        
        {/* Modern Topbar */}
        <header className="glass-panel" style={{ 
          height: '72px', borderRadius: '20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem', marginBottom: '1rem', zIndex: 40
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex' }}>
              <Menu size={24} />
            </button>
            
            {/* Breadcrumb */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
              <span style={{ textTransform: 'capitalize' }}>{organization}</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{getBreadcrumb()}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {/* Search */}
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search models, reports (Ctrl+K)" 
                style={{ 
                  width: '100%', padding: '0.5rem 1rem 0.5rem 2.5rem', height: '40px',
                  borderRadius: '100px', border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)', color: 'var(--text-primary)',
                  fontSize: '0.875rem', outline: 'none', transition: 'border 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button onClick={toggleTheme} style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              
              <button style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                <MessageSquare size={20} />
              </button>

              <button style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor='var(--bg-secondary)'} onMouseLeave={e => e.currentTarget.style.backgroundColor='transparent'}>
                <Bell size={20} />
                <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--danger)', border: '2px solid var(--bg-primary)' }}></span>
              </button>
            </div>
            
            {/* User Profile */}
            <div 
              onClick={() => navigate('/dashboard/profile')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', 
                borderLeft: '1px solid var(--border-color)', cursor: 'pointer' 
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '600', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user?.name || 'Executive'}</span>
                <span style={{ color: 'var(--primary)', fontSize: '0.75rem', textTransform: 'capitalize', fontWeight: '600' }}>{role}</span>
              </div>
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '12px', 
                background: 'var(--primary-gradient)', color: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 'bold', fontSize: '1.25rem', boxShadow: 'var(--shadow-md)' 
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'E'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <div className="custom-scrollbar" style={{ flex: 1, overflowY: 'auto', borderRadius: '24px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
