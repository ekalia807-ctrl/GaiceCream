import { siteConfig, type SiteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/server";
import { formatLocalPhone, toInternationalPhone } from "@/lib/phone";

/**
 * Pengaturan toko dari database, digabung dengan nilai bawaan di config/site.ts.
 * Jika database belum bisa dibaca, website tetap tampil dengan nilai bawaan.
 */
export async function getSiteSettings(): Promise<SiteConfig> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("store_settings").select("*").eq("id", "store").maybeSingle();
    if (!data) return siteConfig;

    const whatsappLocal = String(data.whatsapp || siteConfig.whatsapp.local);
    return {
      ...siteConfig,
      name: String(data.store_name || siteConfig.name),
      whatsapp: {
        ...siteConfig.whatsapp,
        local: whatsappLocal,
        international: toInternationalPhone(whatsappLocal),
        display: formatLocalPhone(whatsappLocal),
      },
      email: String(data.email ?? ""),
      address: String(data.address ?? ""),
      social: {
        instagram: String(data.instagram ?? ""),
        tiktok: String(data.tiktok ?? ""),
      },
    };
  } catch {
    return siteConfig;
  }
}
