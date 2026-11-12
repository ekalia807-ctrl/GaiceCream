import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "Tentang Kami" };

export default function AboutPage() {
  return (
    <main className="min-h-[70vh]">
      <section className="grid items-center gap-[36px] px-[max(6vw,20px)] py-[48px] min-[801px]:grid-cols-2 min-[801px]:gap-[70px] min-[801px]:py-[80px]">
        <div>
          <Eyebrow>Our sweet story</Eyebrow>
          <h1 className="text-[clamp(28px,3.8vw,46px)] font-light leading-[1.12] tracking-[-.02em]">
            Dari dapur kecil,
            <br />
            untuk senyum yang besar.
          </h1>
          <p className="mt-[18px] max-w-[520px] text-[15px] leading-[1.85] text-muted">
            GAICREAM lahir dari ide sederhana: menghadirkan kembali rasa nostalgia biskuit gabin dengan cara yang lebih seru, creamy, dan penuh warna.
          </p>
          <ButtonLink href="/katalog" className="mt-[26px]">
            Kenali rasa kami <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </ButtonLink>
        </div>

        <div className="grid grid-cols-2 gap-[12px]">
          <Image
            src="/images/products/strawberry.jpeg"
            alt="Gabin es krim Strawberry"
            width={900}
            height={1600}
            sizes="(max-width: 800px) 45vw, 25vw"
            className="aspect-[3/4] w-full object-cover"
          />
          <Image
            src="/images/products/cookies-cream.jpeg"
            alt="Gabin es krim Cookies & Cream"
            width={900}
            height={1600}
            sizes="(max-width: 800px) 45vw, 25vw"
            className="mt-[28px] aspect-[3/4] w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-[36px] border-t border-line bg-vanilla px-[max(6vw,20px)] py-[56px] min-[801px]:grid-cols-2 min-[801px]:gap-[90px] min-[801px]:py-[84px]">
        <article>
          <small className="text-[11px] font-medium uppercase tracking-[.22em] text-muted">Visi kami</small>
          <h2 className="my-[12px] text-[24px] font-light leading-[1.25]">Menjadi teman manis di setiap momen.</h2>
          <p className="leading-[1.8] text-muted">
            Menghadirkan dessert lokal yang berkualitas, mudah dinikmati, dan selalu memberi kebahagiaan sederhana.
          </p>
        </article>
        <article>
          <small className="text-[11px] font-medium uppercase tracking-[.22em] text-muted">Misi kami</small>
          <h2 className="my-[12px] text-[24px] font-light leading-[1.25]">Fresh, fun, dan dibuat dengan hati.</h2>
          <p className="leading-[1.8] text-muted">
            Kami memilih bahan terbaik, menjaga konsistensi rasa, dan terus menciptakan varian baru untuk semua pencinta dessert.
          </p>
        </article>
      </section>
    </main>
  );
}
