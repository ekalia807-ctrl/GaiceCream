import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export function PageHero({
  eyebrow,
  title,
  description,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "border-b border-line bg-white px-[20px] text-center",
        compact ? "pb-[32px] pt-[40px]" : "pb-[44px] pt-[56px]",
      )}
    >
      <Eyebrow centered>{eyebrow}</Eyebrow>
      <h1 className="mb-[10px] text-[clamp(28px,4.2vw,46px)] font-light leading-[1.1] tracking-[-.02em]">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-[560px] text-[14px] leading-[1.7] text-muted">{description}</p>
      )}
    </section>
  );
}
