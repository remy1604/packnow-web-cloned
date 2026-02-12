'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Calendar,
  CheckCircle2,
  Printer,
  Clock,
  Layers,
  Settings,
} from 'lucide-react';
import {
  formatCNY,
  formatCNYUnit,
  getDeliveryDateRange,
  type QuoteResult as QuoteResultType,
} from '@/lib/pricing';
import { useUnit, formatDimensions } from '@/lib/units';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface QuoteResultProps {
  quote: QuoteResultType;
  showActions?: boolean;
}

function getBarrierLabel(barrier: string): string {
  switch (barrier) {
    case 'ultra':
      return '超高 ★★★★';
    case 'high':
      return '高 ★★★';
    case 'medium':
      return '中 ★★';
    case 'low':
      return '基础 ★';
    default:
      return barrier;
  }
}

function DetailRow({
  icon,
  label,
  value,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="bg-muted/50 flex items-start gap-3 rounded-lg px-4 py-3">
      <span className="text-muted-foreground mt-0.5">{icon}</span>
      <div>
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className={cn('text-sm font-medium', valueClassName ?? 'text-foreground')}>{value}</p>
      </div>
    </div>
  );
}

function BreakdownBar({
  label,
  value,
  total,
  colorClass,
}: {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-lg border bg-card px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">{label}</span>
        <span className="text-sm font-medium">
          {formatCNYUnit(value)}{' '}
          <span className="text-muted-foreground text-xs">({percentage}%)</span>
        </span>
      </div>
      <div className="bg-muted h-2 overflow-hidden rounded-full">
        <div
          className={cn('h-full rounded-full transition-all duration-500', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function QuoteResult({ quote, showActions = true }: QuoteResultProps) {
  const { unit } = useUnit();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [priceBreaksOpen, setPriceBreaksOpen] = useState(false);

  const deliveryDates = getDeliveryDateRange(quote.deliveryDays);
  const nextBreak = quote.priceBreaks.find((b) => b.quantity > quote.quantity);

  return (
    <div className="space-y-5">
      {/* 价格主卡 */}
      <Card className="border-primary/20 bg-gradient-to-br from-muted to-muted/50">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">
                您的报价
              </p>
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                {formatCNY(quote.totalPrice)}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {quote.quantity.toLocaleString()} 个 · 单价 {formatCNYUnit(quote.unitPrice)}
              </p>
            </div>
            {nextBreak && (
              <Card className="border-muted w-full sm:w-auto">
                <CardContent className="p-4">
                  <p className="text-muted-foreground text-xs font-medium">下一档位</p>
                  <p className="font-semibold">{nextBreak.quantity.toLocaleString()} 个</p>
                  <p className="text-muted-foreground text-sm">
                    {formatCNYUnit(nextBreak.unitPrice)} / 个
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          {!quote.moqMet && (
            <div className="bg-destructive/10 text-destructive mt-4 flex items-center gap-2 rounded-lg border border-destructive/20 px-4 py-3">
              <AlertTriangle className="size-4 shrink-0" />
              <p className="text-sm">
                未达起订量（需 {quote.moqRequired.toLocaleString()} 个）。可考虑数码印刷或增加数量。
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 交期 */}
      <Card className="border-primary/10 bg-primary/5">
        <CardContent className="flex items-center gap-3 py-4">
          <Truck className="text-primary size-5" />
          <div>
            <p className="font-medium">
              预计交期：{deliveryDates.start} – {deliveryDates.end}
            </p>
            <p className="text-muted-foreground text-xs">
              订单确认后 {quote.deliveryDays.min}–{quote.deliveryDays.max} 个工作日
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 公差范围 */}
      <div>
        <p className="text-muted-foreground mb-3 text-sm font-medium">数量公差 ±5%</p>
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="py-4 text-center">
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                低
              </span>
              <p className="mt-2 text-xl font-bold">{formatCNY(quote.toleranceLow.price)}</p>
              <p className="text-muted-foreground text-xs">
                {quote.toleranceLow.quantity.toLocaleString()} 个
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary bg-primary/5">
            <CardContent className="py-4 text-center">
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                目标
              </span>
              <p className="mt-2 text-xl font-bold">{formatCNY(quote.toleranceTarget.price)}</p>
              <p className="text-muted-foreground text-xs">
                {quote.toleranceTarget.quantity.toLocaleString()} 个
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="py-4 text-center">
              <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-[10px] font-medium">
                高
              </span>
              <p className="mt-2 text-xl font-bold">{formatCNY(quote.toleranceHigh.price)}</p>
              <p className="text-muted-foreground text-xs">
                {quote.toleranceHigh.quantity.toLocaleString()} 个
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 阶梯价表 */}
      <Collapsible open={priceBreaksOpen} onOpenChange={setPriceBreaksOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="size-4" />
              查看全部阶梯价
            </span>
            {priceBreaksOpen ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-border mt-2 overflow-hidden rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b">
                  <th className="px-4 py-3 text-left font-medium">数量</th>
                  <th className="px-4 py-3 text-right font-medium">单价</th>
                  <th className="px-4 py-3 text-right font-medium">总价</th>
                </tr>
              </thead>
              <tbody>
                {quote.priceBreaks.map((pb, i) => {
                  const isCurrent =
                    quote.quantity >= pb.quantity &&
                    (i === quote.priceBreaks.length - 1 ||
                      quote.quantity < quote.priceBreaks[i + 1]!.quantity);
                  return (
                    <tr
                      key={pb.quantity}
                      className={cn('border-b last:border-0', isCurrent && 'bg-primary/5')}
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium">{pb.quantity.toLocaleString()}</span>
                        {isCurrent && (
                          <span className="bg-primary text-primary-foreground ml-2 rounded px-1.5 py-0.5 text-[10px] font-medium">
                            当前
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">{formatCNYUnit(pb.unitPrice)}</td>
                      <td className="px-4 py-3 text-right">{formatCNY(pb.totalPrice)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* 产品详情 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Package className="size-4" />
            产品详情
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow
              icon={<Package className="size-4" />}
              label="袋型"
              value={quote.bagType.nameEn}
            />
            <DetailRow
              icon={<Layers className="size-4" />}
              label="尺寸"
              value={formatDimensions(
                quote.bagSize.width,
                quote.bagSize.height,
                quote.bagSize.gusset,
                unit,
              )}
            />
            <DetailRow
              icon={<Settings className="size-4" />}
              label="材质"
              value={`${quote.material.name} · ${quote.material.layers}`}
            />
            <DetailRow
              icon={<Settings className="size-4" />}
              label="阻隔"
              value={getBarrierLabel(quote.material.barrier)}
            />
            <DetailRow
              icon={<Settings className="size-4" />}
              label="工艺"
              value={quote.processes.map((p) => p.nameEn).join(', ') || 'Standard'}
            />
            <DetailRow
              icon={<DollarSign className="size-4" />}
              label="数量"
              value={`${quote.quantity.toLocaleString()} 个`}
            />
            <DetailRow
              icon={<Calendar className="size-4" />}
              label="交期"
              value={`${quote.deliveryDays.min}–${quote.deliveryDays.max} 个工作日`}
            />
            <DetailRow
              icon={<CheckCircle2 className="size-4" />}
              label="起订量"
              value={quote.moqMet ? '已满足' : `需 ${quote.moqRequired.toLocaleString()} 个`}
              valueClassName={
                quote.moqMet
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 成本构成 */}
      <Collapsible open={breakdownOpen} onOpenChange={setBreakdownOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <DollarSign className="size-4" />
              成本构成
            </span>
            {breakdownOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-2 space-y-2">
            <BreakdownBar
              label="材料"
              value={quote.breakdown.materialCost}
              total={quote.unitPrice}
              colorClass="bg-blue-500"
            />
            <BreakdownBar
              label="加工"
              value={quote.breakdown.processCost}
              total={quote.unitPrice}
              colorClass="bg-purple-500"
            />
            <BreakdownBar
              label="印刷"
              value={quote.breakdown.printingCost}
              total={quote.unitPrice}
              colorClass="bg-amber-500"
            />
            <BreakdownBar
              label="制版分摊"
              value={quote.breakdown.setupCostPerUnit}
              total={quote.unitPrice}
              colorClass="bg-cyan-500"
            />
            <BreakdownBar
              label="毛利"
              value={quote.breakdown.margin}
              total={quote.unitPrice}
              colorClass="bg-green-500"
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {showActions && (
        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link href="/checkout">
              <Printer className="mr-2 size-4" />
              去结算
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/quote">
              <Clock className="mr-2 size-4" />
              保存报价
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
