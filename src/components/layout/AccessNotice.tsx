"use client";

import { useSearchParams } from "next/navigation";

/** Pesan jika akun non-admin mencoba membuka /admin (dibaca di browser agar Home tetap statis). */
export function AccessNotice() {
  const akses = useSearchParams().get("akses");
  if (akses !== "ditolak") return null;
  return (
    <p role="alert" className="bg-[#f9e3df] px-[16px] py-[10px] text-center text-[12px] text-[#a8493a]">
      Akun ini tidak memiliki akses ke dashboard admin.
    </p>
  );
}
