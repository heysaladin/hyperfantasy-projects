import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// GET all portfolios
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { orderIndex: 'asc' },
      include: {
        creator: true,
        team: true
      }
    })
    return Response.json(portfolios)
  } catch (error) {
    console.error('GET Error:', error)
    return Response.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

// CREATE portfolio
export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Creating portfolio with data:', body)
    
    // Clean up data
    const data: any = {
      title: body.title,
      description: body.description || null,
      longDescription: body.longDescription || null,
      imageUrl: body.imageUrl || null,
      liveUrl: body.liveUrl || null,
      githubUrl: body.githubUrl || null,
      tags: body.tags || [],
      stack: body.stack || [],
      category: body.category || null,
      complexity: body.complexity || null,
      projectDate: body.projectDate ? new Date(body.projectDate) : null,
      isVisible: body.isVisible || false,
      isFeatured: body.isFeatured || false,
      orderIndex: body.orderIndex || 0
    }

    // Only add relations if they exist
    if (body.teamId) data.teamId = body.teamId
    if (body.creatorId) data.creatorId = body.creatorId

    const portfolio = await prisma.portfolio.create({
      data
    })
    
    console.log('Portfolio created:', portfolio.id)
    return Response.json(portfolio, { status: 201 })
  } catch (error: any) {
    console.error('POST Error:', error)
    return Response.json({ 
      error: 'Failed to create portfolio',
      details: error.message 
    }, { status: 500 })
  }
}