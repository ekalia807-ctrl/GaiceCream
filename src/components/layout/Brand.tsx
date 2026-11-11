import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Brand({
  compactOnMobile = false,
  className,
  onClick,
  href = "/",
}: {
  href?: string;
  /** true di header: logo mengecil dan teks disembunyikan di layar <= 800px */
  compactOnMobile?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-label={`${siteConfig.name} home`}
      onClick={onClick}
      className={cn("flex items-center gap-[10px] text-left text-chocolate", className)}
    >
      <Image
        src="/images/logo.jpeg"
        alt={`Logo ${siteConfig.name}`}
        width={48}
        height={48}
        priority
        className={cn(
          "h-[48px] w-[48px] rounded-full border-2 border-[#c52931] object-cover",
          compactOnMobile && "max-[800px]:h-[42px] max-[800px]:w-[42px]",
        )}
      />
      <span className={cn("flex flex-col", compactOnMobile && "max-[800px]:hidden")}>
        <b className="font-heading text-[19px] font-bold leading-none tracking-[.6px]">
          {siteConfig.name}
        </b>
        <small className="mt-[5px] text-[9px] tracking-[.5px] text-biscuit">
          {siteConfig.tagline}
        </small>
      </span>
    </Link>
  );
}
