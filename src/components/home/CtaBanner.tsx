import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="relative mx-[max(6vw,70px)] mb-[90px] flex items-center justify-between overflow-hidden rounded-[30px] bg-chocolate px-[60px] py-[50px] text-white after:absolute after:-top-[130px] after:right-[20%] after:h-[300px] after:w-[300px] after:rounded-full after:border-[50px] after:border-[rgba(245,184,201,.16)] after:content-[''] max-[800px]:mx-[20px] max-[800px]:mb-[65px] max-[800px]:flex-col max-[800px]:items-start max-[800px]:gap-[25px] max-[800px]:px-[28px] max-[800px]:py-[35px]">
      <div>
        <small className="font-extrabold tracking-[2px] text-strawberry">
          SWEET MOMENT STARTS HERE
        </small>
        <h2 className="mb-[5px] mt-[10px] text-[36px] max-[800px]:text-[28px]">
          Siap menikmati gabin favoritmu?
        </h2>
        <p className="text-[#e2cfc9]">Pesan sekarang, kami siapkan yang paling fresh.</p>
      </div>
      <ButtonLink href="/pesan" variant="light" className="relative z-[1]">
        Pesan GAICREAM <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
      </ButtonLink>
    </section>
  );
}
