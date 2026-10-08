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

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      backgroundColor: 'var(--bg-primary)', 
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
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
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
          borderBottom: '1px solid var(--border-color)' 
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: `${currentOrg.themeColor}20`,
                border: `1px solid ${currentOrg.themeColor}50`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: currentOrg.themeColor,
                boxShadow: `0 0 15px ${currentOrg.themeColor}30`
              }}>
                <OrgIcon size={22} />
              </div>
              <div>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', letterSpacing: '-0.5px', fontFamily: 'var(--font-heading)' }}>
                  IPRAP <span style={{ color: currentOrg.themeColor, fontSize: '0.8rem', fontWeight: '700' }}>AI</span>
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                  {currentOrg.sector.split('&')[0]}
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: `${currentOrg.themeColor}20`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: currentOrg.themeColor
            }}>
              <OrgIcon size={22} />
            </div>
          )}
        </div>

        {/* Dynamic Tenant Info Strip (when expanded) */}
        {sidebarOpen && (
          <div style={{
            padding: '0.75rem 1.25rem',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Tenant
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#FFFFFF' }}>
                {currentOrg.name.split('&')[0]}
              </span>
            </div>
            <button
              onClick={() => navigate('/organization')}
              title="Switch Organization"
              style={{
                background: 'none', border: 'none', color: currentOrg.themeColor,
                cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.2rem'
              }}
            >
              Switch <ExternalLink size={12} />
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
                          padding: sidebarOpen ? '0.65rem 0.9rem' : '0.75rem',
                          borderRadius: '12px', 
                          cursor: 'pointer',
                          color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                          background: isActive ? currentOrg.themeColor : 'transparent',
                          boxShadow: isActive ? `0 4px 15px ${currentOrg.themeColor}50` : 'none',
                          transition: 'all 0.2s ease',
                          gap: '0.85rem', 
                          position: 'relative',
                          justifyContent: sidebarOpen ? 'flex-start' : 'center'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                            e.currentTarget.style.color = currentOrg.themeColor;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                          }
                        }}
                      >
                        <ItemIcon size={18} style={{ minWidth: '18px', color: isActive ? '#FFFFFF' : 'inherit' }} />
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
          borderTop: '1px solid var(--border-color)', 
          background: 'var(--bg-secondary)',
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
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: currentOrg.themeColor,
                color: '#FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '800', fontSize: '0.9rem'
              }}>
                {user?.name?.charAt(0) || 'E'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Authorized Executive'}
                </span>
                <span style={{ fontSize: '0.7rem', color: currentOrg.themeColor, fontWeight: '600' }}>
                  {currentRole.title.split('/')[0]}
                </span>
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
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--danger)'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
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
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0 2rem', 
          zIndex: 40,
          flexShrink: 0
        }}>
          
          {/* Left: Sidebar Toggle + Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={{ 
                background: 'var(--bg-tertiary)', 
                border: '1px solid var(--border-color)', 
                color: 'var(--text-primary)', 
                cursor: 'pointer', 
                display: 'flex',
                padding: '0.5rem',
                borderRadius: '10px'
              }}
            >
              <Menu size={20} />
            </button>
            
            {/* Breadcrumb path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.88rem', fontWeight: '500' }}>
              <span style={{ color: currentOrg.themeColor, fontWeight: '700' }}>{currentOrg.name.split('&')[0]}</span>
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
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-tertiary)', 
                  color: 'var(--text-primary)',
                  fontSize: '0.82rem', 
                  cursor: 'pointer',
                  outline: 'none'
                }}
              />
              <span style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'var(--bg-primary)',
                fontSize: '0.68rem', color: 'var(--text-muted)', border: '1px solid var(--border-color)', fontWeight: 700
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
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                backgroundColor: currentOrg.healthScore > 90 ? '#10B981' : '#F59E0B',
                boxShadow: `0 0 8px ${currentOrg.healthScore > 90 ? '#10B981' : '#F59E0B'}`
              }} />
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                Health Score: <span style={{ color: '#10B981' }}>{currentOrg.healthScore}%</span>
              </div>
            </div>

            {/* Notification & Theme Icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <button 
                onClick={toggleTheme} 
                style={{ 
                  width: '38px', height: '38px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
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
                  background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', 
                  color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' 
                }}
              >
                <Bell size={18} />
                <span style={{ 
                  position: 'absolute', top: '7px', right: '7px', 
                  width: '8px', height: '8px', borderRadius: '50%', 
                  backgroundColor: 'var(--danger)', border: '2px solid var(--bg-secondary)' 
                }} />
              </button>
            </div>
            
            {/* User Profile Pill */}
            <div 
              onClick={() => navigate('/dashboard/profile')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                padding: '0.4rem 0.75rem', borderRadius: '12px',
                background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
                cursor: 'pointer' 
              }}
            >
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '8px', 
                background: currentOrg.themeColor, color: '#FFFFFF', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontWeight: 'bold', fontSize: '0.9rem' 
              }}>
                {user?.name?.charAt(0) || 'E'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
                  {user?.name || 'Executive User'}
                </span>
                <span style={{ color: currentOrg.themeColor, fontSize: '0.7rem', fontWeight: '600' }}>
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
            backgroundColor: 'var(--bg-primary)'
          }}
        >
          <Outlet />
        </div>
      </main>

      {/* Global Command / Search Palette Modal (Ctrl+K) */}
      {searchModalOpen && (
        <div 
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(10px)',
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
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: '0 30px 90px rgba(0,0,0,0.8)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
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
                  fontSize: '1.1rem'
                }}
              />
              <button 
                onClick={() => setSearchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Quick Navigation
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                    borderRadius: '10px',
                    background: 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--primary-light)';
                    e.currentTarget.style.color = currentOrg.themeColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-tertiary)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <item.icon size={18} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item.name}</span>
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
