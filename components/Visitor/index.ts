import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 确保环境变量存在，如果不存在则使用硬编码的值（仅用于生产环境）
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined && process.env.NEXT_PUBLIC_SUPABASE_URL !== '' ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'lptqykocinwlojjzfqhy'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY !== undefined && process.env.NEXT_PUBLIC_SUPABASE_KEY !== '' ? process.env.NEXT_PUBLIC_SUPABASE_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

// 构建Supabase URL
// 确保URL格式正确，避免undefined.supabase.co的问题
const supabaseUrl = SUPABASE_URL.includes('https://') ? SUPABASE_URL : (SUPABASE_URL ? `https://${SUPABASE_URL}.supabase.co` : 'https://lptqykocinwlojjzfqhy.supabase.co')
const supabaseKey = String(SUPABASE_KEY)

// 记录环境变量状态
console.log(`Supabase 配置状态: URL=${process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined && process.env.NEXT_PUBLIC_SUPABASE_URL !== '' ? '已设置' : '未设置'}, KEY=${process.env.NEXT_PUBLIC_SUPABASE_KEY !== undefined && process.env.NEXT_PUBLIC_SUPABASE_KEY !== '' ? '已设置' : '未设置'}`)

// 检查环境变量是否正确设置
if ((typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== 'string' || process.env.NEXT_PUBLIC_SUPABASE_URL === '') || (typeof process.env.NEXT_PUBLIC_SUPABASE_KEY !== 'string' || process.env.NEXT_PUBLIC_SUPABASE_KEY === '')) {
  console.error('Supabase 环境变量未正确设置，使用了硬编码的备用值')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 访问计数的本地存储键名
const VISITOR_COUNT_KEY = 'visitor_counted'
// 计数有效期（24小时，单位毫秒）
const COUNT_EXPIRY = 24 * 60 * 60 * 1000

function Visitors (): { count: number } {
  const [visitorCount, setVisitorCount] = useState<number>(0)

  useEffect((): void => {
    const fetchAndUpdateVisitors = async (): Promise<void> => {
      try {
        console.log('正在连接 Supabase...')
        // 获取当前访问计数
        let { data: visitorData, error: fetchError } = await supabase
          .from('visitor')
          .select('count')
          .eq('id', 1)
          .maybeSingle()
        // 如果记录不存在，创建一条初始记录
        if (visitorData === null) {
          const { data: insertData, error: insertError } = await supabase
            .from('visitor')
            .insert([{ id: 1, count: 0 }])
            .select('count')
            .single()

          if (insertError !== null) {
            console.error('创建访问计数记录失败:', insertError.message)
            throw new Error(insertError.message)
          }
          visitorData = insertData
        } else if (fetchError !== null) {
          console.error('获取访问计数失败:', fetchError.message)
          throw new Error(fetchError.message)
        }
        if (fetchError !== null) {
          console.error('获取访问计数失败:', fetchError.message)
          throw new Error(fetchError.message)
        }

        // 检查用户是否已经被计数过
        let shouldCount = true
        if (typeof window !== 'undefined') {
          const lastCounted = localStorage.getItem(VISITOR_COUNT_KEY)
          if (lastCounted !== null) {
            const lastCountedTime = parseInt(lastCounted, 10)
            // 如果上次计数时间在有效期内，不再计数
            if (Date.now() - lastCountedTime < COUNT_EXPIRY) {
              console.log('用户在24小时内已被计数')
              shouldCount = false
            }
          }
        }

        let newCount = visitorData?.count ?? 0

        // 只有在需要计数时才更新数据库
        if (shouldCount) {
          console.log('更新访问计数...')
          newCount = Number(newCount) + 1 // 增加访问计数
          const { error: updateError } = await supabase
            .from('visitor')
            .update({ count: newCount })
            .eq('id', 1)

          if (updateError !== null) {
            console.error('更新访问计数失败:', updateError.message)
            throw new Error(updateError.message)
          }

          // 记录本次计数时间
          if (typeof window !== 'undefined') {
            localStorage.setItem(VISITOR_COUNT_KEY, Date.now().toString())
            console.log('访问计数已更新')
          }
        }

        setVisitorCount(newCount)
      } catch (error) {
        console.error('访问计数出错:', error)
        // 如果发生错误，至少显示获取到的数据
        setVisitorCount(0)
      }
    }

    void fetchAndUpdateVisitors()
  }, [])

  return { count: visitorCount }
}

export default Visitors
