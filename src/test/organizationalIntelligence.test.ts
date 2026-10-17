import { describe, it, expect, beforeEach } from 'vitest';
import { OrganizationalDataHub } from '../intelligence/OrganizationalDataHub';
import { KPIEngine } from '../intelligence/KPIEngine';
import { BusinessRulesEngine } from '../intelligence/BusinessRulesEngine';
import { AnalyticsEngine } from '../intelligence/AnalyticsEngine';
import { PredictionEngine } from '../intelligence/PredictionEngine';
import { buildLiveOrganizationalContextPrompt, generateHeuristicOrganizationalResponse } from '../intelligence/aiContextBuilder';

describe('Organizational Intelligence Platform - Core Architecture', () => {
  beforeEach(() => {
    localStorage.clear();
    OrganizationalDataHub.resetState('hospital');
  });

  describe('OrganizationalDataHub & Centralized Data Model', () => {
    it('initializes unified state with valid departments, risks, incidents, and controls', () => {
      const state = OrganizationalDataHub.getState('hospital');
      expect(state.organizationId).toBe('hospital');
      expect(state.departments.length).toBeGreaterThan(0);
      expect(state.risks.length).toBeGreaterThan(0);
      expect(state.incidents.length).toBeGreaterThan(0);
      expect(state.complianceControls.length).toBeGreaterThan(0);
      expect(state.financeRecords.length).toBeGreaterThan(0);
      expect(state.kpis).toBeDefined();
      expect(state.analytics).toBeDefined();
      expect(state.predictions).toBeDefined();
    });

    it('publishes standardized organizational events into the hub and updates subscribers', () => {
      let notified = false;
      const unsubscribe = OrganizationalDataHub.subscribe(() => {
        notified = true;
      });

      const { event, updatedState } = OrganizationalDataHub.publishEvent({
        eventType: 'RISK_CREATED',
        organization: 'hospital',
        department: 'Emergency & Trauma',
        priority: 'high',
        metadata: {
          title: 'Automated Test Risk',
          score: 85,
          severity: 'Critical'
        }
      });

      expect(event.id).toBeDefined();
      expect(event.eventType).toBe('RISK_CREATED');
      expect(event.timestamp).toBeDefined();
      expect(notified).toBe(true);

      const latestEvents = OrganizationalDataHub.getRecentEvents(5, 'hospital');
      expect(latestEvents[0].eventType).toBe('RISK_CREATED');
      expect(updatedState.risks.some(r => r.title === 'Automated Test Risk' || r.title === 'RISK CREATED')).toBe(true);

      unsubscribe();
    });

    it('mutates state entities and triggers automatic recalculation on module actions', () => {
      const initialIncidents = OrganizationalDataHub.getState('hospital').incidents.length;
      
      OrganizationalDataHub.logIncident({
        title: 'Network Switch Failover Alert',
        department: 'Emergency & Trauma',
        severity: 'Critical',
        reportedBy: 'DevOps Lead',
        description: 'Core switch lost redundant power feed'
      }, 'hospital');

      const stateAfter = OrganizationalDataHub.getState('hospital');
      expect(stateAfter.incidents.length).toBe(initialIncidents + 1);
      
      const newIncident = stateAfter.incidents[0];
      expect(newIncident.title).toBe('Network Switch Failover Alert');
      expect(newIncident.severity).toBe('Critical');
    });
  });

  describe('KPI Engine (No Hardcoded Numbers)', () => {
    it('calculates weighted Organization Health Score across operational pillars', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const allKPIs = KPIEngine.calculateAll({
        organizationId: state.organizationId,
        departments: state.departments,
        employees: state.employees,
        projects: state.projects,
        assets: state.assets,
        risks: state.risks,
        incidents: state.incidents,
        audits: state.audits,
        complianceControls: state.complianceControls,
        financeRecords: state.financeRecords,
        customerFeedback: state.customerFeedback
      });

      expect(allKPIs.health.overallScore).toBeGreaterThanOrEqual(0);
      expect(allKPIs.health.overallScore).toBeLessThanOrEqual(100);
      expect(['Optimal', 'Nominal', 'Needs Attention', 'Elevated Risk', 'Critical']).toContain(allKPIs.health.status);
      expect(allKPIs.health.componentScores).toHaveProperty('riskScore');
      expect(allKPIs.health.componentScores).toHaveProperty('complianceScore');
      expect(allKPIs.health.componentScores).toHaveProperty('financeScore');
      expect(allKPIs.health.componentScores).toHaveProperty('operationsScore');
    });

    it('dynamically computes Risk KPIs including open counts and systemic averages', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const riskKPIs = state.kpis.risk;

      expect(riskKPIs.totalOpenRisks).toBeGreaterThan(0);
      expect(riskKPIs.systemicRiskIndex).toBeGreaterThan(0);
      expect(['escalating', 'stable', 'declining']).toContain(riskKPIs.riskTrend);
    });

    it('dynamically computes Compliance KPIs and assigns an audit readiness grade', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const compKPIs = state.kpis.compliance;

      expect(compKPIs.overallCompliancePct).toBeGreaterThanOrEqual(0);
      expect(compKPIs.overallCompliancePct).toBeLessThanOrEqual(100);
      expect(['A+', 'A', 'B', 'C', 'Non-Compliant']).toContain(compKPIs.auditReadinessGrade);
    });
  });

  describe('Business Rules Engine', () => {
    it('evaluates automated business rules against organizational state', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const result = BusinessRulesEngine.evaluate(state);

      expect(result.evaluationResults.length).toBeGreaterThan(0);
      expect(result.newNotifications).toBeInstanceOf(Array);
      expect(typeof result.impactedRiskIndexDelta).toBe('number');
      expect(typeof result.impactedHealthScoreDelta).toBe('number');
    });

    it('escalates project risk if Project Delay > 30% AND Budget Variance > 15%', () => {
      const state = OrganizationalDataHub.getState('hospital');
      
      // Inject delayed and over-budget project
      state.projects.push({
        id: 'proj-escalate-test',
        name: 'Infrastructure Overhaul',
        department: 'Emergency & Trauma',
        organizationId: 'hospital',
        leadName: 'Test Manager',
        status: 'delayed',
        completionPct: 40,
        budget: 100000,
        spent: 125000,
        budgetVariancePct: 25, // > 15%
        scheduleVariancePct: 35, // > 30%
        delayDays: 21, // > 14 days
        deadline: '2026-06-01',
        milestonesTotal: 10,
        milestonesCompleted: 4
      });

      const result = BusinessRulesEngine.evaluate(state);
      const projRule = result.evaluationResults.find(r => r.ruleId === 'RULE-PROJ-01');
      expect(projRule).toBeDefined();
      expect(projRule?.triggered).toBe(true);
      expect(result.newNotifications.some(n => n.ruleId === 'RULE-PROJ-01')).toBe(true);
    });
  });

  describe('Analytics Engine (Every Chart Answers a Business Question)', () => {
    it('answers the 6 core executive business questions with explainable drivers', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const analytics = AnalyticsEngine.analyze(state);

      expect(analytics.topQuestions.length).toBe(6);

      const q1 = analytics.topQuestions.find(q => q.category === 'risk');
      expect(q1).toBeDefined();
      expect(q1?.question).toBeDefined();
      expect(q1?.shortAnswer).toBeDefined();
      expect(q1?.primaryDrivers.length).toBeGreaterThan(0);
      expect(q1?.recommendedAction).toBeDefined();

      const q2 = analytics.topQuestions.find(q => q.category === 'incident');
      expect(q2).toBeDefined();
      expect(q2?.question).toBeDefined();
      expect(q2?.primaryDrivers.length).toBeGreaterThan(0);
    });

    it('computes multidimensional department comparisons from real entities', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const analytics = AnalyticsEngine.analyze(state);

      expect(analytics.departmentComparisons.length).toBe(state.departments.length);
      for (const comp of analytics.departmentComparisons) {
        expect(comp.department).toBeDefined();
        expect(comp.riskScore).toBeGreaterThanOrEqual(0);
        expect(comp.compliancePct).toBeGreaterThanOrEqual(0);
        expect(comp.healthScore).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('Prediction Engine (Historical Regression & Projections)', () => {
    it('performs historical sequence regression forecasting next month incidents', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const predictions = PredictionEngine.forecast(state);

      expect(predictions.incidentForecast.historical.length).toBe(3);
      expect(predictions.incidentForecast.projectionNextMonth).toBeGreaterThan(0);
      expect(predictions.incidentForecast.confidenceLevelPct).toBeGreaterThan(0);
      expect(predictions.incidentForecast.riskTrajectory.length).toBeGreaterThan(0);
      expect(predictions.incidentForecast.riskTrajectory[0]).toHaveProperty('projectedValue');
      expect(predictions.incidentForecast.riskTrajectory[0]).toHaveProperty('upperConfidenceBand');
      expect(predictions.incidentForecast.riskTrajectory[0]).toHaveProperty('lowerConfidenceBand');
    });

    it('forecasts quarterly revenue, expense, and profit margin trends', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const predictions = PredictionEngine.forecast(state);

      expect(typeof predictions.financialForecast.projectedNextQuarterProfit).toBe('number');
      expect(typeof predictions.financialForecast.revenueGrowthForecastPct).toBe('number');
      expect(predictions.financialForecast.explanation).toBeDefined();
    });

    it('forecasts delivery schedule delay risk and staffing shortage burnout index', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const predictions = PredictionEngine.forecast(state);

      expect(predictions.deliveryRiskForecast.overallDelayRiskPct).toBeGreaterThanOrEqual(0);
      expect(predictions.deliveryRiskForecast.overallDelayRiskPct).toBeLessThanOrEqual(100);
      expect(predictions.staffingShortageForecast.burnoutProbabilityPct).toBeGreaterThanOrEqual(0);
      expect(predictions.staffingShortageForecast.projectedAttritionNextQuarter).toBeGreaterThanOrEqual(0);
    });
  });

  describe('AI Intelligence & Live Context Integration', () => {
    it('constructs a live organizational context prompt for AI inference', () => {
      const state = OrganizationalDataHub.getState('hospital');
      const prompt = buildLiveOrganizationalContextPrompt(state);

      expect(prompt).toContain('Healthcare');
      expect(prompt).toContain('Unified Organization Health Score');
      expect(prompt).toContain('ACTIVE CRITICAL RISKS');
      expect(prompt).toContain('PREDICTIVE ENGINE FORECASTS');
    });

    it('synthesizes accurate data-driven fallback responses to executive questions', () => {
      const state = OrganizationalDataHub.getState('hospital');

      const deptReply = generateHeuristicOrganizationalResponse('Show departments with highest operational risk', state);
      expect(deptReply.text).toContain('highest operational risk profile');
      expect(deptReply.text).toContain('Healthcare & Hospital System');

      const compReply = generateHeuristicOrganizationalResponse('Why did compliance decrease?', state);
      expect(compReply.text).toContain('compliance');

      const summaryReply = generateHeuristicOrganizationalResponse('What is our current incident status?', state);
      expect(summaryReply.text).toContain('Incident');
    });
  });
});
