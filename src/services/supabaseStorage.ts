import { createClient } from '@supabase/supabase-js';
import { validateFileUpload } from './securityService';

// Retrieve Supabase URL and Publishable Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
                    'https://rsnxfjlcbzqwzbpmveec.supabase.co';

const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
                    import.meta.env.VITE_SUPABASE_ANON_KEY || 
                    import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                    'sb_publishable_kC6AAs362N4uKrFhqehovw_7ueo9BXF';

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

export const DEFAULT_BUCKET = 'orbis-images';

/**
 * Upload an image file to Supabase Storage and retrieve its public URL
 */
export async function uploadImageToSupabase(
  file: File | Blob,
  path: string,
  bucket: string = DEFAULT_BUCKET
): Promise<{ url: string; error?: string }> {
  // Defense-in-depth security sieve for File objects
  if (typeof File !== 'undefined' && file instanceof File) {
    const sieve = validateFileUpload(file, { maxSizeBytes: 10 * 1024 * 1024 });
    if (!sieve.valid) {
      return { url: '', error: sieve.error || 'File failed security sieve' };
    }
  }

  // Prevent path traversal
  const cleanPath = path.replace(/\.\./g, '').replace(/^\/+/, '');

  try {
    // 1. Attempt upload to Supabase storage bucket
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(cleanPath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.warn(`Supabase Storage upload warning (${error.message}). Checking fallback...`, error);
      
      // If the bucket doesn't exist yet, we attempt with 'orbis-images', 'iprap-images', 'images' or 'public'
      const fallbackBuckets = ['orbis-images', 'iprap-images', 'images', 'public', 'media'];
      for (const fallback of fallbackBuckets) {
        if (fallback === bucket) continue;
        const retry = await supabase.storage.from(fallback).upload(path, file, { upsert: true });
        if (!retry.error) {
          const { data: publicData } = supabase.storage.from(fallback).getPublicUrl(path);
          return { url: publicData.publicUrl };
        }
      }

      // If buckets are uninitialized in the Supabase console, generate local object preview URL
      // so the user interface continues to function seamlessly without downtime
      const localDataUrl = await fileToDataUrl(file);
      return { 
        url: localDataUrl, 
        error: `Uploaded locally. Note: Create a public bucket '${bucket}' in your Supabase Dashboard > Storage to store files globally.`
      };
    }

    // 2. Retrieve public URL
    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicData.publicUrl };
  } catch (err: any) {
    console.error('Supabase Storage exception:', err);
    const localDataUrl = await fileToDataUrl(file);
    return { url: localDataUrl, error: err.message || 'Storage error' };
  }
}

/**
 * Upload a user avatar image to Supabase Storage
 */
export async function uploadProfileAvatar(file: File, userId: string): Promise<{ url: string; error?: string }> {
  const extension = file.name.split('.').pop() || 'png';
  const cleanId = userId.replace(/[^a-zA-Z0-9]/g, '_');
  const path = `avatars/${cleanId}_${Date.now()}.${extension}`;
  return uploadImageToSupabase(file, path, DEFAULT_BUCKET);
}

/**
 * Upload incident evidence image / screenshot to Supabase Storage
 */
export async function uploadIncidentEvidence(file: File, incidentId: string): Promise<{ url: string; error?: string }> {
  const extension = file.name.split('.').pop() || 'png';
  const cleanId = incidentId.replace(/[^a-zA-Z0-9]/g, '_');
  const path = `evidence/${cleanId}_${Date.now()}.${extension}`;
  return uploadImageToSupabase(file, path, DEFAULT_BUCKET);
}

/**
 * Utility helper to convert a File/Blob to a base64 Data URL for instant rendering
 */
function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}
