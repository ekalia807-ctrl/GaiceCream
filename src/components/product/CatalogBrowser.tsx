"use client";

import { Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";
import { ProductDetailModal } from "./ProductDetailModal";

export function CatalogBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [detail, setDetail] = useState<Product | null>(null);

  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))],
    [products],
  );

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        (category === "Semua" || product.category === category) &&
        product.name.toLowerCase().includes(keyword),
    );
  }, [products, query, category]);

  const closeDetail = useCallback(() => setDetail(null), []);

  return (
    <>
      <div className="flex items-center justify-between border-b border-[#f0dfd4] bg-white px-[max(6vw,70px)] py-[25px] max-[800px]:flex-col max-[800px]:items-stretch max-[800px]:gap-[12px] max-[800px]:px-[20px] max-[800px]:py-[18px]">
        <label className="flex w-[310px] items-center gap-[10px] rounded-full border border-[#ead9cf] px-[17px] py-[11px] focus-within:border-strawberry-dark max-[800px]:w-full">
          <Search size={20} strokeWidth={1.8} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari rasa..."
            aria-label="Cari rasa"
            className="w-full border-0 bg-transparent text-[13px] text-chocolate outline-none"
          />
        </label>

        <div className="flex gap-[7px] max-[800px]:overflow-auto">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={cn(
                "whitespace-nowrap rounded-full border px-[16px] py-[10px] text-[12px]",
                category === item
                  ? "border-chocolate bg-chocolate text-white"
                  : "border-[#ead9cf] bg-white text-muted",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <section className="px-[max(6vw,70px)] pb-[100px] pt-[40px] max-[800px]:px-[20px] max-[800px]:pb-[80px] max-[800px]:pt-[30px]">
        <div className="mb-[22px] flex justify-between">
          <b>{filtered.length} rasa ditemukan</b>
          <span className="text-[12px] text-muted">Dibuat fresh setiap hari</span>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-3 gap-[24px] max-[1050px]:gap-[15px] max-[800px]:grid-cols-2 max-[520px]:grid-cols-1">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onDetail={() => setDetail(product)}
              />
            ))}
          </div>
        ) : (
          <p className="py-[60px] text-center text-muted">
            Rasa yang kamu cari belum ada. Coba kata kunci atau kategori lain.
          </p>
        )}
      </section>

      {detail && <ProductDetailModal product={detail} onClose={closeDetail} />}
    </>
  );
}
