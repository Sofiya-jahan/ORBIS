import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DEFAULT_BUCKET,
  uploadProfileAvatar,
  uploadIncidentEvidence,
  uploadImageToSupabase,
  supabase
} from '../services/supabaseStorage';

describe('Supabase Object Storage & Asset Management Service Comprehensive Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('Storage Configuration & Default Bucket', () => {
    it('1. should declare DEFAULT_BUCKET as orbis-images', () => {
      expect(DEFAULT_BUCKET).toBe('orbis-images');
    });

    it('2. should verify supabase client is instantiated', () => {
      expect(supabase).toBeDefined();
      expect(supabase.storage).toBeDefined();
      expect(typeof supabase.storage.from).toBe('function');
    });
  });

  describe('Avatar Path Generation Across Multiple User ID Patterns', () => {
    // 10 distinct user IDs with diverse formatting (10 test cases)
    const testUserIds = [
      'user-101', 'executive_cmo', 'dr.watson@hospital.org', 'sec-ops#99',
      'dev+lead@orbis.ai', 'admin 2026', 'root/superuser', 'usr:9981',
      'analyst!alpha', 'clearance-lvl-5'
    ];

    testUserIds.forEach((uid, idx) => {
      it(`3.${idx + 1} should sanitize and format avatar path for user: "${uid}"`, async () => {
        let uploadedPath = '';
        vi.spyOn(supabase.storage, 'from').mockImplementation(() => {
          return {
            upload: vi.fn().mockImplementation(async (path: string) => {
              uploadedPath = path;
              return { data: { path }, error: null };
            }),
            getPublicUrl: vi.fn().mockImplementation((path: string) => ({
              data: { publicUrl: `https://mock.supabase.co/storage/${path}` }
            }))
          } as any;
        });

        const file = new File(['binary'], 'avatar.png', { type: 'image/png' });
        const res = await uploadProfileAvatar(file, uid);
        expect(uploadedPath.startsWith('avatars/')).toBe(true);
        expect(uploadedPath).toMatch(/\.png$/);
        expect(uploadedPath.replace('avatars/', '')).not.toContain('/');
        expect(res.url).toContain('https://mock.supabase.co');
      });
    });

    // Parameterized image extensions (5 test cases)
    const extensions = ['png', 'jpg', 'jpeg', 'webp', 'gif'];
    extensions.forEach((ext, idx) => {
      it(`4.${idx + 1} should preserve file extension: .${ext}`, async () => {
        let uploadedPath = '';
        vi.spyOn(supabase.storage, 'from').mockImplementation(() => {
          return {
            upload: vi.fn().mockImplementation(async (path: string) => {
              uploadedPath = path;
              return { data: { path }, error: null };
            }),
            getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://mock.supabase.co' } })
          } as any;
        });

        const file = new File(['content'], `avatar.${ext}`, { type: `image/${ext}` });
        await uploadProfileAvatar(file, 'usr1');
        expect(uploadedPath.endsWith(`.${ext}`)).toBe(true);
      });
    });
  });

  describe('Incident Evidence Storage & Sanitization (10 Cases)', () => {
    const incidentIds = [
      'INC-2026-001', 'INC-SEC-09', 'INC/EMERGENCY', 'INC#CRITICAL',
      'INC.99', 'HAZARD-404', 'FAULT_LINE_A', 'SCADA-ALARM-01',
      'INCIDENT 55', 'INC@ORBIS'
    ];

    incidentIds.forEach((incId, idx) => {
      it(`5.${idx + 1} should format evidence path safely for incident: "${incId}"`, async () => {
        let uploadedPath = '';
        vi.spyOn(supabase.storage, 'from').mockImplementation(() => {
          return {
            upload: vi.fn().mockImplementation(async (path: string) => {
              uploadedPath = path;
              return { data: { path }, error: null };
            }),
            getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://mock.supabase.co' } })
          } as any;
        });

        const file = new File(['damage photo'], 'sensor_evidence.jpg', { type: 'image/jpeg' });
        await uploadIncidentEvidence(file, incId);
        expect(uploadedPath.startsWith('evidence/')).toBe(true);
        expect(uploadedPath).toMatch(/\.jpg$/);
        expect(uploadedPath).not.toContain('..');
      });
    });
  });

  describe('Storage Resilience & Fallback Cascading', () => {
    it('6. should fallback to secondary bucket when primary is uninitialized', async () => {
      const bucketsAttempted: string[] = [];
      vi.spyOn(supabase.storage, 'from').mockImplementation((b: string) => {
        return {
          upload: vi.fn().mockImplementation(async (path: string) => {
            bucketsAttempted.push(b);
            if (b === 'orbis-images') return { data: null, error: { message: 'Bucket missing' } };
            if (b === 'iprap-images') return { data: { path }, error: null };
            return { data: null, error: { message: 'Failed' } };
          }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://mock.supabase.co' } })
        } as any;
      });

      const file = new File(['data'], 'test.png', { type: 'image/png' });
      const res = await uploadImageToSupabase(file, 'test.png');
      expect(bucketsAttempted).toContain('orbis-images');
      expect(bucketsAttempted).toContain('iprap-images');
      expect(res.url).toBeDefined();
    });

    it('7. should fallback to local object preview URL when all cloud buckets fail', async () => {
      vi.spyOn(supabase.storage, 'from').mockImplementation(() => {
        return {
          upload: vi.fn().mockResolvedValue({ data: null, error: { message: 'Storage quota exceeded' } })
        } as any;
      });

      const file = new File(['local data'], 'test.png', { type: 'image/png' });
      const res = await uploadImageToSupabase(file, 'test.png');
      expect(res.url).toBeDefined();
      expect(res.error).toContain('Create a public bucket');
    });

    it('8. should set cacheControl header to 3600 and enable upsert', async () => {
      let passedOptions: any = null;
      vi.spyOn(supabase.storage, 'from').mockImplementation(() => {
        return {
          upload: vi.fn().mockImplementation(async (_path, _file, options) => {
            passedOptions = options;
            return { data: { path: 'cache.png' }, error: null };
          }),
          getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://mock.supabase.co' } })
        } as any;
      });

      const file = new File(['data'], 'cache.png', { type: 'image/png' });
      await uploadImageToSupabase(file, 'cache.png');
      expect(passedOptions?.cacheControl).toBe('3600');
      expect(passedOptions?.upsert).toBe(true);
    });
  });
});
