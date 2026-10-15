import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildNemotronSystemPrompt, queryNemotron, type NemotronContext } from '../services/nvidiaNemotronService';
import { ORGANIZATIONS } from '../config/platformConfig';

describe('NVIDIA Nemotron-3 AI Copilot & Reasoning Service Comprehensive Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('buildNemotronSystemPrompt Construction Across All Sectors', () => {
    it('1. should construct system prompt identifying as ORBIS Enterprise Sentinel', () => {
      const prompt = buildNemotronSystemPrompt();
      expect(prompt).toContain('You are "ORBIS Enterprise Sentinel"');
      expect(prompt).toContain('Organizational Risk and Business Intelligence System (ORBIS)');
    });

    it('2. should declare NVIDIA Nemotron-3 Super 120B model', () => {
      expect(buildNemotronSystemPrompt()).toContain('nvidia/nemotron-3-super-120b-a12b');
    });

    // Test prompt building for every registered organization (parameterized)
    Object.keys(ORGANIZATIONS).forEach((orgKey, idx) => {
      it(`3.${idx + 1} should tailor system prompt for organization "${orgKey}"`, () => {
        const org = ORGANIZATIONS[orgKey];
        const context: NemotronContext = {
          organization: org,
          roleTitle: org.roles[0]?.title || 'Chief Officer',
          accessLevel: org.roles[0]?.accessLevel || 'Level 4 (Executive)',
          healthScore: org.healthScore,
          aiRiskScore: org.aiRiskScore
        };
        const prompt = buildNemotronSystemPrompt(context);
        expect(prompt).toContain(org.name);
        expect(prompt).toContain(org.sector);
        expect(prompt).toContain(`System Health Score: ${org.healthScore} / 100`);
        expect(prompt).toContain(`AI Risk Exposure Score: ${org.aiRiskScore}%`);
      });
    });

    it('4. should incorporate global statutory compliance standards', () => {
      const prompt = buildNemotronSystemPrompt();
      expect(prompt).toContain('ISO 31000');
      expect(prompt).toContain('NIST CSF 2.0');
      expect(prompt).toContain('Basel III');
    });

    it('5. should mandate explainable AI (XAI) and SHAP feature importance weights', () => {
      const prompt = buildNemotronSystemPrompt();
      expect(prompt).toContain('SHAP');
      expect(prompt).toContain('Shapley feature importance');
    });
  });

  describe('Heuristic Status Classification & Action Card Generation (30 Keywords)', () => {
    const statusTestCases = [
      { text: 'CRITICAL: Severe buffer overflow detected in primary pump.', expectedStatus: 'urgent' },
      { text: 'URGENT: SCADA grid link unreachable.', expectedStatus: 'urgent' },
      { text: 'Security breach detected on subnet 10.0.0.1.', expectedStatus: 'urgent' },
      { text: 'Imminent machine failure predicted within 30 minutes.', expectedStatus: 'urgent' },
      { text: 'Vulnerability exploit detected in telemetry port.', expectedStatus: 'urgent' },
      { text: 'Immediate quarantine required for node 4.', expectedStatus: 'urgent' },
      { text: 'High severity alert: transaction anomalous spike.', expectedStatus: 'urgent' },
      { text: 'Warning: Moderate model drift detected in forecasting model.', expectedStatus: 'warning' },
      { text: 'Caution: Thermal variance approaching upper tolerance.', expectedStatus: 'warning' },
      { text: 'Moderate anomaly detected in batch timing.', expectedStatus: 'warning' },
      { text: 'Predictive drift flagged on sensor 12.', expectedStatus: 'warning' },
      { text: 'Anomalous deviation in memory consumption.', expectedStatus: 'warning' },
      { text: 'System posture is nominal with zero unhandled excursions.', expectedStatus: 'optimal' },
      { text: 'All operational parameters within standard variance.', expectedStatus: 'optimal' },
      { text: 'Optimal health score maintained across all clusters.', expectedStatus: 'optimal' },
      { text: 'Regulatory posture 100% compliant with ISO 31000.', expectedStatus: 'optimal' },
      { text: 'Routine audit completed with zero violations.', expectedStatus: 'optimal' }
    ];

    statusTestCases.forEach((tc, idx) => {
      it(`6.${idx + 1} should classify text as status="${tc.expectedStatus}": "${tc.text.slice(0, 30)}..."`, async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
          ok: true,
          json: async () => ({
            choices: [{ message: { content: tc.text } }]
          })
        }));

        const res = await queryNemotron('Telemetry query');
        expect(res.actionCard?.status).toBe(tc.expectedStatus);
      });
    });
  });

  describe('Conversational History Trimming Across Variable Turn Lengths', () => {
    // Parameterized test for history lengths 0 to 12 (13 test cases)
    Array.from({ length: 13 }, (_, i) => i).forEach((turnCount) => {
      it(`7.${turnCount + 1} should handle history with ${turnCount} turns properly windowed`, async () => {
        let sentMessages: any[] = [];
        vi.stubGlobal('fetch', vi.fn().mockImplementation(async (_url, options) => {
          sentMessages = JSON.parse(options.body).messages;
          return {
            ok: true,
            json: async () => ({ choices: [{ message: { content: 'Acknowledged' } }] })
          };
        }));

        const history = Array.from({ length: turnCount }, (_, i) => ({
          sender: (i % 2 === 0 ? 'user' : 'ai') as 'user' | 'ai',
          text: `Message ${i}`
        }));

        await queryNemotron('Test turn', undefined, history);
        const expectedHistorySent = Math.min(turnCount, 6);
        // System prompt (1) + History (<=6) + Current Query (1)
        expect(sentMessages.length).toBe(1 + expectedHistorySent + 1);
      });
    });

    it('8. should return fallback response when all fetch endpoints fail', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network offline')));
      const res = await queryNemotron('Offline test');
      expect(res.text).toContain('Local Neural Fallback');
      expect(res.actionCard?.status).toBe('optimal');
    });

    it('9. should recover answer from reasoning_content when content is truncated', async () => {
      vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: '', reasoning_content: 'Chain of thought.\n\nFinal conclusion.' } }]
        })
      }));

      const res = await queryNemotron('Deep thought');
      expect(res.text).toContain('AI Risk Synthesis');
      expect(res.text).toContain('Final conclusion');
    });
  });
});
