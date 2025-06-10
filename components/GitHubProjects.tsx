import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AiFillStar, AiOutlineLink, AiOutlineGithub } from 'react-icons/ai'
import { BiGitRepoForked } from 'react-icons/bi'

interface GitHubRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string | null
  stargazers_count: number
  language: string | null
  topics: string[]
  updated_at: string
  banner: string
}

interface GitHubProjectCardProps {
  repo: GitHubRepo
  index: number
}

const GitHubProjectCard: React.FC<GitHubProjectCardProps> = ({ repo, index }) => {
  const [imageError, setImageError] = useState(false)
  
  // 语言颜色映射
  const languageColors: Record<string, string> = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    Python: '#3776ab',
    Go: '#00add8',
    Java: '#ed8b00',
    'C++': '#00599c',
    HTML: '#e34f26',
    CSS: '#1572b6',
    React: '#61dafb',
    Vue: '#4fc08d'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group h-auto min-h-[400px] w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      {/* 装饰性渐变边框 */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm pointer-events-none"></div>

      {/* 项目图片 */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {/* eslint-disable-next-line multiline-ternary */}
        {!imageError ? (
          <img
            src={repo.banner}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={repo.name}
            onError={handleImageError}
          />
        ) : (
          <div className="h-48 w-full flex items-center justify-center">
            <div className="text-center">
              <AiOutlineGithub className="mx-auto text-6xl text-gray-400 dark:text-gray-500 mb-2" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">{repo.language || 'Repository'}</p>
            </div>
          </div>
        )}
        
        {/* 图片遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* 语言标签 */}
        {repo.language && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium text-white shadow-lg" 
               style={{ backgroundColor: languageColors[repo.language] || '#6b7280' }}>
            {repo.language}
          </div>
        )}
      </div>

      {/* 项目信息 */}
      <div className="p-4 space-y-3">
        {/* 标题和Star */}
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-1">
            {repo.name}
          </h3>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-1 bg-gradient-to-r from-orange-400 to-yellow-500 px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
          >
            <AiFillStar className="text-white text-sm" />
            <span className="text-white text-sm font-medium">{repo.stargazers_count}</span>
          </motion.div>
        </div>

        {/* 描述 */}
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
          {repo.description}
        </p>

        {/* Topics */}
        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((topic, topicIndex) => (
              <span
                key={topicIndex}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}

        {/* 更新时间 */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          更新于 {formatDate(repo.updated_at)}
        </div>

        {/* 操作按钮 */}
        <div className="relative z-10 flex space-x-2 pt-2">
          <motion.a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            <AiOutlineGithub className="text-sm" />
            <span className="text-sm font-medium">GitHub</span>
          </motion.a>
          
          {repo.homepage && (
            <motion.a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              <AiOutlineLink className="text-sm" />
            </motion.a>
          )}
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
    </motion.div>
  )
}

const GitHubProjects: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('/api/github-repos')
        if (!response.ok) {
          throw new Error('Failed to fetch repositories')
        }
        const data = await response.json()
        setRepos(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    void fetchRepos()
  }, [])

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-96 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">😕</div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          加载失败
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          {error}
        </p>
      </div>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
          暂无项目
        </h3>
        <p className="text-gray-500 dark:text-gray-500">
          目前还没有找到合适的公开仓库
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 mt-8"
    >
      {repos.map((repo, index) => (
        <GitHubProjectCard key={repo.id} repo={repo} index={index} />
      ))}
    </motion.div>
  )
}

export default GitHubProjects 