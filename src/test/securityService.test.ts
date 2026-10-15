import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateCryptoId,
  createSecuritySession,
  verifySecuritySession,
  clearSecuritySession,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  sanitizeInput,
  isSuspiciousInput,
  validateFileUpload,
  logSecurityEvent,
  getSecurityLogs,
  clearSecurityLogs,
  updateSecuritySessionRole,
  isSessionValidForTenant,
  type SecurityEventType,
  type SecuritySeverity
} from '../services/securityService';

describe('Zero-Trust Security Service Comprehensive Test Suite', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Cryptographic ID Generation (Length & Character Set Permutations)', () => {
    it('1. should generate a valid non-empty string', () => {
      const id = generateCryptoId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('2. should adhere to default 24 character length', () => {
      expect(generateCryptoId().length).toBe(24);
    });

    // Parameterized test for lengths 1 through 30 (30 test cases)
    Array.from({ length: 30 }, (_, i) => i + 1).forEach((len, idx) => {
      it(`3.${idx + 1} should accurately generate cryptographic ID with length = ${len}`, () => {
        const id = generateCryptoId(len);
        expect(id.length).toBe(len);
        expect(/^[0-9a-f]+$/i.test(id)).toBe(true);
      });
    });

    it('4. should produce 100 unique random identifiers without collision', () => {
      const ids = new Set(Array.from({ length: 100 }, () => generateCryptoId(24)));
      expect(ids.size).toBe(100);
    });
  });

  describe('Session Token Creation, Expiry & Signature Verification', () => {
    it('5. should create a valid security session with sec_ prefix', () => {
      const token = createSecuritySession('defense', 'officer', 'officer@orbis.ai');
      expect(token).toMatch(/^sec_/);
    });

    it('6. should store session in sessionStorage under orbis_sec_session', () => {
      createSecuritySession('banking', 'cmo', 'cmo@orbis.ai');
      const raw = sessionStorage.getItem('orbis_sec_session');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw!);
      expect(parsed.organization).toBe('banking');
      expect(parsed.role).toBe('cmo');
      expect(parsed.userEmail).toBe('cmo@orbis.ai');
    });

    it('7. should set verification keys in sessionStorage', () => {
      createSecuritySession('healthcare', 'doctor');
      expect(sessionStorage.getItem('orbis_key_verified')).toBe('true');
      expect(sessionStorage.getItem('iprap_key_verified')).toBe('true');
    });

    it('8. should successfully verify a newly issued valid session', () => {
      createSecuritySession('energy', 'engineer', 'lead@orbis.ai');
      const check = verifySecuritySession();
      expect(check.valid).toBe(true);
      expect(check.session?.organization).toBe('energy');
      expect(check.session?.role).toBe('engineer');
    });

    it('9. should compute and verify a valid HMAC signature', () => {
      createSecuritySession('defense', 'commander');
      const check = verifySecuritySession();
      expect(check.valid).toBe(true);
      expect(check.session?.signature).toBeDefined();
      expect(check.session?.signature.length).toBeGreaterThan(0);
    });

    // Tampering tests across distinct session fields (6 test cases)
    const tamperingFields = ['organization', 'role', 'userEmail', 'sessionId', 'issuedAt', 'expiresAt'];
    tamperingFields.forEach((field, idx) => {
      it(`10.${idx + 1} should detect cryptographic tampering when field "${field}" is altered`, () => {
        createSecuritySession('defense', 'commander', 'admiral@orbis.ai');
        const raw = sessionStorage.getItem('orbis_sec_session');
        const parsed = JSON.parse(raw!);
        if (typeof parsed[field] === 'number') {
          parsed[field] += 5000;
        } else {
          parsed[field] = `${parsed[field]}_tampered`;
        }
        sessionStorage.setItem('orbis_sec_session', JSON.stringify(parsed));
        const check = verifySecuritySession();
        expect(check.valid).toBe(false);
      });
    });

    it('11. should invalidate session when token has passed expiry timestamp', () => {
      createSecuritySession('defense', 'operator');
      const raw = sessionStorage.getItem('orbis_sec_session');
      const parsed = JSON.parse(raw!);
      parsed.expiresAt = Date.now() - 1000;
      sessionStorage.setItem('orbis_sec_session', JSON.stringify(parsed));

      const check = verifySecuritySession();
      expect(check.valid).toBe(false);
      expect(check.reason).toBe('Session expired. Please re-verify security key.');
    });

    it('12. should fail verification when no session exists in storage', () => {
      const check = verifySecuritySession();
      expect(check.valid).toBe(false);
      expect(check.reason).toBe('No active institutional session found');
    });

    it('13. should support legacy iprap_key_verified fallback when session payload absent', () => {
      sessionStorage.setItem('iprap_key_verified', 'true');
      const check = verifySecuritySession();
      expect(check.valid).toBe(true);
    });

    it('14. should support orbis_key_verified fallback when session payload absent', () => {
      sessionStorage.setItem('orbis_key_verified', 'true');
      const check = verifySecuritySession();
      expect(check.valid).toBe(true);
    });

    it('15. should completely clear all session keys on clearSecuritySession', () => {
      createSecuritySession('defense', 'officer');
      clearSecuritySession();
      expect(sessionStorage.getItem('orbis_sec_session')).toBeNull();
      expect(sessionStorage.getItem('orbis_key_verified')).toBeNull();
      expect(sessionStorage.getItem('iprap_key_verified')).toBeNull();
    });
  });

  describe('Adaptive Rate Limiting & Lockout Counters', () => {
    it('16. should permit initial attempts under threshold', () => {
      const status = checkRateLimit('login_test', 5, 60000);
      expect(status.isLocked).toBe(false);
      expect(status.remainingAttempts).toBe(5);
    });

    // Step-by-step decrement tests (10 test cases)
    Array.from({ length: 10 }, (_, i) => i + 1).forEach((attempt) => {
      it(`17.${attempt} should record failed attempt #${attempt} with consistent remaining decrements`, () => {
        resetRateLimit('step_test');
        for (let i = 0; i < attempt; i++) {
          recordFailedAttempt('step_test', 12, 60000, 30000);
        }
        const state = checkRateLimit('step_test', 12, 60000);
        expect(state.remainingAttempts).toBe(12 - attempt);
      });
    });

    it('18. should trigger lockout when maximum allowed attempts are exhausted', () => {
      for (let i = 0; i < 4; i++) {
        recordFailedAttempt('auth_pin', 4, 60000, 45000);
      }
      const res = recordFailedAttempt('auth_pin', 4, 60000, 45000);
      expect(res.isLocked).toBe(true);
      expect(res.remainingAttempts).toBe(0);
      expect(res.retryAfterSec).toBeGreaterThan(0);
    });

    it('19. should reset rate limit counter upon successful invocation', () => {
      recordFailedAttempt('auth_pin', 3, 60000, 45000);
      recordFailedAttempt('auth_pin', 3, 60000, 45000);
      resetRateLimit('auth_pin');

      const fresh = checkRateLimit('auth_pin', 3, 60000);
      expect(fresh.remainingAttempts).toBe(3);
      expect(fresh.isLocked).toBe(false);
    });
  });

  describe('OWASP XSS & Malicious Injection Vectors', () => {
    // Malicious patterns recognized by the enterprise defense regex
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<script src="https://evil.org/payload.js"></script>',
      '<SCRIPT>console.log("XSS")</SCRIPT>',
      'javascript:void(0)',
      'javascript:alert(document.cookie)',
      '<img src="missing.png" onerror="alert(1)">',
      '<img src="missing.png" onerror = "alert(1)">',
      '<svg onload="alert(1)">',
      '<svg onload = "alert(1)">',
      '<button onclick="alert(1)">',
      '<button onclick = "alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<iframe src="https://phishing.site"></iframe>',
      'onload = alert(1)',
      'onerror = alert(1)',
      'onclick = alert(1)',
      'eval("malicious code")',
      'eval ("malicious code")',
      'eval(payload)',
      'document.cookie',
      'window.location',
      'window.location = "https://evil.com"',
      '<a href="javascript:stealTokens()">Click here</a>',
      '<iframe width="500">',
      '<script>document.cookie="session=compromised"</script>'
    ];

    xssPayloads.forEach((payload, idx) => {
      it(`20.${idx + 1} should detect malicious pattern: ${payload.slice(0, 35)}...`, () => {
        expect(isSuspiciousInput(payload)).toBe(true);
      });
    });

    it('21. should preserve safe standard enterprise queries and reports', () => {
      const safeQueries = [
        'Quarterly operational risk report for Board of Directors',
        'ISO 31000 Compliance Assessment - FY2026',
        'Sensor telemetry: MTBF is 1420 hours with 0 anomalies',
        'Hospital patient vitals within normal cardiovascular thresholds',
        'Bank Basel III tier-1 capital adequacy ratio: 14.8%'
      ];
      safeQueries.forEach(q => {
        expect(isSuspiciousInput(q)).toBe(false);
        expect(sanitizeInput(q)).toBe(q);
      });
    });

    it('22. should HTML-encode sensitive quote and bracket characters', () => {
      const input = 'Data: "Risk Alert" & \'Special Severity\'';
      const clean = sanitizeInput(input);
      expect(clean).toContain('&quot;');
      expect(clean).toContain('&#39;');
    });
  });

  describe('File Upload Security & Extension Sieve', () => {
    // 18 dangerous executable and script extensions tested individually (18 test cases)
    const dangerousExts = [
      'exe', 'bat', 'cmd', 'sh', 'bash', 'vbs', 'ps1',
      'js', 'jsx', 'ts', 'tsx', 'php', 'py', 'pl', 'rb',
      'html', 'htm', 'dll'
    ];

    dangerousExts.forEach((ext, idx) => {
      it(`23.${idx + 1} should block dangerous uploaded file with .${ext} extension`, () => {
        const file = new File(['content'], `exploit.${ext}`, { type: 'application/octet-stream' });
        const res = validateFileUpload(file);
        expect(res.valid).toBe(false);
        expect(res.error).toBeDefined();
      });
    });

    // Allowed MIME types (5 test cases)
    const allowedTypes = [
      { name: 'document.pdf', type: 'application/pdf' },
      { name: 'snapshot.png', type: 'image/png' },
      { name: 'chart.jpg', type: 'image/jpeg' },
      { name: 'telemetry.webp', type: 'image/webp' },
      { name: 'animation.gif', type: 'image/gif' }
    ];

    allowedTypes.forEach((f, idx) => {
      it(`24.${idx + 1} should permit valid upload with MIME: ${f.type}`, () => {
        const file = new File(['binary content'], f.name, { type: f.type });
        const res = validateFileUpload(file);
        expect(res.valid).toBe(true);
        expect(res.sanitizedName).toBe(f.name);
      });
    });

    it('25. should block files that exceed permissible size threshold', () => {
      const largeFile = new File([new Uint8Array(12 * 1024 * 1024)], 'dump.pdf', { type: 'application/pdf' });
      const res = validateFileUpload(largeFile, { maxSizeBytes: 10 * 1024 * 1024 });
      expect(res.valid).toBe(false);
      expect(res.error).toContain('File size exceeds');
    });
  });

  describe('Audit Logging, Rotation & Event Telemetry', () => {
    // Parameterized test across security event types (8 test cases)
    const eventTypes: SecurityEventType[] = [
      'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'KEY_VERIFIED',
      'KEY_REJECTED', 'RATE_LIMIT_TRIGGERED', 'SESSION_EXPIRED',
      'UNAUTHORIZED_ACCESS_BLOCKED', 'KEY_ROTATED'
    ];

    eventTypes.forEach((evt, idx) => {
      it(`26.${idx + 1} should accurately log security event: ${evt}`, () => {
        const entry = logSecurityEvent(evt, 'INFO', `Event detail for ${evt}`, 'operator@orbis.ai');
        expect(entry.eventType).toBe(evt);
        expect(entry.actor).toBe('operator@orbis.ai');
        expect(entry.id).toMatch(/^sec_/);
      });
    });

    // Parameterized test across severity tiers (3 test cases)
    const severities: SecuritySeverity[] = ['INFO', 'WARNING', 'CRITICAL'];
    severities.forEach((sev, idx) => {
      it(`27.${idx + 1} should assign correct severity tier: ${sev}`, () => {
        const entry = logSecurityEvent('KEY_VERIFIED', sev, `Audit tier ${sev}`);
        expect(entry.severity).toBe(sev);
      });
    });

    it('28. should dispatch custom browser events upon audit logging', () => {
      const listener = vi.fn();
      window.addEventListener('orbis:security_event', listener);
      logSecurityEvent('KEY_ROTATED', 'INFO', 'Lattice HMAC rotation complete');
      expect(listener).toHaveBeenCalled();
      window.removeEventListener('orbis:security_event', listener);
    });

    it('29. should clear all persisted audit logs cleanly', () => {
      logSecurityEvent('LOGIN_SUCCESS', 'INFO', 'Session active');
      clearSecurityLogs();
      const logs = getSecurityLogs();
      expect(logs.some(l => l.details === 'Session active')).toBe(false);
    });
  });

  describe('Multi-Tenant Data Isolation & Session Synchronization', () => {
    it('30.1 should dynamically update session role and recompute HMAC signature', () => {
      createSecuritySession('defense', 'commander', 'admiral@orbis.ai');
      const updated = updateSecuritySessionRole('general');
      expect(updated).toBe(true);

      const verify = verifySecuritySession();
      expect(verify.valid).toBe(true);
      expect(verify.session?.role).toBe('general');
    });

    it('30.2 should return false when updating role without active session', () => {
      clearSecuritySession();
      expect(updateSecuritySessionRole('admin')).toBe(false);
    });

    // Parameterized test across 13 enterprise tenants verifying cross-tenant containment (13 test cases)
    const allTenants = [
      'hospital', 'bank', 'insurance', 'it', 'startup',
      'manufacturing', 'energy', 'construction', 'logistics',
      'government', 'university', 'lawfirm', 'retail'
    ];

    allTenants.forEach((tenant, idx) => {
      it(`31.${idx + 1} should enforce strict isolation for tenant: ${tenant}`, () => {
        createSecuritySession(tenant, 'officer', `officer@${tenant}.orbis.ai`);
        
        // Positive validation: matches tenant
        expect(isSessionValidForTenant(tenant)).toBe(true);
        expect(isSessionValidForTenant(tenant.toUpperCase())).toBe(true);

        // Negative validation: blocked for foreign tenant
        const foreignTenant = allTenants[(idx + 1) % allTenants.length];
        expect(isSessionValidForTenant(foreignTenant)).toBe(false);
      });
    });

    it('32. should reject tenant validation for empty or null organization', () => {
      createSecuritySession('energy', 'engineer');
      expect(isSessionValidForTenant('')).toBe(false);
    });
  });
});
