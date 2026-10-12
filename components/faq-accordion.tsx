'use client'

import { useState } from 'react'

type FaqItem = { q: string; a: string }

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="faq-layout">

      {/* Left: sticky heading */}
      <div className="faq-heading-box">
        <span className="hf-label">FAQ</span>
        <h2 className="hf-title hf-h2">
          Frequently asked<br />questions.
        </h2>
      </div>

      {/* Right: accordion list */}
      <div className="faq-list">
        {items.map(({ q, a }, i) => {
          const panelId = `faq-panel-${i}`
          return (
          <div key={q} className="faq-item">
            <button
              id={`faq-btn-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={panelId}
              className="faq-toggle hf-title"
            >
              <span className="faq-question">{q}</span>
              <div className="faq-icon" aria-hidden="true">
                <div className="faq-icon-h" />
                <div className={`faq-icon-v${open === i ? ' faq-icon-v-hidden' : ''}`} />
              </div>
            </button>
            <div id={panelId} aria-labelledby={`faq-btn-${i}`} className={`faq-content${open === i ? ' open' : ''}`}>
              <div className="faq-content-inner">
                <p>{a}</p>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
