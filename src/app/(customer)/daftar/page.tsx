import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { PageHero } from "@/components/ui/PageHero";
import { getSessionUser } from "@/lib/data/auth";
import { safeNextPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Daftar" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  if (await getSessionUser()) redirect(next);

  return (
    <main className="min-h-[70vh] bg-[#fffaf4] pb-[60px]">
      <PageHero
        compact
        eyebrow="Akun GAICREAM"
        title="Daftar"
        description="Buat akun agar bisa memesan dan memantau pesananmu."
      />
      <AuthCard>
        <RegisterForm next={next} />
      </AuthCard>
    </main>
  );
}
