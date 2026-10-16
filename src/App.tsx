import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';
import { verifySecuritySession, logSecurityEvent } from './services/securityService';

// Lazy loading pages & modules
const CinematicIntro = React.lazy(() => import('./components/CinematicIntro').then(m => ({ default: m.CinematicIntro })));
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const AuthVerification = React.lazy(() => import('./pages/AuthVerification'));
const OrgSelect = React.lazy(() => import('./pages/OrgSelect'));
const RoleSelect = React.lazy(() => import('./pages/RoleSelect'));
const Verification = React.lazy(() => import('./pages/Verification'));
const DashboardLayout = React.lazy(() => import('./layouts/DashboardLayout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));

// The 7 Primary Enterprise Modules
const RiskCenter = React.lazy(() => import('./pages/modules/RiskCenter'));
const AIIntelligence = React.lazy(() => import('./pages/modules/AIIntelligence'));
const OrganizationWorkspace = React.lazy(() => import('./pages/modules/OrganizationWorkspace'));
const AnalyticsWorkspace = React.lazy(() => import('./pages/modules/AnalyticsWorkspace'));
const GovernanceWorkspace = React.lazy(() => import('./pages/modules/GovernanceWorkspace'));
const AdministrationWorkspace = React.lazy(() => import('./pages/modules/AdministrationWorkspace'));
const NotificationsPage = React.lazy(() => import('./pages/modules/NotificationsPage'));

const FullScreenLoader = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column',
    height: '100vh', 
    alignItems: 'center', 
    justifyContent: 'center', 
    background: 'radial-gradient(ellipse at 50% -20%, #0D234D 0%, #07112E 75%)',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Ambient glowing radial lights */}
    <div style={{
      position: 'absolute',
      width: '320px',
      height: '320px',
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(21, 84, 232, 0.25) 0%, transparent 70%)',
      filter: 'blur(40px)',
      pointerEvents: 'none'
    }} />

    <div style={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2.5rem 3rem',
      borderRadius: '24px',
      background: 'linear-gradient(180deg, rgba(13, 35, 77, 0.7) 0%, rgba(7, 17, 46, 0.85) 100%)',
      border: '1px solid rgba(46, 155, 248, 0.25)',
      backdropFilter: 'blur(24px)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(21, 84, 232, 0.3)'
    }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 0 35px rgba(46, 155, 248, 0.55)',
        border: '1px solid rgba(106, 231, 247, 0.35)',
        marginBottom: '1.25rem',
        animation: 'floatGentle 4s ease-in-out infinite'
      }}>
        <img src="/orbis-logo.png" alt="ORBIS" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem',
        color: '#6AE7F7',
        fontSize: '0.82rem',
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
      }}>
        <Loader2 size={16} className="animate-spin" color="#6AE7F7" />
        <span>INITIALIZING ORBIS CORE...</span>
      </div>
    </div>

    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin { animation: spin 1s linear infinite; }
      @keyframes floatGentle {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
        100% { transform: translateY(0px); }
      }
    `}</style>
  </div>
);

// Strictly Protected Routes for Master Dashboard
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthLoaded, user, organization } = useAuthStore();
  const location = useLocation();

  if (!isAuthLoaded) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  // Institutional Security Key & Session Integrity Check
  const sessionCheck = verifySecuritySession();
  if (!sessionCheck.valid) {
    logSecurityEvent(
      'UNAUTHORIZED_ACCESS_BLOCKED',
      'WARNING',
      `Access to protected route ${location.pathname} blocked: ${sessionCheck.reason || 'Missing institutional cryptographic key'}`,
      user?.email || 'operator@orbis.ai'
    );
    return <Navigate to="/security-key" state={{ from: location }} replace />;
  }

  // Tenant Boundary Check: verify active session matches currently selected organization
  if (sessionCheck.session && organization && sessionCheck.session.organization.toLowerCase() !== organization.toLowerCase()) {
    logSecurityEvent(
      'UNAUTHORIZED_ACCESS_BLOCKED',
      'CRITICAL',
      `Cross-tenant access breach blocked! Session org '${sessionCheck.session.organization}' does not match requested tenant '${organization}'. Re-verification required.`,
      user?.email || 'operator@orbis.ai'
    );
    return <Navigate to="/security-key" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Application Entry & Setup Logic
export const App = () => {
  const { theme, organization, initAuthListener } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  useEffect(() => {
    // Public showcase and authentication portals maintain the signature sovereign dark command aesthetic
    const isPublicAuthPage = location.pathname === '/' || 
                             location.pathname === '/intro' || 
                             location.pathname === '/landing' || 
                             location.pathname === '/login' || 
                             location.pathname === '/register' || 
                             location.pathname === '/auth-verification' ||
                             location.pathname === '/security-key' ||
                             location.pathname === '/verification';

    const activeTheme = isPublicAuthPage ? 'dark' : theme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    // Enterprise color palette is active across the entire application
    const isDashboard = location.pathname.startsWith('/dashboard');
    if (isDashboard) {
      const activeOrg = (organization || 'hospital').toLowerCase();
      document.documentElement.setAttribute('data-org', activeOrg);
    } else {
      document.documentElement.removeAttribute('data-org');
    }
  }, [theme, organization, location.pathname]);

  // Wrapper for Intro to handle the "onComplete" transition
  const IntroWrapper = () => {
    return <CinematicIntro onComplete={() => navigate('/landing')} />;
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <React.Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* Public Flow: Intro -> Landing -> Organization -> Role -> Login */}
          <Route path="/" element={<IntroWrapper />} />
          <Route path="/intro" element={<IntroWrapper />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/organization" element={<OrgSelect />} />
          <Route path="/role-selection" element={<RoleSelect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />
          
          {/* Authentication Animation & Security Key Step */}
          <Route path="/authentication" element={<AuthVerification />} />
          <Route path="/security-key" element={<Verification />} />

          {/* Master Enterprise Dashboard Flow (Strictly Protected) */}
          <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            {/* 1. Executive Dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* 2. Risk Center (Unified Workspace) */}
            <Route path="risk-center" element={<RiskCenter />} />

            {/* 3. AI Intelligence (Unified Flagship AI Workspace) */}
            <Route path="ai-intelligence" element={<AIIntelligence />} />

            {/* 4. Organization (Dynamic Tenant Workspace) */}
            <Route path="organization" element={<OrganizationWorkspace />} />

            {/* 5. Analytics (Unified Insights Workspace) */}
            <Route path="analytics" element={<AnalyticsWorkspace />} />

            {/* 6. Governance (Centralized GRC Workspace) */}
            <Route path="governance" element={<GovernanceWorkspace />} />

            {/* 7. Administration (Platform Configuration Workspace) */}
            <Route path="administration" element={<AdministrationWorkspace />} />

            {/* Utility & Direct Profile routes */}
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<NotificationsPage />} />

            {/* Backward-compatible redirect aliases for existing bookmarks & deep links */}
            <Route path="risk/register" element={<Navigate to="/dashboard/risk-center?tab=register" replace />} />
            <Route path="risk/matrix" element={<Navigate to="/dashboard/risk-center?tab=matrix" replace />} />
            <Route path="risk/assessment" element={<Navigate to="/dashboard/risk-center?tab=assessment" replace />} />
            <Route path="risk/mitigation" element={<Navigate to="/dashboard/risk-center?tab=mitigation" replace />} />
            <Route path="risk/*" element={<Navigate to="/dashboard/risk-center" replace />} />

            <Route path="incidents/*" element={<Navigate to="/dashboard/risk-center?tab=timeline" replace />} />
            <Route path="incidents" element={<Navigate to="/dashboard/risk-center?tab=timeline" replace />} />

            <Route path="predictive/*" element={<Navigate to="/dashboard/ai-intelligence?tab=predictions" replace />} />
            <Route path="risk-prediction" element={<Navigate to="/dashboard/ai-intelligence?tab=predictions" replace />} />
            <Route path="xai/*" element={<Navigate to="/dashboard/ai-intelligence?tab=explainability" replace />} />

            <Route path="org-overview" element={<Navigate to="/dashboard/organization?tab=overview" replace />} />
            <Route path="industry/:moduleId" element={<Navigate to="/dashboard/organization?tab=industry" replace />} />

            <Route path="analytics/comparison" element={<Navigate to="/dashboard/analytics?tab=heatmaps" replace />} />

            <Route path="workflow/*" element={<Navigate to="/dashboard/governance?tab=approvals" replace />} />
            <Route path="reports/*" element={<Navigate to="/dashboard/governance?tab=reports" replace />} />
            <Route path="reports" element={<Navigate to="/dashboard/governance?tab=reports" replace />} />
            <Route path="compliance/*" element={<Navigate to="/dashboard/governance?tab=compliance" replace />} />

            <Route path="admin/*" element={<Navigate to="/dashboard/administration?tab=users" replace />} />

            {/* Fallbacks */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </div>
  );
};

export default App;
