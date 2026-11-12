"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "@/components/ui/formStyles";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues } from "@/lib/validation/auth";

function translateError(message: string) {
  if (/invalid login credentials/i.test(message)) return "Email atau password salah.";
  if (/email not confirmed/i.test(message)) {
    return "Email belum diverifikasi. Cek kotak masuk (dan folder spam) Anda.";
  }
  return "Belum bisa masuk. Coba lagi sebentar lagi.";
}

export function LoginForm({ next, initialError }: { next: string; initialError?: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState(initialError ?? "");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError("");
    const { error } = await createClient().auth.signInWithPassword(values);
    if (error) {
      setFormError(translateError(error.message));
      return;
    }
    router.replace(next);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className={labelClass}>
        Email
        <input
          {...register("email")}
          type="email"
          autoComplete="email"
          placeholder="nama@email.com"
          aria-invalid={Boolean(errors.email)}
          className={inputClass}
        />
        {errors.email && <span className={errorClass}>{errors.email.message}</span>}
      </label>
      <label className={labelClass}>
        Password
        <input
          {...register("password")}
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          className={inputClass}
        />
        {errors.password && <span className={errorClass}>{errors.password.message}</span>}
      </label>

      {formError && (
        <p role="alert" className={`${errorClass} mt-[14px]`}>
          {formError}
        </p>
      )}

      <Button type="submit" full disabled={isSubmitting} className="mt-[22px]">
        {isSubmitting ? "Memproses..." : "Masuk"}
      </Button>
      <p className="mt-[18px] text-center text-[12px] text-muted">
        Belum punya akun?{" "}
        <Link href={`/daftar?next=${encodeURIComponent(next)}`} className="font-medium text-chocolate underline">
          Daftar
        </Link>
      </p>
    </form>
  );
}
