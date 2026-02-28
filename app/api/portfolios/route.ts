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
  try {
    console.log('POST started')
    
    const supabase = await createClient()
    console.log('Supabase client created')
    
    const { data: { user } } = await supabase.auth.getUser()
    console.log('User:', user?.email || 'Not logged in')
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Body received:', body)
    
    // Simplest possible create
    const portfolio = await prisma.portfolio.create({
      data: {
        title: body.title,
        tags: body.tags || [],
        stack: body.stack || [],
      }
    })
    
    console.log('Portfolio created:', portfolio.id)
    
    return Response.json({ success: true, id: portfolio.id }, { status: 201 })
    
  } catch (error: any) {
    console.error('=== POST ERROR ===')
    console.error('Error name:', error.name)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
    console.error('==================')
    
    return Response.json({ 
      error: 'Server error',
      details: error.message,
      name: error.name
    }, { status: 500 })
  }
}