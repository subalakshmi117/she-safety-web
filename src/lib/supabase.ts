import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, EmergencyContact, SosAlert, IncidentReport } from '../types';

export const SUPABASE_SQL_SCHEMA = `-- SafeHer Database Schema & Row Level Security Setup
-- Run this in your Supabase SQL Editor to initialize all tables and policies.

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text default '',
  emergency_preference text default 'SMS & Call Alert to all Emergency Contacts',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 2. Emergency Contacts Table
create table if not exists public.emergency_contacts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  phone text not null,
  relationship text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.emergency_contacts enable row level security;

create policy "Users can view own emergency contacts"
  on public.emergency_contacts for select
  using (auth.uid() = user_id);

create policy "Users can insert own emergency contacts"
  on public.emergency_contacts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own emergency contacts"
  on public.emergency_contacts for update
  using (auth.uid() = user_id);

create policy "Users can delete own emergency contacts"
  on public.emergency_contacts for delete
  using (auth.uid() = user_id);

-- 3. SOS Alerts Table
create table if not exists public.sos_alerts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  latitude double precision,
  longitude double precision,
  status text default 'Active' not null check (status in ('Active', 'Resolved', 'Cancelled')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.sos_alerts enable row level security;

create policy "Users can view own sos alerts"
  on public.sos_alerts for select
  using (auth.uid() = user_id);

create policy "Users can insert own sos alerts"
  on public.sos_alerts for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sos alerts"
  on public.sos_alerts for update
  using (auth.uid() = user_id);

-- 4. Incident Reports Table
create table if not exists public.incident_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  incident_type text not null,
  description text not null,
  location text not null,
  incident_date text not null,
  status text default 'Submitted' not null check (status in ('Submitted', 'Under Review', 'Resolved')),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.incident_reports enable row level security;

create policy "Users can view own incident reports"
  on public.incident_reports for select
  using (auth.uid() = user_id);

create policy "Users can insert own incident reports"
  on public.incident_reports for insert
  with check (auth.uid() = user_id);

create policy "Users can update own incident reports"
  on public.incident_reports for update
  using (auth.uid() = user_id);
`;

// Retrieve credentials from environment or localStorage
function getSupabaseConfig(): { url: string; key: string } | null {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (envUrl && envKey && envUrl.startsWith('https://') && envKey.length > 20) {
    return { url: envUrl, key: envKey };
  }

  try {
    const custom = localStorage.getItem('safeher_supabase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed.url && parsed.key && parsed.url.startsWith('https://')) {
        return { url: parsed.url, key: parsed.key };
      }
    }
  } catch {
    // Ignore parse error
  }

  return null;
}

const config = getSupabaseConfig();

export const isLiveSupabaseAvailable = !!config;

// Mock persistent Supabase client implementation that mirrors exact Supabase syntax
class LocalSupabaseAuth {
  private listeners: Array<(event: string, session: any) => void> = [];

  constructor() {}

  private getCurrentSession() {
    try {
      const data = localStorage.getItem('safeher_auth_session');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  private setSession(session: any) {
    if (session) {
      localStorage.setItem('safeher_auth_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('safeher_auth_session');
    }
    this.notify('SIGNED_IN_OR_OUT', session);
  }

  private notify(event: string, session: any) {
    this.listeners.forEach((listener) => listener(event, session));
  }

  async getSession() {
    const session = this.getCurrentSession();
    return { data: { session }, error: null };
  }

  async getUser() {
    const session = this.getCurrentSession();
    return { data: { user: session ? session.user : null }, error: null };
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    this.listeners.push(callback);
    const session = this.getCurrentSession();
    callback(session ? 'INITIAL_SESSION' : 'NO_SESSION', session);
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            this.listeners = this.listeners.filter((l) => l !== callback);
          },
        },
      },
    };
  }

  async signUp({ email, password, options }: { email: string; password: string; options?: { data?: any } }) {
    await new Promise((r) => setTimeout(r, 350));
    const normalizedEmail = email.toLowerCase().trim();

    // Check existing users in storage
    const usersJson = localStorage.getItem('safeher_auth_users');
    const users: any[] = usersJson ? JSON.parse(usersJson) : [];
    if (users.find((u) => u.email === normalizedEmail)) {
      return { data: { user: null, session: null }, error: { message: 'A user with this email already exists.' } };
    }

    const userId = 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    const newUser = {
      id: userId,
      email: normalizedEmail,
      user_metadata: options?.data || {},
      created_at: new Date().toISOString(),
    };

    users.push({ ...newUser, password });
    localStorage.setItem('safeher_auth_users', JSON.stringify(users));

    // Save profile record
    const profile: UserProfile = {
      id: userId,
      email: normalizedEmail,
      full_name: options?.data?.full_name || normalizedEmail.split('@')[0],
      phone: options?.data?.phone || '',
      emergency_preference: 'SMS & Call Alert to all Emergency Contacts',
      created_at: new Date().toISOString(),
    };

    const profilesJson = localStorage.getItem('safeher_db_profiles');
    const profiles: UserProfile[] = profilesJson ? JSON.parse(profilesJson) : [];
    profiles.push(profile);
    localStorage.setItem('safeher_db_profiles', JSON.stringify(profiles));

    const session = {
      access_token: 'local_token_' + Date.now(),
      user: newUser,
    };
    this.setSession(session);

    return { data: { user: newUser, session }, error: null };
  }

  async signInWithPassword({ email, password }: { email: string; password: string }) {
    await new Promise((r) => setTimeout(r, 350));
    const normalizedEmail = email.toLowerCase().trim();

    const usersJson = localStorage.getItem('safeher_auth_users');
    const users: any[] = usersJson ? JSON.parse(usersJson) : [];

    // Pre-populate a demo user if users list is empty and demo credentials used
    if (users.length === 0 && (normalizedEmail === 'demo@safeher.org' || normalizedEmail === 'user@safeher.org')) {
      const demoId = 'usr_demo12345';
      const demoUser = {
        id: demoId,
        email: normalizedEmail,
        password: password,
        user_metadata: { full_name: 'Ananya Sharma', phone: '+1 (555) 234-5678' },
        created_at: new Date().toISOString(),
      };
      users.push(demoUser);
      localStorage.setItem('safeher_auth_users', JSON.stringify(users));

      // seed demo profile
      const demoProfile: UserProfile = {
        id: demoId,
        email: normalizedEmail,
        full_name: 'Ananya Sharma',
        phone: '+1 (555) 234-5678',
        emergency_preference: 'SMS Alert + Live Location Link to Emergency Contacts',
        created_at: new Date().toISOString(),
      };
      localStorage.setItem('safeher_db_profiles', JSON.stringify([demoProfile]));

      // seed sample contacts
      const initialContacts: EmergencyContact[] = [
        {
          id: 'cnt_1',
          user_id: demoId,
          name: 'Sarah Jenkins',
          phone: '+1 (555) 019-2834',
          relationship: 'Sister',
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
        {
          id: 'cnt_2',
          user_id: demoId,
          name: 'Priya Patel',
          phone: '+1 (555) 839-4412',
          relationship: 'Best Friend',
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
        },
        {
          id: 'cnt_3',
          user_id: demoId,
          name: 'David Sharma',
          phone: '+1 (555) 432-8765',
          relationship: 'Father',
          created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
        }
      ];
      localStorage.setItem('safeher_db_emergency_contacts', JSON.stringify(initialContacts));
    }

    const found = users.find((u) => u.email === normalizedEmail && u.password === password);
    if (!found) {
      return { data: { user: null, session: null }, error: { message: 'Invalid email or password.' } };
    }

    const userObj = {
      id: found.id,
      email: found.email,
      user_metadata: found.user_metadata || {},
      created_at: found.created_at,
    };

    const session = {
      access_token: 'local_token_' + Date.now(),
      user: userObj,
    };
    this.setSession(session);

    return { data: { user: userObj, session }, error: null };
  }

  async signOut() {
    this.setSession(null);
    return { error: null };
  }
}

class LocalQueryBuilder {
  private tableName: string;
  private operation: 'select' | 'insert' | 'update' | 'delete' = 'select';
  private payload: any = null;
  private filters: Array<(item: any) => boolean> = [];
  private orderField?: string;
  private ascending: boolean = true;
  private singleRow: boolean = false;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  private getStorageKey(): string {
    return `safeher_db_${this.tableName}`;
  }

  private getItems(): any[] {
    try {
      const data = localStorage.getItem(this.getStorageKey());
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveItems(items: any[]) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
  }

  select(columns: string = '*') {
    // Chains on select or after insert
    return this;
  }

  eq(field: string, value: any) {
    this.filters.push((item) => item[field] === value);
    return this;
  }

  order(field: string, { ascending = true }: { ascending?: boolean } = {}) {
    this.orderField = field;
    this.ascending = ascending;
    return this;
  }

  single() {
    this.singleRow = true;
    return this;
  }

  insert(record: any | any[]) {
    this.operation = 'insert';
    this.payload = record;
    return this;
  }

  update(updates: any) {
    this.operation = 'update';
    this.payload = updates;
    return this;
  }

  delete() {
    this.operation = 'delete';
    return this;
  }

  // Then handler for async execution - executes the pending operation
  async then(resolve: (res: { data: any; error: any }) => void) {
    await new Promise((r) => setTimeout(r, 120));
    let items = this.getItems();

    if (this.operation === 'insert') {
      const recordsToAdd = Array.isArray(this.payload) ? this.payload : [this.payload];
      const processed = recordsToAdd.map((r: any) => ({
        id: r.id || 'rec_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
        created_at: r.created_at || new Date().toISOString(),
        ...r,
      }));

      items.push(...processed);
      this.saveItems(items);

      resolve({
        data: this.singleRow ? processed[0] : (Array.isArray(this.payload) ? processed : processed[0]),
        error: null,
      });
      return;
    }

    if (this.operation === 'update') {
      let updatedRecords: any[] = [];
      items = items.map((item) => {
        const matches = this.filters.every((filter) => filter(item));
        if (matches) {
          const updated = { ...item, ...this.payload };
          updatedRecords.push(updated);
          return updated;
        }
        return item;
      });

      this.saveItems(items);
      resolve({
        data: this.singleRow ? (updatedRecords[0] || null) : updatedRecords,
        error: null,
      });
      return;
    }

    if (this.operation === 'delete') {
      const remaining = items.filter((item) => !this.filters.every((filter) => filter(item)));
      this.saveItems(remaining);
      resolve({ data: null, error: null });
      return;
    }

    // Default: 'select'
    if (this.filters.length > 0) {
      items = items.filter((item) => this.filters.every((filter) => filter(item)));
    }

    if (this.orderField) {
      items.sort((a, b) => {
        const valA = a[this.orderField!];
        const valB = b[this.orderField!];
        if (valA < valB) return this.ascending ? -1 : 1;
        if (valA > valB) return this.ascending ? 1 : -1;
        return 0;
      });
    }

    if (this.singleRow) {
      resolve({ data: items[0] || null, error: null });
    } else {
      resolve({ data: items, error: null });
    }
  }
}

// Unified client interface
export interface UnifiedSupabaseClient {
  auth: any;
  from: (table: string) => any;
  isLive: boolean;
}

class UnifiedClient implements UnifiedSupabaseClient {
  public auth: any;
  private realClient: SupabaseClient | null = null;
  public isLive: boolean = false;

  constructor() {
    const currentConfig = getSupabaseConfig();
    if (currentConfig) {
      try {
        this.realClient = createClient(currentConfig.url, currentConfig.key);
        this.auth = this.realClient.auth;
        this.isLive = true;
      } catch (err) {
        console.warn('Failed to initialize live Supabase client, falling back to local persistent store:', err);
        this.auth = new LocalSupabaseAuth();
        this.isLive = false;
      }
    } else {
      this.auth = new LocalSupabaseAuth();
      this.isLive = false;
    }
  }

  from(table: string): any {
    if (this.isLive && this.realClient) {
      return this.realClient.from(table);
    }
    return new LocalQueryBuilder(table);
  }
}

export const supabase = new UnifiedClient();

export function saveCustomSupabaseConfig(url: string, key: string) {
  localStorage.setItem('safeher_supabase_config', JSON.stringify({ url, key }));
  window.location.reload();
}

export function clearCustomSupabaseConfig() {
  localStorage.removeItem('safeher_supabase_config');
  window.location.reload();
}
