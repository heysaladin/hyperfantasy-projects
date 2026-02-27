import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      orderBy: { orderIndex: 'asc' }
    })
    return Response.json(teams)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch teams' }, { status: 500 })
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
    const team = await prisma.team.create({
      data: body
    })
    return Response.json(team)
  } catch (error) {
    return Response.json({ error: 'Failed to create team' }, { status: 500 })
  }
}