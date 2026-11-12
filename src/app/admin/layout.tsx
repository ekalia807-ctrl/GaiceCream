import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getSessionUser } from "@/lib/data/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin GAICREAM" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lapisan kedua setelah middleware; keamanan data sebenarnya dijaga RLS di database.
  const user = await getSessionUser();
  if (!user) redirect("/masuk?next=/admin");
  if (user.role !== "admin") redirect("/?akses=ditolak");

  return <AdminShell userId={user.id}>{children}</AdminShell>;
}
