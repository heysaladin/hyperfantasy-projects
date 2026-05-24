'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const STATUS_OPTIONS = ['new', 'in progress', 'done', 'closed']
const STAGE_OPTIONS  = [
  'marketing', 'enquiry', 'deal', 'project_management',
  'approval', 'development', 'qc', 'handover',
]

const STATUS_STYLES: Record<string, string> = {
  'new':         'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'in progress': 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  'done':        'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
  'closed':      'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-white/40',
}

const STAGE_STYLES: Record<string, string> = {
  marketing:          'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  enquiry:            'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400',
  deal:               'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  project_management: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
  approval:           'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  development:        'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  qc:                 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-400',
  handover:           'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
}

function Dropdown({
  value, options, styles, onChange,
}: {
  value: string; options: string[]; styles: Record<string, string>; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full capitalize font-medium transition hover:opacity-80 ${styles[value] ?? 'bg-slate-100 dark:bg-white/10 text-slate-500'}`}
      >
        {value.replace('_', ' ')}
        <ChevronDown size={11} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-40 rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-lg py-1">
          {options.map(o => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false) }}
              className={`w-full text-left px-3 py-1.5 text-xs capitalize hover:bg-slate-100 dark:hover:bg-white/10 transition ${o === value ? 'font-semibold' : ''}`}
            >
              {o.replace('_', ' ')}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
      <div className="bg-slate-50 dark:bg-white/5 px-5 py-3 border-b border-slate-200 dark:border-white/10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-white/40">{title}</h2>
      </div>
      <div className="px-5 py-4 space-y-3">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row sm:gap-8">
      <span className="text-xs text-slate-400 dark:text-white/30 w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 dark:text-white">{value || '—'}</span>
    </div>
  )
}

export default function AdminEnquiryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [enquiry, setEnquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/enquiries/${id}`)
      .then(r => r.json())
      .then(data => { setEnquiry(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const update = async (patch: Record<string, any>) => {
    setEnquiry((prev: any) => ({ ...prev, ...patch }))
    await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-400 dark:text-white/30 text-sm">Loading…</div>
  )

  if (!enquiry?.id) return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-500 dark:text-white/40">Enquiry not found.</div>
  )

  const summary        = (enquiry.summary as any) ?? {}
  const init           = summary.init_enquiry ?? {}
  const followUp       = summary.follow_up_enquiry ?? {}
  const projectDetails = followUp.project_details ?? {}
  const availability   = followUp.availability ?? []
  const agenda         = summary.agenda ?? {}

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-wrap gap-4 justify-between items-start mb-8">
        <div>
          <Link href="/admin/enquiries" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white mb-3 transition-colors">
            <ArrowLeft size={15} /> Back to enquiries
          </Link>
          <h1 className="text-2xl font-bold">{enquiry.name}</h1>
          <p className="text-sm text-slate-500 dark:text-white/40 mt-1">{enquiry.email}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 dark:text-white/30">Stage</span>
          <Dropdown value={enquiry.stage ?? 'enquiry'} options={STAGE_OPTIONS} styles={STAGE_STYLES} onChange={v => update({ stage: v })} />
          <span className="text-xs text-slate-400 dark:text-white/30 ml-2">Status</span>
          <Dropdown value={enquiry.status ?? 'new'} options={STATUS_OPTIONS} styles={STATUS_STYLES} onChange={v => update({ status: v })} />
        </div>
      </div>

      <div className="space-y-5">
        {/* Init Enquiry */}
        <Section title="Initial Enquiry">
          <Row label="Name"    value={init.name    || enquiry.name} />
          <Row label="Email"   value={init.email   || enquiry.email} />
          <Row label="Company" value={init.company || enquiry.company} />
          <Row label="Budget"  value={init.budget  || enquiry.budget} />
          <div className="flex flex-col sm:flex-row sm:gap-8">
            <span className="text-xs text-slate-400 dark:text-white/30 w-36 shrink-0 pt-0.5">Message</span>
            <p className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap leading-relaxed">{init.message || enquiry.message || '—'}</p>
          </div>
          <Row label="Received" value={enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : undefined} />
        </Section>

        {/* Follow-up */}
        {followUp && Object.keys(followUp).length > 0 && (
          <Section title="Follow-up Enquiry">
            {/* Project details */}
            {projectDetails?.types?.length > 0 && (
              <Row label="Project Types" value={projectDetails.types.join(', ')} />
            )}
            {projectDetails?.uiux_scope?.length > 0 && (
              <Row label="UI/UX Scope" value={projectDetails.uiux_scope.join(', ')} />
            )}
            {projectDetails?.design_requirements && (
              <Row label="Design Requirements" value={projectDetails.design_requirements} />
            )}
            {projectDetails?.dev_scope?.length > 0 && (
              <Row label="Dev Scope" value={projectDetails.dev_scope.join(', ')} />
            )}
            {projectDetails?.dev_requirements && (
              <Row label="Dev Requirements" value={projectDetails.dev_requirements} />
            )}
            {projectDetails?.creative_requirements && Object.entries(projectDetails.creative_requirements).map(([k, v]) => (
              <Row key={k} label={`${k} Requirements`} value={v as string} />
            ))}
            <Row label="Timeline" value={followUp.timeline} />
            {/* Availability */}
            {availability.filter((s: any) => s.day).length > 0 && (
              <div className="flex flex-col sm:flex-row sm:gap-8">
                <span className="text-xs text-slate-400 dark:text-white/30 w-36 shrink-0 pt-0.5">Availability</span>
                <div className="space-y-1">
                  {availability.filter((s: any) => s.day).map((s: any) => (
                    <p key={s.slot} className="text-sm text-slate-800 dark:text-white">
                      Slot {s.slot}: {s.day} {s.time && `at ${s.time}`}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <Row label="Confirmed Call" value={followUp.confirmed_call} />
          </Section>
        )}

        {/* Agenda */}
        <Section title="Agenda">
          <Row label="Next Action"    value={agenda.next_action} />
          <Row label="Next Action By" value={agenda.next_action_by} />
          <Row label="Due Date"       value={agenda.due_date} />
        </Section>

        {/* Notes */}
        {summary.notes !== undefined && (
          <Section title="Notes">
            <p className="text-sm text-slate-800 dark:text-white whitespace-pre-wrap leading-relaxed">{summary.notes || '—'}</p>
          </Section>
        )}

        {/* Meta */}
        <Section title="Meta">
          <Row label="Enquiry Received" value={summary.enquiry_received ? new Date(summary.enquiry_received).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : undefined} />
          <Row label="Estimated Done"   value={summary.estimated_done   ? new Date(summary.estimated_done).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : followUp.timeline === '> 4 weeks' ? '> 4 weeks from follow-up' : undefined} />
        </Section>
      </div>

      <div className="mt-8">
        <Link href="/admin/enquiries">
          <Button variant="outline">Back</Button>
        </Link>
      </div>
    </div>
  )
}
