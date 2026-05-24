'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, CalendarIcon, Check, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

const BG = '#030017'

const PROJECT_TYPES = [
  'UI/UX Design',
  'Brand Identity',
  'Graphic Design',
  'Illustration',
  'Development',
]

const DEV_SUBTYPES   = ['Web Dev', 'App Dev']
const UIUX_SUBTYPES  = ['Landing Page', 'Website (multipages)', 'Web System (commerce)', 'WebApp SaaS', 'Mobile Dev']

const CREATIVE_TYPES = ['Brand Identity', 'Graphic Design', 'Illustration']

const TIMELINE_OPTIONS = [
  'ASAP', 'Within 24 hrs', '2 days', '3 days',
  '1 week', '2 weeks', '4 weeks', '> 4 weeks',
]

const TIME_OPTIONS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM',
]

type Slot = { slot: number; day: Date | undefined; time: string }
const makeSlot = (n: number): Slot => ({ slot: n, day: undefined, time: '' })

function PillButton({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors select-none',
        selected
          ? 'bg-violet-600 border-violet-600 text-white'
          : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-violet-400 dark:hover:border-violet-500'
      )}
    >
      {selected && <Check size={13} className="shrink-0" />}
      {children}
    </button>
  )
}

export default function FollowUpPage() {
  const { id } = useParams<{ id: string }>()

  const [projectTypes, setProjectTypes]       = useState<string[]>([])
  const [devSubtypes, setDevSubtypes]         = useState<string[]>([])
  const [uiuxSubtypes, setUiuxSubtypes]       = useState<string[]>([])
  const [creativeReqs, setCreativeReqs]       = useState<Record<string, string>>({})
  const [designRequirements, setDesignReqs]   = useState('')
  const [devRequirements, setDevReqs]         = useState('')
  const [timeline, setTimeline]               = useState('')
  const [slots, setSlots]                     = useState<Slot[]>([makeSlot(1)])
  const [loading, setLoading]                 = useState(false)
  const [success, setSuccess]                 = useState(false)
  const [error, setError]                     = useState('')

  const toggleType = (type: string) => {
    setProjectTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const toggleMulti = (val: string, list: string[], set: (v: string[]) => void) => {
    set(list.includes(val) ? list.filter(v => v !== val) : [...list, val])
  }

  const setSlotField = <K extends keyof Slot>(index: number, field: K, value: Slot[K]) => {
    setSlots(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const lastSlotFilled = () => {
    const last = slots[slots.length - 1]
    return !!last.day && !!last.time
  }

  const hasUiux  = projectTypes.includes('UI/UX Design')
  const hasDev   = projectTypes.includes('Development')
  const selectedCreative = projectTypes.filter(t => CREATIVE_TYPES.includes(t))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/enquiries/${id}/followup`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_details: {
            types: projectTypes,
            ...(hasUiux && { uiux_scope: uiuxSubtypes, design_requirements: designRequirements }),
            ...(hasDev  && { dev_scope: devSubtypes, dev_requirements: devRequirements }),
            ...(selectedCreative.length > 0 && {
              creative_requirements: Object.fromEntries(
                selectedCreative.map(t => [t, creativeReqs[t] ?? ''])
              ),
            }),
          },
          timeline,
          availability: slots.map(s => ({
            slot: s.slot,
            day:  s.day ? format(s.day, 'EEE, d MMM yyyy') : '',
            time: s.time,
          })),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ fontFamily: 'var(--font-sora, sans-serif)' }} className="min-h-screen hf-page text-slate-900 dark:text-white transition-colors pt-16">
      <style>{`
        .hf-page       { background-color: #ffffff; }
        .dark .hf-page { background-color: ${BG}; }
        .before-title  { color:#7c3aed; display:block; font-size:14px; font-weight:600; letter-spacing:.16em; text-transform:uppercase; margin-bottom:16px; }
        .dark .before-title { color:#b394f4; }
      `}</style>

      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <Link href={`/enquiry/${id}`} className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white mb-10 transition-colors">
          <ArrowLeft size={16} />
          Back
        </Link>

        <span className="before-title">Follow Up</span>
        <h1 style={{ fontSize: 'clamp(32px,5vw,56px)', fontWeight: 600, lineHeight: '135%' }} className="mb-4">
          Tell us more
        </h1>
        <p style={{ fontSize: 17, fontWeight: 300, lineHeight: '150%' }} className="dark:text-white/60 text-slate-500 mb-12">
          Help us understand your project better so we can prepare for our call.
        </p>

        {success ? (
          <div className="rounded-3xl border border-black/10 dark:border-white/5 px-8 py-12 text-center">
            <div className="flex justify-center mb-5">
              <CheckCircle size={64} className="text-green-500 dark:text-green-400" strokeWidth={1.5} />
            </div>
            <p className="text-2xl font-semibold mb-2 text-green-700 dark:text-green-400">Follow-up submitted!</p>
            <p className="text-slate-500 dark:text-white/50 mb-6">We&apos;ll be in touch shortly.</p>
            <Link href="/"><Button variant="outline">Back to home</Button></Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-10">

            {error && (
              <div role="alert" className="rounded-lg px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            {/* Project Type */}
            <div className="flex flex-col gap-3">
              <Label>Project Type <span className="text-slate-400 dark:text-white/30 font-normal">(select all that apply)</span></Label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_TYPES.map(type => (
                  <PillButton key={type} selected={projectTypes.includes(type)} onClick={() => toggleType(type)}>
                    {type}
                  </PillButton>
                ))}
              </div>
            </div>

            {/* UI/UX Design → scope + design requirements */}
            {hasUiux && (
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-violet-300 dark:border-violet-700">
                <div className="flex flex-col gap-3">
                  <Label>UI/UX Scope</Label>
                  <div className="flex flex-wrap gap-2">
                    {UIUX_SUBTYPES.map(sub => (
                      <PillButton key={sub} selected={uiuxSubtypes.includes(sub)} onClick={() => toggleMulti(sub, uiuxSubtypes, setUiuxSubtypes)}>
                        {sub}
                      </PillButton>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="design_req">Design Requirements</Label>
                  <Textarea
                    id="design_req"
                    rows={4}
                    value={designRequirements}
                    onChange={e => setDesignReqs(e.target.value)}
                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
                    placeholder="Describe your design goals, references, style preferences…"
                  />
                </div>
              </div>
            )}

            {/* Development → sub-type + dev requirements */}
            {hasDev && (
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-violet-300 dark:border-violet-700">
                <div className="flex flex-col gap-3">
                  <Label>Development Scope</Label>
                  <div className="flex flex-wrap gap-2">
                    {DEV_SUBTYPES.map(sub => (
                      <PillButton key={sub} selected={devSubtypes.includes(sub)} onClick={() => toggleMulti(sub, devSubtypes, setDevSubtypes)}>
                        {sub}
                      </PillButton>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="dev_req">Dev Requirements</Label>
                  <Textarea
                    id="dev_req"
                    rows={4}
                    value={devRequirements}
                    onChange={e => setDevReqs(e.target.value)}
                    className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
                    placeholder="Tech stack preferences, integrations, features…"
                  />
                </div>
              </div>
            )}

            {/* Creative types → per-type requirements */}
            {selectedCreative.map(type => (
              <div key={type} className="flex flex-col gap-2 pl-4 border-l-2 border-violet-300 dark:border-violet-700">
                <Label htmlFor={`req_${type}`}>{type} Requirements</Label>
                <Textarea
                  id={`req_${type}`}
                  rows={4}
                  value={creativeReqs[type] ?? ''}
                  onChange={e => setCreativeReqs(prev => ({ ...prev, [type]: e.target.value }))}
                  className="bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
                  placeholder={`Describe your ${type.toLowerCase()} goals, references, style…`}
                />
              </div>
            ))}

            {/* Timeline */}
            <div className="flex flex-col gap-3">
              <Label>Timeline</Label>
              <div className="flex flex-wrap gap-2">
                {TIMELINE_OPTIONS.map(opt => (
                  <label key={opt} className="cursor-pointer">
                    <input type="radio" name="timeline" value={opt} checked={timeline === opt} onChange={() => setTimeline(opt)} className="sr-only" />
                    <span className={cn(
                      'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-colors select-none',
                      timeline === opt
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-white/70 hover:border-violet-400 dark:hover:border-violet-500'
                    )}>
                      {opt}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label className="mb-3 block">Availability</Label>
              <div className="space-y-3">
                {slots.map((slot, i) => (
                  <div key={slot.slot} className="flex flex-col sm:flex-row gap-3">
                    <span className="text-xs font-semibold text-slate-400 dark:text-white/30 w-12 pt-2.5 shrink-0">
                      Slot {slot.slot}
                    </span>

                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            'flex h-9 flex-1 items-center gap-2 rounded-md border px-3 text-sm transition-colors',
                            'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5',
                            'hover:border-slate-300 dark:hover:border-white/20',
                            !slot.day && 'text-slate-400 dark:text-white/30'
                          )}
                        >
                          <CalendarIcon size={15} className="shrink-0" />
                          {slot.day ? format(slot.day, 'EEE, d MMM yyyy') : 'Pick a date'}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={slot.day}
                          onSelect={d => setSlotField(i, 'day', d)}
                          disabled={{ before: new Date() }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <select
                      value={slot.time}
                      onChange={e => setSlotField(i, 'time', e.target.value)}
                      className={cn(
                        'h-9 flex-1 rounded-md border px-3 text-sm transition-colors appearance-none',
                        'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5',
                        'hover:border-slate-300 dark:hover:border-white/20',
                        !slot.time && 'text-slate-400 dark:text-white/30'
                      )}
                    >
                      <option value="" disabled>Pick a time</option>
                      {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              {slots.length < 3 && lastSlotFilled() && (
                <button
                  type="button"
                  onClick={() => setSlots(prev => [...prev, makeSlot(prev.length + 1)])}
                  className="mt-4 text-sm text-violet-600 dark:text-violet-400 hover:underline"
                >
                  + Add another time
                </button>
              )}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                style={{ background: 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)', borderRadius: 48, padding: '12px 28px', fontSize: 15, fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity .2s' }}
              >
                {loading ? <span aria-live="polite">Submitting…</span> : 'Submit Follow-Up'}
              </button>
              <Link href={`/enquiry/${id}`}>
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}
