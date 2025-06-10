import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { motion } from 'framer-motion'
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'
import Head from 'next/head'

interface BlogPostProps {
  post: {
    slug: string
    title: string
    content: string
    date: string
    readTime: string
    tags: string[]
    excerpt: string
  }
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = async (): Promise<void> => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl
        })
      } catch (err) {
        console.log('分享失败:', err)
      }
    } else {
      // 回退到复制链接
      void navigator.clipboard.writeText(shareUrl)
      alert('链接已复制到剪贴板')
    }
  }

  return (
    <>
      <Head>
        <title>{post.title} | Nan&apos;s Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 返回按钮 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              返回博客列表
            </Link>
          </motion.div>

          {/* 文章头部 */}
          <motion.header
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {post.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {post.readTime}
              </div>
              <button
                onClick={() => {
                  void handleShare()
                }}
                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </button>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap gap-2 justify-center">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                >
                  <Tag className="inline w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          </motion.header>

          {/* 文章内容 */}
          <motion.article
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 dark:border-gray-700"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h1:text-3xl prose-h1:mb-6 prose-h1:mt-8
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700 prose-h2:pb-2
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-5
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-gray-900 prose-pre:rounded-lg prose-pre:p-0
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/20 prose-blockquote:p-4 prose-blockquote:rounded-r-lg
              prose-ul:space-y-2 prose-ol:space-y-2
              prose-li:text-gray-700 dark:prose-li:text-gray-300
              prose-table:w-full prose-table:border-collapse
              prose-th:bg-gray-50 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold
              prose-td:p-3 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700"
            >
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match
                      ? (
                        <div className="relative">
                          <div className="absolute top-2 right-2 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                            {match[1]}
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            className="rounded-lg !mt-0 !mb-6"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        </div>
                        )
                      : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                        )
                  },
                  table({ children }) {
                    return (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                          {children}
                        </table>
                      </div>
                    )
                  },
                  th({ children }) {
                    return (
                      <th className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-left font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">
                        {children}
                      </th>
                    )
                  },
                  td({ children }) {
                    return (
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                        {children}
                      </td>
                    )
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg my-6 italic">
                        {children}
                      </blockquote>
                    )
                  }
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </motion.article>

          {/* 底部导航 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              查看更多文章
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const docsDirectory = path.join(process.cwd(), 'docs')
  
  let paths: Array<{ params: { slug: string } }> = []
  
  try {
    const filenames = fs.readdirSync(docsDirectory)
    const markdownFiles = filenames.filter(name => name.endsWith('.md'))
    
    paths = markdownFiles.map(filename => ({
      params: {
        slug: filename.replace(/\.md$/, '')
      }
    }))
  } catch (error) {
    console.log('无法读取docs目录，返回空路径')
  }

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const docsDirectory = path.join(process.cwd(), 'docs')
  const filePath = path.join(docsDirectory, `${slug}.md`)

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    // 生成摘要
    const excerpt = content
      .replace(/^#.*$/gm, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/[#*`[\]]/g, '')
      .trim()
      .substring(0, 150) + '...'

    // 计算阅读时间
    const readTime = `${Math.max(1, Math.ceil(content.length / 200 / 5))} 分钟阅读`

    // 提取标签
    const tags = data.tags || ['技术']

    const post = {
      slug,
      title: data.title || content.match(/^# (.+)$/m)?.[1] || slug,
      content,
      date: data.date || new Date().toLocaleDateString('zh-CN'),
      readTime,
      tags,
      excerpt
    }

    return {
      props: {
        post
      }
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}

export default BlogPost 