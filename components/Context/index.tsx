'use client'

// import { type Context as TypeContext } from '../../types'
import { generateContext } from '../../utils'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Context as ContextType, contextItems, contextChild } from '../../types'

export default function Context ({ json, title }: {
  json: string
  title: string
}): JSX.Element {
  const [mounted, setMounted] = useState(false)
  const [contextData, setContextData] = useState<ContextType | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const res = generateContext(json, title)
      setContextData(res)
    } catch (error) {
      console.error('Context generation error:', error)
      // 设置默认的空数据结构
      setContextData({
        title,
        children: []
      })
    }
  }, [json, title])

  // 在客户端渲染完成前显示加载状态
  if (!mounted || !contextData) {
    return (
      <div className={'w-full flex flex-col'}>
        <div className={'animate-pulse'}>
          <div className={'h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4'}></div>
          <div className={'grid grid-cols-2 lg:grid-cols-3 my-3 gap-2'}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={'h-16 bg-gray-100 dark:bg-gray-800 rounded-lg'}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={'w-full flex flex-col'}>
      {
        contextData.children?.map(
          (item: contextItems, index: number) => {
            return (
              <div key={index}>
                <div className={'font-bold text-xl'}>
                  {item.title}
                </div>
                <div className={'grid grid-cols-2 lg:grid-cols-3 my-3 gap-2'}>
                  {
                    item.children?.map(
                      (child: contextChild, childIndex: number) => {
                        const basePath = `/${contextData.title.toLowerCase()}`
                        const href = child.title === 'index' 
                          ? basePath 
                          : `${basePath}/${child.title}`
                        
                        return (
                          <Link 
                            href={href} 
                            key={childIndex} 
                            className={'flex border-gray-100 dark:border-gray-900 border-2 px-3 py-5 bg-gray-100 dark:bg-gray-900 hover:bg-gray-50 rounded-lg hover:dark:bg-gray-800 transition-all ease duration-800'}
                          >
                            {child.link || child.title}
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
