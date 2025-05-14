import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import globalTranslations from '../../utils/translations'

type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'zh',
  setLanguage: () => {},
  t: () => ''
})

export const useLanguage = (): LanguageContextType => useContext(LanguageContext)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }): JSX.Element => {
  const router = useRouter()
  console.log('=', router)
  const [language, setLanguageState] = useState<Language>((router.locale as Language) !== undefined ? (router.locale as Language) : 'zh')

  useEffect(() => {
    // 从本地存储中获取语言设置，如果没有则使用默认值
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage !== null && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage)
      // 如果本地存储的语言与当前路由的语言不同，则更新路由
      if (savedLanguage !== router.locale) {
        const { pathname, asPath, query } = router
        void router.push({ pathname, query }, asPath, { locale: savedLanguage, shallow: true })
      }
    }
  }, [router])

  // 当路由的locale变化时，同步更新语言状态
  useEffect(() => {
    if (router.locale !== undefined && router.locale !== '' && (router.locale === 'zh' || router.locale === 'en')) {
      setLanguageState(router.locale as Language)
      localStorage.setItem('language', router.locale)
    }
  }, [router.locale])

  const setLanguage = (newLanguage: Language): void => {
    setLanguageState(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // 翻译函数
  const t = (key: string): string => {
    if (globalTranslations[language]?.[key] !== undefined && globalTranslations[language]?.[key] !== '') {
      return globalTranslations[language][key]
    }
    if (globalTranslations.en?.[key] !== undefined && globalTranslations.en?.[key] !== '') {
      return globalTranslations.en[key]
    }
    return key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext