/**
 * React Zustand Hook for ORBIS Organizational Intelligence
 * 
 * Provides unified access to the Organizational Data Hub, live calculated KPIs, 
 * business rules, analytics questions, predictive forecasts, and event emission.
 */

import { create } from 'zustand';
import { OrganizationalDataHub } from './OrganizationalDataHub';
import type {
  UnifiedOrganizationalState,
  OrganizationalEvent,
  RiskEntity,
  IncidentEntity,
  ComplianceControlEntity,
  PriorityLevel
} from './types';
import { useAuthStore } from '../store/useAuthStore';

interface IntelligenceState {
  currentOrgId: string;
  data: UnifiedOrganizationalState;

  // Direct Unified State Accessors
  organization: string;
  departments: UnifiedOrganizationalState['departments'];
  employees: UnifiedOrganizationalState['employees'];
  projects: UnifiedOrganizationalState['projects'];
  assets: UnifiedOrganizationalState['assets'];
  risks: UnifiedOrganizationalState['risks'];
  incidents: UnifiedOrganizationalState['incidents'];
  audits: UnifiedOrganizationalState['audits'];
  complianceControls: UnifiedOrganizationalState['complianceControls'];
  financeRecords: UnifiedOrganizationalState['financeRecords'];
  customerFeedback: UnifiedOrganizationalState['customerFeedback'];
  tasks: UnifiedOrganizationalState['tasks'];
  notifications: UnifiedOrganizationalState['notifications'];
  events: UnifiedOrganizationalState['events'];
  kpis: UnifiedOrganizationalState['kpis'];
  analytics: UnifiedOrganizationalState['analytics'];
  predictions: UnifiedOrganizationalState['predictions'];

  // Actions
  initializeOrg: (orgId: string) => void;
  publishEvent: (event: Partial<OrganizationalEvent> & { eventType: OrganizationalEvent['eventType'] }) => void;
  
  // High-level Domain Producer Helpers
  createRisk: (riskData: {
    title: string;
    department: string;
    probability: number;
    impact: number;
    category?: string;
    mitigation?: string;
    userName?: string;
  }) => void;
  
  updateRiskScore: (riskId: string, probability: number, impact: number) => void;
  applyRiskMitigation: (riskId: string, mitigationText: string) => void;
  closeRisk: (riskId: string) => void;

  logIncident: (incidentData: {
    title: string;
    department: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    rootCause?: string;
    evidenceCount?: number;
    evidenceUrls?: string[];
    userName?: string;
  }) => void;

  resolveIncident: (incidentId: string, rootCause: string) => void;

  updateControlStatus: (controlId: string, status: ComplianceControlEntity['status'], adherencePct?: number) => void;
  closeAudit: (auditId: string) => void;

  logProjectDelay: (projectId: string, additionalDays: number) => void;
  logEmployeeResignation: (employeeId: string, employeeName: string, department: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetOrgData: () => void;
}

const defaultOrg = 'hospital';

function mapStateProperties(s: UnifiedOrganizationalState) {
  return {
    data: s,
    organization: s.organizationId,
    departments: s.departments,
    employees: s.employees,
    projects: s.projects,
    assets: s.assets,
    risks: s.risks,
    incidents: s.incidents,
    audits: s.audits,
    complianceControls: s.complianceControls,
    financeRecords: s.financeRecords,
    customerFeedback: s.customerFeedback,
    tasks: s.tasks,
    notifications: s.notifications,
    events: s.events,
    kpis: s.kpis,
    analytics: s.analytics,
    predictions: s.predictions
  };
}

export const useOrganizationalIntelligence = create<IntelligenceState>((set, get) => {
  // Initialize initial state from Hub
  const initialOrg = defaultOrg;
  const initialData = OrganizationalDataHub.getState(initialOrg);

  // Set up subscription to Hub updates
  OrganizationalDataHub.subscribe((updatedState) => {
    if (updatedState.organizationId === get().currentOrgId) {
      set(mapStateProperties(updatedState));
    }
  });

  return {
    currentOrgId: initialOrg,
    ...mapStateProperties(initialData),

    initializeOrg: (orgId: string) => {
      const targetOrg = (orgId || defaultOrg).toLowerCase();
      if (get().currentOrgId !== targetOrg || !get().data) {
        const orgState = OrganizationalDataHub.getState(targetOrg);
        set({ currentOrgId: targetOrg, ...mapStateProperties(orgState) });
      }
    },

    publishEvent: (eventInput) => {
      const currentOrg = get().currentOrgId;
      const { updatedState } = OrganizationalDataHub.publishEvent({
        ...eventInput,
        organization: eventInput.organization || currentOrg
      });
      set(mapStateProperties(updatedState));
    },

    createRisk: (riskData) => {
      const currentOrg = get().currentOrgId;
      const score = riskData.probability * riskData.impact;
      const priority: PriorityLevel = score >= 16 ? 'critical' : score >= 10 ? 'high' : 'medium';
      
      get().publishEvent({
        eventType: 'RISK_CREATED',
        organization: currentOrg,
        department: riskData.department,
        user: { name: riskData.userName || 'Risk Officer' },
        category: 'risk',
        priority,
        title: `New Risk Identified: ${riskData.title}`,
        description: `Risk registered in ${riskData.department} with calculated exposure score ${score}/25.`,
        metadata: {
          title: riskData.title,
          probability: riskData.probability,
          impact: riskData.impact,
          category: riskData.category || 'Operational',
          mitigation: riskData.mitigation
        }
      });
    },

    updateRiskScore: (riskId, probability, impact) => {
      const currentOrg = get().currentOrgId;
      const score = probability * impact;
      const priority: PriorityLevel = score >= 16 ? 'critical' : score >= 10 ? 'high' : 'medium';

      get().publishEvent({
        eventType: 'RISK_SCORE_UPDATED',
        organization: currentOrg,
        department: get().data.risks.find(r => r.id === riskId)?.department || 'Core',
        user: { name: 'Risk Analyst' },
        category: 'risk',
        priority,
        title: `Risk Score Updated: ${riskId}`,
        description: `Risk score recalibrated to ${score}/25 (P: ${probability}, I: ${impact}).`,
        relatedObjects: { riskId },
        metadata: { probability, impact }
      });
    },

    applyRiskMitigation: (riskId, mitigationText) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'RISK_MITIGATION_APPLIED',
        organization: currentOrg,
        department: get().data.risks.find(r => r.id === riskId)?.department || 'Core',
        user: { name: 'Mitigation Specialist' },
        category: 'risk',
        priority: 'medium',
        title: `Mitigation Work Order Applied: ${riskId}`,
        description: `Action applied: ${mitigationText}`,
        relatedObjects: { riskId },
        metadata: { mitigation: mitigationText }
      });
    },

    closeRisk: (riskId) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'RISK_CLOSED',
        organization: currentOrg,
        department: get().data.risks.find(r => r.id === riskId)?.department || 'Core',
        user: { name: 'Chief Risk Officer' },
        category: 'risk',
        priority: 'low',
        title: `Risk Closed: ${riskId}`,
        description: `Risk successfully mitigated and verified by regulatory oversight.`,
        relatedObjects: { riskId }
      });
    },

    logIncident: (incidentData) => {
      const currentOrg = get().currentOrgId;
      const priority: PriorityLevel = incidentData.severity.toLowerCase() as PriorityLevel;

      get().publishEvent({
        eventType: 'INCIDENT_LOGGED',
        organization: currentOrg,
        department: incidentData.department,
        user: { name: incidentData.userName || 'Operational Reporter' },
        category: 'incident',
        priority,
        title: `Incident Filed: ${incidentData.title}`,
        description: incidentData.rootCause || 'Root cause investigation underway.',
        metadata: {
          title: incidentData.title,
          severity: incidentData.severity,
          rootCause: incidentData.rootCause,
          evidenceCount: incidentData.evidenceCount,
          evidenceUrls: incidentData.evidenceUrls
        }
      });
    },

    resolveIncident: (incidentId, rootCause) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'INCIDENT_RESOLVED',
        organization: currentOrg,
        department: get().data.incidents.find(i => i.id === incidentId)?.department || 'Core',
        user: { name: 'Shift Supervisor' },
        category: 'incident',
        priority: 'low',
        title: `Incident Resolved: ${incidentId}`,
        description: `Corrective action verified: ${rootCause}`,
        relatedObjects: { incidentId },
        metadata: { rootCause }
      });
    },

    updateControlStatus: (controlId, status, adherencePct) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'COMPLIANCE_STATUS_CHANGED',
        organization: currentOrg,
        department: get().data.complianceControls.find(c => c.id === controlId)?.department || 'Core',
        user: { name: 'Compliance Officer' },
        category: 'compliance',
        priority: status === 'non_compliant' ? 'critical' : status === 'warning' ? 'high' : 'low',
        title: `Compliance Status Changed: ${controlId}`,
        description: `Statutory control status updated to ${status}.`,
        relatedObjects: { controlId },
        metadata: { status, adherencePct }
      });
    },

    closeAudit: (auditId) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'AUDIT_CLOSED',
        organization: currentOrg,
        department: get().data.audits.find(a => a.id === auditId)?.department || 'Core',
        user: { name: 'Audit Director' },
        category: 'audit',
        priority: 'low',
        title: `Audit Formally Closed: ${auditId}`,
        description: `All observations closed and certificate generated.`,
        relatedObjects: { auditId }
      });
    },

    logProjectDelay: (projectId, additionalDays) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'PROJECT_DELAY_RECORDED',
        organization: currentOrg,
        department: get().data.projects.find(p => p.id === projectId)?.department || 'Core',
        user: { name: 'Project Lead' },
        category: 'project',
        priority: 'high',
        title: `Project Milestone Delay: ${projectId}`,
        description: `Delay of ${additionalDays} days recorded against critical milestone.`,
        relatedObjects: { projectId },
        metadata: { additionalDays }
      });
    },

    logEmployeeResignation: (employeeId, employeeName, department) => {
      const currentOrg = get().currentOrgId;
      get().publishEvent({
        eventType: 'EMPLOYEE_RESIGNED',
        organization: currentOrg,
        department,
        user: { name: 'HR Director' },
        category: 'hr',
        priority: 'high',
        title: `Personnel Resignation Logged: ${employeeName}`,
        description: `Resignation in ${department}. Workforce availability adjusted.`,
        relatedObjects: { employeeId }
      });
    },

    markNotificationRead: (id: string) => {
      set(prev => ({
        data: {
          ...prev.data,
          notifications: prev.data.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }
      }));
    },

    markAllNotificationsRead: () => {
      set(prev => ({
        data: {
          ...prev.data,
          notifications: prev.data.notifications.map(n => ({ ...n, read: true }))
        }
      }));
    },

    resetOrgData: () => {
      const currentOrg = get().currentOrgId;
      const fresh = OrganizationalDataHub.resetState(currentOrg);
      set({ data: fresh });
    }
  };
});
