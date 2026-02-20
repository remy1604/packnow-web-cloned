/**
 * 产品 ID → 报价汇总页默认选项（产品类型、内容物）
 * 用于从商品列表点击进入报价汇总时预填
 */
export const CONTENT_OPTIONS = [
  { id: 'coffee', name: 'Coffee', nameZh: '咖啡' },
  { id: 'tea', name: 'Tea', nameZh: '茶' },
  { id: 'snacks', name: 'Snacks', nameZh: '零食' },
  { id: 'pet-food', name: 'Pet Food', nameZh: '宠物食品' },
  { id: 'protein', name: 'Protein Powder', nameZh: '蛋白粉' },
  { id: 'liquid', name: 'Liquid', nameZh: '液体' },
  { id: 'dried-fruit', name: 'Dried Fruit', nameZh: '果干' },
] as const;

/** 首页 4 种袋型 product.id → { bagTypeId, contentId } */
export const PRODUCT_QUOTE_DEFAULTS: Record<string, { bagTypeId: string; contentId: string }> = {
  'stand-up-pouch': { bagTypeId: 'stand-up', contentId: 'coffee' },
  'gusset-bag': { bagTypeId: 'gusseted', contentId: 'snacks' },
  'flat-pouch': { bagTypeId: 'flat-pouch', contentId: 'coffee' },
  'flat-bottom-bag': { bagTypeId: 'flat-bottom', contentId: 'pet-food' },
};

export function getQuoteDefaultsFromProduct(productId: string | null): {
  bagTypeId: string;
  contentId: string;
} {
  if (!productId) return { bagTypeId: '', contentId: 'coffee' };
  const d = PRODUCT_QUOTE_DEFAULTS[productId];
  if (d) return d;
  return { bagTypeId: '', contentId: 'coffee' };
}
