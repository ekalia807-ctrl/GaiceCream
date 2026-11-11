import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Product } from "@/types/product";

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="px-[max(6vw,70px)] py-[95px] max-[800px]:px-[20px] max-[800px]:py-[65px]">
      <div className="mb-[38px] flex items-end justify-between max-[800px]:items-start">
        <div>
          <Eyebrow>Favorit semua orang</Eyebrow>
          <h2 className="mb-[10px] text-[clamp(34px,3.5vw,52px)] leading-[1.08] tracking-[-1.5px]">
            Best seller minggu ini
          </h2>
          <p className="text-muted">Tiga rasa yang paling sering dipesan pelanggan kami.</p>
        </div>
        <Link href="/katalog" className="flex items-center gap-[8px] font-bold text-chocolate">
          <span className="max-[800px]:sr-only">Lihat semua</span>
          <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-[24px] max-[1050px]:gap-[15px] max-[800px]:grid-cols-2 max-[520px]:grid-cols-1">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} detailHref="/katalog" />
        ))}
      </div>
    </section>
  );
}
