import { createClient } from "@/lib/supabase/server";
import { productFromRow } from "@/lib/supabase/mappers";
import type { Product } from "@/types/product";

/** Produk aktif untuk halaman customer (diurutkan sesuai sort_order). */
export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(`Gagal memuat produk: ${error.message}`);
  return (data ?? []).map(productFromRow);
}

export async function getFeaturedProducts(limit = 3): Promise<Product[]> {
  const products = await getProducts();
  return products.slice(0, limit);
}
