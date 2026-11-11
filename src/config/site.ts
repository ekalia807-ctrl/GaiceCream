import { formatLocalPhone, toInternationalPhone } from "@/lib/phone";

const WHATSAPP_LOCAL = "082146376899";

export type SiteConfig = {
  name: string;
  tagline: string;
  title: string;
  description: string;
  whatsapp: {
    local: string;
    international: string;
    display: string;
    defaultMessage: string;
  };
  email: string;
  address: string;
  openingHours: { label: string; hours: string }[];
  social: { instagram: string; tiktok: string };
};

/**
 * Data bisnis. Field yang dikosongkan sengaja tidak ditampilkan di website
 * sampai Anda mengisinya (nanti bisa dipindah ke database/Pengaturan admin).
 */
export const siteConfig: SiteConfig = {
  name: "GAICREAM",
  tagline: "crunch into happiness",
  title: "GAICREAM | Gabin Ice Cream",
  description:
    "Gabin renyah dengan isian es krim creamy aneka rasa. Dibuat fresh untuk menemani setiap momen manismu.",
  whatsapp: {
    local: WHATSAPP_LOCAL,
    international: toInternationalPhone(WHATSAPP_LOCAL),
    display: formatLocalPhone(WHATSAPP_LOCAL),
    defaultMessage: "Halo GAICREAM, saya ingin bertanya tentang produk.",
  },
  email: "",
  address: "",
  // Contoh isi: [{ label: "Senin–Sabtu", hours: "09.00 – 20.00 WIB" }]
  openingHours: [],
  social: {
    instagram: "https://www.instagram.com/gaicream.id",
    tiktok: "",
  },
};

export const customerNav = [
  { href: "/", label: "Home" },
  { href: "/katalog", label: "Katalog" },
  { href: "/pesan", label: "Cara Pesan" },
  { href: "/tentang", label: "Tentang Kami" },
] as const;
