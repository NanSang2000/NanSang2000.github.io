import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export const useBlogPosts = (): { posts: BlogPost[], loading: boolean } => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async (): Promise<void> => {
      try {
        // 在客户端，我们需要通过API获取数据
        if (typeof window !== 'undefined') {
          const response = await fetch('/api/blog-posts')
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error('获取博客文章失败:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    void fetchPosts()
  }, [])

  return { posts, loading }
}

// 服务端获取博客文章的函数
export const getBlogPosts = (): BlogPost[] => {
  try {
    const docsDirectory = path.join(process.cwd(), 'docs')
    const filenames = fs.readdirSync(docsDirectory)
    const markdownFiles = filenames.filter(name => name.endsWith('.md'))

    const posts = markdownFiles.map(filename => {
      const filePath = path.join(docsDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      // 从文件名生成slug
      const slug = filename.replace(/\.md$/, '')

      // 生成摘要（取内容前150个字符）
      const excerpt = content
        .replace(/^#.*$/gm, '') // 移除标题
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/[#*`[\]]/g, '') // 移除markdown符号
        .trim()
        .substring(0, 150) + '...'

      // 计算阅读时间（假设每分钟200字）
      const readTime = `${Math.max(1, Math.ceil(content.length / 200 / 5))} 分钟阅读`

      // 从内容或文件名提取标签
      const tags = data.tags || [
        filename.includes('cloud') ? '云计算' : '',
        filename.includes('optimization') ? '性能优化' : '',
        filename.includes('fix') ? '问题修复' : '',
        '技术'
      ].filter(Boolean)

      return {
        slug,
        title: data.title || content.match(/^# (.+)$/m)?.[1] || slug,
        excerpt,
        date: data.date || new Date().toLocaleDateString('zh-CN'),
        readTime,
        tags,
        content
      }
    })

    // 按日期排序
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.log('无法读取docs目录，返回空列表')
    return []
  }
} 