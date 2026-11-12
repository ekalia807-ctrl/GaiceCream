"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AppNotification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

type Row = Record<string, unknown>;

function fromRow(row: Row): AppNotification {
  return {
    id: String(row.id),
    type: String(row.type ?? ""),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    link: row.link ? String(row.link) : null,
    read: Boolean(row.read),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}

const MAX_ITEMS = 30;

/**
 * Notifikasi milik satu pengguna: daftar terbaru + pembaruan langsung (Supabase Realtime).
 * Jika tabel notifications belum dibuat (migrasi 0002 belum dijalankan), hook ini diam saja
 * dan website tetap berjalan normal.
 */
export function useNotifications(
  userId: string | null,
  onNew?: (notification: AppNotification) => void,
) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const onNewRef = useRef(onNew);
  useEffect(() => {
    onNewRef.current = onNew;
  }, [onNew]);

  useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    let active = true;
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      return;
    }

    void (async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (active && data) setItems((data as Row[]).map(fromRow));
    })();

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          const created = fromRow(payload.new as Row);
          setItems((previous) =>
            previous.some((item) => item.id === created.id)
              ? previous
              : [created, ...previous].slice(0, MAX_ITEMS),
          );
          onNewRef.current?.(created);
        },
      )
      .subscribe();

    return () => {
      active = false;
      void supabase.removeChannel(channel);
    };
  }, [userId]);

  const markRead = useCallback((id: string) => {
    setItems((previous) => previous.map((item) => (item.id === id ? { ...item, read: true } : item)));
    void createClient().from("notifications").update({ read: true }).eq("id", id);
  }, []);

  const markAllRead = useCallback(() => {
    setItems((previous) => previous.map((item) => ({ ...item, read: true })));
    if (userId) {
      void createClient()
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
    }
  }, [userId]);

  const unread = items.filter((item) => !item.read).length;
  return { items, unread, markRead, markAllRead };
}
