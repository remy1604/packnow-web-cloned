import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: unknown) => {
      if (rule && typeof rule === 'object' && 'test' in rule && rule.test instanceof RegExp) {
        return rule.test.test('.svg');
      }
      return false;
    });
    if (fileLoaderRule && typeof fileLoaderRule === 'object') {
      (fileLoaderRule as { exclude?: RegExp }).exclude = /\.svg$/i;
    }
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: '@svgr/webpack' }],
    });
    return config;
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
