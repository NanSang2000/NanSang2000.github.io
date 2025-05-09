import { useLanguage } from '../components/LanguageContext';
import { useRouter } from 'next/router';
import { TranslationsType } from '../types';
import globalTranslations from './translations';


/**
 * 翻译工具函数，用于在组件中方便地使用翻译功能
 * @param customTranslations 自定义翻译内容，会与通用翻译内容合并
 * @returns 翻译函数和当前语言
 */
export default function useTranslation(customTranslations?: TranslationsType) {
  // 使用语言上下文
  const { language } = useLanguage();
  // 使用路由获取当前locale
  const router = useRouter();
  const locale = (router.locale || 'zh') as 'zh' | 'en';
  
  // 合并全局翻译和自定义翻译
  const mergedTranslations = customTranslations
    ? {
        en: { ...globalTranslations.en, ...customTranslations.en },
        zh: { ...globalTranslations.zh, ...customTranslations.zh },
      }
    : globalTranslations;
  
  // 翻译函数
  const t = (key: string): string => {
    const currentLanguage = language || locale;
    if (!mergedTranslations[currentLanguage]) return key;
    return mergedTranslations[currentLanguage][key] || key;
  };
  
  return {
    t,
    language: language || locale,
  };
}