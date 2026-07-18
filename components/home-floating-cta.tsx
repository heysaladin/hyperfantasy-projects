'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Send, X, Check } from 'lucide-react'

const GRADIENT = 'linear-gradient(256.86deg,#1e40af 0%,#7c3aed 55%,#be185d 100%)'
const PROJECT_TYPES = ['Website', 'Mobile App', 'Dashboard', 'Webflow Development', 'Framer Development', 'Prototype', 'Pitch Deck', 'Other']
const BUDGET_OPTIONS = ['Under $3,000', '$3,000–$5,000', '$5,000–$10,000', '$10,000+']
const EMPTY = { name: '', email: '', company: '', role: '', budget: '', message: '', projectType: [] as string[] }
const EMPTY_ERRORS = { name: '', email: '', message: '', projectType: '', budget: '' }

const FOCUSABLE = 'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'

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

export function HomeFloatingCTA({ ctaBtnId, alwaysVisible, scrollThreshold = 0 }: { ctaBtnId: string; alwaysVisible?: boolean; scrollThreshold?: number }) {
  const [visible, setVisible]   = useState(!!alwaysVisible)
  const [open, setOpen]         = useState(false)
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState(EMPTY_ERRORS)

  const [mounted, setMounted]   = useState(false)
  const [rendered, setRendered] = useState(false)

  const triggerRef  = useRef<HTMLButtonElement>(null)
  const dialogRef   = useRef<HTMLDivElement>(null)
  const headingId   = 'enquiry-modal-title'

  useEffect(() => { setMounted(true) }, [])

  // Keep button in DOM during exit animation
  useEffect(() => {
    if (visible) {
      setRendered(true)
    } else {
      const t = setTimeout(() => setRendered(false), 400)
      return () => clearTimeout(t)
    }
  }, [visible])

  // Listen for external triggers (e.g. hero / bottom CTA buttons)
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('open-enquiry-modal', handler)
    return () => window.removeEventListener('open-enquiry-modal', handler)
  }, [])

  // Scroll visibility (skipped when alwaysVisible)
  useEffect(() => {
    if (!mounted) return
    if (alwaysVisible) return

    const BOTTOM_MARGIN = 120 // px from bottom to start hiding

    const onScroll = () => {
      const scrolledEnough = window.scrollY > scrollThreshold
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - BOTTOM_MARGIN
      setVisible(scrolledEnough && !nearBottom)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [ctaBtnId, alwaysVisible, mounted, scrollThreshold])

  // Lock scroll + focus first input + Escape key when modal opens
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'

    // Focus first focusable element
    const frame = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    })

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { close(); return }
      if (e.key !== 'Tab') return

      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const close = () => {
    setOpen(false)
    setSuccess(false)
    setSubmitError('')
    setFieldErrors(EMPTY_ERRORS)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const setField = (field: keyof typeof EMPTY, value: string) => {
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

  const blurField = (field: keyof typeof EMPTY_ERRORS) => {
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
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }
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
    <>
      {/* Floating trigger button — portalled to body, only rendered when visible */}
      {mounted && rendered && createPortal(
        <div style={{
          position:  'fixed',
          bottom:     32,
          right:      32,
          zIndex:     50,
          animation: visible
            ? 'hfSlideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'hfSlideDown 0.4s ease forwards',
        }}>
          <style>{`
            @keyframes hfSlideUp   { from { transform: translateY(80px); opacity: 0 } to { transform: none; opacity: 1 } }
            @keyframes hfSlideDown { from { transform: none; opacity: 1 } to { transform: translateY(80px); opacity: 0 } }
          `}</style>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open enquiry form — Let's talk!"
            aria-haspopup="dialog"
            style={{
              background:     GRADIENT,
              color:          '#fff',
              borderRadius:   '50%',
              width:           56,
              height:          56,
              display:        'inline-flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 8px 32px rgba(0,0,0,0.3)',
              border:         'none',
              cursor:         'pointer',
            }}
          >
            <Send size={22} aria-hidden="true" />
          </button>
        </div>,
        document.body
      )}

      {/* Modal backdrop */}
      {open && (
        <div
          onClick={close}
          style={{
            position:       'fixed',
            inset:           0,
            zIndex:          100,
            background:     'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '16px',
          }}
        >
          {/* Dialog */}
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            onClick={e => e.stopPropagation()}
            style={{
              borderRadius: 20,
              width:        '100%',
              maxWidth:      520,
              maxHeight:    '90vh',
              overflowY:    'auto',
              padding:      '32px',
              position:     'relative',
              boxShadow:    '0 24px 64px rgba(0,0,0,0.4)',
            }}
            className="bg-white dark:bg-[#0d0b1e] text-slate-900 dark:text-white"
          >
            <style>{`
              .m-label {
                font-size:11px; font-weight:600; letter-spacing:0.18em;
                text-transform:uppercase; color:rgba(0,0,0,0.35);
              }
              .dark .m-label { color:rgba(255,255,255,0.35); }
              .m-input, .m-textarea {
                display:block; width:100%; background:transparent;
                border:1px solid rgba(0,0,0,0.14); border-radius:999px;
                padding:14px 20px; font-size:15px; color:#0a0a0a; outline:none;
                font-family:inherit; transition:border-color 0.2s;
                -webkit-appearance:none; box-sizing:border-box;
              }
              .m-textarea { border-radius:24px; resize:none; }
              .dark .m-input, .dark .m-textarea { border-color:rgba(255,255,255,0.14); color:#fff; }
              .m-input::placeholder, .m-textarea::placeholder { color:rgba(0,0,0,0.25); }
              .dark .m-input::placeholder, .dark .m-textarea::placeholder { color:rgba(255,255,255,0.22); }
              .m-input:focus, .m-textarea:focus { border-color:rgba(0,0,0,0.55); }
              .dark .m-input:focus, .dark .m-textarea:focus { border-color:rgba(255,255,255,0.55); }
              .m-input.err, .m-textarea.err { border-color:#f87171; }
              .m-err { font-size:12px; color:#f87171; }
              .m-chip {
                padding:9px 15px; border-radius:999px; font-size:14px; font-weight:400;
                border:1px solid rgba(0,0,0,0.12); background:#fff; color:#151515;
                cursor:pointer; user-select:none;
                transition:background 0.15s, color 0.15s, border-color 0.15s;
                white-space:nowrap; line-height:1.4;
              }
              .m-chip:hover { border-color:rgba(0,0,0,0.3); }
              .m-chip.active { background:#151515; color:#fff; border-color:#151515; }
              .dark .m-chip { background:transparent; color:rgba(255,255,255,0.65); border-color:rgba(255,255,255,0.14); }
              .dark .m-chip:hover { border-color:rgba(255,255,255,0.35); }
              .dark .m-chip.active { background:#fff; color:#151515; border-color:#fff; }
              .m-submit {
                flex:1; color:#fff; border:none; border-radius:100px;
                padding:15px 32px; font-size:15px; font-weight:600; cursor:pointer;
                display:inline-flex; align-items:center; justify-content:center; gap:8px;
                transition:opacity 0.2s; font-family:inherit;
              }
              .m-submit:hover { opacity:0.88; }
              .m-submit:disabled { opacity:0.55; cursor:not-allowed; }
              .m-cancel {
                background:transparent; border:1px solid rgba(0,0,0,0.2);
                border-radius:100px; padding:12px 24px; font-size:14px;
                color:#0a0a0a; cursor:pointer; font-family:inherit; transition:background 0.2s;
              }
              .m-cancel:hover { background:rgba(0,0,0,0.04); }
              .dark .m-cancel { border-color:rgba(255,255,255,0.2); color:#fff; }
              .dark .m-cancel:hover { background:rgba(255,255,255,0.06); }
              .m-grid { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
              @media(max-width:480px) { .m-grid { grid-template-columns:1fr; } }
            `}</style>

            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close enquiry form"
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {/* Success state */}
            {success ? (
              <div role="status" aria-live="polite" aria-atomic="true" className="text-center py-8">
                <div aria-hidden="true" style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: GRADIENT, display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                }}>
                  <Check size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <h2 id={headingId} style={{ fontSize: 24, fontWeight: 400, marginBottom: 8 }}>Message sent!</h2>
                <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.45)', marginBottom: 24 }} className="dark:!text-white/40">
                  We&apos;ll get back to you soon.
                </p>
                <button type="button" onClick={close} className="m-cancel">Close</button>
              </div>
            ) : (
              <>
                <h2 id={headingId} className="text-2xl font-semibold mb-1">Tell us about your fantasy project.</h2>
                <p className="text-slate-400 dark:text-white/30 text-xs mb-6" aria-hidden="true">
                  Fields marked <span aria-hidden="true">*</span> are required.
                </p>

                {submitError && (
                  <div role="alert" aria-live="assertive"
                    className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                  {/* Project Type */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label className="m-label">Project Type <span aria-hidden="true">*</span></label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {PROJECT_TYPES.map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => toggleProjectType(type)}
                          aria-pressed={formData.projectType.includes(type)}
                          className={`m-chip${formData.projectType.includes(type) ? ' active' : ''}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.projectType && <p role="alert" className="m-err">{fieldErrors.projectType}</p>}
                  </div>

                  {/* Budget */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <label className="m-label">Budget (USD) <span aria-hidden="true">*</span></label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {BUDGET_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setField('budget', formData.budget === opt ? '' : opt)
                            setFieldErrors(prev => ({ ...prev, budget: '' }))
                          }}
                          aria-pressed={formData.budget === opt}
                          className={`m-chip${formData.budget === opt ? ' active' : ''}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {fieldErrors.budget && <p role="alert" className="m-err">{fieldErrors.budget}</p>}
                  </div>

                  {/* Name + Email */}
                  <div className="m-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label htmlFor="modal-name" className="m-label">
                        Name <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="modal-name"
                        aria-required="true"
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'modal-name-error' : undefined}
                        autoComplete="name"
                        value={formData.name}
                        onChange={e => setField('name', e.target.value)}
                        onBlur={() => blurField('name')}
                        className={`m-input${fieldErrors.name ? ' err' : ''}`}
                        placeholder="Your name"
                      />
                      {fieldErrors.name && <p id="modal-name-error" role="alert" className="m-err">{fieldErrors.name}</p>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label htmlFor="modal-email" className="m-label">
                        Email <span aria-hidden="true">*</span>
                      </label>
                      <input
                        id="modal-email"
                        type="email"
                        aria-required="true"
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'modal-email-error' : undefined}
                        autoComplete="email"
                        value={formData.email}
                        onChange={e => setField('email', e.target.value)}
                        onBlur={() => blurField('email')}
                        className={`m-input${fieldErrors.email ? ' err' : ''}`}
                        placeholder="your@email.com"
                      />
                      {fieldErrors.email && <p id="modal-email-error" role="alert" className="m-err">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  {/* Company + Role */}
                  <div className="m-grid">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label htmlFor="modal-company" className="m-label">Company</label>
                      <input
                        id="modal-company"
                        autoComplete="organization"
                        value={formData.company}
                        onChange={e => setField('company', e.target.value)}
                        className="m-input"
                        placeholder="Company name"
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label htmlFor="modal-role" className="m-label">Role</label>
                      <input
                        id="modal-role"
                        value={formData.role}
                        onChange={e => setField('role', e.target.value)}
                        className="m-input"
                        placeholder="e.g. Product Designer, CTO"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label htmlFor="modal-message" className="m-label">
                      Message <span aria-hidden="true">*</span>
                    </label>
                    <textarea
                      id="modal-message"
                      aria-required="true"
                      aria-invalid={!!fieldErrors.message}
                      aria-describedby={fieldErrors.message ? 'modal-message-error' : undefined}
                      rows={4}
                      value={formData.message}
                      onChange={e => setField('message', e.target.value)}
                      onBlur={() => blurField('message')}
                      className={`m-textarea${fieldErrors.message ? ' err' : ''}`}
                      placeholder="Describe your project goals — e.g. 'I want a website that helps me sell my products more effectively' or 'I need a dashboard to track company performance.'"
                    />
                    {fieldErrors.message && <p id="modal-message-error" role="alert" className="m-err">{fieldErrors.message}</p>}
                  </div>

                  <div style={{ display: 'flex', gap: 12, paddingTop: 8 }}>
                    <button
                      type="submit"
                      disabled={loading}
                      aria-disabled={loading}
                      aria-busy={loading}
                      className="m-submit"
                      style={{ background: GRADIENT }}
                    >
                      {loading ? <span aria-live="polite">Sending…</span> : 'Send Enquiry'}
                    </button>
                    <button type="button" onClick={close} className="m-cancel">Cancel</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
