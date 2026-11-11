import type { Metadata } from "next";
import { CustomersView } from "@/components/admin/views/CustomersView";

export const metadata: Metadata = { title: "Pelanggan" };

export default function Page() {
  return <CustomersView />;
}
