import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Testimonial } from "@/types/product";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-line px-[max(6vw,20px)] py-[56px] min-[801px]:py-[84px]">
      <div className="mb-[32px] flex flex-col items-center text-center">
        <Eyebrow centered>Kata mereka</Eyebrow>
        <h2 className="text-[clamp(26px,3.4vw,40px)] font-light leading-[1.1] tracking-[-.02em]">
          Dicintai pelanggan kami
        </h2>
      </div>
      <div className="grid gap-[28px] min-[801px]:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="border-t border-chocolate pt-[18px]">
            <p className="mb-[16px] text-[15px] font-light leading-[1.7]">“{item.quote}”</p>
            <div className="flex flex-col">
              <b className="text-[12px] font-medium uppercase tracking-[.12em]">{item.name}</b>
              <small className="text-[11px] text-muted">{item.role}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
