import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { prisma } = await import('@/lib/prisma')
    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' }
    })
    
    if (blogs && blogs.length > 0) {
      return NextResponse.json(blogs)
    }
  } catch (dbError) {
    console.error('[Blogs] Database error:', dbError)
  }

  // Fallback test data
  const testData = [
    {
      id: '1',
      title: 'The Future of Web Design: Trends for 2026',
      slug: 'future-web-design-trends-2026',
      excerpt: 'Exploring emerging trends and technologies shaping the future of web design',
      content: '# The Future of Web Design\n\nWeb design continues to evolve at a rapid pace...',
      coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&h=500',
      tags: ['Web Design', 'Trends', 'Technology'],
      isPublished: true,
      authorId: null,
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
      author: null
    },
    {
      id: '2',
      title: 'Building Scalable Applications with Next.js',
      slug: 'building-scalable-apps-nextjs',
      excerpt: 'A comprehensive guide to architecting scalable applications',
      content: '# Building Scalable Applications with Next.js\n\nNext.js has become the go-to framework...',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1000&h=500',
      tags: ['Development', 'Next.js', 'React'],
      isPublished: true,
      authorId: null,
      createdAt: new Date('2026-02-01'),
      updatedAt: new Date('2026-02-01'),
      author: null
    }
  ]

  return NextResponse.json(testData)
}
