import React, { Suspense } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2 } from 'lucide-react';

const HospitalDashboard = React.lazy(() => import('./dashboards/HospitalDashboard'));
const BankDashboard = React.lazy(() => import('./dashboards/BankDashboard'));
const CollegeDashboard = React.lazy(() => import('./dashboards/CollegeDashboard'));
const CompanyDashboard = React.lazy(() => import('./dashboards/CompanyDashboard'));
const GovernmentDashboard = React.lazy(() => import('./dashboards/GovernmentDashboard'));

const DashboardFallback = () => (
  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
    <Loader2 size={40} className="animate-spin text-gradient" />
  </div>
);

const Dashboard = () => {
  const { organization } = useAuthStore();

  const renderDashboard = () => {
    switch (organization) {
      case 'hospital': return <HospitalDashboard />;
      case 'bank': return <BankDashboard />;
      case 'college': return <CollegeDashboard />;
      case 'company': return <CompanyDashboard />;
      case 'government': return <GovernmentDashboard />;
      default: return <div>Please select an organization.</div>;
    }
  };

  return (
    <Suspense fallback={<DashboardFallback />}>
      {renderDashboard()}
    </Suspense>
  );
};

export default Dashboard;
