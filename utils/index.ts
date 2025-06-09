export { default as getGitHubStates } from './getGitHubStates'
export { default as useFollowPointer } from './useFollowPointer'
export { default as vestor } from './vestor'
export { default as getGitHubRepoStar } from './getGitHubRepoStar'
export { default as generateContext } from './generateContext'

// 移动端检测和优化工具
export const isMobileDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  
  try {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768 ||
           'ontouchstart' in window ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
  } catch (error) {
    console.warn('isMobileDevice detection error:', error)
    return false
  }
}

export const getDeviceType = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return 'desktop'
  
  try {
    const userAgent = navigator.userAgent
    const screenWidth = window.screen?.width || window.innerWidth || 1920
    
    if (/iPad/i.test(userAgent)) return 'tablet'
    if (/iPhone|iPod/i.test(userAgent)) return 'mobile'
    if (/Android/i.test(userAgent)) {
      return screenWidth < 768 ? 'mobile' : 'tablet'
    }
    if (screenWidth < 768) return 'mobile'
    if (screenWidth < 1024) return 'tablet'
    
    return 'desktop'
  } catch (error) {
    console.warn('getDeviceType detection error:', error)
    return 'desktop'
  }
}

export const isLowEndDevice = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false
  
  try {
    const nav = navigator as any // 临时类型断言以使用新的Web API
    
    const checks = [
      navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2,
      nav.deviceMemory && nav.deviceMemory <= 2,
      isMobileDevice(),
      window.devicePixelRatio && window.devicePixelRatio <= 1,
      nav.connection && nav.connection.effectiveType && ['slow-2g', '2g', '3g'].includes(nav.connection.effectiveType)
    ]
    
    return checks.filter(Boolean).length >= 2
  } catch (error) {
    console.warn('isLowEndDevice detection error:', error)
    return false
  }
}

export const optimizeForMobile = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined' || typeof navigator === 'undefined') return
  
  try {
    // 禁用iOS Safari的缩放
    const viewport = document.querySelector('meta[name=viewport]')
    if (viewport && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no')
    }
    
    // 添加触摸优化类
    if (document.body) {
      document.body.classList.add('mobile-optimized')
      
      // 优化滚动性能
      const bodyStyle = document.body.style as any
      bodyStyle.webkitOverflowScrolling = 'touch'
    }
  } catch (error) {
    console.warn('optimizeForMobile error:', error)
  }
}

// 防抖函数，用于优化性能
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>): void => {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    
    const callNow = immediate && !timeout
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    
    if (callNow) func(...args)
  }
}

// 节流函数，用于优化性能
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
