import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Camera, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import imgStandUp from '@/assets/images/stand-up-pouche.webp';
import imgFlatBottom from '@/assets/images/flat-bottom-bag.webp';
import imgFlatPouch from '@/assets/images/flat-pouch.png';
import imgGusset from '@/assets/images/gusset-bag.webp';

/** 首页袋型产品：id 为产品标识，bagTypeId 为报价页袋型参数（用于 /quote?bagType=） */
const PRODUCTS = [
  {
    id: 'stand-up-pouch',
    bagTypeId: 'stand-up',
    name: '自立袋',
    category: '咖啡 / 零食',
    minOrder: 100,
    image: imgStandUp,
    scene: '底部撑开可站立，货架展示效果好，适合咖啡、坚果、宠物粮等',
  },
  {
    id: 'gusset-bag',
    bagTypeId: 'gusseted',
    name: '风琴袋',
    category: '零食 / 冲调',
    minOrder: 100,
    image: imgGusset,
    scene: '两侧风琴褶，可站立或平放，展示面大，适合零食、冲调品等',
  },
  {
    id: 'flat-pouch',
    bagTypeId: 'flat-pouch',
    name: '平口袋',
    category: '饼干 / 糕点',
    minOrder: 100,
    image: imgFlatPouch,
    scene: '平面封口，正面展示面积大，适合饼干、糕点等平面展示',
  },
  {
    id: 'flat-bottom-bag',
    bagTypeId: 'flat-bottom',
    name: '平底袋',
    category: '宠物 / 零食',
    minOrder: 100,
    image: imgFlatBottom,
    scene: '平底站立稳，承重与展示面兼顾，适合大规格零食与宠物粮',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero：整屏宽、渐变橙黑、白字 */}
      <section className="w-full border-b bg-gradient-to-br from-orange-800 via-neutral-900 to-black py-16 sm:py-20 md:py-28">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 text-center sm:gap-8 sm:px-6 lg:px-8">
          <h1 className="font-bold text-3xl tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            定制包装，从设计到报价
            <br />
            <span className="text-white">一站搞定</span>
          </h1>
          <p className="max-w-2xl text-base text-white/90 sm:text-lg">
            100 个起订 · 无制版费 · 3D 实时预览
          </p>
          <Button asChild size="lg" className="text-base">
            <Link href="/quote">Start Your Design</Link>
          </Button>
        </div>
      </section>

      {/* 整体内容水平居中并限制宽度 */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Product Grid - 4 款袋型，一行展示 */}
        <section className="py-12 sm:py-16">
          <h2 className="mb-6 font-semibold text-xl text-primary sm:mb-8 sm:text-2xl">选择袋型</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {PRODUCTS.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card transition-shadow hover:shadow-md"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden p-2">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle className="text-base text-primary sm:text-lg">
                      {product.name}
                    </CardTitle>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <CardDescription className="text-sm">{product.scene}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-0">
                  <span className="text-muted-foreground text-sm">
                    起订量 {product.minOrder} 个
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link
                      href={`/quote?bagType=${encodeURIComponent(product.bagTypeId ?? product.id)}`}
                    >
                      报价
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Section：响应式 1/2/3 列 */}
        <section className="border-t bg-muted/20 py-12 sm:py-16">
          <h2 className="mb-8 text-center font-semibold text-xl text-primary sm:mb-10 sm:text-2xl">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            <Card className="border-primary/15 bg-gradient-to-br from-amber-50/80 via-card to-orange-50/50 dark:from-amber-950/20 dark:via-card dark:to-orange-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-primary sm:text-lg">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="size-4" />
                  </span>
                  材质认证
                </CardTitle>
                <CardDescription className="text-sm">
                  符合食品接触与环保标准，可提供相关认证文件
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-primary/15 bg-gradient-to-br from-orange-50/80 via-card to-amber-50/50 dark:from-orange-950/20 dark:via-card dark:to-amber-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-primary sm:text-lg">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Camera className="size-4" />
                  </span>
                  生产实拍
                </CardTitle>
                <CardDescription className="text-sm">
                  工厂直连，品质可控，支持来厂验货与进度查看
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-primary/15 bg-gradient-to-br from-card via-primary/5 to-amber-50/50 dark:to-amber-950/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base text-primary sm:text-lg">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Users className="size-4" />
                  </span>
                  客户案例
                </CardTitle>
                <CardDescription className="text-sm">
                  服务众多品牌，从初创到成熟品牌的包装解决方案
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16">
          <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-br from-orange-600 via-orange-800 to-black py-10 text-center text-white sm:py-12">
            <h3 className="font-semibold text-lg sm:text-xl">准备好开始了吗？</h3>
            <p className="text-sm text-white/90">上传设计，实时 3D 预览，即时报价</p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/quote">Start Your Design</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
