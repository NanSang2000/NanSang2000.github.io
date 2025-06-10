import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface BreadcrumbProps {
  category?: string
  title: string
  showBackButton?: boolean
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ category, title, showBackButton = true }) => {
  const router = useRouter()
  const pathSegments = router.asPath.split('/').filter(Boolean)
  
  const getCategoryName = (segment: string) => {
    switch (segment) {
      case 'CodeSnippets':
        return '代码片段'
      case 'note':
        return '学习笔记'
      default:
        return segment
    }
  }

  const getCategoryIcon = (segment: string) => {
    switch (segment) {
      case 'CodeSnippets':
        return '💾'
      case 'note':
        return '📚'
      default:
        return '📄'
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  const getParentPath = () => {
    if (pathSegments.length > 1) {
      return `/${pathSegments[0]}`
    }
    return '/'
  }

  return (
    <div className="mb-6">
      {/* 返回按钮 */}
      {showBackButton && (
        <div className="mb-3">
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <span className="text-lg">←</span>
            <span>返回</span>
          </button>
        </div>
      )}
      
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 px-1">
        {/* 首页链接 */}
        <Link 
          href="/" 
          className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        >
          <span className="mr-1">🏠</span>
          首页
        </Link>
      
      {pathSegments.length > 0 && (
        <>
          <span className="text-gray-400">/</span>
          
          {/* 第一级目录 */}
          <Link 
            href={`/${pathSegments[0]}`}
            className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          >
            <span className="mr-1">{getCategoryIcon(pathSegments[0])}</span>
            {getCategoryName(pathSegments[0])}
          </Link>
        </>
      )}
      
      {pathSegments.length > 1 && (
        <>
          <span className="text-gray-400">/</span>
          
          {/* 当前页面 */}
          <span className="flex items-center font-medium text-gray-800 dark:text-gray-200">
            <span className="mr-1">📝</span>
            {title}
          </span>
        </>
             )}
       </nav>
     </div>
   )
 }

export default Breadcrumb 