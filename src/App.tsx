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
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#071424' }}>
    <Loader2 size={48} className="animate-spin text-gradient" color="#00C8FF" />
    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin { animation: spin 1s linear infinite; }
    `}</style>
  </div>
);

// Strictly Protected Routes for Master Dashboard
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthLoaded, user } = useAuthStore();
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
      user?.email || 'operator@iprap.ai'
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
    
    // Company color palette is active inside the authenticated platform (/dashboard)
    // Up to that endpoint (the entire onboarding & login session), the sovereign Emerald palette is preserved
    const isDashboard = location.pathname.startsWith('/dashboard');

    if (isDashboard) {
      const activeOrg = (organization || 'hospital').toLowerCase();
      document.documentElement.setAttribute('data-org', activeOrg);
      document.documentElement.removeAttribute('data-funnel');
    } else {
      document.documentElement.removeAttribute('data-org');
      document.documentElement.setAttribute('data-funnel', 'emerald');
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
