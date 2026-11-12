import Link from "next/link";
import { customerNav, type SiteConfig } from "@/config/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Brand } from "./Brand";

const heading = "mb-[6px] text-[11px] font-medium uppercase tracking-[.2em]";
const link = "text-[13px] text-muted hover:text-chocolate";

export function Footer({ site }: { site: SiteConfig }) {
  const waUrl = whatsappUrl(site.whatsapp.defaultMessage, site.whatsapp.international);
  const hasHours = site.openingHours.length > 0;

  const socials = [
    { key: "ig", label: "Instagram", href: site.social.instagram },
    { key: "tk", label: "TikTok", href: site.social.tiktok },
    { key: "wa", label: "WhatsApp", href: waUrl },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-line bg-white px-[max(6vw,20px)] pb-[96px] pt-[48px] min-[801px]:pb-[40px]">
      <div className="mx-auto grid max-w-[1200px] gap-[36px] min-[801px]:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-[10px]">
          <Brand showTagline />
          <p className="mt-[6px] max-w-[260px] text-[13px] leading-[1.7] text-muted">
            Gabin ice cream fresh dengan rasa yang bikin hari lebih bahagia.
          </p>
        </div>

        <div className="flex flex-col items-start gap-[10px]">
          <b className={heading}>Jelajahi</b>
          {customerNav
            .filter((item) => item.href !== "/")
            .map((item) => (
              <Link key={item.href} href={item.href} className={link}>
                {item.label}
              </Link>
            ))}
        </div>

        <div className="flex flex-col items-start gap-[10px]">
          <b className={heading}>Hubungi Kami</b>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className={link}>
            WhatsApp {site.whatsapp.display}
          </a>
          {site.email && (
            <a href={`mailto:${site.email}`} className={link}>
              {site.email}
            </a>
          )}
          {site.address && <span className={link}>{site.address}</span>}
        </div>

        <div className="flex flex-col items-start gap-[10px]">
          <b className={heading}>Ikuti Kami</b>
          {socials.map((item) => (
            <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className={link}>
              {item.label}
            </a>
          ))}
          {hasHours && (
            <div className="mt-[14px] flex flex-col gap-[8px]">
              <b className={heading}>Jam Operasional</b>
              {site.openingHours.map((row) => (
                <div key={row.label} className="flex flex-col gap-[2px] text-[13px] text-muted">
                  <span>{row.label}</span>
                  <strong className="font-medium text-chocolate">{row.hours}</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto mt-[40px] flex max-w-[1200px] items-center justify-between gap-[10px] border-t border-line pt-[18px] text-[11px] text-muted max-[520px]:flex-col max-[520px]:items-start">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <Link href="/admin" className="hover:text-chocolate">
          Masuk sebagai admin
        </Link>
      </div>
    </footer>
  );
}
