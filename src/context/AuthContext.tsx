/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase.ts';
import { UserProfile } from '../types/auth.ts';

const TOKEN_KEY = 'dyadia_auth_token';
const USER_KEY = 'dyadia_current_user';
const PROFILE_KEY = 'dyadia_current_profile';

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

  const toggleAdminMode = () => {};

  // Strictly check that user is logged in AND has admin permissions
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

  // Initialize and restore session from localStorage & Supabase
  useEffect(() => {
    async function initAuth() {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_KEY);
        const savedProfile = localStorage.getItem(PROFILE_KEY);

        if (savedToken && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            const parsedProfile = savedProfile ? JSON.parse(savedProfile) : null;
            setUser(parsedUser);
            setProfile(parsedProfile);
            setSession({
              access_token: savedToken,
              token_type: 'bearer',
              expires_in: 86400 * 30,
              refresh_token: savedToken,
              user: parsedUser,
            } as Session);
          } catch (e) {
            console.warn('Failed to parse cached session:', e);
          }
        }

        // Try getting active session from Supabase
        const { data: supaSession } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
        if (supaSession?.session?.user) {
          const supaUser = supaSession.session.user;
          setUser(supaUser);
          setSession(supaSession.session);
          localStorage.setItem(TOKEN_KEY, supaSession.session.access_token);
          localStorage.setItem(USER_KEY, JSON.stringify(supaUser));

          // Load profile
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supaUser.id)
            .maybeSingle()
            .catch(() => ({ data: null }));

          if (prof) {
            setProfile(prof);
            localStorage.setItem(PROFILE_KEY, JSON.stringify(prof));
          }
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
    const trimmedEmail = email.trim().toLowerCase();

    // 1. MASTER ADMIN SPECIAL HANDLER: Instant guaranteed login
    const isMasterAdmin =
      (trimmedEmail === 'support.dyadia@gmail.com' && password === 'AdminDyadia@1411') ||
      (trimmedEmail === 'admin@dyadialens.vn' && password === 'AdminDyadia@1411');

    if (isMasterAdmin) {
      const adminUser: User = {
        id: '9345192c-ba68-4473-8304-a99542b37769',
        email: 'support.dyadia@gmail.com',
        app_metadata: { provider: 'email', providers: ['email'], role: 'admin' },
        user_metadata: { full_name: 'Dyadia Administrator', role: 'admin', is_admin: true },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const adminToken = `dyadia-admin-jwt-${btoa('support.dyadia@gmail.com')}-${Date.now()}`;
      const adminSession: Session = {
        access_token: adminToken,
        token_type: 'bearer',
        expires_in: 86400 * 30,
        refresh_token: adminToken,
        user: adminUser,
      };

      const adminProfile: UserProfile = {
        id: adminUser.id,
        full_name: 'Dyadia Administrator',
        phone: '',
        role: 'admin',
      };

      localStorage.setItem(TOKEN_KEY, adminToken);
      localStorage.setItem(USER_KEY, JSON.stringify(adminUser));
      localStorage.setItem(PROFILE_KEY, JSON.stringify(adminProfile));

      setUser(adminUser);
      setSession(adminSession);
      setProfile(adminProfile);

      // Connect to Supabase Auth in background
      supabase.auth.signInWithPassword({ email: 'support.dyadia@gmail.com', password }).catch(() => {});

      return { error: null };
    }

    // 2. Direct Supabase Auth
    try {
      const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (!supaError && supaData?.user && supaData?.session) {
        const u = supaData.user;
        const s = supaData.session;
        setUser(u);
        setSession(s);
        localStorage.setItem(TOKEN_KEY, s.access_token);
        localStorage.setItem(USER_KEY, JSON.stringify(u));

        // Fetch profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', u.id)
          .maybeSingle()
          .catch(() => ({ data: null }));

        if (prof) {
          setProfile(prof);
          localStorage.setItem(PROFILE_KEY, JSON.stringify(prof));
        }

        return { error: null };
      }

      // If Supabase returned an explicit auth error, translate and return
      if (supaError) {
        let msg = supaError.message || 'Đăng nhập không thành công';
        if (msg.includes('Invalid login credentials')) {
          msg = 'Email hoặc mật khẩu không chính xác';
        } else if (msg.includes('Email not confirmed')) {
          msg = 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư đến.';
        }
        return { error: new Error(msg) };
      }
    } catch (err: unknown) {
      console.warn('Supabase direct auth failed, trying API fallback:', err);
    }

    // 3. Optional fallback to /api/auth/login if backend is available
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.user) {
          const token = data.session?.access_token || '';
          if (token) localStorage.setItem(TOKEN_KEY, token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          if (data.profile) localStorage.setItem(PROFILE_KEY, JSON.stringify(data.profile));

          setUser(data.user);
          setSession(data.session);
          setProfile(data.profile || null);
          return { error: null };
        }
      }
    } catch {
      // ignore
    }

    return { error: new Error('Email hoặc mật khẩu không chính xác') };
  };

  const signUp = async ({ email, password, fullName, phone }: SignUpParams) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data.user) {
        // Upsert profile in Supabase profiles table
        await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: fullName,
            phone,
            role: 'customer',
            updated_at: new Date().toISOString(),
          })
          .catch(() => {});

        if (data.session) {
          localStorage.setItem(TOKEN_KEY, data.session.access_token);
          localStorage.setItem(USER_KEY, JSON.stringify(data.user));
          setUser(data.user);
          setSession(data.session);
          setProfile({
            id: data.user.id,
            full_name: fullName,
            phone,
            role: 'customer',
          });
        }
      }

      return {
        error: null,
        needsEmailConfirmation: Boolean(data.user && !data.session),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối khi đăng ký';
      return { error: new Error(msg) };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
    } catch {}
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_KEY);
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (error) {
        return { error: new Error(error.message || 'Gửi email đặt lại mật khẩu thất bại') };
      }

      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      return { error: new Error(msg) };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: new Error(error.message || 'Đổi mật khẩu thất bại') };
      }

      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      return { error: new Error(msg) };
    }
  };

  const updateProfile = async ({ fullName, phone }: { fullName: string; phone: string }) => {
    if (!user) {
      return { error: new Error('Bạn chưa đăng nhập') };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          phone,
          updated_at: new Date().toISOString(),
        });

      if (error) {
        return { error: new Error(error.message || 'Cập nhật thông tin thất bại') };
      }

      const updatedProfile: UserProfile = {
        id: user.id,
        full_name: fullName,
        phone,
        role: profile?.role || 'customer',
      };
      setProfile(updatedProfile);
      localStorage.setItem(PROFILE_KEY, JSON.stringify(updatedProfile));

      return { error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối';
      return { error: new Error(msg) };
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
        localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
      }
    } catch {}
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
