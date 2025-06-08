'use client'

import React, { useEffect, useState } from 'react'
import { type TypeLark } from '../../types'
import dynamic from 'next/dynamic'
import { FiArrowLeft, FiArrowRight, FiFileText, FiList, FiLayout, FiMap } from 'react-icons/fi'
import Link from 'next/link'

// 动态导入Lottie组件，禁用SSR
const Lottie = dynamic(async () => await import('lottie-react'), { ssr: false })

const LarkDocType = ({ type }: { type: string }): JSX.Element => {
  const Icon = (type): JSX.Element => {
    type = type.type
    if (type === 'docx') {
      return (
          <div className={'flex h-max justify-center items-center gap-1 text-sm'}>
            <FiFileText /> 文档
          </div>
      )
    } else if (type === 'mindnote') {
      return (
        <div className={'flex h-max justify-center items-center gap-1 text-sm'}>
          <FiList /> 思维导图
        </div>
      )
    } else if (type === 'sheet') {
      return (
        <div className={'flex h-max justify-center items-center gap-1 text-sm'}>
          <FiLayout /> 表格
        </div>
      )
    } else if (type === 'bitable') {
      return (
        <div className={'flex h-max justify-center items-center gap-1 text-sm'}>
          <FiMap /> 多维表格
        </div>
      )
    } else {
      return (
        <div className={'flex h-max justify-center items-center gap-1 text-sm'}>
          <FiList /> 其他
        </div>
      )
    }
  }
  return (
        <div>
          <Icon type={type} />
        </div>
  )
}

export default function LarkList (): JSX.Element {
  const [fetched, setFetched] = useState(false)
  const [posts, setPosts] = useState<TypeLark[]>([])
  const [postsGroup, setPostsGroup] = useState<TypeLark[][]>([])
  const [nowPage, setNowPage] = useState(0)
  const [animationData, setAnimationData] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    // 动态导入动画数据
    void import('../../public/activity.json').then((data) => {
      setAnimationData(data.default)
    }).catch((error) => {
      console.warn('Failed to load animation data:', error)
    })
  }, [])

  useEffect(() => {
    void fetch('/CurriculumVitae').then(async (res) => await res.json()).then((data) => {
      setPosts(data.items.reverse())
      setFetched(true)
    }).catch((error) => {
      console.warn('Failed to fetch curriculum vitae data:', error)
      setFetched(true)
    })
  }, [])

  useEffect(() => {
    // 将 posts 分为 5 条一组，分散到一个数组中
    const group: TypeLark[][] = []
    for (let i = 0; i < posts.length; i += 5) {
      group.push(posts.slice(i, i + 5))
    }
    setPostsGroup(group)
  }, [posts])

  return (
    <div className={'w-full'}>
      {fetched === false && (
        <div className={'w-full flex items-center justify-center'}>
          {(isClient === true && animationData != null && typeof Lottie !== 'undefined')
            ? (
            <Lottie
              className={'bg-gray-100 dark:bg-gray-600 opacity-40 dark:opacity-25 rounded-full p-2 flex items-center justify-center'}
              animationData={animationData}
            />
              )
            : (
            <div className={'bg-gray-100 dark:bg-gray-600 opacity-40 dark:opacity-25 rounded-full p-8 flex items-center justify-center'}>
              <div className={'animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100'}></div>
            </div>
              )}
        </div>
      )}
      <div className={'w-full'}>
        <div className={'w-full lg:px-96'}>
          {
            postsGroup[nowPage]?.map((post, index) => {
              return (
                <Link
                  // eslint-disable-next-line
                  href={`https://x0v86ddnier.feishu.cn/wiki/${post.node_token}`}
                  target={'_blank'}
                  key={index}
                  className={'w-full'}
                >
                  <h1
                    className={'pt-5 text-2xl font-sans lg:text-2xl h-max font-bold w-full truncate cursor-pointer hover:opacity-60 transition-all ease-in-out duration-700'}
                    // style={{ textUnderlineOffset: '6px' }}
                  >
                    {post.title}
                  </h1>
                  <div className={'flex justify-start items-center h-max my-2'}>
                    <div className={'mr-2 h-max w-max bg-gray-200 dark:bg-gray-800 opacity-70 py-1 px-1 rounded'}>
                      <LarkDocType type={post.obj_type} />
                    </div>
                    <div className={'text-gray-500 nx-font-mono'}>
                      {new Date(Number(post.node_create_time) * 1000).toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                    </div>
                  </div>
                </Link>
              )
            })
          }
        </div>
        <div className={'w-full flex items-center justify-center lg:px-96'}>
          <div className={'w-full flex items-center justify-end gap-2'}>
            <button
              className={`w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-all ease duration-700 cursor-pointer ${nowPage === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (nowPage > 0) {
                  setNowPage(nowPage - 1)
                  if (typeof window !== 'undefined') {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })
                  }
                }
              }}
            >
              <FiArrowLeft/>
            </button>
            <div>
              {/* eslint-disable-next-line */}
              {nowPage + 1} / {postsGroup.length || 1}
            </div>
            <button
              className={`w-8 h-8 flex items-center justify-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-all ease duration-700 cursor-pointer ${nowPage === postsGroup.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => {
                if (nowPage < postsGroup.length - 1) {
                  // eslint-disable-next-line
                  setNowPage(nowPage + 1)
                  if (typeof window !== 'undefined') {
                    window.scrollTo({
                      top: 0,
                      behavior: 'smooth'
                    })
                  }
                }
              }}
            >
              <FiArrowRight/>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
