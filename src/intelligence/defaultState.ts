/**
 * ORBIS Enterprise Organizational Intelligence Platform - Seed Data Generator
 * 
 * Generates rich, authentic, interconnected domain entities for each of the 
 * 7 flagship enterprise organizations, ensuring every department, risk, 
 * incident, project, asset, and compliance control is fully populated.
 */

import { ORGANIZATIONS } from '../config/platformConfig';
import type {
  UnifiedOrganizationalState,
  DepartmentEntity,
  EmployeeEntity,
  ProjectEntity,
  AssetEntity,
  RiskEntity,
  IncidentEntity,
  AuditEntity,
  ComplianceControlEntity,
  FinanceRecordEntity,
  CustomerFeedbackEntity,
  OrganizationalTaskEntity,
  OrganizationalNotificationEntity,
  OrganizationalEvent
} from './types';
import { KPIEngine } from './KPIEngine';
import { AnalyticsEngine } from './AnalyticsEngine';
import { PredictionEngine } from './PredictionEngine';

export function createInitialOrganizationalState(orgId: string): UnifiedOrganizationalState {
  const currentOrg = ORGANIZATIONS[orgId] || ORGANIZATIONS.hospital;
  const deptNames = currentOrg.departments || ['Operations', 'Quality', 'Compliance', 'Administration'];

  // 1. Departments
  const departments: DepartmentEntity[] = deptNames.map((name, idx) => ({
    id: `dept-${orgId}-${idx + 1}`,
    name,
    organizationId: orgId,
    headName: `Director ${name.split(' ')[0]}`,
    headEmail: `lead.${name.toLowerCase().replace(/[^a-z]/g, '')}@${orgId}.orbis.ai`,
    headRole: 'Department Head',
    employeeCount: 45 + ((idx * 23) % 85),
    budgetAllocated: 2500000 + (idx * 650000),
    budgetSpent: 1980000 + (idx * 520000),
    operationalHealth: Math.max(65, 96 - (idx * 6)),
    riskIndex: Math.min(48, 12 + (idx * 7))
  }));

  // 2. Employees
  const employees: EmployeeEntity[] = [
    {
      id: `emp-1`,
      name: 'Dr. Sarah Lin',
      email: `sarah.lin@${orgId}.orbis.ai`,
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      role: 'Chief Operational Lead',
      status: 'active',
      attendanceRate: 98,
      trainingCompleted: 100,
      performanceRating: 4.8,
      joinedDate: '2023-04-12'
    },
    {
      id: `emp-2`,
      name: 'Marcus Vance',
      email: `marcus.vance@${orgId}.orbis.ai`,
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      role: 'Senior Risk Engineer',
      status: 'active',
      attendanceRate: 96,
      trainingCompleted: 95,
      performanceRating: 4.6,
      joinedDate: '2024-01-15'
    },
    {
      id: `emp-3`,
      name: 'Elena Rostova',
      email: `elena.rostova@${orgId}.orbis.ai`,
      department: deptNames[2] || deptNames[0],
      organizationId: orgId,
      role: 'Compliance Specialist',
      status: 'active',
      attendanceRate: 99,
      trainingCompleted: 98,
      performanceRating: 4.9,
      joinedDate: '2023-09-01'
    },
    {
      id: `emp-4`,
      name: 'Tariq Al-Mansoor',
      email: `tariq.mansoor@${orgId}.orbis.ai`,
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      role: 'Senior Systems Architect',
      status: 'resigned',
      attendanceRate: 91,
      trainingCompleted: 85,
      performanceRating: 4.2,
      joinedDate: '2022-03-10',
      resignedDate: '2026-02-14'
    },
    {
      id: `emp-5`,
      name: 'Chloe Tremblay',
      email: `chloe.tremblay@${orgId}.orbis.ai`,
      department: deptNames[3] || deptNames[0],
      organizationId: orgId,
      role: 'Operations Coordinator',
      status: 'active',
      attendanceRate: 97,
      trainingCompleted: 92,
      performanceRating: 4.5,
      joinedDate: '2024-06-20'
    }
  ];

  // 3. Projects
  const projects: ProjectEntity[] = [
    {
      id: `PRJ-${orgId}-01`,
      name: 'Autonomous SCADA & Telemetry Ingestion Modernization',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      leadName: 'Dr. Sarah Lin',
      budget: 1850000,
      spent: 1420000,
      status: 'on_track',
      completionPct: 78,
      delayDays: 0,
      scheduleVariancePct: 0,
      budgetVariancePct: -4.2,
      deadline: '2026-11-30',
      milestonesTotal: 10,
      milestonesCompleted: 8
    },
    {
      id: `PRJ-${orgId}-02`,
      name: 'Zero-Trust Role & Cryptographic Evidence Ledger Upgrade',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      leadName: 'Marcus Vance',
      budget: 1200000,
      spent: 1440000,
      status: 'delayed',
      completionPct: 62,
      delayDays: 18,
      scheduleVariancePct: 32,
      budgetVariancePct: 20.0,
      deadline: '2026-10-15',
      milestonesTotal: 8,
      milestonesCompleted: 5
    },
    {
      id: `PRJ-${orgId}-03`,
      name: 'Global Statutory Governance Matrix Harmonization',
      department: deptNames[2] || deptNames[0],
      organizationId: orgId,
      leadName: 'Elena Rostova',
      budget: 750000,
      spent: 690000,
      status: 'on_track',
      completionPct: 91,
      delayDays: 0,
      scheduleVariancePct: 0,
      budgetVariancePct: -8.0,
      deadline: '2026-12-15',
      milestonesTotal: 6,
      milestonesCompleted: 5
    }
  ];

  // 4. Assets
  const assets: AssetEntity[] = [
    {
      id: `AST-${orgId}-01`,
      name: `${currentOrg.name} Primary Telemetry Cluster`,
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      type: 'server_cluster',
      status: 'operational',
      mtbfHours: 1420,
      downtimeHoursTotal: 3.4,
      efficiencyPct: 98.4,
      lastMaintained: '2026-09-28',
      telemetryAnomalyScore: 12
    },
    {
      id: `AST-${orgId}-02`,
      name: 'Auxiliary Sensor Mesh Gateway Node 4',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      type: 'scada_node',
      status: 'degraded',
      mtbfHours: 890,
      downtimeHoursTotal: 14.8,
      efficiencyPct: 88.2,
      lastMaintained: '2026-08-15',
      telemetryAnomalyScore: 74
    },
    {
      id: `AST-${orgId}-03`,
      name: 'Enterprise Cold Storage & Cryptographic HSM Vault',
      department: deptNames[2] || deptNames[0],
      organizationId: orgId,
      type: 'database',
      status: 'operational',
      mtbfHours: 4800,
      downtimeHoursTotal: 0.2,
      efficiencyPct: 99.9,
      lastMaintained: '2026-10-02',
      telemetryAnomalyScore: 4
    }
  ];

  // 5. Risks
  const risks: RiskEntity[] = [
    {
      id: 'RSK-104',
      title: 'High-Frequency Telemetry Ingress Volatility Spike',
      department: deptNames[0] || 'Core Operations',
      organizationId: orgId,
      category: 'Operational / Cyber',
      probability: 4,
      impact: 4,
      velocity: 4,
      score: 16,
      severity: 'Critical',
      owner: 'Lead Risk Analyst',
      status: 'active_mitigation',
      mitigation: 'Implement dynamic buffer queues and isolate secondary ingress clusters.',
      lastReviewed: 'Today, 09:30 AM',
      relatedIncidentIds: ['INC-2026-084']
    },
    {
      id: 'RSK-108',
      title: 'Regulatory Audit Compliance Gap on Policy v4',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      category: 'Regulatory / Legal',
      probability: 2,
      impact: 5,
      velocity: 2,
      score: 10,
      severity: 'High',
      owner: 'Chief Compliance Officer',
      status: 'under_review',
      mitigation: 'Automate weekly evidence collection pipelines across all operational nodes.',
      lastReviewed: 'Yesterday',
      relatedIncidentIds: []
    },
    {
      id: 'RSK-112',
      title: 'Third-Party Vendor API Latency Degradation',
      department: deptNames[2] || deptNames[0],
      organizationId: orgId,
      category: 'Vendor / Supply',
      probability: 3,
      impact: 3,
      velocity: 3,
      score: 9,
      severity: 'Medium',
      owner: 'Infrastructure Lead',
      status: 'open',
      mitigation: 'Failover route activated across multi-region standby endpoints.',
      lastReviewed: '2 days ago',
      relatedIncidentIds: ['INC-2026-081']
    },
    {
      id: 'RSK-119',
      title: 'Operator Fatigue Variance in Shift Rotation',
      department: deptNames[3] || deptNames[0],
      organizationId: orgId,
      category: 'Human Factors',
      probability: 3,
      impact: 2,
      velocity: 2,
      score: 6,
      severity: 'Low',
      owner: 'HR Operations Lead',
      status: 'open',
      mitigation: 'Introduce automated shift pacing and mandatory rest intervals.',
      lastReviewed: '4 days ago',
      relatedIncidentIds: []
    }
  ];

  // 6. Incidents
  const incidents: IncidentEntity[] = [
    {
      id: 'INC-2026-084',
      title: 'Telemetry Node Drift on Cluster 4',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      severity: 'High',
      reporter: 'Automated Neural Sentry',
      reportedAt: '12 mins ago',
      status: 'Under Investigation',
      rootCause: 'Transient network bottleneck causing sensor sample packet loss.',
      evidenceCount: 3,
      evidenceUrls: [],
      relatedRiskId: 'RSK-104',
      resolutionTimeHours: 1.2
    },
    {
      id: 'INC-2026-081',
      title: 'Near Miss: Unplanned Secondary Route Congestion',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      severity: 'Medium',
      reporter: 'Shift Supervisor',
      reportedAt: '3 hours ago',
      status: 'Mitigated',
      rootCause: 'Concurrent batch sync task scheduled during peak operational load.',
      evidenceCount: 1,
      evidenceUrls: [],
      relatedRiskId: 'RSK-112',
      resolutionTimeHours: 4.5
    },
    {
      id: 'INC-2026-079',
      title: 'Scheduled Maintenance Voltage Variance',
      department: deptNames[2] || deptNames[0],
      organizationId: orgId,
      severity: 'Low',
      reporter: 'Field Technician',
      reportedAt: 'Yesterday',
      status: 'Resolved',
      rootCause: 'Capacitor bank switchover latency stabilized.',
      evidenceCount: 2,
      evidenceUrls: [],
      resolutionTimeHours: 2.0
    }
  ];

  // 7. Audits
  const audits: AuditEntity[] = [
    {
      id: `AUD-${orgId}-01`,
      title: 'Annual Institutional GRC Comprehensive Audit',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      standard: 'ISO 31000 / NIST CSF 2.0',
      status: 'In Progress',
      findingsCount: 3,
      openObservations: 1,
      closureRatePct: 84,
      auditLead: 'External Sovereign Auditor',
      dueDate: '2026-11-15'
    },
    {
      id: `AUD-${orgId}-02`,
      title: 'Zero-Trust Cryptographic Access & HSM Review',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      standard: 'SOC 2 Type II',
      status: 'Closed',
      findingsCount: 0,
      openObservations: 0,
      closureRatePct: 100,
      auditLead: 'Chief Information Security Officer',
      dueDate: '2026-09-30'
    }
  ];

  // 8. Compliance Controls
  const complianceControls: ComplianceControlEntity[] = [
    {
      id: 'CTRL-01',
      title: 'Zero-Trust Access & Key Rotation Protocol',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      standard: 'SOC2 Type II / ISO 27001',
      status: 'compliant',
      adherencePct: 100,
      lastAssessed: 'Today',
      automatedVerification: true
    },
    {
      id: 'CTRL-02',
      title: 'Automated AI Model Bias & Fairness Guardrail',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      standard: 'EU AI Act / NIST AI RMF',
      status: 'compliant',
      adherencePct: 98.4,
      lastAssessed: 'Yesterday',
      automatedVerification: true
    },
    {
      id: 'CTRL-03',
      title: 'Incident Notification SLA (Under 60 Mins)',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      standard: 'Statutory / Board Policy',
      status: 'compliant',
      adherencePct: 100,
      lastAssessed: 'Today',
      automatedVerification: true
    },
    {
      id: 'CTRL-04',
      title: 'Continuous Evidence Hash Immutability',
      department: deptNames[2] || deptNames[0],
      organizationId: orgId,
      standard: 'Blockchain / Cryptographic Log',
      status: 'compliant',
      adherencePct: 100,
      lastAssessed: '2 days ago',
      automatedVerification: true
    },
    {
      id: 'CTRL-05',
      title: 'Auxiliary Data Encryption at Rest & In-Flight',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      standard: 'FIPS 140-3 Level 4',
      status: 'warning',
      adherencePct: 91.2,
      lastAssessed: '3 days ago',
      automatedVerification: false
    }
  ];

  // 9. Finance Records
  const financeRecords: FinanceRecordEntity[] = [
    {
      id: 'FIN-2026-M1',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      month: 'August 2026',
      revenue: 4800000,
      expenses: 3950000,
      budgetAllocated: 4100000,
      variance: -3.6
    },
    {
      id: 'FIN-2026-M2',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      month: 'September 2026',
      revenue: 5120000,
      expenses: 4210000,
      budgetAllocated: 4250000,
      variance: -0.9
    },
    {
      id: 'FIN-2026-M3',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      month: 'October 2026 (MTD)',
      revenue: 5450000,
      expenses: 4380000,
      budgetAllocated: 4400000,
      variance: -0.5
    }
  ];

  // 10. Customer / Stakeholder Feedback
  const customerFeedback: CustomerFeedbackEntity[] = [
    {
      id: 'FB-01',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      type: 'satisfaction_survey',
      satisfactionScore: 4.8,
      responseTimeHours: 0.8,
      status: 'resolved',
      subject: 'Rapid response on telemetry query',
      receivedAt: 'Today'
    },
    {
      id: 'FB-02',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      type: 'complaint',
      satisfactionScore: 3.2,
      responseTimeHours: 2.4,
      status: 'resolved',
      subject: 'Intermittent dashboard sync latency',
      receivedAt: 'Yesterday'
    }
  ];

  // 11. Tasks
  const tasks: OrganizationalTaskEntity[] = [
    {
      id: 'TSK-01',
      title: 'Review Buffer Queue Sizing on Telemetry Ingress',
      department: deptNames[0] || 'Core',
      organizationId: orgId,
      assignedTo: 'Marcus Vance',
      priority: 'high',
      status: 'in_progress',
      dueDate: 'Tomorrow',
      category: 'mitigation'
    },
    {
      id: 'TSK-02',
      title: 'Complete Annual SOC 2 Evidence Packet Signing',
      department: deptNames[1] || deptNames[0],
      organizationId: orgId,
      assignedTo: 'Elena Rostova',
      priority: 'medium',
      status: 'todo',
      dueDate: 'Friday',
      category: 'compliance'
    }
  ];

  // 12. Initial Event Stream
  const events: OrganizationalEvent[] = [
    {
      id: `EVT-${Date.now() - 3600000}`,
      eventType: 'INCIDENT_LOGGED',
      organization: orgId,
      department: deptNames[0] || 'Core',
      timestamp: '12 mins ago',
      user: { name: 'Automated Neural Sentry', role: 'Telemetry Monitor' },
      category: 'incident',
      priority: 'high',
      title: 'Incident INC-2026-084 Logged',
      description: 'Telemetry Node Drift on Cluster 4 identified and isolated.',
      relatedObjects: { incidentId: 'INC-2026-084', riskId: 'RSK-104' }
    },
    {
      id: `EVT-${Date.now() - 7200000}`,
      eventType: 'RISK_MITIGATION_APPLIED',
      organization: orgId,
      department: deptNames[0] || 'Core',
      timestamp: '2 hours ago',
      user: { name: 'Lead Risk Analyst', role: 'Risk Officer' },
      category: 'risk',
      priority: 'medium',
      title: 'Mitigation Work Order Assigned to RSK-104',
      description: 'Dynamic buffer queues activated on secondary ingress clusters.',
      relatedObjects: { riskId: 'RSK-104' }
    },
    {
      id: `EVT-${Date.now() - 86400000}`,
      eventType: 'AUDIT_CLOSED',
      organization: orgId,
      department: deptNames[1] || deptNames[0],
      timestamp: 'Yesterday',
      user: { name: 'Chief Information Security Officer', role: 'Auditor' },
      category: 'audit',
      priority: 'low',
      title: 'Audit AUD-02 Closed Successfully',
      description: 'Zero-Trust Cryptographic Access & HSM Review verified 100% compliant.',
      relatedObjects: { auditId: `AUD-${orgId}-02` }
    }
  ];

  // 13. Notifications
  const notifications: OrganizationalNotificationEntity[] = [
    {
      id: 'NOTIF-1',
      title: 'Autonomous Mitigation Triggered',
      desc: 'Load rebalanced on primary telemetry pipelines following INC-2026-084.',
      time: '12 mins ago',
      type: 'success',
      priority: 'medium',
      department: deptNames[0],
      read: false,
      timestamp: Date.now() - 720000
    },
    {
      id: 'NOTIF-2',
      title: 'Near Miss Incident Logged',
      desc: 'Supervisor filed incident report INC-2026-081 for secondary route congestion.',
      time: '3 hours ago',
      type: 'warning',
      priority: 'medium',
      department: deptNames[1],
      read: false,
      timestamp: Date.now() - 10800000
    },
    {
      id: 'NOTIF-3',
      title: 'Weekly Regulatory Audit Passed',
      desc: '100% adherence confirmed across all active SOC2 / HIPAA control evidence.',
      time: 'Yesterday',
      type: 'info',
      priority: 'low',
      department: deptNames[2],
      read: true,
      timestamp: Date.now() - 86400000
    }
  ];

  // Compile initial KPIs, Analytics, and Predictions using the Engines
  const initialData = {
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
  };

  const kpis = KPIEngine.calculateAll(initialData);

  const baseState: UnifiedOrganizationalState = {
    organizationId: orgId,
    organizationName: currentOrg.name,
    sector: currentOrg.sector,
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
    events,
    kpis,
    analytics: null as any,
    predictions: null as any,
    activeRuleTriggers: []
  };

  baseState.analytics = AnalyticsEngine.analyze(baseState);
  baseState.predictions = PredictionEngine.forecast(baseState);

  return baseState;
}
