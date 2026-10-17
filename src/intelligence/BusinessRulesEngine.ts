/**
 * ORBIS Central Intelligence Engine - Business Rules Engine
 * 
 * Instead of manual static status changes, the Business Rules Engine reacts 
 * dynamically to organizational events and state changes, escalating risks, 
 * triggering alerts, dispatching preventive workflows, and adjusting indices.
 */

import type {
  UnifiedOrganizationalState,
  OrganizationalEvent,
  BusinessRuleDefinition,
  RuleEvaluationResult
} from './types';

export class BusinessRulesEngine {
  private static rules: BusinessRuleDefinition[] = [
    // 1. Project Delay & Budget Variance Escalation
    {
      id: 'RULE-PROJ-01',
      name: 'Project Delivery & Capital Escalation Rule',
      description: 'Automatically escalates project risk when schedule delay exceeds 30% and budget variance exceeds 15%.',
      conditionDescription: 'Project Delay > 30% AND Budget Variance > 15%',
      severity: 'high',
      isActive: true,
      evaluate: (state: UnifiedOrganizationalState) => {
        const atRiskProjects = state.projects.filter(
          p => (p.delayDays > 14 || p.scheduleVariancePct > 30) && p.budgetVariancePct > 15
        );

        if (atRiskProjects.length > 0) {
          const names = atRiskProjects.map(p => p.name).join(', ');
          return {
            ruleId: 'RULE-PROJ-01',
            ruleName: 'Project Delivery & Capital Escalation Rule',
            triggered: true,
            message: `Critical threshold excursion: Project(s) [${names}] exceed 30% schedule delay and 15% capital variance. Project risk index escalated.`,
            impacts: {
              riskIndexDelta: 4.5 * atRiskProjects.length,
              healthScoreDelta: -3 * atRiskProjects.length,
              escalateProjectIds: atRiskProjects.map(p => p.id),
              createAlert: {
                title: 'Project Delivery Risk Escalation',
                desc: `${atRiskProjects.length} strategic initiative(s) exceed 30% schedule delay and 15% budget variance. Automated mitigation review initiated.`,
                priority: 'high',
                type: 'warning'
              },
              suggestedAction: 'Initiate critical path fast-tracking and reallocate auxiliary budget reserve.'
            }
          };
        }
        return null;
      }
    },

    // 2. HR Resignation & Operational Risk Escalation
    {
      id: 'RULE-HR-02',
      name: 'Staffing Shortage & Attrition Safeguard',
      description: 'Increases operational risk index and alerts executive leadership when department resignation rate exceeds 10%.',
      conditionDescription: 'Department Resignation Rate > 10% OR Critical Staff Resignation',
      severity: 'high',
      isActive: true,
      evaluate: (state: UnifiedOrganizationalState, event?: OrganizationalEvent) => {
        const turnoverPct = state.kpis.hr.employeeTurnoverPct;
        const recentResignation = event?.eventType === 'EMPLOYEE_RESIGNED';

        if (turnoverPct > 10 || (recentResignation && event.priority === 'critical')) {
          return {
            ruleId: 'RULE-HR-02',
            ruleName: 'Staffing Shortage & Attrition Safeguard',
            triggered: true,
            message: `Workforce turnover exceeds 10% threshold (${turnoverPct}%). Department operational capability degraded.`,
            impacts: {
              riskIndexDelta: 6.0,
              healthScoreDelta: -5.0,
              createAlert: {
                title: 'Workforce Attrition Anomaly Detected',
                desc: `Turnover rate has breached threshold at ${turnoverPct}%. Cross-departmental coverage risks escalated to Chief Human Resources Officer.`,
                priority: 'high',
                type: 'warning'
              },
              suggestedAction: 'Activate auxiliary shift coverage and review retention incentives for specialized personnel.'
            }
          };
        }
        return null;
      }
    },

    // 3. Compliance Degradation Guardrail
    {
      id: 'RULE-COMP-03',
      name: 'Statutory Regulatory Compliance Guardrail',
      description: 'Creates high-priority compliance alert and flags audit readiness if compliance drops below 80% or violation flagged.',
      conditionDescription: 'Overall Compliance < 80% OR Non-Compliant Control Flagged',
      severity: 'critical',
      isActive: true,
      evaluate: (state: UnifiedOrganizationalState) => {
        const compliancePct = state.kpis.compliance.overallCompliancePct;
        const violations = state.complianceControls.filter(c => c.status === 'non_compliant' || c.status === 'overdue');

        if (compliancePct < 85 || violations.length > 0) {
          return {
            ruleId: 'RULE-COMP-03',
            ruleName: 'Statutory Regulatory Compliance Guardrail',
            triggered: true,
            message: `Compliance index at ${compliancePct}% with ${violations.length} active control violations. Statutory audit readiness compromised.`,
            impacts: {
              riskIndexDelta: 7.5,
              healthScoreDelta: -6.0,
              createAlert: {
                title: 'Regulatory Compliance Threshold Excursion',
                desc: `Adherence index fallen below statutory threshold (${compliancePct}%). ${violations.length} controls require immediate remediation.`,
                priority: 'critical',
                type: 'alert'
              },
              suggestedAction: 'Execute automated compliance remediation workflow and notify Chief Compliance Officer.'
            }
          };
        }
        return null;
      }
    },

    // 4. Critical Incident Cascade / Systemic Instability
    {
      id: 'RULE-INC-04',
      name: 'Systemic Vulnerability & Incident Cascade Trigger',
      description: 'Increases organizational risk index when more than 2 critical incidents or 5 active incidents occur.',
      conditionDescription: 'Critical Incidents >= 2 OR Total Active Incidents >= 5',
      severity: 'critical',
      isActive: true,
      evaluate: (state: UnifiedOrganizationalState) => {
        const activeIncidents = state.incidents.filter(i => i.status !== 'Resolved');
        const criticalIncidents = activeIncidents.filter(i => i.severity === 'Critical');

        if (criticalIncidents.length >= 2 || activeIncidents.length >= 5) {
          return {
            ruleId: 'RULE-INC-04',
            ruleName: 'Systemic Vulnerability & Incident Cascade Trigger',
            triggered: true,
            message: `Systemic telemetry alert: ${criticalIncidents.length} critical and ${activeIncidents.length} active operational incidents detected.`,
            impacts: {
              riskIndexDelta: 10.0,
              healthScoreDelta: -8.0,
              createAlert: {
                title: 'Operational Cascade Threat Alert',
                desc: `Multiple concurrent incidents (${criticalIncidents.length} Critical, ${activeIncidents.length} Total) indicate systemic strain across key departments.`,
                priority: 'critical',
                type: 'alert'
              },
              suggestedAction: 'Convene Emergency Incident Command group and isolate affected operational clusters.'
            }
          };
        }
        return null;
      }
    },

    // 5. Asset Degradation & Predictive Failure Trigger
    {
      id: 'RULE-ASSET-05',
      name: 'Asset Reliability & Predictive Maintenance Trigger',
      description: 'Alerts operations when asset downtime exceeds 20 hours or telemetry anomaly score exceeds 70.',
      conditionDescription: 'Asset Downtime > 20h OR Anomaly Score > 70',
      severity: 'medium',
      isActive: true,
      evaluate: (state: UnifiedOrganizationalState) => {
        const degradedAssets = state.assets.filter(a => a.status === 'degraded' || a.telemetryAnomalyScore > 70);

        if (degradedAssets.length > 0) {
          const names = degradedAssets.map(a => a.name).join(', ');
          return {
            ruleId: 'RULE-ASSET-05',
            ruleName: 'Asset Reliability & Predictive Maintenance Trigger',
            triggered: true,
            message: `Predictive maintenance flag: Telemetry anomaly detected on [${names}]. MTBF degradation anticipated.`,
            impacts: {
              riskIndexDelta: 3.5,
              healthScoreDelta: -2.0,
              createAlert: {
                title: 'Predictive Equipment Telemetry Anomaly',
                desc: `Early acoustic/vibration drift detected on ${names}. Scheduling autonomous preventive diagnostic window.`,
                priority: 'medium',
                type: 'warning'
              },
              suggestedAction: 'Deploy field inspection team and transfer active workload to redundant backup hardware.'
            }
          };
        }
        return null;
      }
    }
  ];

  /**
   * Evaluates all active business rules against the current unified state and an optional incoming event
   */
  public static evaluateAll(state: UnifiedOrganizationalState, event?: OrganizationalEvent): RuleEvaluationResult[] {
    const triggeredResults: RuleEvaluationResult[] = [];

    for (const rule of this.rules) {
      if (!rule.isActive) continue;
      try {
        const result = rule.evaluate(state, event);
        if (result && result.triggered) {
          triggeredResults.push(result);
        }
      } catch (err) {
        console.error(`Error evaluating business rule ${rule.id}:`, err);
      }
    }

    return triggeredResults;
  }

  /**
   * Evaluates all rules and returns aggregate impacts and generated alerts
   */
  public static evaluate(state: UnifiedOrganizationalState, event?: OrganizationalEvent) {
    const evaluationResults = this.evaluateAll(state, event);
    return {
      evaluationResults,
      newNotifications: evaluationResults.filter(r => r.impacts.createAlert).map(r => ({
        ruleId: r.ruleId,
        alert: r.impacts.createAlert
      })),
      impactedRiskIndexDelta: evaluationResults.reduce((acc, r) => acc + (r.impacts.riskIndexDelta || 0), 0),
      impactedHealthScoreDelta: evaluationResults.reduce((acc, r) => acc + (r.impacts.healthScoreDelta || 0), 0)
    };
  }
}
