# GAICREAM

Website bisnis gabin ice cream GAICREAM: Next.js (App Router), TypeScript, Tailwind CSS v4, dan Supabase.

## Menjalankan

Butuh Node.js 20 atau lebih baru.

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # cek TypeScript
npm run build      # build produksi
```

## Struktur folder

```
public/images/            logo dan foto produk (dari desain Figma)
src/app/                  route (App Router)
  layout.tsx              layout root: font, metadata
  globals.css             design tokens (warna, font, bayangan)
  (customer)/             halaman customer, berbagi header + footer
  admin/                  dashboard admin: ringkasan, produk, pesanan, pelanggan,
                          laporan, pemasukan & pengeluaran, pengaturan
src/components/
  ui/                     Button, Eyebrow, PageHero (komponen dasar)
  layout/                 Brand, Header, Footer, MobileBottomNav
  home/                   seksi halaman Home
  product/                ProductCard, ProductDetailModal, CatalogBrowser
  order/                  OrderFlow (form multi-rasa), OrderSummary, OrderSuccess
  admin/                  shell admin, tabel, modal, grafik (charts/), tampilan per halaman (views/)
src/config/site.ts        data bisnis: nama, nomor WhatsApp, menu
src/lib/                  helper (utils, phone, whatsapp, order)
src/lib/data/             akses data customer di server (produk, PO, pengaturan, sesi)
src/lib/admin/            analitik, periode, export PDF/Excel, repository admin (Supabase)
src/lib/supabase/         klien Supabase, mapper, koleksi data, storage
src/app/actions/          server action (membuat pesanan)
src/hooks/                useAdminData, usePeriod, useHydrated
src/lib/validation/       skema Zod
src/types/                tipe data
```

## Mengubah data bisnis

Edit `src/config/site.ts`. Field `email`, `address`, `openingHours`, dan `social` yang masih kosong tidak ditampilkan di website sampai diisi.

## Supabase (Tahap 6)

Website memakai Supabase untuk database, login, dan penyimpanan gambar. **Ikuti `SETUP.md` sebelum menjalankan `npm run dev`**, karena semua halaman membutuhkan `.env.local`.

- `supabase/migrations/0001_init.sql`: tabel, aturan keamanan (RLS), dan fungsi pemesanan/PO.
- `supabase/seed.sql`: data produk awal.
- `src/lib/supabase/`: klien browser/server, middleware sesi, koleksi data admin, upload gambar.
- `src/middleware.ts`: `/pesan` dan `/riwayat` wajib login; `/admin` wajib login dan berperan admin.
- Dashboard admin: `/admin` (ringkasan, produk, pesanan, periode PO, pelanggan, laporan, pemasukan & pengeluaran, pengaturan).
