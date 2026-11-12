import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { type OrderLine, orderTotals } from "@/lib/order";
import { formatIDR } from "@/lib/utils";

export function OrderSummary({
  lines,
  formId,
  submitting,
}: {
  lines: OrderLine[];
  formId: string;
  submitting: boolean;
}) {
  const totals = orderTotals(lines);

  return (
    <aside className="sticky top-[110px] h-max border border-line bg-white p-[28px] max-[800px]:static max-[520px]:px-[15px] max-[520px]:py-[20px]">
      <h3 className="my-[4px] text-[18px]">Ringkasan pesanan</h3>

      {lines.length === 0 ? (
        <p className="py-[18px] text-[12px] text-muted">Belum ada rasa yang dipilih.</p>
      ) : (
        <ul>
          {lines.map(({ product, quantity }) => (
            <li key={product.id} className="flex items-center gap-[11px] py-[18px]">
              <Image
                src={product.image}
                alt=""
                width={58}
                height={58}
                className="h-[58px] w-[58px] rounded-[2px] object-cover"
              />
              <div className="flex flex-1 flex-col">
                <b className="text-[12px]">{product.name}</b>
                <span className="text-[10px] text-muted">{quantity} pcs</span>
              </div>
              <strong className="text-[12px]">{formatIDR(product.price * quantity)}</strong>
            </li>
          ))}
        </ul>
      )}

      <div className="border-y border-[#eeeceb] py-[15px]">
        <div className="my-[8px] flex justify-between text-[12px]">
          <span className="text-muted">Jumlah item</span>
          <span>{totals.quantity} pcs</span>
        </div>
      </div>

      <div className="my-[20px] flex items-center justify-between text-[15px]">
        <span className="text-muted">Total</span>
        <b className="font-heading text-[20px] font-medium">{formatIDR(totals.price)}</b>
      </div>

      <Button type="submit" form={formId} full disabled={submitting}>
        {submitting ? "Memproses..." : "Konfirmasi Pesanan"}
        {!submitting && <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />}
      </Button>
      <small className="mt-[12px] block text-center text-[9px] text-muted">
        Pembayaran dikonfirmasi melalui WhatsApp setelah pesanan diterima.
      </small>
    </aside>
  );
}
