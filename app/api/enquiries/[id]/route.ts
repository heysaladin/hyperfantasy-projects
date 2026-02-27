import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const enquiry = await prisma.enquiry.update({
      where: { id },
      data: body
    })
    return Response.json(enquiry)
  } catch (error) {
    return Response.json({ error: 'Failed to update enquiry' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.enquiry.delete({
      where: { id }
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed to delete enquiry' }, { status: 500 })
  }
}