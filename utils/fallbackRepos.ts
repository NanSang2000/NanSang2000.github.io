// 当 GitHub API 不可用时的后备数据
export const fallbackRepos = [
  {
    id: 1,
    name: 'NanSang2000.github.io',
    description: '个人网站与博客，使用 Next.js + Nextra 构建，展示项目作品与技术文章',
    html_url: 'https://github.com/NanSang2000/NanSang2000.github.io',
    homepage: 'https://nansang2000.github.io',
    stargazers_count: 1,
    language: 'TypeScript',
    topics: ['nextjs', 'portfolio', 'blog', 'nextra'],
    updated_at: new Date().toISOString(),
    banner: 'https://github-readme-stats.vercel.app/api/pin/?username=NanSang2000&repo=NanSang2000.github.io&theme=default&show_owner=false'
  },
  {
    id: 2,
    name: 'COMP90089_MLAH',
    description: '机器学习项目，专注于评估急性胰腺炎患者的严重程度，使用 MIMIC 数据集',
    html_url: 'https://github.com/NanSang2000/COMP90089_MLAH',
    homepage: null,
    stargazers_count: 0,
    language: 'Jupyter Notebook',
    topics: ['machine-learning', 'healthcare', 'data-science', 'mimic'],
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    banner: 'https://github-readme-stats.vercel.app/api/pin/?username=NanSang2000&repo=COMP90089_MLAH&theme=default&show_owner=false'
  },
  {
    id: 3,
    name: 'Blog',
    description: '基于 TypeScript 的博客网站项目',
    html_url: 'https://github.com/NanSang2000/Blog',
    homepage: null,
    stargazers_count: 1,
    language: 'TypeScript',
    topics: ['blog', 'typescript', 'web-development'],
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    banner: 'https://github-readme-stats.vercel.app/api/pin/?username=NanSang2000&repo=Blog&theme=default&show_owner=false'
  }
]

export type FallbackRepo = typeof fallbackRepos[0]
