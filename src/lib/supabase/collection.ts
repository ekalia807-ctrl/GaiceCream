import { createClient } from "./client";
import type { Row } from "./mappers";

type Listener = () => void;
type Status = "idle" | "loading" | "ready" | "error";

const EMPTY: never[] = [];

export type RemoteCollection<T extends { id: string }> = {
  subscribe: (listener: Listener) => () => void;
  getSnapshot: () => T[];
  getServerSnapshot: () => T[];
  /** true setelah data pertama selesai dimuat (atau gagal dimuat) */
  isReady: () => boolean;
  refresh: () => Promise<void>;
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
};

type Options<T> = {
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean }[];
  fromRow: (row: Row) => T;
  toRow: (item: Partial<T>) => Row;
};

let errorHandler: ((message: string) => void) | null = null;

/** Dipakai AdminShell agar kegagalan simpan muncul sebagai toast. */
export function setStoreErrorHandler(handler: ((message: string) => void) | null) {
  errorHandler = handler;
}

function report(message: string) {
  if (errorHandler) errorHandler(message);
  else console.error(message);
}

/**
 * Koleksi data dari tabel Supabase dengan cache di memori.
 * Perubahan ditampilkan langsung (optimistic) lalu disimpan ke database;
 * jika gagal, data dimuat ulang dari database dan pesan error ditampilkan.
 */
export function createRemoteCollection<T extends { id: string }>(
  options: Options<T>,
): RemoteCollection<T> {
  const listeners = new Set<Listener>();
  let cache: T[] = EMPTY;
  let status: Status = "idle";

  function emit() {
    listeners.forEach((listener) => listener());
  }

  async function refresh() {
    const supabase = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from(options.table).select(options.select ?? "*");
    for (const order of options.orderBy ?? []) {
      query = query.order(order.column, { ascending: order.ascending ?? true });
    }
    const { data, error } = (await query) as {
      data: Row[] | null;
      error: { message: string } | null;
    };
    if (error) {
      status = "error";
      report(`Gagal memuat data: ${error.message}`);
    } else {
      cache = (data ?? []).map(options.fromRow);
      status = "ready";
    }
    emit();
  }

  function ensureLoaded() {
    if (status === "idle" && typeof window !== "undefined") {
      status = "loading";
      void refresh();
    }
  }

  async function persist(
    operation: (client: ReturnType<typeof createClient>) => PromiseLike<{ error: { message: string } | null }>,
  ) {
    try {
      const { error } = await operation(createClient());
      if (error) throw new Error(error.message);
    } catch (error) {
      report(error instanceof Error ? `Gagal menyimpan: ${error.message}` : "Gagal menyimpan perubahan");
      await refresh();
    }
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      ensureLoaded();
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => cache,
    getServerSnapshot: () => EMPTY,
    isReady: () => status === "ready" || status === "error",
    refresh,
    add(item) {
      cache = [...cache, item];
      emit();
      void persist((client) => client.from(options.table).insert(options.toRow(item)));
    },
    update(id, patch) {
      cache = cache.map((item) => (item.id === id ? { ...item, ...patch } : item));
      emit();
      void persist((client) =>
        client.from(options.table).update(options.toRow(patch)).eq("id", id),
      );
    },
    remove(id) {
      cache = cache.filter((item) => item.id !== id);
      emit();
      void persist((client) => client.from(options.table).delete().eq("id", id));
    },
  };
}
