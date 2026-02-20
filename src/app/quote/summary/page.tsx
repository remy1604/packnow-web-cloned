'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronDown,
  ChevronUp,
  Check,
  Layers,
  Package,
  Shield,
  Award,
  Leaf,
  Box,
  Recycle,
  FlaskConical,
  ShoppingCart,
  Palette,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  BAG_TYPES_QUOTE_UI,
  BAG_SIZES,
  MATERIALS,
  PROCESS_OPTIONS,
  calculateQuote,
  type QuoteInput,
} from '@/lib/pricing';
import { useUnit, formatDimensions } from '@/lib/units';
import { formatCNY, formatCNYUnit } from '@/lib/pricing';
import { CONTENT_OPTIONS, getQuoteDefaultsFromProduct } from '@/lib/quote-defaults';
import {
  filterMaterialsByProcesses,
  getProcessIdsToClearOnSelect,
  getDefaultMaterialWhenSpoutSelected,
  isProcessOptionDisabled,
  SPOUT_PROCESS_IDS,
  BAG_TYPES_ALLOWING_TIN_TIE,
} from '@/lib/quote-constraints';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { UnitProvider } from '@/lib/units';

const PackScene = dynamic(() => import('@/components/PackScene'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-full min-h-[280px] items-center justify-center rounded-xl">
      <span className="text-muted-foreground text-sm">加载 3D 预览…</span>
    </div>
  ),
});

/** 可选功能：多选一为选项列表，否则为是/否（与外观和功能特性表一致） */
const FEATURE_OPTIONS: Array<
  | { type: 'yesno'; label: string; processId: string }
  | {
      type: 'options';
      label: string;
      groupIds: string[];
      options: Array<{ id: string; name: string }>;
    }
> = [
  {
    type: 'options',
    label: '外观类型',
    groupIds: ['gloss-lamination', 'matte-lamination', 'spot-uv', 'soft-touch', 'holographic'],
    options: [
      { id: 'matte-lamination', name: '哑光' },
      { id: 'gloss-lamination', name: '亮光' },
      { id: 'soft-touch', name: '肤感膜' },
      { id: 'holographic', name: '镭射' },
      { id: 'spot-uv', name: '局部光油' },
      { id: 'none', name: '无' },
    ],
  },
  {
    type: 'options',
    label: '拉链类型',
    groupIds: ['zipper', 'zipper-pocket', 'zipper-child'],
    options: [
      { id: 'zipper', name: '普通自封' },
      { id: 'zipper-pocket', name: '易撕拉链' },
      { id: 'zipper-child', name: '防儿童开启' },
      { id: 'none', name: '无' },
    ],
  },
  { type: 'yesno', label: '气阀类型', processId: 'valve' },
  {
    type: 'options',
    label: '易撕口类型',
    groupIds: ['tear-notch', 'tear-notch-left'],
    options: [
      { id: 'tear-notch', name: '双侧' },
      { id: 'tear-notch-left', name: '左侧' },
      { id: 'none', name: '无' },
    ],
  },
  {
    type: 'options',
    label: '挂孔类型',
    groupIds: ['hang-hole-euro', 'hang-hole-round'],
    options: [
      { id: 'hang-hole-euro', name: '飞机孔' },
      { id: 'hang-hole-round', name: '圆孔' },
      { id: 'none', name: '无' },
    ],
  },
  {
    type: 'options',
    label: '倒角类型',
    groupIds: ['corner-square', 'round-corner'],
    options: [
      { id: 'corner-square', name: '直角' },
      { id: 'round-corner', name: '圆角' },
    ],
  },
  { type: 'yesno', label: '透明窗口', processId: 'clear-window' },
  {
    type: 'options',
    label: '吸嘴类型',
    groupIds: ['spout-corner', 'spout-center'],
    options: [
      { id: 'spout-corner', name: '角落吸嘴' },
      { id: 'spout-center', name: '中间吸嘴' },
      { id: 'none', name: '无' },
    ],
  },
  { type: 'yesno', label: '铁丝扎口', processId: 'tin-tie' },
];

const QUANTITY_PRESETS = [500, 1000, 3000, 5000, 10000];

/** 材质卡片展示配置：与报价页一致 */
const MATERIAL_CARD_CONFIG: Record<
  string,
  { titleZh: string; descriptionZh: string; icon: LucideIcon }
> = {
  'pet-pe': {
    titleZh: '标准款',
    descriptionZh: '日常通用，性价比高，适合多数基础包装需求。',
    icon: Package,
  },
  'pet-al-pe': {
    titleZh: '铝箔高阻隔',
    descriptionZh: '适合对防潮、保香、避光要求更高的产品。',
    icon: Shield,
  },
  'pet-vmpet-pe': {
    titleZh: 'Mylar 高阻隔',
    descriptionZh: '防潮与防味表现好，常用于精品零食与茶咖类。',
    icon: Award,
  },
  'kraft-pe': {
    titleZh: '牛皮纸风格',
    descriptionZh: '自然质感，适合强调品牌调性的产品。',
    icon: Leaf,
  },
  'mopp-pe': {
    titleZh: '哑光膜',
    descriptionZh: '哑光表面，适合咖啡、巧克力等。',
    icon: Box,
  },
  'nylon-pe': {
    titleZh: '尼龙加强',
    descriptionZh: '高强耐穿刺，适合冷冻与重包装。',
    icon: Shield,
  },
  'pla-pbat': {
    titleZh: '可堆肥',
    descriptionZh: '环保导向方案，适合可持续包装场景。',
    icon: Leaf,
  },
  'kraft-pla': {
    titleZh: '可回收',
    descriptionZh: '在环保与性能间平衡，适合长期品牌策略。',
    icon: Recycle,
  },
  'pet-pe-white': {
    titleZh: '白底膜',
    descriptionZh: '白底印刷，适合色彩饱满的版面。',
    icon: Box,
  },
  silver: {
    titleZh: '银',
    descriptionZh: '银质金属光泽，适合高端与礼品包装。',
    icon: Award,
  },
  'bopp-cpp': {
    titleZh: '定制结构',
    descriptionZh: '按产品特性定制复合结构与保护性能。',
    icon: FlaskConical,
  },
};

function QuoteSummaryContent() {
  const searchParams = useSearchParams();
  const [bagType, setBagType] = useState('');
  const [bagSize, setBagSize] = useState('md');
  const [material, setMaterial] = useState('');
  const [quantity, setQuantity] = useState(1000);
  const [contentId, setContentId] = useState('coffee');
  const [processes, setProcesses] = useState<string[]>(['digital', 'tear-notch', 'corner-square']);
  const [printColors, setPrintColors] = useState(4);
  const [customW] = useState(140);
  const [customH] = useState(200);
  const [customG] = useState(80);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quantity: true,
    content: true,
    size: true,
    material: true,
    features: true,
  });
  const productId = searchParams.get('product');

  useEffect(() => {
    const { bagTypeId, contentId: cId } = getQuoteDefaultsFromProduct(productId);
    queueMicrotask(() => {
      if (bagTypeId) setBagType(bagTypeId);
      if (cId) setContentId(cId);
    });
  }, [productId]);

  useEffect(() => {
    const bagTypeFromUrl = searchParams.get('bagType');
    const bagSizeFromUrl = searchParams.get('bagSize');
    const materialFromUrl = searchParams.get('material');
    const quantityFromUrl = searchParams.get('quantity');
    const processesFromUrl = searchParams.get('processes');
    const printColorsFromUrl = searchParams.get('printColors');
    queueMicrotask(() => {
      if (bagTypeFromUrl) setBagType(bagTypeFromUrl);
      if (bagSizeFromUrl) setBagSize(bagSizeFromUrl);
      if (materialFromUrl) setMaterial(materialFromUrl);
      if (quantityFromUrl) setQuantity(Number(quantityFromUrl) || 1000);
      if (processesFromUrl) setProcesses(processesFromUrl.split(',').filter(Boolean));
      if (printColorsFromUrl) setPrintColors(Number(printColorsFromUrl) || 4);
    });
  }, [searchParams]);

  const { unit } = useUnit();
  const input: QuoteInput = useMemo(
    () => ({
      bagType: bagType || 'stand-up',
      bagSize,
      customWidth: bagSize === 'custom' ? customW : undefined,
      customHeight: bagSize === 'custom' ? customH : undefined,
      customGusset: bagSize === 'custom' ? customG : undefined,
      material: (material || MATERIALS[0]?.id) ?? 'pet-pe',
      processes,
      quantity,
      printColors,
    }),
    [bagType, bagSize, material, processes, quantity, printColors, customW, customH, customG],
  );

  const result = useMemo(() => {
    if (!bagType || !material) return null;
    try {
      return calculateQuote(input);
    } catch {
      return null;
    }
  }, [input, bagType, material]);

  const toggleSection = useCallback((key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleProcess = useCallback(
    (id: string) => {
      const proc = PROCESS_OPTIONS.find((p) => p.id === id);
      if (proc?.category === 'printing') {
        setProcesses((prev) => {
          const others = PROCESS_OPTIONS.filter(
            (p) => p.category === 'printing' && p.id !== id,
          ).map((p) => p.id);
          const cleaned = prev.filter((p) => !others.includes(p));
          return prev.includes(id) ? cleaned.filter((p) => p !== id) : [...cleaned, id];
        });
      } else {
        const isAdding = !processes.includes(id);
        const toClear = isAdding ? getProcessIdsToClearOnSelect(id) : [];
        setProcesses((prev) => {
          let next = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
          toClear.forEach((cid) => {
            next = next.filter((p) => p !== cid);
          });
          return next;
        });
        if (isAdding && SPOUT_PROCESS_IDS.includes(id)) {
          setMaterial((prev) => getDefaultMaterialWhenSpoutSelected(MATERIALS, prev));
        }
      }
    },
    [processes],
  );

  /** 多选一：选中某选项时清空同组其它项并加入当前项（id 为 none 时只清空） */
  const setProcessOptionGroup = useCallback((groupIds: string[], selectedId: string) => {
    setProcesses((prev) => {
      let next = prev.filter((p) => !groupIds.includes(p));
      if (selectedId !== 'none') {
        getProcessIdsToClearOnSelect(selectedId).forEach((cid) => {
          next = next.filter((p) => p !== cid);
        });
        next = [...next, selectedId];
      }
      return next;
    });
    if (selectedId !== 'none' && SPOUT_PROCESS_IDS.includes(selectedId)) {
      setMaterial((prev) => getDefaultMaterialWhenSpoutSelected(MATERIALS, prev));
    }
  }, []);

  const processCount = processes.length;

  const studioHref = useMemo(() => {
    const params = new URLSearchParams();
    if (productId) params.set('product', productId);
    if (bagType) params.set('bagType', bagType);
    if (bagSize) params.set('bagSize', bagSize);
    if (bagSize === 'custom') {
      params.set('customW', String(customW));
      params.set('customH', String(customH));
      params.set('customG', String(customG));
    }
    if (material) params.set('material', material);
    params.set('quantity', String(quantity));
    params.set('processes', processes.join(','));
    params.set('printColors', String(printColors));
    const q = params.toString();
    return q ? `/studio?${q}` : '/studio';
  }, [
    productId,
    bagType,
    bagSize,
    material,
    quantity,
    processes,
    printColors,
    customW,
    customH,
    customG,
  ]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* 左侧：3D 预览 + 说明 */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-background relative overflow-hidden rounded-xl border min-h-[280px]">
              <PackScene
                bagType={bagType || 'stand-up'}
                sceneScaleMultiplier={11}
                cameraDistance={17}
              />
            </div>
            <div className="rounded-xl border border-primary/15 bg-gradient-to-br from-amber-50/60 via-muted/40 to-orange-50/40 p-4 text-sm text-muted-foreground dark:from-amber-950/20 dark:via-muted/40 dark:to-orange-950/10">
              <p className="font-medium text-primary">包装设计更快更省心</p>
              <p className="mt-1">可将当前报价配置作为打样前的产品规格基线。</p>
            </div>
          </div>

          {/* 右侧：报价价格 + 产品详情 + 可折叠区块 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 报价价格 - 直接体现 */}
            {result ? (
              <div className="rounded-xl border border-primary/30 bg-primary/10 p-5">
                <p className="mb-1 text-sm font-medium text-primary">报价</p>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <span className="text-2xl font-bold text-green-700 dark:text-green-600">
                    {formatCNY(result.totalPrice)}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    预估单价 {formatCNYUnit(result.unitPrice)} · {quantity.toLocaleString()} 个
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-muted/50 border-border rounded-xl border p-5">
                <p className="text-muted-foreground text-sm">请完善产品类型与材质后显示报价。</p>
              </div>
            )}

            <div>
              <h1 className="text-lg font-semibold text-primary">产品详情</h1>
              <p className="text-muted-foreground mt-0.5 text-xs">请确认产品参数。</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {BAG_TYPES_QUOTE_UI.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      setBagType(t.id);
                      if (!BAG_TYPES_ALLOWING_TIN_TIE.includes(t.id)) {
                        setProcesses((prev) => prev.filter((p) => p !== 'tin-tie'));
                      }
                    }}
                    className={cn(
                      'rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                      bagType === t.id
                        ? 'border-primary bg-primary/5 text-foreground'
                        : 'border-border text-muted-foreground hover:border-muted-foreground/30',
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {/* 数量 */}
              <div className="rounded-lg border border-primary/15 overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card">
                <Collapsible
                  open={openSections.quantity}
                  onOpenChange={() => toggleSection('quantity')}
                >
                  <CollapsibleTrigger className="text-muted-foreground hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors">
                    <span className="font-medium">数量</span>
                    {openSections.quantity ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border/80 px-3 py-2 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {QUANTITY_PRESETS.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => setQuantity(q)}
                            className={cn(
                              'rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                              quantity === q ? 'border-primary bg-primary/10' : 'border-border',
                            )}
                          >
                            {q.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-muted-foreground text-xs whitespace-nowrap">
                          自定义数量
                        </label>
                        <input
                          type="number"
                          min={10}
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(10, Number(e.target.value) || 10))}
                          className="border-input bg-background w-24 rounded border px-2 py-1.5 text-xs"
                        />
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* 内容物 */}
              <div className="rounded-lg border border-primary/15 overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card">
                <Collapsible
                  open={openSections.content}
                  onOpenChange={() => toggleSection('content')}
                >
                  <CollapsibleTrigger className="text-muted-foreground hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors">
                    <span className="font-medium">内容物</span>
                    {openSections.content ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border/80 px-3 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {CONTENT_OPTIONS.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setContentId(c.id)}
                            className={cn(
                              'rounded-md border px-2.5 py-1.5 text-xs transition-colors',
                              contentId === c.id
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border hover:border-muted-foreground/50',
                            )}
                          >
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* 尺寸 */}
              <div className="rounded-lg border border-primary/15 overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card">
                <Collapsible open={openSections.size} onOpenChange={() => toggleSection('size')}>
                  <CollapsibleTrigger className="text-muted-foreground hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors">
                    <span className="font-medium">尺寸</span>
                    {openSections.size ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border/80 px-3 py-2">
                      <div className="flex flex-wrap gap-1.5">
                        {BAG_SIZES.filter((s) => s.id !== 'custom').map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setBagSize(s.id)}
                            className={cn(
                              'rounded-md border px-2.5 py-1.5 text-xs',
                              bagSize === s.id ? 'border-primary bg-primary/10' : 'border-border',
                            )}
                          >
                            {unit === 'imperial' ? s.labelEn : s.label}
                            <span className="text-muted-foreground ml-1 text-[10px]">
                              {formatDimensions(s.width, s.height, s.gusset, unit)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* 材质 + 表面处理 */}
              <div className="rounded-lg border border-primary/15 overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card">
                <Collapsible
                  open={openSections.material}
                  onOpenChange={() => toggleSection('material')}
                >
                  <CollapsibleTrigger className="text-muted-foreground hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors">
                    <span className="font-medium">材质</span>
                    {openSections.material ? (
                      <ChevronUp className="size-3.5" />
                    ) : (
                      <ChevronDown className="size-3.5" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-3 py-2">
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {filterMaterialsByProcesses(MATERIALS, processes).map((m) => {
                          const config = MATERIAL_CARD_CONFIG[m.id] ?? {
                            titleZh: m.name,
                            descriptionZh: m.description,
                            icon: Layers,
                          };
                          const IconComponent = config.icon;
                          const isSelected = material === m.id;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setMaterial(m.id)}
                              className={cn(
                                'flex items-center gap-2 rounded-lg border p-2 text-left transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-muted-foreground/30',
                              )}
                            >
                              <div
                                className="flex size-8 shrink-0 items-center justify-center rounded border"
                                style={{
                                  backgroundColor: `${m.color}20`,
                                  borderColor: m.color,
                                }}
                              >
                                <IconComponent className="size-4" style={{ color: m.color }} />
                              </div>
                              <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                                {config.titleZh}
                              </span>
                              {isSelected && (
                                <Check className="size-3.5 shrink-0 text-green-600 dark:text-green-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* 可选功能 */}
              <div className="rounded-lg border border-primary/15 overflow-hidden bg-gradient-to-br from-card via-primary/5 to-card">
                <Collapsible
                  open={openSections.features}
                  onOpenChange={() => toggleSection('features')}
                >
                  <CollapsibleTrigger className="text-muted-foreground hover:bg-muted/40 flex w-full items-center justify-between px-3 py-2 text-left text-xs transition-colors">
                    <span className="font-medium">可选功能</span>
                    <span className="flex items-center gap-1">
                      {processCount > 0 && (
                        <span className="text-muted-foreground text-[10px]">
                          {processCount} 已选
                        </span>
                      )}
                      {openSections.features ? (
                        <ChevronUp className="size-3.5" />
                      ) : (
                        <ChevronDown className="size-3.5" />
                      )}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-2 py-1.5 space-y-3">
                      {FEATURE_OPTIONS.map((feat) => {
                        if (feat.type === 'yesno') {
                          const p = PROCESS_OPTIONS.find((o) => o.id === feat.processId);
                          if (!p) return null;
                          const disabled = isProcessOptionDisabled(
                            feat.processId,
                            bagType || '',
                            material || '',
                            processes,
                          );
                          const selected = processes.includes(feat.processId);
                          return (
                            <div
                              key={feat.processId}
                              className={cn(
                                'flex items-center justify-between gap-2',
                                disabled && 'opacity-50',
                              )}
                            >
                              <p className="text-xs font-medium text-foreground">{feat.label}</p>
                              <div className="flex shrink-0 rounded border border-border p-0.5">
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => !disabled && toggleProcess(feat.processId)}
                                  className={cn(
                                    'rounded-sm px-2 py-1 text-xs transition-colors',
                                    selected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-transparent text-muted-foreground',
                                  )}
                                >
                                  是
                                </button>
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() =>
                                    !disabled && selected && toggleProcess(feat.processId)
                                  }
                                  className={cn(
                                    'rounded-sm px-2 py-1 text-xs transition-colors',
                                    !selected
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-transparent text-muted-foreground',
                                  )}
                                >
                                  否
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={feat.label}>
                            <p className="text-muted-foreground mb-1 text-[10px] font-medium">
                              {feat.label}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {feat.options.map((opt) => {
                                const isSelected =
                                  opt.id === 'none'
                                    ? !feat.groupIds.some((id) => processes.includes(id))
                                    : processes.includes(opt.id);
                                const disabled =
                                  opt.id !== 'none' &&
                                  isProcessOptionDisabled(
                                    opt.id,
                                    bagType || '',
                                    material || '',
                                    processes,
                                  );
                                return (
                                  <button
                                    key={opt.id}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => {
                                      if (disabled) return;
                                      setProcessOptionGroup(feat.groupIds, opt.id);
                                    }}
                                    className={cn(
                                      'rounded border px-2 py-0.5 text-xs',
                                      disabled && 'cursor-not-allowed opacity-50',
                                      isSelected ? 'border-primary bg-primary/10' : 'border-border',
                                    )}
                                  >
                                    {opt.name}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2 border-t border-border/80 space-y-1">
                        <p className="text-muted-foreground text-[10px] font-medium">印刷方式</p>
                        <div className="flex flex-wrap gap-1">
                          {PROCESS_OPTIONS.filter(
                            (p) => p.category === 'printing' && p.id === 'digital',
                          ).map((p) => {
                            const active = processes.includes(p.id);
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => toggleProcess(p.id)}
                                className={cn(
                                  'rounded border px-2 py-0.5 text-xs',
                                  active ? 'border-primary bg-primary/10' : 'border-border',
                                )}
                              >
                                {p.name}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Palette className="text-muted-foreground size-3" />
                          <span className="text-xs">印刷色数</span>
                          <div className="flex gap-0.5">
                            {[2, 3, 4, 5, 6].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => setPrintColors(n)}
                                className={cn(
                                  'flex size-5 items-center justify-center rounded border text-[10px]',
                                  printColors === n
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border',
                                )}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={studioHref}>
                  <Palette className="mr-2 size-4" />去 Studio 设计
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/checkout">
                  <ShoppingCart className="mr-2 size-4" />
                  直接结账
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <p className="text-muted-foreground">加载中…</p>
    </div>
  );
}

export default function QuoteSummaryPage() {
  return (
    <UnitProvider>
      <Suspense fallback={<SummaryFallback />}>
        <QuoteSummaryContent />
      </Suspense>
    </UnitProvider>
  );
}
