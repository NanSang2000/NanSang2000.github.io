// Supabase 配置常量
export const SUPABASE_PROJECT_ID = 'lptqykocinwlojjzfqhy'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

/**
 * 获取 Supabase URL
 * 在GitHub Pages部署后，直接使用硬编码的项目ID
 */
export const getSupabaseUrl = (): string => {
  return `https://${SUPABASE_PROJECT_ID}.supabase.co`
}

/**
 * 获取 Supabase Anon Key
 * 在GitHub Pages部署后，直接使用硬编码的key
 */
export const getSupabaseKey = (): string => {
  return SUPABASE_ANON_KEY
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
    projectId: SUPABASE_PROJECT_ID,
    keyLength: key?.length || 0
  })
} 