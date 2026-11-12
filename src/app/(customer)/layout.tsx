import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PoBanner } from "@/components/layout/PoBanner";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { getOpenPo } from "@/lib/data/po";
import { getSiteSettings } from "@/lib/data/settings";
import { whatsappUrl } from "@/lib/whatsapp";

// Halaman publik dibuat statis dan disegarkan tiap 60 detik (atau langsung saat admin mengubah data).
// Info akun login dibaca di browser (lihat Header), bukan di server, supaya cache bisa dipakai.
export const revalidate = 60;

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, po] = await Promise.all([getSiteSettings(), getOpenPo()]);
  const chatUrl = whatsappUrl(site.whatsapp.defaultMessage, site.whatsapp.international);

  return (
    <ToastProvider>
      {/* overflow-x-clip (bukan overflow-hidden) agar header tetap sticky */}
      <div className="min-h-screen overflow-x-clip">
        <PoBanner po={po} instagramUrl={site.social.instagram} />
        <Header whatsappUrl={chatUrl} />
        {children}
        <Footer site={site} />
        <MobileBottomNav whatsappUrl={chatUrl} />
      </div>
    </ToastProvider>
  );
}
