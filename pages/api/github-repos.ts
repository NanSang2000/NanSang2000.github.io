import { NextApiRequest, NextApiResponse } from 'next'
import { fallbackRepos } from '../../utils/fallbackRepos'

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  language: string | null
  topics: string[]
  created_at: string
  updated_at: string
  pushed_at: string
  fork: boolean
  archived: boolean
  disabled: boolean
  visibility: string
}

interface ProjectRepo {
  id: number
  name: string
  description: string
  html_url: string
  homepage: string | null
  stargazers_count: number
  language: string | null
  topics: string[]
  updated_at: string
  banner: string
}

// GitHub用户名 - 你可以在环境变量中设置
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'NanSang2000'
// GitHub token for authenticated requests (optional but recommended)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 添加详细的环境信息日志
    console.log('GitHub API Debug Info:', {
      username: GITHUB_USERNAME,
      hasToken: !!GITHUB_TOKEN,
      tokenLength: GITHUB_TOKEN?.length || 0,
      nodeEnv: process.env.NODE_ENV
    })

    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website-NanSang2000'
    }

    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`
    }

    // 获取用户的所有公开仓库
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`,
      { 
        headers,
        // 添加超时和错误处理
        signal: AbortSignal.timeout(10000) // 10秒超时
      }
    )

    console.log('GitHub API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API Error Details:', errorText)
      throw new Error(`GitHub API error: ${response.status} - ${errorText}`)
    }

    const repos: GitHubRepo[] = await response.json()

    // 过滤和转换仓库数据
    const projectRepos: ProjectRepo[] = repos
      .filter(repo => 
        !repo.fork && // 排除fork的仓库
        !repo.archived && // 排除已归档的仓库
        !repo.disabled && // 排除被禁用的仓库
        repo.visibility === 'public' && // 只包含公开仓库
        repo.description && // 必须有描述
        repo.name !== GITHUB_USERNAME // 排除与用户名同名的仓库（通常是个人介绍仓库）
      )
      .slice(0, 12) // 限制最多显示12个仓库
      .map(repo => ({
        id: repo.id,
        name: repo.name,
        description: repo.description || '暂无描述',
        html_url: repo.html_url,
        homepage: repo.homepage,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        topics: repo.topics,
        updated_at: repo.updated_at,
        banner: generateBanner(repo)
      }))

    // 添加缓存头
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(200).json(projectRepos)
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    console.log('Using fallback repositories...')
    
    // 使用后备数据确保页面功能正常
    const fallbackProjectRepos: ProjectRepo[] = fallbackRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      description: repo.description || '暂无描述',
      html_url: repo.html_url,
      homepage: repo.homepage,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics,
      updated_at: repo.updated_at,
      banner: repo.banner
    }))
    
    // 添加警告头标识使用了后备数据
    res.setHeader('X-Data-Source', 'fallback')
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300') // 较短缓存
    res.status(200).json(fallbackProjectRepos)
  }
}

// 生成基于 GitHub 数据的动态横幅 URL
function generateBanner(repo: GitHubRepo): string {
  // 使用 GitHub 的 OpenGraph 预览图或动态生成服务
  
  // 方案1: 使用 GitHub 的社交预览图（如果仓库设置了）
  // 很多仓库都有自定义的 OpenGraph 图片
  const githubSocialImage = `https://opengraph.githubassets.com/1/${repo.full_name}`
  
  // 方案2: 使用在线动态横幅生成服务（如 shields.io, readme-stats 等）
  const dynamicBanner = generateDynamicBanner(repo)
  
  // 优先使用动态生成，如果服务不可用则回退到 GitHub 官方图
  return dynamicBanner || githubSocialImage
}

// 动态生成横幅的辅助函数
function generateDynamicBanner(repo: GitHubRepo): string {
  const name = encodeURIComponent(repo.name)
  const description = encodeURIComponent(repo.description?.slice(0, 60) || 'GitHub Repository')
  const language = repo.language || 'Code'
  const stars = repo.stargazers_count
  
  // 语言颜色映射（基于 GitHub 官方颜色）
  const languageColors: Record<string, string> = {
    JavaScript: 'f7df1e',
    TypeScript: '3178c6',
    Python: '3776ab',
    Go: '00add8',
    Java: 'ed8b00',
    'C++': '00599c',
    HTML: 'e34f26',
    CSS: '1572b6',
    React: '61dafb',
    Vue: '4fc08d',
    PHP: '777bb4',
    Ruby: 'cc342d',
    Rust: 'dea584',
    Swift: 'fa7343',
    Kotlin: '7f52ff'
  }
  
  const color = languageColors[language] || '586069'
  
  // 使用 GitHub README stats 生成仓库卡片
  // 这个服务会根据真实的 GitHub 数据生成美观的卡片图片
  const username = repo.full_name.split('/')[0]
  const repoCard = `https://github-readme-stats.vercel.app/api/pin/?username=${username}&repo=${repo.name}&theme=default&show_owner=false&bg_color=ffffff&title_color=2f80ed&text_color=333333&icon_color=${color}`
  
  return repoCard
} 