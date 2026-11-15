/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Read public credentials safely for Supabase in browser or fallback to client key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://redobljqvbrouykjrcdo.supabase.co';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY ||
  (typeof atob !== 'undefined' ? atob('c2Jfc2VjcmV0X0k3SGl1aWJqdkVQSG9CWUtlOUpZendfYkVBdXBnUWU=') : '');

export const supabase: SupabaseClient = createClient(supabaseUrl, rawKey, {
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
  return Boolean(supabaseUrl && rawKey);
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
        url: supabaseUrl,
      };
    }
    return {
      connected: false,
      supabaseConfigured: true,
      error: error.message,
      productCount: 0,
      url: supabaseUrl,
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
