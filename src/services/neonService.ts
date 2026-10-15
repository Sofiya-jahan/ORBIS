import { neon } from '@neondatabase/serverless';
import { sanitizeInput } from './securityService';

// Retrieve connection URL from environment variables
const dbUrl = import.meta.env.VITE_NEON_DATABASE_URL || 
              (import.meta.env as any).DATABASE_URL || 
              'postgresql://neondb_owner:npg_kSNuqR9CVw1s@ep-mute-paper-b3pzzhyv-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require';

// Initialize the Neon serverless HTTP client
export const sql = dbUrl ? neon(dbUrl) : null;

export interface NeonMessage {
  id: string;
  user_id?: string;
  organization?: string;
  role?: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  action_card?: any;
  created_at?: string;
}

export interface NeonIncident {
  id: string;
  title: string;
  department: string;
  severity: string;
  reporter: string;
  reported_at: string;
  status: string;
  root_cause: string;
  evidence_count: number;
  evidence_urls?: string[];
  organization: string;
  created_at?: string;
}

let tablesInitialized = false;

/**
 * Automatically ensures all required tables exist in the Neon database
 */
export async function initNeonTables(): Promise<boolean> {
  if (tablesInitialized) return true;
  if (!sql) {
    console.warn('Neon DB: Database URL not configured.');
    return false;
  }

  try {
    // 1. Messages table for AI Copilot and Operational Message Storage
    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100),
        organization VARCHAR(100),
        role VARCHAR(100),
        sender VARCHAR(20) NOT NULL,
        text TEXT NOT NULL,
        timestamp VARCHAR(50),
        action_card JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Incidents table for enterprise incident tracking & evidence
    await sql`
      CREATE TABLE IF NOT EXISTS incidents (
        id VARCHAR(100) PRIMARY KEY,
        title TEXT NOT NULL,
        department VARCHAR(100),
        severity VARCHAR(50),
        reporter VARCHAR(100),
        reported_at VARCHAR(100),
        status VARCHAR(50),
        root_cause TEXT,
        evidence_count INTEGER DEFAULT 0,
        evidence_urls JSONB DEFAULT '[]'::jsonb,
        organization VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. User Profiles table for synchronized profile data
    await sql`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id VARCHAR(100) PRIMARY KEY,
        email VARCHAR(255),
        name VARCHAR(255),
        organization VARCHAR(100),
        role VARCHAR(100),
        department VARCHAR(100),
        contact VARCHAR(100),
        photo_url TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    tablesInitialized = true;
    console.log('Neon DB: Schemas verified & synchronized.');
    return true;
  } catch (err) {
    console.error('Neon DB: Table initialization error:', err);
    return false;
  }
}

// -------------------------------------------------------------
// MESSAGE STORAGE API (Neon DB)
// -------------------------------------------------------------

/**
 * Save an AI or user message into Neon database
 */
export async function saveMessageToNeon(msg: {
  id: string;
  userId?: string;
  organization?: string;
  role?: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionCard?: any;
}): Promise<boolean> {
  if (!sql) return false;

  try {
    await initNeonTables();
    const actionCardJson = msg.actionCard ? JSON.stringify(msg.actionCard) : null;
    const cleanText = sanitizeInput(msg.text);
    const cleanOrg = sanitizeInput(msg.organization || 'general');
    const cleanRole = sanitizeInput(msg.role || 'operator');

    await sql`
      INSERT INTO messages (id, user_id, organization, role, sender, text, timestamp, action_card)
      VALUES (
        ${msg.id},
        ${msg.userId || 'anonymous'},
        ${cleanOrg},
        ${cleanRole},
        ${msg.sender},
        ${cleanText},
        ${msg.timestamp},
        ${actionCardJson ? actionCardJson : null}
      )
      ON CONFLICT (id) DO UPDATE SET
        text = EXCLUDED.text,
        action_card = EXCLUDED.action_card;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB: Failed to save message:', err);
    return false;
  }
}

/**
 * Load recent messages from Neon DB filtered strictly by organization (Tenant Segregation)
 */
export async function loadMessagesFromNeon(org?: string, limit: number = 50): Promise<NeonMessage[]> {
  if (!sql) return [];
  const targetOrg = org || 'general'; // Strict tenant isolation: never perform cross-tenant queries

  try {
    await initNeonTables();
    const rows = await sql`
      SELECT id, user_id, organization, role, sender, text, timestamp, action_card, created_at
      FROM messages
      WHERE organization = ${targetOrg}
      ORDER BY created_at ASC
      LIMIT ${limit};
    `;

    return (rows as any[]).map(r => ({
      id: r.id,
      user_id: r.user_id,
      organization: r.organization,
      role: r.role,
      sender: r.sender,
      text: r.text,
      timestamp: r.timestamp,
      action_card: typeof r.action_card === 'string' ? JSON.parse(r.action_card) : r.action_card,
      created_at: r.created_at
    }));
  } catch (err) {
    console.error('Neon DB: Failed to load messages:', err);
    return [];
  }
}

/**
 * Clear chat history strictly for an organization (Tenant Segregation Guard)
 */
export async function clearMessagesFromNeon(org?: string): Promise<boolean> {
  if (!sql || !org) {
    console.warn('Neon DB: Tenant identifier required for message purge. Global purge rejected.');
    return false;
  }

  try {
    await initNeonTables();
    await sql`DELETE FROM messages WHERE organization = ${org};`;
    return true;
  } catch (err) {
    console.error('Neon DB: Failed to clear messages:', err);
    return false;
  }
}

// -------------------------------------------------------------
// INCIDENT STORAGE API (Neon DB)
// -------------------------------------------------------------

/**
 * Save an incident into Neon DB with input sanitization
 */
export async function saveIncidentToNeon(incident: NeonIncident): Promise<boolean> {
  if (!sql) return false;

  try {
    await initNeonTables();
    const evidenceUrlsJson = JSON.stringify(incident.evidence_urls || []);
    const cleanTitle = sanitizeInput(incident.title);
    const cleanDept = sanitizeInput(incident.department);
    const cleanReporter = sanitizeInput(incident.reporter);
    const cleanRootCause = sanitizeInput(incident.root_cause);
    const cleanOrg = sanitizeInput(incident.organization || 'hospital');

    await sql`
      INSERT INTO incidents (
        id, title, department, severity, reporter, 
        reported_at, status, root_cause, evidence_count, 
        evidence_urls, organization
      ) VALUES (
        ${incident.id},
        ${cleanTitle},
        ${cleanDept},
        ${incident.severity},
        ${cleanReporter},
        ${incident.reported_at},
        ${incident.status},
        ${cleanRootCause},
        ${incident.evidence_count},
        ${evidenceUrlsJson},
        ${cleanOrg}
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        status = EXCLUDED.status,
        root_cause = EXCLUDED.root_cause,
        evidence_count = EXCLUDED.evidence_count,
        evidence_urls = EXCLUDED.evidence_urls;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB: Failed to save incident:', err);
    return false;
  }
}

/**
 * Load incidents from Neon DB strictly partitioned by organization
 */
export async function loadIncidentsFromNeon(org?: string): Promise<NeonIncident[]> {
  if (!sql) return [];
  const targetOrg = org || 'hospital'; // Strict tenant isolation: never return all organizations' incidents

  try {
    await initNeonTables();
    const rows = await sql`
      SELECT * FROM incidents
      WHERE organization = ${targetOrg}
      ORDER BY created_at DESC;
    `;

    return (rows as any[]).map(r => ({
      id: r.id,
      title: r.title,
      department: r.department,
      severity: r.severity,
      reporter: r.reporter,
      reported_at: r.reported_at,
      status: r.status,
      root_cause: r.root_cause,
      evidence_count: Number(r.evidence_count || 0),
      evidence_urls: typeof r.evidence_urls === 'string' ? JSON.parse(r.evidence_urls) : (r.evidence_urls || []),
      organization: r.organization,
      created_at: r.created_at
    }));
  } catch (err) {
    console.error('Neon DB: Failed to load incidents:', err);
    return [];
  }
}

// -------------------------------------------------------------
// USER PROFILE STORAGE API (Neon DB)
// -------------------------------------------------------------

/**
 * Sync user profile to Neon DB with input sanitization
 */
export async function syncUserProfileToNeon(user: {
  id: string;
  email?: string;
  name?: string;
  organization?: string;
  role?: string;
  department?: string;
  contact?: string;
  photoURL?: string;
}): Promise<boolean> {
  if (!sql) return false;

  try {
    await initNeonTables();
    const cleanName = sanitizeInput(user.name || '');
    const cleanEmail = sanitizeInput(user.email || '');
    const cleanOrg = sanitizeInput(user.organization || '');
    const cleanRole = sanitizeInput(user.role || '');
    const cleanDept = sanitizeInput(user.department || '');
    const cleanContact = sanitizeInput(user.contact || '');

    await sql`
      INSERT INTO user_profiles (id, email, name, organization, role, department, contact, photo_url, updated_at)
      VALUES (
        ${user.id},
        ${cleanEmail},
        ${cleanName},
        ${cleanOrg},
        ${cleanRole},
        ${cleanDept},
        ${cleanContact},
        ${user.photoURL || ''},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = EXCLUDED.name,
        organization = EXCLUDED.organization,
        role = EXCLUDED.role,
        department = EXCLUDED.department,
        contact = EXCLUDED.contact,
        photo_url = EXCLUDED.photo_url,
        updated_at = CURRENT_TIMESTAMP;
    `;
    return true;
  } catch (err) {
    console.error('Neon DB: Failed to sync user profile:', err);
    return false;
  }
}
