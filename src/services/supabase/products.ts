import { supabase } from '@/services/supabase/supabase';
import type { Database } from '@/types/database';

export type PouchProduct = Database['public']['Tables']['pouch_products']['Row'];
export type PouchAttributeCategory =
  Database['public']['Tables']['pouch_attribute_categories']['Row'];
export type PouchAttributeValue = Database['public']['Tables']['pouch_attribute_values']['Row'];

export type FilterCategoryWithValues = PouchAttributeCategory & {
  values: PouchAttributeValue[];
};

/** 获取产品目录筛选器：分类及其可选值 */
export async function getProductFilterOptions(): Promise<FilterCategoryWithValues[]> {
  const { data: categories, error: catError } = await supabase
    .from('pouch_attribute_categories')
    .select('*')
    .eq('is_active', true)
    .order('sort', { ascending: true });

  if (catError) {
    console.error('获取筛选分类失败', catError);
    return [];
  }

  if (!categories?.length) return [];

  const { data: values, error: valError } = await supabase
    .from('pouch_attribute_values')
    .select('*')
    .eq('is_active', true)
    .order('sort', { ascending: true });

  if (valError) {
    console.error('获取筛选值失败', valError);
    return categories.map((c) => ({ ...c, values: [] }));
  }

  const valuesByCategory = (values ?? []).reduce(
    (acc, v) => {
      if (!acc[v.category_id]) acc[v.category_id] = [];
      acc[v.category_id].push(v);
      return acc;
    },
    {} as Record<string, PouchAttributeValue[]>,
  );

  return categories.map((c) => ({
    ...c,
    values: valuesByCategory[c.id] ?? [],
  }));
}

export type SearchProductsParams = {
  q?: string;
  attributeValueIds?: string[];
};

/** 搜索与筛选产品（Supabase） */
export async function searchProducts(
  params: SearchProductsParams,
): Promise<{ data: PouchProduct[]; error: Error | null }> {
  const { q, attributeValueIds } = params;

  let query = supabase
    .from('pouch_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (q?.trim()) {
    const term = `%${q.trim()}%`;
    query = query.or(`name.ilike.${term},name_en.ilike.${term},description.ilike.${term}`);
  }

  if (attributeValueIds?.length) {
    const { data: productIds } = await supabase
      .from('pouch_product_attribute_values')
      .select('product_id')
      .in('attribute_value_id', attributeValueIds);

    const ids = [...new Set((productIds ?? []).map((r) => r.product_id))];
    if (ids.length) {
      query = query.in('id', ids);
    } else {
      return { data: [], error: null };
    }
  }

  const { data, error } = await query;

  if (error) {
    console.error('搜索产品失败', error);
    return { data: [], error: error as Error };
  }

  return { data: (data ?? []) as PouchProduct[], error: null };
}
