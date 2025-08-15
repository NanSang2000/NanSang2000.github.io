'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { AiFillStar, AiOutlineGithub, AiOutlineLink } from 'react-icons/ai'
import { BiGitRepoForked } from 'react-icons/bi'

export interface ProjectMeta {
  id: number
  name: string
  description: string
  stars: number
  forks: number
  language?: string | null
  topics?: string[]
  updatedAt: string
  htmlUrl: string
  homepage?: string | null
  bannerUrl?: string
  author?: string
}

interface ProjectCardProps {
  project: ProjectMeta
  index?: number
}

// 一张“信息优先”的作品卡片：
// - 顶部动态 Banner（可为动态图服务/OG 图）
// - 中部标题、要点、主题标签
// - 底部操作区（GitHub/Homepage）与次级指标
// - 设计理念：信息分区清晰、在不同密度下都不丢关键信息
const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0 }) => {
  const languageColors: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Go: '#00add8',
    Java: '#ed8b00',
    'C++': '#00599c',
    HTML: '#e34f26',
    CSS: '#1572b6',
    Rust: '#dea584',
    Swift: '#fa7343'
  }

  const color = project.language ? (languageColors[project.language] || '#6b7280') : '#6b7280'

  const formatDate = (date: string) => new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm hover:shadow-xl transition-all"
    >
      {/* 顶部横幅 */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850">
        {project.bannerUrl
          ? (
            <img
              src={project.bannerUrl}
              className="h-48 w-full object-contain bg-white"
              alt={`${project.name} banner`}
            />
            )
          : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-gray-500">{project.language || 'Repository'}</div>
              </div>
            </div>
            )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {/* 左上角徽章 */}
        <div className="absolute top-3 left-3 flex gap-2">
          <div className="px-2 py-1 rounded-full text-xs font-medium text-white shadow-lg" style={{ backgroundColor: color }}>
            {project.language || 'Code'}
          </div>
        </div>
        {/* 右上角数据 */}
        <div className="absolute top-3 right-3 flex gap-2">
          {project.stars > 0 && (
            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-lg flex items-center gap-1">
              <AiFillStar className="text-yellow-400" /> {project.stars}
            </div>
          )}
          {project.forks > 0 && (
            <div className="px-2 py-1 bg-black/70 backdrop-blur-sm rounded-full text-xs font-medium text-white shadow-lg flex items-center gap-1">
              <BiGitRepoForked /> {project.forks}
            </div>
          )}
        </div>
      </div>

      {/* 内容区 - 优化字体层级与视觉 */}
      <div className="p-6 space-y-4">
        {/* 标题 - 增强字重与间距 */}
        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-tight line-clamp-1 font-mono">
          {project.name}
        </h3>
        
        {/* 描述 - 提升可读性 */}
        <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed line-clamp-3 font-light">
          {project.description}
        </p>

        {/* 主题标签 - 更精致的设计 */}
        {project.topics && project.topics.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.topics.slice(0, 4).map((t, i) => (
              <span 
                key={i} 
                className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/30 backdrop-blur-sm shadow-sm"
              >
                {t}
              </span>
            ))}
            {project.topics.length > 4 && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                +{project.topics.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 底部操作区 - 更现代的布局 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wide">
            更新于 {formatDate(project.updatedAt)}
          </div>
          <div className="flex items-center gap-2">
            <motion.a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <span className="inline-flex items-center gap-1.5">
                <AiOutlineGithub className="text-sm" /> 
                <span className="font-mono">GitHub</span>
              </span>
            </motion.a>
            {project.homepage && (
              <motion.a
                href={project.homepage}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <span className="inline-flex items-center gap-1.5">
                  <AiOutlineLink className="text-sm" /> 
                  <span className="font-mono">Live</span>
                </span>
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
