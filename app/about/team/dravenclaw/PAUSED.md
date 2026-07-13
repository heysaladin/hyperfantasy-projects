# Dravenclaw — Illustration Studio

> **STATUS: ⏸ PAUSED** — sejak 2026-07-13
> Bagian dari hyperfantasy.co (`/about/team/dravenclaw`)

## Apa ini
Halaman team untuk Dravenclaw — illustration studio (character
illustration, concept art, editorial illustration, commercial art).

## Kondisi terakhir
- `page.tsx` sudah jadi dengan gaya sendiri: hero full-screen dark,
  about, services "Our Craft", marquee specializations, portfolio
  grid, dan contact/CTA dark.
- Portfolio gabungan dua sumber:
  - Lokal: `data/portfolios.ts`
  - DB (Prisma): kategori `Illustration`, projectDate >= 2011.

## What next (kalau dilanjut)
- [ ] Tambah ilustrasi baru lewat admin, atau ke `data/portfolios.ts`
- [ ] Pertimbangkan migrasi entries lokal ke DB biar satu sumber

## Syarat dilanjut
Ikut project utama hyperfantasy.co — lihat konteks pause di repo root.
