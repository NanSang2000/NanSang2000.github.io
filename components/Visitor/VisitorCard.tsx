import React, { useEffect, useState } from 'react'
import Visitors from './index'
import { motion } from 'framer-motion'

// 定义组件属性接口
interface VisitorCardProps {
  className?: string
  showTitle?: boolean
  titleText?: string
  showAnimation?: boolean
  compact?: boolean
}

/**
 * 超现代化美化的访客计数卡片组件 - 玻璃拟态设计
 */
const VisitorCard: React.FC<VisitorCardProps> = ({
  className = '',
  showTitle = true,
  titleText = 'Visitors',
  showAnimation = true,
  compact = false
}) => {
  const { count, ip, loading, error } = Visitors()
  const [animatedCount, setAnimatedCount] = useState(0)

  // 数字增长动画效果
  useEffect(() => {
    if (loading || count === 0) return

    if (!showAnimation) {
      setAnimatedCount(count)
      return
    }

    const start = animatedCount
    const increment = Math.ceil((count - start) / 60)
    let current: number = start

    const timer = setInterval(() => {
      current = current + increment
      if (current >= count) {
        setAnimatedCount(count)
        clearInterval(timer)
      } else {
        setAnimatedCount(current)
      }
    }, 20)

    return () => { clearInterval(timer) }
  }, [count, loading, showAnimation, animatedCount])

  // 紧凑模式 - 极简玻璃风格
  if (compact) {
    return (
      <div className={`visitor-card-compact relative ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          whileHover={{
            scale: 1.03,
            y: -2,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
          className="group relative overflow-hidden rounded-3xl"
        >
          {/* 玻璃背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-gray-800/40 dark:via-gray-800/30 dark:to-gray-800/20 backdrop-blur-xl border border-white/30 dark:border-gray-700/30 rounded-3xl shadow-2xl" />

          {/* 发光边框效果 */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

          {/* 动态光晕 */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            }}
            className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-xl opacity-60"
          />

          {/* 内容区域 */}
          <div className="relative z-10 p-6">
            {/* 标题 */}
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center justify-between mb-4"
              >
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {titleText}
                </h3>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2.5 h-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"
                />
              </motion.div>
            )}

            {/* 主要内容 */}
            <div className="flex flex-col items-center space-y-3">
              {loading
                ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center space-y-3"
                >
                  {/* 精美的加载动画 */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-12 h-12 rounded-full border-2 border-transparent bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent, #06b6d4, #3b82f6, #8b5cf6, transparent)'
                      }}
                    />
                    <div className="absolute inset-1 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-xl shadow-inner" />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
                    />
                  </div>
                  <div className="text-sm font-medium bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    Counting Visitors...
                  </div>
                </motion.div>
                  )
                : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex flex-col items-center space-y-2"
                >
                  {/* 数字显示 */}
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="relative"
                    >
                      <div className="text-4xl lg:text-5xl font-black bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent filter drop-shadow-lg tracking-tight">
                        {animatedCount.toLocaleString()}
                      </div>

                      {/* 数字发光效果 */}
                      <motion.div
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.02, 1]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="absolute inset-0 text-4xl lg:text-5xl font-black bg-gradient-to-br from-cyan-400/40 via-blue-400/40 to-purple-400/40 bg-clip-text text-transparent blur-sm"
                      >
                        {animatedCount.toLocaleString()}
                      </motion.div>
                    </motion.div>

                    {/* 实时状态指示器 */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1"
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg shadow-green-400/50 animate-pulse" />
                    </motion.div>
                  </div>

                  {/* 副标题 */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="text-sm font-semibold text-gray-600 dark:text-gray-300"
                  >
                    Total Visitors
                  </motion.div>
                </motion.div>
                  )}

              {/* IP信息 */}
              {(ip != null && ip !== '') && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="w-full p-3 bg-gradient-to-r from-white/20 to-white/10 dark:from-gray-700/30 dark:to-gray-700/20 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-gray-600/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                      </div>
                      <div className="text-xs font-mono font-semibold text-gray-700 dark:text-gray-300">
                        {ip}
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-cyan-300 border-t-cyan-600 rounded-full opacity-60"
                    />
                  </div>
                </motion.div>
              )}

              {/* 错误信息 */}
              {(error != null && error !== '') && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full p-3 bg-gradient-to-r from-red-100/80 to-red-50/80 dark:from-red-900/30 dark:to-red-800/30 border border-red-200/50 dark:border-red-700/50 rounded-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-red-700 dark:text-red-300 font-medium">
                      {error}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // 完整版 - 豪华玻璃设计
  return (
    <div className={`visitor-card relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        whileHover={{
          scale: 1.02,
          rotate: 0.3,
          transition: { duration: 0.4, ease: 'easeOut' }
        }}
        className="group relative"
      >
        {/* 外层发光边框 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-[2rem] opacity-20 group-hover:opacity-40 transition-all duration-500 blur-sm" />

        {/* 主容器 */}
        <div className="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-white/25 via-white/15 to-white/5 dark:from-gray-800/30 dark:via-gray-800/20 dark:to-gray-800/10 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-2xl">

          {/* 动态背景装饰 */}
          <div className="absolute inset-0 overflow-hidden">
            {/* 主要背景球 */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
                x: [0, 10, 0],
                y: [0, -10, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-cyan-400/30 via-blue-500/25 to-purple-600/20 rounded-full blur-2xl"
            />

            {/* 次要背景球 */}
            <motion.div
              animate={{
                rotate: -360,
                scale: [1, 1.3, 1],
                x: [0, -15, 0],
                y: [0, 15, 0]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
              className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-br from-purple-400/25 via-pink-400/20 to-blue-400/15 rounded-full blur-xl"
            />

            {/* 精美粒子系统 */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1.5, 0.5]
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>

          {/* 内容区域 */}
          <div className="relative z-10 p-8">
            {/* 标题区域 */}
            {showTitle && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex items-center justify-between mb-8"
              >
                <h3 className="text-3xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                  ✨ {titleText}
                </h3>
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-4 h-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-xl shadow-cyan-400/50"
                />
              </motion.div>
            )}

            {/* 主要计数显示 */}
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              {loading
                ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center space-y-6"
                >
                  {/* 豪华加载动画 */}
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="w-20 h-20 rounded-full"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent, #06b6d4, #3b82f6, #8b5cf6, transparent)',
                        filter: 'blur(1px)'
                      }}
                    />
                    <div className="absolute inset-2 bg-white/90 dark:bg-gray-800/90 rounded-full backdrop-blur-xl shadow-inner" />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg"
                    />
                  </div>
                  <div className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                    正在统计访客数据...
                  </div>
                </motion.div>
                  )
                : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative flex flex-col items-center space-y-4"
                >
                  {/* 主数字显示 */}
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="relative"
                    >
                      <div className="text-7xl lg:text-8xl font-black bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent filter drop-shadow-2xl tracking-tighter">
                        {animatedCount.toLocaleString()}
                      </div>

                      {/* 多层光晕效果 */}
                      <motion.div
                        animate={{
                          opacity: [0.2, 0.5, 0.2],
                          scale: [1, 1.05, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                        className="absolute inset-0 text-7xl lg:text-8xl font-black bg-gradient-to-br from-cyan-400/30 via-blue-400/30 to-purple-400/30 bg-clip-text text-transparent blur-md"
                      >
                        {animatedCount.toLocaleString()}
                      </motion.div>

                      <motion.div
                        animate={{
                          opacity: [0.1, 0.3, 0.1],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1
                        }}
                        className="absolute inset-0 text-7xl lg:text-8xl font-black bg-gradient-to-br from-cyan-300/20 via-blue-300/20 to-purple-300/20 bg-clip-text text-transparent blur-lg"
                      >
                        {animatedCount.toLocaleString()}
                      </motion.div>
                    </motion.div>

                    {/* 3D状态指示器 */}
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, 360],
                        y: [0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -top-3 -right-3 flex items-center space-x-2"
                    >
                      <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-xl shadow-green-400/50 animate-pulse" />
                      <div className="text-sm font-bold text-green-600 dark:text-green-400 bg-green-100/80 dark:bg-green-900/60 px-3 py-1 rounded-full backdrop-blur-sm border border-green-200/50 dark:border-green-700/50 shadow-lg">
                        LIVE
                      </div>
                    </motion.div>
                  </div>

                  {/* 优雅的副标题 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="text-xl font-bold text-gray-600 dark:text-gray-300 tracking-wide"
                  >
                    累计访客统计
                  </motion.div>
                </motion.div>
                  )}
            </div>

            {/* IP信息区域 */}
            {(ip != null && ip !== '') && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 p-6 bg-gradient-to-r from-white/30 to-white/20 dark:from-gray-700/40 dark:to-gray-700/30 rounded-3xl backdrop-blur-xl border border-white/30 dark:border-gray-600/30 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-400/30">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
                        访客来源地址
                      </div>
                      <div className="text-xl font-mono font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent tracking-wider">
                        {ip}
                      </div>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-3 border-cyan-300 border-t-cyan-600 rounded-full shadow-lg"
                  />
                </div>
              </motion.div>
            )}

            {/* 错误信息 */}
            {(error != null && error !== '') && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-gradient-to-r from-red-100/90 to-red-50/90 dark:from-red-900/40 dark:to-red-800/40 border border-red-200/60 dark:border-red-700/60 rounded-2xl backdrop-blur-sm shadow-lg"
              >
                <div className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-red-700 dark:text-red-300 font-semibold">
                    {error}
                  </span>
                </div>
              </motion.div>
            )}

            {/* 底部信息栏 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex items-center justify-between mt-8 pt-6 border-t border-white/20 dark:border-gray-600/30"
            >
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{
                    scale: [1, 1.4, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50"
                />
                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                  24小时自动更新
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <motion.svg
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </motion.svg>
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                  实时同步中
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default VisitorCard
