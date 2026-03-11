import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// GET portfolios — supports ?limit=&offset=&visible=true for pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const offsetParam = searchParams.get('offset')
    const visibleOnly = searchParams.get('visible') === 'true'

    const search = searchParams.get('search')?.trim() || ''
    const category = searchParams.get('category') || ''
    const complexity = searchParams.get('complexity') || ''
    const sort = searchParams.get('sort') || 'order'

    // Build AND conditions so OR (for isVisible) never conflicts with other filters
    const conditions: any[] = []
    if (visibleOnly) conditions.push({ OR: [{ isVisible: true }, { isVisible: null }] })
    if (search)      conditions.push({ title: { contains: search, mode: 'insensitive' } })
    if (category)    conditions.push({ category })
    if (complexity)  conditions.push({ complexity })
    const where: any = conditions.length ? { AND: conditions } : {}

    const orderBy =
      sort === 'newest'     ? { projectDate: 'desc' as const } :
      sort === 'oldest'     ? { projectDate: 'asc' as const } :
      sort === 'title'      ? { title: 'asc' as const } :
      sort === 'updated'    ? { updatedAt: 'desc' as const } :
      sort === 'order_desc' ? { orderIndex: 'desc' as const } :
      { orderIndex: 'asc' as const }

    if (limitParam !== null) {
      const limit = Math.min(parseInt(limitParam) || 9, 500)
      const offset = parseInt(offsetParam || '0') || 0

      const [items, total] = await Promise.all([
        prisma.portfolio.findMany({
          where,
          orderBy,
          take: limit,
          skip: offset,
          select: {
            id: true,
            title: true,
            description: true,
            imageUrl: true,
            category: true,
            complexity: true,
            tags: true,
            stack: true,
            liveUrl: true,
            copyright: true,
            projectDate: true,
            isVisible: true,
            isFeatured: true,
            orderIndex: true,
            colorHex: true,
            colorGroup: true,
          },
        }),
        prisma.portfolio.count({ where }),
      ])

      return Response.json({ items, total })
    }

    // Default: return all with relations (used by admin)
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { orderIndex: 'asc' },
      include: { creator: true, team: true },
    })
    return Response.json(portfolios || [])
  } catch (error) {
    console.error('GET Error:', error)
    return Response.json([], { status: 200 })
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
    console.log('=== RECEIVED BODY ===')
    console.log('body.creatorId:', body.creatorId)
    console.log('body.teamId:', body.teamId)
    
    // Build data object
    const data: any = {
      title: body.title,
      description: body.description || null,
      imageUrl: body.imageUrl || null,
      liveUrl: body.liveUrl || null,
      copyright: body.copyright || null,
      tags: Array.isArray(body.tags) ? body.tags : [],
      stack: Array.isArray(body.stack) ? body.stack : [],
      complexity: body.complexity || null,
      category: body.category || null,
      isVisible: Boolean(body.isVisible),
      isFeatured: Boolean(body.isFeatured),
      orderIndex: typeof body.orderIndex === 'number' ? body.orderIndex : 0,
      projectDate: body.projectDate ? new Date(body.projectDate) : null,
      colorHex: body.colorHex || null,
      colorGroup: body.colorGroup || null,
    }

    // Add foreign keys - CRITICAL: Check for non-empty string
    if (body.creatorId && body.creatorId !== '') {
      console.log('Adding creatorId:', body.creatorId)
      data.creatorId = body.creatorId
    }
    
    if (body.teamId && body.teamId !== '') {
      console.log('Adding teamId:', body.teamId)
      data.teamId = body.teamId
    }

    console.log('=== DATA TO PRISMA ===')
    console.log('data.creatorId:', data.creatorId)
    console.log('data.teamId:', data.teamId)

    const portfolio = await prisma.portfolio.create({
      data,
      include: {
        creator: true,
        team: true
      }
    })
    
    console.log('=== CREATED PORTFOLIO ===')
    console.log('portfolio.creatorId:', portfolio.creatorId)
    console.log('portfolio.teamId:', portfolio.teamId)
    console.log('portfolio.creator:', portfolio.creator)
    
    return Response.json(portfolio, { status: 201 })
    
  } catch (error: any) {
    console.error('=== POST ERROR ===')
    console.error('Error:', error)
    console.error('Message:', error.message)
    return Response.json({ 
      error: 'Failed to create portfolio',
      details: error.message 
    }, { status: 500 })
  }
}