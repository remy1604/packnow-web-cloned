import { supabase } from './supabase';

import { Database } from '@/types/database';
type PouchOrderRow = Database['public']['Tables']['pouch_orders']['Row'];

export type PouchOrder = PouchOrderRow;
export class PouchOrderService {
  private static readonly table = 'pouch_orders';

  static async getPouchOrderByStripeSessionId(stripeSessionId: string): Promise<PouchOrder | null> {
    const { data, error } = await supabase
      .from(this.table)
      .select('*')
      .eq('stripe_session_id', stripeSessionId)
      .maybeSingle();

    if (error) {
      console.error('Error getting pouch order by stripe session id:', error);
      throw error;
    }

    return data;
  }
}
