"use client";

import { House, LayoutGrid, MessageCircle, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn, isActivePath } from "@/lib/utils";

const itemBase = "flex min-w-[56px] flex-col items-center gap-[3px] py-[6px] text-[10px] tracking-[.04em]";
const iconProps = { size: 20, strokeWidth: 1.5, "aria-hidden": true } as const;

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
      className={cn(itemBase, active ? "text-chocolate" : "text-[#a8a29e]")}
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
      className="fixed inset-x-0 bottom-0 z-[60] hidden items-center justify-around border-t border-line bg-white pb-[env(safe-area-inset-bottom)] pt-[4px] max-[800px]:flex"
    >
      <NavItem href="/" active={isActivePath(pathname, "/")} icon={<House {...iconProps} />} label="Home" />
      <NavItem
        href="/katalog"
        active={isActivePath(pathname, "/katalog")}
        icon={<LayoutGrid {...iconProps} />}
        label="Katalog"
      />
      <NavItem
        href="/pesan"
        active={isActivePath(pathname, "/pesan")}
        icon={<ShoppingBag {...iconProps} />}
        label="Pesan"
      />
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(itemBase, "text-[#a8a29e]")}
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
