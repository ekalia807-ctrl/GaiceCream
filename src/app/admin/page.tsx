import type { Metadata } from "next";
import { OverviewView } from "@/components/admin/views/OverviewView";

export const metadata: Metadata = { title: "Ringkasan" };

export default function Page() {
  return <OverviewView />;
}
