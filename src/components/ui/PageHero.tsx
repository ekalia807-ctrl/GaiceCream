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
        "bg-vanilla px-[20px] text-center",
        compact ? "pb-[42px] pt-[55px]" : "pb-[55px] pt-[75px]",
      )}
    >
      <Eyebrow centered>{eyebrow}</Eyebrow>
      <h1 className="mb-[10px] text-[clamp(40px,5vw,64px)] tracking-[-2px] max-[520px]:text-[37px]">
        {title}
      </h1>
      {description && (
        <p className="mx-auto max-w-[590px] text-muted">{description}</p>
      )}
    </section>
  );
}
