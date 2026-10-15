import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { ORGANIZATIONS } from '../../config/platformConfig';
import { 
  Clock, CheckCircle2, AlertCircle, Plus, 
  GitPullRequest, Filter, ArrowRight, UserCheck, Check, X
} from 'lucide-react';

export const WorkflowTasks = () => {
  const { organization } = useAuthStore();
  const currentOrg = organization && ORGANIZATIONS[organization] ? ORGANIZATIONS[organization] : ORGANIZATIONS.hospital;

  const [tasks, setTasks] = useState([
    {
      id: 'TSK-401',
      title: 'Approve Sepsis AI Model Recalibration Protocol',
      department: currentOrg.departments[0] || 'Core',
      priority: 'High',
      assignee: 'Chief Risk Officer',
      due: 'Today, 18:00',
      status: 'Pending Approval',
      type: 'Approval'
    },
    {
      id: 'TSK-402',
      title: 'Execute Monthly SOC2 / ISO Audit Evidence Pull',
      department: currentOrg.departments[1] || 'Compliance',
      priority: 'Medium',
      assignee: 'Security Lead',
      due: 'In 2 days',
      status: 'In Progress',
      type: 'Task'
    },
    {
      id: 'TSK-403',
      title: 'Review Root-Cause Mitigation Plan for Incident #084',
      department: currentOrg.departments[2] || 'Operations',
      priority: 'High',
      assignee: 'Department Lead',
      due: 'Tomorrow, 12:00',
      status: 'Pending Review',
      type: 'Review'
    },
    {
      id: 'TSK-404',
      title: 'Sign Off on Q4 Disaster Recovery Failover Simulation',
      department: currentOrg.departments[3] || 'Infrastructure',
      priority: 'Low',
      assignee: 'Executive Team',
      due: 'Next Week',
      status: 'Completed',
      type: 'Approval'
    }
  ]);

  const handleApprove = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
  };

  const handleReject = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="neo-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: currentOrg.themeColor, fontWeight: '700', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            <GitPullRequest size={16} /> Workflow Automation
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            Task Management, Escalations & Approvals
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Orchestration of risk mitigations, executive sign-offs, and automated escalation pipelines.
          </p>
        </div>

        <button 
          onClick={() => alert('New Task Creation Wizard opened.')}
          className="btn btn-primary"
          style={{ background: currentOrg.themeColor }}
        >
          <Plus size={16} /> Create Action Task
        </button>
      </div>

      {/* Task Queue List */}
      <div className="neo-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>
          Active Workflow Queue ({tasks.filter(t => t.status !== 'Completed' && t.status !== 'Approved').length} Pending)
        </h2>

        {tasks.map(task => (
          <div
            key={task.id}
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: '14px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '12px',
                background: task.status === 'Approved' ? 'rgba(21, 84, 232, 0.2)' : `${currentOrg.themeColor}20`,
                color: task.status === 'Approved' ? '#6AE7F7' : currentOrg.themeColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {task.status === 'Approved' ? <CheckCircle2 size={22} /> : <Clock size={22} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: currentOrg.themeColor, fontFamily: 'var(--font-mono)' }}>
                    {task.id}
                  </span>
                  <span style={{
                    padding: '0.2rem 0.5rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700,
                    background: task.priority === 'High' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                    color: task.priority === 'High' ? '#EF4444' : '#F59E0B'
                  }}>
                    {task.priority} Priority
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    &bull; {task.department}
                  </span>
                </div>

                <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#FFFFFF' }}>
                  {task.title}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Assignee: <strong style={{ color: 'var(--text-secondary)' }}>{task.assignee}</strong> &bull; Due: {task.due}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {task.status === 'Pending Approval' ? (
                <>
                  <button
                    onClick={() => handleApprove(task.id)}
                    className="btn btn-primary"
                    style={{ background: 'linear-gradient(135deg, #1554E8 0%, #2E9BF8 100%)', padding: '0.5rem 1rem', fontSize: '0.82rem', boxShadow: '0 0 12px rgba(21, 84, 232, 0.4)' }}
                  >
                    <Check size={16} /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(task.id)}
                    style={{
                      background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
                      color: '#EF4444', padding: '0.5rem 1rem', borderRadius: '10px',
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: 700
                    }}
                  >
                    <X size={16} /> Reject
                  </button>
                </>
              ) : (
                <span style={{
                  padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 700,
                  background: task.status === 'Approved' || task.status === 'Completed' ? 'rgba(21, 84, 232, 0.18)' : 'var(--bg-secondary)',
                  color: task.status === 'Approved' || task.status === 'Completed' ? '#6AE7F7' : 'var(--text-secondary)',
                  border: task.status === 'Approved' || task.status === 'Completed' ? '1px solid rgba(106, 231, 247, 0.35)' : '1px solid var(--border-color)'
                }}>
                  {task.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default WorkflowTasks;
