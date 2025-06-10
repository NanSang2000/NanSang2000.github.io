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
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">加载中...</span>
      </div>
    )
  }

  return <BlogList posts={posts} />
}

export default BlogPageWithData 