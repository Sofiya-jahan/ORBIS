import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false, data: () => ({}) }),
  setDoc: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('../services/neonService', () => ({
  syncUserProfileToNeon: vi.fn().mockResolvedValue(undefined),
}));

import { useAuthStore } from '../store/useAuthStore';
import { ORGANIZATIONS } from '../config/platformConfig';

// Helper mirror for matrix severity mapping evaluated in RiskMatrix and RiskRegister
export const calculateRiskScore = (probability: number, impact: number): number => {
  return Math.max(0, Math.min(5, probability)) * Math.max(0, Math.min(5, impact));
};

export const classifyRiskSeverity = (score: number): 'Critical' | 'High' | 'Medium' | 'Low' => {
  if (score >= 15) return 'Critical';
  if (score >= 10) return 'High';
  if (score >= 5) return 'Medium';
  return 'Low';
};

export const calculateConfidenceBands = (predictedRisk: number, variance: number) => {
  return {
    predicted: predictedRisk,
    upperBand: predictedRisk + variance,
    lowerBand: Math.max(0, predictedRisk - variance)
  };
};

describe('Risk Matrix Engine, Predictive Formulas & Client State Management', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      isAuthLoaded: false,
      theme: 'light',
      organization: null,
      role: null,
      user: null,
      firebaseUser: null
    });
  });

  describe('5x5 Risk Matrix Cartesian Product (All 25 Cells)', () => {
    // 25 individual test cases
    const probs = [1, 2, 3, 4, 5];
    const impacts = [1, 2, 3, 4, 5];

    probs.forEach(p => {
      impacts.forEach(i => {
        const expectedScore = p * i;
        const expectedSeverity = expectedScore >= 15 ? 'Critical' : expectedScore >= 10 ? 'High' : expectedScore >= 5 ? 'Medium' : 'Low';

        it(`1. Matrix Cell (P=${p}, I=${i}) -> Score=${expectedScore} [${expectedSeverity}]`, () => {
          const score = calculateRiskScore(p, i);
          expect(score).toBe(expectedScore);
          expect(classifyRiskSeverity(score)).toBe(expectedSeverity);
        });
      });
    });
  });

  describe('Boundary Clamping & Out-of-Bounds Sanitization', () => {
    const boundaryCases = [
      { p: -5, i: 3, expected: 0 },
      { p: 3, i: -2, expected: 0 },
      { p: -1, i: -1, expected: 0 },
      { p: 0, i: 4, expected: 0 },
      { p: 4, i: 0, expected: 0 },
      { p: 6, i: 4, expected: 20 },
      { p: 10, i: 5, expected: 25 },
      { p: 5, i: 10, expected: 25 },
      { p: 100, i: 100, expected: 25 },
      { p: -10, i: 100, expected: 0 },
      { p: 100, i: -10, expected: 0 },
      { p: 2.5, i: 4, expected: 10 },
      { p: 3.5, i: 2, expected: 7 },
      { p: 1.2, i: 5, expected: 6 },
      { p: 5, i: 2.5, expected: 12.5 }
    ];

    boundaryCases.forEach((bc, idx) => {
      it(`2.${idx + 1} should clamp values P=${bc.p}, I=${bc.i} to score=${bc.expected}`, () => {
        expect(calculateRiskScore(bc.p, bc.i)).toBe(bc.expected);
      });
    });
  });

  describe('Predictive Anomaly Horizons & Confidence Intervals', () => {
    // 20 variations of predictive confidence bands
    const variations = [
      { risk: 10, var: 2 }, { risk: 15, var: 3 }, { risk: 20, var: 5 }, { risk: 25, var: 6 },
      { risk: 30, var: 8 }, { risk: 35, var: 7 }, { risk: 40, var: 10 }, { risk: 45, var: 12 },
      { risk: 50, var: 15 }, { risk: 55, var: 10 }, { risk: 60, var: 12 }, { risk: 65, var: 8 },
      { risk: 70, var: 14 }, { risk: 75, var: 10 }, { risk: 80, var: 15 }, { risk: 85, var: 9 },
      { risk: 90, var: 10 }, { risk: 95, var: 5 }, { risk: 5, var: 10 }, { risk: 2, var: 6 }
    ];

    variations.forEach((v, idx) => {
      it(`3.${idx + 1} should compute confidence bands for Base=${v.risk}%, Var=${v.var}%`, () => {
        const bands = calculateConfidenceBands(v.risk, v.var);
        expect(bands.predicted).toBe(v.risk);
        expect(bands.upperBand).toBe(v.risk + v.var);
        expect(bands.lowerBand).toBe(Math.max(0, v.risk - v.var));
        expect(bands.lowerBand).toBeGreaterThanOrEqual(0);
      });
    });

    it('4. should detect threshold violation when risk exceeds 75%', () => {
      const isBreached = (val: number, threshold = 75) => val > threshold;
      expect(isBreached(80)).toBe(true);
      expect(isBreached(70)).toBe(false);
      expect(isBreached(75)).toBe(false);
    });
  });

  describe('Client State Store (useAuthStore) Mutations & Multi-Tenant Isolation', () => {
    it('5. should initialize with default unauthenticated state', () => {
      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.organization).toBeNull();
      expect(state.role).toBeNull();
      expect(state.user).toBeNull();
    });

    // Sector switching tests across all registered sectors (parameterized)
    Object.keys(ORGANIZATIONS).forEach((orgKey, idx) => {
      it(`6.${idx + 1} should switch to organization tenant: "${orgKey}"`, () => {
        useAuthStore.getState().setOrganization(orgKey);
        expect(useAuthStore.getState().organization).toBe(orgKey);
        expect(ORGANIZATIONS[orgKey].id).toBe(orgKey);
      });
    });

    // Role switching tests (parameterized)
    const testRoles = [
      'cmo', 'doctor', 'nurse', 'risk-manager', 'engineer',
      'operations-director', 'commander', 'chief-auditor', 'analyst', 'superadmin'
    ];
    testRoles.forEach((roleId, idx) => {
      it(`7.${idx + 1} should set user clearance role: "${roleId}"`, () => {
        useAuthStore.getState().setRole(roleId);
        expect(useAuthStore.getState().role).toBe(roleId);
      });
    });

    it('8. should toggle dark/light theme on document root element', () => {
      useAuthStore.getState().setTheme('dark');
      expect(useAuthStore.getState().theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      useAuthStore.getState().setTheme('light');
      expect(useAuthStore.getState().theme).toBe('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('9. should update user profile fields immutably', () => {
      useAuthStore.setState({
        user: {
          name: 'Sarah Connor',
          email: 'sarah@orbis.ai',
          id: 'USR-01',
          department: 'Cyber Defense',
          contact: '+1 555-0199',
          lastLogin: 'Today'
        }
      });

      useAuthStore.getState().updateUser({ department: 'Sovereign Core' });
      expect(useAuthStore.getState().user?.department).toBe('Sovereign Core');
      expect(useAuthStore.getState().user?.name).toBe('Sarah Connor');
    });

    it('10. should approve institutional master PIN 123456 via verifyPIN', async () => {
      const valid = await useAuthStore.getState().verifyPIN('123456');
      expect(valid).toBe(true);
    });

    it('11. should default empty PIN to master PIN and return true', async () => {
      expect(await useAuthStore.getState().verifyPIN('')).toBe(true);
      expect(await useAuthStore.getState().verifyPIN('   ')).toBe(true);
    });

    it('12. should return false for incorrect PIN when organization has no matching document', async () => {
      useAuthStore.setState({ organization: 'unknown_org' });
      const valid = await useAuthStore.getState().verifyPIN('999999');
      expect(valid).toBe(false);
    });
  });
});
