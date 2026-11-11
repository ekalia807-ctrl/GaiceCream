import { createClient } from "@/lib/supabase/server";

export type OpenPo = {
  id: string;
  name: string;
  /** YYYY-MM-DD */
  readyDate: string | null;
  quota: number | null;
  used: number;
  /** sisa kuota (null = tanpa batas) */
  remaining: number | null;
  note: string;
};

/** PO yang sedang dibuka, atau null jika PO ditutup. */
export async function getOpenPo(): Promise<OpenPo | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_open_po");
  if (error) throw new Error(`Gagal memuat info PO: ${error.message}`);

  const row = Array.isArray(data) ? data[0] : data;
  if (!row) return null;

  const quota = row.quota === null || row.quota === undefined ? null : Number(row.quota);
  const used = Number(row.used ?? 0);
  return {
    id: String(row.id),
    name: String(row.name),
    readyDate: row.ready_date ? String(row.ready_date).slice(0, 10) : null,
    quota,
    used,
    remaining: quota === null ? null : Math.max(quota - used, 0),
    note: String(row.note ?? ""),
  };
}
