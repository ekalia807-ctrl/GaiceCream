import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { productFromRow } from "@/lib/supabase/mappers";
import type { Product } from "@/types/product";
import { PUBLIC_DATA_TAG } from "./tags";

/**
 * Produk aktif untuk halaman customer (diurutkan sesuai sort_order).
 * Di-cache 60 detik dan dibersihkan otomatis saat admin mengubah produk/stok.
 */
export const getProducts = unstable_cache(
  async (): Promise<Product[]> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(`Gagal memuat produk: ${error.message}`);
    return (data ?? []).map(productFromRow);
  },
  ["public-products"],
  { revalidate: 60, tags: [PUBLIC_DATA_TAG] },
);

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, limit);
}
