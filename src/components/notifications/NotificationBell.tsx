"use client";

import { Bell, BellRing } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { useNotifications, type AppNotification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";

function timeAgo(iso: string) {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 60) return "Baru saja";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

type Permission = NotificationPermission | "unsupported";

/**
 * Lonceng notifikasi (dipakai di header customer dan dashboard admin).
 * - Notifikasi baru muncul langsung (tanpa refresh) sebagai toast.
 * - Jika pengguna mengizinkan, notifikasi juga tampil di perangkat saat tab sedang tidak dibuka.
 */
export function NotificationBell({
  userId,
  onNew,
  className,
}: {
  userId: string;
  /** dipanggil setiap ada notifikasi baru masuk (mis. admin menyegarkan daftar pesanan) */
  onNew?: (notification: AppNotification) => void;
  className?: string;
}) {
  const router = useRouter();
  const notify = useToast();
  const [open, setOpen] = useState(false);
  const [permission, setPermission] = useState<Permission>("unsupported");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPermission(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
  }, []);

  const handleNew = useCallback(
    (notification: AppNotification) => {
      notify(notification.title);
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted" &&
        document.visibilityState !== "visible"
      ) {
        try {
          new Notification(notification.title, {
            body: notification.body,
            icon: "/images/logo.jpeg",
            tag: notification.id,
          });
        } catch {
          // beberapa browser HP hanya mengizinkan lewat service worker: abaikan
        }
      }
      onNew?.(notification);
    },
    [notify, onNew],
  );

  const { items, unread, markRead, markAllRead } = useNotifications(userId, handleNew);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function enableDeviceNotifications() {
    if (typeof Notification === "undefined") return;
    const result = await Notification.requestPermission();
    setPermission(result);
  }

  function openItem(item: AppNotification) {
    if (!item.read) markRead(item.id);
    setOpen(false);
    if (item.link) router.push(item.link);
  }

  const Icon = unread > 0 ? BellRing : Bell;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={unread > 0 ? `Notifikasi, ${unread} belum dibaca` : "Notifikasi"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="relative grid h-[44px] w-[44px] place-items-center text-chocolate"
      >
        <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
        {unread > 0 && (
          <span className="absolute right-[5px] top-[5px] grid min-h-[16px] min-w-[16px] place-items-center rounded-full bg-[#c2410c] px-[4px] text-[9px] font-medium leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifikasi"
          className="fixed inset-x-[12px] top-[64px] z-[90] max-h-[70vh] overflow-hidden border border-line bg-white shadow-soft min-[640px]:absolute min-[640px]:inset-x-auto min-[640px]:right-0 min-[640px]:top-[calc(100%+6px)] min-[640px]:w-[360px]"
        >
          <div className="flex items-center justify-between border-b border-line px-[16px] py-[12px]">
            <b className="text-[12px] font-medium uppercase tracking-[.14em]">Notifikasi</b>
            {unread > 0 && (
              <button type="button" onClick={markAllRead} className="text-[11px] text-muted underline">
                Tandai semua dibaca
              </button>
            )}
          </div>

          <ul className="max-h-[calc(70vh-100px)] overflow-y-auto overscroll-contain">
            {items.length === 0 ? (
              <li className="px-[16px] py-[34px] text-center text-[12px] text-muted">
                Belum ada notifikasi.
              </li>
            ) : (
              items.map((item) => (
                <li key={item.id} className="border-b border-[#f5f5f4] last:border-b-0">
                  <button
                    type="button"
                    onClick={() => openItem(item)}
                    className={cn(
                      "flex w-full gap-[10px] px-[16px] py-[13px] text-left hover:bg-vanilla",
                      !item.read && "bg-[#faf9f8]",
                    )}
                  >
                    <i
                      aria-hidden="true"
                      className={cn(
                        "mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full",
                        item.read ? "bg-transparent" : "bg-[#c2410c]",
                      )}
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-[2px]">
                      <b className="text-[13px] font-medium">{item.title}</b>
                      {item.body && <span className="text-[12px] leading-[1.5] text-muted">{item.body}</span>}
                      <small className="mt-[2px] text-[10px] text-[#a8a29e]">{timeAgo(item.createdAt)}</small>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>

          {permission === "default" && (
            <div className="border-t border-line bg-vanilla px-[16px] py-[11px]">
              <button
                type="button"
                onClick={enableDeviceNotifications}
                className="text-[11px] font-medium underline"
              >
                Aktifkan notifikasi di perangkat ini
              </button>
              <p className="mt-[2px] text-[10px] text-muted">
                Supaya kamu tetap dapat kabar walau tab ini sedang tidak dibuka.
              </p>
            </div>
          )}
          {permission === "denied" && (
            <p className="border-t border-line bg-vanilla px-[16px] py-[10px] text-[10px] text-muted">
              Notifikasi perangkat diblokir di pengaturan browser. Notifikasi tetap muncul di sini.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
