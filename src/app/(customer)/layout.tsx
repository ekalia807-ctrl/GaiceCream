import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { PoBanner } from "@/components/layout/PoBanner";
import { getSessionUser } from "@/lib/data/auth";
import { getOpenPo } from "@/lib/data/po";
import { getSiteSettings } from "@/lib/data/settings";
import { whatsappUrl } from "@/lib/whatsapp";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [site, user, po] = await Promise.all([
    getSiteSettings(),
    getSessionUser(),
    getOpenPo(),
  ]);
  const chatUrl = whatsappUrl(site.whatsapp.defaultMessage, site.whatsapp.international);

  return (
    // overflow-x-clip (bukan overflow-hidden) agar header tetap sticky
    <div className="min-h-screen overflow-x-clip">
      <PoBanner po={po} instagramUrl={site.social.instagram} />
      <Header
        whatsappUrl={chatUrl}
        account={user ? { name: user.fullName || user.email, isAdmin: user.role === "admin" } : null}
      />
      {children}
      <Footer site={site} />
      <MobileBottomNav whatsappUrl={chatUrl} />
    </div>
  );
}
