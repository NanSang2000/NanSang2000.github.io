// CommonJS版本的articleManager模块
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// 加载.env.local文件中的环境变量
try {
  dotenv.config({ path: '.env.local' });
  console.log('已加载.env.local环境变量');
} catch (error) {
  console.warn('无法加载.env.local文件:', error.message);
}

// 使用与Visitor组件相同的Supabase配置
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'lptqykocinwlojjzfqhy';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwdHF5a29jaW53bG9qanpmcWh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDYxMjUsImV4cCI6MjA1NjMyMjEyNX0.GrsnEE1IQz8_4ZkjbkYMJSVm_Cu2fFi42RJQ9g41lSc';

// 构建Supabase URL
const supabaseUrl = `https://${SUPABASE_URL}.supabase.co`;
const supabaseKey = String(SUPABASE_KEY);

console.log(`Supabase配置: URL=${supabaseUrl}`);

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 将文件系统中的Markdown文件导入到数据库
 * @param {string} category 文章分类
 * @param {string} slug 文章标识符
 * @param {string} title 文章标题
 * @param {string} content Markdown内容
 * @param {Object} metadata 额外元数据
 * @returns {Promise<Object>} 导入的文章对象
 */
async function importMarkdownToDatabase(category, slug, title, content, metadata = {}) {
  const article = {
    slug,
    title,
    content,
    category,
    metadata
  };
  
  return await saveArticle(article);
}

/**
 * 创建或更新文章
 * @param {Object} article 文章对象
 * @returns {Promise<Object>} 保存的文章对象
 */
async function saveArticle(article) {
  try {
    const now = new Date().toISOString();
    const updatedArticle = {
      ...article,
      updated_at: now,
      created_at: article.created_at || now
    };
    
    // 检查文章是否已存在
    const { data: existingArticles, error: selectError } = await supabase
      .from('articles')
      .select('id')
      .eq('slug', article.slug)
      .limit(1);
    
    if (selectError) {
      console.error(`查询文章 ${article.slug} 失败:`, selectError.message);
      throw new Error(selectError.message);
    }
    
    // 获取第一个匹配的文章（如果存在）
    const existingArticle = existingArticles && existingArticles.length > 0 ? existingArticles[0] : null;
    
    let result;
    
    if (existingArticle) {
      // 更新现有文章
      console.log(`更新文章: ${article.slug}`);
      const { data, error } = await supabase
        .from('articles')
        .update(updatedArticle)
        .eq('id', existingArticle.id)
        .select()
        .single();
      
      if (error) {
        console.error(`更新文章 ${article.slug} 失败:`, error.message);
        throw new Error(error.message);
      }
      
      result = data;
    } else {
      // 创建新文章
      console.log(`创建新文章: ${article.slug}`);
      const { data, error } = await supabase
        .from('articles')
        .insert([updatedArticle])
        .select()
        .single();
      
      if (error) {
        console.error(`创建文章 ${article.slug} 失败:`, error.message);
        throw new Error(error.message);
      }
      
      if (!data) {
        throw new Error(`创建文章 ${article.slug} 失败: 未返回数据`);
      }
      
      result = data;
    }
    
    return result;
  } catch (error) {
    console.error(`保存文章 ${article.slug} 时发生错误:`, error.message);
    throw error;
  }
}

module.exports = {
  importMarkdownToDatabase
};