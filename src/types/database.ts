/**
 * Supabase Database 类型
 * 使用 `pnpm supabase:type` 根据当前项目生成完整类型后覆盖此文件
 */
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: Record<string, unknown>;
    Views: Record<string, unknown>;
    Enums: Record<string, unknown>;
    CompositeTypes: Record<string, unknown>;
  };
};
