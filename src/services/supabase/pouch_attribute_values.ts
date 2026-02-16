import { supabase } from './supabase';

import { Database } from '@/types/database';
type PouchAttributeValueRow = Database['public']['Tables']['pouch_attribute_values']['Row'];

export type PouchAttributeValue = PouchAttributeValueRow;
export class PouchAttributeValueService {
  private static readonly table = 'pouch_attribute_values';

  static async listPouchAttributeValues(): Promise<PouchAttributeValue[]> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('is_active', true)
      .order('sort', { ascending: true });

    if (error) {
      console.error('Error listing pouch attribute values:', error);
      throw error;
    }

    return data || [];
  }
}
