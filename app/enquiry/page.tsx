'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle } from 'lucide-react'

const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'

const PROJECT_TYPES = ['Website', 'Mobile App', 'Dashboard', 'Webflow Development', 'Framer Development', 'Prototype', 'Pitch Deck', 'Other']
const BUDGET_OPTIONS = ['Under $3,000', '$3,000–$5,000', '$5,000–$10,000', '$10,000+']

const EMPTY = { name: '', email: '', company: '', role: '', budget: '', message: '', projectType: [] as string[] }
const EMPTY_ERRORS = { name: '', email: '', message: '', projectType: '', budget: '' }

function validateEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function validate(formData: typeof EMPTY) {
  const errs = { ...EMPTY_ERRORS }
  if (!formData.name.trim())               errs.name        = 'Name is required.'
  if (!formData.email.trim())              errs.email       = 'Email is required.'
  else if (!validateEmail(formData.email)) errs.email       = 'Enter a valid email address.'
  if (!formData.message.trim())            errs.message     = 'Message is required.'
  if (!formData.projectType.length)        errs.projectType = 'Select at least one project type.'
  if (!formData.budget)                    errs.budget      = 'Select a budget range.'
  return errs
}

export default function EnquiryPage() {
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData]       = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS)

  const set = (field: keyof typeof EMPTY, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field in fieldErrors) setFieldErrors(prev => ({ ...prev, [field]: '' }))
  }

  const toggleProjectType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: prev.projectType.includes(type)
        ? prev.projectType.filter(t => t !== type)
        : [...prev.projectType, type],
    }))
    setFieldErrors(prev => ({ ...prev, projectType: '' }))
  }

  const blur = (field: keyof typeof EMPTY_ERRORS) => {
    const errs = validate({ ...formData })
    setFieldErrors(prev => ({ ...prev, [field]: errs[field] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    const errs = validate(formData)
    setFieldErrors(errs)
    if (Object.values(errs).some(Boolean)) return
    setLoading(true)
    try {
      const res = await fetch('/api/enquiries', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        formData.name.trim(),
          email:       formData.email.trim(),
          company:     formData.company.trim()                  || null,
          role:        formData.role.trim()                     || null,
          budget:      formData.budget                          || null,
          projectType: formData.projectType.length ? formData.projectType.join(', ') : null,
          message:     formData.message.trim(),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry')
      setSuccess(true)
      setFormData(EMPTY)
      setFieldErrors(EMPTY_ERRORS)
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ minHeight: '100vh', fontFamily: 'var(--font-inter, sans-serif)' }}
      className="enq-page transition-colors"
    >
      <style>{`
        /* ── Page bg ── */
        .enq-page { background:#fff; color:#0a0a0a; }
        .dark .enq-page { background:#030017; color:#fff; }

        /* ── Field ── */
        .enq-field { display:flex; flex-direction:column; gap:6px; }
        .enq-label {
          font-size:11px; font-weight:600; letter-spacing:0.18em;
          text-transform:uppercase; color:rgba(0,0,0,0.35);
        }
        .dark .enq-label { color:rgba(255,255,255,0.35); }

        .enq-input, .enq-textarea {
          display:block; width:100%; background:transparent;
          border:1px solid rgba(0,0,0,0.14); border-radius:999px;
          padding:14px 20px; font-size:16px; color:#0a0a0a; outline:none;
          font-family:inherit; transition:border-color 0.2s;
          -webkit-appearance:none;
        }
        .enq-textarea { border-radius:24px; }
        .dark .enq-input, .dark .enq-textarea {
          border-color:rgba(255,255,255,0.14); color:#fff;
        }
        .enq-textarea { resize:none; }
        .enq-input::placeholder, .enq-textarea::placeholder { color:rgba(0,0,0,0.25); }
        .dark .enq-input::placeholder, .dark .enq-textarea::placeholder { color:rgba(255,255,255,0.22); }
        .enq-input:focus, .enq-textarea:focus { border-color:rgba(0,0,0,0.55); }
        .dark .enq-input:focus, .dark .enq-textarea:focus { border-color:rgba(255,255,255,0.55); }
        .enq-input.err, .enq-textarea.err { border-color:#f87171; }
        .enq-err { font-size:12px; color:#f87171; }
        .enq-hint { font-size:11px; color:rgba(0,0,0,0.3); }
        .dark .enq-hint { color:rgba(255,255,255,0.25); }

        /* ── Two-col grid ── */
        .enq-grid { display:grid; grid-template-columns:1fr 1fr; gap:2.5rem; }
        @media(max-width:640px) { .enq-grid { grid-template-columns:1fr; } }

        /* ── Submit button ── */
        .enq-submit {
          background:${GRADIENT}; color:#fff; border:none;
          border-radius:100px; padding:15px 32px;
          font-size:15px; font-weight:600; cursor:pointer;
          display:inline-flex; align-items:center; gap:8px;
          transition:opacity 0.2s; font-family:inherit;
        }
        .enq-submit:hover { opacity:0.88; }
        .enq-submit:disabled { opacity:0.55; cursor:not-allowed; }

        /* ── Email link ── */
        .enq-email-link {
          font-size:14px; color:rgba(0,0,0,0.4); text-decoration:none;
          display:inline-flex; align-items:center; gap:6px; transition:color 0.2s;
        }
        .enq-email-link:hover { color:#0a0a0a; }
        .dark .enq-email-link { color:rgba(255,255,255,0.4); }
        .dark .enq-email-link:hover { color:#fff; }

        /* ── Heading ── */
        .enq-eyebrow { color:rgba(0,0,0,0.3); }
        .dark .enq-eyebrow { color:rgba(255,255,255,0.3); }
        .enq-h1 { color:#0a0a0a; }
        .dark .enq-h1 { color:#fff; }
        .enq-subtext { color:rgba(0,0,0,0.45); }
        .dark .enq-subtext { color:rgba(255,255,255,0.45); }

        /* ── Send another btn ── */
        .enq-reset-btn {
          background:transparent; border:1px solid rgba(0,0,0,0.2);
          border-radius:100px; padding:12px 24px; font-size:14px;
          color:#0a0a0a; cursor:pointer; font-family:inherit; transition:background 0.2s;
        }
        .enq-reset-btn:hover { background:rgba(0,0,0,0.04); }
        .dark .enq-reset-btn { border-color:rgba(255,255,255,0.2); color:#fff; }
        .dark .enq-reset-btn:hover { background:rgba(255,255,255,0.06); }

        /* ── Chips ── */
        .enq-chips { display:flex; flex-wrap:wrap; gap:6px; }
        .enq-chip {
          padding:9px 15px; border-radius:999px; font-size:14px; font-weight:400;
          border:1px solid rgba(0,0,0,0.12); background:#fff; color:#151515;
          cursor:pointer; user-select:none; transition:background 0.15s, color 0.15s, border-color 0.15s;
          white-space:nowrap; line-height:1.4;
        }
        .enq-chip:hover { border-color:rgba(0,0,0,0.3); }
        .enq-chip.active { background:#151515; color:#fff; border-color:#151515; }
        .dark .enq-chip { background:transparent; color:rgba(255,255,255,0.65); border-color:rgba(255,255,255,0.14); }
        .dark .enq-chip:hover { border-color:rgba(255,255,255,0.35); }
        .dark .enq-chip.active { background:#fff; color:#151515; border-color:#fff; }

        /* ── Error alert ── */
        .enq-alert {
          padding:12px 16px; background:rgba(239,68,68,0.08);
          border:1px solid rgba(239,68,68,0.22); border-radius:8px;
          font-size:14px; color:#dc2626;
        }
        .dark .enq-alert { background:rgba(239,68,68,0.1); border-color:rgba(239,68,68,0.25); color:#f87171; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 lg:px-8" style={{ paddingTop: '9rem', paddingBottom: '8rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}
          className="max-lg:!grid-cols-1 max-lg:!gap-12">

          {/* ── Left: heading + info ── */}
          <div style={{ position: 'sticky', top: '6rem', alignSelf: 'start' }}>
            <p className="enq-eyebrow" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1.75rem' }}>
              Contact
            </p>
            <h1 className="enq-h1" style={{ fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.75rem' }}>
              Good call. Now give us the inside scoop — what&apos;s the project all about?
            </h1>
            <p className="enq-subtext" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.8, marginBottom: '3rem', maxWidth: 380 }}>
              Tell us what you&apos;re building and we&apos;ll get back to you within 24 hours.
            </p>
            <a href="mailto:hello.hyperfantasy@gmail.com" className="enq-email-link">
              Send an email <ArrowUpRight size={13} />
            </a>
          </div>

          {/* ── Right: form ── */}
          <div>
            {success ? (
              <div role="status" aria-live="polite" style={{ paddingTop: '3rem' }}>
                <CheckCircle size={52} strokeWidth={1.5} style={{ color: '#4ade80', marginBottom: '1.5rem' }} />
                <p className="enq-h1" style={{ fontSize: 24, fontWeight: 400, marginBottom: '0.5rem' }}>Message sent!</p>
                <p className="enq-subtext" style={{ fontSize: 15, marginBottom: '2.5rem' }}>
                  We&apos;ll be in touch within 24 hours.
                </p>
                <button onClick={() => setSuccess(false)} className="enq-reset-btn">
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Enquiry form"
                style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

                {submitError && (
                  <div role="alert" className="enq-alert">{submitError}</div>
                )}

                {/* Project Type */}
                <div className="enq-field">
                  <label className="enq-label">Project Type <span aria-hidden="true">*</span></label>
                  <div className="enq-chips" style={{ paddingTop: '6px' }}>
                    {PROJECT_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        className={`enq-chip${formData.projectType.includes(type) ? ' active' : ''}`}
                        onClick={() => toggleProjectType(type)}
                        aria-pressed={formData.projectType.includes(type)}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.projectType && <p className="enq-err" role="alert">{fieldErrors.projectType}</p>}
                </div>

                {/* Budget */}
                <div className="enq-field">
                  <label className="enq-label">Budget (USD) <span aria-hidden="true">*</span></label>
                  <div className="enq-chips" style={{ paddingTop: '6px' }}>
                    {BUDGET_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        className={`enq-chip${formData.budget === opt ? ' active' : ''}`}
                        onClick={() => {
                          set('budget', formData.budget === opt ? '' : opt)
                          setFieldErrors(prev => ({ ...prev, budget: '' }))
                        }}
                        aria-pressed={formData.budget === opt}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.budget && <p className="enq-err" role="alert">{fieldErrors.budget}</p>}
                </div>

                {/* Name + Email */}
                <div className="enq-grid">
                  <div className="enq-field">
                    <label htmlFor="name" className="enq-label">Name <span aria-hidden="true">*</span></label>
                    <input
                      id="name" autoComplete="name"
                      placeholder="Your name"
                      className={`enq-input${fieldErrors.name ? ' err' : ''}`}
                      value={formData.name}
                      onChange={e => set('name', e.target.value)}
                      onBlur={() => blur('name')}
                      aria-required="true" aria-invalid={!!fieldErrors.name}
                    />
                    {fieldErrors.name && <p className="enq-err" role="alert">{fieldErrors.name}</p>}
                  </div>
                  <div className="enq-field">
                    <label htmlFor="email" className="enq-label">Email <span aria-hidden="true">*</span></label>
                    <input
                      id="email" type="email" autoComplete="email"
                      placeholder="your@email.com"
                      className={`enq-input${fieldErrors.email ? ' err' : ''}`}
                      value={formData.email}
                      onChange={e => set('email', e.target.value)}
                      onBlur={() => blur('email')}
                      aria-required="true" aria-invalid={!!fieldErrors.email}
                    />
                    {fieldErrors.email && <p className="enq-err" role="alert">{fieldErrors.email}</p>}
                  </div>
                </div>

                {/* Company + Role */}
                <div className="enq-grid">
                  <div className="enq-field">
                    <label htmlFor="company" className="enq-label">Company</label>
                    <input
                      id="company" autoComplete="organization"
                      placeholder="Your company"
                      className="enq-input"
                      value={formData.company}
                      onChange={e => set('company', e.target.value)}
                    />
                  </div>
                  <div className="enq-field">
                    <label htmlFor="role" className="enq-label">Role</label>
                    <input
                      id="role"
                      placeholder="e.g. Product Designer, CTO"
                      className="enq-input"
                      value={formData.role}
                      onChange={e => set('role', e.target.value)}
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="enq-field">
                  <label htmlFor="message" className="enq-label">Message <span aria-hidden="true">*</span></label>
                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Describe your project goals — e.g. 'I want a website that helps me sell my products more effectively' or 'I need a dashboard to track company performance.'"
                    className={`enq-textarea${fieldErrors.message ? ' err' : ''}`}
                    value={formData.message}
                    onChange={e => set('message', e.target.value)}
                    onBlur={() => blur('message')}
                    aria-required="true" aria-invalid={!!fieldErrors.message}
                  />
                  {fieldErrors.message && <p className="enq-err" role="alert">{fieldErrors.message}</p>}
                </div>

                {/* Submit */}
                <div style={{ paddingTop: '0.5rem' }}>
                  <button type="submit" className="enq-submit" disabled={loading} aria-disabled={loading} aria-busy={loading}>
                    {loading
                      ? <span aria-live="polite">Submitting…</span>
                      : <>Submit Enquiry <ArrowUpRight size={15} aria-hidden="true" /></>}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
