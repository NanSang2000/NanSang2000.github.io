import React from 'react'
import { useLanguage } from '../LanguageContext'
import { useRouter } from 'next/router'

const LanguageSwitcher: React.FC = (): JSX.Element => {
  const { language, setLanguage, t } = useLanguage()
  const router = useRouter()

  const toggleLanguage = (): void => {
    const newLanguage = language === 'zh' ? 'en' : 'zh'
    setLanguage(newLanguage)

    // 同时更新 Next.js 的 locale
    const { pathname, asPath, query } = router
    void router.push({ pathname, query }, asPath, { locale: newLanguage })
  }

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md text-sm font-medium transition-colors
                 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
                 text-gray-800 dark:text-gray-200"
      aria-label={t('language.switch')}
    >
      {language === 'zh' ? 'EN' : '中文'}
    </button>
  )
}

export default LanguageSwitcher
