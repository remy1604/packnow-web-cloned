export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1';
  };
  public: {
    Tables: {
      pouch_attribute_categories: {
        Row: {
          created_at: string;
          id: string;
          is_active: boolean;
          name: string;
          sort: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          is_active?: boolean;
          name?: string;
          sort: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pouch_attribute_values: {
        Row: {
          category_id: string;
          created_at: string;
          description: string | null;
          id: string;
          is_active: boolean;
          name: string;
          sort: number;
          updated_at: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          description?: string | null;
          id: string;
          is_active?: boolean;
          name: string;
          sort: number;
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean;
          name?: string;
          sort?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pouch_attrivute_values_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'pouch_attribute_categories';
            referencedColumns: ['id'];
          },
        ];
      };
      pouch_orders: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          notes: string;
          paid_at: string | null;
          shipping_address_line_1: string;
          shipping_address_line_2: string;
          shipping_city: string;
          shipping_country: string;
          shipping_name: string;
          shipping_phone_code: string;
          shipping_phone_number: string;
          shipping_postal_code: string;
          shipping_state: string;
          state: Database['public']['Enums']['pouch_order_state'];
          stripe_session_id: string;
          total_amount: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          notes: string;
          paid_at?: string | null;
          shipping_address_line_1: string;
          shipping_address_line_2: string;
          shipping_city: string;
          shipping_country: string;
          shipping_name: string;
          shipping_phone_code: string;
          shipping_phone_number: string;
          shipping_postal_code: string;
          shipping_state: string;
          state: Database['public']['Enums']['pouch_order_state'];
          stripe_session_id: string;
          total_amount: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          notes?: string;
          paid_at?: string | null;
          shipping_address_line_1?: string;
          shipping_address_line_2?: string;
          shipping_city?: string;
          shipping_country?: string;
          shipping_name?: string;
          shipping_phone_code?: string;
          shipping_phone_number?: string;
          shipping_postal_code?: string;
          shipping_state?: string;
          state?: Database['public']['Enums']['pouch_order_state'];
          stripe_session_id?: string;
          total_amount?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      pouch_products: {
        Row: {
          base_type: string;
          capacity_volume: number;
          capacity_weight: number;
          clear_window: Database['public']['Enums']['pouch_clear_window'];
          corner_style: Database['public']['Enums']['pouch_corner_style'];
          created_at: string;
          description: string | null;
          dieline_url: string;
          dimensions_gusset: number;
          dimensions_height: number;
          dimensions_width: number;
          filler: string;
          hang_hole: Database['public']['Enums']['pouch_hang_hole'];
          id: string;
          industry: string;
          material_structure: string;
          mockup_model_url: string;
          name: string;
          public: boolean;
          spout: Database['public']['Enums']['pouch_spout'];
          surface_finish: Database['public']['Enums']['pouch_surface_finish'];
          tear_notch: Database['public']['Enums']['pouch_tear_notch'];
          thickness: number;
          tintie: Database['public']['Enums']['pouch_tintie'];
          updated_at: string;
          valve: Database['public']['Enums']['pouch_valve'];
          zipper: Database['public']['Enums']['pouch_zipper'];
        };
        Insert: {
          base_type: string;
          capacity_volume: number;
          capacity_weight: number;
          clear_window: Database['public']['Enums']['pouch_clear_window'];
          corner_style: Database['public']['Enums']['pouch_corner_style'];
          created_at?: string;
          description?: string | null;
          dieline_url: string;
          dimensions_gusset: number;
          dimensions_height: number;
          dimensions_width: number;
          filler: string;
          hang_hole: Database['public']['Enums']['pouch_hang_hole'];
          id?: string;
          industry: string;
          material_structure: string;
          mockup_model_url: string;
          name: string;
          public: boolean;
          spout: Database['public']['Enums']['pouch_spout'];
          surface_finish: Database['public']['Enums']['pouch_surface_finish'];
          tear_notch: Database['public']['Enums']['pouch_tear_notch'];
          thickness: number;
          tintie: Database['public']['Enums']['pouch_tintie'];
          updated_at?: string;
          valve: Database['public']['Enums']['pouch_valve'];
          zipper: Database['public']['Enums']['pouch_zipper'];
        };
        Update: {
          base_type?: string;
          capacity_volume?: number;
          capacity_weight?: number;
          clear_window?: Database['public']['Enums']['pouch_clear_window'];
          corner_style?: Database['public']['Enums']['pouch_corner_style'];
          created_at?: string;
          description?: string | null;
          dieline_url?: string;
          dimensions_gusset?: number;
          dimensions_height?: number;
          dimensions_width?: number;
          filler?: string;
          hang_hole?: Database['public']['Enums']['pouch_hang_hole'];
          id?: string;
          industry?: string;
          material_structure?: string;
          mockup_model_url?: string;
          name?: string;
          public?: boolean;
          spout?: Database['public']['Enums']['pouch_spout'];
          surface_finish?: Database['public']['Enums']['pouch_surface_finish'];
          tear_notch?: Database['public']['Enums']['pouch_tear_notch'];
          thickness?: number;
          tintie?: Database['public']['Enums']['pouch_tintie'];
          updated_at?: string;
          valve?: Database['public']['Enums']['pouch_valve'];
          zipper?: Database['public']['Enums']['pouch_zipper'];
        };
        Relationships: [
          {
            foreignKeyName: 'pouch_products_base_type_fkey';
            columns: ['base_type'];
            isOneToOne: false;
            referencedRelation: 'pouch_attribute_values';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pouch_products_material_structure_fkey';
            columns: ['material_structure'];
            isOneToOne: false;
            referencedRelation: 'pouch_attribute_values';
            referencedColumns: ['id'];
          },
        ];
      };
      pouch_product_attribute_values: {
        Row: {
          product_id: string;
          attribute_value_id: string;
        };
        Insert: {
          product_id: string;
          attribute_value_id: string;
        };
        Update: {
          product_id?: string;
          attribute_value_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'pouch_product_attribute_values_product_id_fkey';
            columns: ['product_id'];
            isOneToOne: false;
            referencedRelation: 'pouch_products';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'pouch_product_attribute_values_attribute_value_id_fkey';
            columns: ['attribute_value_id'];
            isOneToOne: false;
            referencedRelation: 'pouch_attribute_values';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      pouch_clear_window: 'clear window' | 'none';
      pouch_corner_style: 'square' | 'rounded';
      pouch_hang_hole: 'euro hole' | 'round hole' | 'none';
      pouch_order_state: 'Created' | 'Paid';
      pouch_spout: 'corner spout' | 'center spout' | 'none';
      pouch_surface_finish: 'matte' | 'gloss' | 'soft touch' | 'holographic' | 'kraft';
      pouch_tear_notch: 'both sides' | 'left only' | 'none';
      pouch_tintie: 'tin tie' | 'none';
      pouch_valve: 'one-way degassing valve' | 'none';
      pouch_zipper: 'press to close' | 'pocket zipper' | 'child resistant' | 'none';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      pouch_clear_window: ['clear window', 'none'],
      pouch_corner_style: ['square', 'rounded'],
      pouch_hang_hole: ['euro hole', 'round hole', 'none'],
      pouch_order_state: ['Created', 'Paid'],
      pouch_spout: ['corner spout', 'center spout', 'none'],
      pouch_surface_finish: ['matte', 'gloss', 'soft touch', 'holographic', 'kraft'],
      pouch_tear_notch: ['both sides', 'left only', 'none'],
      pouch_tintie: ['tin tie', 'none'],
      pouch_valve: ['one-way degassing valve', 'none'],
      pouch_zipper: ['press to close', 'pocket zipper', 'child resistant', 'none'],
    },
  },
} as const;
