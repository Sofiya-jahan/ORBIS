/**
 * ORBIS Organizational Data Hub - The Core Central Intelligence Engine
 * 
 * Invisible internal heart of ORBIS. Every module writes standardized events into this hub.
 * Nothing bypasses this layer.
 * 
 * Flow:
 * Event Produced -> Hub -> Entity Mutation -> Business Rules Engine -> KPI Engine -> Analytics Engine -> Prediction Engine -> Subscribers
 */

import type {
  UnifiedOrganizationalState,
  OrganizationalEvent,
  OrganizationalEventType,
  RiskEntity,
  IncidentEntity,
  ComplianceControlEntity,
  AuditEntity,
  ProjectEntity,
  EmployeeEntity,
  AssetEntity,
  OrganizationalNotificationEntity
} from './types';
import { createInitialOrganizationalState } from './defaultState';
import { KPIEngine } from './KPIEngine';
import { BusinessRulesEngine } from './BusinessRulesEngine';
import { AnalyticsEngine } from './AnalyticsEngine';
import { PredictionEngine } from './PredictionEngine';

export class OrganizationalDataHub {
  private static instances: Map<string, UnifiedOrganizationalState> = new Map();
  private static listeners: Set<(state: UnifiedOrganizationalState) => void> = new Set();

  /**
   * Helper instance getter for test suites and object-oriented consumers
   */
  public static getInstance(orgId: string = 'hospital') {
    return {
      getState: () => OrganizationalDataHub.getState(orgId),
      reset: (id: string = orgId) => OrganizationalDataHub.resetState(id),
      publishEvent: (e: any) => OrganizationalDataHub.publishEvent({ ...e, organization: orgId }).event,
      getRecentEvents: (count: number = 10) => OrganizationalDataHub.getRecentEvents(count, orgId),
      logIncident: (inc: any) => OrganizationalDataHub.logIncident(inc, orgId),
      subscribe: (cb: (state: UnifiedOrganizationalState) => void) => OrganizationalDataHub.subscribe(cb)
    };
  }

  /**
   * Retrieves or initializes the unified organizational state for an organization
   */
  public static getState(orgId: string = 'hospital'): UnifiedOrganizationalState {
    const key = (orgId || 'hospital').toLowerCase();
    
    if (!this.instances.has(key)) {
      // Try to load cached state from localStorage
      if (typeof window !== 'undefined') {
        try {
          const cached = localStorage.getItem(`orbis_hub_state_${key}`);
          if (cached) {
            const parsed = JSON.parse(cached) as UnifiedOrganizationalState;
            this.instances.set(key, parsed);
            return parsed;
          }
        } catch (e) {
          console.warn('Could not load cached ORBIS hub state:', e);
        }
      }

      // Initialize fresh seed state
      const freshState = createInitialOrganizationalState(key);
      this.instances.set(key, freshState);
      this.saveState(key, freshState);
      return freshState;
    }

    return this.instances.get(key)!;
  }

  /**
   * Resets organization state to initial seed values
   */
  public static resetState(orgId: string = 'hospital'): UnifiedOrganizationalState {
    const key = (orgId || 'hospital').toLowerCase();
    const fresh = createInitialOrganizationalState(key);
    this.instances.set(key, fresh);
    this.saveState(key, fresh);
    this.notifySubscribers(fresh);
    return fresh;
  }

  /**
   * Emits a standardized event into the Organizational Data Hub
   * Updates entities, runs business rules, recalculates KPIs, analytics, and predictions
   */
  public static publishEvent(
    eventInput: Partial<OrganizationalEvent> & { eventType: OrganizationalEventType }
  ): { event: OrganizationalEvent; updatedState: UnifiedOrganizationalState } {
    const orgId = (eventInput.organization || 'hospital').toLowerCase();
    const currentState = this.getState(orgId);

    const event: OrganizationalEvent = {
      id: eventInput.id || `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      eventType: eventInput.eventType,
      organization: orgId,
      department: eventInput.department || 'Operations',
      timestamp: eventInput.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: eventInput.user || { name: 'System Officer', role: 'Automated Agent' },
      category: eventInput.category || 'operations',
      priority: eventInput.priority || 'medium',
      title: eventInput.title || eventInput.eventType.replace(/_/g, ' '),
      description: eventInput.description || `Event ${eventInput.eventType} recorded in Organizational Data Hub`,
      relatedObjects: eventInput.relatedObjects || {},
      metadata: eventInput.metadata || {}
    };

    // 1. Clone state entities for immutable updates
    let departments = [...currentState.departments];
    let employees = [...currentState.employees];
    let projects = [...currentState.projects];
    let assets = [...currentState.assets];
    let risks = [...currentState.risks];
    let incidents = [...currentState.incidents];
    let audits = [...currentState.audits];
    let complianceControls = [...currentState.complianceControls];
    let financeRecords = [...currentState.financeRecords];
    let customerFeedback = [...currentState.customerFeedback];
    let tasks = [...currentState.tasks];
    let notifications = [...currentState.notifications];

    // 2. Process Domain Entity Mutators based on Event Type
    switch (event.eventType) {
      case 'RISK_CREATED': {
        const meta = event.metadata || {};
        const newRisk: RiskEntity = {
          id: meta.id || `RSK-${Date.now().toString().slice(-4)}`,
          title: meta.title || event.title,
          department: event.department,
          organizationId: orgId,
          category: meta.category || 'Operational',
          probability: meta.probability || 3,
          impact: meta.impact || 3,
          velocity: meta.velocity || 3,
          score: (meta.probability || 3) * (meta.impact || 3),
          severity: ((meta.probability || 3) * (meta.impact || 3)) >= 16 ? 'Critical' : ((meta.probability || 3) * (meta.impact || 3)) >= 10 ? 'High' : 'Medium',
          owner: meta.owner || event.user.name || 'Risk Officer',
          status: 'open',
          mitigation: meta.mitigation || 'Mitigation plan under evaluation.',
          lastReviewed: 'Just now',
          relatedIncidentIds: meta.relatedIncidentIds || []
        };
        risks = [newRisk, ...risks];
        break;
      }

      case 'RISK_SCORE_UPDATED': {
        const riskId = event.relatedObjects?.riskId;
        if (riskId) {
          risks = risks.map(r => {
            if (r.id === riskId) {
              const prob = event.metadata?.probability ?? r.probability;
              const imp = event.metadata?.impact ?? r.impact;
              const score = prob * imp;
              const sev = score >= 16 ? 'Critical' : score >= 10 ? 'High' : score >= 5 ? 'Medium' : 'Low';
              return { ...r, probability: prob, impact: imp, score, severity: sev, lastReviewed: 'Just now' };
            }
            return r;
          });
        }
        break;
      }

      case 'RISK_MITIGATION_APPLIED': {
        const riskId = event.relatedObjects?.riskId;
        if (riskId) {
          risks = risks.map(r => {
            if (r.id === riskId) {
              return {
                ...r,
                status: 'active_mitigation',
                mitigation: event.metadata?.mitigation || r.mitigation,
                lastReviewed: 'Just now'
              };
            }
            return r;
          });
        }
        break;
      }

      case 'RISK_CLOSED': {
        const riskId = event.relatedObjects?.riskId;
        if (riskId) {
          risks = risks.map(r => r.id === riskId ? { ...r, status: 'closed', lastReviewed: 'Just now' } : r);
        }
        break;
      }

      case 'INCIDENT_LOGGED': {
        const meta = event.metadata || {};
        const newInc: IncidentEntity = {
          id: meta.id || `INC-2026-${String(incidents.length + 85).padStart(3, '0')}`,
          title: meta.title || event.title,
          department: event.department,
          organizationId: orgId,
          severity: (meta.severity as any) || 'Medium',
          reporter: event.user.name || 'Telemetry Sentry',
          reportedAt: 'Just now',
          status: 'Under Investigation',
          rootCause: meta.rootCause || 'Root-cause investigation actively in progress.',
          evidenceCount: meta.evidenceCount || 1,
          evidenceUrls: meta.evidenceUrls || [],
          relatedRiskId: meta.relatedRiskId
        };
        incidents = [newInc, ...incidents];

        // If high or critical, link with high risk
        if (newInc.severity === 'Critical' || newInc.severity === 'High') {
          const matchingRisk = risks.find(r => r.department === event.department);
          if (matchingRisk) {
            matchingRisk.relatedIncidentIds = [...(matchingRisk.relatedIncidentIds || []), newInc.id];
          }
        }
        break;
      }

      case 'INCIDENT_RESOLVED': {
        const incId = event.relatedObjects?.incidentId;
        if (incId) {
          incidents = incidents.map(i => {
            if (i.id === incId) {
              return {
                ...i,
                status: 'Resolved',
                rootCause: event.metadata?.rootCause || i.rootCause,
                resolutionTimeHours: event.metadata?.resolutionTimeHours || 1.5
              };
            }
            return i;
          });
        }
        break;
      }

      case 'COMPLIANCE_STATUS_CHANGED':
      case 'CONTROL_EFFECTIVENESS_UPDATED': {
        const ctrlId = event.relatedObjects?.controlId;
        if (ctrlId) {
          complianceControls = complianceControls.map(c => {
            if (c.id === ctrlId) {
              return {
                ...c,
                status: event.metadata?.status || c.status,
                adherencePct: event.metadata?.adherencePct ?? c.adherencePct,
                lastAssessed: 'Today'
              };
            }
            return c;
          });
        }
        break;
      }

      case 'AUDIT_CLOSED': {
        const auditId = event.relatedObjects?.auditId;
        if (auditId) {
          audits = audits.map(a => a.id === auditId ? { ...a, status: 'Closed', closureRatePct: 100 } : a);
        }
        break;
      }

      case 'PROJECT_DELAY_RECORDED': {
        const prjId = event.relatedObjects?.projectId;
        if (prjId) {
          projects = projects.map(p => {
            if (p.id === prjId) {
              return {
                ...p,
                status: 'delayed',
                delayDays: (p.delayDays || 0) + (event.metadata?.additionalDays || 10),
                scheduleVariancePct: (p.scheduleVariancePct || 0) + 15
              };
            }
            return p;
          });
        }
        break;
      }

      case 'EMPLOYEE_RESIGNED': {
        const empId = event.relatedObjects?.employeeId;
        if (empId) {
          employees = employees.map(e => e.id === empId ? { ...e, status: 'resigned', resignedDate: 'Today' } : e);
        }
        break;
      }

      case 'MACHINE_FAILURE': {
        const assetId = event.relatedObjects?.assetId;
        if (assetId) {
          assets = assets.map(a => {
            if (a.id === assetId) {
              return {
                ...a,
                status: 'degraded',
                downtimeHoursTotal: (a.downtimeHoursTotal || 0) + 6,
                efficiencyPct: Math.max(60, (a.efficiencyPct || 90) - 12),
                telemetryAnomalyScore: 82
              };
            }
            return a;
          });
        }
        break;
      }

      default:
        break;
    }

    // 3. Prepend event to the event ledger
    const updatedEvents = [event, ...currentState.events].slice(0, 100);

    // 4. Construct intermediate state for Business Rules & KPI evaluation
    const intermediateState: UnifiedOrganizationalState = {
      ...currentState,
      lastUpdated: new Date().toISOString(),
      departments,
      employees,
      projects,
      assets,
      risks,
      incidents,
      audits,
      complianceControls,
      financeRecords,
      customerFeedback,
      tasks,
      notifications,
      events: updatedEvents
    };

    // 5. Evaluate Business Rules Engine
    const ruleResults = BusinessRulesEngine.evaluateAll(intermediateState, event);

    // If rules triggered alerts, add to notifications list
    for (const res of ruleResults) {
      if (res.impacts.createAlert) {
        const alertInfo = res.impacts.createAlert;
        const newNotif: OrganizationalNotificationEntity = {
          id: `NOTIF-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          title: alertInfo.title,
          desc: alertInfo.desc,
          time: 'Just now',
          type: alertInfo.type,
          priority: alertInfo.priority,
          department: event.department,
          read: false,
          triggerRule: res.ruleId,
          timestamp: Date.now()
        };
        notifications = [newNotif, ...notifications].slice(0, 50);
      }
    }

    // 6. Recalculate KPIs with KPI Engine
    const calculatedKPIs = KPIEngine.calculateAll({
      organizationId: orgId,
      departments,
      employees,
      projects,
      assets,
      risks,
      incidents,
      audits,
      complianceControls,
      financeRecords,
      customerFeedback
    });

    // 7. Assemble Complete Updated State
    const updatedState: UnifiedOrganizationalState = {
      ...intermediateState,
      notifications,
      kpis: calculatedKPIs,
      activeRuleTriggers: ruleResults,
      analytics: null as any,
      predictions: null as any
    };

    // 8. Run Analytics & Prediction Engines
    updatedState.analytics = AnalyticsEngine.analyze(updatedState);
    updatedState.predictions = PredictionEngine.forecast(updatedState);

    // 9. Cache and Persist
    this.instances.set(orgId, updatedState);
    this.saveState(orgId, updatedState);

    // 10. Notify all active subscribers
    this.notifySubscribers(updatedState);

    return { event, updatedState };
  }

  /**
   * Save state to localStorage for offline persistence
   */
  private static saveState(orgId: string, state: UnifiedOrganizationalState) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`orbis_hub_state_${orgId}`, JSON.stringify(state));
      } catch (e) {
        console.warn('LocalStorage save failed for ORBIS hub:', e);
      }
    }
  }

  /**
   * Returns recent events from the organizational event ledger
   */
  public static getRecentEvents(count: number = 10, orgId: string = 'hospital'): OrganizationalEvent[] {
    const state = this.getState(orgId);
    return state.events.slice(0, count);
  }

  /**
   * Convenience producer to log an operational incident into the hub
   */
  public static logIncident(
    incident: { title: string; department: string; severity?: string; reportedBy?: string; description?: string },
    orgId: string = 'hospital'
  ) {
    return this.publishEvent({
      eventType: 'INCIDENT_LOGGED',
      organization: orgId,
      department: incident.department,
      priority: incident.severity === 'Critical' ? 'critical' : 'high',
      user: { name: incident.reportedBy || 'Incident Reporter', role: 'Staff' },
      title: incident.title,
      description: incident.description || incident.title,
      metadata: {
        title: incident.title,
        severity: incident.severity || 'Medium',
        reportedBy: incident.reportedBy,
        description: incident.description
      }
    });
  }

  /**
   * Convenience producer to create and register a risk in the hub
   */
  public static createRisk(
    risk: { title: string; department: string; score?: number; severity?: string; owner?: string; category?: string },
    orgId: string = 'hospital'
  ) {
    return this.publishEvent({
      eventType: 'RISK_CREATED',
      organization: orgId,
      department: risk.department,
      priority: risk.severity === 'Critical' ? 'critical' : 'high',
      user: { name: risk.owner || 'Risk Manager', role: 'Risk Officer' },
      title: risk.title,
      description: `Registered operational risk: ${risk.title}`,
      metadata: risk
    });
  }

  /**
   * Subscribe to updates across the central intelligence engine
   */
  public static subscribe(listener: (state: UnifiedOrganizationalState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notifySubscribers(state: UnifiedOrganizationalState) {
    this.listeners.forEach(fn => {
      try {
        fn(state);
      } catch (err) {
        console.error('Error notifying ORBIS hub subscriber:', err);
      }
    });
  }
}
