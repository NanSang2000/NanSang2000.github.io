'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// 确保环境变量存在，如果不存在则使用硬编码的值（仅用于生产环境）
// 构建Supabase URL
// 确保URL格式正确，避免undefined.supabase.co的问题
const getSupabaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  // 如果已经是完整的 URL，直接返回
  if (envUrl.startsWith('https://')) {
    return envUrl
  }
  // 如果是项目 ID，构建完整的 URL
  if (envUrl && envUrl.length > 0) {
    return `https://${envUrl}.supabase.co`
  }
  return ''
}

const supabaseUrl = getSupabaseUrl()
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || ''

// 记录环境变量状态
console.log(`Supabase 配置状态: URL=${process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined && process.env.NEXT_PUBLIC_SUPABASE_URL !== '' ? '已设置' : '未设置'}, KEY=${process.env.NEXT_PUBLIC_SUPABASE_KEY !== undefined && process.env.NEXT_PUBLIC_SUPABASE_KEY !== '' ? '已设置' : '未设置'}`)

// 检查环境变量是否正确设置
const hasValidConfig = supabaseUrl && supabaseKey && supabaseUrl.startsWith('https://')
if (!hasValidConfig) {
  console.error('Supabase 环境变量未正确设置，访问统计功能将被禁用')
}

// 只有在有效配置时才创建 Supabase 客户端
const supabase = hasValidConfig ? createClient(supabaseUrl, supabaseKey) : null

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
      if (!supabase || !hasValidConfig) {
        setError('Supabase配置无效，访问统计功能已禁用')
        setLoading(false)
        setVisitorCount(0)
        return
      }

      try {
        setLoading(true)
        setError(null)

        // 获取当前访问计数
        const { data: visitorDataArray, error: fetchError } = await supabase
          .from('visitor')
          .select('count')
          .eq('id', 1)
          .limit(1)

        if (fetchError !== null) {
          throw new Error(`获取访问计数失败: ${fetchError.message}`)
        }

        // 处理可能的空结果或多结果情况
        const visitorData = visitorDataArray !== null && visitorDataArray !== undefined && visitorDataArray.length > 0 ? visitorDataArray[0] : null

        // 获取访问者IP地址
        const ip = await getVisitorIp()
        setIpAddress(ip)

        // 如果记录不存在，创建初始记录
        if (visitorData === null) {
          const { data: insertData, error: insertError } = await supabase
            .from('visitor')
            .insert([{ id: 1, count: 1, ip }])
            .select('count, ip')
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
            .update({ count: newCount, ip })
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

  return { count: visitorCount, loading, error, ip: ipAddress }
}

export default Visitors
