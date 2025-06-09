'use client'

import React, { useState, useEffect } from 'react'

interface Project {
  name: string
  description: string
  color: string
}

const Projects: Project[] = [
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

export default function TextTurn (): JSX.Element {
  const [index, setIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const intervalId = setInterval(() => {
      setIndex((index) => (Number(index) + 1) % Projects.length)
    }, INTERVAL)
    return () => { clearInterval(intervalId) }
  }, [])

  // 如果不是客户端，显示第一个项目避免hydration mismatch
  if (!isClient) {
    const firstProject = Projects[0]
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

  return (
    <div className="flex items-start justify-start w-max text-start">
        {
          Projects.map((item, i) => (
            <div
              key={i}
              className={'flex flex-col items-start justify-start text-start'}
            >
              {(index === i) && (
                <div key={i}>
                  <div className={`animate-in fade-in-20 zoom-in text-3xl lg:text-6xl ${item.color} opacity-90 font-mono font-bold`}>
                    {item.name}
                  </div>
                  <div className={'animate-in text-black fade-in-20 opacity-30 hover:opacity-60 mt-3'}>
                    {item.description}
                  </div>
                </div>
              )}
            </div>
          ))
        }
    </div>
  )
}
