"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type Account = { id: string; name: string; isAdmin: boolean };
type State = { loading: boolean; account: Account | null };

/**
 * Akun yang sedang login, dibaca di browser (sesi dari cookie, tanpa menunggu server).
 * Dengan begini layout customer tidak perlu membaca cookie di server, sehingga halaman
 * publik bisa disajikan dari cache dan terasa instan.
 */
export function useAccount(): State {
  const [state, setState] = useState<State>({ loading: true, account: null });

  useEffect(() => {
    let active = true;
    let supabase: ReturnType<typeof createClient>;
    try {
      supabase = createClient();
    } catch {
      // Supabase belum dikonfigurasi: anggap belum login
      setState({ loading: false, account: null });
      return;
    }

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) {
        if (active) setState({ loading: false, account: null });
        return;
      }
      const meta = user.user_metadata as { full_name?: string };
      const fallbackName = meta.full_name || user.email || "Akun";
      // tampilkan nama dulu, peran (admin/bukan) menyusul setelah profil terbaca
      if (active) setState({ loading: false, account: { id: user.id, name: fallbackName, isAdmin: false } });

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", user.id)
        .maybeSingle();
      if (active && profile) {
        setState({
          loading: false,
          account: {
            id: user.id,
            name: profile.full_name || fallbackName,
            isAdmin: profile.role === "admin",
          },
        });
      }
    }

    void load();
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load();
      }
    });
    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return state;
}
