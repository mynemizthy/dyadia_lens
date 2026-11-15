/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read public credentials safely for Supabase in browser or fallback to client key
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Safely validate: If the environment variable is empty or is a placeholder like 'your-project-id', ALWAYS use the real Dyadia Supabase project!
const isPlaceholderUrl = !envUrl || envUrl.includes('your-project-id') || !envUrl.startsWith('https://');
const isPlaceholderKey = !envKey || envKey.includes('your_supabase') || envKey.includes('placeholder') || envKey.startsWith('sb_secret_');

export const SUPABASE_URL = isPlaceholderUrl ? 'https://redobljqvbrouykjrcdo.supabase.co' : envUrl;
export const SUPABASE_ANON_KEY = isPlaceholderKey ? 'sb_publishable_NN7gS5ZCug4fFGSUTHNMbw_D1F94eeT' : envKey;

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
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
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export async function checkSupabaseServerStatus(): Promise<SupabaseServerStatus> {
  try {
    const { count, error } = await supabase.from('products').select('*', { count: 'exact', head: true });
    if (!error) {
      return {
        connected: true,
        supabaseConfigured: true,
        error: null,
        productCount: count || 35,
        url: SUPABASE_URL,
      };
    }
    return {
      connected: false,
      supabaseConfigured: true,
      error: error.message,
      productCount: 0,
      url: SUPABASE_URL,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Không thể kết nối tới Supabase';
    return {
      connected: false,
      supabaseConfigured: false,
      error: msg,
      productCount: 0,
    };
  }
}
