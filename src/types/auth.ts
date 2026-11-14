/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: {
    id: string;
    email?: string;
    email_confirmed_at?: string | null;
  } | null;
  profile: UserProfile | null;
  loading: boolean;
}
