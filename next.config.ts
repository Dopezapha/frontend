import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { getSecurityHeaders } from './src/lib/securityHeaders'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: getSecurityHeaders(),
      },
    ]
  },
  webpack(config) {
    const splitChunks = config.optimization.splitChunks || {}
    config.optimization.splitChunks = {
      ...splitChunks,
      cacheGroups: {
        ...(splitChunks.cacheGroups || {}),
        three: {
          test: /[\\/]node_modules[\\/](?:three|@react-three\/fiber)(?:[\\/]|$)/,
          name: 'three',
          chunks: 'async',
          priority: 40,
          enforce: true,
        },
      },
    }
    return config
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(nextConfig)