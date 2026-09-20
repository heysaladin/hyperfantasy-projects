# UX Audit — /works (Portfolio List) — 2026-09-20

**Scope:** `/works` (list) + `/works/[id]` (detail)
**Primary task:** Pengunjung melihat portofolio Hyperfantasy lalu membuka detail proyek
**Viewports:** 375 / 768 / 1440
**Method:** Playwright live capture + code review (Playwright connected, screenshots tersimpan di `ux-audit/screenshots/`)

---

## Summary

Halaman `/works` punya struktur dasar yang solid — grid responsif, dark/light mode, skip-to-main, dan gambar yang di-optimize. Namun ada satu **bug P0 yang merusak seluruh halaman**: field `description` di database menyimpan format TipTap JSON mentah, dan kode me-render-nya sebagai plain string — sehingga setiap card menampilkan dinding JSON `{"type":"doc","content":[...]}` ke pengunjung. Di samping itu, halaman memuat **semua portofolio sekaligus tanpa pagination** sehingga page height mencapai 66.000 px di desktop dan 179.000 px di mobile — tidak scalable. Detail page juga punya tombol back yang salah arah dan warna hardcode yang hilang di light mode.

---

## Findings

| # | Issue | Di mana | Evidence | Severity | Lens | Fix |
|---|-------|---------|----------|----------|------|-----|
| 1 | **Raw TipTap JSON muncul sebagai description di semua card** — user melihat `{"type":"doc","content":[{"type":"paragraph"...` | `app/works/page.tsx:66` | Screenshot 1440 (kolom teks abu-abu di bawah judul); a11y snapshot paragraph ref e39, e50 | **P0** | Content / Heuristic #2 (match with real world) | Strip JSON ke plain text: ekstrak `node.content[*].text` dari TipTap doc, atau simpan `plainDescription` terpisah di DB |
| 2 | **Tidak ada pagination** — semua portofolio di-fetch sekaligus, page height 66k px (desktop) / 179k px (mobile) | `app/works/page.tsx:4-10` | Screenshot menunjukkan scroll yang ekstrem; `fetch` tanpa limit/offset | **P1** | Performance / Heuristic #1 (visibility of system status) | Tambah `?page=` + `?limit=` di API, render `<Pagination>` di bawah grid; atau infinite scroll dengan IntersectionObserver |
| 3 | **Back button di detail page salah arah** — label "Back to Projects", href `/projects` — padahal user datang dari `/works` | `app/works/[id]/page.tsx:33` | Code review | **P1** | Navigation / Heuristic #3 (user control) | Ganti href ke `/works` dan label ke "Back to Works" |
| 4 | **Warna hardcode di detail page meta section rusak di light mode** — `text-white/40`, `text-white/80`, `bg-white/10` tanpa prefix `dark:` | `app/works/[id]/page.tsx:103–168` | Code review — Tech Stack, Tags, Completed, Project Scale sections | **P1** | Dark/light mode / Heuristic #4 (consistency) | Ganti ke `text-slate-500 dark:text-white/40`, `text-slate-700 dark:text-white/80`, `bg-slate-100 dark:bg-white/10` |
| 5 | **Card link tidak punya accessible name** — screen reader hanya bisa ambil teks dari konten di dalamnya, tapi role `link` sendiri unlabeled | `app/works/page.tsx:32-85` | a11y snapshot: `link [ref=e33]` tanpa name | **P2** | Accessibility / WCAG 2.2 AA | Tambah `aria-label={portfolio.title}` di `<Link>` |
| 6 | **Tidak ada image placeholder** saat `imageUrl` kosong — card tanpa gambar skip section image, bikin tinggi card tidak konsisten | `app/works/page.tsx:39` | Code review | **P2** | Visual consistency / Heuristic #4 | Render placeholder `<div className="aspect-[16/10] bg-slate-100 dark:bg-white/5 flex items-center justify-center">` saat `!portfolio.imageUrl` |
| 7 | **Tags dibatasi 3 di list, semua tampil di detail** — informasi tidak konsisten antar halaman | `app/works/page.tsx:73` vs `app/works/[id]/page.tsx:130` | Code review | **P2** | Consistency / Heuristic #4 | Konsistenkan: tampilkan semua di list (atau batasi keduanya sama), tambah "+N more" jika perlu |
| 8 | **Field `copyright` dipakai sebagai GitHub URL** — nama field menyesatkan, bisa bikin bug di masa depan | `app/works/[id]/page.tsx:65` | Code review | **P2** | Code/data semantics | Rename ke `repoUrl` atau `githubUrl` di schema dan UI |
| 9 | **Tidak ada per-page metadata** — semua halaman `/works` berbagi title "Hyperfantasy - Creative Studio Design & Development" | `app/works/page.tsx` (tidak ada `export const metadata`) | Code review | **P2** | SEO / discoverability | Tambah `export const metadata = { title: "Works — Hyperfantasy" }` di list; tambah `generateMetadata()` di detail |
| 10 | **Tidak ada filter atau sort** — dengan puluhan item dan tidak ada pagination, navigasi konten sangat susah | `app/works/page.tsx` | Screenshot — list panjang tanpa kontrol | **P3** | Efficiency / Heuristic #7 | Tambah filter chip per `category` atau `tag` di atas grid |

---

## Top 5 Quick Wins

1. **Fix JSON description (P0)** — Buat helper `extractPlainText(json: string): string` yang parse TipTap JSON dan concat semua `text` node. Pasang di `app/works/page.tsx:66` sebelum render. ~30 menit.

2. **Fix back button detail page (P1)** — Ganti satu baris: `href="/projects"` → `href="/works"`, label "Back to Projects" → "Back to Works". `app/works/[id]/page.tsx:33`. ~2 menit.

3. **Fix warna light mode di detail page (P1)** — Replace semua `text-white/` dan `bg-white/` di `app/works/[id]/page.tsx:103–168` dengan pasangan `slate-*/dark:white/`. ~15 menit.

4. **Tambah accessible name ke card link (P2)** — `<Link ... aria-label={portfolio.title}>`. `app/works/page.tsx:32`. ~2 menit.

5. **Tambah metadata halaman (P2)** — `export const metadata` di list page dan `generateMetadata` di detail page. ~10 menit.

---

## What's Working

- **Skip to main content** ada dan terkonfigurasi dengan baik (`app/layout.tsx:75-80`)
- **Dark/light mode** berfungsi dengan baik di list page (hanya detail yang bermasalah)
- **Image optimization** menggunakan `next/image` dengan `width`/`height` yang benar
- **Responsive grid** — 1/2/3 kolom sudah tepat di 375/768/1440
- **Empty state** ada dan terender dengan benar
- **Hover animation** pada gambar (`group-hover:scale-105`) halus dan on-brand
- **Heading hierarchy** benar: `h1` "Our Work" → `h3` per card

---

## Open Questions

1. Apakah `description` dan `longDescription` di DB memang selalu TipTap JSON, atau ada data yang plain text? Perlu cek sebelum strip — regex fallback mungkin diperlukan.
2. Berapa jumlah portofolio yang direncanakan jangka panjang? Ini menentukan apakah pagination atau infinite scroll lebih cocok.
3. Apakah halaman `/works` dan `/projects` intentional berbeda, atau duplikat? Back button di detail page menunjukkan ada kebingungan.
4. Apakah filter by category/tag sudah ada di backlog atau belum diprioritaskan?
