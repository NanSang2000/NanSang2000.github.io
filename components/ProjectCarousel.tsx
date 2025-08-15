'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from 'lucide-react'
import ProjectCard, { ProjectMeta } from './ProjectCard'

interface ProjectCarouselProps {
  projects: ProjectMeta[]
  autoPlay?: boolean
  intervalMs?: number
  itemsPerView?: number
  onActiveChange?: (index: number, project: ProjectMeta) => void
}

const ProjectCarousel: React.FC<ProjectCarouselProps> = ({
  projects,
  autoPlay = true,
  intervalMs = 4000,
  itemsPerView = 3,
  onActiveChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isHovered, setIsHovered] = useState(false)

  // 计算可见范围
  const maxIndex = Math.max(0, projects.length - itemsPerView)

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1)
  }, [maxIndex])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1)
  }, [maxIndex])

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)))
  }, [maxIndex])

  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying || isHovered || projects.length <= itemsPerView) return

    const timer = setInterval(goToNext, intervalMs)
    return () => clearInterval(timer)
  }, [isPlaying, isHovered, goToNext, intervalMs, projects.length, itemsPerView])

  // 通知父组件当前激活项目
  useEffect(() => {
    if (projects[currentIndex]) {
      onActiveChange?.(currentIndex, projects[currentIndex])
    }
  }, [currentIndex, projects, onActiveChange])

  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">暂无项目</h3>
        <p className="text-gray-500 dark:text-gray-500">目前还没有找到合适的公开仓库</p>
      </div>
    )
  }

  // 如果项目数量少于等于可见数量，显示静态网格
  if (projects.length <= itemsPerView) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-8">
        {projects.map((project, index) => (
          <div key={project.id}>
            <ProjectCard project={project} index={index} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div 
      className="relative mt-8"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 轮播容器 */}
      <div className="overflow-hidden rounded-2xl">
        <motion.div
          className="flex gap-8"
          animate={{ x: `calc(-${currentIndex * (100 / itemsPerView)}% - ${currentIndex * 2}rem)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className={'flex-shrink-0 w-full max-w-sm lg:max-w-none'}
              style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 2}rem / ${itemsPerView})` }}
            >
              <ProjectCard project={project} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* 导航按钮 */}
      <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 transition-all"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={goToNext}
          disabled={currentIndex === maxIndex}
          className="w-12 h-12 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white dark:hover:bg-gray-800 transition-all"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </motion.button>
      </div>

      {/* 指示器与控制栏 */}
      <div className="flex items-center justify-between mt-6">
        {/* 点指示器 */}
        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-blue-600 w-6' 
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        {/* 播放控制 */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {currentIndex + 1} / {maxIndex + 1}
          </span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {isPlaying
              ? (
                <PauseIcon className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                )
              : (
                <PlayIcon className="w-3 h-3 text-gray-600 dark:text-gray-400 ml-0.5" />
                )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ProjectCarousel
