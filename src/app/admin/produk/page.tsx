import type { Metadata } from "next";
import { ProductsView } from "@/components/admin/views/ProductsView";

export const metadata: Metadata = { title: "Produk" };

export default function Page() {
  return <ProductsView />;
}
