import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/PageHero";
import { getSessionUser } from "@/lib/data/auth";
import { getSiteSettings } from "@/lib/data/settings";
import { formatDateTime } from "@/lib/format";
import { deliveryLabels } from "@/lib/order";
import { createClient } from "@/lib/supabase/server";
import { orderFromRow } from "@/lib/supabase/mappers";
import { formatIDR } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Pesanan Saya" };

export default async function OrderHistoryPage() {
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/riwayat");

  const supabase = await createClient();
  const [{ data, error }, site] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    getSiteSettings(),
  ]);
  if (error) throw new Error(`Gagal memuat pesanan: ${error.message}`);
  const orders = (data ?? []).map(orderFromRow);

  return (
    <main className="min-h-[70vh] bg-[#ffffff] pb-[90px]">
      <PageHero
        compact
        eyebrow="Riwayat"
        title="Pesanan Saya"
        description="Pantau status pesananmu di sini."
      />

      <div className="mx-auto mt-[45px] flex w-[min(760px,92vw)] flex-col gap-[16px]">
        {orders.length === 0 ? (
          <div className="border border-line bg-white p-[32px] text-center">
            <p className="mb-[18px] text-[13px] text-muted">Belum ada pesanan.</p>
            <ButtonLink href="/pesan">Pesan sekarang</ButtonLink>
          </div>
        ) : (
          orders.map((order) => {
            const message = `Halo GAICREAM, saya ingin menanyakan pesanan ${order.orderNumber}.`;
            return (
              <article
                key={order.id}
                className="border border-line bg-white p-[24px] max-[520px]:p-[18px]"
              >
                <div className="flex flex-wrap items-start justify-between gap-[10px]">
                  <div>
                    <b className="font-heading text-[16px]">#{order.orderNumber}</b>
                    <p className="text-[11px] text-muted">{formatDateTime(order.createdAt)}</p>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                <ul className="my-[14px] border-y border-[#eeeceb] py-[8px]">
                  {order.items.map((item) => (
                    <li key={`${order.id}-${item.name}`} className="flex justify-between py-[5px] text-[12px]">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <b>{formatIDR(item.price * item.quantity)}</b>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap items-center justify-between gap-[10px]">
                  <div className="text-[12px] text-muted">
                    {deliveryLabels[order.deliveryMethod]}
                    {order.address ? ` · ${order.address}` : ""}
                  </div>
                  <b className="font-heading text-[18px]">{formatIDR(order.total)}</b>
                </div>

                <ButtonLink
                  href={whatsappUrl(message, site.whatsapp.international)}
                  external
                  variant="secondary"
                  size="sm"
                  className="mt-[14px]"
                >
                  Tanya via WhatsApp
                </ButtonLink>
              </article>
            );
          })
        )}
      </div>
    </main>
  );
}
