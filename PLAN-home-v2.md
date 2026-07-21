# Homepage v2 — Plan

> hyperfantasy.co — rencana restrukturisasi halaman home
> Status: 📋 Draft — 2026-07-14

## Struktur section

| # | Sekarang | Usulan v2 | Perubahan |
|---|----------|-----------|-----------|
| 1 | Hero + CTA | Hero + CTA | Tetap (copy sudah diperbaiki: "your fantasy **to** life!") |
| 2 | About (generik) | **Logo klien (trust strip)** | 🔵 Naik ke bawah hero, self-host |
| 3 | What We Do (7 ikon flat) | **About: 1 studio, 5 tim spesialis** | 🔵 Reposisi narasi |
| 4 | Our Works (3 ID hardcode) | **Services + deskripsi per tim** | 🔵 Tambah konteks |
| 5 | Our Shots | **Selected Works (flag DB)** | 🔵 Dari admin, bukan hardcode |
| 6 | Logo klien (hotlink) | Our Shots | Tetap |
| 7 | Testimonial (20 item) | **Testimonial kurasi 6–8** | 🔵 Kurasi |
| 8 | CTA video | **Artikel terbaru (3 post)** | 🔵 Section baru |
| 9 | — | CTA video | Tetap |

## Konten

1. **Trust strip logo klien** — pindah ke bawah hero agar social proof muncul lebih awal. Ganti hotlink `hyperfantasy.web.app` dengan file lokal `/logos/` (sudah dipakai di halaman About).
2. **About reposisi** — cerita "satu studio, lima tim spesialis" dengan link ke halaman team: heysaladin, Dravenclaw, Thinksoft, Mitayani, Hikari. Struktur unik ini jadi selling point, bukan tagline generik.
3. **Services + deskripsi** — 1 kalimat per service, dikaitkan ke tim yang mengerjakannya. Bukan sekadar 7 ikon.
4. **Kurasi testimonial** — tampilkan 6–8 terkuat (yang menyebut hasil konkret) di home; daftar lengkap tetap di halaman About.
5. **Section artikel** — 3 artikel terbaru sebelum CTA. Halaman Articles sudah ada tapi tidak pernah di-surface di home.

## Teknis

6. **Flag `isFeatured` di Prisma** — ganti `WORKS_IDS` / `SHOTS_IDS` hardcode di `app/page.tsx` agar featured works bisa diatur dari admin panel tanpa deploy.
   - Migrasi schema: tambah kolom `isFeatured Boolean @default(false)` (atau `featuredOrder Int?` kalau butuh urutan).
   - Update admin panel: toggle featured per portfolio.
7. **Yang tidak diubah** — Hero, CTA video, Shots. Sudah kuat.

## Urutan kerja

| Tahap | Item | Effort |
|-------|------|--------|
| 1 | Self-host logo + pindah trust strip (item 1) | Cepat |
| 2 | About reposisi + services deskripsi (item 2–3) | Sedang |
| 3 | Kurasi testimonial + section artikel (item 4–5) | Sedang |
| 4 | Flag `isFeatured` + admin toggle (item 6) | Butuh migrasi schema |
