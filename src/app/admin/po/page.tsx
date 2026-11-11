import type { Metadata } from "next";
import { PoView } from "@/components/admin/views/PoView";

export const metadata: Metadata = { title: "Periode PO" };

export default function Page() {
  return <PoView />;
}
