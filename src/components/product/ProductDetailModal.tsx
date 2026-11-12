"use client";

import { ArrowRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { formatIDR } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductDetailModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const inStock = product.stock > 0;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] grid place-items-center bg-[rgba(28,25,23,.5)] p-[16px] max-[800px]:items-end max-[800px]:p-0"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detail ${product.name}`}
        onClick={(event) => event.stopPropagation()}
        className="relative grid max-h-[92vh] w-[min(760px,95vw)] grid-cols-2 gap-[32px] overflow-auto bg-white p-[16px] max-[800px]:w-full max-[800px]:grid-cols-1 max-[800px]:gap-[16px] max-[800px]:pb-[calc(20px+env(safe-area-inset-bottom))]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-[8px] top-[8px] z-[2] grid h-[44px] w-[44px] place-items-center bg-white/90"
        >
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <Image
          src={product.image}
          alt={`Gabin es krim ${product.name}`}
          width={900}
          height={1600}
          sizes="(max-width: 800px) 95vw, 380px"
          className="h-[400px] w-full object-cover max-[800px]:h-[300px] max-[520px]:h-[260px]"
        />

        <div className="flex flex-col justify-center pr-[20px] max-[800px]:px-[6px]">
          {product.tag && (
            <span className="self-start bg-vanilla px-[8px] py-[4px] text-[9px] font-medium uppercase tracking-[.14em]">
              {product.tag}
            </span>
          )}
          <h2 className="mb-[8px] mt-[14px] text-[30px] font-light">{product.name}</h2>
          <p className="text-[14px] leading-[1.8] text-muted">{product.description}</p>
          <strong className="my-[18px] text-[22px] font-normal">
            {formatIDR(product.price)} <small className="text-[12px] text-muted">/ pcs</small>
          </strong>
          <div className="mb-[18px] flex items-center gap-[7px] text-[12px]">
            <span
              className={`inline-block h-[8px] w-[8px] rounded-full ${inStock ? "bg-[#80aa69]" : "bg-[#c9705f]"}`}
            />
            {inStock ? `Stok tersedia (${product.stock})` : "Stok habis"}
          </div>
          {inStock ? (
            <ButtonLink href={`/pesan?rasa=${product.id}`} full>
              Pesan rasa ini <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </ButtonLink>
          ) : (
            <p className="text-[12px] text-muted">Rasa ini sedang habis. Pilih rasa lain ya.</p>
          )}
        </div>
      </div>
    </div>
  );
}
