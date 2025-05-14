import React, { useEffect, useState } from 'react'
import Visitors from './index'
import { motion } from 'framer-motion'

// 定义组件属性接口
interface VisitorCardProps {
  className?: string
  showTitle?: boolean
  titleText?: string
  showAnimation?: boolean
}

/**
 * 美化的访客计数卡片组件
 */
const VisitorCard: React.FC<VisitorCardProps> = ({
  className = '',
  showTitle = true,
  titleText = 'Visitors',
  showAnimation = true
}) => {
  const { count, ip, loading, error } = Visitors()
  const [animatedCount, setAnimatedCount] = useState(0)

  // 数字增长动画效果
  useEffect(() => {
    if (loading || count === 0) return

    // 如果不需要动画，直接设置
    if (!showAnimation) {
      setAnimatedCount(count)
      return
    }

    // 设置动画起始值
    let start = 0
    if (animatedCount > 0) {
      start = animatedCount
    }

    // 计算动画步长和持续时间
    const increment = Math.ceil((count - start) / 30)
    let current = start

    const timer = setInterval(() => {
      current += increment
      if (current >= count) {
        setAnimatedCount(count)
        clearInterval(timer)
      } else {
        setAnimatedCount(current)
      }
    }, 30)

    return () => { clearInterval(timer) }
  }, [count, loading, showAnimation, animatedCount])

  return (
    <motion.div
      className={`visitor-card relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      {/* 卡片容器 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-950 shadow-lg p-6 transition-all duration-300 hover:shadow-xl border border-blue-100 dark:border-blue-800">
        {/* 装饰元素 - 更现代的设计 */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-200 dark:bg-blue-700 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-indigo-300 dark:bg-indigo-600 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-200 dark:bg-purple-700 rounded-full opacity-10 blur-lg"></div>

        {/* 内容容器 */}
        <div className="relative z-10">
          {/* 标题 */}
          {showTitle && (
            <motion.h3
              className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 border-b border-blue-200 dark:border-blue-700 pb-2 flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="mr-2">✨</span>
              {titleText}
            </motion.h3>
          )}

          {/* 计数显示 */}
          <motion.div
            className="flex flex-col items-center justify-center py-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {loading
              ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 shadow-lg"></div>
                  </div>
                )
              : (
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <div className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-300 transition-all duration-300 transform">
                      {animatedCount}
                    </div>
                    <motion.div
                      className="absolute -right-2 -top-2 text-xs px-2 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      All
                    </motion.div>
                  </motion.div>
                )}
            <div className="text-xl mt-2 text-blue-700 dark:text-blue-300 font-medium">
              Visitor Count
            </div>
          </motion.div>

          {/* IP地址显示 */}
          {ip != null && (
            <motion.div
              className="mt-4 flex flex-col items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 shadow-inner border border-blue-50 dark:border-blue-900"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Recent Visit IP
              </div>
              <div className="text-lg font-mono tracking-wider text-gray-700 dark:text-gray-300">
                {ip}
              </div>
            </motion.div>
          )}

          {/* 错误信息 */}
          {error != null && (
            <motion.div
              className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/30 dark:text-red-300 p-3 rounded-xl border border-red-200 dark:border-red-800/50 shadow-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          {/* 底部装饰 */}
          <motion.div
            className="flex justify-between items-center mt-6 text-xs text-blue-500 dark:text-blue-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">更新频率: 24h</div>
            <div className="flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1 animate-pulse"></span>
              实时统计
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default VisitorCard
