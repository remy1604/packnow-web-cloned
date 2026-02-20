'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PouchOrderService, type PouchOrder } from '@/services/supabase/pouch_orders';

type Order = PouchOrder;

function CheckoutReturnContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // 从URL获取session_id，如果没有则从localStorage获取
        const sessionId =
          searchParams.get('session_id') || localStorage.getItem('stripe_session_id');

        if (!sessionId) {
          setError('未找到支付会话ID');
          setLoading(false);
          return;
        }

        // 通过stripe_session_id查询订单
        const data = await PouchOrderService.getPouchOrderByStripeSessionId(sessionId);

        if (!data) {
          setError('未找到对应的订单');
          setLoading(false);
          return;
        }

        setOrder(data);
        // 清除localStorage中的session_id
        localStorage.removeItem('stripe_session_id');
      } catch (err) {
        console.error('获取订单信息时出错:', err);
        setError('获取订单信息时出错，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground text-sm">正在加载订单信息...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12">
        <Card className="w-full max-w-md border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="text-destructive size-8" />
            </div>
            <CardTitle className="text-primary">订单查询失败</CardTitle>
            <p className="text-muted-foreground text-sm">{error || '未找到订单信息'}</p>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <Button asChild variant="outline" className="w-full">
              <Link href="/">返回首页</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 根据订单状态显示不同的内容
  const isPaid = order.state === 'Paid';

  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md border-primary/20 bg-gradient-to-br from-amber-50/80 via-card to-orange-50/60 dark:from-amber-950/30 dark:via-card dark:to-orange-950/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10">
            {isPaid ? (
              <CheckCircle2 className="text-primary size-8" />
            ) : (
              <Loader2 className="text-primary size-8 animate-spin" />
            )}
          </div>
          <CardTitle className="text-primary">{isPaid ? '支付成功' : '订单处理中'}</CardTitle>
          <p className="text-muted-foreground text-sm">
            订单ID: <strong>{order.id}</strong>
          </p>
          {order.state && (
            <p className="text-muted-foreground text-sm">
              订单状态: <strong>{order.state === 'Paid' ? '已支付' : '已创建'}</strong>
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {isPaid ? (
            <p className="text-muted-foreground text-sm">
              您的设计文件将由人工进行最终印前检查 (Pre-press check)，完成后将安排生产并发货。
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">您的订单正在处理中，请稍候...</p>
          )}
          <div className="space-y-2 text-left text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">订单金额:</span>
              <span className="font-medium">¥ {order.total_amount.toFixed(2)}</span>
            </div>
            {order.email && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">邮箱:</span>
                <span>{order.email}</span>
              </div>
            )}
            {order.shipping_name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">收货人:</span>
                <span>{order.shipping_name}</span>
              </div>
            )}
          </div>
          <Button asChild className="w-full">
            <Link href="/">返回首页</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ReturnPageFallback() {
  return (
    <div className="container flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="text-muted-foreground size-8 animate-spin" />
          <p className="text-muted-foreground mt-4 text-sm">正在加载订单信息...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<ReturnPageFallback />}>
      <CheckoutReturnContent />
    </Suspense>
  );
}
