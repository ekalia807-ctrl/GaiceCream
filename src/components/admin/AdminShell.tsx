"use client";

import {
  Bell,
  CalendarDays,
  LayoutGrid,
  LogOut,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  TrendingUp,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Brand } from "@/components/layout/Brand";
import { useAdminOrders, useAdminSettings } from "@/hooks/useAdminData";
import { useHydrated } from "@/hooks/useHydrated";
import { ordersStore, poStore, productsStore } from "@/lib/admin/repository";
import { setStoreErrorHandler } from "@/lib/supabase/collection";
import { formatLongDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ToastProvider, useToast } from "./ToastProvider";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean; badge?: boolean };

const mainNav: NavItem[] = [
  { href: "/admin", label: "Ringkasan", icon: LayoutGrid, exact: true },
  { href: "/admin/produk", label: "Produk", icon: Package },
  { href: "/admin/pesanan", label: "Pesanan", icon: ShoppingBag, badge: true },
  { href: "/admin/po", label: "Periode PO", icon: CalendarDays },
  { href: "/admin/pelanggan", label: "Pelanggan", icon: Users },
];

const financeNav: NavItem[] = [
  { href: "/admin/laporan", label: "Laporan Keuangan", icon: TrendingUp },
  { href: "/admin/pengeluaran", label: "Pemasukan & Pengeluaran", icon: Wallet },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const notify = useToast();
  const hydrated = useHydrated();
  const orders = useAdminOrders();
  const settings = useAdminSettings();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Kegagalan simpan/muat data tampil sebagai toast
  useEffect(() => {
    setStoreErrorHandler(notify);
    return () => setStoreErrorHandler(null);
  }, [notify]);

  // Pesanan baru dari website: segarkan saat tab kembali aktif dan tiap 60 detik
  useEffect(() => {
    const refresh = () => {
      void ordersStore.refresh();
      void productsStore.refresh();
      void poStore.refresh();
    };
    const timer = setInterval(refresh, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const waiting = orders.filter((order) => order.status === "menunggu").length;
  const storeName = settings?.storeName || "GAICREAM";
  const ownerLabel = settings?.ownerName || "Admin toko";

  const renderItem = (item: NavItem) => {
    const active = item.exact
      ? pathname === item.href
      : pathname === item.href || pathname.startsWith(`${item.href}/`);
    const Icon = item.icon;
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setSidebarOpen(false)}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-[12px] rounded-[12px] px-[13px] py-[12px] text-[12px]",
          active ? "bg-strawberry font-extrabold text-chocolate" : "text-[#896b62]",
        )}
      >
        <Icon size={20} strokeWidth={1.8} aria-hidden="true" />
        <span>{item.label}</span>
        {item.badge && waiting > 0 && (
          <i className="ml-auto grid h-[20px] w-[20px] place-items-center rounded-full bg-strawberry-dark text-[9px] not-italic text-white">
            {waiting}
          </i>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf8f4] text-[#57362e]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[80] flex w-[255px] flex-col border-r border-[#ebddd4] bg-[#fff9f2] px-[18px] py-[27px] transition-transform duration-[250ms] max-[800px]:-translate-x-full",
          sidebarOpen && "max-[800px]:translate-x-0 max-[800px]:shadow-[15px_0_40px_rgba(72,42,34,.15)]",
        )}
      >
        <Brand href="/admin" className="px-[12px] pb-[28px]" />
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup menu"
          className="absolute right-[10px] top-[10px] hidden h-[32px] w-[32px] place-items-center bg-white max-[800px]:grid"
        >
          <X size={20} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <nav aria-label="Navigasi admin" className="flex flex-col gap-[5px]">
          {mainNav.map(renderItem)}
          <span className="mx-[13px] mb-[8px] mt-[25px] text-[9px] tracking-[1.4px] text-[#ad9188]">
            KEUANGAN
          </span>
          {financeNav.map(renderItem)}
        </nav>

        <div className="mt-auto flex items-center gap-[9px] border-t border-[#eadbd1] px-[5px] pt-[20px]">
          <div className="grid h-[35px] w-[35px] place-items-center rounded-[10px] bg-strawberry text-[11px] font-extrabold">
            {ownerLabel.charAt(0).toUpperCase()}
          </div>
          <span className="flex flex-1 flex-col">
            <b className="text-[11px]">{ownerLabel}</b>
            <small className="text-[9px] text-muted">{storeName}</small>
          </span>
          <Link href="/" title="Kembali ke website" aria-label="Kembali ke website" className="text-muted">
            <LogOut size={20} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
      </aside>

      <main className="ml-[255px] min-h-screen max-[800px]:ml-0">
        <header className="flex h-[70px] items-center justify-end border-b border-[#eee2da] bg-white px-[35px] max-[800px]:px-[18px]">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu"
            className="mr-auto hidden place-items-center max-[800px]:grid"
          >
            <Menu size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <div className="mr-auto text-[11px] text-muted max-[800px]:hidden">
            {hydrated ? formatLongDate(new Date()) : ""}
          </div>
          <div className="flex items-center gap-[15px]">
            <Link
              href="/admin/pesanan"
              aria-label={waiting > 0 ? `${waiting} pesanan menunggu` : "Pesanan"}
              className="relative grid h-[35px] w-[35px] place-items-center rounded-full border border-[#eadbd1] bg-white"
            >
              <Bell size={18} strokeWidth={1.8} aria-hidden="true" />
              {waiting > 0 && (
                <i className="absolute right-[4px] top-[4px] h-[7px] w-[7px] rounded-full border-2 border-white bg-[#e27878]" />
              )}
            </Link>
            <Image
              src="/images/logo.jpeg"
              alt="Logo GAICREAM"
              width={36}
              height={36}
              className="h-[36px] w-[36px] rounded-full object-cover"
            />
          </div>
        </header>

        <div className="mx-auto max-w-[1450px] p-[36px] max-[800px]:px-[16px] max-[800px]:py-[24px]">
          {children}
        </div>
      </main>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <Shell>{children}</Shell>
    </ToastProvider>
  );
}
