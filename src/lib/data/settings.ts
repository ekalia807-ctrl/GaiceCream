import { siteConfig, type SiteConfig } from "@/config/site";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { PUBLIC_DATA_TAG } from "./tags";
import { formatLocalPhone, toInternationalPhone } from "@/lib/phone";

/**
 * Pengaturan toko dari database, digabung dengan nilai bawaan di config/site.ts.
 * Jika database belum bisa dibaca, website tetap tampil dengan nilai bawaan.
 */
export async function getSiteSettings(): Promise<SiteConfig> {
  try {
    return await loadSiteSettings();
  } catch {
    return siteConfig;
  }
}

const loadSiteSettings = unstable_cache(
  async (): Promise<SiteConfig> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("store_settings").select("*").eq("id", "store").maybeSingle();
    if (error) throw new Error(error.message);
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
  },
  ["public-site-settings"],
  { revalidate: 60, tags: [PUBLIC_DATA_TAG] },
);
