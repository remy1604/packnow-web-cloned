'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Package,
  Ruler,
  Layers,
  Settings,
  Hash,
  Receipt,
  AlertCircle,
  Palette,
  ChevronDown,
  ChevronRight,
  Award,
  Shield,
  Leaf,
  Recycle,
  FlaskConical,
  Box,
} from 'lucide-react';
import {
  BAG_TYPES_QUOTE_UI,
  BAG_SIZES,
  MATERIALS,
  PROCESS_OPTIONS,
  type QuoteResult as QuoteResultType,
} from '@/lib/pricing';
import {
  filterMaterialsByProcesses,
  getProcessIdsToClearOnSelect,
  getDefaultMaterialWhenSpoutSelected,
  isProcessOptionDisabled,
  SPOUT_PROCESS_IDS,
  BAG_TYPES_ALLOWING_TIN_TIE,
} from '@/lib/quote-constraints';
import { useUnit, formatDimensions, dimUnitLabel, mmToInchDecimal } from '@/lib/units';
import { QuoteResult } from '@/components/quote/QuoteResult';

import imgStandUp from '@/assets/images/stand-up-pouche.webp';
import imgFlatPouch from '@/assets/images/flat-pouch.png';
import imgFlatBottom from '@/assets/images/flat-bottom-bag.webp';
import imgGusset from '@/assets/images/gusset-bag.webp';

/** 仅 4 种袋型：自立袋、风琴袋、平口袋、平底袋 */
const BAG_TYPE_IMAGES: Record<string, { src: typeof imgStandUp; alt: string }> = {
  'stand-up': { src: imgStandUp, alt: '自立袋' },
  gusseted: { src: imgGusset, alt: '风琴袋' },
  'flat-pouch': { src: imgFlatPouch, alt: '平口袋' },
  'flat-bottom': { src: imgFlatBottom, alt: '平底袋' },
};
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

/** 材质卡片展示配置：中文标题、描述、图标 */
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

/** 可选功能：多选一为选项列表，否则为是/否（与摘要页一致） */
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

function getBarrierTag(barrier: string): { label: string; className: string } {
  switch (barrier) {
    case 'ultra':
      return {
        label: '超高阻隔',
        className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
      };
    case 'high':
      return {
        label: '高阻隔',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      };
    case 'medium':
      return {
        label: '中阻隔',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      };
    default:
      return {
        label: '基础',
        className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      };
  }
}

const STEPS = [
  { id: 'type', label: '袋型', icon: Package },
  { id: 'size', label: '尺寸', icon: Ruler },
  { id: 'material', label: '材质', icon: Layers },
  { id: 'process', label: '工艺', icon: Settings },
  { id: 'quantity', label: '数量', icon: Hash },
  { id: 'result', label: '报价', icon: Receipt },
];

const BAG_TYPE_IDS = new Set(BAG_TYPES_QUOTE_UI.map((t) => t.id));

export function QuoteStepWizard({
  initialBagType,
  onBagTypeChange,
}: {
  /** 从首页等传入的袋型，进入报价页时预选 */
  initialBagType?: string;
  /** 袋型变化时回调，用于左侧 3D 预览联动 */
  onBagTypeChange?: (bagTypeId: string) => void;
}) {
  const router = useRouter();
  const { unit } = useUnit();
  const [step, setStep] = useState(0);
  const [bagType, setBagType] = useState(() =>
    initialBagType && BAG_TYPE_IDS.has(initialBagType) ? initialBagType : '',
  );
  useEffect(() => {
    if (initialBagType && BAG_TYPE_IDS.has(initialBagType)) {
      queueMicrotask(() => {
        setBagType(initialBagType);
        onBagTypeChange?.(initialBagType);
      });
    }
  }, [initialBagType, onBagTypeChange]);
  const [bagSize, setBagSize] = useState('');
  const [customW, setCustomW] = useState(140);
  const [customH, setCustomH] = useState(200);
  const [customG, setCustomG] = useState(80);
  const [material, setMaterial] = useState('');
  const [processes, setProcesses] = useState<string[]>(['digital', 'tear-notch']);
  const [quantity, setQuantity] = useState(1000);
  const [printColors, setPrintColors] = useState(4);
  const [result] = useState<QuoteResultType | null>(null);
  const [expandedMaterialId, setExpandedMaterialId] = useState<string | null>(null);

  const canNext = useCallback(() => {
    switch (step) {
      case 0:
        return !!bagType;
      case 1:
        return !!bagSize;
      case 2:
        return !!material;
      case 3:
        return processes.length > 0;
      case 4:
        return quantity >= 10;
      default:
        return true;
    }
  }, [step, bagType, bagSize, material, processes, quantity]);

  const handleNext = () => {
    if (step === 4) {
      const params = new URLSearchParams();
      params.set('bagType', bagType);
      params.set('bagSize', bagSize);
      if (bagSize === 'custom') {
        params.set('customW', String(customW));
        params.set('customH', String(customH));
        params.set('customG', String(customG));
      }
      params.set('material', material);
      params.set('quantity', String(quantity));
      params.set('processes', processes.join(','));
      params.set('printColors', String(printColors));
      router.push(`/quote/summary?${params.toString()}`);
      return;
    }
    if (step < STEPS.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const toggleProcess = (id: string) => {
    const proc = PROCESS_OPTIONS.find((p) => p.id === id);
    if (proc?.category === 'printing') {
      const others = PROCESS_OPTIONS.filter((p) => p.category === 'printing' && p.id !== id).map(
        (p) => p.id,
      );
      setProcesses((prev) => {
        const cleaned = prev.filter((p) => !others.includes(p));
        return cleaned.includes(id) ? cleaned.filter((p) => p !== id) : [...cleaned, id];
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
        const nextMaterial = getDefaultMaterialWhenSpoutSelected(MATERIALS, material);
        if (nextMaterial !== material) setMaterial(nextMaterial);
      }
    }
  };

  /** 多选一：选中某选项时清空同组其它项并加入当前项（id 为 none 时只清空） */
  const setProcessOptionGroup = (groupIds: string[], selectedId: string) => {
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
      const nextMaterial = getDefaultMaterialWhenSpoutSelected(MATERIALS, material);
      if (nextMaterial !== material) setMaterial(nextMaterial);
    }
  };

  const moqRequired = processes.includes('digital')
    ? 100
    : processes.includes('flexo')
      ? 1000
      : 3000;

  return (
    <div className="space-y-6">
      {/* 步骤条 */}
      <div className="flex items-center justify-between gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i < step;
          const current = i === step;
          return (
            <div key={s.id} className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-full transition-all',
                  done && 'bg-primary text-primary-foreground',
                  current && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                  !done && !current && 'bg-muted text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              </div>
              <span
                className={cn(
                  'mt-1 text-xs font-medium',
                  current ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="min-h-[320px]"
        >
          {/* Step 0: 袋型 */}
          {step === 0 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg text-primary">选择袋型</CardTitle>
                <p className="text-muted-foreground text-sm">选择最符合产品的包装类型</p>
              </CardHeader>
              <div className="grid grid-cols-2 gap-3">
                {BAG_TYPES_QUOTE_UI.map((t) => {
                  const imageInfo = BAG_TYPE_IMAGES[t.id];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setBagType(t.id);
                        onBagTypeChange?.(t.id);
                        if (!BAG_TYPES_ALLOWING_TIN_TIE.includes(t.id)) {
                          setProcesses((prev) => prev.filter((p) => p !== 'tin-tie'));
                        }
                      }}
                      className={cn(
                        'flex flex-col items-center rounded-xl border-2 p-4 text-left transition-all',
                        bagType === t.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground/30',
                      )}
                    >
                      {imageInfo ? (
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={imageInfo.src}
                            alt={imageInfo.alt}
                            fill
                            className="object-contain"
                            sizes="80px"
                          />
                        </div>
                      ) : (
                        <span className="text-2xl">{t.emoji}</span>
                      )}
                      <span className="mt-2 font-medium">{t.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 1: 尺寸 */}
          {step === 1 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg text-primary">选择尺寸</CardTitle>
                <p className="text-muted-foreground text-sm">
                  预设或自定义尺寸 (宽 × 高 × 折边 mm)
                </p>
              </CardHeader>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {BAG_SIZES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setBagSize(s.id)}
                    className={cn(
                      'rounded-xl border-2 p-3 text-left',
                      bagSize === s.id ? 'border-primary bg-primary/5' : 'border-border',
                    )}
                  >
                    <p className="font-medium">{s.volumeLabel}</p>
                    <p className="text-muted-foreground text-xs">
                      {unit === 'imperial' ? s.labelEn : s.label}
                    </p>
                    {s.id !== 'custom' && (
                      <p className="text-muted-foreground mt-1 text-xs">
                        {formatDimensions(s.width, s.height, s.gusset, unit)}
                      </p>
                    )}
                  </button>
                ))}
              </div>
              {bagSize === 'custom' && (
                <div className="mt-4 grid grid-cols-3 gap-4 rounded-lg border p-4">
                  <div>
                    <Label className="text-xs">宽 ({dimUnitLabel(unit)})</Label>
                    <Input
                      type="number"
                      value={unit === 'imperial' ? mmToInchDecimal(customW) : customW}
                      onChange={(e) =>
                        setCustomW(
                          unit === 'imperial'
                            ? Math.round(Number(e.target.value) * 25.4)
                            : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">高 ({dimUnitLabel(unit)})</Label>
                    <Input
                      type="number"
                      value={unit === 'imperial' ? mmToInchDecimal(customH) : customH}
                      onChange={(e) =>
                        setCustomH(
                          unit === 'imperial'
                            ? Math.round(Number(e.target.value) * 25.4)
                            : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-xs">折边 ({dimUnitLabel(unit)})</Label>
                    <Input
                      type="number"
                      value={unit === 'imperial' ? mmToInchDecimal(customG) : customG}
                      onChange={(e) =>
                        setCustomG(
                          unit === 'imperial'
                            ? Math.round(Number(e.target.value) * 25.4)
                            : Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: 材质 - 卡片网格，带图标/描述/标签/可折叠结构代码 */}
          {step === 2 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg text-primary">选择材质</CardTitle>
                <p className="text-muted-foreground text-sm">根据产品需求选择材质结构</p>
              </CardHeader>
              <div className="grid grid-cols-2 gap-4">
                {filterMaterialsByProcesses(MATERIALS, processes).map((m) => {
                  const config = MATERIAL_CARD_CONFIG[m.id] ?? {
                    titleZh: m.name,
                    descriptionZh: m.description,
                    icon: Layers,
                  };
                  const IconComponent = config.icon;
                  const barrierTag = getBarrierTag(m.barrier);
                  const isSelected = material === m.id;
                  const isExpanded = expandedMaterialId === m.id;
                  return (
                    <div
                      key={m.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => setMaterial(m.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setMaterial(m.id);
                        }
                      }}
                      className={cn(
                        'relative rounded-xl border-2 p-4 text-left transition-colors',
                        isSelected
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/30 dark:border-green-600'
                          : 'border-border bg-card hover:border-muted-foreground/40',
                      )}
                    >
                      {isSelected && (
                        <div className="absolute right-3 top-3 text-green-600 dark:text-green-400">
                          <Check className="size-5" />
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <div
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg border"
                          style={{ backgroundColor: `${m.color}20`, borderColor: m.color }}
                        >
                          <IconComponent className="size-4" style={{ color: m.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground">{config.titleZh}</p>
                          <p className="text-muted-foreground mt-1 text-xs leading-snug">
                            {config.descriptionZh}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-[10px] font-medium',
                            barrierTag.className,
                          )}
                        >
                          {barrierTag.label}
                        </span>
                        {m.isEco && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
                            环保
                          </span>
                        )}
                        {m.isMatte && (
                          <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-medium text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
                            哑光
                          </span>
                        )}
                        {!m.isMatte && !m.isTransparent && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                            亮光
                          </span>
                        )}
                      </div>
                      <Collapsible
                        open={isExpanded}
                        onOpenChange={(open: boolean) => setExpandedMaterialId(open ? m.id : null)}
                      >
                        <CollapsibleTrigger
                          className="text-muted-foreground hover:text-foreground mt-3 flex w-full items-center gap-1 text-left text-xs"
                          onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-3.5 shrink-0" />
                          ) : (
                            <ChevronRight className="size-3.5 shrink-0" />
                          )}
                          供应商结构代码 (可选)
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <p
                            className="text-muted-foreground mt-2 rounded border border-border bg-muted/30 px-2 py-1.5 text-xs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {m.name} ({m.layers})
                          </p>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: 工艺与可选功能（与摘要页一致：外观/功能多选一 + 是/否，印刷仅数码 + 色数） */}
          {step === 3 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg text-primary">工艺与功能</CardTitle>
                <p className="text-muted-foreground text-sm">
                  外观与功能按项选择，印刷方式为数码印刷
                </p>
              </CardHeader>
              <div className="space-y-4">
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
                        <p className="text-sm font-medium text-foreground">{feat.label}</p>
                        <div className="flex shrink-0 rounded border border-border p-0.5">
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => !disabled && toggleProcess(feat.processId)}
                            className={cn(
                              'rounded-sm px-2.5 py-1.5 text-sm transition-colors',
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
                            onClick={() => !disabled && selected && toggleProcess(feat.processId)}
                            className={cn(
                              'rounded-sm px-2.5 py-1.5 text-sm transition-colors',
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
                      <p className="text-muted-foreground mb-2 text-xs font-medium">{feat.label}</p>
                      <div className="flex flex-wrap gap-2">
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
                                'rounded-lg border-2 px-3 py-2 text-sm transition-colors',
                                disabled && 'cursor-not-allowed opacity-50',
                                isSelected ? 'border-primary bg-primary/5' : 'border-border',
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
                <div className="pt-2 border-t border-border/80 space-y-2">
                  <p className="text-muted-foreground text-xs font-medium">印刷方式</p>
                  <div className="flex flex-wrap gap-2">
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
                            'rounded-lg border-2 px-3 py-2 text-sm',
                            active ? 'border-primary bg-primary/5' : 'border-border',
                          )}
                        >
                          {p.name}
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <Label className="flex items-center gap-2 text-sm">
                      <Palette className="size-4" />
                      印刷色数
                    </Label>
                    <div className="mt-2 flex gap-2">
                      {[2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setPrintColors(n)}
                          className={cn(
                            'flex size-9 items-center justify-center rounded-lg border-2 text-sm font-medium',
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
            </div>
          )}

          {/* Step 4: 数量 */}
          {step === 4 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg text-primary">订购数量</CardTitle>
                <p className="text-muted-foreground text-sm">数量越大单价越低</p>
              </CardHeader>
              <div className="max-w-sm">
                <Label>数量（个）</Label>
                <Input
                  type="number"
                  min={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(10, Number(e.target.value)))}
                  className="mt-2 text-lg font-semibold"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {[100, 500, 1000, 3000, 5000, 10000, 50000].map((q) => (
                    <Button
                      key={q}
                      type="button"
                      variant={quantity === q ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setQuantity(q)}
                    >
                      {q.toLocaleString()}
                    </Button>
                  ))}
                </div>
                {quantity < moqRequired && (
                  <div className="bg-destructive/10 text-destructive mt-4 flex gap-2 rounded-lg border border-destructive/20 p-3 text-sm">
                    <AlertCircle className="size-4 shrink-0" />
                    <p>
                      当前印刷方式起订量为 {moqRequired.toLocaleString()}{' '}
                      个，可增加数量或改用数码印刷（起订 100）。
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: 报价结果 */}
          {step === 5 && result && (
            <div>
              <QuoteResult quote={result} showActions />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* 导航 */}
      {step < 5 && (
        <div className="flex items-center justify-between border-t pt-6">
          <Button type="button" variant="ghost" onClick={handleBack} disabled={step === 0}>
            <ArrowLeft className="mr-2 size-4" />
            上一步
          </Button>
          <Button type="button" onClick={handleNext} disabled={!canNext()}>
            {step === 4 ? '获取报价' : '下一步'}
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
