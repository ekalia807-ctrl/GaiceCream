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
      className="fixed inset-0 z-[100] grid place-items-center bg-[rgba(51,27,22,.55)] p-[20px] backdrop-blur-[5px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detail ${product.name}`}
        onClick={(event) => event.stopPropagation()}
        className="relative grid max-h-[92vh] w-[min(780px,95vw)] grid-cols-2 gap-[35px] overflow-auto rounded-[28px] bg-white p-[18px] max-[800px]:grid-cols-1 max-[800px]:gap-[20px]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-[18px] top-[18px] z-[2] grid h-[38px] w-[38px] place-items-center rounded-full bg-white"
        >
          <X size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <Image
          src={product.image}
          alt={`Gabin es krim ${product.name}`}
          width={900}
          height={1600}
          sizes="(max-width: 800px) 95vw, 380px"
          className="h-[410px] w-full rounded-[20px] object-cover max-[800px]:h-[300px] max-[520px]:h-[260px]"
        />

        <div className="flex flex-col justify-center pr-[25px] max-[800px]:px-[15px] max-[800px]:pb-[20px] max-[800px]:pt-[5px]">
          <span className="self-start rounded-full bg-[#fff7ad] px-[10px] py-[7px] text-[9px] font-extrabold uppercase tracking-[.8px] text-[#79520e]">
            {product.tag}
          </span>
          <h2 className="mb-[8px] mt-[15px] text-[35px]">{product.name}</h2>
          <p className="leading-[1.7] text-muted">{product.description}</p>
          <strong className="my-[20px] font-heading text-[26px]">
            {formatIDR(product.price)}{" "}
            <small className="text-[12px] text-muted">/ pcs</small>
          </strong>
          <div className="mb-[20px] flex items-center gap-[7px] text-[12px]">
            <span
              className={`inline-block h-[9px] w-[9px] rounded-full ${inStock ? "bg-[#80aa69]" : "bg-[#c9705f]"}`}
            />
            {inStock ? `Stok tersedia (${product.stock})` : "Stok habis"}
          </div>
          {inStock ? (
            <ButtonLink href={`/pesan?rasa=${product.id}`} full>
              Pesan rasa ini <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </ButtonLink>
          ) : (
            <p className="text-[12px] text-muted">
              Rasa ini sedang habis. Pilih rasa lain ya.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
