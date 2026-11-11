"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { errorClass, inputClass, labelClass } from "@/components/ui/formStyles";
import { createClient } from "@/lib/supabase/client";
import { registerSchema, type RegisterValues } from "@/lib/validation/auth";

function translateError(message: string) {
  if (/already registered/i.test(message)) return "Email ini sudah terdaftar. Silakan masuk.";
  if (/password/i.test(message)) return "Password belum memenuhi syarat. Gunakan minimal 8 karakter.";
  return "Pendaftaran belum berhasil. Coba lagi sebentar lagi.";
}

export function RegisterForm({ next }: { next: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", whatsapp: "", password: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFormError("");
    const { data, error } = await createClient().auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { full_name: values.fullName, whatsapp: values.whatsapp },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setFormError(translateError(error.message));
      return;
    }
    if (data.session) {
      router.replace(next);
      router.refresh();
      return;
    }
    // Supabase meminta verifikasi email terlebih dahulu
    setNotice(
      "Pendaftaran berhasil. Kami mengirim email verifikasi. Buka emailnya (cek juga folder spam), klik tautan verifikasi, lalu masuk.",
    );
  });

  if (notice) {
    return (
      <div className="text-center">
        <p className="text-[13px] leading-[1.7] text-muted">{notice}</p>
        <Link href={`/masuk?next=${encodeURIComponent(next)}`} className="mt-[18px] inline-block font-bold text-biscuit">
          Ke halaman masuk
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <label className={labelClass}>
        Nama lengkap
        <input
          {...register("fullName")}
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          className={inputClass}
        />
        {errors.fullName && <span className={errorClass}>{errors.fullName.message}</span>}
      </label>
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
        Nomor WhatsApp
        <input
          {...register("whatsapp")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="0812 3456 7890"
          aria-invalid={Boolean(errors.whatsapp)}
          className={inputClass}
        />
        {errors.whatsapp && <span className={errorClass}>{errors.whatsapp.message}</span>}
      </label>
      <label className={labelClass}>
        Password
        <input
          {...register("password")}
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          className={inputClass}
        />
        {errors.password && <span className={errorClass}>{errors.password.message}</span>}
      </label>
      <label className={labelClass}>
        Ulangi password
        <input
          {...register("confirmPassword")}
          type="password"
          autoComplete="new-password"
          aria-invalid={Boolean(errors.confirmPassword)}
          className={inputClass}
        />
        {errors.confirmPassword && <span className={errorClass}>{errors.confirmPassword.message}</span>}
      </label>

      {formError && (
        <p role="alert" className={`${errorClass} mt-[14px]`}>
          {formError}
        </p>
      )}

      <Button type="submit" full disabled={isSubmitting} className="mt-[22px]">
        {isSubmitting ? "Memproses..." : "Daftar"}
      </Button>
      <p className="mt-[18px] text-center text-[12px] text-muted">
        Sudah punya akun?{" "}
        <Link href={`/masuk?next=${encodeURIComponent(next)}`} className="font-bold text-biscuit">
          Masuk
        </Link>
      </p>
    </form>
  );
}
