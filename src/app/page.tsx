import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import imgStandUp from '../../assets/images/stand-up-pouche.webp';
import img8Sided from '../../assets/images/8-sided-seal-bag.png';
import img3Sided from '../../assets/images/3-sided-seal-bag.png';
import imgFlatBottom from '../../assets/images/flat-bottom-bag.webp';
import imgBackSeal from '../../assets/images/back-seal-bag.jpg';
import imgGusset from '../../assets/images/gusset-bag.webp';

const PRODUCTS = [
  {
    id: 'stand-up-pouch',
    name: '自立袋',
    category: '咖啡 / 零食',
    minOrder: 100,
    image: imgStandUp,
    scene: '底部撑开可站立，货架展示效果好，适合咖啡、坚果、宠物粮等',
  },
  {
    id: 'eight-side-seal',
    name: '八边封',
    category: '零食',
    minOrder: 100,
    image: img8Sided,
    scene: '盒型立体，棱角分明，适合高端零食、礼品包装',
  },
  {
    id: 'spout-pouch',
    name: '吸嘴袋',
    category: '饮料 / 酱料',
    minOrder: 100,
    image: imgGusset,
    scene: '带吸嘴或拉链，可重复封口，便于倾倒与携带',
  },
  {
    id: 'three-side-seal',
    name: '三边封',
    category: '通用',
    minOrder: 100,
    image: img3Sided,
    scene: '三边封合、成本友好，通用型袋型，应用场景广',
  },
  {
    id: 'back-seal',
    name: '背封袋',
    category: '饼干',
    minOrder: 100,
    image: imgBackSeal,
    scene: '中缝背封，正面展示面积大，适合饼干、糕点等平面展示',
  },
  {
    id: 'flat-pouch',
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
      {/* 整体内容水平居中并限制宽度 */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="border-b bg-muted/30 py-16 sm:py-20 md:py-28">
          <div className="flex flex-col items-center gap-6 text-center sm:gap-8">
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              定制包装，从设计到报价
              <br />
              <span className="text-primary">一站搞定</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
              100 个起订 · 无制版费 · 3D 实时预览
            </p>
            <Button asChild size="lg" className="text-base">
              <Link href="/studio">Start Your Design</Link>
            </Button>
          </div>
        </section>

        {/* Product Grid - 6 款袋型：响应式 1/2/3 列 */}
        <section className="py-12 sm:py-16">
          <h2 className="mb-6 font-semibold text-xl sm:mb-8 sm:text-2xl">选择袋型</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <Card key={product.id} className="overflow-hidden transition-shadow hover:shadow-md">
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
                    <CardTitle className="text-base sm:text-lg">{product.name}</CardTitle>
                    <Badge variant="secondary">{product.category}</Badge>
                  </div>
                  <CardDescription className="text-sm">{product.scene}</CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-wrap items-center justify-between gap-2 pt-0">
                  <span className="text-muted-foreground text-sm">
                    起订量 {product.minOrder} 个
                  </span>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/studio?product=${product.id}`}>去设计</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        {/* Trust Section：响应式 1/2/3 列 */}
        <section className="border-t bg-muted/20 py-12 sm:py-16">
          <h2 className="mb-8 text-center font-semibold text-xl sm:mb-10 sm:text-2xl">
            为什么选择我们
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">材质认证</CardTitle>
                <CardDescription className="text-sm">
                  符合食品接触与环保标准，可提供相关认证文件
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">生产实拍</CardTitle>
                <CardDescription className="text-sm">
                  工厂直连，品质可控，支持来厂验货与进度查看
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">客户案例</CardTitle>
                <CardDescription className="text-sm">
                  服务众多品牌，从初创到成熟品牌的包装解决方案
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 sm:py-16">
          <div className="bg-primary text-primary-foreground flex flex-col items-center gap-4 rounded-xl py-10 text-center sm:py-12">
            <h3 className="font-semibold text-lg sm:text-xl">准备好开始了吗？</h3>
            <p className="opacity-90 text-sm">上传设计，实时 3D 预览，即时报价</p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/studio">Start Your Design</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
