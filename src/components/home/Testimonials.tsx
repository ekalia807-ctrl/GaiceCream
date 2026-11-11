import { Eyebrow } from "@/components/ui/Eyebrow";
import type { Testimonial } from "@/types/product";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section className="px-[max(6vw,70px)] py-[95px] max-[800px]:px-[20px] max-[800px]:py-[65px]">
      <div className="mb-[38px] flex flex-col items-center text-center">
        <Eyebrow centered>Kata mereka</Eyebrow>
        <h2 className="mb-[10px] text-[clamp(34px,3.5vw,52px)] leading-[1.08] tracking-[-1.5px]">
          Dicintai pelanggan kami
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-[22px] max-[800px]:grid-cols-1">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[22px] border border-[#f0dfd4] bg-white p-[28px]"
          >
            <div aria-label="5 dari 5 bintang" className="text-[12px] tracking-[3px] text-[#e7a528]">
              ★★★★★
            </div>
            <p className="my-[16px] mb-[23px] font-heading text-[16px] leading-[1.6]">
              “{item.quote}”
            </p>
            <div className="flex items-center gap-[11px]">
              <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-strawberry font-extrabold">
                {item.name.charAt(0)}
              </span>
              <div className="flex flex-col">
                <b className="text-[12px]">{item.name}</b>
                <small className="text-[10px] text-muted">{item.role}</small>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
