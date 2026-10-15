<div align="center">

  <img src="public/orbis-logo.png" alt="ORBIS Sovereign Intelligence Logo" width="140" style="border-radius: 28px; box-shadow: 0 0 45px rgba(59, 130, 246, 0.6); margin-bottom: 18px;" />

  # **O R B I S**
  ### **Organizational Risk and Business Intelligence System**

  <p align="center">
    <b>Next-Generation Cognitive Enterprise Risk Platform · Autonomous Multimodal Surveillance · Zero-Trust Multi-Tenant Governance</b>
  </p>

  <p align="center">
    <a href="#-system-architecture"><img src="https://img.shields.io/badge/System-ORBIS%20v2.6-00F2FE?style=for-the-badge&logo=shield" alt="System Version" /></a>
    <a href="#-test-suite--verification"><img src="https://img.shields.io/badge/Tests-678%20Passed%20(100%25)-10B981?style=for-the-badge&logo=vitest" alt="Test Suite" /></a>
    <a href="#-zero-trust-security-matrix"><img src="https://img.shields.io/badge/Security-Zero--Trust%20HMAC-E5C07B?style=for-the-badge&logo=auth0" alt="Security Clearance" /></a>
    <a href="#-cognitive-ai-copilot"><img src="https://img.shields.io/badge/AI%20Core-NVIDIA%20Nemotron--3-76B900?style=for-the-badge&logo=nvidia" alt="NVIDIA Core" /></a>
    <a href="#-data-layer"><img src="https://img.shields.io/badge/Database-PostgreSQL%20Neon-00E599?style=for-the-badge&logo=postgresql" alt="Neon Database" /></a>
  </p>

  <p align="center">
    <a href="#-executive-overview">Executive Overview</a> •
    <a href="#-key-platform-capabilities">Core Capabilities</a> •
    <a href="#-system-architecture">Architecture</a> •
    <a href="#-13-enterprise-industry-sectors">Industry Sectors</a> •
    <a href="#-zero-trust-security-matrix">Security Matrix</a> •
    <a href="#-test-suite--verification">Test Verification</a> •
    <a href="#-quick-start">Quick Start</a>
  </p>

</div>

---

## 🏛️ Executive Overview

**ORBIS (Organizational Risk and Business Intelligence System)** is an institutional-grade, cognitive enterprise risk surveillance and governance platform. Engineered for critical national infrastructure, global financial networks, defense aerospace, and healthcare conglomerates, ORBIS synthesizes real-time telemetry, quantitative stochastic modeling, and generative AI reasoning into a unified sovereign command dashboard.

ORBIS breaks organizational silos by combining:
- **Zero-Trust Multi-Tenant Isolation**: Cryptographic HMAC-signed sessions bound to tenant identity and role clearance.
- **Autonomous Multimodal Risk Quantification**: Continuous calculation of Severity, Probability, and Velocity ($R = I \times L \times V$) alongside Monte Carlo Value-at-Risk (VaR) distribution forecasts.
- **Cognitive AI Copilot**: Powered by NVIDIA's 120-billion parameter Nemotron-3 supercomputing model for prescriptive mitigation and live root-cause synthesis.
- **Explainable AI (XAI)**: Native SHAP (Shapley Additive exPlanations) attribution vectors to guarantee regulatory transparency under global AI governance statutes.
- **Global Regulatory Compliance**: Dynamic automated cross-mapping across **ISO 31000**, **NIST CSF 2.0**, **Basel III**, **HIPAA**, **GDPR**, and **SOC 2 Type II**.

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
        <li><b>Prescriptive Action Cards</b>: Automated mitigation work orders ranked by operational efficacy and latency.</li>
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

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph Client ["Client Presentation Tier (React 19 + TypeScript + Vite)"]
        UI["Executive Dashboard & Modern Dark Theme Canvas"]
        CopilotUI["Floating AI Copilot (NVIDIA Nemotron-3 Interface)"]
        Visuals["Recharts Matrix Heatmaps & Framer Motion Canvas"]
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

    UI --> AuthSentry --> CryptoSession --> TenantGuard
    TenantGuard --> NeonDB
    FileSieve --> Supabase
    CopilotUI --> Nemotron --> XAI
    Nemotron -.->|Offline Failover| LocalCache
    UI --> Firebase
```

---

## 🏢 13 Enterprise Industry Sectors

ORBIS provides bespoke telemetry pipelines, risk thresholds, role taxonomies, and compliance mappings tailored to 13 distinct global sectors:

| Sector | Code | Anchor Standards | Core Surveillance Metrics |
| :--- | :---: | :--- | :--- |
| **Healthcare & Life Sciences** | `hospital` | HIPAA, ISO 13485, Joint Commission | Clinical error rate, ICU telemetry drift, sepsis prediction |
| **Banking & Capital Markets** | `bank` | Basel III, FINRA, SOX | Tier-1 capital ratio, liquidity coverage, FX spoofing |
| **Critical Infrastructure & Energy** | `energy` | NERC CIP, IEC 62443, FERC | SCADA harmonic drift, interconnect stability, MTBF |
| **Defense & Aerospace** | `defense` | MIL-STD-882E, ITAR, DO-178C | Avionics packet timing, telemetry jitter, guidance drift |
| **Advanced Manufacturing** | `manufacturing` | ISO 9001, OSHA, Six Sigma | Assembly line downtime, robotic drift, defect density |
| **Cloud & Enterprise IT** | `it` | SOC 2 Type II, ISO 27001 | Microservice P99 latency, container escape risk, DDoS |
| **Insurance & Actuarial** | `insurance` | Solvency II, NAIC | Loss ratio, catastrophic climate exposure, claims anomaly |
| **Global Logistics & Supply Chain** | `logistics` | C-TPAT, ISO 28000 | Port bottleneck latency, container tamper, fuel variance |
| **Civil Infrastructure & Construction**| `construction`| OSHA 1926, ISO 45001 | Structural load tolerance, site safety violations |
| **Public Sector & Sovereign Government**| `government` | FedRAMP High, FISMA, NIST 800-53 | Citizen privacy breach, public service uptime |
| **Higher Education & Research** | `university` | FERPA, Title IX | Campus safety incidents, grant compliance, lab hazard |
| **Corporate Legal & Jurisprudence** | `lawfirm` | ABA Model Rules, GDPR | Regulatory compliance delta, contract breach exposure |
| **Global Omnichannel Retail** | `retail` | PCI-DSS v4.0, CCPA | Point-of-Sale tamper, inventory shrinkage, gateway fraud |

---

## 🔒 Zero-Trust Security Matrix

The ORBIS security posture adheres to strict zero-trust principles across all 7 stages of user interaction:

```
[1. Cinematic Sovereign Gate]
             │
             ▼
[2. Tenant Selection (13 Sectors)] ──► Clears mismatched foreign session credentials
             │
             ▼
[3. Role Clearance Level (1–5)]   ──► Re-signs cryptographic session with sanitized role
             │
             ▼
[4. Authentication (Email / SSO)] ──► Enforces 5-attempt sliding brute-force rate limiter
             │
             ▼
[5. Quantum Biometric Handshake]  ──► Validates capacitive ridge & neural behavioral seed
             │
             ▼
[6. Institutional Key (PIN)]      ──► Issues tamper-evident 8-hour HMAC signed session
             │
             ▼
[7. Protected Master Workspace]   ──► Strict route guards & tenant data partition checks
```

---

## 🧪 Test Suite & Verification

The ORBIS platform includes a comprehensive, automated test suite built on Vitest and happy-dom, with **678 test cases passing at a 100% success rate**:

```bash
 RUN  v5.0.4

 ✓ src/test/securityService.test.ts          142 tests passing (51ms)
 ✓ src/test/platformConfig.test.ts          252 tests passing (32ms)
 ✓ src/test/incidentAndCompliance.test.ts   115 tests passing (13ms)
 ✓ src/test/riskCalculationsAndState.test.ts 90 tests passing (10ms)
 ✓ src/test/nvidiaNemotronService.test.ts    49 tests passing (20ms)
 ✓ src/test/supabaseStorage.test.ts          30 tests passing (49ms)

 Test Files  6 passed (6)
      Tests  678 passed (678)
   Duration  926ms
```

### Production Build Verification
```bash
> tsc -b && vite build
✓ 3498 modules transformed.
✓ built in 13.50s (Exit code: 0)
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- Modern Chromium / WebKit / Firefox browser

### 1. Clone & Install
```bash
git clone https://github.com/Sofiya-jahan/Intelligent-Risk-Analytics-Platform-IPRAP-.git orbis
cd orbis
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
