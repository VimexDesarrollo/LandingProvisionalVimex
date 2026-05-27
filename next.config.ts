import type { NextConfig } from 'next'

const distDir = process.env.NEXT_DIST_DIR?.trim()
const isDev = process.env.NODE_ENV === 'development'

const devConnectSrc = isDev ? ' http://localhost:* http://127.0.0.1:*' : ''

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.amazonaws.com https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://s3.amazonaws.com",
      "font-src 'self' https://fonts.gstatic.com https://s3.amazonaws.com",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://s3.amazonaws.com https://*.guestybookings.com https://www.googletagmanager.com",
      `connect-src 'self' https://api.vimexmx.com https://s3.amazonaws.com https://*.guestybookings.com https://app.guesty.com https://www.google-analytics.com${devConnectSrc}`,
      "frame-src 'self' https://*.guestybookings.com https://www.googletagmanager.com",
      "frame-ancestors 'none'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  distDir: distDir && distDir.length > 0 ? distDir : '.next',
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
