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
    <section className="bg-vanilla px-[max(6vw,20px)] py-[56px] min-[801px]:py-[84px]">
      <div className="mx-auto mb-[32px] max-w-[560px] text-center">
        <Eyebrow centered>Temukan favoritmu</Eyebrow>
        <h2 className="text-[clamp(26px,3.4vw,40px)] font-light leading-[1.12] tracking-[-.02em]">
          {capitalize(word)} rasa, {word} cara untuk bahagia.
        </h2>
        <p className="mt-[14px] text-[14px] leading-[1.8] text-muted">
          Dari matcha yang lembut sampai cokelat yang pekat, ada satu rasa yang pas untuk setiap suasana hatimu.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-[12px] min-[801px]:grid-cols-4 min-[801px]:gap-[20px]">
        {products.map((product) => (
          <Link
            key={product.id}
            href="/katalog"
            aria-label={`Lihat ${product.name} di katalog`}
            className="group block"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-white">
              <Image
                src={product.image}
                alt=""
                fill
                sizes="(max-width: 800px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
            <span className="mt-[10px] block text-center text-[12px] uppercase tracking-[.14em]">
              {product.name}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-[34px] flex justify-center">
        <ButtonLink href="/katalog" variant="secondary">
          Eksplor semua rasa
        </ButtonLink>
      </div>
    </section>
  );
}
