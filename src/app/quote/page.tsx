'use client';

import dynamic from 'next/dynamic';
import { UnitProvider } from '@/lib/units';
import { QuoteStepWizard } from '@/components/quote/QuoteStepWizard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PackScene = dynamic(() => import('@/components/PackScene'), {
  ssr: false,
  loading: () => (
    <div className="bg-muted flex h-full min-h-[280px] items-center justify-center rounded-lg">
      <span className="text-muted-foreground">加载 3D…</span>
    </div>
  ),
});

function QuoteContent() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-6xl grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* 左侧：3D 预览（与 price-calculator 参考：左侧为当前选择预览） */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">当前选择预览</CardTitle>
              <p className="text-muted-foreground text-sm">
                根据所选袋型、尺寸、材质联动显示（开发中可固定展示示例 3D）
              </p>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 aspect-square min-h-[280px] overflow-hidden rounded-lg border">
                <PackScene />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：分步配置与报价结果（参考 price-calculator StepWizard + QuoteResult） */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">即时报价</CardTitle>
              <p className="text-muted-foreground text-sm">
                按步骤选择袋型、尺寸、材质、工艺与数量，获取阶梯价与交期
              </p>
            </CardHeader>
            <CardContent>
              <QuoteStepWizard />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <UnitProvider>
      <QuoteContent />
    </UnitProvider>
  );
}
