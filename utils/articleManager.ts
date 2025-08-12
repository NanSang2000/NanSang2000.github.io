import { createClient } from '@supabase/supabase-js'

// Supabase 配置 - 硬编码作为 fallback
const SUPABASE_PROJECT_ID = 'lptqykocinwlojjzfqhy'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc'

// 构建 Supabase URL
const getSupabaseUrl = (): string => {
  // 在GitHub Pages部署后，直接使用硬编码的项目ID
  return `https://${SUPABASE_PROJECT_ID}.supabase.co`
}

// 获取 Supabase key
const getSupabaseKey = (): string => {
  return SUPABASE_ANON_KEY
}

const supabaseUrl = getSupabaseUrl()
const supabaseKey = getSupabaseKey()

console.log('ArticleManager Supabase 配置:', {
  url: supabaseUrl,
  keySet: supabaseKey ? '✅ 已设置' : '❌ 未设置',
  projectId: SUPABASE_PROJECT_ID,
  keyLength: supabaseKey?.length || 0
})

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey)

// 文章接口定义
export interface Article {
  id?: number
  slug: string // 文章的唯一标识符，如'react-router'
  title: string // 文章标题
  content: string // Markdown内容
  category: string // 分类，如'CodeSnippets'
  created_at?: string // 创建时间
  updated_at?: string // 更新时间
  metadata?: Record<string, any> // 额外元数据，如标签、描述等
}

/**
 * 获取所有文章
 * @param category 可选的分类筛选
 * @returns 文章数组
 */
export async function getAllArticles(category?: string): Promise<Article[]> {
  let query = supabase.from('articles').select('*')
  
  if (category) {
    query = query.eq('category', category)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error('获取文章失败:', error.message)
    throw new Error(error.message)
  }
  
  return (data || []) as Article[]
}

/**
 * 根据slug获取单篇文章
 * @param slug 文章的唯一标识符
 * @returns 文章对象或null
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()
  
  if (error) {
    console.error(`获取文章 ${slug} 失败:`, error.message)
    throw new Error(error.message)
  }
  
  return data as (Article | null)
}

/**
 * 创建或更新文章
 * @param article 文章对象
 * @returns 保存的文章对象
 */
export async function saveArticle(article: Article): Promise<Article> {
  const now = new Date().toISOString()
  const updatedArticle = {
    ...article,
    updated_at: now,
    created_at: article.created_at || now
  }
  
  // 检查文章是否已存在
  const { data: existingArticle } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', article.slug)
    .maybeSingle()
  
  let result
  
  if (existingArticle) {
    // 更新现有文章
    const { data, error } = await supabase
      .from('articles')
      .update(updatedArticle)
      .eq('id', existingArticle.id)
      .select()
      .single()
    
    if (error) {
      console.error(`更新文章 ${article.slug} 失败:`, error.message)
      throw new Error(error.message)
    }
    
    result = data
  } else {
    // 创建新文章
    const { data, error } = await supabase
      .from('articles')
      .insert([updatedArticle])
      .select()
      .single()
    
    if (error) {
      console.error(`创建文章 ${article.slug} 失败:`, error.message)
      throw new Error(error.message)
    }
    
    result = data
  }
  
  return result
}

/**
 * 删除文章
 * @param slug 文章的唯一标识符
 * @returns 是否删除成功
 */
export async function deleteArticle(slug: string): Promise<boolean> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('slug', slug)
  
  if (error) {
    console.error(`删除文章 ${slug} 失败:`, error.message)
    throw new Error(error.message)
  }
  
  return true
}

/**
 * 将文件系统中的Markdown文件导入到数据库
 * @param category 文章分类
 * @param slug 文章标识符
 * @param title 文章标题
 * @param content Markdown内容
 * @param metadata 额外元数据
 * @returns 导入的文章对象
 */
export async function importMarkdownToDatabase(
  category: string,
  slug: string,
  title: string,
  content: string,
  metadata?: Record<string, any>
): Promise<Article> {
  const article: Article = {
    slug,
    title,
    content,
    category,
    metadata
  }
  
  return await saveArticle(article)
}