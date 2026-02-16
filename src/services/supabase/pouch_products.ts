import { supabase } from './supabase';

import { Database } from '@/types/database';
type PouchProductRow = Database['public']['Tables']['pouch_products']['Row'];

export type PouchProduct = PouchProductRow;
export class PouchProductService {
  private static readonly table = 'pouch_products';

  static async getPouchProduct(id: string): Promise<PouchProduct | null> {
    const { data, error } = await supabase.from(this.table).select('*').eq('id', id).maybeSingle();

    if (error) {
      console.error('Error getting pouch product:', error);
      throw error;
    }

    return data;
  }

  static async listPouchProducts(): Promise<PouchProduct[]> {
    const { data, error } = await supabase.from(this.table).select('*').limit(1000);

    if (error) {
      console.error('Error listing pouch products:', error);
      throw error;
    }

    return data || [];
  }
}
