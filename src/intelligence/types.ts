/**
 * ORBIS Enterprise Organizational Intelligence Platform - Unified Data Model
 * 
 * Core principle: The Organization is the single source of truth.
 * All modules produce and consume standardized organizational events and intelligence.
 */

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type EntityStatus = 'active' | 'in_progress' | 'mitigated' | 'resolved' | 'closed' | 'delayed' | 'critical' | 'completed' | 'compliant' | 'non_compliant' | 'warning' | 'overdue';

// ==========================================
// 1. STANDARDIZED ORGANIZATIONAL EVENT MODEL
// ==========================================

export type OrganizationalEventType =
  // Risk Events
  | 'RISK_CREATED'
  | 'RISK_SCORE_UPDATED'
  | 'RISK_MITIGATION_APPLIED'
  | 'RISK_OWNERSHIP_CHANGED'
  | 'RISK_CLOSED'
  // Incident Events
  | 'INCIDENT_LOGGED'
  | 'INCIDENT_SEVERITY_CHANGED'
  | 'INCIDENT_INVESTIGATION_UPDATED'
  | 'INCIDENT_RESOLVED'
  // Compliance & Audit Events
  | 'COMPLIANCE_STATUS_CHANGED'
  | 'CONTROL_EFFECTIVENESS_UPDATED'
  | 'COMPLIANCE_VIOLATION_FLAGGED'
  | 'AUDIT_SCHEDULED'
  | 'AUDIT_FINDING_RECORDED'
  | 'AUDIT_CLOSED'
  // Project Events
  | 'PROJECT_CREATED'
  | 'PROJECT_MILESTONE_COMPLETED'
  | 'PROJECT_DELAY_RECORDED'
  | 'PROJECT_BUDGET_ADJUSTED'
  | 'PROJECT_STATUS_CHANGED'
  // Finance Events
  | 'REVENUE_UPDATED'
  | 'EXPENSES_RECORDED'
  | 'BUDGET_INCREASED'
  | 'BUDGET_VARIANCE_FLAGGED'
  // HR Events
  | 'EMPLOYEE_JOINED'
  | 'EMPLOYEE_RESIGNED'
  | 'ATTENDANCE_LOGGED'
  | 'TRAINING_COMPLETED'
  | 'PERFORMANCE_REVIEWED'
  // Operations & Asset Events
  | 'MACHINE_FAILURE'
  | 'ASSET_MAINTENANCE_LOGGED'
  | 'ASSET_ADDED'
  | 'TELEMETRY_ANOMALY_RECORDED'
  // Customer & Policy Events
  | 'CUSTOMER_COMPLAINT'
  | 'POLICY_APPROVED'
  | 'ACTION_TASK_ASSIGNED'
  | 'ACTION_TASK_COMPLETED';

export interface OrganizationalEvent {
  id: string;
  eventType: OrganizationalEventType;
  organization: string; // organization ID (e.g. 'hospital', 'manufacturing')
  department: string; // department name
  timestamp: string; // ISO 8601 or formatted time
  user: {
    id?: string;
    name: string;
    role?: string;
  };
  category: 'risk' | 'incident' | 'compliance' | 'finance' | 'hr' | 'operations' | 'project' | 'audit' | 'customer' | 'governance';
  priority: PriorityLevel;
  title: string;
  description: string;
  relatedObjects?: {
    riskId?: string;
    incidentId?: string;
    projectId?: string;
    employeeId?: string;
    assetId?: string;
    controlId?: string;
    auditId?: string;
    taskId?: string;
  };
  metadata?: Record<string, any>;
}

// ==========================================
// 2. DOMAIN ENTITY MODELS
// ==========================================

export interface DepartmentEntity {
  id: string;
  name: string;
  organizationId: string;
  headName: string;
  headEmail: string;
  headRole: string;
  employeeCount: number;
  budgetAllocated: number; // in USD
  budgetSpent: number;
  operationalHealth: number; // 0 - 100
  riskIndex: number; // 0 - 100
}

export interface EmployeeEntity {
  id: string;
  name: string;
  email: string;
  department: string;
  organizationId: string;
  role: string;
  status: 'active' | 'resigned' | 'on_leave';
  attendanceRate: number; // 0 - 100%
  trainingCompleted: number; // 0 - 100%
  performanceRating: number; // 1 - 5
  joinedDate: string;
  resignedDate?: string;
}

export interface ProjectEntity {
  id: string;
  name: string;
  department: string;
  organizationId: string;
  leadName: string;
  budget: number;
  spent: number;
  status: 'on_track' | 'delayed' | 'critical' | 'completed';
  completionPct: number; // 0 - 100%
  delayDays: number;
  scheduleVariancePct: number; // e.g. +35%
  budgetVariancePct: number; // e.g. +18%
  deadline: string;
  milestonesTotal: number;
  milestonesCompleted: number;
}

export interface AssetEntity {
  id: string;
  name: string;
  department: string;
  organizationId: string;
  type: 'industrial_robot' | 'server_cluster' | 'medical_device' | 'scada_node' | 'facility' | 'database';
  status: 'operational' | 'degraded' | 'maintenance' | 'offline';
  mtbfHours: number; // Mean Time Between Failures
  downtimeHoursTotal: number;
  efficiencyPct: number;
  lastMaintained: string;
  telemetryAnomalyScore: number; // 0 - 100
}

export interface RiskEntity {
  id: string;
  title: string;
  department: string;
  organizationId: string;
  category: string;
  probability: number; // 1 - 5
  impact: number; // 1 - 5
  velocity: number; // 1 - 5
  score: number; // probability * impact
  severity: RiskSeverity;
  owner: string;
  status: 'open' | 'active_mitigation' | 'under_review' | 'closed';
  mitigation: string;
  lastReviewed: string;
  relatedIncidentIds: string[];
}

export interface IncidentEntity {
  id: string;
  title: string;
  department: string;
  organizationId: string;
  severity: RiskSeverity;
  reporter: string;
  reportedAt: string;
  status: 'Under Investigation' | 'Mitigated' | 'Resolved';
  rootCause: string;
  evidenceCount: number;
  evidenceUrls: string[];
  relatedRiskId?: string;
  resolutionTimeHours?: number;
}

export interface AuditEntity {
  id: string;
  title: string;
  department: string;
  organizationId: string;
  standard: string;
  status: 'Scheduled' | 'In Progress' | 'Observations Pending' | 'Closed';
  findingsCount: number;
  openObservations: number;
  closureRatePct: number;
  auditLead: string;
  dueDate: string;
}

export interface ComplianceControlEntity {
  id: string;
  title: string;
  department: string;
  organizationId: string;
  standard: string;
  status: 'compliant' | 'warning' | 'non_compliant' | 'overdue';
  adherencePct: number;
  lastAssessed: string;
  automatedVerification: boolean;
}

export interface FinanceRecordEntity {
  id: string;
  department: string;
  organizationId: string;
  month: string;
  revenue: number;
  expenses: number;
  budgetAllocated: number;
  variance: number;
}

export interface CustomerFeedbackEntity {
  id: string;
  department: string;
  organizationId: string;
  type: 'complaint' | 'satisfaction_survey' | 'inquiry';
  satisfactionScore: number; // 1 - 5
  responseTimeHours: number;
  status: 'resolved' | 'pending';
  subject: string;
  receivedAt: string;
}

export interface OrganizationalTaskEntity {
  id: string;
  title: string;
  department: string;
  organizationId: string;
  assignedTo: string;
  priority: PriorityLevel;
  status: 'todo' | 'in_progress' | 'completed' | 'overdue';
  dueDate: string;
  category: 'mitigation' | 'audit' | 'compliance' | 'incident' | 'maintenance';
}

export interface OrganizationalNotificationEntity {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  priority: PriorityLevel;
  department?: string;
  read: boolean;
  triggerRule?: string;
  timestamp: number;
}

// ==========================================
// 3. KPI ENGINE OUTPUTS
// ==========================================

export interface HRKPIs {
  employeeTurnoverPct: number;
  retentionRatePct: number;
  averageAttendancePct: number;
  trainingCompletionPct: number;
  totalActiveEmployees: number;
  recentResignationsCount: number;
}

export interface FinanceKPIs {
  totalRevenue: number;
  totalExpenses: number;
  profitMarginPct: number;
  budgetUtilizationPct: number;
  budgetVariancePct: number;
  cashFlowCondition: 'Optimal' | 'Surplus' | 'Constrained' | 'Deficit';
}

export interface ProjectKPIs {
  averageCompletionPct: number;
  delayRatePct: number;
  averageScheduleVarianceDays: number;
  averageBudgetVariancePct: number;
  totalActiveProjects: number;
  delayedProjectsCount: number;
}

export interface RiskKPIs {
  totalOpenRisks: number;
  criticalRisksCount: number;
  highRisksCount: number;
  averageRiskScore: number;
  mitigationProgressPct: number;
  systemicRiskIndex: number; // 0 - 100
  riskTrend: 'escalating' | 'stable' | 'declining';
}

export interface ComplianceKPIs {
  overallCompliancePct: number;
  overdueControlsCount: number;
  activeViolationsCount: number;
  auditClosureRatePct: number;
  totalControlsMonitored: number;
  auditReadinessGrade: 'A+' | 'A' | 'B' | 'C' | 'Non-Compliant';
}

export interface OperationsKPIs {
  totalDowntimeHours: number;
  operationalEfficiencyPct: number;
  averageMTBFHours: number;
  incidentFrequencyPerWeek: number;
  criticalIncidentCount: number;
}

export interface CustomerKPIs {
  complaintRatePct: number;
  satisfactionScorePct: number; // 0 - 100
  averageResponseTimeHours: number;
  unresolvedComplaintsCount: number;
}

export interface OrganizationHealthCalculation {
  overallScore: number; // 0 - 100
  status: 'Nominal' | 'Optimal' | 'Needs Attention' | 'Elevated Risk' | 'Critical';
  statusColor: string;
  confidencePct: number;
  weights: {
    riskWeight: number; // e.g. 25%
    complianceWeight: number; // 20%
    operationsWeight: number; // 20%
    projectsWeight: number; // 15%
    financeWeight: number; // 10%
    hrWeight: number; // 10%
  };
  componentScores: {
    riskScore: number;
    complianceScore: number;
    operationsScore: number;
    projectsScore: number;
    financeScore: number;
    hrScore: number;
  };
  summary: string;
}

export interface CalculatedOrganizationalKPIs {
  organizationId: string;
  timestamp: string;
  health: OrganizationHealthCalculation;
  risk: RiskKPIs;
  compliance: ComplianceKPIs;
  operations: OperationsKPIs;
  projects: ProjectKPIs;
  finance: FinanceKPIs;
  hr: HRKPIs;
  customer: CustomerKPIs;
}

// ==========================================
// 4. BUSINESS RULES ENGINE DEFINITIONS
// ==========================================

export interface BusinessRuleDefinition {
  id: string;
  name: string;
  description: string;
  conditionDescription: string;
  severity: PriorityLevel;
  isActive: boolean;
  evaluate: (state: UnifiedOrganizationalState, event?: OrganizationalEvent) => RuleEvaluationResult | null;
}

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  message: string;
  impacts: {
    riskIndexDelta?: number;
    healthScoreDelta?: number;
    escalateProjectIds?: string[];
    createAlert?: {
      title: string;
      desc: string;
      priority: PriorityLevel;
      type: 'alert' | 'warning' | 'info';
    };
    suggestedAction?: string;
  };
}

// ==========================================
// 5. ANALYTICS ENGINE OUTPUTS
// ==========================================

export interface BusinessQuestionAnswer {
  questionId: string;
  question: string;
  category: 'risk' | 'incident' | 'compliance' | 'finance' | 'projects' | 'departments';
  shortAnswer: string;
  detailedExplanation: string;
  keyMetric: string;
  metricChange: string;
  primaryDrivers: string[];
  recommendedAction: string;
}

export interface DepartmentComparisonVector {
  department: string;
  riskScore: number;
  incidentCount: number;
  compliancePct: number;
  budgetUtilizationPct: number;
  healthScore: number;
  trend: 'improving' | 'stable' | 'degrading';
}

export interface AnalyticsEngineOutputs {
  topQuestions: BusinessQuestionAnswer[];
  departmentComparisons: DepartmentComparisonVector[];
  fastestGrowingRisks: RiskEntity[];
  highestVarianceProjects: ProjectEntity[];
  repeatedComplianceFailures: ComplianceControlEntity[];
  incidentRootCauseDistribution: { cause: string; count: number; percentage: number }[];
}

// ==========================================
// 6. PREDICTION ENGINE OUTPUTS
// ==========================================

export interface HistoricalDataPoint {
  period: string; // e.g. 'Jan 2026', 'Feb 2026'
  incidents: number;
  riskScore: number;
  revenue: number;
  expenses: number;
  turnoverRate: number;
}

export interface ForecastTrajectoryPoint {
  period: string;
  projectedValue: number;
  lowerConfidenceBand: number;
  upperConfidenceBand: number;
  isProjected: boolean;
}

export interface PredictionEngineOutputs {
  incidentForecast: {
    historical: { month: string; count: number }[];
    projectionNextMonth: number;
    projectionQuarter: number;
    trendSlope: number;
    riskTrajectory: ForecastTrajectoryPoint[];
    confidenceLevelPct: number;
    explanation: string;
  };
  financialForecast: {
    projectedNextQuarterProfit: number;
    revenueGrowthForecastPct: number;
    burnRateWarning: boolean;
    explanation: string;
  };
  deliveryRiskForecast: {
    overallDelayRiskPct: number;
    atRiskProjectsCount: number;
    criticalPathWarning: string;
  };
  staffingShortageForecast: {
    burnoutProbabilityPct: number;
    projectedAttritionNextQuarter: number;
    impactedDepartments: string[];
  };
}

// ==========================================
// 7. UNIFIED CENTRAL STATE
// ==========================================

export interface UnifiedOrganizationalState {
  organizationId: string;
  organizationName: string;
  sector: string;
  lastUpdated: string;
  
  // Primary domain entity collections
  departments: DepartmentEntity[];
  employees: EmployeeEntity[];
  projects: ProjectEntity[];
  assets: AssetEntity[];
  risks: RiskEntity[];
  incidents: IncidentEntity[];
  audits: AuditEntity[];
  complianceControls: ComplianceControlEntity[];
  financeRecords: FinanceRecordEntity[];
  customerFeedback: CustomerFeedbackEntity[];
  tasks: OrganizationalTaskEntity[];
  notifications: OrganizationalNotificationEntity[];
  
  // Event stream (audit ledger of all activities)
  events: OrganizationalEvent[];
  
  // Computed intelligence layers
  kpis: CalculatedOrganizationalKPIs;
  analytics: AnalyticsEngineOutputs;
  predictions: PredictionEngineOutputs;
  activeRuleTriggers: RuleEvaluationResult[];
}
