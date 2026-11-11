import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { capitalize, countWord } from "@/lib/utils";
import type { Product } from "@/types/product";

export function FlavorSection({
  products,
  totalFlavors,
}: {
  products: Product[];
  totalFlavors: number;
}) {
  const word = countWord(totalFlavors);

  return (
    <section className="grid min-h-[550px] grid-cols-[.8fr_1.2fr] items-center overflow-hidden bg-strawberry px-[max(6vw,70px)] py-[95px] max-[800px]:grid-cols-1 max-[800px]:px-[20px] max-[800px]:pb-[30px] max-[800px]:pt-[65px]">
      <div className="max-w-[450px]">
        <Eyebrow>Temukan favoritmu</Eyebrow>
        <h2 className="mb-[10px] text-[clamp(34px,3.5vw,52px)] leading-[1.08] tracking-[-1.5px]">
          {capitalize(word)} rasa, {word} cara untuk bahagia.
        </h2>
        <p className="mb-[26px] leading-[1.7] text-[#725249]">
          Dari matcha yang lembut sampai cokelat yang pekat, ada satu rasa yang pas untuk setiap suasana hatimu.
        </p>
        <ButtonLink href="/katalog">Eksplor semua rasa</ButtonLink>
      </div>

      <div className="relative h-[380px] max-[800px]:mt-[30px] max-[800px]:h-[310px] max-[520px]:h-[250px]">
        {products.map((product, index) => (
          <Link
            key={product.id}
            href="/katalog"
            aria-label={`Lihat ${product.name} di katalog`}
            style={{ "--i": index } as React.CSSProperties}
            className="absolute left-[calc(var(--i)_*_22%)] h-[260px] w-[185px] rotate-[calc((var(--i)_-_1.5)_*_5deg)] overflow-hidden rounded-[90px_90px_16px_16px] border-[7px] border-white bg-white shadow-[0_20px_35px_rgba(113,63,50,.2)] max-[1050px]:w-[160px] max-[800px]:left-[calc(var(--i)_*_20%)] max-[800px]:h-[220px] max-[800px]:w-[145px] max-[520px]:h-[175px] max-[520px]:w-[115px]"
          >
            <Image
              src={product.image}
              alt=""
              fill
              sizes="185px"
              className="object-cover"
            />
            <span className="absolute inset-x-[12px] bottom-[12px] rounded-[10px] bg-[rgba(255,255,255,.9)] px-[5px] py-[9px] text-center text-[11px] font-extrabold">
              {product.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
