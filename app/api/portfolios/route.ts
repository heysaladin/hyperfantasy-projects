import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// GET all portfolios
export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      orderBy: { orderIndex: 'asc' }
    })
    return Response.json(portfolios)
  } catch (error) {
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
    const portfolio = await prisma.portfolio.create({
      data: body
    })
    return Response.json(portfolio)
  } catch (error) {
    return Response.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}