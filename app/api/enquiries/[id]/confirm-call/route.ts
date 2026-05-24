import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { confirmed_call, notes, agenda } = await request.json()

    const existing = await prisma.enquiry.findUnique({ where: { id } })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const summary  = (existing.summary as any) ?? {}
    const followUp = summary.follow_up_enquiry ?? {}

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        summary: {
          ...summary,
          ...(notes   !== undefined && { notes }),
          ...(agenda  !== undefined && { agenda: { ...(summary.agenda ?? {}), ...agenda } }),
          follow_up_enquiry: {
            ...followUp,
            ...(confirmed_call !== undefined && { confirmed_call }),
          },
        },
      },
    })

    return Response.json(updated)
  } catch {
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}
