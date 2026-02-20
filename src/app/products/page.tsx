'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PouchProductService, type PouchProduct } from '@/services/supabase/pouch_products';
import {
  PouchAttributeCategoryService,
  type PouchAttributeCategory,
} from '@/services/supabase/pouch_attribute_categories';
import {
  PouchAttributeValueService,
  type PouchAttributeValue,
} from '@/services/supabase/pouch_attribute_values';

export default function PouchProductsPage() {
  const [products, setProducts] = useState<PouchProduct[]>([]);
  const [categories, setCategories] = useState<PouchAttributeCategory[]>([]);
  const [attributeValues, setAttributeValues] = useState<PouchAttributeValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set());

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData, valuesData] = await Promise.all([
          PouchProductService.listPouchProducts(),
          PouchAttributeCategoryService.listPouchAttributeCategories(),
          PouchAttributeValueService.listPouchAttributeValues(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setAttributeValues(valuesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 按 category_id 分组 attribute values
  const valuesByCategory = useMemo(() => {
    const grouped: Record<string, PouchAttributeValue[]> = {};
    attributeValues.forEach((value) => {
      if (!grouped[value.category_id]) {
        grouped[value.category_id] = [];
      }
      grouped[value.category_id].push(value);
    });
    return grouped;
  }, [attributeValues]);

  // 切换选中状态
  const toggleValue = (valueId: string) => {
    setSelectedValues((prev) => {
      const next = new Set(prev);
      if (next.has(valueId)) {
        next.delete(valueId);
      } else {
        next.add(valueId);
      }
      return next;
    });
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSelectedValues(new Set());
    setSearchQuery('');
  };

  // 过滤产品
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // 按名称搜索
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(query));
    }

    // 按选中的 attribute values 筛选
    if (selectedValues.size > 0) {
      filtered = filtered.filter((product) => {
        // 检查 base_type 或 material_structure 是否匹配选中的值
        return (
          selectedValues.has(product.base_type) || selectedValues.has(product.material_structure)
        );
      });
    }

    return filtered;
  }, [products, searchQuery, selectedValues]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex gap-6">
        {/* 左侧筛选栏 */}
        <aside className="w-80 flex-shrink-0">
          <Card className="border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">筛选条件</CardTitle>
                {(selectedValues.size > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    清除
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {categories.map((category) => {
                const values = valuesByCategory[category.id] || [];
                if (values.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-2">
                    <h3 className="font-medium text-sm">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {values.map((value) => {
                        const isSelected = selectedValues.has(value.id);
                        return (
                          <Badge
                            key={value.id}
                            variant={isSelected ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleValue(value.id)}
                          >
                            {value.name}
                          </Badge>
                        );
                      })}
                    </div>
                    <Separator />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </aside>

        {/* 右侧产品展示栏 */}
        <main className="flex-1 min-w-0">
          <div className="space-y-6">
            {/* 搜索栏 */}
            <Card className="border-primary/15 bg-gradient-to-br from-amber-50/50 to-card dark:from-amber-950/10 dark:to-card">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    type="text"
                    placeholder="搜索产品名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 产品列表 */}
            <div className="space-y-4">
              {filteredProducts.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">没有找到匹配的产品</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    找到 {filteredProducts.length} 个产品
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="border-primary/15 bg-gradient-to-br from-card via-primary/5 to-card transition-shadow hover:shadow-md"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg text-primary">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-2 pt-2">
                            <Badge variant="secondary" className="text-xs">
                              尺寸: {product.dimensions_width} × {product.dimensions_height} ×{' '}
                              {product.dimensions_gusset}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              容量: {product.capacity_volume}ml
                            </Badge>
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button asChild variant="default" size="sm">
                              <Link
                                href={`/quote/summary?product=${encodeURIComponent(product.id)}`}
                              >
                                报价
                              </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                              <Link href={`/studio?product=${encodeURIComponent(product.id)}`}>
                                去设计
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
