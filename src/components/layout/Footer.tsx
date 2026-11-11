import Link from "next/link";
import { customerNav, type SiteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Brand } from "./Brand";

const column = "flex flex-col items-start gap-[10px]";
const heading = "mb-[8px] font-heading text-[14px] font-bold";
const smallText = "text-[12px] font-medium text-muted";

export function Footer({ site }: { site: SiteConfig }) {
  const waUrl = whatsappUrl(site.whatsapp.defaultMessage, site.whatsapp.international);
  const hasHours = site.openingHours.length > 0;

  // Kolom "Jam Operasional" hanya muncul jika datanya sudah diisi
  const gridColumns = hasHours
    ? "grid-cols-[1.4fr_.8fr_1fr_1fr]"
    : "grid-cols-[1.4fr_.8fr_1fr]";

  const socials = [
    { key: "ig", label: "Instagram", href: site.social.instagram },
    { key: "tk", label: "TikTok", href: site.social.tiktok },
    { key: "wa", label: "WhatsApp", href: waUrl },
  ].filter((item) => item.href);

  return (
    <footer className="bg-footer px-[max(6vw,70px)] pb-[90px] pt-[65px] max-[800px]:pb-[100px]">
      <div
        className={`grid ${gridColumns} gap-[50px] max-[800px]:grid-cols-2 max-[520px]:grid-cols-1`}
      >
        <div className={`${column} max-[800px]:col-span-full max-[520px]:col-auto`}>
          <Brand />
          <p className="mt-[10px] max-w-[260px] text-[13px] leading-[1.6] text-muted">
            Gabin ice cream fresh dengan rasa yang bikin hari lebih bahagia.
          </p>
          <div className="flex gap-[8px]">
            {socials.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="grid h-[31px] w-[31px] place-items-center rounded-full bg-white text-[10px] font-extrabold text-chocolate"
              >
                {item.key}
              </a>
            ))}
          </div>
        </div>

        <div className={column}>
          <b className={heading}>Jelajahi</b>
          {customerNav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link key={item.href} href={item.href} className="text-muted">
                {item.label}
              </Link>
            ))}
        </div>

        <div className={column}>
          <b className={heading}>Hubungi Kami</b>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={smallText}
          >
            WhatsApp {site.whatsapp.display}
          </a>
          {site.email && (
            <a href={`mailto:${site.email}`} className={smallText}>
              {site.email}
            </a>
          )}
          {site.address && <span className={smallText}>{site.address}</span>}
        </div>

        {hasHours && (
          <div className={column}>
            <b className={heading}>Jam Operasional</b>
            {site.openingHours.map((row) => (
              <div key={row.label} className="flex flex-col gap-[2px]">
                <span className={smallText}>{row.label}</span>
                <strong className={smallText}>{row.hours}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-[45px] flex justify-between border-t border-[#e7d2c6] pt-[20px] text-[11px] text-muted max-[520px]:flex-col max-[520px]:gap-[10px]">
        <span>© {new Date().getFullYear()} {site.name}. Made with love.</span>
        <Link href="/admin" className="text-biscuit">
          Masuk sebagai admin
        </Link>
      </div>
    </footer>
  );
}
