"use client";

import { MessageCircle } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { orderStatusLabel } from "@/lib/admin/status";
import { formatDateTime } from "@/lib/format";
import { deliveryLabels } from "@/lib/order";
import { toInternationalPhone } from "@/lib/phone";
import { formatIDR } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/admin";
import { Modal } from "./Modal";
import { OrderStatusSelect } from "./StatusBadge";

export function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => void;
}) {
  const message = `Halo ${order.customerName}, pesanan ${order.orderNumber} di GAICREAM saat ini berstatus ${orderStatusLabel[order.status]}.`;
  const waUrl = `https://wa.me/${toInternationalPhone(order.whatsapp)}?text=${encodeURIComponent(message)}`;
  const row = "flex justify-between gap-[12px] py-[6px] text-[12px]";

  return (
    <Modal
      wide
      title={`Pesanan #${order.orderNumber}`}
      description={formatDateTime(order.createdAt)}
      onClose={onClose}
    >
      <div className="mt-[18px]">
        <div className={row}>
          <span className="text-muted">Pelanggan</span>
          <b>{order.customerName}</b>
        </div>
        <div className={row}>
          <span className="text-muted">WhatsApp</span>
          <b>{order.whatsapp}</b>
        </div>
        <div className={row}>
          <span className="text-muted">Penerimaan</span>
          <b>{deliveryLabels[order.deliveryMethod]}</b>
        </div>
        {order.address && (
          <div className={row}>
            <span className="text-muted">Alamat</span>
            <b className="text-right">{order.address}</b>
          </div>
        )}
        {order.notes && (
          <div className={row}>
            <span className="text-muted">Catatan</span>
            <b className="text-right">{order.notes}</b>
          </div>
        )}
        <div className={`${row} items-center`}>
          <span className="text-muted">Status</span>
          <OrderStatusSelect value={order.status} onChange={onStatusChange} />
        </div>
        {order.status === "dibatalkan" && (
          <p className="text-[11px] text-muted">Pesanan dibatalkan dan tidak bisa diubah lagi.</p>
        )}
      </div>

      <ul className="my-[14px] border-y border-[#eeeceb] py-[8px]">
        {order.items.map((item) => (
          <li key={item.productId} className="flex justify-between py-[6px] text-[12px]">
            <span>
              {item.name} × {item.quantity}
            </span>
            <b>{formatIDR(item.price * item.quantity)}</b>
          </li>
        ))}
      </ul>
      <div className="mb-[20px] flex items-center justify-between text-[15px]">
        <span className="text-muted">Total</span>
        <b className="font-heading text-[20px]">{formatIDR(order.total)}</b>
      </div>

      <ButtonLink href={waUrl} external full>
        <MessageCircle size={18} strokeWidth={1.8} aria-hidden="true" />
        Hubungi via WhatsApp
      </ButtonLink>
    </Modal>
  );
}
