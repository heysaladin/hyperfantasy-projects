import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

const DEFAULT_SUMMARY = {
  init_enquiry: {
    name: '', email: '', company: '', budget: '', message: '',
  },
  follow_up_enquiry: {
    project_details: '',
    timeline: '',
    availability: [
      { slot: 1, day: '', time: '' },
      { slot: 2, day: '', time: '' },
      { slot: 3, day: '', time: '' },
    ],
    confirmed_call: null,
  },
  enquiry_received: null,
  estimated_done:   null,
  files:            {},
  agenda: {
    next_action:    '',
    next_action_by: '',
    due_date:       null,
  },
  notes: '',
}

const TIMELINE_DAYS: Record<string, number | null> = {
  'ASAP':           0,
  'Within 24 hrs':  1,
  '2 days':         2,
  '3 days':         3,
  '1 week':         7,
  '2 weeks':        14,
  '4 weeks':        28,
  '> 4 weeks':      null,
}

function calcEstimatedDone(receivedAt: Date, timeline: string): string | null {
  const days = TIMELINE_DAYS[timeline]
  if (days === undefined || days === null) return null
  const d = new Date(receivedAt)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = await request.json()

    const existing = await prisma.enquiry.findUnique({ where: { id } })
    if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

    const summary       = (existing.summary as any) ?? {}
    const receivedAt    = new Date()
    const estimatedDone = calcEstimatedDone(receivedAt, body.timeline ?? '')

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        summary: {
          ...DEFAULT_SUMMARY,
          ...summary,
          follow_up_enquiry: {
            project_details: body.project_details ?? '',
            timeline:        body.timeline ?? '',
            availability:    body.availability ?? DEFAULT_SUMMARY.follow_up_enquiry.availability,
            confirmed_call:  summary.follow_up_enquiry?.confirmed_call ?? null,
          },
          enquiry_received: receivedAt.toISOString(),
          estimated_done:   estimatedDone,
        },
      },
    })

    return Response.json(updated)
  } catch {
    return Response.json({ error: 'Failed to save follow-up' }, { status: 500 })
  }
}
