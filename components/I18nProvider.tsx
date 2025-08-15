'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'zh' | 'en'

interface I18nContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const DICT: Record<string, { zh: string, en: string }> = {
  running: { zh: '运行中', en: 'Running' },
  get_started: { zh: '开始使用', en: 'Get Started' },
  hero_iam: { zh: '我是', en: "I'm" },
  hero_name: { zh: '桑楠', en: 'Nan Sang' },
  hero_sub: { zh: '一个不断学习并且探索世界边界的人', en: 'An energetic learner who is exploring the boundaries of the world' },
  about: { zh: '关于我', en: 'About me' },
  blog: { zh: '博客', en: 'Blog' },
  notes: { zh: '笔记', en: 'Notes' },
  cv: { zh: '简历', en: 'Curriculum Vitae' },
  tech_stack: { zh: '技术栈', en: 'Tech Stack' },
  contact: { zh: '联系我', en: 'Contact' },
  projects: { zh: '项目', en: 'Projects' },
  dream: { zh: '追逐云端的梦', en: 'Dream in the sky' },
  github_username: { zh: '桑楠', en: 'Nan Sang' },
  project_more: { zh: '更多项目', en: 'More projects' }
}

export const I18nProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [lang, setLangState] = useState<Language>('zh')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem('lang') as Language | null
    if (saved === 'zh' || saved === 'en') {
      setLangState(saved)
    } else {
      // 简单的首选语言推断
      const browserLang = navigator.language?.toLowerCase()
      if (browserLang.startsWith('zh')) setLangState('zh')
      else setLangState('en')
    }
  }, [])

  const setLang = (l: Language) => {
    setLangState(l)
    if (typeof window !== 'undefined') window.localStorage.setItem('lang', l)
  }

  const t = (key: string) => {
    const item = DICT[key]
    if (!item) return key
    return item[lang] || key
  }

  const value = useMemo(() => ({ lang, setLang, t }), [lang])
  
  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  )
}

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}

export const T = ({ k }: { k: string }): JSX.Element => {
  const { t } = useI18n()
  return <>{t(k)}</>
}

export const LangToggle = (): JSX.Element => {
  const { lang, setLang } = useI18n()
  return (
    <button
      onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
      className={'px-3 py-1 rounded-full text-xs md:text-sm bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors'}
      aria-label={lang === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      {lang === 'zh' ? '中文/English' : 'English/中文'}
    </button>
  )
}