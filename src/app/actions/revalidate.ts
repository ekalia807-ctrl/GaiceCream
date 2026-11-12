"use server";

import { revalidateTag } from "next/cache";
import { getSessionUser } from "@/lib/data/auth";
import { PUBLIC_DATA_TAG } from "@/lib/data/tags";

/**
 * Dipanggil dashboard admin setelah mengubah produk, stok, PO, atau pengaturan,
 * supaya halaman customer (yang di-cache agar cepat) langsung menampilkan data terbaru.
 */
export async function refreshPublicData() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") return;
  revalidateTag(PUBLIC_DATA_TAG);
}
