import { supabase } from './supabase';

import { Database } from '@/types/database';
type PouchAttributeCategoryRow = Database['public']['Tables']['pouch_attribute_categories']['Row'];

export type PouchAttributeCategory = PouchAttributeCategoryRow;
export class PouchAttributeCategoryService {
  private static readonly table = 'pouch_attribute_categories';

  static async listPouchAttributeCategories(): Promise<PouchAttributeCategory[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .order('sort', { ascending: true });

    if (error) {
      console.error('Error listing pouch attribute categories:', error);
      throw error;
    }

    return data || [];
  }
}
