import React, { useState, useEffect } from 'react'
import BlogList from './BlogList'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

const BlogPageWithData: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        const response = await fetch('/api/blog-posts')
        const data = await response.json()
        setPosts(data.posts || [])
      } catch (error) {
        console.error('获取博客文章失败:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    void fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="relative">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-32 w-40 h-40 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative flex flex-col justify-center items-center py-20 min-h-[400px]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 dark:border-blue-800"></div>
                         <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent absolute top-0 left-0" style={{ animationDelay: '0.15s' }}></div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium animate-pulse">
              正在加载精彩内容...
            </p>
            <div className="flex justify-center mt-3 space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* 动态背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-600 dark:to-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-1/3 w-48 h-48 bg-gradient-to-r from-pink-300 to-red-300 dark:from-pink-600 dark:to-red-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/2 w-56 h-56 bg-gradient-to-r from-green-300 to-blue-300 dark:from-green-600 dark:to-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-32 h-32 bg-gradient-to-r from-yellow-300 to-orange-300 dark:from-yellow-600 dark:to-orange-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-2xl opacity-20 animate-pulse" style={{ animationDelay: '3s' }}></div>
        
        {/* 浮动的装饰点 */}
        <div className="absolute top-1/4 left-20 w-3 h-3 bg-blue-400 dark:bg-blue-300 rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-3/4 right-32 w-2 h-2 bg-purple-400 dark:bg-purple-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-3/4 w-4 h-4 bg-pink-400 dark:bg-pink-300 rounded-full animate-ping opacity-60" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* 主要内容 */}
      <div className="relative z-10">
        <BlogList posts={posts} />
      </div>
    </div>
  )
}

export default BlogPageWithData 