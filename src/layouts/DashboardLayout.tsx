import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS, hasPermission } from '../config/platformConfig';
import { AICopilot } from '../components/AICopilot';
import { formatUserName } from '../utils/userUtils';
import { 
  LayoutDashboard, Building2, User, Bell, Search, 
  ShieldAlert, Grid, CheckSquare, GitPullRequest, 
  AlertOctagon, FileText, TrendingUp, Cpu, 
  BarChart2, HelpCircle, CheckCircle, Clock, 
  FileSpreadsheet, Scale, Settings, Users, 
  LogOut, Menu, X, Sun, Moon, Sparkles, 
  ChevronRight, ChevronDown, ShieldCheck, 
  Activity, Landmark, GraduationCap, Factory, 
  ShoppingBag, HardHat, Zap, Truck, Flame, 
  ExternalLink, Layers, ArrowUpRight
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; className?: string }>> = {
  Activity, Landmark, GraduationCap, Factory, Cpu, Building2,
  ShieldCheck, ShoppingBag, HardHat, Zap, Truck, Scale, Flame
};

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>('Risk Management');

  const { organization, role, user, logout, theme, setTheme, setOrganization, setRole } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;
  const currentRole = currentOrg.roles.find(r => r.id === role) || currentOrg.roles[0];
  const userPermissions = currentRole?.permissions || ['dashboard'];
  const userLevel = currentRole?.levelNumber || 1;
  const displayName = formatUserName(user?.name, user?.email);

  // Keybindings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const OrgIcon = iconMap[currentOrg.iconName] || Activity;

  // Exactly 7 Permanent Primary Navigation Modules as specified by Chief Product Architect
  const primaryNavigationModules = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      perm: 'dashboard',
      description: 'Executive overview, health score & role intelligence'
    },
    { 
      name: 'Risk Center', 
      path: '/dashboard/risk-center', 
      icon: ShieldAlert, 
      perm: 'risk',
      description: 'Unified risk register, 5x5 matrix & incident timeline'
    },
    { 
      name: 'AI Intelligence', 
      path: '/dashboard/ai-intelligence', 
      icon: Sparkles, 
      perm: 'predictive',
      description: 'Predictive forecasting, XAI explainability & Copilot'
    },
    { 
      name: 'Organization', 
      path: '/dashboard/organization', 
      icon: Building2, 
      perm: 'dashboard',
      description: 'Institutional topology, sector intelligence & departments'
    },
    { 
      name: 'Analytics', 
      path: '/dashboard/analytics', 
      icon: BarChart2, 
      perm: 'analytics',
      description: 'Multi-axis radars, heatmaps & longitudinal trends'
    },
    { 
      name: 'Governance', 
      path: '/dashboard/governance', 
      icon: Scale, 
      perm: 'compliance',
      description: 'GRC compliance matrix, audits, reports & approvals'
    },
    { 
      name: 'Administration', 
      path: '/dashboard/administration', 
      icon: Settings, 
      perm: 'admin',
      description: 'Zero-trust security, RBAC roles & tamper-evident audit logs'
    }
  ];

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Executive Dashboard';
    if (path.includes('risk-center') || path.includes('/risk') || path.includes('/incidents')) return 'Risk Center';
    if (path.includes('ai-intelligence') || path.includes('/predictive') || path.includes('/xai') || path.includes('risk-prediction')) return 'AI Intelligence';
    if (path.includes('organization') || path.includes('/industry') || path.includes('org-overview')) return 'Organization';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('governance') || path.includes('/compliance') || path.includes('/workflow') || path.includes('/reports')) return 'Governance';
    if (path.includes('administration') || path.includes('/admin')) return 'Administration';
    if (path.includes('profile')) return 'Executive Profile';
    if (path.includes('notifications')) return 'Notification Center';
    const parts = path.split('/').filter(Boolean);
    return parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' / ');
  };

  // Check if current route requires an authorization permission
  const currentRouteItem = primaryNavigationModules.find(item => 
    location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
  );

  const isPermitted = true; // All 7 permanent modules accessible; granular security handled within tabs

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: 'var(--bg-primary)',
      backgroundImage: 'radial-gradient(circle at 15% 10%, rgba(var(--primary-rgb, 21, 84, 232), 0.08) 0%, transparent 45%), radial-gradient(circle at 85% 90%, rgba(var(--secondary-rgb, 122, 72, 255), 0.06) 0%, transparent 45%)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      fontFamily: 'var(--font-family)'
    }}>
      
      {/* Floating AI Assistant */}
      <AICopilot />

      {/* Enterprise Modular Sidebar */}
      <aside style={{ 
        width: sidebarOpen ? '280px' : '84px', 
        transition: 'width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        backgroundColor: 'var(--sidebar-bg)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid var(--sidebar-border)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.25)',
        zIndex: 50,
        flexShrink: 0
      }}>
        {/* Brand & Organization Badge Header */}
        <div style={{ 
          height: '76px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarOpen ? 'space-between' : 'center', 
          padding: '0 1.25rem', 
          borderBottom: '1px solid var(--sidebar-border)',
          background: 'var(--bg-secondary)'
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(var(--primary-rgb, 21, 84, 232), 0.25)'
              }}>
                <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.5px', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                  ORBIS <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '0.8rem', fontWeight: '800' }}>ENTERPRISE</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                  {currentOrg.sector.split('&')[0]}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(var(--primary-rgb, 21, 84, 232), 0.2)'
            }}>
              <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* Dynamic Tenant Info Strip (when expanded) */}
        {sidebarOpen && (
          <div style={{
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--sidebar-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Active Tenant
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                {currentOrg.name.split('&')[0]}
              </span>
            </div>
            <button
              onClick={() => navigate('/organization')}
              title="Switch Organization"
              style={{
                background: 'var(--hover-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.25rem 0.55rem',
                color: 'var(--accent)',
                cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary-gradient)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 0 10px var(--accent)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--hover-bg)';
                e.currentTarget.style.color = 'var(--accent)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Switch <ExternalLink size={11} />
            </button>
          </div>
        )}

        {/* Permanent 7 Primary Navigation Modules */}
        <nav className="custom-scrollbar" style={{ flex: 1, padding: '1.25rem 0.65rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {primaryNavigationModules.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path)) ||
              (item.path === '/dashboard/risk-center' && (location.pathname.startsWith('/dashboard/risk') || location.pathname.startsWith('/dashboard/incidents'))) ||
              (item.path === '/dashboard/ai-intelligence' && (location.pathname.startsWith('/dashboard/predictive') || location.pathname.startsWith('/dashboard/xai') || location.pathname === '/dashboard/risk-prediction')) ||
              (item.path === '/dashboard/organization' && (location.pathname.startsWith('/dashboard/org') || location.pathname.startsWith('/dashboard/industry'))) ||
              (item.path === '/dashboard/governance' && (location.pathname.startsWith('/dashboard/compliance') || location.pathname.startsWith('/dashboard/workflow') || location.pathname.startsWith('/dashboard/reports'))) ||
              (item.path === '/dashboard/administration' && location.pathname.startsWith('/dashboard/admin'));

            const ItemIcon = item.icon;

            return (
              <div 
                key={item.name}
                onClick={() => navigate(item.path)}
                title={!sidebarOpen ? item.name : undefined}
                style={{
                  display: 'flex', 
                  alignItems: 'center',
                  padding: sidebarOpen ? '0.78rem 1rem' : '0.8rem',
                  borderRadius: '14px', 
                  cursor: 'pointer',
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                  border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                  transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                  gap: '0.85rem', 
                  position: 'relative',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: '3px',
                    width: '4px',
                    height: '20px',
                    borderRadius: '4px',
                    background: 'var(--accent)',
                    boxShadow: '0 0 10px var(--accent)'
                  }} />
                )}
                <ItemIcon size={19} style={{ minWidth: '19px', color: isActive ? '#FFFFFF' : 'inherit' }} />
                {sidebarOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                    <span style={{ 
                      fontWeight: isActive ? '800' : '600', 
                      fontSize: '0.9rem', 
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom User / Role Card & Logout */}
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid var(--sidebar-border)', 
          background: 'var(--sidebar-bg)',
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem' 
        }}>
          {sidebarOpen && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.75rem',
              borderRadius: '12px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)'
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'var(--primary-gradient)',
                color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '0.9rem',
                boxShadow: '0 0 12px rgba(var(--primary-rgb, 21, 84, 232), 0.35)'
              }}>
                {displayName.charAt(0) || 'S'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {displayName}
                </span>
                <select
                  value={role || currentRole.id}
                  onChange={(e) => setRole(e.target.value)}
                  title="Switch Role"
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--accent)',
                    background: 'transparent',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    outline: 'none',
                    padding: 0,
                    width: '100%',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {currentOrg.roles.map(r => (
                    <option key={r.id} value={r.id} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                      {r.title.split('(')[0].trim()} ({r.accessLevel.split(' ')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '0.75rem', 
              padding: '0.65rem 0.9rem', 
              cursor: 'pointer', 
              borderRadius: '12px', 
              color: 'var(--text-muted)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5C5C'; e.currentTarget.style.backgroundColor = 'rgba(255, 92, 92, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={18} style={{ minWidth: '18px' }} />
            {sidebarOpen && <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Secure Sign Out</span>}
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <main className="dashboard-main" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        minWidth: 0
      }}>
        
        {/* Enterprise Topbar */}
        <header style={{ 
          height: '76px', 
          backgroundColor: 'var(--nav-bg)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid var(--nav-border)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 2rem', 
          zIndex: 40,
          flexShrink: 0,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
        }}>
          
          {/* Left: Sidebar Toggle + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={{ 
                background: 'var(--bg-secondary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', 
                cursor: 'pointer', 
                display: 'flex',
                padding: '0.55rem',
                borderRadius: '10px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(var(--primary-rgb, 21, 84, 232), 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Menu size={18} />
            </button>
            
            {/* Breadcrumb path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: '500' }}>
              <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{currentOrg.name.split('&')[0]}</span>
              <ChevronRight size={14} />
              <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{getBreadcrumb()}</span>
            </div>
          </div>

          {/* Right: Global Search, Quick Metrics, Notifications, Theme, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            
            {/* Search Input / Trigger */}
            <div 
              onClick={() => setSearchModalOpen(true)}
              style={{ 
                position: 'relative', 
                width: '280px',
                cursor: 'pointer'
              }}
            >
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                readOnly
                placeholder="Global Search (Ctrl+K)..." 
                style={{ 
                  width: '100%', 
                  padding: '0.55rem 1rem 0.55rem 2.4rem', 
                  height: '38px',
                  borderRadius: '12px', 
                  border: '1px solid var(--input-border)',
                  background: 'var(--input-bg)', 
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem', 
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <span style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'var(--bg-tertiary)',
                fontSize: '0.68rem', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', fontWeight: 700
              }}>
                ⌘K
              </span>
            </div>

            {/* Organization Health Score Meter Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '100px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: currentOrg.healthScore > 90 ? 'var(--accent)' : '#F59E0B',
                boxShadow: `0 0 10px ${currentOrg.healthScore > 90 ? 'var(--accent)' : '#F59E0B'}`
              }} />
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Health Score: <span style={{ color: 'var(--accent)' }}>{currentOrg.healthScore}%</span>
              </div>
            </div>

            {/* Quick Role Switcher Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '10px',
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
            }}>
              <ShieldCheck size={15} color="var(--primary)" />
              <select
                value={role || currentRole.id}
                onChange={(e) => setRole(e.target.value)}
                title="Switch Active Role"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {currentOrg.roles.map(r => (
                  <option key={r.id} value={r.id} style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                    {r.title.split('(')[0].trim()} ({r.accessLevel.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification & Theme Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                onClick={toggleTheme} 
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                style={{ 
                  width: '38px', height: '38px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                  color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button 
                onClick={() => navigate('/dashboard/notifications')}
                style={{ 
                  position: 'relative', width: '38px', height: '38px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
                  color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                <Bell size={18} />
                <span style={{ 
                  position: 'absolute', top: '7px', right: '7px', 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  backgroundColor: '#FF5C5C', border: '2px solid var(--bg-primary)',
                  boxShadow: '0 0 8px rgba(255, 92, 92, 0.8)'
                }} />
              </button>
            </div>
            
            {/* User Profile Pill */}
            <div 
              onClick={() => navigate('/dashboard/profile')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                padding: '0.4rem 0.75rem', borderRadius: '12px',
                background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(var(--primary-rgb, 21, 84, 232), 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {user?.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.name || 'User'} 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '8px', 
                    objectFit: 'cover' 
                  }} 
                />
              ) : (
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '8px', 
                  background: 'var(--primary-gradient)', color: '#FFFFFF', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 'bold', fontSize: '0.9rem',
                  boxShadow: '0 0 10px rgba(var(--primary-rgb, 21, 84, 232), 0.35)'
                }}>
                  {displayName.charAt(0) || 'S'}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {displayName}
                </span>
                <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: '600' }}>
                  {currentRole.accessLevel.split(' ')[0]} {currentRole.accessLevel.split(' ')[1]}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Main Routed Content Area */}
        <div 
          className="custom-scrollbar dashboard-content-scroll" 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '2rem',
            backgroundColor: 'var(--bg-primary)',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(var(--primary-rgb, 21, 84, 232), 0.05) 0%, transparent 70%)'
          }}
        >
          {!isPermitted ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                width: '74px', height: '74px', borderRadius: '22px',
                background: 'rgba(255, 92, 92, 0.12)',
                border: '1px solid rgba(255, 92, 92, 0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FF5C5C', marginBottom: '1.5rem',
                boxShadow: '0 0 30px rgba(255, 92, 92, 0.25)'
              }}>
                <ShieldAlert size={38} />
              </div>
              <div style={{
                fontSize: '0.78rem', fontWeight: 800, color: '#F59E0B',
                letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '0.5rem',
                fontFamily: 'var(--font-mono)'
              }}>
                CLEARANCE RESTRICTED // ACCESS LEVEL {userLevel}
              </div>
              <h2 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#F6FDFF', marginBottom: '0.75rem' }}>
                Role Clearance Required
              </h2>
              <p style={{ color: 'rgba(246, 253, 255, 0.75)', maxWidth: '540px', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Your active role clearance as <strong>{currentRole.title}</strong> is restricted from accessing the <strong>{currentRouteItem?.name}</strong> module. Switch to an Executive or authorized specialist role to review this data.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.4rem' }}
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => {
                    const execRole = currentOrg.roles.find(r => r.permissions.includes('all') || r.permissions.includes(currentRouteItem?.perm || ''));
                    if (execRole) setRole(execRole.id);
                  }}
                  className="btn btn-primary"
                  style={{ padding: '0.65rem 1.4rem' }}
                >
                  Elevate Clearance to Executive
                </button>
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </div>
      </main>

      {/* Global Command / Search Palette Modal (Ctrl+K) */}
      {searchModalOpen && (
        <div 
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh'
          }}
          onClick={() => setSearchModalOpen(false)}
        >
          <div 
            className="glass-card"
            style={{
              width: '100%',
              maxWidth: '640px',
              padding: '1.5rem',
              backgroundColor: 'var(--card-bg)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.5), 0 0 40px rgba(var(--primary-rgb, 21, 84, 232), 0.2)',
              borderRadius: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <Search size={20} color="var(--primary)" />
              <input
                type="text"
                autoFocus
                placeholder="Search models, risks, metrics, incidents, or modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '1.05rem',
                  fontWeight: 500
                }}
              />
              <button 
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.85rem' }}>
              Quick Navigation
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {primaryNavigationModules
                .filter(item => !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                <div
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setSearchModalOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    borderRadius: '12px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--hover-bg)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--accent)';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <item.icon size={19} style={{ color: 'var(--primary)' }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.description}</div>
                    </div>
                  </div>
                  <ArrowUpRight size={16} color="var(--text-muted)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardLayout;
