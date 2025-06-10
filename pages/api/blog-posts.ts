import { type NextApiRequest, type NextApiResponse } from 'next'
import { getBlogPosts } from '../../hooks/useBlogPosts'

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  if (req.method === 'GET') {
    try {
      const posts = getBlogPosts()
      res.status(200).json({ posts })
    } catch (error) {
      console.error('获取博客文章失败:', error)
      res.status(500).json({ error: '获取博客文章失败', posts: [] })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    const method = req.method || 'UNKNOWN'
    res.status(405).end(`Method ${method} Not Allowed`)
  }
} 