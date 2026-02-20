'use client';

import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold text-lg text-primary">
          PackNow AI
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            首页
          </Link>
          <Link
            href="/products"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            产品目录
          </Link>
          <Link
            href="/quote"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            报价
          </Link>
          <Link
            href="/checkout"
            className="text-muted-foreground hover:text-primary text-sm transition-colors"
          >
            结算
          </Link>
        </nav>
      </div>
    </header>
  );
}
