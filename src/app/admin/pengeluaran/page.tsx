import type { Metadata } from "next";
import { CashView } from "@/components/admin/views/CashView";

export const metadata: Metadata = { title: "Pemasukan & Pengeluaran" };

export default function Page() {
  return <CashView />;
}
