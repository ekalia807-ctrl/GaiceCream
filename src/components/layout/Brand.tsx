import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Brand({
  compactOnMobile = false,
  showTagline = false,
  className,
  onClick,
  href = "/",
}: {
  href?: string;
  /** true di header: teks nama disembunyikan di layar sangat kecil */
  compactOnMobile?: boolean;
  showTagline?: boolean;
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
        width={72}
        height={72}
        priority
        className="h-[34px] w-[34px] rounded-full object-cover"
      />
      <span className={cn("flex flex-col", compactOnMobile && "max-[380px]:hidden")}>
        <b className="text-[15px] font-medium uppercase leading-none tracking-[.22em]">
          {siteConfig.name}
        </b>
        {showTagline && (
          <small className="mt-[5px] text-[10px] tracking-[.12em] text-muted">
            {siteConfig.tagline}
          </small>
        )}
      </span>
    </Link>
  );
}
