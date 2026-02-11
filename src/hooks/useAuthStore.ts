import { create } from 'zustand';
import type { Session, User } from '@supabase/supabase-js';

import { supabase, refreshSession } from '@/services/supabase/supabase';
import { reportLoginFailure } from '@/utils/functions/token';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  init: () => Promise<void | (() => void)>;
  signOut: () => Promise<{ error: Error | null }>;
  changePassword: (newPassword: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    redirectTo?: string,
  ) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithOpt: (email: string, redirectTo?: string) => Promise<{ error: Error | null }>;
}

const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  isAuthenticated: false,

  init: async () => {
    set({ loading: true });
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasOAuthParams =
          urlParams.has('access_token') ||
          urlParams.has('refresh_token') ||
          urlParams.has('code') ||
          hashParams.has('access_token') ||
          hashParams.has('refresh_token');
        if (hasOAuthParams) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        setCookie('sb-access-token', session.access_token, 7);
      }

      const isAuthenticated = !!session;
      set({ session, user: session?.user ?? null, loading: false, isAuthenticated });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        if (newSession?.access_token) {
          setCookie('sb-access-token', newSession.access_token, 7);
        }
        set({
          session: newSession,
          user: newSession?.user ?? null,
          isAuthenticated: !!newSession,
          loading: false,
        });
      });

      if (session) {
        try {
          await refreshSession();
        } catch (error) {
          console.error('刷新会话失败:', error);
          await reportLoginFailure(error as Error, {
            method: 'session_refresh',
            session,
            context: 'init',
          });
        }
      }

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error('初始化认证 store 时出错:', error);
      await reportLoginFailure(error as Error, {
        method: 'init',
        session: null,
        context: 'store_initialization',
      });
      set({ loading: false, isAuthenticated: false });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return { error: null };
    } catch (error) {
      console.error('登出失败:', error);
      return { error: new Error('signout_error') };
    } finally {
      set({ loading: false });
    }
  },

  changePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        if (error.code === 'weak_password') return { error: new Error('weak_password') };
        throw error;
      }
      return { error: null };
    } catch (err) {
      console.error('修改密码失败:', err);
      return { error: new Error('change_password_error') };
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        await reportLoginFailure(error, { method: 'email_password', email, session: null });
        if (error.code === 'invalid_credentials')
          return { error: new Error('invalid_credentials') };
        if (error.code === 'email_not_confirmed')
          return { error: new Error('email_not_confirmed') };
        throw error;
      }
      await refreshSession();
      return { error: null };
    } catch (err) {
      console.error('登录错误:', err);
      await reportLoginFailure(err as Error, {
        method: 'email_password',
        email,
        session: null,
        isUnhandledError: true,
      });
      return { error: new Error('signin_error') };
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email: string, password: string, redirectTo?: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
      });
      if (error) {
        if (error.code === 'weak_password') return { error: new Error('weak_password') };
        if (error.code === 'user_already_exists')
          return { error: new Error('user_already_exists') };
        throw error;
      }
      return { error: null };
    } catch (err) {
      console.error('注册错误:', err);
      return { error: new Error('signup_error') };
    } finally {
      set({ loading: false });
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true });
      await supabase.auth.signOut();
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) {
        await reportLoginFailure(error, { method: 'google_oauth', session: null });
        throw error;
      }
      if (data?.url && typeof window !== 'undefined') {
        window.location.href = data.url;
      }
      return { error: null };
    } catch (err) {
      console.error('Google 登录异常:', err);
      await reportLoginFailure(err as Error, {
        method: 'google_oauth',
        session: null,
        isUnhandledError: true,
      });
      return { error: new Error('google_signin_error') };
    } finally {
      set({ loading: false });
    }
  },

  signInWithOpt: async (email: string, redirectTo?: string) => {
    try {
      set({ loading: true });
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
      });
      if (error) {
        await reportLoginFailure(error, { method: 'otp', email, session: null });
        throw error;
      }
      return { error: null };
    } catch (err) {
      console.error('OTP 登录错误:', err);
      await reportLoginFailure(err as Error, {
        method: 'otp',
        email,
        session: null,
        isUnhandledError: true,
      });
      return { error: new Error('opt_signin_error') };
    } finally {
      set({ loading: false });
    }
  },
}));
