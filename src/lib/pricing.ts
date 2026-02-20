// ============================================================
// Packaging Price Calculator Engine - USD Pricing
// 参考 price-calculator 项目
// ============================================================

// ---- Data Types ----

export interface BagType {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  emoji: string;
  multiplier: number;
}

export interface BagSize {
  id: string;
  label: string;
  labelEn: string;
  width: number;
  height: number;
  gusset: number;
  volumeLabel: string;
  surfaceArea: number;
}

export type BarrierLevel = 'low' | 'medium' | 'high' | 'ultra';

export interface Material {
  id: string;
  name: string;
  layers: string;
  description: string;
  costPerSqm: number;
  barrier: BarrierLevel;
  isEco: boolean;
  isMatte: boolean;
  isTransparent: boolean;
  suitableFor: string[];
  pros: string[];
  cons: string[];
  color: string;
}

export interface ProcessOption {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  costType: 'per_unit' | 'per_order' | 'per_sqm';
  cost: number;
  isDefault: boolean;
  category: 'printing' | 'finish' | 'feature' | 'accessory';
}

export interface QuantityTier {
  min: number;
  max: number;
  discount: number;
  label: string;
}

export interface QuoteInput {
  bagType: string;
  bagSize: string;
  customWidth?: number;
  customHeight?: number;
  customGusset?: number;
  material: string;
  processes: string[];
  quantity: number;
  printColors: number;
}

export interface QuoteResult {
  unitPrice: number;
  totalPrice: number;
  quantity: number;
  toleranceLow: { price: number; quantity: number };
  toleranceTarget: { price: number; quantity: number };
  toleranceHigh: { price: number; quantity: number };
  priceBreaks: { quantity: number; unitPrice: number; totalPrice: number }[];
  deliveryDays: { min: number; max: number };
  moqMet: boolean;
  moqRequired: number;
  breakdown: {
    materialCost: number;
    processCost: number;
    printingCost: number;
    setupCostPerUnit: number;
    margin: number;
  };
  bagType: BagType;
  bagSize: BagSize;
  material: Material;
  processes: ProcessOption[];
}

// ---- Static Data ----

/** 仅保留 4 种袋型：自立袋、风琴袋、平口袋（背封）、平底袋 */
export const BAG_TYPES: BagType[] = [
  {
    id: 'stand-up',
    name: '自立袋',
    nameEn: 'Stand Up Pouch',
    description: 'Self-standing with bottom gusset',
    emoji: '🛍️',
    multiplier: 1.0,
  },
  {
    id: 'gusseted',
    name: '风琴袋',
    nameEn: 'Gusseted Bag',
    description: 'Side gussets for extra capacity',
    emoji: '📐',
    multiplier: 1.1,
  },
  {
    id: 'flat-pouch',
    name: '平口袋',
    nameEn: 'Flat Pouch',
    description: 'Center back seal, flat front',
    emoji: '📄',
    multiplier: 0.88,
  },
  {
    id: 'flat-bottom',
    name: '平底袋',
    nameEn: 'Flat Bottom Bag',
    description: 'Stable flat base',
    emoji: '📦',
    multiplier: 1.28,
  },
];

/** 报价页展示用袋型（与 BAG_TYPES 一致，共 4 种） */
export const BAG_TYPES_QUOTE_UI = BAG_TYPES;

export const BAG_SIZES: BagSize[] = [
  {
    id: 'xs',
    label: '50g 小',
    labelEn: '2 oz',
    width: 100,
    height: 150,
    gusset: 60,
    volumeLabel: '约50g',
    surfaceArea: 0.024,
  },
  {
    id: 'sm',
    label: '100g 中小',
    labelEn: '4 oz',
    width: 120,
    height: 180,
    gusset: 70,
    volumeLabel: '约100g',
    surfaceArea: 0.034,
  },
  {
    id: 'md',
    label: '250g 中',
    labelEn: '8 oz',
    width: 140,
    height: 200,
    gusset: 80,
    volumeLabel: '约250g',
    surfaceArea: 0.044,
  },
  {
    id: 'lg',
    label: '500g 大',
    labelEn: '16 oz',
    width: 160,
    height: 240,
    gusset: 90,
    volumeLabel: '约500g',
    surfaceArea: 0.058,
  },
  {
    id: 'xl',
    label: '1kg 加大',
    labelEn: '32 oz',
    width: 200,
    height: 300,
    gusset: 100,
    volumeLabel: '约1kg',
    surfaceArea: 0.09,
  },
  {
    id: '2kg',
    label: '2kg 特大',
    labelEn: '64 oz',
    width: 240,
    height: 350,
    gusset: 120,
    volumeLabel: '约2kg',
    surfaceArea: 0.126,
  },
  {
    id: 'custom',
    label: '自定义',
    labelEn: 'Custom',
    width: 0,
    height: 0,
    gusset: 0,
    volumeLabel: '自定义',
    surfaceArea: 0,
  },
];

export const MATERIALS: Material[] = [
  {
    id: 'pet-pe',
    name: 'PET / PE',
    layers: 'PET + PE Laminate',
    description: 'Standard clear laminate',
    costPerSqm: 8,
    barrier: 'low',
    isEco: false,
    isMatte: false,
    isTransparent: true,
    suitableFor: ['零食', '糖果'],
    pros: [],
    cons: [],
    color: '#3b82f6',
  },
  {
    id: 'pet-al-pe',
    name: 'PET / AL / PE',
    layers: 'PET + Aluminum Foil + PE',
    description: 'Aluminum foil high-barrier',
    costPerSqm: 15,
    barrier: 'ultra',
    isEco: false,
    isMatte: false,
    isTransparent: false,
    suitableFor: ['咖啡', '茶叶'],
    pros: [],
    cons: [],
    color: '#6366f1',
  },
  {
    id: 'kraft-pe',
    name: 'Kraft / PE',
    layers: 'Kraft Paper + PE',
    description: 'Natural kraft paper look',
    costPerSqm: 10,
    barrier: 'low',
    isEco: false,
    isMatte: true,
    isTransparent: false,
    suitableFor: ['咖啡', '茶叶'],
    pros: [],
    cons: [],
    color: '#d97706',
  },
  {
    id: 'pla-pbat',
    name: 'PLA / PBAT',
    layers: 'PLA + PBAT Biodegradable',
    description: 'Fully biodegradable',
    costPerSqm: 20,
    barrier: 'low',
    isEco: true,
    isMatte: true,
    isTransparent: false,
    suitableFor: ['有机食品'],
    pros: [],
    cons: [],
    color: '#16a34a',
  },
  {
    id: 'kraft-pla',
    name: 'Kraft / PLA',
    layers: 'Kraft Paper + PLA',
    description: 'Eco-meets-natural',
    costPerSqm: 17,
    barrier: 'low',
    isEco: true,
    isMatte: true,
    isTransparent: false,
    suitableFor: ['有机食品'],
    pros: [],
    cons: [],
    color: '#65a30d',
  },
  {
    id: 'silver',
    name: 'silver',
    layers: 'Silver Metalized Film + PE',
    description: 'Silver metallic finish',
    costPerSqm: 11,
    barrier: 'medium',
    isEco: false,
    isMatte: false,
    isTransparent: false,
    suitableFor: ['咖啡', '零食', '高端包装'],
    pros: [],
    cons: [],
    color: '#94a3b8',
  },
  {
    id: 'bopp-cpp',
    name: 'BOPP / CPP',
    layers: 'BOPP + CPP',
    description: 'General-purpose film',
    costPerSqm: 7,
    barrier: 'low',
    isEco: false,
    isMatte: false,
    isTransparent: true,
    suitableFor: ['面包', '饼干'],
    pros: [],
    cons: [],
    color: '#f59e0b',
  },
];

export const PROCESS_OPTIONS: ProcessOption[] = [
  {
    id: 'gravure',
    name: '凹版印刷',
    nameEn: 'Gravure Print',
    description: 'Large-run printing',
    costType: 'per_order',
    cost: 500,
    isDefault: true,
    category: 'printing',
  },
  {
    id: 'flexo',
    name: '柔版印刷',
    nameEn: 'Flexo Print',
    description: 'Mid-volume',
    costType: 'per_order',
    cost: 280,
    isDefault: false,
    category: 'printing',
  },
  {
    id: 'digital',
    name: '数码印刷',
    nameEn: 'Digital Print',
    description: 'Short runs, no plate',
    costType: 'per_unit',
    cost: 0.05,
    isDefault: false,
    category: 'printing',
  },
  {
    id: 'gloss-lamination',
    name: '亮光覆膜',
    nameEn: 'Gloss Lamination',
    description: 'Glossy finish',
    costType: 'per_sqm',
    cost: 1.5,
    isDefault: false,
    category: 'finish',
  },
  {
    id: 'matte-lamination',
    name: '哑光覆膜',
    nameEn: 'Matte Lamination',
    description: 'Matte finish',
    costType: 'per_sqm',
    cost: 1.8,
    isDefault: false,
    category: 'finish',
  },
  {
    id: 'spot-uv',
    name: '局部光油',
    nameEn: 'Spot UV',
    description: 'Selective gloss',
    costType: 'per_sqm',
    cost: 2.5,
    isDefault: false,
    category: 'finish',
  },
  {
    id: 'soft-touch',
    name: '肤感膜',
    nameEn: 'Soft Touch',
    description: 'Soft touch finish',
    costType: 'per_sqm',
    cost: 1.8,
    isDefault: false,
    category: 'finish',
  },
  {
    id: 'holographic',
    name: '镭射',
    nameEn: 'Holographic',
    description: 'Holographic finish',
    costType: 'per_sqm',
    cost: 2,
    isDefault: false,
    category: 'finish',
  },
  {
    id: 'zipper',
    name: '普通自封',
    nameEn: 'Press-to-close',
    description: 'Resealable',
    costType: 'per_unit',
    cost: 0.012,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'zipper-pocket',
    name: '易撕拉链',
    nameEn: 'Pocket Zipper',
    description: 'Easy-open zipper',
    costType: 'per_unit',
    cost: 0.015,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'zipper-child',
    name: '防儿童开启',
    nameEn: 'Child Resistant',
    description: 'Child resistant zipper',
    costType: 'per_unit',
    cost: 0.02,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'valve',
    name: '单向排气阀',
    nameEn: 'One-way Degassing Valve',
    description: 'One-way valve',
    costType: 'per_unit',
    cost: 0.018,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'tear-notch',
    name: '双侧易撕口',
    nameEn: 'Both Sides',
    description: 'Easy-open',
    costType: 'per_unit',
    cost: 0.003,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'tear-notch-left',
    name: '左侧易撕口',
    nameEn: 'Left Only',
    description: 'Left side tear',
    costType: 'per_unit',
    cost: 0.003,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'hang-hole-euro',
    name: '飞机孔',
    nameEn: 'Euro Hole',
    description: 'Peg display',
    costType: 'per_unit',
    cost: 0.002,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'hang-hole-round',
    name: '圆孔',
    nameEn: 'Round Hole',
    description: 'Round hang hole',
    costType: 'per_unit',
    cost: 0.002,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'corner-square',
    name: '直角',
    nameEn: 'Square',
    description: 'Square corners',
    costType: 'per_unit',
    cost: 0,
    isDefault: true,
    category: 'feature',
  },
  {
    id: 'round-corner',
    name: '圆角',
    nameEn: 'Rounded',
    description: 'Rounded corners',
    costType: 'per_unit',
    cost: 0.005,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'clear-window',
    name: '透明窗口',
    nameEn: 'Clear Window',
    description: 'Viewing window',
    costType: 'per_unit',
    cost: 0.01,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'spout-corner',
    name: '角落吸嘴',
    nameEn: 'Corner Spout',
    description: 'Pour spout',
    costType: 'per_unit',
    cost: 0.04,
    isDefault: false,
    category: 'accessory',
  },
  {
    id: 'spout-center',
    name: '中间吸嘴',
    nameEn: 'Center Spout',
    description: 'Center spout',
    costType: 'per_unit',
    cost: 0.04,
    isDefault: false,
    category: 'accessory',
  },
  {
    id: 'tin-tie',
    name: '铁丝扎口',
    nameEn: 'Tin Tie',
    description: 'Metal closure',
    costType: 'per_unit',
    cost: 0.008,
    isDefault: false,
    category: 'accessory',
  },
];

export const QUANTITY_TIERS: QuantityTier[] = [
  { min: 10, max: 99, discount: 1.5, label: '10–99' },
  { min: 100, max: 499, discount: 1.2, label: '100–499' },
  { min: 500, max: 999, discount: 1.0, label: '500–999' },
  { min: 1000, max: 2499, discount: 0.88, label: '1,000–2,499' },
  { min: 2500, max: 4999, discount: 0.75, label: '2,500–4,999' },
  { min: 5000, max: 9999, discount: 0.65, label: '5,000–9,999' },
  { min: 10000, max: 24999, discount: 0.55, label: '10,000–24,999' },
  { min: 25000, max: 49999, discount: 0.48, label: '25,000–49,999' },
  { min: 50000, max: 100000, discount: 0.42, label: '50,000–100,000' },
];

export const MOQ_RULES: Record<string, number> = {
  gravure: 3000,
  flexo: 1000,
  digital: 100,
};

// ---- Calculation Engine ----

function getSurfaceArea(
  size: BagSize,
  customW?: number,
  customH?: number,
  customG?: number,
): number {
  if (size.id === 'custom' && customW && customH) {
    const w = customW / 1000;
    const h = customH / 1000;
    const g = (customG || 0) / 1000;
    return 2 * (w * h) + 2 * (g * h) + w * g;
  }
  return size.surfaceArea;
}

function getQuantityDiscount(qty: number): number {
  for (const tier of QUANTITY_TIERS) {
    if (qty >= tier.min && qty <= tier.max) return tier.discount;
  }
  if (qty > 100000) return 0.38;
  return 1.0;
}

function getPrintingType(processes: string[]): string {
  if (processes.includes('digital')) return 'digital';
  if (processes.includes('flexo')) return 'flexo';
  return 'gravure';
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const bagType = BAG_TYPES.find((b) => b.id === input.bagType)!;
  const bagSize = BAG_SIZES.find((s) => s.id === input.bagSize)!;
  const material = MATERIALS.find((m) => m.id === input.material)!;
  const selectedProcesses = PROCESS_OPTIONS.filter((p) => input.processes.includes(p.id));

  const surfaceArea = getSurfaceArea(
    bagSize,
    input.customWidth,
    input.customHeight,
    input.customGusset,
  );
  const quantity = Math.max(input.quantity, 10);

  const materialCost = material.costPerSqm * surfaceArea * bagType.multiplier;

  let processCostPerUnit = 0;
  let setupCostTotal = 0;
  for (const proc of selectedProcesses) {
    switch (proc.costType) {
      case 'per_unit':
        processCostPerUnit += proc.cost;
        break;
      case 'per_order':
        setupCostTotal += proc.cost;
        break;
      case 'per_sqm':
        processCostPerUnit += proc.cost * surfaceArea;
        break;
    }
  }

  const printColorCost = input.printColors * 0.12 * surfaceArea;
  const setupCostPerUnit = setupCostTotal / quantity;
  const baseCost = materialCost + processCostPerUnit + printColorCost + setupCostPerUnit;
  const discount = getQuantityDiscount(quantity);
  const discountedCost = baseCost * discount;
  const margin = 0.25;
  const unitPrice = discountedCost * (1 + margin);

  const finalUnitPrice = Math.round(unitPrice * 10000) / 10000;
  const totalPrice = Math.round(finalUnitPrice * quantity * 100) / 100;

  const toleranceLowQty = Math.floor(quantity * 0.95);
  const toleranceHighQty = Math.ceil(quantity * 1.05);
  const toleranceLowPrice = Math.round(finalUnitPrice * toleranceLowQty * 100) / 100;
  const toleranceHighPrice = Math.round(finalUnitPrice * toleranceHighQty * 100) / 100;

  const priceBreaks = QUANTITY_TIERS.map((tier) => {
    const tierBaseCost =
      materialCost + processCostPerUnit + printColorCost + setupCostTotal / tier.min;
    const tierUnitPrice = Math.round(tierBaseCost * tier.discount * (1 + margin) * 10000) / 10000;
    return {
      quantity: tier.min,
      unitPrice: tierUnitPrice,
      totalPrice: Math.round(tierUnitPrice * tier.min * 100) / 100,
    };
  });

  const printingType = getPrintingType(input.processes);
  const moqRequired = MOQ_RULES[printingType] ?? 1000;
  const moqMet = quantity >= moqRequired;

  let deliveryMin = 12;
  let deliveryMax = 18;
  if (printingType === 'digital') {
    deliveryMin = 5;
    deliveryMax = 8;
  } else if (printingType === 'flexo') {
    deliveryMin = 8;
    deliveryMax = 14;
  }
  if (quantity > 10000) {
    deliveryMin += 3;
    deliveryMax += 5;
  }
  if (selectedProcesses.some((p) => p.id === 'spot-uv')) {
    deliveryMin += 2;
    deliveryMax += 3;
  }

  return {
    unitPrice: finalUnitPrice,
    totalPrice,
    quantity,
    toleranceLow: { price: toleranceLowPrice, quantity: toleranceLowQty },
    toleranceTarget: { price: totalPrice, quantity },
    toleranceHigh: { price: toleranceHighPrice, quantity: toleranceHighQty },
    priceBreaks,
    deliveryDays: { min: deliveryMin, max: deliveryMax },
    moqMet,
    moqRequired,
    breakdown: {
      materialCost: Math.round(materialCost * 10000) / 10000,
      processCost: Math.round(processCostPerUnit * 10000) / 10000,
      printingCost: Math.round(printColorCost * 10000) / 10000,
      setupCostPerUnit: Math.round(setupCostPerUnit * 10000) / 10000,
      margin: Math.round(((unitPrice * margin) / (1 + margin)) * 10000) / 10000,
    },
    bagType,
    bagSize,
    material,
    processes: selectedProcesses,
  };
}

// ---- Formatting ----

const USD_TO_CNY = 7.2;

export function formatUSD(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatUSDUnit(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

/** 人民币显示（按汇率换算，用于页面展示） */
export function formatCNY(price: number): string {
  return `¥ ${(price * USD_TO_CNY).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCNYUnit(price: number): string {
  return `¥ ${(price * USD_TO_CNY).toLocaleString('zh-CN', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
}

export function getDeliveryDateRange(days: { min: number; max: number }): {
  start: string;
  end: string;
} {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  let addedMin = 0;
  while (addedMin < days.min) {
    start.setDate(start.getDate() + 1);
    if (start.getDay() !== 0 && start.getDay() !== 6) addedMin++;
  }
  let addedMax = 0;
  while (addedMax < days.max) {
    end.setDate(end.getDate() + 1);
    if (end.getDay() !== 0 && end.getDay() !== 6) addedMax++;
  }
  const months = [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ];
  const fmt = (d: Date) => `${months[d.getMonth()]}${d.getDate()}日`;
  return { start: fmt(start), end: fmt(end) };
}
