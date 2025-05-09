// 导入文件系统模块
const fs = require('fs');
const path = require('path');

// 导入文章管理器
// 注意：由于这是一个Node.js脚本，我们需要使用require而不是import
// 实际运行时需要使用babel或ts-node来支持ES模块语法
const { importMarkdownToDatabase } = require('../utils/articleManager');

// 定义要处理的目录
const CONTENT_DIRS = [
  { path: '../pages/CodeSnippets', category: 'CodeSnippets' },
  { path: '../pages/note', category: 'note' },
  { path: '../pages/projects', category: 'projects' },
  { path: '../pages/CurriculumVitae', category: 'CurriculumVitae' }
];

// 排除的文件
const EXCLUDED_FILES = ['_meta.json', 'index.mdx'];

/**
 * 从文件内容中提取标题
 * @param {string} content Markdown内容
 * @returns {string} 提取的标题
 */
function extractTitle(content) {
  // 查找第一个标题行 (# 标题)
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  }
  return '未命名文章';
}

/**
 * 从_meta.json文件中获取元数据
 * @param {string} dirPath 目录路径
 * @returns {Object|null} 元数据对象
 */
function getMetadata(dirPath) {
  const metaPath = path.join(dirPath, '_meta.json');
  if (fs.existsSync(metaPath)) {
    try {
      const metaContent = fs.readFileSync(metaPath, 'utf8');
      return JSON.parse(metaContent);
    } catch (error) {
      console.error(`读取元数据文件失败: ${metaPath}`, error);
    }
  }
  return null;
}

/**
 * 处理单个Markdown文件
 * @param {string} filePath 文件路径
 * @param {string} category 分类
 * @param {Object} metadata 元数据
 */
async function processMarkdownFile(filePath, category, metadata) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.mdx?$/, ''); // 移除.md或.mdx扩展名
    
    // 从内容中提取标题
    const title = extractTitle(content);
    
    // 从元数据中获取该文章的额外信息
    const articleMeta = metadata && metadata[slug] ? { 
      description: typeof metadata[slug] === 'string' ? metadata[slug] : null
    } : {};
    
    console.log(`正在导入: ${category}/${slug} - ${title}`);
    
    // 导入到数据库
    await importMarkdownToDatabase(category, slug, title, content, articleMeta);
    
    console.log(`导入成功: ${slug}`);
  } catch (error) {
    console.error(`处理文件失败: ${filePath}`, error);
  }
}

/**
 * 处理目录中的所有Markdown文件
 * @param {string} dirPath 目录路径
 * @param {string} category 分类
 */
async function processDirectory(dirPath, category) {
  try {
    const absolutePath = path.resolve(__dirname, dirPath);
    if (!fs.existsSync(absolutePath)) {
      console.warn(`目录不存在: ${absolutePath}`);
      return;
    }
    
    console.log(`处理目录: ${category} (${absolutePath})`);
    
    // 获取目录元数据
    const metadata = getMetadata(absolutePath);
    
    // 读取目录中的所有文件
    const files = fs.readdirSync(absolutePath);
    
    for (const file of files) {
      // 跳过排除的文件
      if (EXCLUDED_FILES.includes(file)) continue;
      
      const filePath = path.join(absolutePath, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
        await processMarkdownFile(filePath, category, metadata);
      }
    }
  } catch (error) {
    console.error(`处理目录失败: ${dirPath}`, error);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('开始导入Markdown文件到数据库...');
  
  for (const dir of CONTENT_DIRS) {
    await processDirectory(dir.path, dir.category);
  }
  
  console.log('导入完成!');
}

// 执行主函数
main().catch(error => {
  console.error('导入过程中发生错误:', error);
  process.exit(1);
});