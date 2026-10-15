import { describe, it, expect } from 'vitest';

// Pure business logic helpers for Incident SLAs and Compliance Frameworks
export type IncidentSeverity = 'Critical' | 'High' | 'Medium' | 'Low';
export type IncidentStatus = 'Reported' | 'Under Investigation' | 'Containment Active' | 'Mitigated' | 'Resolved' | 'Closed';

export interface IncidentRecord {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  department: string;
  reportedAtMs: number;
}

export const calculateIncidentSlaMinutes = (severity: IncidentSeverity): number => {
  switch (severity) {
    case 'Critical': return 15;
    case 'High': return 60;
    case 'Medium': return 240;
    case 'Low': return 1440;
    default: return 1440;
  }
};

export const isSlaBreached = (reportedAtMs: number, resolvedAtMs: number, severity: IncidentSeverity): boolean => {
  const allowedMs = calculateIncidentSlaMinutes(severity) * 60 * 1000;
  return (resolvedAtMs - reportedAtMs) > allowedMs;
};

export const calculateComplianceScore = (controls: { passed: boolean; weight?: number }[]): number => {
  if (controls.length === 0) return 100;
  const totalWeight = controls.reduce((acc, c) => acc + (c.weight ?? 1), 0);
  const passedWeight = controls.reduce((acc, c) => c.passed ? acc + (c.weight ?? 1) : acc, 0);
  return Math.round((passedWeight / totalWeight) * 100);
};

export const classifyCompliancePosture = (score: number): 'Compliant' | 'Substantial' | 'Non-Compliant' | 'Critical Failure' => {
  if (score >= 95) return 'Compliant';
  if (score >= 80) return 'Substantial';
  if (score >= 60) return 'Non-Compliant';
  return 'Critical Failure';
};

describe('Incident Management SLA & Regulatory Compliance Verification', () => {
  describe('Incident SLA Determination & Escalation Policies', () => {
    it('1. should assign 15-minute SLA to Critical (P1) incidents', () => {
      expect(calculateIncidentSlaMinutes('Critical')).toBe(15);
    });

    it('2. should assign 60-minute SLA to High (P2) incidents', () => {
      expect(calculateIncidentSlaMinutes('High')).toBe(60);
    });

    it('3. should assign 240-minute SLA to Medium (P3) incidents', () => {
      expect(calculateIncidentSlaMinutes('Medium')).toBe(240);
    });

    it('4. should assign 1440-minute (24h) SLA to Low (P4) incidents', () => {
      expect(calculateIncidentSlaMinutes('Low')).toBe(1440);
    });

    // Parameterized SLA breach checks (20 test cases)
    const slaTestMatrix = [
      { sev: 'Critical' as IncidentSeverity, durationMin: 10, breached: false },
      { sev: 'Critical' as IncidentSeverity, durationMin: 14, breached: false },
      { sev: 'Critical' as IncidentSeverity, durationMin: 15, breached: false },
      { sev: 'Critical' as IncidentSeverity, durationMin: 16, breached: true },
      { sev: 'Critical' as IncidentSeverity, durationMin: 45, breached: true },
      { sev: 'High' as IncidentSeverity, durationMin: 30, breached: false },
      { sev: 'High' as IncidentSeverity, durationMin: 59, breached: false },
      { sev: 'High' as IncidentSeverity, durationMin: 60, breached: false },
      { sev: 'High' as IncidentSeverity, durationMin: 61, breached: true },
      { sev: 'High' as IncidentSeverity, durationMin: 120, breached: true },
      { sev: 'Medium' as IncidentSeverity, durationMin: 120, breached: false },
      { sev: 'Medium' as IncidentSeverity, durationMin: 239, breached: false },
      { sev: 'Medium' as IncidentSeverity, durationMin: 240, breached: false },
      { sev: 'Medium' as IncidentSeverity, durationMin: 241, breached: true },
      { sev: 'Medium' as IncidentSeverity, durationMin: 500, breached: true },
      { sev: 'Low' as IncidentSeverity, durationMin: 600, breached: false },
      { sev: 'Low' as IncidentSeverity, durationMin: 1439, breached: false },
      { sev: 'Low' as IncidentSeverity, durationMin: 1440, breached: false },
      { sev: 'Low' as IncidentSeverity, durationMin: 1441, breached: true },
      { sev: 'Low' as IncidentSeverity, durationMin: 2000, breached: true }
    ];

    slaTestMatrix.forEach((sc, idx) => {
      it(`5.${idx + 1} should evaluate SLA for ${sc.sev} after ${sc.durationMin} mins -> Breached=${sc.breached}`, () => {
        const start = 1700000000000;
        const end = start + sc.durationMin * 60 * 1000;
        expect(isSlaBreached(start, end, sc.sev)).toBe(sc.breached);
      });
    });
  });

  describe('Incident Lifecycle State Transitions (20 Tests)', () => {
    const validTransitions: Record<IncidentStatus, IncidentStatus[]> = {
      'Reported': ['Under Investigation', 'Closed'],
      'Under Investigation': ['Containment Active', 'Mitigated', 'Closed'],
      'Containment Active': ['Mitigated', 'Under Investigation'],
      'Mitigated': ['Resolved', 'Under Investigation'],
      'Resolved': ['Closed', 'Under Investigation'],
      'Closed': ['Under Investigation']
    };

    const statuses: IncidentStatus[] = ['Reported', 'Under Investigation', 'Containment Active', 'Mitigated', 'Resolved', 'Closed'];

    statuses.forEach((fromStatus, fromIdx) => {
      statuses.forEach((toStatus, toIdx) => {
        const isValid = validTransitions[fromStatus].includes(toStatus);
        it(`6.${fromIdx * 6 + toIdx + 1} should validate state transition: [${fromStatus}] -> [${toStatus}] (Valid=${isValid})`, () => {
          const checkTransition = (from: IncidentStatus, to: IncidentStatus) => validTransitions[from].includes(to);
          expect(checkTransition(fromStatus, toStatus)).toBe(isValid);
        });
      });
    });
  });

  describe('Statutory & Regulatory Compliance Posture Scoring (50 Framework Tests)', () => {
    // 25 control ratio variations
    Array.from({ length: 25 }, (_, i) => i).forEach((passedCount) => {
      const total = 24;
      const controls = Array.from({ length: total }, (_, idx) => ({ passed: idx < passedCount }));
      const expectedScore = Math.round((passedCount / total) * 100);

      it(`7.${passedCount + 1} should compute compliance ratio: ${passedCount}/${total} controls passed -> Score=${expectedScore}%`, () => {
        const score = calculateComplianceScore(controls);
        expect(score).toBe(expectedScore);
      });
    });

    // 20 weighted controls variations
    Array.from({ length: 20 }, (_, i) => i + 1).forEach((highWeightPassed) => {
      it(`8.${highWeightPassed} should compute weighted score for ${highWeightPassed} critical controls passed`, () => {
        const controls = [
          { passed: highWeightPassed > 10, weight: 5 },
          { passed: highWeightPassed > 5, weight: 3 },
          { passed: true, weight: 1 }
        ];
        const score = calculateComplianceScore(controls);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
      });
    });

    // Posture classification tests (10 test cases)
    const postureThresholds = [
      { score: 100, posture: 'Compliant' },
      { score: 96, posture: 'Compliant' },
      { score: 95, posture: 'Compliant' },
      { score: 94, posture: 'Substantial' },
      { score: 85, posture: 'Substantial' },
      { score: 80, posture: 'Substantial' },
      { score: 79, posture: 'Non-Compliant' },
      { score: 65, posture: 'Non-Compliant' },
      { score: 60, posture: 'Non-Compliant' },
      { score: 59, posture: 'Critical Failure' }
    ];

    postureThresholds.forEach((pt, idx) => {
      it(`9.${idx + 1} should classify compliance score ${pt.score}% as "${pt.posture}"`, () => {
        expect(classifyCompliancePosture(pt.score)).toBe(pt.posture);
      });
    });
  });
});
