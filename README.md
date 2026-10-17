<div align="center">

  <img src="public/orbis-logo.png" alt="ORBIS Sovereign Intelligence Logo" width="140" style="border-radius: 28px; box-shadow: 0 0 45px rgba(59, 130, 246, 0.6); margin-bottom: 18px;" />

  # **O R B I S**
  ### **Organizational Risk and Business Intelligence System**

  <p align="center">
    <b>Next-Generation Cognitive Enterprise Risk Platform · Autonomous Multimodal Surveillance · Zero-Trust Multi-Tenant Governance</b>
  </p>

  <p align="center">
    <a href="#-system-architecture"><img src="https://img.shields.io/badge/Architecture-Organizational%20Intelligence%20Hub-00F2FE?style=for-the-badge&logo=shield" alt="System Version" /></a>
    <a href="#-test-suite--verification"><img src="https://img.shields.io/badge/Tests-626%20Passed%20(100%25)-10B981?style=for-the-badge&logo=vitest" alt="Test Suite" /></a>
    <a href="#-zero-trust-security-matrix"><img src="https://img.shields.io/badge/Security-Zero--Trust%20HMAC-E5C07B?style=for-the-badge&logo=auth0" alt="Security Clearance" /></a>
    <a href="#-cognitive-ai-copilot"><img src="https://img.shields.io/badge/AI%20Core-NVIDIA%20Nemotron--3-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA Core" /></a>
    <a href="#-data-layer"><img src="https://img.shields.io/badge/Database-PostgreSQL%20Neon-00E599?style=for-the-badge&logo=postgresql" alt="Neon Database" /></a>
  </p>

  <p align="center">
    <a href="#-executive-overview">Executive Overview</a> •
    <a href="#-the-organizational-intelligence-architecture">Intelligence Architecture</a> •
    <a href="#-the-7-primary-enterprise-workspaces">Primary Workspaces</a> •
    <a href="#-7-flagship-enterprise-sectors">Flagship Sectors</a> •
    <a href="#-key-platform-capabilities">Core Capabilities</a> •
    <a href="#-system-architecture">Architecture Diagram</a> •
    <a href="#-test-suite--verification">Test Verification</a> •
    <a href="#-quick-start">Quick Start</a>
  </p>

</div>

---

## 🏛️ Executive Overview

**ORBIS (Organizational Risk and Business Intelligence System)** is an institutional-grade, data-driven **Organizational Intelligence Platform**. Rather than functioning as a collection of isolated management modules, ORBIS behaves as a living digital operating system for enterprise organizations, where the **Organization itself is the single source of truth**.

Every operational activity across departments—hiring, expenses, project milestones, asset maintenance, audit observations, and risk discoveries—becomes a structured event captured by the **Organizational Data Hub**. From this central foundation, continuous engines dynamically calculate institutional health, trigger automated business rules, generate explanatory analytics, forecast risks with Bayesian linear regressions, and power AI executive reasoning.

Key Architectural Tenets:
- **Zero Module Isolation**: Modules never own isolated state; every module acts as a data producer and reactive consumer of the central Data Hub.
- **Unified Event-Driven Core**: Standardized `OrganizationalEvent` schema capturing institutional activities in real time.
- **Zero Hardcoded Numbers**: Every KPI, institutional health score (0–100%), and status indicator is calculated dynamically from live operational data.
- **Automated Business Rules Engine**: Real-time cross-domain rule evaluation that triggers escalation alerts when operational thresholds are breached.
- **Historical Prediction Engine**: Multimodal 30-day incident forecasts, financial margins, project delivery delay risks, and staffing burnout indices.
- **Zero-Trust Multi-Tenant Isolation**: Cryptographic HMAC-signed sessions bound to tenant identity and role clearance.
- **7 Flagship Enterprise Sectors**: Tailored surveillance metrics, role taxonomies, and statutory compliance cross-mappings for 7 critical economic pillars.
- **Cognitive AI Copilot**: NVIDIA Nemotron-3 supercomputing model enriched with live organizational intelligence telemetry.

---

## 🧠 The Organizational Intelligence Architecture

ORBIS evolves beyond traditional siloed enterprise suites into a centralized, data-driven nervous system for institutions. Every module produces structured events and consumes central intelligence.

```
       ┌────────────────────────────────────────────────────────┐
       │                   ORGANIZATION                         │
       │           (The Single Source of Truth)                 │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │                   DEPARTMENTS                          │
       │    HR · Finance · Operations · IT · Clinical · Legal   │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │                 DAILY ACTIVITIES                       │
       │  Hiring · Expenses · Delays · Incidents · Audits · Risk│
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
       ┌────────────────────────────────────────────────────────┐
       │            ORGANIZATIONAL DATA HUB                     │
       │       (Invisible Core Real-Time Event Hub)             │
       └──────┬────────────┬─────────────┬─────────────┬────────┘
              │            │             │             │
              ▼            ▼             ▼             ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐
       │  Business │ │    KPI    │ │ Analytics │ │Prediction │
       │   Rules   │ │  Engine   │ │  Engine   │ │  Engine   │
       │  Engine   │ │           │ │           │ │           │
       └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └─────┬─────┘
             │             │             │             │
             └─────────────┼─────────────┼─────────────┘
                           │
                           ▼
       ┌────────────────────────────────────────────────────────┐
       │             CENTRAL AI INTELLIGENCE CORE               │
       │            (NVIDIA Nemotron-3 Reasoning)               │
       └──────────────────────────┬─────────────────────────────┘
                                  │
                                  ▼
 ┌────────────────┬────────────────┬────────────────┬────────────────┐
 │   Dashboards   │  Reports & GRC │  Predictions   │   Automated    │
 │ (Live Telemetry│(Auto-Generated │(Historical 30d │ Alerts & Rules │
 │ & Health Score)│  Dossiers)     │ Regressions)   │ Notifications) │
 └────────────────┴────────────────┴────────────────┴────────────────┘
```

### 1. Unified Organizational Data Hub (`src/intelligence/OrganizationalDataHub.ts`)
The central invisible core of ORBIS. Every module writes standardized immutable events into this hub:
- **Event Schema**: `eventType`, `organization`, `department`, `timestamp`, `user`, `category`, `priority`, `title`, `description`, `relatedObjects`, `metadata`.
- **Global Ingestion Pipeline**: Guarantees zero data isolation; any new operational activity propagates downstream to all calculating engines instantly.
- **Persistence & Synchronization**: Automatically caches snapshot state in local storage and provides subscription hooks (`useOrganizationalIntelligence`) for reactive components.

### 2. Autonomous Calculation & Reasoning Engines
- **KPI Engine (`src/intelligence/KPIEngine.ts`)**: Replaces hardcoded dashboard metrics with dynamic computations:
  - **HR KPIs**: Employee turnover, retention rate, attendance index, and statutory training completion.
  - **Finance KPIs**: Operating profit margin, budget burn variance, liquidity cashflow, and revenue trajectory.
  - **Project KPIs**: Schedule delay percentage, milestone completion rate, and capital budget variance.
  - **Risk & GRC KPIs**: Dynamic systemic risk index, open risk velocity, compliance percentage, and audit readiness grade (`A+` to `Non-Compliant`).
  - **Weighted Institutional Health Score (0–100%)**: Multi-pillar formula synthesized across Risk (25%), Compliance (20%), Projects (15%), Finance (15%), Operations (15%), and HR (10%).
- **Business Rules Engine (`src/intelligence/BusinessRulesEngine.ts`)**: Evaluates cross-departmental conditions and triggers automatic escalations:
  - `RULE-PROJ-01`: Project Schedule Delay > 30% AND Budget Variance > 15% ➔ Escalates initiative risk and alerts finance.
  - `RULE-HR-02`: Department Turnover > 10% ➔ Triggers operational staffing shortfall warning.
  - `RULE-COMP-03`: Compliance Adherence < 80% ➔ Generates statutory emergency audit alert.
  - `RULE-INC-04`: Critical Incidents > 3 in 30 Days ➔ Increases systemic institutional risk index.
  - `RULE-ASSET-05`: Asset Health < 60% OR Downtime > 40h ➔ Initiates predictive maintenance ticket.
- **Explainable Analytics Engine (`src/intelligence/AnalyticsEngine.ts`)**: Resolves fundamental executive business inquiries with traceable causal drivers:
  - *Why did the Risk Index increase?*
  - *Which department generated the highest incident velocity?*
  - *Which risks are compounding fastest across operational vectors?*
  - *Which capital projects consume the highest budget variance?*
  - *Which statutory compliance controls fail repeatedly?*
  - *Which operational departments demonstrate month-over-month improvement?*
- **Prediction Engine (`src/intelligence/PredictionEngine.ts`)**: Eliminates static manual forecasts using historical operational trends:
  - **Incident Trajectory**: 3-month linear regression and Bayesian confidence bands projecting next month's incident velocity.
  - **Financial Runway**: Revenue and expense slope analysis forecasting next-quarter profit boundaries.
  - **Project Delivery Risk**: Mathematical probability calculation of schedule overrun based on delay velocity.
  - **Staffing Shortage Index**: Departmental turnover ratios driving burnout risk predictions.
- **AI Context Integration (`src/intelligence/aiContextBuilder.ts`)**:
  - Automatically synthesizes the live organizational state, KPIs, active alerts, and predictions into system context for the NVIDIA Nemotron-3 model.
  - Generates deterministic, data-grounded answers even during network degradation or offline failover.

### 3. Module Transformation Matrix (Producers & Consumers)
| Module | Event Producer Role | Consumer of Central Intelligence |
| :--- | :--- | :--- |
| **Executive Dashboard** | Manual metric overrides / executive bookmarks | Consumes Live Health Score (0–100%), Systemic Risk Index, and Reactive Telemetry Stream |
| **Risk Register** | Dispatches `RISK_CREATED`, `RISK_SCORE_UPDATED`, `RISK_MITIGATION_APPLIED` | Consumes unified risk collections, filtered departmental risk vectors, and rule-driven risk modifiers |
| **Incident Management** | Dispatches `INCIDENT_LOGGED`, `INCIDENT_RESOLVED` | Consumes real-time incident registers, MTBF drift trends, and automated root cause distributions |
| **Compliance & Audit** | Dispatches `COMPLIANCE_STATUS_UPDATED`, `AUDIT_COMPLETED` | Consumes statutory control compliance grades, overdue controls, and automated audit packs |
| **Analytics Workspace** | Dispatches ad-hoc analytics queries and report triggers | Consumes cross-departmental comparison heatmaps, 6 core executive questions, and root driver trees |
| **Predictive AI** | Dispatches `PREDICTIVE_MITIGATION_APPLIED` | Consumes 30-day Bayesian incident projections, delivery risk matrices, and cashflow outlooks |
| **Enterprise Reports** | Dispatches report export and audit generation events | Consumes live compiled state to dynamically compile 5 executive dossiers in Markdown, Text, and CSV |
| **Notifications Center** | Dispatches acknowledgment and dismissal actions | Consumes automated alerts generated directly by the Business Rules Engine |

---

## 🧭 The 7 Primary Enterprise Workspaces

The authenticated experience in ORBIS is organized into **7 permanent primary workspaces**, accessible via the persistent master navigation bar:

| Workspace | Route | Focus & Core Functionalities |
| :--- | :--- | :--- |
| **Executive Dashboard** | `/dashboard` | Sovereign KPI pulse, active alert feeds, risk score gauges, and quick action cards. |
| **Risk Center** | `/dashboard/risk-center` | Unified risk register, interactive 5x5 heatmap matrix, quantitative assessment calculator, mitigation action workflows, and chronological incident timeline. |
| **AI Intelligence Core** | `/dashboard/ai-intelligence` | Monte Carlo failure projections, predictive drift horizons, SHAP explainability attribution, and embedded ORBIS Risk Intelligence Copilot. |
| **Organization Workspace** | `/dashboard/organization` | Live SCADA & IoT telemetry streams, sector-specific operational modules, and departmental monitoring. |
| **Analytics Workspace** | `/dashboard/analytics` | Cross-departmental correlation heatmaps, MTBF drift detection, comparative metric trendlines, and risk velocity distributions. |
| **Governance Workspace (GRC)** | `/dashboard/governance` | Statutory regulatory compliance matrix (ISO/NIST/Basel/HIPAA), board-ready audit pack exports, and multi-tier signoff workflows. |
| **Administration Workspace** | `/dashboard/administration` | Granular Level 1–5 RBAC user provisioning, tamper-evident cryptographic security audit ledger, and tenant configuration. |

---

## 🏢 7 Flagship Enterprise Sectors

ORBIS provides bespoke telemetry pipelines, risk thresholds, role taxonomies, and compliance mappings tailored to 7 flagship economic sectors:

| Sector | ID | Color | Roles | Standards | Core Telemetry & Surveillance Metrics |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Healthcare & Hospital System** | `hospital` | `#0B6EFD` | 10 Roles | HIPAA, ISO 13485, Joint Commission | Clinical error rate, ICU ventilator telemetry, sepsis early detection, medication interaction matrix. |
| **Industrial Manufacturing & Plants** | `manufacturing` | `#FF6B00` | 7 Roles | ISO 9001, OSHA, Six Sigma | Predictive machine bearing wear, assembly line downtime, OEE efficiency, robotic drift. |
| **Technology, Cloud & Software Enterprise** | `it` | `#7B61FF` | 6 Roles | SOC 2 Type II, ISO 27001, FedRAMP | Microservice P99 latency, container escape risk, API anomaly velocity, zero-day threat telemetry. |
| **Banking & Financial Institution** | `bank` | `#0A2342` | 6 Roles | Basel III, FINRA, SOX, Dodd-Frank | Tier-1 capital adequacy, liquidity coverage ratio (LCR), algorithmic spoofing, fraud anomaly velocity. |
| **University & Research Institute** | `university` | `#059669` | 5 Roles | FERPA, Title IX, NSF Guidelines | Campus safety incidents, grant compliance integrity, hazardous lab containment, academic tenure data. |
| **Sovereign Government & Public Sector** | `government` | `#1E293B` | 5 Roles | FISMA, FedRAMP High, NIST 800-53 | Citizen privacy breach exposure, critical public service uptime, inter-agency classified clearance. |
| **Energy, Grid & Utilities** | `energy` | `#15803D` | 3 Roles | NERC CIP, IEC 62443, FERC | SCADA grid frequency balance, transformer harmonic drift, interconnect stability, blackout resilience. |

---

## ⚡ Key Platform Capabilities

<table align="center" width="100%">
  <tr>
    <td width="50%" valign="top">
      <h3>🛡️ Zero-Trust Security & OWASP Sentry</h3>
      <ul>
        <li><b>Lattice-Based HMAC Session Tokens</b>: 8-hour cryptographic validity with multi-field tamper detection.</li>
        <li><b>Adaptive Brute-Force Defense</b>: 5-attempt sliding rate limiting with automatic 45-second lockout cooling.</li>
        <li><b>Strict Cross-Tenant Sieve</b>: Zero leakage across enterprise institutions; all queries strictly partitioned.</li>
        <li><b>Safe Evidence Sieve</b>: MIME verification & blocking of 18 dangerous executable/script extensions (<code>.exe</code>, <code>.bat</code>, <code>.ps1</code>, <code>.sh</code>, <code>.dll</code>, <code>.py</code>, etc.).</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🧠 Cognitive AI Copilot (NVIDIA Nemotron-3)</h3>
      <ul>
        <li><b>120B Parameter Reasoning</b>: Enterprise Sentinel reasoning over unstructured incident logs and SCADA telemetry.</li>
        <li><b>Universal Role-Aware Greetings</b>: Streamlined greetings personalized to operator name, organization, and clearance role.</li>
        <li><b>Rich Markdown Engine</b>: Clean bold formatting (<code>**bold**</code>) without raw syntax asterisks or vendor leakage.</li>
        <li><b>Resilient Offline Fallback</b>: Dual-channel endpoint cascade with instantaneous heuristic failover cache.</li>
        <li><b>Persistent Serverless Sync</b>: Real-time contextual thread synchronization with PostgreSQL Neon.</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>📈 Quantitative Risk Engine & 5x5 Matrix</h3>
      <ul>
        <li><b>Dynamic Continuous Scoring</b>: Normalized impact and likelihood scoring across custom departmental risk thresholds.</li>
        <li><b>Monte Carlo Scenario Horizon</b>: 30-day failure probability projections and anomaly confidence bounds.</li>
        <li><b>Mean Time Between Failures (MTBF)</b>: Real-time drift detection and automated threshold excursion alerts.</li>
        <li><b>Executive Heatmap Clustering</b>: Categorical risk distribution across financial, cyber, operational, and human vectors.</li>
      </ul>
    </td>
    <td width="50%" valign="top">
      <h3>🔍 Explainable AI (SHAP) & Regulatory GRC</h3>
      <ul>
        <li><b>Transparent Feature Attribution</b>: Positive and negative SHAP weight drivers for every predictive model decision.</li>
        <li><b>Automated Audit Pack Generation</b>: Single-click export of board-ready statutory compliance packets.</li>
        <li><b>Audit Trail Immutability</b>: Real-time cryptographic ledger recording security events, key rotations, and access logs.</li>
        <li><b>Role-Based Clearance (RBAC)</b>: Granular Level 1 (Auditor) to Level 5 (Super Admin) feature segregation.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🎨 Dynamic Theming & Architectural Corridor Portal

ORBIS features an institutional visual experience engineered for 24/7 command center operations:

- **Dynamic Tenant Theme Scoping (`data-org`)**: The entire UI dynamically re-tints its primary, secondary, and accent palettes based on the active enterprise sector (e.g., Azure for Healthcare, Amber for Manufacturing, Cyber Violet for IT, Navy for Banking).
- **Comprehensive Dual Themes (`data-theme="light"` / `data-theme="dark"`)**:
  - **Sovereign Dark**: Deep obsidian glassmorphism, glowing micro-accents, and low-eye-strain command telemetry.
  - **Executive Light**: Crisp high-contrast surfaces, harmonized borders, and clean readability without contrast clashes.
- **Photorealistic Architectural Corridor Portal**: 3D geometric corridor backdrop on the login and verification portals, blending real-time organization lighting and depth perspective.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Presentation Tier (React 19 + TypeScript + Vite)"]
        UI["Executive Dashboard & Multi-Tenant Workspaces"]
        CopilotUI["Floating AI Copilot (NVIDIA Nemotron-3 Interface)"]
        Visuals["Recharts Matrix Heatmaps & Framer Motion Canvas"]
    end

    subgraph Intelligence ["Central Organizational Intelligence Core"]
        DataHub["Organizational Data Hub (Immutable Event Pipeline)"]
        KPIEngine["KPI Engine (Health, HR, Finance, Risk, GRC)"]
        RulesEngine["Business Rules Engine (Automated Cascades & Alerts)"]
        AnalyticsEngine["Analytics Engine (Root Driver Synthesis)"]
        PredictionEngine["Prediction Engine (30d Regression & Bayesian Bands)"]
        AIContext["AI Context Builder (Live State Enriched Prompts)"]
    end

    subgraph Security ["Zero-Trust Security & Governance Tier"]
        AuthSentry["Client Rate Limiter (Brute-Force Lockdown)"]
        CryptoSession["Cryptographic Lattice HMAC Signature Generator"]
        TenantGuard["Strict Cross-Tenant Isolation Sentry"]
        FileSieve["Safe Evidence Attachment & MIME Validator"]
    end

    subgraph AI ["Supercomputing AI Intelligence Tier"]
        Nemotron["NVIDIA Nemotron-3 Super 120B Model"]
        XAI["SHAP Explainability & Decision Attribution Engine"]
        LocalCache["Heuristic Diagnostic Fallback Engine"]
    end

    subgraph Persistence ["Decoupled Cloud & Serverless Data Tier"]
        NeonDB[("Neon PostgreSQL Serverless (Incidents, Messages, Profiles)")]
        Supabase[("Supabase Object Storage (Evidence Media, Avatars)")]
        Firebase[("Firebase Authentication & Identity Vault")]
    end

    UI -->|Module Activities & Events| DataHub
    DataHub --> KPIEngine
    DataHub --> RulesEngine
    DataHub --> AnalyticsEngine
    DataHub --> PredictionEngine
    DataHub --> AIContext

    KPIEngine -->|Calculated Metrics| UI
    RulesEngine -->|Triggered Alerts| UI
    AnalyticsEngine -->|Business Insights| UI
    PredictionEngine -->|Forecast Trajectories| UI
    AIContext --> CopilotUI

    UI --> AuthSentry --> CryptoSession --> TenantGuard
    TenantGuard --> NeonDB
    FileSieve --> Supabase
    CopilotUI --> Nemotron --> XAI
    Nemotron -.->|Offline Failover| LocalCache
    UI --> Firebase
```

---

## 🔒 Zero-Trust Security Matrix

The ORBIS security posture adheres to strict zero-trust principles across all 7 stages of user interaction:

```
[1. Cinematic Sovereign Gate]
             │
             ▼
[2. Tenant Selection (7 Flagship Sectors)] ──► Clears mismatched foreign session credentials
             │
             ▼
[3. Role Clearance Level (1–5)]            ──► Re-signs cryptographic session with sanitized role
             │
             ▼
[4. Authentication (Email / SSO)]          ──► Enforces 5-attempt sliding brute-force rate limiter
             │
             ▼
[5. Quantum Biometric Handshake]           ──► Validates capacitive ridge & neural behavioral seed
             │
             ▼
[6. Institutional Key (PIN)]               ──► Issues tamper-evident 8-hour HMAC signed session
             │
             ▼
[7. Protected Master Workspace]            ──► Strict route guards & tenant data partition checks
```

---

## 🧪 Test Suite & Verification

The ORBIS platform includes a comprehensive, automated test suite built on Vitest and happy-dom, with **626 test cases passing at a 100% success rate across 7 test suites**:

```bash
 RUN  v5.0.4

 ✓ src/test/securityService.test.ts              142 tests passing (32ms)
 ✓ src/test/incidentAndCompliance.test.ts        115 tests passing (12ms)
 ✓ src/test/platformConfig.test.ts              197 tests passing (18ms)
 ✓ src/test/riskCalculationsAndState.test.ts      84 tests passing (13ms)
 ✓ src/test/nvidiaNemotronService.test.ts         43 tests passing (22ms)
 ✓ src/test/supabaseStorage.test.ts               30 tests passing (39ms)
 ✓ src/test/organizationalIntelligence.test.ts    15 tests passing (32ms)

 Test Files  7 passed (7)
      Tests  626 passed (626)
   Duration  1.06s
```

### Production Build Verification
```bash
> tsc -b && vite build
✓ 2971 modules transformed.
✓ built in 9.90s (Exit code: 0)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Modern Chromium / WebKit / Firefox browser

### 1. Clone & Install
```bash
git clone https://github.com/Sofiya-jahan/ORBIS.git
cd ORBIS
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:
```env
# Firebase Authentication
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app

# PostgreSQL Neon Database
VITE_NEON_DATABASE_URL=postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require

# Supabase Storage
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# NVIDIA Nemotron-3 Supercomputing AI
VITE_NVIDIA_API_KEY=nvapi-your_key
VITE_NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
VITE_NVIDIA_MODEL=nvidia/nemotron-3-super-120b-a12b
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Execute Full Test Suite
```bash
npm test
```

### 5. Production Compilation
```bash
npm run build
```

---

## 🔑 Default Institutional Credentials (Evaluation Mode)

For sandboxed institutional evaluation and demonstrations:
- **Demo Email**: `executive@hospital.orbis.ai` (or any valid email)
- **Demo Password**: `enterprise2026`
- **Master Institutional PIN**: `123456`

---

## 📄 License & Attribution

Distributed under the **Proprietary Institutional License**. Copyright © 2026 ORBIS Governance Systems. All Rights Reserved.

<div align="center">
  <sub>Engineered with precision for global sovereign resilience and zero-trust organizational intelligence.</sub>
</div>
