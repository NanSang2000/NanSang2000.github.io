'use client'

import React, { useState, useEffect, useMemo } from 'react'

interface Project {
  name: string
  description: string
  color: string
}

const DefaultProjects: Project[] = [
  {
    name: 'Daymd',
    description: '高度可定制化的博客生成器',
    color: 'text-blue-500'
  },
  {
    name: 'Triangle UI',
    description: '直观的 React UI 组件库',
    color: 'text-red-500'
  },
  {
    name: 'csspano',
    description: '基于 Vue 和 Three.js 的全景图生成器',
    color: 'text-orange-400'
  },
  {
    name: 'Vestor',
    description: '基于 Nest.js 的访客统计工具',
    color: 'text-green-500'
  }
]

const INTERVAL = 3000

interface TextTurnProps {
  items?: Project[]
  activeIndex?: number
  autoPlay?: boolean
  intervalMs?: number
  compact?: boolean
}

export default function TextTurn ({ items, activeIndex, autoPlay = true, intervalMs = INTERVAL, compact = false }: TextTurnProps): JSX.Element {
  const [index, setIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [override, setOverride] = useState<Project | null>(null)
  const list = useMemo<Project[]>(() => {
    if (items && items.length > 0) return items
    return DefaultProjects
  }, [items])

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (typeof activeIndex === 'number') {
      setIndex(activeIndex)
      return
    }
    if (!autoPlay) return
    const intervalId = setInterval(() => {
      setIndex((i) => (Number(i) + 1) % list.length)
    }, intervalMs)
    return () => { clearInterval(intervalId) }
  }, [activeIndex, autoPlay, intervalMs, list.length])

  // 监听页面广播的活动项目变更事件
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { index?: number, repo?: any }
      if (typeof detail?.index === 'number') setIndex(detail.index)
      if (detail?.repo) {
        const r = detail.repo
        const langColor: Record<string, string> = {
          JavaScript: 'text-yellow-400',
          TypeScript: 'text-blue-500',
          Python: 'text-sky-500',
          Go: 'text-cyan-500',
          Java: 'text-orange-500',
          HTML: 'text-red-400',
          CSS: 'text-indigo-400',
          'C++': 'text-teal-500',
          React: 'text-cyan-400'
        }
        const truncate = (s: string, n: number) => {
          if (!s) return ''
          return s.length > n ? `${s.slice(0, n - 1)}…` : s
        }
        setOverride({
          name: truncate(r.name, 28),
          description: truncate(r.description || '', 60),
          color: langColor[r.language] || 'text-purple-500'
        })
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('projects-active-change', handler as EventListener)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('projects-active-change', handler as EventListener)
      }
    }
  }, [])

  // 如果不是客户端，显示第一个项目避免hydration mismatch
  if (!isClient) {
    const firstProject = list[0]
    return (
      <div className="flex items-start justify-start w-max text-start">
        <div className={'flex flex-col items-start justify-start text-start'}>
          <div className={`text-3xl lg:text-6xl ${firstProject.color} opacity-90 font-mono font-bold`}>
            {firstProject.name}
          </div>
          <div className={'text-black opacity-30 hover:opacity-60 mt-3'}>
            {firstProject.description}
          </div>
        </div>
      </div>
    )
  }

  // 若存在外部覆盖数据（来自 GitHub hover），优先展示覆盖
  if (override) {
    return (
      <div className="flex items-start justify-start w-max text-start">
        <div className={'flex flex-col items-start justify-start text-start'}>
          <div className={`animate-in fade-in-20 zoom-in ${compact ? 'text-xl md:text-3xl lg:text-4xl' : 'text-3xl lg:text-6xl'} ${override.color} opacity-90 font-mono font-bold`}>
            {override.name}
          </div>
          <div className={`animate-in text-black fade-in-20 opacity-50 hover:opacity-80 ${compact ? 'mt-1 text-sm md:text-base' : 'mt-3'}`}>
            {override.description}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-start w-max text-start">
      {list.map((item, i) => (
        <div key={i} className={'flex flex-col items-start justify-start text-start'}>
          {(index === i) && (
            <div key={i}>
              <div className={`animate-in fade-in-20 zoom-in ${compact ? 'text-xl md:text-3xl lg:text-4xl' : 'text-3xl lg:text-6xl'} ${item.color} opacity-90 font-mono font-bold`}>
                {item.name}
              </div>
              <div className={`animate-in text-black fade-in-20 opacity-50 hover:opacity-80 ${compact ? 'mt-1 text-sm md:text-base' : 'mt-3'}`}>
                {item.description}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
