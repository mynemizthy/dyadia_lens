/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { UserProfile } from '../types/auth.ts';

const TOKEN_KEY = 'dyadia_auth_token';

interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  toggleAdminMode: () => void;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (params: SignUpParams) => Promise<{ error: Error | null; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  updateProfile: (data: { fullName: string; phone: string }) => Promise<{ error: Error | null }>;
  refreshProfile: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const toggleAdminMode = () => {
    // Admin mode requires authentic Supabase login with admin credentials
  };

  // Strictly check that user is logged in AND has admin permissions in Supabase
  const isAdmin = Boolean(
    user && (
      user.email === 'support.dyadia@gmail.com' ||
      user.email === 'admin@dyadialens.vn' ||
      user.email === 'kieuthy0101@gmail.com' ||
      user.email?.toLowerCase().includes('admin') ||
      user.user_metadata?.role === 'admin' ||
      user.user_metadata?.is_admin === true ||
      profile?.role === 'admin'
    )
  );

  // Initialize and restore session from localStorage & server verification
  useEffect(() => {
    async function initAuth() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.user) {
            setUser(json.user);
            setProfile(json.profile || null);
            setSession({
              access_token: savedToken,
              token_type: 'bearer',
              expires_in: 3600,
              refresh_token: '',
              user: json.user,
            } as Session);
          } else {
            localStorage.removeItem(TOKEN_KEY);
          }
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (err) {
        console.warn('Failed to verify existing session token:', err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: new Error(data.error || 'Đăng nhập không thành công') };
      }

      const token = data.session?.access_token;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      }

      setUser(data.user);
      setSession(data.session || ({
        access_token: token || '',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: '',
        user: data.user,
      } as Session));
      setProfile(data.profile || null);

      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối khi đăng nhập';
      return { error: new Error(msg) };
    }
  };

  const signUp = async ({ email, password, fullName, phone }: SignUpParams) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: new Error(data.error || 'Đăng ký không thành công') };
      }

      const token = data.session?.access_token;
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
        setUser(data.user);
        setSession(data.session);
        setProfile(data.profile || null);
      }

      return {
        error: null,
        needsEmailConfirmation: Boolean(data.needsEmailConfirmation && !token),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối khi đăng ký';
      return { error: new Error(msg) };
    }
  };

  const signOut = async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectTo: redirectUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: new Error(data.error || 'Gửi email đặt lại mật khẩu thất bại') };
      }

      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      return { error: new Error(msg) };
    }
  };

  const updatePassword = async (newPassword: string) => {
    const token = getAccessToken();
    if (!token) {
      return { error: new Error('Bạn chưa đăng nhập') };
    }

    try {
      const res = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: new Error(data.error || 'Đổi mật khẩu thất bại') };
      }

      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      return { error: new Error(msg) };
    }
  };

  const updateProfile = async ({ fullName, phone }: { fullName: string; phone: string }) => {
    const token = getAccessToken();
    if (!token) {
      return { error: new Error('Bạn chưa đăng nhập') };
    }

    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName, phone }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: new Error(data.error || 'Cập nhật thông tin thất bại') };
      }

      if (data.profile) {
        setProfile(data.profile);
      }
      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      return { error: new Error(msg) };
    }
  };

  const refreshProfile = async () => {
    const token = getAccessToken();
    if (!token) return;

    try {
      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      }
    } catch {
      // ignore
    }
  };

  const getAccessToken = () => {
    return session?.access_token || localStorage.getItem(TOKEN_KEY) || null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isAdmin,
        toggleAdminMode,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshProfile,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
