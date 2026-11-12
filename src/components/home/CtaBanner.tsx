import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function CtaBanner() {
  return (
    <section className="px-[max(6vw,20px)] py-[64px] text-center min-[801px]:py-[96px]">
      <small className="text-[11px] font-medium uppercase tracking-[.22em] text-muted">
        Sweet moment starts here
      </small>
      <h2 className="mx-auto mb-[8px] mt-[14px] max-w-[620px] text-[clamp(26px,3.6vw,40px)] font-light leading-[1.15] tracking-[-.02em]">
        Siap menikmati gabin favoritmu?
      </h2>
      <p className="mb-[26px] text-[14px] text-muted">Pesan sekarang, kami siapkan yang paling fresh.</p>
      <ButtonLink href="/pesan">
        Pesan GAICREAM <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </ButtonLink>
    </section>
  );
}
