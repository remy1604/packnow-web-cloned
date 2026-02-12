'use client';

import { useState, useCallback } from 'react';
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
} from 'lucide-react';
import {
  BAG_TYPES,
  BAG_SIZES,
  MATERIALS,
  PROCESS_OPTIONS,
  calculateQuote,
  type QuoteInput,
  type QuoteResult as QuoteResultType,
} from '@/lib/pricing';
import { useUnit, formatDimensions, dimUnitLabel, mmToInchDecimal } from '@/lib/units';
import { QuoteResult } from '@/components/quote/QuoteResult';

import imgStandUp from '../../../assets/images/stand-up-pouche.webp';
import img8Sided from '../../../assets/images/8-sided-seal-bag.png';
import img3Sided from '../../../assets/images/3-sided-seal-bag.png';
import imgFlatBottom from '../../../assets/images/flat-bottom-bag.webp';
import imgBackSeal from '../../../assets/images/back-seal-bag.jpg';
import imgGusset from '../../../assets/images/gusset-bag.webp';

const BAG_TYPE_IMAGES: Record<string, { src: typeof imgStandUp; alt: string }> = {
  'stand-up': { src: imgStandUp, alt: '自立袋' },
  'three-side': { src: img3Sided, alt: '三边封袋' },
  'eight-side': { src: img8Sided, alt: '八边封袋' },
  gusseted: { src: imgGusset, alt: '风琴袋' },
  'flat-bottom': { src: imgFlatBottom, alt: '平底袋' },
  'back-seal': { src: imgBackSeal, alt: '背封袋' },
};
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'type', label: '袋型', icon: Package },
  { id: 'size', label: '尺寸', icon: Ruler },
  { id: 'material', label: '材质', icon: Layers },
  { id: 'process', label: '工艺', icon: Settings },
  { id: 'quantity', label: '数量', icon: Hash },
  { id: 'result', label: '报价', icon: Receipt },
];

const PROCESS_CATEGORIES = [
  { key: 'printing', label: '印刷方式', desc: '选一' },
  { key: 'finish', label: '表面处理', desc: '可多选' },
  { key: 'feature', label: '功能', desc: '可多选' },
  { key: 'accessory', label: '配件', desc: '可多选' },
];

export function QuoteStepWizard() {
  const { unit } = useUnit();
  const [step, setStep] = useState(0);
  const [bagType, setBagType] = useState('');
  const [bagSize, setBagSize] = useState('');
  const [customW, setCustomW] = useState(140);
  const [customH, setCustomH] = useState(200);
  const [customG, setCustomG] = useState(80);
  const [material, setMaterial] = useState('');
  const [processes, setProcesses] = useState<string[]>(['gravure', 'tear-notch']);
  const [quantity, setQuantity] = useState(1000);
  const [printColors, setPrintColors] = useState(4);
  const [result, setResult] = useState<QuoteResultType | null>(null);

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
      const input: QuoteInput = {
        bagType,
        bagSize,
        customWidth: bagSize === 'custom' ? customW : undefined,
        customHeight: bagSize === 'custom' ? customH : undefined,
        customGusset: bagSize === 'custom' ? customG : undefined,
        material,
        processes,
        quantity,
        printColors,
      };
      setResult(calculateQuote(input));
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
      setProcesses((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
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
                <CardTitle className="text-lg">选择袋型</CardTitle>
                <p className="text-muted-foreground text-sm">选择最符合产品的包装类型</p>
              </CardHeader>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {BAG_TYPES.map((t) => {
                  const imageInfo = BAG_TYPE_IMAGES[t.id];
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setBagType(t.id)}
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
                      <span className="text-muted-foreground text-xs">{t.nameEn}</span>
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
                <CardTitle className="text-lg">选择尺寸</CardTitle>
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

          {/* Step 2: 材质 */}
          {step === 2 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg">选择材质</CardTitle>
                <p className="text-muted-foreground text-sm">根据产品需求选择材质结构</p>
              </CardHeader>
              <div className="grid gap-2 sm:grid-cols-2">
                {MATERIALS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMaterial(m.id)}
                    className={cn(
                      'flex items-start gap-3 rounded-xl border-2 p-4 text-left',
                      material === m.id ? 'border-primary bg-primary/5' : 'border-border',
                    )}
                  >
                    <div
                      className="mt-0.5 size-3 shrink-0 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    <div>
                      <p className="font-medium">{m.name}</p>
                      <p className="text-muted-foreground text-xs">{m.layers}</p>
                      {m.isEco && (
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 mt-1 inline-block rounded px-1.5 py-0.5 text-[10px]">
                          ECO
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: 工艺 */}
          {step === 3 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg">工艺与功能</CardTitle>
                <p className="text-muted-foreground text-sm">印刷方式选一，其余可多选</p>
              </CardHeader>
              <div className="space-y-4">
                {PROCESS_CATEGORIES.map((cat) => (
                  <div key={cat.key}>
                    <p className="text-muted-foreground mb-2 text-xs font-medium">
                      {cat.label} · {cat.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PROCESS_OPTIONS.filter((p) => p.category === cat.key).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => toggleProcess(p.id)}
                          className={cn(
                            'rounded-lg border-2 px-3 py-2 text-left text-sm',
                            processes.includes(p.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border',
                          )}
                        >
                          <span className="font-medium">{p.nameEn}</span>
                          <span className="text-muted-foreground ml-1 text-xs">
                            {p.costType === 'per_unit'
                              ? `¥${(p.cost * 7.2).toFixed(2)}/个`
                              : p.costType === 'per_order'
                                ? `¥${(p.cost * 7.2).toFixed(0)}/单`
                                : `¥${(p.cost * 7.2).toFixed(2)}/㎡`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div>
                  <Label className="flex items-center gap-2 text-sm">
                    <Palette className="size-4" />
                    印刷色数
                  </Label>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
          )}

          {/* Step 4: 数量 */}
          {step === 4 && (
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-lg">订购数量</CardTitle>
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
