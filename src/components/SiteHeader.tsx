'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold text-lg">
          PackNow AI
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
            首页
          </Link>
          <Link href="/products" className="text-muted-foreground hover:text-foreground text-sm">
            产品目录
          </Link>
          <Link href="/studio" className="text-muted-foreground hover:text-foreground text-sm">
            设计
          </Link>
          <Link href="/quote" className="text-muted-foreground hover:text-foreground text-sm">
            报价
          </Link>
          <Link href="/checkout" className="text-muted-foreground hover:text-foreground text-sm">
            结算
          </Link>
          <Button asChild size="sm">
            <Link href="/studio">Start Your Design</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
