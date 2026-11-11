import type { Metadata } from "next";
import { OrdersView } from "@/components/admin/views/OrdersView";

export const metadata: Metadata = { title: "Pesanan" };

export default function Page() {
  return <OrdersView />;
}
