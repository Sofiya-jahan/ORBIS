import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { Bell, AlertTriangle, CheckCircle2, Info, ShieldCheck, Clock } from 'lucide-react';

export const NotificationsPage = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Autonomous Mitigation Triggered', desc: 'Load rebalanced on primary telemetry pipelines. Risk mitigated by 3.8%.', time: '14 mins ago', type: 'success', read: false },
    { id: 2, title: 'Near Miss Incident Logged', desc: 'Supervisor filed incident report INC-2026-081 for secondary route congestion.', time: '2 hours ago', type: 'warning', read: false },
    { id: 3, title: 'Weekly Regulatory Audit Passed', desc: '100% adherence confirmed across all active SOC2 / HIPAA control evidence.', time: 'Yesterday', type: 'info', read: true },
  ]);

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <Bell size={16} /> Notification Center
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            System Alerts & Critical Telemetry
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Real-time notifications, audit events, and autonomous defense triggers for {currentOrg.name}.
          </p>
        </div>

        <button 
          onClick={markAllAsRead}
          className="btn btn-secondary"
        >
          Mark All As Read
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            className="glass-card"
            style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1.5rem',
              borderLeft: `4px solid ${notif.type === 'success' ? '#10B981' : notif.type === 'warning' ? '#F59E0B' : currentOrg.themeColor}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: notif.type === 'success' ? 'rgba(16,185,129,0.15)' : notif.type === 'warning' ? 'rgba(245,158,11,0.15)' : `${currentOrg.themeColor}20`,
                color: notif.type === 'success' ? '#10B981' : notif.type === 'warning' ? '#F59E0B' : currentOrg.themeColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {notif.type === 'success' ? <CheckCircle2 size={22} /> : notif.type === 'warning' ? <AlertTriangle size={22} /> : <Info size={22} />}
              </div>

              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.25rem' }}>
                  {notif.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                  {notif.desc}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {notif.time}
              </span>
              {!notif.read && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: currentOrg.themeColor }} />
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotificationsPage;
