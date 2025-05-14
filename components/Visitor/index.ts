import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'lptqykocinwlojjzfqhy'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

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
  ip: string | null
}

function Visitors (): VisitorResult {
  const [visitorCount, setVisitorCount] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [ipAddress, setIpAddress] = useState<string | null>(null)

  // 获取访问者IP地址的函数
  const getVisitorIp = async (): Promise<string> => {
    try {
      // 使用公共API获取IP地址
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      console.log('获取到的IP地址:', data.ip)
      return data.ip
    } catch (err) {
      console.error('获取IP地址失败:', err)
      return 'Unknown'
    }
  }

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

        // 获取最后一条访问记录
        const { data: lastVisitorRecord, error: fetchError } = await supabase
          .from('visitor')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)

        if (fetchError !== null) {
          throw new Error(`获取访问记录失败: ${fetchError.message}`)
        }

        // 获取访问者IP地址
        const ip = await getVisitorIp()
        setIpAddress(ip)

        // 检查是否需要更新计数
        const shouldCount = await checkShouldCount()
        
        if (shouldCount) {
          // 计算新的访问计数
          const currentCount = (lastVisitorRecord !== null && lastVisitorRecord.length > 0) 
            ? Number(lastVisitorRecord[0].count) + 1 
            : 1
          
          // 插入新的访问记录
          const { error: insertError } = await supabase
            .from('visitor')
            .insert([{ count: currentCount, ip, created_at: new Date().toISOString() }])
            .select('count')
            .single()

          if (insertError !== null) {
            throw new Error(`创建新访问记录失败: ${insertError.message}`)
          }

          // 更新本地存储
          if (typeof window !== 'undefined') {
            localStorage.setItem(VISITOR_COUNT_KEY, Date.now().toString())
          }
          
          setVisitorCount(currentCount)
        } else if (lastVisitorRecord !== null && lastVisitorRecord.length > 0) {
          // 如果不需要更新计数，使用最后一条记录的计数
          setVisitorCount(Number(lastVisitorRecord[0].count))
        } else {
          // 如果没有记录且不需要更新，设置为0
          setVisitorCount(0)
        }
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
      if (lastCounted === null || lastCounted === '') return true

      const lastCountedTime = parseInt(lastCounted, 10)
      return isNaN(lastCountedTime) ? true : Date.now() - lastCountedTime >= COUNT_EXPIRY
    }

    void fetchAndUpdateVisitors()
  }, [])

  return { count: visitorCount, loading, error, ip: ipAddress }
}

export default Visitors
