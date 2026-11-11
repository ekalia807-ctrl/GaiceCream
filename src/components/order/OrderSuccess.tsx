import { Check, MessageCircle } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  buildOrderWhatsappMessage,
  type DeliveryMethod,
  type OrderLine,
  orderTotals,
} from "@/lib/order";
import { formatLongDateString } from "@/lib/format";
import { formatIDR } from "@/lib/utils";
import { whatsappUrl } from "@/lib/whatsapp";

export type CompletedOrder = {
  orderNumber: string;
  lines: OrderLine[];
  customerName: string;
  deliveryMethod: DeliveryMethod;
  address?: string;
  notes?: string;
};

export function OrderSuccess({
  order,
  whatsappNumber,
  readyDate,
}: {
  order: CompletedOrder;
  whatsappNumber: string;
  readyDate: string | null;
}) {
  const total = orderTotals(order.lines).price;
  const confirmUrl = whatsappUrl(buildOrderWhatsappMessage(order), whatsappNumber);

  return (
    <section className="grid place-items-center bg-vanilla px-[20px] py-[70px]">
      <div className="w-[min(520px,100%)] rounded-[30px] bg-white p-[45px] text-center shadow-soft max-[520px]:p-[28px]">
        <div className="mx-auto mb-[25px] grid h-[75px] w-[75px] place-items-center rounded-full bg-[#dfead8] text-matcha">
          <Check size={36} strokeWidth={2} aria-hidden="true" />
        </div>
        <Eyebrow centered>Pesanan berhasil</Eyebrow>
        <h1 className="text-[34px] leading-[1.15]">Yay, pesananmu kami terima!</h1>
        <p className="mt-[10px] text-[13px] leading-[1.6] text-muted">
          Kami akan segera menghubungi kamu melalui WhatsApp untuk konfirmasi pembayaran.
        </p>

        {readyDate && (
          <p className="mt-[8px] text-[12px] font-bold text-chocolate">
            Perkiraan siap: {formatLongDateString(readyDate)}
          </p>
        )}

        <div className="my-[22px] flex justify-between rounded-[14px] bg-[#fff8ed] p-[14px]">
          <small className="text-muted">Nomor transaksi</small>
          <b className="font-heading">{order.orderNumber}</b>
        </div>

        <ul className="mb-[10px] text-left">
          {order.lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-[11px] py-[8px]">
              <Image
                src={product.image}
                alt=""
                width={44}
                height={44}
                className="h-[44px] w-[44px] rounded-[10px] object-cover"
              />
              <span className="flex-1 text-[12px]">
                <b>{product.name}</b> × {quantity}
              </span>
              <strong className="text-[12px]">{formatIDR(product.price * quantity)}</strong>
            </li>
          ))}
        </ul>
        <div className="mb-[22px] flex items-center justify-between border-t border-[#f0e1d7] pt-[14px] text-[15px]">
          <span className="text-muted">Total</span>
          <b className="font-heading text-[20px]">{formatIDR(total)}</b>
        </div>

        <div className="flex flex-col gap-[10px]">
          <ButtonLink href={confirmUrl} external full>
            <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
            Konfirmasi lewat WhatsApp
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" full>
            Kembali ke beranda
          </ButtonLink>
        </div>

      </div>
    </section>
  );
}
