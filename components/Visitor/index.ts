import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 确保环境变量存在，如果不存在则使用硬编码的值（仅用于生产环境）
const SUPABASE_URL = 'lptqykocinwlojjzfqhy'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

// 构建Supabase URL
// 确保URL格式正确，避免undefined.supabase.co的问题
const supabaseUrl = `https://${SUPABASE_URL}.supabase.co`
const supabaseKey = SUPABASE_KEY

// 记录环境变量状态
console.log(`Supabase 配置状态: URL=${process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined && process.env.NEXT_PUBLIC_SUPABASE_URL !== '' ? '已设置' : '未设置'}, KEY=${process.env.NEXT_PUBLIC_SUPABASE_KEY !== undefined && process.env.NEXT_PUBLIC_SUPABASE_KEY !== '' ? '已设置' : '未设置'}`)

// 检查环境变量是否正确设置
if ((typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== 'string' || process.env.NEXT_PUBLIC_SUPABASE_URL === '') || (typeof process.env.NEXT_PUBLIC_SUPABASE_KEY !== 'string' || process.env.NEXT_PUBLIC_SUPABASE_KEY === '')) {
  console.error('Supabase 环境变量未正确设置，使用了硬编码的备用值')
}
const supabase = createClient(supabaseUrl, supabaseKey)

// 访问计数的本地存储键名和有效期配置
const VISITOR_COUNT_KEY = 'visitor_counted'
const COUNT_EXPIRY = 24 * 60 * 60 * 1000 // 24小时

interface VisitorResult {
  count: number
  loading: boolean
  error: string | null
}

function Visitors (): VisitorResult {
  const [visitorCount, setVisitorCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndUpdateVisitors = async (): Promise<void> => {
      if (supabaseUrl === undefined || supabaseUrl === '') {
        setError('Supabase配置无效')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // 获取当前访问计数
        const { data: visitorData, error: fetchError } = await supabase
          .from('visitor')
          .select('count')
          .eq('id', 1)
          .maybeSingle()

        if (fetchError !== null) {
          throw new Error(`获取访问计数失败: ${fetchError.message}`)
        }

        // 如果记录不存在，创建初始记录
        if (visitorData === null) {
          const { data: insertData, error: insertError } = await supabase
            .from('visitor')
            .insert([{ id: 1, count: 0 }])
            .select('count')
            .single()

          if (insertError !== null) {
            throw new Error(`创建访问计数记录失败: ${insertError.message}`)
          }

          const count = insertData?.count ?? 0
          setVisitorCount(count)
          setLoading(false)
          return
        }

        // 检查是否需要更新计数
        const shouldCount = await checkShouldCount()
        let newCount = visitorData.count

        if (shouldCount) {
          newCount = Number(newCount) + 1
          const { error: updateError } = await supabase
            .from('visitor')
            .update({ count: newCount })
            .eq('id', 1)

          if (updateError !== null) {
            throw new Error(`更新访问计数失败: ${updateError.message}`)
          }

          // 更新本地存储
          if (typeof window !== 'undefined') {
            localStorage.setItem(VISITOR_COUNT_KEY, Date.now().toString())
          }
        }

        setVisitorCount(newCount)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '访问计数出错'
        console.error(errorMessage)
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    const checkShouldCount = async (): Promise<boolean> => {
      if (typeof window === 'undefined') return true

      const lastCounted = localStorage.getItem(VISITOR_COUNT_KEY)
      if (lastCounted === null) return true

      const lastCountedTime = parseInt(lastCounted, 10)
      return Date.now() - lastCountedTime >= COUNT_EXPIRY
    }

    void fetchAndUpdateVisitors()
  }, [])

  return { count: visitorCount, loading, error }
}

export default Visitors
