const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  defaultShowCopyCode: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 解决客户端渲染问题
  transpilePackages: ['nextra', 'nextra-theme-docs'],
  
  // 优化构建
  swcMinify: true,
  
  // 解决字体和静态资源问题
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // 确保静态导出兼容性
  trailingSlash: true,
  
  // 优化图片处理
  images: {
    unoptimized: true,
    domains: ['cdn.jsdelivr.net', 'raw.githubusercontent.com']
  },
  
  // 解决客户端hydration问题
  experimental: {
    esmExternals: 'loose'
  },
  
  // 构建优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false
  },
  
  // 确保正确的运行时配置
  poweredByHeader: false,
  
  // 处理字体文件
  webpack: (config, { isServer }) => {
    // 确保字体文件正确处理
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'static/fonts/[name].[hash][ext]'
      }
    })
    
    // 解决客户端bundle问题
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        dns: false,
        net: false,
        tls: false
      }
    }
    
    return config
  }
}

module.exports = withNextra(nextConfig)
