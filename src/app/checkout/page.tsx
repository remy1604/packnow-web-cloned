'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { api } from '@/services/access/instance';
import type { CreateCheckoutSessionRequest } from '@/services/access/api-client/models/CreateCheckoutSessionRequest';
import { toast } from 'sonner';

// 初始化Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 环境变量未设置');
}
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCheckoutSessionRequest | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCheckoutSessionRequest & { email: string; notes: string; phone: string }>();

  // 计算总金额（这里使用硬编码的值，实际应该从购物车或报价中获取）
  const totalAmount = 188.0;

  // fetchClientSecret 回调函数，用于 EmbeddedCheckout
  const fetchClientSecret = useCallback(async () => {
    if (!formData) {
      const errorMsg = '表单数据未准备好';
      setCheckoutError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      setCheckoutError(null);
      // 调用API创建checkout session
      const response = await api.stripe.createCheckoutSession({
        requestBody: formData,
      });

      // 将session_id存储到localStorage，以便return页面使用
      if (response.session_id) {
        localStorage.setItem('stripe_session_id', response.session_id);
      }

      if (!response.client_secret) {
        const errorMsg = '未获取到 client_secret';
        setCheckoutError(errorMsg);
        throw new Error(errorMsg);
      }

      return response.client_secret;
    } catch (error) {
      console.error('创建checkout session失败:', error);
      const errorMsg = error instanceof Error ? error.message : '创建支付会话失败，请重试';
      setCheckoutError(errorMsg);
      toast.error(errorMsg);
      throw error;
    }
  }, [formData]);

  const onSubmit = async (
    data: CreateCheckoutSessionRequest & { email: string; notes: string; phone: string },
  ) => {
    setLoading(true);

    try {
      // 解析电话号码（支持多种格式: +86 13800138000, 86 13800138000, 13800138000等）
      let shipping_phone_code = '';
      let shipping_phone_number = data.phone.trim();

      // 尝试匹配带国家代码的格式
      const phoneMatch = shipping_phone_number.match(/^\+?(\d{1,4})\s*(.+)$/);
      if (phoneMatch && phoneMatch[1] && phoneMatch[2]) {
        shipping_phone_code = phoneMatch[1];
        shipping_phone_number = phoneMatch[2].trim();
      }

      // 准备请求数据
      const requestData: CreateCheckoutSessionRequest = {
        email: data.email,
        notes: data.notes || '',
        shipping_address_line_1: data.shipping_address_line_1,
        shipping_address_line_2: data.shipping_address_line_2 || '',
        shipping_city: data.shipping_city,
        shipping_country: data.shipping_country,
        shipping_name: data.shipping_name,
        shipping_phone_code,
        shipping_phone_number,
        shipping_postal_code: data.shipping_postal_code,
        shipping_state: data.shipping_state || '',
        total_amount: totalAmount,
      };

      // 保存表单数据，用于 fetchClientSecret
      setFormData(requestData);
      setShowCheckout(true);
    } catch (error) {
      console.error('处理表单数据失败:', error);
      toast.error('处理表单数据失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 如果已经显示checkout，使用 EmbeddedCheckout
  if (showCheckout) {
    // 检查 Stripe 是否已初始化
    if (!stripePromise) {
      return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
          <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">支付配置错误</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive text-sm">
                  Stripe 发布密钥未配置，请检查 NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 环境变量
                </p>
                <Button onClick={() => setShowCheckout(false)} className="mt-4" variant="outline">
                  返回修改信息
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
        <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">支付</CardTitle>
              <p className="text-muted-foreground text-sm">
                使用 Stripe 安全支付（信用卡 / Apple Pay）
              </p>
            </CardHeader>
            <CardContent>
              {checkoutError ? (
                <div className="space-y-4">
                  <p className="text-destructive text-sm">{checkoutError}</p>
                  <Button
                    onClick={() => {
                      setShowCheckout(false);
                      setCheckoutError(null);
                    }}
                    variant="outline"
                  >
                    返回修改信息
                  </Button>
                </div>
              ) : (
                <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-6xl grid gap-8 px-4 py-8 sm:px-6 lg:grid-cols-5 lg:px-8">
        {/* 左侧：收货与支付 */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">收货信息</CardTitle>
                <p className="text-muted-foreground text-sm">
                  填写后用于发货与联系（需 ANDY 确认字段）
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    {...register('email', { required: '请输入邮箱地址' })}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_name">姓名</Label>
                    <Input
                      id="shipping_name"
                      placeholder="联系人姓名"
                      {...register('shipping_name', { required: '请输入姓名' })}
                    />
                    {errors.shipping_name && (
                      <p className="text-sm text-destructive">{errors.shipping_name.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_address_line_2">地址补充（选填）</Label>
                    <Input
                      id="shipping_address_line_2"
                      placeholder="地址补充信息"
                      {...register('shipping_address_line_2')}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_address_line_1">地址</Label>
                  <Input
                    id="shipping_address_line_1"
                    placeholder="详细地址"
                    {...register('shipping_address_line_1', { required: '请输入地址' })}
                  />
                  {errors.shipping_address_line_1 && (
                    <p className="text-sm text-destructive">
                      {errors.shipping_address_line_1.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="shipping_country">国家</Label>
                    <Input
                      id="shipping_country"
                      placeholder="国家"
                      {...register('shipping_country', { required: '请输入国家' })}
                    />
                    {errors.shipping_country && (
                      <p className="text-sm text-destructive">{errors.shipping_country.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_city">城市</Label>
                    <Input
                      id="shipping_city"
                      placeholder="城市"
                      {...register('shipping_city', { required: '请输入城市' })}
                    />
                    {errors.shipping_city && (
                      <p className="text-sm text-destructive">{errors.shipping_city.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shipping_postal_code">邮编</Label>
                    <Input
                      id="shipping_postal_code"
                      placeholder="邮编"
                      {...register('shipping_postal_code', { required: '请输入邮编' })}
                    />
                    {errors.shipping_postal_code && (
                      <p className="text-sm text-destructive">
                        {errors.shipping_postal_code.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipping_state">州/省（选填）</Label>
                  <Input id="shipping_state" placeholder="州/省" {...register('shipping_state')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">联系人电话</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+86 13800138000"
                    {...register('phone', { required: '请输入电话号码' })}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    格式: +国家代码 电话号码，例如: +86 13800138000
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">备注（选填）</Label>
                  <Textarea id="notes" placeholder="订单备注信息" {...register('notes')} />
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
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? '处理中…' : '前往支付'}
                </Button>
              </CardContent>
            </Card>
          </form>
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
