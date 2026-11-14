/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read public credentials safely for Supabase in browser
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://redobljqvbrouykjrcdo.supabase.co';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If a secret key (starting with sb_secret_) is passed in frontend, @supabase/supabase-js throws
// "Forbidden use of secret API key in browser". We guard against this so the UI never crashes.
const isSecretKey = rawKey.startsWith('sb_secret_') || rawKey.includes('service_role');
const safeClientKey = isSecretKey || !rawKey
  ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dyadia-browser-safe'
  : rawKey;

export const supabase: SupabaseClient = createClient(supabaseUrl, safeClientKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export interface SupabaseServerStatus {
  connected: boolean;
  supabaseConfigured: boolean;
  error: string | null;
  productCount: number;
  url?: string;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && rawKey);
}

export async function checkSupabaseServerStatus(): Promise<SupabaseServerStatus> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) {
      return {
        connected: false,
        supabaseConfigured: false,
        error: `Máy chủ trả về mã HTTP ${res.status}`,
        productCount: 0,
      };
    }
    return await res.json();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Không thể kết nối tới server';
    return {
      connected: false,
      supabaseConfigured: false,
      error: msg,
      productCount: 0,
    };
  }
}
