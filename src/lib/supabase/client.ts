import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/** Klien Supabase untuk komponen client (browser). */
export function createClient() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
}
