import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(blogs)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const blog = await prisma.blog.create({
      data: {
        ...body,
        authorId: user.id
      }
    })
    return Response.json(blog)
  } catch (error) {
    return Response.json({ error: 'Failed to create blog' }, { status: 500 })
  }
}