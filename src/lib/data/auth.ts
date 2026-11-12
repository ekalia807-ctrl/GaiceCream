import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  whatsapp: string;
  role: "customer" | "admin";
};

/** Pengguna yang sedang login (null jika belum login). Diverifikasi ke server Supabase. */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, whatsapp, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    fullName: profile?.full_name ?? "",
    whatsapp: profile?.whatsapp ?? "",
    role: profile?.role === "admin" ? "admin" : "customer",
  };
});
