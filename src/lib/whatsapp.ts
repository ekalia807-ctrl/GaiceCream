import { siteConfig } from "@/config/site";

/** Link wa.me. Nomor (format internasional, mis. 6282146376899) default dari konfigurasi. */
export function whatsappUrl(message?: string, number: string = siteConfig.whatsapp.international) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
