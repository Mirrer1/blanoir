import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    // 업로드 이미지 Server Action 크기 상향
    serverActions: {
      bodySizeLimit: '6mb',
    },
  },
}

export default nextConfig
