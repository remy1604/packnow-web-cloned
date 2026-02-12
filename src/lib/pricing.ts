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
    id: 'three-side',
    name: '三边封袋',
    nameEn: '3-Side Seal Bag',
    description: 'Three-side sealed, cost-effective',
    emoji: '📋',
    multiplier: 0.82,
  },
  {
    id: 'eight-side',
    name: '八边封袋',
    nameEn: '8-Side Seal Bag',
    description: 'Box-shaped premium pouch',
    emoji: '🎁',
    multiplier: 1.35,
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
    id: 'flat-bottom',
    name: '平底袋',
    nameEn: 'Flat Bottom Bag',
    description: 'Stable flat base',
    emoji: '📦',
    multiplier: 1.28,
  },
  {
    id: 'back-seal',
    name: '背封袋',
    nameEn: 'Back Seal Bag',
    description: 'Center back seal',
    emoji: '📄',
    multiplier: 0.88,
  },
];

export const BAG_SIZES: BagSize[] = [
  {
    id: 'xs',
    label: '50g Small',
    labelEn: '2 oz',
    width: 100,
    height: 150,
    gusset: 60,
    volumeLabel: '~2 oz',
    surfaceArea: 0.024,
  },
  {
    id: 'sm',
    label: '100g Medium-Small',
    labelEn: '4 oz',
    width: 120,
    height: 180,
    gusset: 70,
    volumeLabel: '~4 oz',
    surfaceArea: 0.034,
  },
  {
    id: 'md',
    label: '250g Medium',
    labelEn: '8 oz',
    width: 140,
    height: 200,
    gusset: 80,
    volumeLabel: '~8 oz',
    surfaceArea: 0.044,
  },
  {
    id: 'lg',
    label: '500g Large',
    labelEn: '16 oz',
    width: 160,
    height: 240,
    gusset: 90,
    volumeLabel: '~16 oz',
    surfaceArea: 0.058,
  },
  {
    id: 'xl',
    label: '1kg X-Large',
    labelEn: '32 oz',
    width: 200,
    height: 300,
    gusset: 100,
    volumeLabel: '~32 oz',
    surfaceArea: 0.09,
  },
  {
    id: '2kg',
    label: '2kg XX-Large',
    labelEn: '64 oz',
    width: 240,
    height: 350,
    gusset: 120,
    volumeLabel: '~64 oz',
    surfaceArea: 0.126,
  },
  {
    id: 'custom',
    label: 'Custom',
    labelEn: 'Custom',
    width: 0,
    height: 0,
    gusset: 0,
    volumeLabel: 'Custom',
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
    id: 'pet-vmpet-pe',
    name: 'PET / VMPET / PE',
    layers: 'PET + Metalized PET + PE',
    description: 'Metalized barrier film',
    costPerSqm: 12,
    barrier: 'high',
    isEco: false,
    isMatte: false,
    isTransparent: false,
    suitableFor: ['咖啡', '坚果'],
    pros: [],
    cons: [],
    color: '#8b5cf6',
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
    id: 'mopp-pe',
    name: 'MOPP / PE',
    layers: 'Matte OPP + PE',
    description: 'Matte finish film',
    costPerSqm: 9.5,
    barrier: 'medium',
    isEco: false,
    isMatte: true,
    isTransparent: false,
    suitableFor: ['咖啡', '巧克力'],
    pros: [],
    cons: [],
    color: '#64748b',
  },
  {
    id: 'nylon-pe',
    name: 'Nylon / PE',
    layers: 'Nylon + PE',
    description: 'High-strength puncture-resistant',
    costPerSqm: 13,
    barrier: 'medium',
    isEco: false,
    isMatte: false,
    isTransparent: true,
    suitableFor: ['冷冻食品'],
    pros: [],
    cons: [],
    color: '#0891b2',
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
    id: 'pet-pe-white',
    name: 'PET / PE White',
    layers: 'PET + White PE',
    description: 'White base film',
    costPerSqm: 9,
    barrier: 'low',
    isEco: false,
    isMatte: false,
    isTransparent: false,
    suitableFor: ['零食', '糖果'],
    pros: [],
    cons: [],
    color: '#f1f5f9',
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
    name: '局部UV',
    nameEn: 'Spot UV',
    description: 'Selective gloss',
    costType: 'per_sqm',
    cost: 2.5,
    isDefault: false,
    category: 'finish',
  },
  {
    id: 'zipper',
    name: '拉链',
    nameEn: 'Zipper',
    description: 'Resealable',
    costType: 'per_unit',
    cost: 0.012,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'valve',
    name: '排气阀',
    nameEn: 'Degassing Valve',
    description: 'One-way valve',
    costType: 'per_unit',
    cost: 0.018,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'tear-notch',
    name: '撕口',
    nameEn: 'Tear Notch',
    description: 'Easy-open',
    costType: 'per_unit',
    cost: 0.003,
    isDefault: false,
    category: 'feature',
  },
  {
    id: 'hang-hole',
    name: '挂孔',
    nameEn: 'Hang Hole',
    description: 'Peg display',
    costType: 'per_unit',
    cost: 0.002,
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
    id: 'round-corner',
    name: '圆角',
    nameEn: 'Round Corner',
    description: 'Rounded corners',
    costType: 'per_unit',
    cost: 0.005,
    isDefault: false,
    category: 'feature',
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
  {
    id: 'spout',
    name: '吸嘴',
    nameEn: 'Spout',
    description: 'Pour spout',
    costType: 'per_unit',
    cost: 0.04,
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
