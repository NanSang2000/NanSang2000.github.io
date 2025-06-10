import { NextApiRequest, NextApiResponse } from 'next'

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
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Portfolio-Website'
    }

    if (GITHUB_TOKEN) {
      headers.Authorization = `token ${GITHUB_TOKEN}`
    }

    // 获取用户的所有公开仓库
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=50`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
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

    res.status(200).json(projectRepos)
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    res.status(500).json({ 
      message: 'Failed to fetch repositories',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

// 生成项目横幅图片
function generateBanner(repo: GitHubRepo): string {
  // 根据主要编程语言生成不同的横幅
  const languageImages: Record<string, string> = {
    JavaScript: '/projects/js-banner.svg',
    TypeScript: '/projects/ts-banner.svg',
    React: '/projects/react-banner.svg',
    'Next.js': '/projects/nextjs-banner.svg',
    Python: '/projects/python-banner.svg',
    Go: '/projects/go-banner.svg',
    Java: '/projects/java-banner.svg',
    'C++': '/projects/cpp-banner.svg',
    HTML: '/projects/web-banner.svg',
    CSS: '/projects/web-banner.svg'
  }

  // 如果有特定语言的图片，使用它
  if (repo.language && languageImages[repo.language]) {
    return languageImages[repo.language]
  }

  // 根据topics生成横幅
  for (const topic of repo.topics) {
    if (languageImages[topic]) {
      return languageImages[topic]
    }
  }

  // 根据仓库名称生成横幅
  const name = repo.name.toLowerCase()
  if (name.includes('react')) return '/projects/react-banner.svg'
  if (name.includes('vue')) return '/projects/vue-banner.svg'
  if (name.includes('next')) return '/projects/nextjs-banner.svg'
  if (name.includes('web')) return '/projects/web-banner.svg'
  if (name.includes('api')) return '/projects/api-banner.svg'
  if (name.includes('bot')) return '/projects/bot-banner.svg'
  if (name.includes('cli')) return '/projects/cli-banner.svg'

  // 默认横幅
  return '/projects/default-banner.svg'
} 