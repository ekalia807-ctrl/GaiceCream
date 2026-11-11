import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { OrderFlow } from "@/components/order/OrderFlow";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { getSessionUser } from "@/lib/data/auth";
import { getOpenPo } from "@/lib/data/po";
import { getProducts } from "@/lib/data/products";
import { getSiteSettings } from "@/lib/data/settings";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Cara Pesan" };

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ rasa?: string | string[] }>;
}) {
  const [{ rasa }, products, po, user, site] = await Promise.all([
    searchParams,
    getProducts(),
    getOpenPo(),
    getSessionUser(),
    getSiteSettings(),
  ]);

  if (!po) {
    return (
      <main className="min-h-[70vh] bg-[#fffaf4] pb-[90px]">
        <PageHero
          compact
          eyebrow="Pre-order"
          title="PO sedang ditutup"
          description="Pemesanan dibuka per periode pre-order. Pantau Instagram kami untuk info PO berikutnya."
        />
        <div className="mx-auto mt-[45px] flex w-[min(520px,92vw)] flex-col gap-[12px] rounded-[24px] bg-white p-[32px] text-center shadow-soft">
          <p className="text-[13px] leading-[1.7] text-muted">
            Sambil menunggu, kamu bisa melihat pilihan rasa atau bertanya langsung lewat WhatsApp.
          </p>
          {site.social.instagram && (
            <ButtonLink href={site.social.instagram} external full>
              <ExternalLink size={18} strokeWidth={1.8} aria-hidden="true" />
              Buka Instagram
            </ButtonLink>
          )}
          <ButtonLink
            href={whatsappUrl(site.whatsapp.defaultMessage, site.whatsapp.international)}
            external
            variant="secondary"
            full
          >
            Tanya via WhatsApp
          </ButtonLink>
          <ButtonLink href="/katalog" variant="secondary" full>
            Lihat katalog
          </ButtonLink>
        </div>
      </main>
    );
  }

  const initialProductId =
    typeof rasa === "string" &&
    products.some((product) => product.id === rasa && product.stock > 0)
      ? rasa
      : undefined;

  return (
    <main className="min-h-[70vh] bg-[#fffaf4] pb-[90px]">
      <PageHero
        compact
        eyebrow="Pesan dengan mudah"
        title="Happiness is one order away"
        description="Isi detail pesananmu, kami siapkan yang paling fresh."
      />
      <OrderFlow
        products={products}
        initialProductId={initialProductId}
        po={po}
        defaults={{ name: user?.fullName ?? "", whatsapp: user?.whatsapp ?? "" }}
        whatsappNumber={site.whatsapp.international}
      />
    </main>
  );
}
