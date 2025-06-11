// Supabase 配置常量
export const SUPABASE_PROJECT_ID = 'lptqykocinwlojjzfqhy'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

/**
 * 获取 Supabase URL
 * 优先使用环境变量，否则使用硬编码的项目 ID
 */
export const getSupabaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  
  // 如果环境变量存在且是完整 URL
  if (envUrl && envUrl.startsWith('https://')) {
    return envUrl
  }
  
  // 如果环境变量存在且是项目 ID
  if (envUrl && envUrl.length > 0 && !envUrl.startsWith('https://')) {
    return `https://${envUrl}.supabase.co`
  }
  
  // 否则使用硬编码的项目 ID
  return `https://${SUPABASE_PROJECT_ID}.supabase.co`
}

/**
 * 获取 Supabase Anon Key
 * 优先使用环境变量，否则使用硬编码的 key
 */
export const getSupabaseKey = (): string => {
  return process.env.NEXT_PUBLIC_SUPABASE_KEY || SUPABASE_ANON_KEY
}

/**
 * 记录 Supabase 配置状态
 */
export const logSupabaseConfig = (component: string): void => {
  const url = getSupabaseUrl()
  const key = getSupabaseKey()
  
  console.log(`${component} Supabase 配置:`, {
    url,
    keySet: key ? '✅ 已设置' : '❌ 未设置',
    envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ 环境变量存在' : '❌ 使用硬编码',
    envKey: process.env.NEXT_PUBLIC_SUPABASE_KEY ? '✅ 环境变量存在' : '❌ 使用硬编码'
  })
} 