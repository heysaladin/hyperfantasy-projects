import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return Response.json(enquiries)
  } catch (error) {
    return Response.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}

// Public POST (no auth needed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const enquiry = await prisma.enquiry.create({
      data: body
    })
    return Response.json(enquiry)
  } catch (error) {
    return Response.json({ error: 'Failed to create enquiry' }, { status: 500 })
  }
}