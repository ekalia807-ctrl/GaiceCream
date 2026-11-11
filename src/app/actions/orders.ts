"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { orderFormSchema } from "@/lib/validation/order";

const itemsSchema = z
  .array(
    z.object({
      productId: z.string().uuid(),
      quantity: z.number().int().min(1).max(100),
    }),
  )
  .min(1)
  .max(30);

export type PlaceOrderInput = {
  items: { productId: string; quantity: number }[];
  customerName: string;
  whatsapp: string;
  deliveryMethod: "pickup" | "delivery";
  address?: string;
  notes?: string;
};

export type PlaceOrderResult =
  | { ok: true; orderNumber: string }
  | { ok: false; message: string };

/**
 * Membuat pesanan lewat fungsi database create_order. Harga, stok, kuota PO,
 * dan nomor pesanan dihitung di server sehingga tidak bisa dimanipulasi dari browser.
 */
export async function placeOrderAction(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const form = orderFormSchema.safeParse({
    customerName: input.customerName,
    whatsapp: input.whatsapp,
    deliveryMethod: input.deliveryMethod,
    address: input.address ?? "",
    notes: input.notes ?? "",
  });
  const items = itemsSchema.safeParse(input.items);
  if (!form.success || !items.success) {
    return { ok: false, message: "Data pesanan tidak valid. Periksa kembali isian Anda." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_order", {
    p_customer_name: form.data.customerName,
    p_whatsapp: form.data.whatsapp,
    p_delivery_method: form.data.deliveryMethod,
    p_address: form.data.address ?? "",
    p_notes: form.data.notes ?? "",
    p_items: items.data.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
    })),
  });

  if (error) {
    // P0001 = pesan dari RAISE EXCEPTION di fungsi database (sudah berbahasa Indonesia)
    return {
      ok: false,
      message:
        error.code === "P0001"
          ? error.message
          : "Pesanan belum berhasil dikirim. Coba lagi sebentar lagi.",
    };
  }

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.order_number) {
    return { ok: false, message: "Pesanan belum berhasil dibuat. Coba lagi." };
  }

  revalidatePath("/riwayat");
  return { ok: true, orderNumber: String(row.order_number) };
}
