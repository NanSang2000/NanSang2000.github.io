'use client'

import React, { useState } from 'react'
import { type NavItem } from '../../types'

// 卡片，用于展示友链、项目等
export default function Card ({ item }: { item: NavItem }): JSX.Element {
  // 确保link不为空或无效
  const safeLink = item.link || '#'
  const [showTooltip, setShowTooltip] = useState(false)

  const handleClick = () => {
    if (safeLink !== '#' && typeof window !== 'undefined') {
      window.open(safeLink, '_blank', 'noopener,noreferrer')
    }
  }
  
  return (
    <div className="relative">
      <div 
        className={`w-full h-24 my-1 mr-1 bg-gray-100 dark:bg-gray-900 hover:bg-gray-50 hover:dark:bg-gray-800 rounded-md flex ${item.type === 'connection' ? 'flex-row items-center' : 'flex-col'}  py-2 px-3 transition-all ease duration-700 cursor-pointer`}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <div>
          {item.type === 'connection' && (
            <img src={item.avatar} className={'w-16 hidden lg:flex h-16 mr-2 rounded-full opacity-80 cursor-pointer hover:opacity-90 transition-all ease-in-out duration-700'} alt={item.name} />
          )}
        </div>
        <div className={'ml-2'}>
          <div className={'card_title text-base lg:text-xl underline underline-offset-2 decoration-orange-500 decoration-dashed decoration-2 h-min mb-3'}>
            {item.name}
          </div>
          <div
            // 限制文字三排，超出的部分用省略号代替
            className={'text-sm h-2/3 mt-4 overflow-hidden overflow-ellipsis overflow-ellipsis-3 truncate '}
          >
            {item.desc}
          </div>
        </div>
      </div>
      
      {/* 自定义tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10 max-w-xs whitespace-normal">
          {item.desc}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  )
}
