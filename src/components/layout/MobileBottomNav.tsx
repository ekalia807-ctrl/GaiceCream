"use client";

import { House, LayoutGrid, MessageCircle, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn, isActivePath } from "@/lib/utils";

const itemBase = "flex flex-col items-center gap-[2px] text-[8px]";
const iconProps = { size: 20, strokeWidth: 1.8, "aria-hidden": true } as const;

function NavItem({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(itemBase, active ? "text-strawberry-dark" : "text-[#a48880]")}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function MobileBottomNav({ whatsappUrl }: { whatsappUrl: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigasi bawah"
      className="fixed inset-x-0 bottom-0 z-[60] hidden h-[70px] items-center justify-around border-t border-[#eadbd1] bg-white pb-[5px] max-[800px]:flex"
    >
      <NavItem
        href="/"
        active={isActivePath(pathname, "/")}
        icon={<House {...iconProps} />}
        label="Home"
      />
      <NavItem
        href="/katalog"
        active={isActivePath(pathname, "/katalog")}
        icon={<LayoutGrid {...iconProps} />}
        label="Katalog"
      />
      <Link
        href="/pesan"
        aria-label="Pesan sekarang"
        className="grid h-[52px] w-[52px] -translate-y-[18px] place-items-center rounded-full bg-chocolate text-white shadow-[0_7px_18px_rgba(113,63,50,.25)]"
      >
        <ShoppingBag {...iconProps} />
      </Link>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(itemBase, "text-[#a48880]")}
      >
        <MessageCircle {...iconProps} />
        <span>Chat</span>
      </a>
      <NavItem
        href="/tentang"
        active={isActivePath(pathname, "/tentang")}
        icon={<User {...iconProps} />}
        label="Tentang"
      />
    </nav>
  );
}
