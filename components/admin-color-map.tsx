'use client'

import { useEffect, useRef, useState, useMemo } from 'react'

const COLOR_GROUPS = [
  { name: 'Red',    swatch: '#E53E3E' },
  { name: 'Orange', swatch: '#ED8936' },
  { name: 'Yellow', swatch: '#ECC94B' },
  { name: 'Green',  swatch: '#48BB78' },
  { name: 'Blue',   swatch: '#4299E1' },
  { name: 'Purple', swatch: '#9F7AEA' },
  { name: 'Pink',   swatch: '#ED64A6' },
  { name: 'Brown',  swatch: '#975A16' },
  { name: 'Black',  swatch: '#1A202C' },
  { name: 'White',  swatch: '#F7FAFC' },
  { name: 'Grey',   swatch: '#A0AEC0' },
]

function hexToHsl(hex: string): [number, number, number] | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

function ColorDotCanvas({ portfolios }: { portfolios: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; hex: string } | null>(null)

  // Dots with computed positions
  const dots = useMemo(() => {
    return portfolios
      .filter(p => p.colorHex)
      .map(p => {
        const hsl = hexToHsl(p.colorHex)
        if (!hsl) return null
        const [h, s, l] = hsl
        // X = hue (0-360 → 0-1), Y = 1 - lightness (bright at top, dark at bottom)
        return { title: p.title, hex: p.colorHex, nx: h / 360, ny: 1 - l }
      })
      .filter(Boolean) as { title: string; hex: string; nx: number; ny: number }[]
  }, [portfolios])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height

    // Hue gradient (left to right)
    const hueGrad = ctx.createLinearGradient(0, 0, W, 0)
    for (let i = 0; i <= 12; i++) {
      hueGrad.addColorStop(i / 12, `hsl(${(i / 12) * 360}, 100%, 50%)`)
    }
    ctx.fillStyle = hueGrad
    ctx.fillRect(0, 0, W, H)

    // White overlay fading from top
    const whiteGrad = ctx.createLinearGradient(0, 0, 0, H * 0.55)
    whiteGrad.addColorStop(0, 'rgba(255,255,255,0.65)')
    whiteGrad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = whiteGrad
    ctx.fillRect(0, 0, W, H)

    // Black overlay fading toward bottom
    const blackGrad = ctx.createLinearGradient(0, H * 0.45, 0, H)
    blackGrad.addColorStop(0, 'rgba(0,0,0,0)')
    blackGrad.addColorStop(1, 'rgba(0,0,0,0.72)')
    ctx.fillStyle = blackGrad
    ctx.fillRect(0, 0, W, H)

    // Draw diamond dots
    for (const dot of dots) {
      const x = dot.nx * W
      const y = dot.ny * H
      const size = 7

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(Math.PI / 4)
      ctx.strokeStyle = 'rgba(255,255,255,0.88)'
      ctx.lineWidth = 1.5
      ctx.shadowColor = 'rgba(0,0,0,0.5)'
      ctx.shadowBlur = 4
      ctx.strokeRect(-size / 2, -size / 2, size, size)
      ctx.restore()
    }
  }, [dots])

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = ((e.clientX - rect.left) / rect.width) * canvas.width
    const my = ((e.clientY - rect.top) / rect.height) * canvas.height

    const hit = dots.find(d => {
      const dx = d.nx * canvas.width - mx
      const dy = d.ny * canvas.height - my
      return Math.abs(dx) < 10 && Math.abs(dy) < 10
    })

    if (hit) {
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        title: hit.title,
        hex: hit.hex,
      })
    } else {
      setTooltip(null)
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '3/1' }}>
      <canvas
        ref={canvasRef}
        width={900}
        height={300}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap flex items-center gap-1.5"
          style={{ left: tooltip.x + 10, top: tooltip.y - 28 }}
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/30"
            style={{ backgroundColor: tooltip.hex }}
          />
          {tooltip.title}
        </div>
      )}
      {dots.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/60 text-sm">No portfolios with color hex assigned</span>
        </div>
      )}
    </div>
  )
}

export default function AdminColorMap() {
  const [portfolios, setPortfolios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/portfolios')
      .then(r => r.json())
      .then(data => {
        setPortfolios(Array.isArray(data) ? data : [])
        setLoading(false)
      })
  }, [])

  const grouped = useMemo(() => {
    const map: Record<string, number> = {}
    for (const g of COLOR_GROUPS) map[g.name] = 0
    map['Unassigned'] = 0
    for (const p of portfolios) {
      const g = p.colorGroup
      if (g && map[g] !== undefined) map[g]++
      else map['Unassigned']++
    }
    return map
  }, [portfolios])

  const totalAssigned = portfolios.filter(p => p.colorGroup).length
  const totalUnassigned = portfolios.filter(p => !p.colorGroup).length

  return (
    <section className="border border-slate-200 dark:border-white/10 rounded-2xl p-6">
      <h2 className="text-lg font-bold mb-6">Colors in Portfolios</h2>

      {/* Color Map */}
      <div className="mb-2">
        <div className="flex items-baseline gap-3 mb-4">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-white/50 uppercase tracking-wider">Color Map</h3>
          <span className="text-xs text-slate-400 dark:text-white/30">
            {portfolios.length} portfolios &mdash; {totalAssigned} assigned, {totalUnassigned} unassigned
          </span>
        </div>

        {loading ? (
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-10 w-28 rounded-lg bg-slate-100 dark:bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {[...COLOR_GROUPS, { name: 'Unassigned', swatch: null }]
              .sort((a, b) => (grouped[b.name] ?? 0) - (grouped[a.name] ?? 0))
              .map(({ name, swatch }) => {
              const count = grouped[name] ?? 0
              return (
                <div
                  key={name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
                >
                  {swatch ? (
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shrink-0"
                      style={{ backgroundColor: swatch }}
                    />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-dashed border-slate-400 dark:border-white/30 shrink-0" />
                  )}
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-sm font-bold tabular-nums text-slate-500 dark:text-white/50">{count}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 dark:border-white/10 my-6" />

      {/* Hue Distribution */}
      <div>
        <div className="flex items-baseline gap-3 mb-3">
          <h3 className="text-sm font-semibold text-slate-600 dark:text-white/50 uppercase tracking-wider">Hue Distribution</h3>
          <span className="text-xs text-slate-400 dark:text-white/30">
            {portfolios.filter(p => p.colorHex).length} with color hex &mdash; X: hue &nbsp;·&nbsp; Y: lightness
          </span>
        </div>
        {loading ? (
          <div className="rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse" style={{ aspectRatio: '3/1' }} />
        ) : (
          <ColorDotCanvas portfolios={portfolios} />
        )}
      </div>
    </section>
  )
}
