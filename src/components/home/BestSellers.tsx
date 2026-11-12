import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Product } from "@/types/product";

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="px-[max(6vw,20px)] py-[56px] min-[801px]:py-[84px]">
      <div className="mb-[30px] flex items-end justify-between gap-[16px]">
        <div>
          <Eyebrow>Favorit semua orang</Eyebrow>
          <h2 className="text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] tracking-[-.02em]">
            Best seller minggu ini
          </h2>
        </div>
        <Link
          href="/katalog"
          className="shrink-0 border-b border-chocolate pb-[2px] text-[11px] uppercase tracking-[.16em]"
        >
          Lihat semua
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-[12px] gap-y-[30px] min-[801px]:grid-cols-3 min-[801px]:gap-x-[24px]">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} detailHref="/katalog" />
        ))}
      </div>
    </section>
  );
}
