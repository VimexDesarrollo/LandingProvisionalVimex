import type { NextConfig } from 'next'

const distDir = process.env.NEXT_DIST_DIR?.trim()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
    ],
  },
  distDir: distDir && distDir.length > 0 ? distDir : '.next',
}

export default nextConfig
