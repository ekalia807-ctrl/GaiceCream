import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "Tentang Kami" };

const collageImage = "absolute border-[8px] border-white object-cover shadow-soft";

export default function AboutPage() {
  return (
    <main className="min-h-[70vh] bg-vanilla">
      <section className="grid grid-cols-2 items-center gap-[80px] px-[max(7vw,80px)] py-[80px] max-[1050px]:gap-[40px] max-[1050px]:px-[40px] max-[800px]:grid-cols-1 max-[800px]:gap-[45px] max-[800px]:px-[22px] max-[800px]:py-[60px]">
        <div>
          <Eyebrow>Our sweet story</Eyebrow>
          <h1 className="mb-[10px] text-[clamp(34px,3.5vw,52px)] leading-[1.08] tracking-[-1.5px]">
            Dari dapur kecil,
            <br />
            untuk senyum yang besar.
          </h1>
          <p className="max-w-[540px] leading-[1.8] text-muted">
            GAICREAM lahir dari ide sederhana: menghadirkan kembali rasa nostalgia biskuit gabin dengan cara yang lebih seru, creamy, dan penuh warna.
          </p>
          <ButtonLink href="/katalog" className="mt-[28px]">
            Kenali rasa kami <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
          </ButtonLink>
        </div>

        <div className="relative h-[530px] max-[800px]:h-[400px] max-[520px]:h-[320px]">
          <Image
            src="/images/products/strawberry.jpeg"
            alt="Gabin es krim Strawberry"
            width={900}
            height={1600}
            sizes="(max-width: 800px) 60vw, 30vw"
            className={`${collageImage} left-0 top-0 h-[75%] w-[55%] rounded-[120px_120px_20px_20px]`}
          />
          <Image
            src="/images/products/cookies-cream.jpeg"
            alt="Gabin es krim Cookies & Cream"
            width={900}
            height={1600}
            sizes="(max-width: 800px) 50vw, 25vw"
            className={`${collageImage} bottom-0 right-0 h-[62%] w-[48%] rounded-[20px]`}
          />
          <Image
            src="/images/logo.jpeg"
            alt="Logo GAICREAM"
            width={260}
            height={260}
            className={`${collageImage} right-[5%] top-0 h-[130px] w-[130px] rounded-full`}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-[100px] bg-white px-[max(12vw,100px)] py-[90px] max-[1050px]:gap-[50px] max-[1050px]:px-[40px] max-[800px]:grid-cols-1 max-[800px]:gap-[40px] max-[800px]:px-[22px] max-[800px]:py-[60px]">
        <article className="border-r border-[#ead9cf] pr-[100px] max-[1050px]:pr-[50px] max-[800px]:border-b max-[800px]:border-r-0 max-[800px]:pb-[40px] max-[800px]:pr-0">
          <small className="font-extrabold tracking-[2px] text-strawberry-dark">VISI KAMI</small>
          <h2 className="my-[15px] text-[30px]">Menjadi teman manis di setiap momen.</h2>
          <p className="leading-[1.7] text-muted">
            Menghadirkan dessert lokal yang berkualitas, mudah dinikmati, dan selalu memberi kebahagiaan sederhana.
          </p>
        </article>
        <article>
          <small className="font-extrabold tracking-[2px] text-strawberry-dark">MISI KAMI</small>
          <h2 className="my-[15px] text-[30px]">Fresh, fun, dan dibuat dengan hati.</h2>
          <p className="leading-[1.7] text-muted">
            Kami memilih bahan terbaik, menjaga konsistensi rasa, dan terus menciptakan varian baru untuk semua pencinta dessert.
          </p>
        </article>
      </section>
    </main>
  );
}
