# UX Audit — /projects — 2026-09-20

**Scope:** `/projects` (list + filter + modal)
**Primary task:** Pengunjung menjelajah portofolio, memfilter berdasarkan kategori/tag/warna/tahun, membuka detail proyek
**Viewports:** 375 / 1440
**Method:** Playwright live capture + code review

---

## Summary

Halaman `/projects` jauh lebih matang dari `/works` — sudah punya filter lengkap, infinite scroll, masonry grid, session cache, skeleton loading, dan TipTap content sudah di-resolve dengan benar via `resolveContentAsText`. Tidak ada bug data-rendering seperti di `/works`. Temuan di sini lebih ke polish, aksesibilitas, dan satu feature gap di mobile. Secara keseluruhan halaman ini sudah layak production.

---

## Findings

| # | Issue | Di mana | Evidence | Severity | Lens | Fix |
|---|-------|---------|----------|----------|------|-----|
| 1 | **Tidak ada page `<title>`** — karena `'use client'`, tidak bisa `export const metadata`. Tab browser dan screen reader selalu baca "Hyperfantasy - Creative Studio Design & Development" | `app/projects/page.tsx:1` | Browser tab title di screenshot | **P1** | SEO / Heuristic #1 | Pisah jadi Server Component wrapper + Client Component dalam, sehingga wrapper bisa export `metadata = { title: 'Projects — Hyperfantasy' }` |
| 2 | **Card tanpa `imageUrl` render kotak abu kosong** — tidak ada teks fallback, terlihat seperti bug/broken image | `app/projects/page.tsx:183-188` | Screenshot 1440 + 375 — bagian bawah grid penuh kotak abu | **P1** | Visual / Heuristic #4 | Tambah fallback di dalam `{portfolio.imageUrl && ...}`: render `<div className="aspect-[4/3] flex items-center justify-center bg-slate-100 dark:bg-white/5"><span className="text-slate-300 dark:text-white/20 text-sm">No image</span></div>` |
| 3 | **Modal close button tidak punya `aria-label`** — hanya icon `X`, screen reader baca "button" tanpa konteks | `app/projects/page.tsx:986` | Code review: `<RadixDialog.Close>` tanpa label | **P2** | Accessibility / WCAG 2.2 AA | Tambah `aria-label="Close"` di `RadixDialog.Close` |
| 4 | **Card link tidak punya accessible name** — `<Link>` di `PortfolioCard` tidak punya `aria-label`, screen reader harus crawl seluruh konten card | `app/projects/page.tsx:227` | Code review | **P2** | Accessibility / WCAG 2.2 AA | Tambah `aria-label={portfolio.title}` di `<Link>` |
| 5 | **`<img>` raw, bukan `next/image`** — kehilangan automatic srcset, priority hints, dan blur placeholder | `app/projects/page.tsx:184` | Code review | **P2** | Performance / Core Web Vitals | Ganti ke `<Image>` dari `next/image`; set `sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"` |
| 6 | **Perbedaan perilaku klik card (modal vs. halaman detail) tidak terlihat di mobile** — `long` complexity → halaman detail, `short` → modal. Sinyal satu-satunya (ikon `↗` hover) tidak muncul di touchscreen | `app/projects/page.tsx:189-195, 617-623` | Screenshot 375 — tidak ada affordance visual perbedaan | **P2** | User control / Heuristic #3 | Tambah label kecil atau badge "View Project" / "Quick View" yang selalu visible, bukan hanya on-hover |
| 7 | **Tag shortcuts hilang di mobile** (`hidden lg:block`) — fitur navigasi cepat tidak tersedia di 375px | `app/projects/page.tsx:899` | Screenshot 375 — tidak ada tag bar | **P2** | Mobile ergonomics | Tampilkan tag bar di mobile dengan horizontal scroll: `overflow-x-auto flex-nowrap` + `snap-x` |
| 8 | **Filter/sort panel tidak tutup dengan Escape** — tidak ada `onKeyDown` handler untuk kedua panel | `app/projects/page.tsx:583-596` | Code review | **P3** | Keyboard nav / Heuristic #3 | Tambah `useEffect` listen `keydown` → `Escape` → tutup panel aktif |
| 9 | **Arah date range slider non-standard** — newest di kiri, oldest di kanan; berlawanan dengan konvensi timeline kiri→kanan | `app/projects/page.tsx:826-831` | Code review + label `{yearRange[1]}` di kiri | **P3** | Consistency / Heuristic #4 | Balik arah slider: oldest kiri, newest kanan; atau tampilkan tooltip label "From / To" supaya jelas |

---

## Top 5 Quick Wins

1. **Modal close `aria-label` (P2)** — satu atribut, dua kata. `app/projects/page.tsx:986`. ~1 menit.

2. **Card link `aria-label` (P2)** — tambah `aria-label={portfolio.title}` di `<Link>` dalam `PortfolioCard`. `app/projects/page.tsx:227`. ~2 menit.

3. **Fallback untuk card tanpa image (P1)** — replace `{portfolio.imageUrl && ...}` dengan conditional yang selalu render box, dengan fallback teks di dalamnya. `app/projects/page.tsx:183`. ~10 menit.

4. **Page title (P1)** — buat `app/projects/layout.tsx` dengan `export const metadata = { title: 'Projects — Hyperfantasy' }`. Tidak perlu refactor komponen. ~5 menit.

5. **Tag bar mobile (P2)** — hapus `hidden lg:block`, ganti container dengan `overflow-x-auto` dan `flex-nowrap`. `app/projects/page.tsx:899`. ~5 menit.

---

## What's Working

- **TipTap content** sudah di-resolve dengan benar: `resolveContentAsText` di card, `resolveContent` (HTML) di modal
- **Filter lengkap**: kategori, complexity, color group, date range, featured — semua client-side, instant
- **Infinite scroll** dengan IntersectionObserver + sentinel — tidak ada pagination button yang perlu diklik
- **Session cache 5 menit** — navigasi bolak-balik instan tanpa re-fetch
- **Skeleton loading** yang sesuai dengan layout card
- **Masonry grid custom** dengan ResizeObserver — height cards otomatis ter-equalize per kolom
- **Dark/light mode** konsisten di seluruh komponen (tidak ada hardcode warna seperti di `/works/[id]`)
- **Accessible range slider** — `role="slider"`, `aria-valuemin/max/now`, keyboard arrow support
- **Search input** punya `<label htmlFor>` yang benar
- **Stagger animation** hanya untuk page pertama, card selanjutnya muncul langsung — tidak annoying saat scroll
- **"All projects loaded"** end indicator — jelas kapan scroll sudah selesai

---

## Open Questions

1. Apakah perbedaan `short` (modal) vs `long` (halaman detail) adalah keputusan arsitektur yang tetap, atau bisa disederhanakan ke satu pola?
2. Apakah ada rencana untuk menambah image ke semua portofolio? Kalau ya, fallback placeholder bisa temporary.
3. Kompleksitas "Short" dan "Long" — apakah label ini ditampilkan ke pengunjung di tempat lain? Karena label tersebut agak teknis untuk end-user.
