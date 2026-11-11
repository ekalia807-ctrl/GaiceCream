"use client";

import { ArrowRight, ChevronDown, Menu, MessageCircle, User, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { customerNav } from "@/config/site";
import { createClient } from "@/lib/supabase/client";
import { cn, isActivePath } from "@/lib/utils";
import { Brand } from "./Brand";

export type HeaderAccount = { name: string; isAdmin: boolean } | null;

const circleButton =
  "grid h-[42px] w-[42px] place-items-center rounded-full border border-[#ead9cf] bg-white text-chocolate";

export function Header({
  whatsappUrl,
  account,
}: {
  whatsappUrl: string;
  account: HeaderAccount;
}) {
  const pathname = usePathname();
  const router = useRouter();
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
    const onClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
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
      <header className="sticky top-0 z-40 flex h-[88px] items-center justify-between border-b border-[rgba(113,63,50,.08)] bg-[rgba(255,250,243,.92)] px-[max(5vw,40px)] backdrop-blur-[15px] max-[800px]:h-[72px] max-[800px]:px-[18px]">
        <Brand compactOnMobile />

        <nav aria-label="Navigasi utama" className="flex items-center gap-[30px] max-[1050px]:hidden">
          {customerNav.map((item) => {
            const active = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative py-[10px] text-[14px] font-semibold hover:text-chocolate",
                  active
                    ? "text-chocolate after:absolute after:bottom-0 after:left-[calc(50%-2px)] after:h-[5px] after:w-[5px] after:rounded-full after:bg-strawberry-dark after:content-['']"
                    : "text-[#7f6259]",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-[10px]">
          {account ? (
            <div ref={menuRef} className="relative max-[800px]:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-[7px] rounded-full border border-[#e7d2c6] bg-white px-[14px] py-[10px] text-[13px] font-bold text-chocolate"
              >
                <User size={16} strokeWidth={1.8} aria-hidden="true" />
                <span className="max-w-[110px] truncate">{firstName}</span>
                <ChevronDown size={14} strokeWidth={1.8} aria-hidden="true" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] rounded-[16px] border border-[#f0dfd4] bg-white p-[8px] shadow-soft"
                >
                  <Link
                    role="menuitem"
                    href="/riwayat"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-[10px] px-[12px] py-[10px] text-[13px] hover:bg-vanilla"
                  >
                    Pesanan Saya
                  </Link>
                  {account.isAdmin && (
                    <Link
                      role="menuitem"
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-[10px] px-[12px] py-[10px] text-[13px] hover:bg-vanilla"
                    >
                      Dashboard Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={signOut}
                    className="block w-full rounded-[10px] px-[12px] py-[10px] text-left text-[13px] text-[#b3412f] hover:bg-vanilla"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <ButtonLink href="/masuk" variant="secondary" size="sm" className="max-[800px]:hidden">
              Masuk
            </ButtonLink>
          )}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat WhatsApp"
            className={cn(circleButton, "max-[800px]:hidden")}
          >
            <MessageCircle size={20} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <ButtonLink href="/pesan" size="sm" className="max-[800px]:hidden">
            Pesan Sekarang
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
            className={cn(circleButton, "hidden max-[1050px]:grid")}
          >
            <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Drawer dirender di luar <header> karena backdrop-filter header
          akan membatasi elemen fixed di dalamnya. */}
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

const drawerItem =
  "flex w-full items-center justify-between border-b border-[#e8d5c8] px-[5px] py-[17px] text-left font-heading text-[20px] text-chocolate";

function MobileDrawer({
  whatsappUrl,
  account,
  onSignOut,
  onClose,
}: {
  whatsappUrl: string;
  account: HeaderAccount;
  onSignOut: () => void;
  onClose: () => void;
}) {
  const arrow = <ArrowRight size={20} strokeWidth={1.8} aria-hidden="true" />;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[100] flex flex-col gap-[5px] overflow-y-auto bg-vanilla p-[25px]"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup menu"
        className="grid h-[40px] w-[40px] place-items-center self-end rounded-full bg-white"
      >
        <X size={20} strokeWidth={1.8} aria-hidden="true" />
      </button>

      <Brand onClick={onClose} className="mb-[30px] mt-[10px]" />

      {customerNav.map((item) => (
        <Link key={item.href} href={item.href} onClick={onClose} className={drawerItem}>
          {item.label}
          {arrow}
        </Link>
      ))}
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={onClose} className={drawerItem}>
        Hubungi Kami
        {arrow}
      </a>
      {account ? (
        <>
          <Link href="/riwayat" onClick={onClose} className={drawerItem}>
            Pesanan Saya
            {arrow}
          </Link>
          {account.isAdmin && (
            <Link href="/admin" onClick={onClose} className={drawerItem}>
              Dashboard Admin
              {arrow}
            </Link>
          )}
          <button type="button" onClick={onSignOut} className={cn(drawerItem, "text-[#b3412f]")}>
            Keluar
            {arrow}
          </button>
        </>
      ) : (
        <Link href="/masuk" onClick={onClose} className={drawerItem}>
          Masuk
          {arrow}
        </Link>
      )}
    </div>
  );
}
