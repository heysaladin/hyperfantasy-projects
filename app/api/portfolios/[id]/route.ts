import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

// UPDATE
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← CHANGE: Promise
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params  // ← ADD: await params

  try {
    const body = await request.json()
    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: body
    })
    return Response.json(portfolio)
  } catch (error) {
    return Response.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← CHANGE: Promise
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params  // ← ADD: await params

  try {
    await prisma.portfolio.delete({
      where: { id }
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
}