/**
 * 产品目录筛选维度与选项（参考：后端建表 - 产品目录筛选.pdf）
 * 与 Supabase pouch_attribute_categories / pouch_attribute_values 对应
 */
export const FILTER_BASE_TYPE = {
  id: 'base_type',
  name: '袋型',
  values: [
    { id: 'standup-pouch', name: 'Stand Up Pouch', name_zh: '自立袋' },
    { id: 'flat-bottom-pouch', name: 'Flat Bottom Pouch', name_zh: '平底袋' },
    { id: 'gusset-bag', name: 'Gusset Bag', name_zh: '风琴袋' },
    { id: 'flat-pouch-bag', name: 'Flat Pouch', name_zh: '平口袋' },
    { id: '3-side-seal-bag', name: '3-Side Seal Bag', name_zh: '三边封' },
    { id: '8-side-seal-bag', name: '8-Side Seal Bag', name_zh: '八边封' },
  ],
} as const;

export const FILTER_INDUSTRY = {
  id: 'industry',
  name: '适用行业',
  values: [
    { id: 'coffee', name: 'Coffee', name_zh: '咖啡' },
    { id: 'cannabis', name: 'Cannabis', name_zh: '大麻' },
    { id: 'pet-food', name: 'Pet Food', name_zh: '宠物食品' },
    { id: 'dried-fruit', name: 'Dried Fruit', name_zh: '果干' },
    { id: 'protein-powder', name: 'Protein Powder', name_zh: '蛋白粉' },
    { id: 'liquid', name: 'Liquid', name_zh: '液体' },
  ],
} as const;

export const FILTER_CAPACITY_WEIGHT = {
  id: 'capacity_weight',
  name: '容量（重量）',
  values: [
    { id: 'samples', name: 'Samples (2-6oz)', name_zh: '样品 2-6oz' },
    { id: 'small-fill', name: 'Small fill (6-10oz)', name_zh: '小规格 6-10oz' },
    { id: 'standard-fill', name: 'Standard fill (10-12 oz)', name_zh: '标准 10-12oz' },
    { id: 'large-fill', name: 'Large Fill (12 oz - 5 lbs)', name_zh: '大规格 12oz-5lbs' },
  ],
} as const;

export const FILTER_MATERIAL_DISPLAY = {
  id: 'material_display',
  name: '材料展示',
  values: [
    { id: 'standard', name: 'Standard', name_zh: '标准' },
    { id: 'silver', name: 'Silver', name_zh: '银' },
    { id: 'foil', name: 'Foil', name_zh: '铝箔' },
    { id: 'kraft', name: 'Kraft', name_zh: '牛皮纸' },
    { id: 'compost', name: 'Compost', name_zh: '堆肥' },
    { id: 'recycle', name: 'Recycle', name_zh: '可回收' },
    { id: 'custom', name: 'Custom', name_zh: '定制' },
  ],
} as const;

export type FallbackFilterValue = { id: string; name: string; name_zh: string };

/** 前端占位用：无后端数据时展示的筛选维度（与 PDF 一致），可点击筛选 */
export const FALLBACK_FILTER_CATEGORIES: Array<{
  id: string;
  name: string;
  values: FallbackFilterValue[];
}> = [
  { id: FILTER_BASE_TYPE.id, name: FILTER_BASE_TYPE.name, values: [...FILTER_BASE_TYPE.values] },
  { id: FILTER_INDUSTRY.id, name: FILTER_INDUSTRY.name, values: [...FILTER_INDUSTRY.values] },
  {
    id: FILTER_CAPACITY_WEIGHT.id,
    name: FILTER_CAPACITY_WEIGHT.name,
    values: [...FILTER_CAPACITY_WEIGHT.values],
  },
  {
    id: FILTER_MATERIAL_DISPLAY.id,
    name: FILTER_MATERIAL_DISPLAY.name,
    values: [...FILTER_MATERIAL_DISPLAY.values],
  },
];

/** valueId -> categoryId，用于前端筛选时按维度分组 */
export const FALLBACK_VALUE_TO_CATEGORY: Record<string, string> = {};
FALLBACK_FILTER_CATEGORIES.forEach((cat) => {
  cat.values.forEach((v) => {
    FALLBACK_VALUE_TO_CATEGORY[v.id] = cat.id;
  });
});

/**
 * 演示产品与筛选属性值 id 的对应（产品 id -> 该产品所属的 valueId 列表）
 * 用于无后端时按「袋型 / 行业 / 容量 / 材料」做前端筛选
 */
/** 首页 4 种袋型 product.id → 筛选属性 valueId 列表 */
export const FALLBACK_PRODUCT_ATTRIBUTE_IDS: Record<string, string[]> = {
  'stand-up-pouch': ['standup-pouch', 'coffee', 'standard-fill', 'foil'],
  'gusset-bag': ['gusset-bag', 'snacks', 'standard-fill', 'foil'],
  'flat-pouch': ['flat-pouch-bag', 'coffee', 'samples', 'kraft'],
  'flat-bottom-bag': ['flat-bottom-pouch', 'pet-food', 'large-fill', 'standard'],
};
