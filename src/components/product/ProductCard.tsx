import { ArrowRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatIDR } from "@/lib/utils";
import type { Product } from "@/types/product";

const detailClass =
  "flex items-center gap-[8px] pt-[9px] text-[11px] font-bold text-biscuit";

export function ProductCard({
  product,
  detailHref,
  onDetail,
}: {
  product: Product;
  /** dipakai di Home: tautan ke katalog */
  detailHref?: string;
  /** dipakai di Katalog: membuka modal detail */
  onDetail?: () => void;
}) {
  const detailLabel = (
    <>
      Lihat detail <ArrowRight size={16} strokeWidth={1.8} aria-hidden="true" />
    </>
  );

  return (
    <article className="group overflow-hidden rounded-[25px] bg-white shadow-[0_8px_30px_rgba(113,63,50,.08)] transition-transform duration-300 hover:-translate-y-[6px]">
      <div className="relative h-[270px] overflow-hidden max-[800px]:h-[220px] max-[520px]:h-[320px]">
        <Image
          src={product.image}
          alt={`Gabin es krim ${product.name}`}
          fill
          sizes="(max-width: 520px) 100vw, (max-width: 800px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-[16px] top-[16px] rounded-full bg-[#fff7ad] px-[10px] py-[7px] text-[9px] font-extrabold uppercase tracking-[.8px] text-[#79520e]">
          {product.tag}
        </span>
      </div>

      <div className="p-[22px]">
        <small className="text-[10px] uppercase tracking-[1px] text-biscuit">
          {product.category}
        </small>
        <h3 className="my-[4px] text-[22px]">{product.name}</h3>
        <p className="min-h-[40px] text-[13px] leading-[1.55] text-muted">
          {product.description}
        </p>

        <div className="mt-[18px] flex items-center justify-between">
          <strong className="font-heading text-[19px]">
            {formatIDR(product.price)}
          </strong>
          <Link
            href={`/pesan?rasa=${product.id}`}
            aria-label={`Pesan ${product.name}`}
            className="grid h-[39px] w-[39px] place-items-center rounded-full bg-strawberry text-chocolate"
          >
            <Plus size={20} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>

        {onDetail ? (
          <button type="button" onClick={onDetail} className={detailClass}>
            {detailLabel}
          </button>
        ) : detailHref ? (
          <Link href={detailHref} className={detailClass}>
            {detailLabel}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
