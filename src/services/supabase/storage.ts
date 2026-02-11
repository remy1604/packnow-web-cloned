import { supabase } from './supabase';

/** 通用 Storage 服务，对接 Supabase Storage */
export class StorageService {
  /** 上传文件到指定 bucket，返回公开 URL */
  static async upload(
    bucket: string,
    filePath: string,
    file: File | Blob,
    options?: { upsert?: boolean },
  ): Promise<{ path: string; publicUrl: string }> {
    const { error } = await supabase.storage.from(bucket).upload(filePath, file, {
      upsert: options?.upsert ?? true,
    });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { path: filePath, publicUrl: urlData.publicUrl };
  }

  /** 获取 bucket 内文件的公开 URL */
  static getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  /** 删除 bucket 内文件 */
  static async remove(bucket: string, paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
  }
}
