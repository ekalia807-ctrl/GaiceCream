import type { Metadata } from "next";
import { SettingsView } from "@/components/admin/views/SettingsView";

export const metadata: Metadata = { title: "Pengaturan" };

export default function Page() {
  return <SettingsView />;
}
