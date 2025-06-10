'use client'

// import { type Context as TypeContext } from '../../types'
import { generateContext } from '../../utils'
import type { Context as ContextType, contextItems, contextChild } from '../../types'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Context ({ json, title }: {
  json: string
  title: string
}): JSX.Element {
  const [isClient, setIsClient] = useState(false)
  const [contextData, setContextData] = useState<ContextType | null>(null)

  useEffect(() => {
    // 只在客户端渲染时生成内容
    setIsClient(true)
    const res = generateContext(json, title)
    setContextData(res)
  }, [json, title])

  // 在服务端渲染和hydration期间显示加载状态
  if (!isClient || !contextData) {
    return (
      <div className={'w-full flex flex-col'}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={'w-full flex flex-col'}>
      {
        contextData.children.map(
          (item: contextItems, index: number) => {
            return (
              <div key={index}>
                <div className={'font-bold text-xl'}>
                  {item.title}
                </div>
                <div className={'grid grid-cols-2 lg:grid-cols-3 my-3 gap-2'}>
                  {
                    item.children.map(
                      (childItem: contextChild, childIndex: number) => {
                        // 修复路径生成逻辑 - 根据不同页面处理大小写
                        let href: string
                        const baseTitle = contextData.title === 'Note' ? 'note' : contextData.title
                        
                        if (childItem.title === 'index') {
                          href = `/${baseTitle}`
                        } else {
                          // 检查是否存在对应的页面文件或目录
                          href = `/${baseTitle}/${childItem.title}`
                        }
                        
                        return (
                          <Link 
                            href={href} 
                            key={childIndex} 
                            className={'flex items-center justify-center text-center border-gray-100 dark:border-gray-900 border-2 px-3 py-5 bg-gray-100 dark:bg-gray-900 hover:bg-gray-50 rounded-lg hover:dark:bg-gray-800 transition-all ease duration-800 min-h-[80px]'}
                          >
                            <span className="text-sm font-medium">
                              {childItem.link || childItem.title}
                            </span>
                          </Link>
                        )
                      }
                    )
                  }
                </div>
              </div>
            )
          }
        )
      }
    </div>
  )
}
