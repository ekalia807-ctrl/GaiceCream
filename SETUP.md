# Panduan setup Supabase untuk GAICREAM

Ikuti urutan ini. Semua langkah dilakukan sekali saja.

## 1. Buat project Supabase
1. Buka https://supabase.com, masuk, lalu klik **New project**.
2. Isi nama (mis. `gaicream`), buat **Database Password** (simpan di tempat aman), pilih region terdekat (mis. Singapore), lalu **Create new project**. Tunggu sampai selesai.

## 2. Buat tabel dan aturan keamanan
1. Di dashboard Supabase buka **SQL Editor** > **New query**.
2. Buka file `supabase/migrations/0001_init.sql` di proyek ini, salin seluruh isinya, tempel ke SQL Editor, lalu klik **Run**.
3. Buat query baru, salin isi `supabase/seed.sql`, lalu **Run**. Ini mengisi 6 produk awal (cek harga, modal, dan stoknya nanti di dashboard admin).
4. Jika ada pesan error merah, jangan lanjut: kirim pesan error-nya ke saya.

## 3. Isi file `.env.local`
1. Di Supabase buka **Project Settings** > **API** (atau **API Keys**).
2. Salin **Project URL** dan **anon key** (atau **publishable key**).
3. Di folder proyek, salin `.env.example` menjadi `.env.local`, lalu isi:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_key_di_sini
   ```
4. Jangan pernah memasukkan `service_role` key ke proyek ini, dan jangan membagikan `.env.local`.

## 4. Atur login (Authentication)
1. **Authentication** > **URL Configuration**: isi **Site URL** dengan `http://localhost:3000`, lalu tambahkan `http://localhost:3000/auth/callback` ke **Redirect URLs**.
2. (Opsional, memudahkan uji coba) **Authentication** > **Providers** > **Email**: matikan **Confirm email** agar pendaftar langsung bisa masuk. Untuk website yang sudah dipakai pelanggan, sebaiknya aktifkan kembali.

## 5. Jalankan website
```bash
npm install
npm run dev
```
Buka http://localhost:3000.

## 6. Jadikan akun Anda admin
1. Buka http://localhost:3000/daftar dan daftar dengan email Anda.
2. Di Supabase **SQL Editor**, jalankan (ganti emailnya):
   ```sql
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'email-anda@contoh.com');
   ```
3. Keluar lalu masuk lagi. Menu akun di header sekarang punya **Dashboard Admin**.

## 7. Siapkan toko
Di `/admin`:
1. **Periode PO** > **Buka PO Baru** (isi nama, tanggal ready, kuota bila perlu). Tanpa PO yang dibuka, pelanggan tidak bisa memesan.
2. **Produk**: cek harga, **modal per pcs**, stok, dan gambar.
3. **Pengaturan**: isi nomor WhatsApp, link Instagram, email, dan alamat.

## 8. Uji alur pemesanan
1. Daftar akun kedua (pakai jendela penyamaran/incognito) sebagai pelanggan, lalu pesan beberapa rasa.
2. Di admin: lihat pesanan masuk di **Pesanan**, ubah status sampai **Selesai**, lalu cek **Ringkasan** dan **Laporan Keuangan**.
3. Coba **Batalkan** satu pesanan: stok produk harus kembali.

## Catatan keamanan
- Hak akses dijaga oleh Row Level Security (RLS) di database, bukan hanya oleh tampilan. Pelanggan hanya bisa melihat pesanannya sendiri.
- Harga, stok, kuota PO, dan nomor pesanan dihitung di database saat pesanan dibuat, jadi tidak bisa dimanipulasi dari browser.
- Peran admin hanya bisa diberikan lewat SQL Editor oleh pemilik project.

## Deploy (misalnya Vercel)
1. Tambahkan dua variabel environment yang sama seperti `.env.local`.
2. Di Supabase **Authentication** > **URL Configuration**: ganti **Site URL** dengan domain Anda dan tambahkan `https://domain-anda/auth/callback` ke **Redirect URLs**.

## Masalah umum
- **"Supabase belum dikonfigurasi"**: `.env.local` belum diisi atau server belum dijalankan ulang.
- **Data produk tidak muncul**: `seed.sql` belum dijalankan.
- **Tidak bisa membuka /admin**: peran akun belum diubah menjadi `admin` (langkah 6).
- **Pesan "PO sedang ditutup"**: buka PO di Admin > Periode PO.
