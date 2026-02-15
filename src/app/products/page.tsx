'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  getProductFilterOptions,
  searchProducts,
  type FilterCategoryWithValues,
  type PouchProduct,
} from '@/services/supabase/products';
import {
  FALLBACK_FILTER_CATEGORIES,
  FALLBACK_VALUE_TO_CATEGORY,
  FALLBACK_PRODUCT_ATTRIBUTE_IDS,
  type FallbackFilterValue,
} from '@/constants/products';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

/** 列表项展示用（产品表参考：后端建表 - 产品表.pdf；当前 API 为简化字段） */
type DisplayProduct = {
  id: string;
  name: string;
  name_en?: string | null;
  description?: string | null;
  image_url?: string | null;
  min_order?: number;
};

import imgStandUp from '../../../assets/images/stand-up-pouche.webp';
import img8Sided from '../../../assets/images/8-sided-seal-bag.png';
import img3Sided from '../../../assets/images/3-sided-seal-bag.png';
import imgFlatBottom from '../../../assets/images/flat-bottom-bag.webp';
import imgBackSeal from '../../../assets/images/back-seal-bag.jpg';
import imgGusset from '../../../assets/images/gusset-bag.webp';

const FALLBACK_PRODUCTS: Array<{
  id: string;
  name: string;
  name_en: string;
  description: string;
  image: typeof imgStandUp;
  min_order: number;
  category: string;
}> = [
  {
    id: 'stand-up-pouch',
    name: '自立袋',
    name_en: 'Stand Up Pouch',
    description: '底部撑开可站立，货架展示效果好',
    image: imgStandUp,
    min_order: 100,
    category: '咖啡/零食',
  },
  {
    id: 'eight-side-seal',
    name: '八边封',
    name_en: '8-Side Seal',
    description: '盒型立体，适合高端零食',
    image: img8Sided,
    min_order: 100,
    category: '零食',
  },
  {
    id: 'spout-pouch',
    name: '吸嘴袋',
    name_en: 'Spout Pouch',
    description: '可重复封口，便于倾倒',
    image: imgGusset,
    min_order: 100,
    category: '饮料/酱料',
  },
  {
    id: 'three-side-seal',
    name: '三边封',
    name_en: '3-Side Seal',
    description: '经济实用，应用广泛',
    image: img3Sided,
    min_order: 100,
    category: '通用',
  },
  {
    id: 'back-seal',
    name: '背封袋',
    name_en: 'Back Seal Bag',
    description: '正面展示面积大，适合饼干糕点',
    image: imgBackSeal,
    min_order: 100,
    category: '饼干',
  },
  {
    id: 'flat-pouch',
    name: '平底袋',
    name_en: 'Flat Bottom Bag',
    description: '站立稳，适合大规格零食与宠物粮',
    image: imgFlatBottom,
    min_order: 100,
    category: '宠物/零食',
  },
];

const IMAGE_MAP: Record<string, typeof imgStandUp> = {
  'stand-up-pouch': imgStandUp,
  'eight-side-seal': img8Sided,
  'spout-pouch': imgGusset,
  'three-side-seal': img3Sided,
  'back-seal': imgBackSeal,
  'flat-pouch': imgFlatBottom,
};

export default function ProductsPage() {
  const [searchQ, setSearchQ] = useState('');
  const [selectedValueIds, setSelectedValueIds] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterCategoryWithValues[]>([]);
  const [products, setProducts] = useState<PouchProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  // 筛选维度展开状态，默认全部展开
  const [openFilterIds, setOpenFilterIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    getProductFilterOptions().then((opts) => {
      setFilterOptions(opts);
      if (opts.length === 0) {
        setUseFallback(true);
        setLoading(false);
      }
    });
  }, []);

  const hasBackendFilters = filterOptions.length > 0;

  // 仅在有后端筛选维度时请求接口；无后端时用 FALLBACK 数据 + 前端筛选，不请求
  useEffect(() => {
    if (!hasBackendFilters) return;

    let cancelled = false;
    queueMicrotask(() => setLoading(true));
    searchProducts({
      q: searchQ.trim() || undefined,
      attributeValueIds: selectedValueIds.length ? selectedValueIds : undefined,
    }).then(({ data, error }) => {
      if (cancelled) return;
      setLoading(false);
      if (error || !data?.length) {
        setUseFallback(false);
        setProducts(data ?? []);
        return;
      }
      setUseFallback(false);
      setProducts(data);
    });
    return () => {
      cancelled = true;
    };
  }, [hasBackendFilters, searchQ, selectedValueIds]);

  const toggleFilterValue = (valueId: string) => {
    setSelectedValueIds((prev) =>
      prev.includes(valueId) ? prev.filter((id) => id !== valueId) : [...prev, valueId],
    );
  };

  const clearFilters = () => {
    setSelectedValueIds([]);
    setSearchQ('');
  };

  // 无后端时：按选中筛选项 + 关键词在前端过滤演示数据
  const displayList: DisplayProduct[] = useMemo(() => {
    if (!useFallback) return products;

    const q = searchQ.trim().toLowerCase();
    const selectedByCategory: Record<string, string[]> = {};
    selectedValueIds.forEach((valueId) => {
      const catId = FALLBACK_VALUE_TO_CATEGORY[valueId];
      if (catId) {
        if (!selectedByCategory[catId]) selectedByCategory[catId] = [];
        selectedByCategory[catId].push(valueId);
      }
    });

    const filtered = FALLBACK_PRODUCTS.filter((p) => {
      if (q) {
        const match =
          p.name.toLowerCase().includes(q) ||
          p.name_en.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.category && p.category.toLowerCase().includes(q));
        if (!match) return false;
      }
      const productValueIds = FALLBACK_PRODUCT_ATTRIBUTE_IDS[p.id] ?? [];
      for (const catId of Object.keys(selectedByCategory)) {
        const allowed = selectedByCategory[catId];
        const productInCat = productValueIds.filter(
          (vid) => FALLBACK_VALUE_TO_CATEGORY[vid] === catId,
        );
        if (productInCat.length === 0) return false;
        const hasMatch = allowed.some((aid) => productInCat.includes(aid));
        if (!hasMatch) return false;
      }
      return true;
    });

    return filtered.map((p) => ({
      id: p.id,
      name: p.name,
      name_en: p.name_en,
      description: p.description,
      image_url: p.image.src,
      min_order: p.min_order,
    }));
  }, [useFallback, products, searchQ, selectedValueIds]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-semibold text-2xl sm:text-3xl">产品目录</h1>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* 左侧：筛选器 */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="sticky top-20 space-y-4 rounded-xl border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-medium">
                  <SlidersHorizontal className="size-4" />
                  筛选
                </span>
                {selectedValueIds.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    重置
                  </Button>
                )}
              </div>

              {filterOptions.map((cat) => {
                const isOpen = openFilterIds[cat.id] ?? true;
                return (
                  <div key={cat.id} className="border-border border-b last:border-b-0">
                    <Collapsible
                      open={isOpen}
                      onOpenChange={(open: boolean) =>
                        setOpenFilterIds((prev) => ({ ...prev, [cat.id]: open }))
                      }
                    >
                      <CollapsibleTrigger className="text-muted-foreground flex w-full items-center justify-between py-2 text-left text-xs font-medium uppercase tracking-wider hover:text-foreground">
                        <span>{cat.name}</span>
                        {isOpen ? (
                          <ChevronUp className="size-4 shrink-0" />
                        ) : (
                          <ChevronDown className="size-4 shrink-0" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="flex flex-col gap-2 pb-2 pt-1">
                          {cat.values.map((v) => (
                            <label
                              key={v.id}
                              className="flex cursor-pointer items-center gap-2 text-sm"
                            >
                              <Checkbox
                                checked={selectedValueIds.includes(v.id)}
                                onCheckedChange={() => toggleFilterValue(v.id)}
                              />
                              <span>{v.name}</span>
                            </label>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                );
              })}

              {filterOptions.length === 0 &&
                FALLBACK_FILTER_CATEGORIES.map((cat) => {
                  const isOpen = openFilterIds[cat.id] ?? true;
                  return (
                    <div key={cat.id} className="border-border border-b last:border-b-0">
                      <Collapsible
                        open={isOpen}
                        onOpenChange={(open: boolean) =>
                          setOpenFilterIds((prev) => ({ ...prev, [cat.id]: open }))
                        }
                      >
                        <CollapsibleTrigger className="text-muted-foreground flex w-full items-center justify-between py-2 text-left text-xs font-medium uppercase tracking-wider hover:text-foreground">
                          <span>{cat.name}</span>
                          {isOpen ? (
                            <ChevronUp className="size-4 shrink-0" />
                          ) : (
                            <ChevronDown className="size-4 shrink-0" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="flex flex-col gap-2 pb-2 pt-1">
                            {cat.values.map((v: FallbackFilterValue) => (
                              <label
                                key={v.id}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                              >
                                <Checkbox
                                  checked={selectedValueIds.includes(v.id)}
                                  onCheckedChange={() => toggleFilterValue(v.id)}
                                />
                                <span>{v.name_zh ?? v.name}</span>
                              </label>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  );
                })}
            </div>
          </aside>

          {/* 右侧：搜索 + 列表 */}
          <main className="min-w-0 flex-1">
            <div className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute left-3 top-1/2 size-4 -translate-y-1/2" />
                <Input
                  placeholder="按名称或描述搜索…"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center">
                <Loader2 className="text-muted-foreground size-8 animate-spin" />
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-4 text-sm">
                  {displayList.length} 个产品
                  {useFallback && '（当前为演示数据，接入 Supabase 产品表后将显示库内数据）'}
                </p>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {displayList.map((item: DisplayProduct) => {
                    const fallbackImg =
                      useFallback && item.id in IMAGE_MAP
                        ? IMAGE_MAP[item.id as keyof typeof IMAGE_MAP]
                        : null;
                    const hasImg = !!fallbackImg || !!item.image_url;
                    const href = `/studio?product=${item.id}`;
                    return (
                      <Card
                        key={item.id}
                        className={cn(
                          'overflow-hidden transition-shadow hover:shadow-md',
                          !hasImg && 'bg-muted/30',
                        )}
                      >
                        <Link href={href}>
                          <div className="relative aspect-[4/3] overflow-hidden p-2">
                            {fallbackImg ? (
                              <Image
                                src={fallbackImg}
                                alt={item.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                            ) : (
                              <span className="text-muted-foreground flex h-full items-center justify-center text-sm">
                                暂无图片
                              </span>
                            )}
                          </div>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">{item.name}</CardTitle>
                            {item.name_en && (
                              <p className="text-muted-foreground text-xs">{item.name_en}</p>
                            )}
                            <p className="text-muted-foreground line-clamp-2 text-sm">
                              {item.description ?? '—'}
                            </p>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <span className="text-muted-foreground text-sm">
                              起订量 {item.min_order ?? 100} 个
                            </span>
                            <Button size="sm" variant="outline" className="ml-auto" asChild>
                              <span>去设计</span>
                            </Button>
                          </CardFooter>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
                {displayList.length === 0 && (
                  <div className="text-muted-foreground py-12 text-center text-sm">
                    暂无匹配产品，请调整搜索或筛选条件。
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
