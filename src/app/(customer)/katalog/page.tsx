import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/product/CatalogBrowser";
import { PageHero } from "@/components/ui/PageHero";
import { getProducts } from "@/lib/data/products";

export const metadata: Metadata = { title: "Katalog" };

export default async function CatalogPage() {
  const products = await getProducts();

  return (
    <main className="min-h-[70vh]">
      <PageHero
        eyebrow="Our little happiness"
        title="Pilih rasa favoritmu"
        description="Setiap rasa dibuat fresh dengan bahan pilihan dan biskuit gabin yang selalu renyah."
      />
      <CatalogBrowser products={products} />
    </main>
  );
}
