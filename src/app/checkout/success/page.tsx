import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckoutSuccessPage() {
  // TODO: 从 URL 或 session 获取订单号
  const orderId = 'PN-CONFIRM';

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="text-primary size-8" />
          </div>
          <CardTitle>支付成功</CardTitle>
          <p className="text-muted-foreground text-sm">
            订单确认号：<strong>{orderId}</strong>
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground text-sm">
            您的设计文件将由人工进行最终印前检查 (Pre-press check)，完成后将安排生产并发货。
          </p>
          <Button asChild className="w-full">
            <Link href="/">返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
