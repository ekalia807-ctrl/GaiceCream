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
    <section className="relative grid min-h-[690px] grid-cols-2 items-center gap-[70px] bg-vanilla bg-[radial-gradient(circle_at_15%_20%,#fff_0,transparent_32%)] px-[max(6vw,55px)] pb-[80px] pt-[65px] after:absolute after:inset-x-0 after:bottom-0 after:h-[35px] after:bg-[linear-gradient(160deg,transparent_49%,white_50%)] after:content-[''] max-[1050px]:gap-[25px] max-[1050px]:px-[40px] max-[800px]:flex max-[800px]:min-h-0 max-[800px]:flex-col max-[800px]:gap-[35px] max-[800px]:px-[22px] max-[800px]:pb-[70px] max-[800px]:pt-[55px]">
      <div className="max-w-[620px] max-[800px]:flex max-[800px]:flex-col max-[800px]:items-center max-[800px]:text-center">
        <Eyebrow>
          <span className="h-[2px] w-[22px] bg-strawberry-dark" />
          Sweet, creamy &amp; crunchy
        </Eyebrow>
        <h1 className="mb-[24px] text-[clamp(48px,5vw,76px)] leading-[1.02] tracking-[-3px] text-chocolate max-[1050px]:text-[55px] max-[800px]:text-[45px] max-[800px]:tracking-[-2px]">
          A Little Crunch, <em className="not-italic text-[#d77f9b]">A Lot of Happiness!</em>
        </h1>
        <p className="max-w-[540px] text-[17px] leading-[1.75] text-[#7d625a] max-[800px]:text-[14px]">
          Gabin renyah dengan isian es krim creamy aneka rasa. Dibuat fresh untuk menemani setiap momen manismu.
        </p>
        <div className="mt-[32px] flex gap-[12px] max-[800px]:w-full max-[800px]:justify-center max-[520px]:flex-col">
          <ButtonLink href="/pesan" className="max-[520px]:w-full">
            Pesan Sekarang <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/katalog" variant="secondary" className="max-[520px]:w-full">
            Lihat Katalog
          </ButtonLink>
        </div>
      </div>

      <div className="relative grid h-[550px] place-items-center max-[800px]:h-[420px] max-[800px]:w-full max-[520px]:h-[350px]">
        <div className="absolute h-[480px] w-[480px] -rotate-[8deg] bg-strawberry [border-radius:44%_56%_63%_37%/54%_34%_66%_46%] max-[800px]:h-[340px] max-[800px]:w-[340px] max-[520px]:h-[280px] max-[520px]:w-[280px]" />
        <div className="relative h-[480px] w-[365px] rotate-[3deg] overflow-hidden rounded-[180px_180px_36px_36px] border-[10px] border-[rgba(255,255,255,.55)] shadow-[0_25px_60px_rgba(113,63,50,.22)] max-[800px]:h-[370px] max-[800px]:w-[270px] max-[520px]:h-[310px] max-[520px]:w-[220px]">
          <Image
            src={product.image}
            alt={`Gabin es krim ${product.name}`}
            fill
            priority
            sizes="365px"
            className="object-cover"
          />
        </div>

        <div className="absolute left-[2%] top-[16%] flex -rotate-[4deg] flex-col rounded-[15px] bg-white px-[18px] py-[14px] shadow-soft max-[800px]:left-0 max-[520px]:top-[8%] max-[520px]:p-[10px]">
          <small className="text-[10px] text-muted">Mulai dari</small>
          <b className="font-heading text-[14px] font-bold">{formatIDR(minPrice)}</b>
        </div>
        <div className="absolute bottom-[13%] right-0 flex items-center gap-[10px] rounded-[15px] bg-white px-[18px] py-[14px] shadow-soft max-[800px]:-right-[5px] max-[520px]:p-[10px]">
          <span className="inline-block h-[9px] w-[9px] rounded-full bg-[#80aa69]" />
          <div className="flex flex-col">
            <small className="text-[10px] text-muted">Fresh hari ini</small>
            <b className="font-heading text-[14px] font-bold">{product.name}</b>
          </div>
        </div>
        <span aria-hidden="true" className="absolute right-[8%] top-[9%] text-[35px] text-white">
          ✦
        </span>
        <span aria-hidden="true" className="absolute bottom-[8%] left-[12%] text-[20px] text-white">
          ✦
        </span>
      </div>
    </section>
  );
}
