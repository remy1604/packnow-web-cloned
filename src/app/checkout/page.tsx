'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    // TODO: 集成 Stripe Checkout
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-6xl grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* 左侧：收货与支付 */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">收货信息</CardTitle>
              <p className="text-muted-foreground text-sm">
                填写后用于发货与联系（需 ANDY 确认字段）
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名</Label>
                  <Input id="name" placeholder="联系人姓名" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">公司名</Label>
                  <Input id="company" placeholder="公司名称（选填）" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">地址</Label>
                <Input id="address" placeholder="详细地址" />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="country">国家</Label>
                  <Input id="country" placeholder="国家" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">城市</Label>
                  <Input id="city" placeholder="城市" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">邮编</Label>
                  <Input id="zip" placeholder="邮编" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">联系人电话</Label>
                <Input id="phone" type="tel" placeholder="电话" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">支付</CardTitle>
              <p className="text-muted-foreground text-sm">
                使用 Stripe 安全支付（信用卡 / Apple Pay）
              </p>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" disabled={loading} onClick={handlePay}>
                {loading ? '处理中…' : '前往支付'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 右侧：订单摘要 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">订单摘要</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-muted aspect-square w-20 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground text-xs">
                  3D 缩略图
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">自立袋</p>
                  <p className="text-muted-foreground text-sm">尺寸 / 材质 / 工艺</p>
                  <p className="text-muted-foreground text-sm">数量：1,000 个</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">小计</span>
                <span>¥ 108.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">制版费</span>
                <span>¥ 80.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>合计</span>
                <span>¥ 188.00</span>
              </div>
              <p className="text-muted-foreground text-xs">
                最终确认的 3D 渲染图与 2D 贴图将归档用于生产与印前检查
              </p>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/quote">返回修改报价</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
