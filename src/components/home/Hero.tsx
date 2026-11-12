import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { formatIDR } from "@/lib/utils";
import type { Product } from "@/types/product";

export function Hero({
  product,
  minPrice,
}: {
  product: Product;
  minPrice: number;
}) {
  return (
    <section className="grid items-center gap-[36px] bg-vanilla px-[max(6vw,20px)] py-[40px] min-[801px]:grid-cols-2 min-[801px]:gap-[70px] min-[801px]:py-[70px]">
      <div className="mx-auto w-full max-w-[560px] max-[800px]:order-2 max-[800px]:text-center">
        <Eyebrow className="max-[800px]:justify-center">Sweet, creamy &amp; crunchy</Eyebrow>
        <h1 className="text-[clamp(34px,5vw,62px)] font-light leading-[1.06] tracking-[-.025em]">
          A little crunch,
          <br />
          a lot of happiness.
        </h1>
        <p className="mt-[20px] max-w-[470px] text-[15px] leading-[1.8] text-muted max-[800px]:mx-auto">
          Gabin renyah dengan isian es krim creamy aneka rasa. Dibuat fresh untuk menemani setiap momen manismu.
        </p>
        <p className="mt-[14px] text-[12px] uppercase tracking-[.16em] text-biscuit">
          Mulai dari {formatIDR(minPrice)}
        </p>
        <div className="mt-[28px] flex gap-[12px] max-[520px]:flex-col min-[801px]:justify-start max-[800px]:justify-center">
          <ButtonLink href="/pesan">
            Pesan Sekarang <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/katalog" variant="secondary">
            Lihat Katalog
          </ButtonLink>
        </div>
      </div>

      <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px] overflow-hidden bg-white max-[800px]:order-1 max-[800px]:max-w-[320px]">
        <Image
          src={product.image}
          alt={`Gabin es krim ${product.name}`}
          fill
          priority
          sizes="(max-width: 800px) 320px, 460px"
          className="object-cover"
        />
      </div>
    </section>
  );
}
