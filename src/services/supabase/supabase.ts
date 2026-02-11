import { createClient } from '@supabase/supabase-js';

import { Database } from '@/types/database';

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isServer = typeof window === 'undefined';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    ...(isServer
      ? {}
      : {
          storage: {
            getItem: (key) => {
              const value = localStorage.getItem(key);
              if (value) {
                try {
                  const sessionData = JSON.parse(value);
                  if (sessionData.access_token && typeof document !== 'undefined') {
                    const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
                    document.cookie = `sb-access-token=${encodeURIComponent(sessionData.access_token)}; expires=${expires}; path=/; SameSite=Lax`;
                  }
                } catch (error) {
                  console.warn('解析会话数据失败:', error);
                }
              }
              return value;
            },
            setItem: (key, value) => {
              localStorage.setItem(key, value);
              if (value && typeof document !== 'undefined') {
                try {
                  const sessionData = JSON.parse(value);
                  if (sessionData.access_token) {
                    const expires = new Date(Date.now() + 7 * 864e5).toUTCString();
                    document.cookie = `sb-access-token=${encodeURIComponent(sessionData.access_token)}; expires=${expires}; path=/; SameSite=Lax`;
                  }
                } catch (error) {
                  console.warn('解析会话数据失败:', error);
                }
              }
            },
            removeItem: (key) => {
              localStorage.removeItem(key);
              if (typeof document !== 'undefined') {
                document.cookie = 'sb-access-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
              }
            },
          },
        }),
  },
});

export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('刷新会话失败', error);
    } else if (data.session) {
      return true;
    }
  } catch (err) {
    console.error('刷新会话时出错', err);
  }
  return false;
};

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

export const handleSupabaseError = (error: unknown) => {
  console.error('Supabase操作失败:', error);
  return error instanceof Error ? error.message : '操作失败，请稍后重试';
};
