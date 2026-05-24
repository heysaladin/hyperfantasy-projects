'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, CalendarIcon, Clock, Pencil, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const BG     = '#030017'
const CARD   = '#181346'
const ACCENT = '#b394f4'

const STAGE_LABEL: Record<string, string> = {
  marketing:          'Marketing',
  enquiry:            'Enquiry',
  deal:               'Deal',
  project_management: 'Project Management',
  approval:           'Approval',
  development:        'Development',
  qc:                 'QC',
  handover:           'Handover',
}

const STAGE_COLOR: Record<string, string> = {
  marketing:          '#60a5fa',
  enquiry:            '#b394f4',
  deal:               '#34d399',
  project_management: '#fb923c',
  approval:           '#facc15',
  development:        '#a78bfa',
  qc:                 '#f472b6',
  handover:           '#4ade80',
}

const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM',
]

function useCountdown(target: string | null) {
  const [diff, setDiff] = useState<number | null>(null)

  useEffect(() => {
    if (!target) return
    const tick = () => setDiff(new Date(target).getTime() - Date.now())
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [target])

  if (diff === null) return null
  if (diff <= 0) return 'Now'

  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)

  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m ${s}s`
  return `${m}m ${s}s`
}

export default function EnquiryDetailPage() {
  const { id }    = useParams<{ id: string }>()
  const [enquiry, setEnquiry] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  // Confirmed call form
  const [callDate, setCallDate]     = useState<Date | undefined>()
  const [callTime, setCallTime]     = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [editingCall, setEditingCall] = useState(false)

  // Notes
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue]     = useState('')
  const [savingNotes, setSavingNotes]   = useState(false)

  // Agenda
  const [agendaForm, setAgendaForm]     = useState({ next_action: '', next_action_by: '', due_date_day: undefined as Date | undefined, due_date_time: '' })
  const [editingAgenda, setEditingAgenda] = useState(false)
  const [savingAgenda, setSavingAgenda]   = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setIsAdmin(!!data.user))
    fetch(`/api/enquiries/${id}`)
      .then(r => r.json())
      .then(data => {
        setEnquiry(data)
        const ag = (data.summary as any)?.agenda ?? {}
        setNotesValue((data.summary as any)?.notes ?? '')
        const existingDue = ag.due_date ? new Date(ag.due_date) : undefined
        setAgendaForm({
          next_action:    ag.next_action    ?? '',
          next_action_by: ag.next_action_by ?? '',
          due_date_day:   existingDue,
          due_date_time:  existingDue ? existingDue.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : '',
        })
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  const summary       = (enquiry?.summary as any) ?? {}
  const followUp      = summary.follow_up_enquiry ?? {}
  const confirmedCall = followUp.confirmed_call as string | null
  const hasFollowUp   = !!followUp.timeline

  const countdown = useCountdown(confirmedCall)
  const stageColor = enquiry ? (STAGE_COLOR[enquiry.stage] ?? ACCENT) : ACCENT

  const patchCall = async (confirmed_call: string | null) => {
    setSubmitting(true)
    const res  = await fetch(`/api/enquiries/${id}/confirm-call`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmed_call }),
    })
    const data = await res.json()
    setEnquiry(data)
    setNotesValue(data.summary?.notes ?? '')
    setEditingCall(false)
    setCallDate(undefined)
    setCallTime('')
    setSubmitting(false)
  }

  const handleSubmitCall = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!callDate || !callTime) return
    const iso = new Date(`${format(callDate, 'yyyy-MM-dd')} ${callTime}`).toISOString()
    await patchCall(iso)
  }

  const saveNotes = async () => {
    setSavingNotes(true)
    const res  = await fetch(`/api/enquiries/${id}/confirm-call`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: notesValue }),
    })
    const data = await res.json()
    setEnquiry(data)
    setEditingNotes(false)
    setSavingNotes(false)
  }

  const saveAgenda = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingAgenda(true)
    const due_date = agendaForm.due_date_day && agendaForm.due_date_time
      ? new Date(`${format(agendaForm.due_date_day, 'yyyy-MM-dd')} ${agendaForm.due_date_time}`).toISOString()
      : null
    const res  = await fetch(`/api/enquiries/${id}/confirm-call`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agenda: { next_action: agendaForm.next_action, next_action_by: agendaForm.next_action_by, due_date } }),
    })
    const data = await res.json()
    setEnquiry(data)
    setEditingAgenda(false)
    setSavingAgenda(false)
  }

  return (
    <div style={{ fontFamily: 'var(--font-sora, sans-serif)' }} className="min-h-screen hf-page text-slate-900 dark:text-white transition-colors pt-16">
      <style>{`
        .hf-page       { background-color: #ffffff; }
        .dark .hf-page { background-color: ${BG}; }
        .hf-card       { background: #f1f0ff; }
        .dark .hf-card { background: ${CARD}; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <Link href="/admin/enquiries" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white mb-10 transition-colors">
          <ArrowLeft size={16} />
          Back to enquiries
        </Link>

        {loading && <div className="text-slate-400 dark:text-white/30 text-sm">Loading…</div>}
        {!loading && !enquiry?.id && <div className="text-slate-500 dark:text-white/40">Enquiry not found.</div>}

        {!loading && enquiry?.id && (
          <div className="space-y-10">
            {/* Stage */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-3">Stage</p>
              <p style={{ fontSize: 'clamp(52px,10vw,96px)', fontWeight: 700, lineHeight: 1, color: stageColor, letterSpacing: '-0.02em' }}>
                {STAGE_LABEL[enquiry.stage] ?? enquiry.stage}
              </p>
            </div>

            {/* Details */}
            <div className="hf-card rounded-3xl border border-black/10 dark:border-white/5 px-8 py-8 space-y-6">
              {isAdmin && <Row label="Name"    value={enquiry.name} />}
              {isAdmin && <Row label="Email"   value={enquiry.email} />}
              {isAdmin && enquiry.company && <Row label="Company" value={enquiry.company} />}
              {isAdmin && enquiry.budget  && <Row label="Budget"  value={enquiry.budget} />}
              {isAdmin && <Row label="Status" value={enquiry.status ?? 'new'} />}
              <Row label="Date" value={enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'} />
              {isAdmin && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30 mb-2">Message</p>
                  <p className="text-slate-700 dark:text-white/70 whitespace-pre-wrap leading-relaxed">{enquiry.message}</p>
                </div>
              )}
            </div>

            {/* Confirmed Call section — shown when follow-up timeline exists */}
            {hasFollowUp && (
              <div className="space-y-6">
                {/* Confirmed Call */}
                <div
                  className="rounded-2xl px-6 py-6 border confirmed-call-box"
                  style={{ borderColor: `${stageColor}60` }}
                >
                  <style>{`
                    .confirmed-call-box { background: #0f0f0f; border-color: #222; }
                    .dark .confirmed-call-box { background: #f0f0f0; border-color: #ddd; }
                  `}</style>
                  <div className="relative flex items-center justify-center mb-5">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/50 dark:text-slate-500">Confirmed Call</p>
                    {confirmedCall && (!editingCall || !isAdmin) && isAdmin && (
                      <button onClick={() => setEditingCall(true)} className="absolute right-0 text-white/40 dark:text-slate-400 hover:text-white dark:hover:text-slate-700 transition-colors">
                        <Pencil size={15} />
                      </button>
                    )}
                  </div>

                  {confirmedCall && (!editingCall || !isAdmin) ? (
                    <div className="flex flex-col items-center text-center gap-4">
                        <p className="text-base font-medium text-white dark:text-slate-800">
                          {new Date(confirmedCall).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                          {' at '}
                          {new Date(confirmedCall).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {countdown && (
                          <div className="flex items-center gap-2">
                            <Clock size={24} style={{ color: stageColor }} className="shrink-0" />
                            <p style={{ color: stageColor }} className="text-4xl font-bold tabular-nums tracking-tight">
                              {countdown === 'Now' ? 'Now!' : `in ${countdown}`}
                            </p>
                          </div>
                        )}
                      </div>
                  ) : isAdmin ? (
                    <form onSubmit={handleSubmitCall} className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Date picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                'flex h-9 flex-1 items-center gap-2 rounded-md border px-3 text-sm transition-colors',
                                'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5',
                                'hover:border-slate-300 dark:hover:border-white/20',
                                !callDate && 'text-slate-400 dark:text-white/30'
                              )}
                            >
                              <CalendarIcon size={15} className="shrink-0" />
                              {callDate ? format(callDate, 'EEE, d MMM yyyy') : 'Pick a date'}
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={callDate}
                              onSelect={setCallDate}
                              disabled={{ before: new Date() }}
                            />
                          </PopoverContent>
                        </Popover>

                        {/* Time picker */}
                        <select
                          value={callTime}
                          onChange={e => setCallTime(e.target.value)}
                          className={cn(
                            'h-9 flex-1 rounded-md border px-3 text-sm appearance-none transition-colors',
                            'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5',
                            !callTime && 'text-slate-400 dark:text-white/30'
                          )}
                        >
                          <option value="" disabled>Pick a time</option>
                          {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={!callDate || !callTime || submitting}
                          style={{ background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)', borderRadius: 48, padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#fff', border: 'none', cursor: (!callDate || !callTime) ? 'not-allowed' : 'pointer', opacity: (!callDate || !callTime || submitting) ? 0.5 : 1, transition: 'opacity .2s' }}
                        >
                          {submitting ? 'Saving…' : 'Confirm Call'}
                        </button>
                        {editingCall && (
                          <Button variant="outline" size="sm" onClick={() => setEditingCall(false)}>Cancel</Button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-white/40">To be confirmed.</p>
                  )}
                </div>

                {/* Notes */}
                <div className="hf-card rounded-2xl border border-black/10 dark:border-white/5 px-6 py-5">
                  <div className="flex items-start justify-between mb-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30">Notes</p>
                    {!editingNotes && isAdmin && (
                      <button onClick={() => setEditingNotes(true)} className="text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white transition-colors">
                        <Pencil size={15} />
                      </button>
                    )}
                  </div>
                  {editingNotes ? (
                    <div className="space-y-2">
                      <Textarea
                        rows={3}
                        value={notesValue}
                        onChange={e => setNotesValue(e.target.value)}
                        className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={saveNotes}
                          disabled={savingNotes}
                          style={{ background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)', borderRadius: 48, padding: '7px 18px', fontSize: 13, fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', opacity: savingNotes ? 0.6 : 1 }}
                        >
                          {savingNotes ? 'Saving…' : 'Save'}
                        </button>
                        <Button variant="outline" size="sm" onClick={() => { setEditingNotes(false); setNotesValue(summary.notes ?? '') }}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-700 dark:text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {summary.notes
                        ? linkify(summary.notes)
                        : 'Waiting confirmed call schedule'}
                    </p>
                  )}
                </div>

                {/* Agenda — admin only */}
                {isAdmin && (
                  <div className="hf-card rounded-2xl border border-black/10 dark:border-white/5 px-6 py-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30">Agenda</p>
                      {!editingAgenda && (
                        <button onClick={() => setEditingAgenda(true)} className="text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white transition-colors">
                          <Pencil size={15} />
                        </button>
                      )}
                    </div>

                    {editingAgenda ? (
                      <form onSubmit={saveAgenda} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="next_action">Next Action</Label>
                          <Textarea
                            id="next_action"
                            rows={3}
                            value={agendaForm.next_action}
                            onChange={e => setAgendaForm(p => ({ ...p, next_action: e.target.value }))}
                            className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm"
                            placeholder="What needs to happen next…"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label htmlFor="next_action_by">Next Action By</Label>
                          <Input
                            id="next_action_by"
                            value={agendaForm.next_action_by}
                            onChange={e => setAgendaForm(p => ({ ...p, next_action_by: e.target.value }))}
                            className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-sm"
                            placeholder="Person responsible…"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label>Due Date</Label>
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className={cn(
                                    'flex h-9 flex-1 items-center gap-2 rounded-md border px-3 text-sm transition-colors',
                                    'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5',
                                    !agendaForm.due_date_day && 'text-slate-400 dark:text-white/30'
                                  )}
                                >
                                  <CalendarIcon size={15} className="shrink-0" />
                                  {agendaForm.due_date_day ? format(agendaForm.due_date_day, 'EEE, d MMM yyyy') : 'Pick a date'}
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={agendaForm.due_date_day}
                                  onSelect={d => setAgendaForm(p => ({ ...p, due_date_day: d }))}
                                />
                              </PopoverContent>
                            </Popover>
                            <select
                              value={agendaForm.due_date_time}
                              onChange={e => setAgendaForm(p => ({ ...p, due_date_time: e.target.value }))}
                              className={cn(
                                'h-9 flex-1 rounded-md border px-3 text-sm appearance-none transition-colors',
                                'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5',
                                !agendaForm.due_date_time && 'text-slate-400 dark:text-white/30'
                              )}
                            >
                              <option value="" disabled>Pick a time</option>
                              {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={savingAgenda}
                            style={{ background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)', borderRadius: 48, padding: '10px 24px', fontSize: 14, fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', opacity: savingAgenda ? 0.6 : 1, transition: 'opacity .2s' }}
                          >
                            {savingAgenda ? 'Saving…' : 'Save Agenda'}
                          </button>
                          <Button type="button" variant="outline" size="sm" onClick={() => setEditingAgenda(false)}>Cancel</Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-3">
                        <AgendaRow label="Next Action"    value={agendaForm.next_action} />
                        <AgendaRow label="Next Action By" value={agendaForm.next_action_by} />
                        <AgendaRow label="Due Date"       value={agendaForm.due_date_day ? `${format(agendaForm.due_date_day, 'EEE, d MMM yyyy')}${agendaForm.due_date_time ? ` at ${agendaForm.due_date_time}` : ''}` : ''} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function linkify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = text.split(urlRegex)
  return parts.map((part, i) =>
    urlRegex.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 underline underline-offset-2 hover:opacity-80 break-all">
        {part}
      </a>
    ) : part
  )
}

function AgendaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-xs text-slate-400 dark:text-white/30">{label}</p>
      <p className="text-sm text-slate-800 dark:text-white">{value || '—'}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-white/30">{label}</p>
      <p className="text-slate-800 dark:text-white font-medium">{value}</p>
    </div>
  )
}
