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

// Master Module Components
const RiskRegister = React.lazy(() => import('./pages/modules/RiskRegister'));
const RiskMatrix = React.lazy(() => import('./pages/modules/RiskMatrix'));
const IncidentManagement = React.lazy(() => import('./pages/modules/IncidentManagement'));
const PredictiveAI = React.lazy(() => import('./pages/modules/PredictiveAI'));
const ExplainableAI = React.lazy(() => import('./pages/modules/ExplainableAI'));
const IndustryModule = React.lazy(() => import('./pages/modules/IndustryModule'));
const EnterpriseAnalytics = React.lazy(() => import('./pages/modules/EnterpriseAnalytics'));
const WorkflowTasks = React.lazy(() => import('./pages/modules/WorkflowTasks'));
const ComplianceAudit = React.lazy(() => import('./pages/modules/ComplianceAudit'));
const EnterpriseReports = React.lazy(() => import('./pages/modules/EnterpriseReports'));
const AdminSecurity = React.lazy(() => import('./pages/modules/AdminSecurity'));
const OrgOverview = React.lazy(() => import('./pages/modules/OrgOverview'));
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
    document.documentElement.setAttribute('data-theme', theme);
    
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
          
          {/* Authentication Animation & Security Key Step */}
          <Route path="/authentication" element={<AuthVerification />} />
          <Route path="/security-key" element={<Verification />} />

          {/* Master Enterprise Dashboard Flow (Strictly Protected) */}
          <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            
            {/* Foundation */}
            <Route path="org-overview" element={<OrgOverview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<NotificationsPage />} />

            {/* Dynamic Industry Modules */}
            <Route path="industry/:moduleId" element={<IndustryModule />} />
            
            {/* Risk Management */}
            <Route path="risk/register" element={<RiskRegister />} />
            <Route path="risk/matrix" element={<RiskMatrix />} />
            <Route path="risk/assessment" element={<RiskRegister />} />
            <Route path="risk/mitigation" element={<RiskRegister />} />

            {/* Incident Management */}
            <Route path="incidents" element={<IncidentManagement />} />
            <Route path="incidents/investigation" element={<IncidentManagement />} />
            <Route path="incidents/near-miss" element={<IncidentManagement />} />
            <Route path="incidents/safety" element={<IncidentManagement />} />

            {/* Predictive AI */}
            <Route path="predictive/forecasting" element={<PredictiveAI />} />
            <Route path="predictive/anomaly" element={<PredictiveAI />} />
            <Route path="predictive/recommendations" element={<PredictiveAI />} />
            <Route path="risk-prediction" element={<PredictiveAI />} />

            {/* Analytics & Heatmaps */}
            <Route path="analytics" element={<EnterpriseAnalytics />} />
            <Route path="analytics/comparison" element={<EnterpriseAnalytics />} />

            {/* Explainable AI */}
            <Route path="xai/shap" element={<ExplainableAI />} />
            <Route path="xai/decisions" element={<ExplainableAI />} />

            {/* Workflow & Tasks */}
            <Route path="workflow/tasks" element={<WorkflowTasks />} />
            <Route path="workflow/timeline" element={<WorkflowTasks />} />

            {/* Reports & Exports */}
            <Route path="reports" element={<EnterpriseReports />} />
            <Route path="reports/export" element={<EnterpriseReports />} />

            {/* Compliance & Audit */}
            <Route path="compliance/policies" element={<ComplianceAudit />} />
            <Route path="compliance/audit" element={<ComplianceAudit />} />

            {/* Admin & Security */}
            <Route path="admin/users" element={<AdminSecurity />} />
            <Route path="admin/settings" element={<AdminSecurity />} />

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
