import { 
  Activity, Landmark, GraduationCap, Briefcase, Building2, 
  ShieldCheck, ShieldAlert, Cpu, Stethoscope, HeartPulse,
  Wrench, Factory, Server, Terminal, Shield, Scale, 
  Truck, Zap, ShoppingBag, HardHat, FileSpreadsheet,
  AlertTriangle, Users, Layers, Award, FileText, CheckCircle2,
  TrendingUp, Clock, AlertOctagon, Lightbulb, UserCheck, Flame
} from 'lucide-react';

export interface OrgRole {
  id: string;
  title: string;
  iconName: string;
  accessLevel: 'Level 1 (Staff)' | 'Level 2 (Specialist)' | 'Level 3 (Manager)' | 'Level 4 (Executive)' | 'Level 5 (Super Admin)';
  levelNumber: number; // 1 to 5
  desc: string;
  roleCategory: 'executive' | 'operations' | 'risk' | 'compliance' | 'hr' | 'it' | 'employee';
  permissions: string[];
}

export interface IndustryModuleDef {
  id: string;
  name: string;
  iconName: string;
  description: string;
  kpi1: { label: string; value: string; change: string; positive: boolean };
  kpi2: { label: string; value: string; change: string; positive: boolean };
  kpi3: { label: string; value: string; change: string; positive: boolean };
  activeAlertsCount: number;
}

export interface OrganizationConfig {
  id: string;
  name: string;
  sector: string;
  iconName: string;
  themeColor: string;
  secondaryColor: string;
  accentColor: string;
  bgImage: string;
  description: string;
  statLabel: string;
  statValue: string;
  healthScore: number;
  aiRiskScore: number;
  roles: OrgRole[];
  industryModules: IndustryModuleDef[];
  departments: string[];
}

export const ORGANIZATIONS: Record<string, OrganizationConfig> = {
  hospital: {
    id: 'hospital',
    name: 'Healthcare & Hospital System',
    sector: 'Healthcare & Life Sciences',
    iconName: 'Activity',
    themeColor: '#0B6EFD',
    secondaryColor: '#3EC6FF',
    accentColor: '#00E0FF',
    bgImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop',
    description: 'Clinical risk surveillance, patient vitals predictive analytics, infection containment, and ICU resource optimization.',
    statLabel: 'Active Patients Monitored',
    statValue: '18,450+',
    healthScore: 94,
    aiRiskScore: 12.4,
    departments: ['Emergency', 'Cardiology', 'ICU', 'Oncology', 'Surgical Ops', 'Pediatrics', 'Pharmacy'],
    industryModules: [
      {
        id: 'patient-safety',
        name: 'Patient Safety & Clinical Risk',
        iconName: 'HeartPulse',
        description: 'Predictive vital deterioration, sepsis early detection & patient fall probability.',
        kpi1: { label: 'High Risk Vitals', value: '14 Patients', change: '-4 today', positive: true },
        kpi2: { label: 'Sepsis Prediction Acc.', value: '98.4%', change: '+1.2%', positive: true },
        kpi3: { label: 'Ward Saturation', value: '82.6%', change: '+3.1%', positive: false },
        activeAlertsCount: 3
      },
      {
        id: 'medication-risk',
        name: 'Medication & Pharmacy AI',
        iconName: 'ShieldAlert',
        description: 'Drug-drug interaction risk matrix, dosage anomaly detection and formulary compliance.',
        kpi1: { label: 'Dosage Flagged', value: '6 Prescriptions', change: '-12%', positive: true },
        kpi2: { label: 'Interaction Checks', value: '4,210', change: '+18%', positive: true },
        kpi3: { label: 'High Alert Stock', value: '99.8%', change: 'Stable', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'infection-control',
        name: 'Infection Control Surveillance',
        iconName: 'Activity',
        description: 'HAI outbreak cluster prediction, antimicrobial resistance tracking, and sanitization telemetry.',
        kpi1: { label: 'Outbreak Index', value: 'Low (0.04)', change: '-0.02', positive: true },
        kpi2: { label: 'Isolation Wards', value: '8 / 12 Free', change: '+2', positive: true },
        kpi3: { label: 'Biohazard Audits', value: '100% Compliant', change: '0 violations', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'equipment-monitoring',
        name: 'Medical Equipment & ICU Telemetry',
        iconName: 'Cpu',
        description: 'Ventilator uptime, MRI/CT diagnostic calibration reliability and predictive maintenance.',
        kpi1: { label: 'ICU Ventilators', value: '48/50 Active', change: '2 in service', positive: true },
        kpi2: { label: 'Device MTBF', value: '1,420 hrs', change: '+15%', positive: true },
        kpi3: { label: 'Calibration Due', value: '3 Units', change: 'Next 48h', positive: false },
        activeAlertsCount: 2
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Medical Officer (CMO / CEO)',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Global enterprise visibility, strategic clinical risks, mortality indicators, and board compliance.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Hospital Risk Manager',
        iconName: 'ShieldCheck',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Full access to clinical risk registers, root-cause analysis, malpractice exposure, and heatmaps.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'compliance-officer',
        title: 'Healthcare Compliance Officer',
        iconName: 'Scale',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'HIPAA, JCAHO, FDA safety protocols, clinical audit logs, and corrective action workflows.',
        roleCategory: 'compliance',
        permissions: ['compliance', 'reports', 'workflow', 'incidents', 'industry_modules']
      },
      {
        id: 'doctor',
        title: 'Attending Physician / Doctor',
        iconName: 'Stethoscope',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Access to patient predictive vitals, diagnostic AI models, clinical risk scoring, and care tasks.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'predictive', 'xai', 'workflow']
      },
      {
        id: 'nurse',
        title: 'Head Nurse / Clinical Lead',
        iconName: 'HeartPulse',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Real-time ward telemetry, bed occupancy, patient alerts, and incident logs.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      },
      {
        id: 'lab-technician',
        title: 'Laboratory Specialist',
        iconName: 'Activity',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Diagnostic calibration, specimen turnaround times, lab incident reports, and bio-safety.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents']
      },
      {
        id: 'pharmacist',
        title: 'Chief Clinical Pharmacist',
        iconName: 'ShieldAlert',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Formulary risk matrix, dosage anomaly tracking, controlled substance inventory.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      },
      {
        id: 'hr',
        title: 'Hospital HR & Staffing Director',
        iconName: 'Users',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Physician burnout forecasting, nurse-to-patient ratio modeling, and retention analytics.',
        roleCategory: 'hr',
        permissions: ['dashboard', 'analytics', 'reports', 'workflow']
      },
      {
        id: 'administrator',
        title: 'Healthcare Systems Administrator',
        iconName: 'Server',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'EMR integration health, HL7/FHIR pipeline security, user provisioning, and audit logs.',
        roleCategory: 'it',
        permissions: ['all']
      },
      {
        id: 'receptionist',
        title: 'Triage & Admissions Officer',
        iconName: 'UserCheck',
        accessLevel: 'Level 1 (Staff)',
        levelNumber: 1,
        desc: 'Patient intake queues, triage priority indicators, and standard incident reporting.',
        roleCategory: 'employee',
        permissions: ['dashboard', 'incidents']
      }
    ]
  },

  manufacturing: {
    id: 'manufacturing',
    name: 'Industrial Manufacturing & Plants',
    sector: 'Heavy Industry & Robotics',
    iconName: 'Factory',
    themeColor: '#FF6B00',
    secondaryColor: '#FF9E40',
    accentColor: '#FFA500',
    bgImage: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
    description: 'Predictive machine failure, assembly line downtime forecasting, IoT sensor telemetry, and workplace safety compliance.',
    statLabel: 'Connected IoT Industrial Nodes',
    statValue: '3,820 Nodes',
    healthScore: 91,
    aiRiskScore: 16.8,
    departments: ['Assembly Line A', 'Robotics Cell 4', 'Quality Lab', 'Foundry', 'Packaging', 'Logistics Bay'],
    industryModules: [
      {
        id: 'machine-monitoring',
        name: 'Predictive Machine Maintenance',
        iconName: 'Wrench',
        description: 'Vibration analysis, thermal imaging anomalies, and MTBF failure forecasting.',
        kpi1: { label: 'Critical Machines', value: '2 at risk', change: 'Bearing wear', positive: false },
        kpi2: { label: 'Mean Time to Repair', value: '42 mins', change: '-18%', positive: true },
        kpi3: { label: 'Prevented Outages', value: '14 this month', change: 'Saved $420k', positive: true },
        activeAlertsCount: 2
      },
      {
        id: 'production-risk',
        name: 'Production Line Throughput & Bottlenecks',
        iconName: 'Layers',
        description: 'Yield rate optimization, cycle time variance, and supply starvation predictions.',
        kpi1: { label: 'OEE Efficiency', value: '88.4%', change: '+2.6%', positive: true },
        kpi2: { label: 'Scrap Rate', value: '0.42%', change: '-0.15%', positive: true },
        kpi3: { label: 'Shift Output', value: '14,200 units', change: '+6%', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'plant-safety',
        name: 'Occupational Safety & OSHA Compliance',
        iconName: 'HardHat',
        description: 'Computer vision hazard detection, near-miss logging, and toxic emissions telemetry.',
        kpi1: { label: 'Days Without Incident', value: '284 Days', change: 'Safety record', positive: true },
        kpi2: { label: 'Near Miss Reports', value: '3 this week', change: 'Resolved', positive: true },
        kpi3: { label: 'OSHA Compliance', value: '99.4%', change: '+0.2%', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'inventory-risk',
        name: 'Raw Material & Supply Buffer Risk',
        iconName: 'Truck',
        description: 'Component stockout forecasting, tier-2 supplier delivery delays and buffer index.',
        kpi1: { label: 'Stockout Risk Index', value: 'Low (12%)', change: '-4%', positive: true },
        kpi2: { label: 'Lead Time Variance', value: '+1.2 days', change: 'Ocean freight', positive: false },
        kpi3: { label: 'Buffer Criticality', value: 'All Green', change: '4 weeks runway', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Operating Officer / CEO',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Global plant operational health, supply chain volatility, capital risk, and carbon footprint.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'plant-manager',
        title: 'Plant Operations Director',
        iconName: 'Factory',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Line-by-line throughput, predictive outage scheduling, staff shift allocation, and cost matrix.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'risk', 'incidents', 'predictive', 'analytics', 'workflow', 'reports']
      },
      {
        id: 'risk-manager',
        title: 'Industrial Risk & Safety Manager',
        iconName: 'ShieldAlert',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Comprehensive hazard tracking, machine failure probability curves, and safety audit registers.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'maintenance-engineer',
        title: 'Lead Maintenance Engineer',
        iconName: 'Wrench',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'IoT vibration sensors, machine diagnostics, thermal imaging alerts, and work order dispatch.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'predictive', 'workflow']
      },
      {
        id: 'quality-inspector',
        title: 'Quality Assurance Inspector',
        iconName: 'CheckCircle2',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Defect rate tracking, tolerance compliance, batch rejection analytics, and root cause audits.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      },
      {
        id: 'safety-officer',
        title: 'EHS Safety Officer',
        iconName: 'HardHat',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'OSHA compliance tracking, hazardous chemical protocols, PPE surveillance, and incident filings.',
        roleCategory: 'compliance',
        permissions: ['dashboard', 'industry_modules', 'compliance', 'incidents', 'reports']
      },
      {
        id: 'hr',
        title: 'Plant Workforce & HR Lead',
        iconName: 'Users',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Shift fatigue index, safety certification tracking, and plant technician turnover risk.',
        roleCategory: 'hr',
        permissions: ['dashboard', 'analytics', 'reports', 'workflow']
      }
    ]
  },

  it: {
    id: 'it',
    name: 'Technology, Cloud & Software Enterprise',
    sector: 'Cloud & Cyber Security',
    iconName: 'Cpu',
    themeColor: '#7B61FF',
    secondaryColor: '#9D85FF',
    accentColor: '#00E5FF',
    bgImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop',
    description: 'Cyber attack surface scanning, zero-day threat surveillance, Kubernetes cluster health, and CI/CD reliability.',
    statLabel: 'Cloud Nodes & Microservices',
    statValue: '12,400+ Nodes',
    healthScore: 97,
    aiRiskScore: 8.5,
    departments: ['Platform Eng', 'Cyber Defense', 'SRE / DevOps', 'Core AI Services', 'Product Eng', 'SecOps'],
    industryModules: [
      {
        id: 'cyber-risk',
        name: 'Cyber Threat Radar & Zero-Day Detection',
        iconName: 'ShieldAlert',
        description: 'Behavioral anomaly detection in network ingress, IAM privilege escalations and API abuse.',
        kpi1: { label: 'Threats Blocked', value: '482', change: '+24% AI mitigated', positive: true },
        kpi2: { label: 'Vulnerability Score', value: '0.12 (Low)', change: '-0.04', positive: true },
        kpi3: { label: 'Auth Anomaly Rate', value: '0.001%', change: 'Safe baseline', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'infrastructure-health',
        name: 'Multi-Cloud & Kubernetes Infrastructure',
        iconName: 'Server',
        description: 'Cluster CPU/Memory throttling, distributed tracing latency, and pod eviction risk.',
        kpi1: { label: 'Cluster Uptime', value: '99.995%', change: 'All 8 regions', positive: true },
        kpi2: { label: 'P99 API Latency', value: '18.4 ms', change: '-2.1 ms', positive: true },
        kpi3: { label: 'Auto-scale Buffer', value: '38% Capacity', change: 'Optimized', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'devops-ci-cd',
        name: 'DevOps Pipeline & Release Stability',
        iconName: 'Terminal',
        description: 'Change failure rate, MTTR for production regressions, and automated rollback triggers.',
        kpi1: { label: 'Deployment Success', value: '99.2%', change: '142 deploys/day', positive: true },
        kpi2: { label: 'Change Failure Rate', value: '0.8%', change: '-0.4%', positive: true },
        kpi3: { label: 'Rollback Latency', value: '42 secs', change: 'Automated', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'ai-model-governance',
        name: 'LLM & AI Model Drift Surveillance',
        iconName: 'Cpu',
        description: 'Model hallucination scoring, token latency, prompt injection defense and data drift.',
        kpi1: { label: 'Drift Index', value: '0.014', change: 'Well within bounds', positive: true },
        kpi2: { label: 'Inference Latency', value: '120ms', change: '-15ms', positive: true },
        kpi3: { label: 'Adversarial Flags', value: '0 active', change: 'Filtered 12', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Technology Officer / CEO',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Global architectural health, cybersecurity posture, enterprise SLO compliance, and tech debt.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'devops-engineer',
        title: 'Lead SRE / DevOps Architect',
        iconName: 'Server',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Cluster health, cloud infrastructure provisioning, chaos engineering simulations, and pipeline telemetry.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'predictive', 'incidents', 'analytics', 'xai', 'workflow']
      },
      {
        id: 'cybersecurity-analyst',
        title: 'Principal Security Analyst (SecOps)',
        iconName: 'ShieldCheck',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Attack vector analysis, SIEM event correlation, honeypot telemetry, and incident quarantine.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'software-engineer',
        title: 'Senior Software Engineer',
        iconName: 'Terminal',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Service health, microservice trace telemetry, bug escalation, and sprint task queues.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      },
      {
        id: 'system-admin',
        title: 'Enterprise Systems Administrator',
        iconName: 'Server',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'IAM identity federation, SOC2 compliance logs, audit log retention, and encryption keys.',
        roleCategory: 'it',
        permissions: ['all']
      },
      {
        id: 'hr',
        title: 'Tech Talent & HR Director',
        iconName: 'Users',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Engineering burnout metrics, on-call fatigue score, and developer attrition forecasting.',
        roleCategory: 'hr',
        permissions: ['dashboard', 'analytics', 'reports', 'workflow']
      }
    ]
  },

  bank: {
    id: 'bank',
    name: 'Banking & Financial Institution',
    sector: 'Banking & Capital Markets',
    iconName: 'Landmark',
    themeColor: '#0A2342',
    secondaryColor: '#0F52BA',
    accentColor: '#FFD700',
    bgImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2000&auto=format&fit=crop',
    description: 'Real-time transaction fraud interception, Anti-Money Laundering (AML) heuristics, liquidity stress testing, and Basel III compliance.',
    statLabel: 'Transactions Processed / Sec',
    statValue: '14,200 TPS',
    healthScore: 96,
    aiRiskScore: 9.2,
    departments: ['Retail Banking', 'Wealth Management', 'Risk & Compliance', 'Treasury', 'Credit Underwriting', 'Cyber FinSec'],
    industryModules: [
      {
        id: 'fraud-detection',
        name: 'Autonomous Fraud Detection & Prevention',
        iconName: 'ShieldAlert',
        description: 'Sub-second card fraud scoring, synthetic identity detection, and wire transfer anomalies.',
        kpi1: { label: 'High Risk Txns', value: '18 Suspended', change: '$1.4M saved', positive: true },
        kpi2: { label: 'False Positive Rate', value: '0.04%', change: '-0.01%', positive: true },
        kpi3: { label: 'Latency per Check', value: '8.2 ms', change: 'Hardware accel', positive: true },
        activeAlertsCount: 2
      },
      {
        id: 'aml-surveillance',
        name: 'Anti-Money Laundering (AML) & KYC Risk',
        iconName: 'Scale',
        description: 'Graph neural network structuring detection, PEP watchlist matching and SAR generation.',
        kpi1: { label: 'Active Structuring Alerts', value: '4 Cases', change: 'Investigating', positive: false },
        kpi2: { label: 'SAR Auto-filing Speed', value: '12 mins', change: '85% faster', positive: true },
        kpi3: { label: 'Sanction Screen Rate', value: '100% Real-time', change: '0 misses', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'credit-risk',
        name: 'Credit Risk & Loan Default Forecasting',
        iconName: 'TrendingUp',
        description: 'Macro-economic stress testing, probability of default (PD) and loss given default (LGD).',
        kpi1: { label: 'Portfolio PD', value: '1.24%', change: '-0.18%', positive: true },
        kpi2: { label: 'Non-Performing Loans', value: '0.82%', change: 'Lowest decile', positive: true },
        kpi3: { label: 'Capital Reserve Ratio', value: '14.8%', change: '+0.5% over Tier 1', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'branch-liquidity',
        name: 'Branch Liquidity & Vault Telemetry',
        iconName: 'Landmark',
        description: 'Physical vault cash demands, ATM replenishment predictive cycles, and branch audit scores.',
        kpi1: { label: 'Vault Optimization', value: '99.4%', change: '+1.2%', positive: true },
        kpi2: { label: 'ATM Outages', value: '0.2%', change: '-0.1%', positive: true },
        kpi3: { label: 'Branch Audit Rating', value: 'AAA', change: 'All 120 branches', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Executive Officer / Chief Risk Officer',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Global liquidity risk, balance sheet exposure, geopolitical risk, and regulatory capital.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Chief Risk Officer (CRO / Manager)',
        iconName: 'ShieldAlert',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Comprehensive market risk, credit risk models, VaR simulations, and stress tests.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'fraud-analyst',
        title: 'Senior Fraud Analyst',
        iconName: 'ShieldCheck',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Real-time transaction queue, chargeback risk prediction, IP cluster investigation.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'predictive', 'workflow']
      },
      {
        id: 'credit-analyst',
        title: 'Commercial Credit Analyst',
        iconName: 'TrendingUp',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Corporate underwriting scorecards, DSCR predictive models, and debt portfolio health.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'predictive', 'analytics', 'reports']
      },
      {
        id: 'compliance-officer',
        title: 'BSA / AML Compliance Officer',
        iconName: 'Scale',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Regulatory audit readiness (OCC, Fed, FINRA), suspicious activity reports, and sanction audits.',
        roleCategory: 'compliance',
        permissions: ['compliance', 'reports', 'workflow', 'incidents', 'industry_modules']
      },
      {
        id: 'branch-manager',
        title: 'Regional Branch Operations Manager',
        iconName: 'Landmark',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Branch operational incidents, physical security alerts, local vault cash logistics.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  university: {
    id: 'university',
    name: 'University & Research Institute',
    sector: 'Higher Education & Academics',
    iconName: 'GraduationCap',
    themeColor: '#059669',
    secondaryColor: '#10B981',
    accentColor: '#34D399',
    bgImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2000&auto=format&fit=crop',
    description: 'Student dropout early warning, research grant compliance, faculty workload balancing, and campus security surveillance.',
    statLabel: 'Enrolled Students & Faculty',
    statValue: '48,000+',
    healthScore: 93,
    aiRiskScore: 11.2,
    departments: ['Engineering', 'Medical School', 'Business', 'Arts & Sciences', 'Research Labs', 'Campus Operations'],
    industryModules: [
      {
        id: 'student-analytics',
        name: 'Student Retention & Academic Risk AI',
        iconName: 'Users',
        description: 'Early detection of course failure risk, mental health wellness indicators and graduation forecast.',
        kpi1: { label: 'At-Risk Interventions', value: '38 Students', change: '84% turnaround', positive: true },
        kpi2: { label: 'Retention Forecast', value: '94.2%', change: '+1.5%', positive: true },
        kpi3: { label: 'Course Completion', value: '96.8%', change: '+0.8%', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'research-compliance',
        name: 'Research Grant & IRB Compliance',
        iconName: 'Scale',
        description: 'IRB protocol tracking, federal grant fund allocations, and clinical trial ethics auditing.',
        kpi1: { label: 'Active Grants Monitored', value: '$84M', change: '0 non-compliance', positive: true },
        kpi2: { label: 'IRB Protocol Approval', value: '4.2 days avg', change: '40% faster', positive: true },
        kpi3: { label: 'Audit Readiness', value: '100%', change: 'NSF / NIH compliant', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'campus-security',
        name: 'Smart Campus Infrastructure & Security',
        iconName: 'Building2',
        description: 'Dormitory energy efficiency, lab safety ventilation, and campus emergency perimeter alerts.',
        kpi1: { label: 'Campus Safety Index', value: '99.8%', change: 'Optimal', positive: true },
        kpi2: { label: 'Lab Hazmat Sensors', value: 'All Normal', change: '0 leaks', positive: true },
        kpi3: { label: 'Building Energy Waste', value: '-18%', change: 'AI automated', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'principal',
        title: 'Chancellor / Dean / Principal',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Institutional accreditation, endowment safety, student retention KPIs, and university ranking.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'dean',
        title: 'Academic Dean & HOD',
        iconName: 'GraduationCap',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Department curriculum risk, faculty performance, grade distributions, and student dropout models.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'predictive', 'analytics', 'reports', 'workflow']
      },
      {
        id: 'professor',
        title: 'Professor / Lead Faculty',
        iconName: 'Users',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Classroom performance predictions, student engagement alerts, and research submissions.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      },
      {
        id: 'administrator',
        title: 'Campus Operations Administrator',
        iconName: 'Building2',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Physical facility risk, dorm maintenance, network security, and incident dispatch.',
        roleCategory: 'it',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'admin', 'compliance']
      },
      {
        id: 'hr',
        title: 'University HR & Faculty Affairs',
        iconName: 'Users',
        accessLevel: 'Level 3 (Manager)',
        levelNumber: 3,
        desc: 'Tenure review risk analytics, faculty workload fatigue, and recruitment forecasting.',
        roleCategory: 'hr',
        permissions: ['dashboard', 'analytics', 'reports', 'workflow']
      }
    ]
  },

  government: {
    id: 'government',
    name: 'Sovereign Government & Public Sector',
    sector: 'Public Administration & Civil Defense',
    iconName: 'Building2',
    themeColor: '#1E293B',
    secondaryColor: '#334155',
    accentColor: '#94A3B8',
    bgImage: 'https://images.unsplash.com/photo-1523292562811-8fa7962ba5c2?q=80&w=2000&auto=format&fit=crop',
    description: 'Citizen complaint resolution velocity, critical public infrastructure integrity, municipal budget variance, and emergency response.',
    statLabel: 'Citizens & Public Entities Served',
    statValue: '3.4M Citizens',
    healthScore: 90,
    aiRiskScore: 15.4,
    departments: ['Transportation', 'Public Health', 'Public Works', 'Treasury & Taxation', 'Emergency Services', 'Civil Registry'],
    industryModules: [
      {
        id: 'citizen-complaints',
        name: 'Citizen Grievances & Sentiment Engine',
        iconName: 'Users',
        description: 'NLP sentiment clustering across civic portals, emergency hotline spikes, and response SLA tracking.',
        kpi1: { label: 'Resolution Rate', value: '94.6%', change: '+3.2%', positive: true },
        kpi2: { label: 'Avg Time to Resolve', value: '18 hrs', change: '-4 hrs', positive: true },
        kpi3: { label: 'Public Sentiment Index', value: '78 / 100', change: '+4 pts', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'infrastructure-risk',
        name: 'Public Infrastructure & Bridge Sensor Telemetry',
        iconName: 'Building2',
        description: 'Structural health monitoring on bridges, water grid pressure anomalies, and pothole detection.',
        kpi1: { label: 'Monitored Assets', value: '1,420 Bridges/Grids', change: '99.4% Healthy', positive: true },
        kpi2: { label: 'Urgent Repairs', value: '3 Active Sites', change: 'Work orders open', positive: false },
        kpi3: { label: 'Prevented Road Hazards', value: '142 this quarter', change: 'Saved $2.4M', positive: true },
        activeAlertsCount: 2
      },
      {
        id: 'budget-compliance',
        name: 'Municipal Budget & Procurement Audit',
        iconName: 'Scale',
        description: 'Fiscal burn rate anomalies, vendor bid collusions detection, and anti-corruption audit trails.',
        kpi1: { label: 'Budget Variance', value: '-0.4%', change: 'Under fiscal target', positive: true },
        kpi2: { label: 'Vendor Red Flags', value: '0 Critical', change: '840 audited', positive: true },
        kpi3: { label: 'Audit Trail Health', value: '100% Immutable', change: 'Zero tampering', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'City Commissioner / Mayor / Minister',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'City-wide civil defense readiness, public infrastructure integrity, municipal budget, and emergency status.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'department-head',
        title: 'Public Works & Agency Director',
        iconName: 'Building2',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Agency budget allocation, project completion risks, civic complaints queue, and field dispatch.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'risk', 'incidents', 'predictive', 'analytics', 'workflow', 'reports']
      },
      {
        id: 'auditor',
        title: 'Government Auditor General',
        iconName: 'Scale',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Procurement irregularities, public tender compliance, fraud detection, and regulatory audits.',
        roleCategory: 'compliance',
        permissions: ['compliance', 'reports', 'workflow', 'incidents', 'analytics', 'risk']
      },
      {
        id: 'officer',
        title: 'Civil Service Officer',
        iconName: 'UserCheck',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Citizen request processing, field inspection reports, task completions, and incident submissions.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      },
      {
        id: 'administrator',
        title: 'Municipal IT & Security Director',
        iconName: 'Server',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Government cloud enclave security, citizen data sovereignty, biometric identity logs.',
        roleCategory: 'it',
        permissions: ['all']
      }
    ]
  },

  insurance: {
    id: 'insurance',
    name: 'Insurance & Actuarial Enterprise',
    sector: 'Insurance & Risk Underwriting',
    iconName: 'ShieldCheck',
    themeColor: '#059669',
    secondaryColor: '#0284C7',
    accentColor: '#38BDF8',
    bgImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=2000&auto=format&fit=crop',
    description: 'Actuarial catastrophe risk modeling, claims fraud detection, underwriting loss ratio forecasting, and solvency capital.',
    statLabel: 'Active Insured Policies',
    statValue: '2.8M Policies',
    healthScore: 95,
    aiRiskScore: 10.4,
    departments: ['Claims Dept', 'Underwriting', 'Actuarial Science', 'Fraud SIU', 'Reinsurance', 'Regulatory Legal'],
    industryModules: [
      {
        id: 'claims-fraud',
        name: 'Claims Fraud Interception (SIU)',
        iconName: 'ShieldAlert',
        description: 'Computer vision metadata analysis on damaged vehicle photos, staged accident clustering, and billing anomalies.',
        kpi1: { label: 'Fraud Suspended', value: '$8.2M', change: '+24% YoY', positive: true },
        kpi2: { label: 'Fast-track Claims', value: '72% Auto-approved', change: '&lt; 4 hours', positive: true },
        kpi3: { label: 'SIU Case Lead Time', value: '4.2 days', change: '-35%', positive: true },
        activeAlertsCount: 2
      },
      {
        id: 'underwriting-risk',
        name: 'Dynamic Underwriting & Actuarial Models',
        iconName: 'TrendingUp',
        description: 'Wildfire/Hurricane geospatial exposure, climate change impact pricing, and mortality matrix.',
        kpi1: { label: 'Combined Loss Ratio', value: '89.4%', change: 'Target &lt; 92%', positive: true },
        kpi2: { label: 'PML Max Exposure', value: 'Within 95% CI', change: 'Solvent', positive: true },
        kpi3: { label: 'Underwriting Turnaround', value: '1.4 mins', change: 'Real-time API', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Executive Officer / Chief Actuary',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Solvency II capital surplus, reinsurance treaty exposure, and portfolio combined ratios.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Head of Enterprise Risk & Actuarial',
        iconName: 'ShieldAlert',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Catastrophe risk simulations, reserve volatility, investment portfolio VaR, and stress tests.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'compliance-officer',
        title: 'Insurance Regulatory Compliance Lead',
        iconName: 'Scale',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'State insurance commissioner filings, statutory accounting standards, and consumer privacy audits.',
        roleCategory: 'compliance',
        permissions: ['compliance', 'reports', 'workflow', 'incidents', 'industry_modules']
      },
      {
        id: 'employee',
        title: 'Claims Specialist / Underwriter',
        iconName: 'FileText',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Assigned claim files, policy quote risk scores, evidence inspection, and customer tasks.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  retail: {
    id: 'retail',
    name: 'Global Retail & Omnichannel Commerce',
    sector: 'Consumer Goods & Retail',
    iconName: 'ShoppingBag',
    themeColor: '#E11D48',
    secondaryColor: '#F43F5E',
    accentColor: '#FDA4AF',
    bgImage: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2000&auto=format&fit=crop',
    description: 'Inventory shrinkage forecasting, store theft anomaly detection, supplier stockouts, and consumer return abuse analytics.',
    statLabel: 'Daily Omnichannel Orders',
    statValue: '240,000+',
    healthScore: 92,
    aiRiskScore: 13.5,
    departments: ['Store Operations', 'Supply Chain', 'E-Commerce', 'Loss Prevention', 'Merchandising', 'Finance'],
    industryModules: [
      {
        id: 'loss-prevention',
        name: 'Store Loss Prevention & Shrinkage AI',
        iconName: 'ShieldAlert',
        description: 'Point-of-Sale sweethearting detection, self-checkout misscan alerts, and organized retail crime tracking.',
        kpi1: { label: 'Shrinkage Rate', value: '0.84%', change: '-0.32% vs target', positive: true },
        kpi2: { label: 'Self-checkout Alerts', value: '98.2% Precision', change: 'Zero friction', positive: true },
        kpi3: { label: 'Recovered Inventory', value: '$480k', change: 'This quarter', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'supply-chain-risk',
        name: 'Supplier Disruption & Out-of-Stock Risk',
        iconName: 'Truck',
        description: 'Stockout probability by SKU, freight port congestion delays, and dynamic safety stock optimization.',
        kpi1: { label: 'On-Shelf Availability', value: '98.8%', change: '+1.4%', positive: true },
        kpi2: { label: 'Stockout Forecast', value: '8 SKUs at risk', change: 'Reorder sent', positive: true },
        kpi3: { label: 'DC Fulfillment Rate', value: '99.2%', change: 'Optimal', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Executive Officer / VP Retail',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Global same-store sales, gross margin variance, supply chain continuity, and shrinkage index.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Head of Loss Prevention & Security',
        iconName: 'ShieldCheck',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Store incident logs, shrinkage heatmaps, supplier audit tracking, and fraud investigation.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'employee',
        title: 'Store Operations Lead',
        iconName: 'ShoppingBag',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Store inventory replenishment tasks, shift incident logging, and daily register audit.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  construction: {
    id: 'construction',
    name: 'Construction & Civil Engineering',
    sector: 'Infrastructure & Real Estate',
    iconName: 'HardHat',
    themeColor: '#D97706',
    secondaryColor: '#F59E0B',
    accentColor: '#FCD34D',
    bgImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?q=80&w=2000&auto=format&fit=crop',
    description: 'Jobsite hazard prediction, subcontractor milestone delay models, heavy machinery telematics, and OSHA inspection audits.',
    statLabel: 'Active Capital Projects',
    statValue: '42 Mega-Sites',
    healthScore: 89,
    aiRiskScore: 18.2,
    departments: ['Site Operations', 'Safety & EHS', 'Subcontractor Mgmt', 'Structural Engineering', 'Procurement', 'Permits'],
    industryModules: [
      {
        id: 'site-safety',
        name: 'Jobsite Safety & Hazard Surveillance',
        iconName: 'HardHat',
        description: 'Computer vision crane zone encroachment, PPE compliance monitoring, and scaffold stability sensors.',
        kpi1: { label: 'Incident Free Days', value: '182 Days', change: 'Safety tier 1', positive: true },
        kpi2: { label: 'PPE Compliance', value: '99.4%', change: '+1.2%', positive: true },
        kpi3: { label: 'Hazard Interceptions', value: '18 resolved', change: 'Before shift', positive: true },
        activeAlertsCount: 2
      },
      {
        id: 'project-delays',
        name: 'Milestone Delay & Cost Overrun Forecast',
        iconName: 'Clock',
        description: 'Weather disruption simulations, concrete curing latency, and subcontractor throughput variance.',
        kpi1: { label: 'On-Time Schedule', value: '94.8%', change: '+2.1%', positive: true },
        kpi2: { label: 'Budget Variance', value: '+0.8%', change: 'Within contingency', positive: true },
        kpi3: { label: 'Material Lead Time', value: 'Stable', change: 'Steel/Concrete secured', positive: true },
        activeAlertsCount: 1
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Managing Director / Chief Executive',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Mega-project financial exposure, bonding capacity, joint-venture risk, and safety ratings.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Site Safety & Project Risk Director',
        iconName: 'ShieldAlert',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Critical path schedule risks, crane collision warnings, OSHA violation defense, and insurance claims.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'employee',
        title: 'Project Engineer / Field Inspector',
        iconName: 'HardHat',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Site safety check-in, contractor logs, punch list tasks, and safety incident reporting.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  energy: {
    id: 'energy',
    name: 'Energy, Grid & Utilities',
    sector: 'Clean Energy & Power Grids',
    iconName: 'Zap',
    themeColor: '#15803D',
    secondaryColor: '#22C55E',
    accentColor: '#86EFAC',
    bgImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2000&auto=format&fit=crop',
    description: 'Grid frequency load balancing, wind turbine blade vibration diagnostics, pipeline leak detection, and EPA emissions.',
    statLabel: 'Megawatts Clean Energy Output',
    statValue: '8,400 MW',
    healthScore: 95,
    aiRiskScore: 10.1,
    departments: ['Grid Operations', 'Renewable Farms', 'Nuclear & Hydro', 'Transmission', 'EHS & EPA', 'Trading Desk'],
    industryModules: [
      {
        id: 'grid-stability',
        name: 'Grid Frequency & Demand Peak Forecasting',
        iconName: 'Zap',
        description: 'Weather-based solar/wind intermittency predictions, battery storage dispatch, and blackout prevention.',
        kpi1: { label: 'Grid Frequency', value: '60.00 Hz', change: 'Nominal (+-0.01)', positive: true },
        kpi2: { label: 'Renewable Mix', value: '74.2%', change: '+8% vs benchmark', positive: true },
        kpi3: { label: 'Peak Load Reserve', value: '28% Buffer', change: 'Optimal', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'pipeline-telemetry',
        name: 'Pipeline Integrity & Turbine Diagnostics',
        iconName: 'Cpu',
        description: 'Acoustic wave leak detection, turbine gearbox oil viscosity breakdown, and thermal hotspot alerts.',
        kpi1: { label: 'Turbine Fleet Health', value: '98.4%', change: '320 Turbines', positive: true },
        kpi2: { label: 'Pipeline Pressure', value: 'Normal (850 PSI)', change: '0 leaks detected', positive: true },
        kpi3: { label: 'MTBF Forecast', value: '4,200 hrs', change: '+20%', positive: true },
        activeAlertsCount: 1
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Operating Officer / CEO',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Grid reliability index, FERC / NERC compliance, capital expansion risk, and commodity price hedging.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Grid Reliability & EHS Risk Manager',
        iconName: 'ShieldAlert',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Blackout probability simulations, environmental impact audits, and cybersecurity on SCADA networks.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'employee',
        title: 'Control Room Operator / Field Tech',
        iconName: 'Zap',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Substation alarm queues, transformer temperature tracking, and safety work orders.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  logistics: {
    id: 'logistics',
    name: 'Logistics, Freight & Fleet Supply Chain',
    sector: 'Global Freight & Transportation',
    iconName: 'Truck',
    themeColor: '#4F46E5',
    secondaryColor: '#6366F1',
    accentColor: '#A5B4FC',
    bgImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop',
    description: 'Fleet telematics, route weather delay prediction, cold-chain temperature deviations, and customs bottleneck mitigation.',
    statLabel: 'Active Fleet Shipments',
    statValue: '54,200 Shipments',
    healthScore: 93,
    aiRiskScore: 12.8,
    departments: ['Fleet Operations', 'Air/Ocean Freight', 'Warehousing', 'Cold Chain', 'Customs Brokerage', 'Safety'],
    industryModules: [
      {
        id: 'fleet-telemetry',
        name: 'Fleet Telemetry & Route Hazard AI',
        iconName: 'Truck',
        description: 'Driver fatigue detection, harsh braking analytics, weather rerouting and fuel efficiency.',
        kpi1: { label: 'On-Time Delivery', value: '97.6%', change: '+1.8%', positive: true },
        kpi2: { label: 'Route Delays Avoided', value: '142 Rerouted', change: 'Saved 480 hrs', positive: true },
        kpi3: { label: 'Fleet Safety Score', value: '98.2 / 100', change: 'Top 5%', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'cold-chain-risk',
        name: 'Cold-Chain Temperature & Cargo Security',
        iconName: 'ShieldAlert',
        description: 'Perishable cargo sensor alerts, refrigeration unit battery backups, and high-value cargo geofence locks.',
        kpi1: { label: 'Thermal Excursions', value: '0 Spoilages', change: '100% compliant', positive: true },
        kpi2: { label: 'Geofence Breaches', value: '0 Detected', change: 'All secure', positive: true },
        kpi3: { label: 'Customs Clearance Time', value: '1.2 hrs avg', change: '-40%', positive: true },
        activeAlertsCount: 0
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Chief Supply Chain Officer / CEO',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Global maritime/intermodal transport risks, fuel price sensitivity, customer SLA compliance.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'Supply Chain Risk & DOT Safety Director',
        iconName: 'ShieldCheck',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'DOT compliance, hazardous materials transit protocols, theft mitigation, and port disruption models.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'employee',
        title: 'Freight Dispatcher / Hub Lead',
        iconName: 'Truck',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Active shipment dispatching, delay alerts, driver check-in, and incident reports.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  lawfirm: {
    id: 'lawfirm',
    name: 'Enterprise Law Firm & Legal Counsel',
    sector: 'Legal & Regulatory Advisory',
    iconName: 'Scale',
    themeColor: '#881337',
    secondaryColor: '#BE123C',
    accentColor: '#FB7185',
    bgImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2000&auto=format&fit=crop',
    description: 'Litigation outcome risk forecasting, contract liability clause exposure, conflict of interest checks, and compliance audits.',
    statLabel: 'Active Corporate Matters',
    statValue: '1,840 Matters',
    healthScore: 97,
    aiRiskScore: 7.9,
    departments: ['Litigation', 'Corporate M&A', 'Intellectual Property', 'Antitrust & Reg', 'Ethics & Conflicts', 'Tax Law'],
    industryModules: [
      {
        id: 'litigation-risk',
        name: 'Litigation Risk & Judge Analytics',
        iconName: 'Scale',
        description: 'NLP case law outcome probabilities, settlement value distribution, and motion grant rate predictions.',
        kpi1: { label: 'Trial Win Probability', value: '82.4%', change: '+3.1% over model', positive: true },
        kpi2: { label: 'Settlement Range Acc.', value: '94.2%', change: 'Within 5%', positive: true },
        kpi3: { label: 'Active Discovery Deadlines', value: '48 Next 14d', change: 'All on track', positive: true },
        activeAlertsCount: 1
      },
      {
        id: 'contract-liability',
        name: 'Contract Liability & Indemnity Clause AI',
        iconName: 'FileText',
        description: 'M&A representation & warranty risk scoring, unlimited liability detection, and GDPR compliance scans.',
        kpi1: { label: 'High Risk Clauses', value: '4 Detected', change: 'Redlines ready', positive: false },
        kpi2: { label: 'Contract Scan Speed', value: '18 secs/doc', change: '100% thorough', positive: true },
        kpi3: { label: 'Conflict Checks Passed', value: '100%', change: 'Zero conflicts', positive: true },
        activeAlertsCount: 1
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Managing Partner / General Counsel',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Firm-wide malpractice exposure, high-stakes litigation exposure, billable hour yield, and ethics.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'compliance-officer',
        title: 'Conflicts of Interest & Ethics Partner',
        iconName: 'Scale',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Bar association compliance, Chinese wall security enforcement, trust account audits.',
        roleCategory: 'compliance',
        permissions: ['compliance', 'reports', 'workflow', 'incidents', 'industry_modules', 'analytics']
      },
      {
        id: 'employee',
        title: 'Senior Associate Attorney',
        iconName: 'FileText',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Case research workflows, brief drafting tasks, filing deadlines, and client matters.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  },

  startup: {
    id: 'startup',
    name: 'High-Growth Tech Startup',
    sector: 'Venture & High-Growth Tech',
    iconName: 'Flame',
    themeColor: '#8B5CF6',
    secondaryColor: '#A855F7',
    accentColor: '#06B6D4',
    bgImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop',
    description: 'Runway cash burn velocity, product churn risk forecasting, SOC2 security posture, and critical hire retention.',
    statLabel: 'Monthly Active Users (MAU)',
    statValue: '2.4M MAU',
    healthScore: 94,
    aiRiskScore: 14.1,
    departments: ['Product & Growth', 'Engineering', 'Go-To-Market', 'Finance & Ops', 'People & Talent', 'Security'],
    industryModules: [
      {
        id: 'runway-burn-risk',
        name: 'Runway Burn Rate & Cash Out Forecaster',
        iconName: 'TrendingUp',
        description: 'Venture runway stress testing, headcount scaling scenarios, and ARR growth trajectory predictions.',
        kpi1: { label: 'Runway Remaining', value: '26 Months', change: '+4 mos extension', positive: true },
        kpi2: { label: 'Net Burn Multiple', value: '1.14 (Top tier)', change: '-0.2', positive: true },
        kpi3: { label: 'ARR Growth Rate', value: '+142% YoY', change: 'On plan', positive: true },
        activeAlertsCount: 0
      },
      {
        id: 'churn-security',
        name: 'Enterprise Churn Risk & SOC2 Security',
        iconName: 'ShieldAlert',
        description: 'Customer product telemetry drop-offs, Net Promoter Risk, and SOC2 continuous compliance.',
        kpi1: { label: 'Net Revenue Retention', value: '124%', change: '+3%', positive: true },
        kpi2: { label: 'At-Risk Accounts', value: '2 Accounts', change: 'Success assigned', positive: false },
        kpi3: { label: 'SOC2 Security Controls', value: '100% Automated', change: 'Passed audit', positive: true },
        activeAlertsCount: 1
      }
    ],
    roles: [
      {
        id: 'ceo',
        title: 'Founder & Chief Executive Officer',
        iconName: 'Award',
        accessLevel: 'Level 5 (Super Admin)',
        levelNumber: 5,
        desc: 'Board reporting, runway cash runway, enterprise sales pipeline risks, and product market fit.',
        roleCategory: 'executive',
        permissions: ['all']
      },
      {
        id: 'risk-manager',
        title: 'VP of Operations & Finance (COO/CFO)',
        iconName: 'TrendingUp',
        accessLevel: 'Level 4 (Executive)',
        levelNumber: 4,
        desc: 'Cash flow forecasting, regulatory compliance, customer contract liabilities, and insurance.',
        roleCategory: 'risk',
        permissions: ['risk', 'incidents', 'predictive', 'analytics', 'xai', 'reports', 'workflow', 'compliance', 'industry_modules']
      },
      {
        id: 'employee',
        title: 'Full Stack Engineer / Growth Lead',
        iconName: 'Cpu',
        accessLevel: 'Level 2 (Specialist)',
        levelNumber: 2,
        desc: 'Feature delivery sprint items, production error logs, and customer support tickets.',
        roleCategory: 'operations',
        permissions: ['dashboard', 'industry_modules', 'incidents', 'workflow']
      }
    ]
  }
};

// Permission checking helper
export const hasPermission = (
  userPermissions: string[] | undefined, 
  requiredModule: string,
  userLevel: number = 1
): boolean => {
  if (!userPermissions) return false;
  if (userPermissions.includes('all')) return true;
  if (userLevel >= 4 && (requiredModule === 'reports' || requiredModule === 'analytics')) return true;
  return userPermissions.includes(requiredModule);
};
