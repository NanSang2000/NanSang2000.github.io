import React, { useState, useEffect } from 'react'
import { useLanguage } from '../LanguageContext'

interface Project {
  name: string | { zh: string, en: string }
  description: string | { zh: string, en: string }
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

const INTERVAL = 5000 // 增加切换间隔，减少动画频率

interface TextTurnProps {
  texts?: string[] // 添加可选的texts属性，用于接收字符串数组
}

export default function TextTurn ({ texts }: TextTurnProps = {}): JSX.Element {
  const [index, setIndex] = useState(0)
  const { language } = useLanguage()
  
  // 如果传入了texts数组，则使用texts，否则使用默认的Projects
  const items = (texts !== undefined)
    ? texts.map(text => ({ name: text, description: '', color: 'text-blue-500' }))
    : Projects

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((currentIndex) => (Number(currentIndex) + 1) % items.length)
    }, INTERVAL)
    return () => { clearInterval(intervalId) }
  }, [items.length])

  return (
    <div className="flex items-start justify-start w-max text-start">
        {
          items.map((item, i) => (
            <div
              key={`project-container-${i}`}
              className={'flex flex-col items-start justify-start text-start'}
            >
              {(index === i) && (
                <div key={`project-content-${i}`}>
                  <div className={`animate-in fade-in-10 duration-300 text-3xl lg:text-6xl ${item.color} opacity-90 font-mono font-bold`}>
                    {typeof item.name === 'object'
                      ? ((item.name[language] && item.name[language] !== '') ? item.name[language] : ((item.name.en && item.name.en !== '') ? item.name.en : ((Object.values(item.name)[0] && Object.values(item.name)[0] !== '') ? Object.values(item.name)[0] : '')))
                      : item.name}
                  </div>
                  {((typeof item.description === 'string' && item.description !== '') || (typeof item.description === 'object' && item.description !== null)) && (
                    <div className={'animate-in fade-in-10 duration-300 text-black opacity-30 hover:opacity-60 mt-3'}>
                      {typeof item.description === 'object'
                        ? ((item.description[language] && item.description[language] !== '') ? item.description[language] : ((item.description.en && item.description.en !== '') ? item.description.en : ((Object.values(item.description)[0] && Object.values(item.description)[0] !== '') ? Object.values(item.description)[0] : '')))
                        : (item.description || '')}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        }
    </div>
  )
}
