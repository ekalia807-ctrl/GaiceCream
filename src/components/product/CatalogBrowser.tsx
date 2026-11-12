"use client";

import { Search } from "lucide-react";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [detail, setDetail] = useState<Product | null>(null);
  // pengetikan tetap lancar walau daftar produk banyak
  const deferredQuery = useDeferredValue(query);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(() => {
    const keyword = deferredQuery.trim().toLowerCase();
    return products.filter(
      (product) =>
        (category === "Semua" || product.category === category) &&
        product.name.toLowerCase().includes(keyword),
    );
  }, [products, deferredQuery, category]);

  const closeDetail = useCallback(() => setDetail(null), []);

  return (
    <>
      <div className="flex items-center justify-between gap-[16px] border-b border-line bg-white px-[max(6vw,20px)] py-[14px] max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-[4px]">
        <label className="flex min-h-[44px] w-[300px] items-center gap-[10px] border-b border-[#d6d3d1] focus-within:border-chocolate max-[800px]:w-full">
          <Search size={18} strokeWidth={1.5} aria-hidden="true" className="text-muted" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari rasa..."
            aria-label="Cari rasa"
            className="w-full border-0 bg-transparent text-[14px] text-chocolate outline-none"
          />
        </label>

        <div className="flex gap-[4px] overflow-x-auto max-[800px]:-mx-[8px] max-[800px]:px-[8px]">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "min-h-[44px] whitespace-nowrap border-b px-[12px] text-[11px] uppercase tracking-[.14em]",
                category === item
                  ? "border-chocolate text-chocolate"
                  : "border-transparent text-muted hover:text-chocolate",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="px-[max(6vw,20px)] pb-[90px] pt-[28px]">
        <div className="mb-[22px] flex justify-between text-[12px] text-muted">
          <span>{filtered.length} rasa ditemukan</span>
          <span>Dibuat fresh setiap hari</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-[12px] gap-y-[30px] min-[801px]:grid-cols-3 min-[801px]:gap-x-[24px] min-[801px]:gap-y-[44px]">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} onDetail={() => setDetail(product)} />
            ))}
          </div>
        ) : (
          <p className="py-[60px] text-center text-[14px] text-muted">
            Rasa yang kamu cari belum ada. Coba kata kunci atau kategori lain.
          </p>
        )}
      </section>

      {detail && <ProductDetailModal product={detail} onClose={closeDetail} />}
    </>
  );
}
