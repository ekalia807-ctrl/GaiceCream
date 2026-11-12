"use client";

import { ChevronDown, Menu, MessageCircle, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { customerNav } from "@/config/site";
import { useAccount, type Account } from "@/hooks/useAccount";
import { createClient } from "@/lib/supabase/client";
import { cn, isActivePath } from "@/lib/utils";
import { Brand } from "./Brand";

const iconButton = "grid h-[44px] w-[44px] place-items-center text-chocolate";

export function Header({ whatsappUrl }: { whatsappUrl: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, account } = useAccount();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Drawer: tutup dengan Escape dan kunci scroll halaman saat terbuka
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Menu akun: tutup saat klik di luar
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  async function signOut() {
    await createClient().auth.signOut();
    setMenuOpen(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  const firstName = account?.name.split(" ")[0] ?? "";

  return (
    <>
      <header className="sticky top-0 z-40 grid h-[60px] grid-cols-[1fr_auto_1fr] items-center border-b border-line bg-white px-[max(3vw,16px)] max-[1050px]:px-[6px] min-[1051px]:h-[68px]">
        {/* kiri: navigasi (desktop) / tombol menu (HP) */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className={cn(iconButton, "min-[1051px]:hidden")}
          >
            <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <nav aria-label="Navigasi utama" className="flex items-center gap-[28px] max-[1050px]:hidden">
            {customerNav.map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b py-[6px] text-[12px] uppercase tracking-[.14em] hover:text-chocolate",
                    active ? "border-chocolate text-chocolate" : "border-transparent text-muted",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* tengah: logo */}
        <Brand compactOnMobile />

        {/* kanan: akun, notifikasi, chat */}
        <div className="flex items-center justify-end">
          {account && <NotificationBell userId={account.id} />}
          {account ? (
            <div ref={menuRef} className="relative max-[800px]:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex h-[44px] items-center gap-[6px] px-[8px] text-[12px] uppercase tracking-[.1em] text-chocolate"
              >
                <User size={18} strokeWidth={1.5} aria-hidden="true" />
                <span className="max-w-[90px] truncate">{firstName}</span>
                <ChevronDown size={14} strokeWidth={1.5} aria-hidden="true" />
              </button>
              {menuOpen && <AccountMenu account={account} onClose={() => setMenuOpen(false)} onSignOut={signOut} />}
            </div>
          ) : (
            !loading && (
              <Link
                href="/masuk"
                className="flex h-[44px] items-center px-[10px] text-[12px] uppercase tracking-[.14em] text-chocolate"
              >
                <span className="max-[800px]:hidden">Masuk</span>
                <User size={20} strokeWidth={1.5} aria-label="Masuk" className="min-[801px]:hidden" />
              </Link>
            )
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp"
            className={cn(iconButton, "max-[800px]:hidden")}
          >
            <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
          </a>
        </div>
      </header>

      {open && (
        <MobileDrawer
          whatsappUrl={whatsappUrl}
          account={account}
          onSignOut={signOut}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

function AccountMenu({
  account,
  onClose,
  onSignOut,
}: {
  account: Account;
  onClose: () => void;
  onSignOut: () => void;
}) {
  const item = "block w-full px-[14px] py-[11px] text-left text-[12px] hover:bg-vanilla";
  return (
    <div role="menu" className="absolute right-0 top-[calc(100%+4px)] z-50 w-[200px] border border-line bg-white py-[6px] shadow-soft">
      <Link role="menuitem" href="/riwayat" onClick={onClose} className={item}>
        Pesanan Saya
      </Link>
      {account.isAdmin && (
        <Link role="menuitem" href="/admin" onClick={onClose} className={item}>
          Dashboard Admin
        </Link>
      )}
      <button type="button" role="menuitem" onClick={onSignOut} className={cn(item, "text-[#b3412f]")}>
        Keluar
      </button>
    </div>
  );
}

const drawerItem =
  "flex w-full items-center justify-between border-b border-line px-[2px] py-[16px] text-left text-[17px] font-light tracking-[.02em] text-chocolate";

function MobileDrawer({
  whatsappUrl,
  account,
  onSignOut,
  onClose,
}: {
  whatsappUrl: string;
  account: Account | null;
  onSignOut: () => void;
  onClose: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-white px-[22px] pb-[30px] pt-[8px]"
    >
      <div className="flex items-center justify-between">
        <button type="button" onClick={onClose} aria-label="Tutup menu" className={iconButton}>
          <X size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <Brand onClick={onClose} />
        <span className="w-[44px]" />
      </div>

      <nav className="mt-[18px] flex flex-col">
        {customerNav.map((item) => (
          <Link key={item.href} href={item.href} onClick={onClose} className={drawerItem}>
            {item.label}
          </Link>
        ))}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={onClose} className={drawerItem}>
          Hubungi Kami
        </a>
        {account ? (
          <>
            <Link href="/riwayat" onClick={onClose} className={drawerItem}>
              Pesanan Saya
            </Link>
            {account.isAdmin && (
              <Link href="/admin" onClick={onClose} className={drawerItem}>
                Dashboard Admin
              </Link>
            )}
            <button type="button" onClick={onSignOut} className={cn(drawerItem, "text-[#b3412f]")}>
              Keluar
            </button>
          </>
        ) : (
          <Link href="/masuk" onClick={onClose} className={drawerItem}>
            Masuk
          </Link>
        )}
      </nav>
    </div>
  );
}
