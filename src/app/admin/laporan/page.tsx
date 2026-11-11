import type { Metadata } from "next";
import { FinanceView } from "@/components/admin/views/FinanceView";

export const metadata: Metadata = { title: "Laporan Keuangan" };

export default function Page() {
  return <FinanceView />;
}
