// src/services/api-client.ts
import { AccessClient } from './api-client/AccessClient';

import { supabase } from '@/services/supabase/supabase';

// 从环境变量获取 BASE（默认值为你的开发环境地址）
const API_BASE = process.env.NEXT_PUBLIC_ACCESS_API_BASE_URL;

class ApiClientSingleton {
  private static instance: AccessClient;

  public static getInstance(): AccessClient {
    if (!this.instance) {
      this.instance = new AccessClient({
        BASE: API_BASE,
        TOKEN: async () => {
          const {
            data: { session },
          } = await supabase.auth.getSession();

          return session?.access_token || '';
        },
      });
    }

    return this.instance;
  }
}

// 导出一个直接可用的客户端实例
export const api = ApiClientSingleton.getInstance();
