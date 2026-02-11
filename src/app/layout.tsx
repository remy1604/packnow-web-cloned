import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { AgentationProvider } from '@/components/AgentationProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PACKNOW-WEB',
  description: 'Next.js 16 + shadcn + Tailwind 4 + Radix UI + Three.js + Agentation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <AgentationProvider />
      </body>
    </html>
  );
}
