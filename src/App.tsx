import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

// Lazy loading pages
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
const Analytics = React.lazy(() => import('./pages/Analytics'));
const RiskPrediction = React.lazy(() => import('./pages/RiskPrediction'));

const FullScreenLoader = () => (
  <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#071423' }}>
    <Loader2 size={48} className="animate-spin text-gradient" color="#00C6FF" />
    <style>{`
      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin { animation: spin 1s linear infinite; }
    `}</style>
  </div>
);

// Strictly Protected Routes
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAuthLoaded } = useAuthStore();
  const location = useLocation();

  if (!isAuthLoaded) {
    return <FullScreenLoader />;
  }

  // Unauthenticated users attempting to access these pages should be redirected to /landing
  if (!isAuthenticated) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Application Entry & Setup Logic
const App = () => {
  const { theme, organization, initAuthListener } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    initAuthListener();
  }, [initAuthListener]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (organization) {
      document.documentElement.setAttribute('data-org', organization.toLowerCase());
    } else {
      document.documentElement.removeAttribute('data-org');
    }
  }, [theme, organization]);

  // Wrapper for Intro to handle the "onComplete" transition
  const IntroWrapper = () => {
    return <CinematicIntro onComplete={() => navigate('/landing')} />;
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <React.Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* Public Routes (No redirects for authenticated users here!) */}
          <Route path="/" element={<IntroWrapper />} />
          <Route path="/intro" element={<IntroWrapper />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Authentication Animation */}
          <Route path="/authentication" element={<AuthVerification />} />

          {/* Setup Flow (Protected) */}
          <Route path="/organization" element={<RequireAuth><OrgSelect /></RequireAuth>} />
          <Route path="/role-selection" element={<RequireAuth><RoleSelect /></RequireAuth>} />
          <Route path="/security-key" element={<RequireAuth><Verification /></RequireAuth>} />

          {/* Dashboard Flow (Protected) */}
          <Route path="/dashboard" element={<RequireAuth><DashboardLayout /></RequireAuth>}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="risk-prediction" element={<RiskPrediction />} />
            {/* Fallbacks */}
            <Route path="reports" element={<div style={{padding: '2rem', color: 'white'}}>Reports Component</div>} />
            <Route path="alerts" element={<div style={{padding: '2rem', color: 'white'}}>Alerts Component</div>} />
            <Route path="patients" element={<div style={{padding: '2rem', color: 'white'}}>Patients UI</div>} />
            <Route path="fraud-risk" element={<div style={{padding: '2rem', color: 'white'}}>Fraud UI</div>} />
          </Route>
          
          {/* Settings & Admin (Protected Fallbacks based on user request) */}
          <Route path="/settings" element={<RequireAuth><div style={{padding: '2rem', color: 'white'}}>Settings Component</div></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth><div style={{padding: '2rem', color: 'white'}}>Admin Component</div></RequireAuth>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </React.Suspense>
    </div>
  );
};

export default App;
