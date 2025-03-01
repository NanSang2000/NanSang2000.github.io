import React, { useEffect, useState } from 'react'
import Visitors from './index'

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
    <div className={`visitor-card relative ${className}`}>
      {/* 卡片容器 */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        {/* 装饰元素 */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 dark:bg-green-700 rounded-full opacity-30"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-green-300 dark:bg-green-600 rounded-full opacity-20"></div>

        {/* 内容容器 */}
        <div className="relative z-10">
          {/* 标题 */}
          {showTitle && (
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-4 border-b border-green-200 dark:border-green-700 pb-2">
              {titleText}
            </h3>
          )}

          {/* 计数显示 */}
          <div className="flex flex-col items-center justify-center py-4">
            {loading
              ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                )
              : (
                  <div className="relative">
                    <div className="text-7xl font-bold text-green-600 dark:text-green-400 transition-all duration-300 hover:scale-110 transform">
                      {animatedCount}
                    </div>
                    <div className="absolute -right-2 -top-2 text-xs px-2 py-1 bg-green-500 text-white rounded-full animate-pulse">
                      在线
                    </div>
                  </div>
                )}
            <div className="text-xl mt-2 text-green-700 dark:text-green-300 font-medium">
              Visitor Count
            </div>
          </div>

          {/* IP地址显示 */}
          {ip != null && (
            <div className="mt-4 flex flex-col items-center bg-white dark:bg-green-950 rounded-lg p-3 shadow-inner">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                最近访问IP
              </div>
              <div className="text-lg font-mono tracking-wider text-gray-700 dark:text-gray-300">
                {ip}
              </div>
            </div>
          )}

          {/* 错误信息 */}
          {error != null && (
            <div className="mt-4 text-sm text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-300 p-2 rounded border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {/* 底部装饰 */}
          <div className="flex justify-between items-center mt-6 text-xs text-green-500 dark:text-green-400">
            <div>更新频率: 24h</div>
            <div className="flex items-center">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
              实时统计
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VisitorCard
