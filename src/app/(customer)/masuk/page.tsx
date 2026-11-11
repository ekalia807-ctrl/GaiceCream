import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { PageHero } from "@/components/ui/PageHero";
import { getSessionUser } from "@/lib/data/auth";
import { safeNextPath } from "@/lib/utils";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNextPath(params.next);

  if (await getSessionUser()) redirect(next);

  return (
    <main className="min-h-[70vh] bg-[#fffaf4] pb-[60px]">
      <PageHero
        compact
        eyebrow="Akun GAICREAM"
        title="Masuk"
        description="Masuk untuk memesan dan melihat riwayat pesananmu."
      />
      <AuthCard>
        <LoginForm
          next={next}
          initialError={
            params.error === "verifikasi"
              ? "Tautan verifikasi tidak valid atau sudah kedaluwarsa. Coba masuk atau daftar lagi."
              : undefined
          }
        />
      </AuthCard>
    </main>
  );
}
