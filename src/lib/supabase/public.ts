import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./env";

/**
 * Klien Supabase tanpa sesi login, khusus membaca data publik (produk aktif, PO, pengaturan toko).
 * Tidak membaca cookie, sehingga hasilnya boleh di-cache dan halaman bisa dibuat statis.
 * Keamanan tetap dijaga RLS (anon hanya boleh membaca data publik).
 */
export function createPublicClient() {
  const { url, key } = getSupabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
