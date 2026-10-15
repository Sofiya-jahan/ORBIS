import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS, hasPermission } from '../config/platformConfig';
import { AICopilot } from '../components/AICopilot';
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

  // Dynamic Navigation Groups filtered strictly by role permission
  const navigationGroups = [
    {
      groupTitle: 'Foundation',
      requiredPerm: 'dashboard',
      items: [
        { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard, perm: 'dashboard' },
        { name: 'Organization Health', path: '/dashboard/org-overview', icon: Building2, perm: 'dashboard' },
        { name: 'Executive Profile', path: '/dashboard/profile', icon: User, perm: 'dashboard' },
        { name: 'Notification Center', path: '/dashboard/notifications', icon: Bell, perm: 'dashboard' },
      ]
    },
    {
      groupTitle: 'Industry Intelligence',
      requiredPerm: 'industry_modules',
      items: currentOrg.industryModules.map(mod => ({
        name: mod.name,
        path: `/dashboard/industry/${mod.id}`,
        icon: Cpu,
        perm: 'industry_modules'
      }))
    },
    {
      groupTitle: 'Risk Management',
      requiredPerm: 'risk',
      items: [
        { name: 'Risk Register & Inventory', path: '/dashboard/risk/register', icon: ShieldAlert, perm: 'risk' },
        { name: '5x5 Risk Matrix & Scoring', path: '/dashboard/risk/matrix', icon: Grid, perm: 'risk' },
        { name: 'Risk Assessment & Review', path: '/dashboard/risk/assessment', icon: CheckSquare, perm: 'risk' },
        { name: 'Mitigation & Root Cause', path: '/dashboard/risk/mitigation', icon: GitPullRequest, perm: 'risk' },
      ]
    },
    {
      groupTitle: 'Incident Management',
      requiredPerm: 'incidents',
      items: [
        { name: 'Incident Register & Log', path: '/dashboard/incidents', icon: AlertOctagon, perm: 'incidents' },
        { name: 'Incident Investigation', path: '/dashboard/incidents/investigation', icon: FileText, perm: 'incidents' },
        { name: 'Near Miss & Grievances', path: '/dashboard/incidents/near-miss', icon: HelpCircle, perm: 'incidents' },
        { name: 'Safety & Cyber Incidents', path: '/dashboard/incidents/safety', icon: ShieldCheck, perm: 'incidents' },
      ]
    },
    {
      groupTitle: 'Predictive AI',
      requiredPerm: 'predictive',
      items: [
        { name: 'AI Risk Forecasting', path: '/dashboard/predictive/forecasting', icon: TrendingUp, perm: 'predictive' },
        { name: 'Anomaly Detection Matrix', path: '/dashboard/predictive/anomaly', icon: Cpu, perm: 'predictive' },
        { name: 'Autonomous Recommendations', path: '/dashboard/predictive/recommendations', icon: Sparkles, perm: 'predictive' },
      ]
    },
    {
      groupTitle: 'Analytics & Heatmaps',
      requiredPerm: 'analytics',
      items: [
        { name: 'Enterprise Analytics', path: '/dashboard/analytics', icon: BarChart2, perm: 'analytics' },
        { name: 'Department Comparison', path: '/dashboard/analytics/comparison', icon: Layers, perm: 'analytics' },
      ]
    },
    {
      groupTitle: 'Explainable AI (XAI)',
      requiredPerm: 'xai',
      items: [
        { name: 'SHAP Feature Drivers', path: '/dashboard/xai/shap', icon: Cpu, perm: 'xai' },
        { name: 'Decision Explanations', path: '/dashboard/xai/decisions', icon: CheckCircle, perm: 'xai' },
      ]
    },
    {
      groupTitle: 'Workflow & Tasks',
      requiredPerm: 'workflow',
      items: [
        { name: 'Task Queue & Approvals', path: '/dashboard/workflow/tasks', icon: Clock, perm: 'workflow' },
        { name: 'Activity Timeline & Audit', path: '/dashboard/workflow/timeline', icon: GitPullRequest, perm: 'workflow' },
      ]
    },
    {
      groupTitle: 'Reports & Export',
      requiredPerm: 'reports',
      items: [
        { name: 'Executive & Risk Reports', path: '/dashboard/reports', icon: FileText, perm: 'reports' },
        { name: 'Document Export Engine', path: '/dashboard/reports/export', icon: FileSpreadsheet, perm: 'reports' },
      ]
    },
    {
      groupTitle: 'Compliance & Audit',
      requiredPerm: 'compliance',
      items: [
        { name: 'Regulatory Policies & Controls', path: '/dashboard/compliance/policies', icon: Scale, perm: 'compliance' },
        { name: 'Compliance Audit Logs', path: '/dashboard/compliance/audit', icon: ShieldCheck, perm: 'compliance' },
      ]
    },
    {
      groupTitle: 'Administration & Security',
      requiredPerm: 'admin',
      items: [
        { name: 'User Management & Roles', path: '/dashboard/admin/users', icon: Users, perm: 'admin' },
        { name: 'System Settings & Keys', path: '/dashboard/admin/settings', icon: Settings, perm: 'admin' },
      ]
    }
  ];

  // Filter groups: completely hide unpermitted sections
  const permittedGroups = navigationGroups.filter(group => {
    return hasPermission(userPermissions, group.requiredPerm, userLevel);
  }).map(group => ({
    ...group,
    items: group.items.filter(item => hasPermission(userPermissions, item.perm, userLevel))
  })).filter(group => group.items.length > 0);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Enterprise Overview';
    const parts = path.split('/').filter(Boolean);
    return parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1).replace(/-/g, ' ')).join(' / ');
  };

  // Check if current route requires an authorization permission
  const currentRouteItem = navigationGroups
    .flatMap(g => g.items)
    .find(item => location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path)));

  const isPermitted = !currentRouteItem || hasPermission(userPermissions, currentRouteItem.perm, userLevel);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: '#07112E',
      backgroundImage: 'radial-gradient(circle at 15% 10%, rgba(21, 84, 232, 0.12) 0%, transparent 45%), radial-gradient(circle at 85% 90%, rgba(122, 72, 255, 0.1) 0%, transparent 45%)',
      color: '#F6FDFF',
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
        backgroundColor: 'rgba(7, 17, 46, 0.85)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(46, 155, 248, 0.16)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.35)',
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
          borderBottom: '1px solid rgba(46, 155, 248, 0.14)',
          background: 'rgba(13, 35, 77, 0.3)'
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: 'rgba(13, 35, 77, 0.8)',
                border: '1px solid rgba(46, 155, 248, 0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: '0 0 20px rgba(21, 84, 232, 0.35)'
              }}>
                <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.5px', fontFamily: 'var(--font-heading)', color: '#F6FDFF' }}>
                  ORBIS <span style={{ background: 'linear-gradient(135deg, #6AE7F7 0%, #2E9BF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '0.8rem', fontWeight: '800' }}>ENTERPRISE</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(246, 253, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>
                  {currentOrg.sector.split('&')[0]}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: 'rgba(13, 35, 77, 0.8)',
              border: '1px solid rgba(46, 155, 248, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(21, 84, 232, 0.25)'
            }}>
              <img src="/orbis-logo.png" alt="ORBIS Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        {/* Dynamic Tenant Info Strip (when expanded) */}
        {sidebarOpen && (
          <div style={{
            padding: '0.75rem 1.25rem',
            background: 'rgba(13, 35, 77, 0.45)',
            borderBottom: '1px solid rgba(46, 155, 248, 0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.68rem', color: 'rgba(246, 253, 255, 0.55)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                Active Tenant
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#F6FDFF' }}>
                {currentOrg.name.split('&')[0]}
              </span>
            </div>
            <button
              onClick={() => navigate('/organization')}
              title="Switch Organization"
              style={{
                background: 'rgba(21, 84, 232, 0.15)',
                border: '1px solid rgba(46, 155, 248, 0.3)',
                borderRadius: '8px',
                padding: '0.25rem 0.55rem',
                color: '#6AE7F7',
                cursor: 'pointer', fontSize: '0.72rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(21, 84, 232, 0.3)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(106, 231, 247, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(21, 84, 232, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Switch <ExternalLink size={11} />
            </button>
          </div>
        )}

        {/* Navigation Group Items */}
        <nav className="custom-scrollbar" style={{ flex: 1, padding: '1rem 0.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {permittedGroups.map((group) => {
            return (
              <div key={group.groupTitle}>
                {sidebarOpen && (
                  <div style={{ 
                    padding: '0.35rem 0.85rem 0.5rem 0.85rem', 
                    fontSize: '0.68rem', 
                    fontWeight: '800', 
                    color: 'var(--text-muted)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '1px' 
                  }}>
                    {group.groupTitle}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    const ItemIcon = item.icon;

                    return (
                      <div 
                        key={item.name}
                        onClick={() => navigate(item.path)}
                        title={!sidebarOpen ? item.name : undefined}
                        style={{
                          display: 'flex', 
                          alignItems: 'center',
                          padding: sidebarOpen ? '0.68rem 0.95rem' : '0.75rem',
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          color: isActive ? '#F6FDFF' : 'rgba(246, 253, 255, 0.75)',
                          background: isActive ? 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)' : 'transparent',
                          boxShadow: isActive ? '0 4px 18px rgba(21, 84, 232, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.25)' : 'none',
                          border: isActive ? '1px solid rgba(106, 231, 247, 0.35)' : '1px solid transparent',
                          transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                          gap: '0.85rem', 
                          position: 'relative',
                          justifyContent: sidebarOpen ? 'flex-start' : 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'rgba(13, 35, 77, 0.7)';
                            e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.3)';
                            e.currentTarget.style.color = '#6AE7F7';
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.color = 'rgba(246, 253, 255, 0.75)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }
                        }}
                      >
                        {isActive && (
                          <div style={{
                            position: 'absolute',
                            left: '3px',
                            width: '4px',
                            height: '18px',
                            borderRadius: '4px',
                            background: '#6AE7F7',
                            boxShadow: '0 0 10px #6AE7F7'
                          }} />
                        )}
                        <ItemIcon size={18} style={{ minWidth: '18px', color: isActive ? '#F6FDFF' : 'inherit' }} />
                        {sidebarOpen && (
                          <span style={{ 
                            fontWeight: isActive ? '700' : '500', 
                            fontSize: '0.85rem', 
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.name}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom User / Role Card & Logout */}
        <div style={{ 
          padding: '1rem', 
          borderTop: '1px solid rgba(46, 155, 248, 0.14)', 
          background: 'rgba(7, 17, 46, 0.95)',
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
              background: 'rgba(13, 35, 77, 0.65)',
              border: '1px solid rgba(46, 155, 248, 0.2)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: 'linear-gradient(135deg, #1554E8 0%, #4148F1 100%)',
                color: '#F6FDFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '0.9rem',
                boxShadow: '0 0 12px rgba(21, 84, 232, 0.4)'
              }}>
                {user?.name?.charAt(0) || 'E'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#F6FDFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Authorized Executive'}
                </span>
                <select
                  value={role || currentRole.id}
                  onChange={(e) => setRole(e.target.value)}
                  title="Switch Role"
                  style={{
                    fontSize: '0.72rem',
                    color: '#6AE7F7',
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
                    <option key={r.id} value={r.id} style={{ background: '#07112E', color: '#F6FDFF' }}>
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
              color: 'rgba(246, 253, 255, 0.55)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5C5C'; e.currentTarget.style.backgroundColor = 'rgba(255, 92, 92, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(246, 253, 255, 0.55)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <LogOut size={18} style={{ minWidth: '18px' }} />
            {sidebarOpen && <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>Secure Sign Out</span>}
          </div>
        </div>
      </aside>

      {/* Main App Content Area */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden',
        minWidth: 0
      }}>
        
        {/* Enterprise Topbar */}
        <header style={{ 
          height: '76px', 
          backgroundColor: 'rgba(7, 17, 46, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(46, 155, 248, 0.16)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 2rem', 
          zIndex: 40,
          flexShrink: 0,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)'
        }}>
          
          {/* Left: Sidebar Toggle + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={{ 
                background: 'rgba(13, 35, 77, 0.6)', 
                border: '1px solid rgba(46, 155, 248, 0.25)', 
                color: '#F6FDFF', 
                cursor: 'pointer', 
                display: 'flex',
                padding: '0.55rem',
                borderRadius: '10px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2E9BF8';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(46, 155, 248, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Menu size={18} />
            </button>
            
            {/* Breadcrumb path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(246, 253, 255, 0.55)', fontSize: '0.88rem', fontWeight: '500' }}>
              <span style={{ color: '#2E9BF8', fontWeight: '700' }}>{currentOrg.name.split('&')[0]}</span>
              <ChevronRight size={14} />
              <span style={{ color: '#F6FDFF', fontWeight: '600' }}>{getBreadcrumb()}</span>
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
              <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(246, 253, 255, 0.55)' }} />
              <input 
                type="text" 
                readOnly
                placeholder="Global Search (Ctrl+K)..." 
                style={{ 
                  width: '100%', 
                  padding: '0.55rem 1rem 0.55rem 2.4rem', 
                  height: '38px',
                  borderRadius: '12px', 
                  border: '1px solid rgba(46, 155, 248, 0.22)',
                  background: 'rgba(13, 35, 77, 0.65)', 
                  color: '#F6FDFF',
                  fontSize: '0.82rem', 
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              <span style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(7, 17, 46, 0.9)',
                fontSize: '0.68rem', color: 'rgba(246, 253, 255, 0.65)', border: '1px solid rgba(46, 155, 248, 0.25)', fontWeight: 700
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
              background: 'rgba(13, 35, 77, 0.65)',
              border: '1px solid rgba(46, 155, 248, 0.25)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: currentOrg.healthScore > 90 ? '#6AE7F7' : '#F59E0B',
                boxShadow: `0 0 10px ${currentOrg.healthScore > 90 ? '#6AE7F7' : '#F59E0B'}`
              }} />
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#F6FDFF' }}>
                Health Score: <span style={{ color: '#6AE7F7' }}>{currentOrg.healthScore}%</span>
              </div>
            </div>

            {/* Quick Role Switcher Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '10px',
              background: 'rgba(13, 35, 77, 0.65)',
              border: '1px solid rgba(46, 155, 248, 0.25)',
            }}>
              <ShieldCheck size={15} color="#2E9BF8" />
              <select
                value={role || currentRole.id}
                onChange={(e) => setRole(e.target.value)}
                title="Switch Active Role"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#F6FDFF',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {currentOrg.roles.map(r => (
                  <option key={r.id} value={r.id} style={{ background: '#07112E', color: '#F6FDFF' }}>
                    {r.title.split('(')[0].trim()} ({r.accessLevel.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification & Theme Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                onClick={toggleTheme} 
                style={{ 
                  width: '38px', height: '38px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: 'rgba(13, 35, 77, 0.65)', border: '1px solid rgba(46, 155, 248, 0.25)', 
                  color: 'rgba(246, 253, 255, 0.75)', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              <button 
                onClick={() => navigate('/dashboard/notifications')}
                style={{ 
                  position: 'relative', width: '38px', height: '38px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: 'rgba(13, 35, 77, 0.65)', border: '1px solid rgba(46, 155, 248, 0.25)', 
                  color: 'rgba(246, 253, 255, 0.75)', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                <Bell size={18} />
                <span style={{ 
                  position: 'absolute', top: '7px', right: '7px', 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  backgroundColor: '#FF5C5C', border: '2px solid #07112E',
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
                background: 'rgba(13, 35, 77, 0.65)', border: '1px solid rgba(46, 155, 248, 0.25)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2E9BF8';
                e.currentTarget.style.boxShadow = '0 0 14px rgba(46, 155, 248, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.25)';
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
                  background: 'linear-gradient(135deg, #1554E8 0%, #4148F1 100%)', color: '#F6FDFF', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  fontWeight: 'bold', fontSize: '0.9rem',
                  boxShadow: '0 0 10px rgba(21, 84, 232, 0.4)'
                }}>
                  {user?.name?.charAt(0) || 'E'}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '700', fontSize: '0.82rem', color: '#F6FDFF' }}>
                  {user?.name || 'Executive User'}
                </span>
                <span style={{ color: '#6AE7F7', fontSize: '0.7rem', fontWeight: '600' }}>
                  {currentRole.accessLevel.split(' ')[0]} {currentRole.accessLevel.split(' ')[1]}
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Main Routed Content Area */}
        <div 
          className="custom-scrollbar" 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '2rem',
            backgroundColor: '#07112E',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(13, 35, 77, 0.6) 0%, transparent 70%)'
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
            background: 'rgba(7, 17, 46, 0.75)',
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
              backgroundColor: 'rgba(7, 17, 46, 0.92)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: '1px solid rgba(46, 155, 248, 0.3)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.8), 0 0 40px rgba(21, 84, 232, 0.25)',
              borderRadius: '20px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(46, 155, 248, 0.18)', paddingBottom: '0.85rem' }}>
              <Search size={20} color="#2E9BF8" />
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
                  color: '#F6FDFF',
                  fontSize: '1.05rem',
                  fontWeight: 500
                }}
              />
              <button 
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'rgba(246, 253, 255, 0.55)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6AE7F7', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.85rem' }}>
              Quick Navigation
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {permittedGroups.flatMap(g => g.items).slice(0, 6).map((item) => (
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
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    background: 'rgba(13, 35, 77, 0.6)',
                    border: '1px solid rgba(46, 155, 248, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    color: '#F6FDFF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(21, 84, 232, 0.25)';
                    e.currentTarget.style.borderColor = 'rgba(106, 231, 247, 0.4)';
                    e.currentTarget.style.color = '#6AE7F7';
                    e.currentTarget.style.transform = 'translateX(3px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(13, 35, 77, 0.6)';
                    e.currentTarget.style.borderColor = 'rgba(46, 155, 248, 0.15)';
                    e.currentTarget.style.color = '#F6FDFF';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <item.icon size={18} style={{ color: '#2E9BF8' }} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</span>
                  </div>
                  <ArrowUpRight size={16} color="rgba(246, 253, 255, 0.55)" />
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
