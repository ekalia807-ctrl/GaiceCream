"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { useAdminSettings } from "@/hooks/useAdminData";
import { useAdminReady } from "@/hooks/useAdminData";
import { defaultSettings, settingsStore } from "@/lib/admin/repository";
import { settingsFormSchema, type SettingsFormValues } from "@/lib/validation/admin";
import type { StoreSettings } from "@/types/admin";
import { AdminTitle } from "../AdminTitle";
import { AdminLoading } from "../EmptyState";
import { Panel } from "../Panel";
import { adminError, adminInput, adminLabel } from "../styles";
import { useToast } from "../ToastProvider";

function SettingsForm({ settings }: { settings: StoreSettings }) {
  const notify = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      ownerName: settings.ownerName,
      email: settings.email,
      storeName: settings.storeName,
      whatsapp: settings.whatsapp,
      address: settings.address,
      instagram: settings.instagram,
      tiktok: settings.tiktok,
    },
  });

  const onSubmit = handleSubmit((values) => {
    if (settingsStore.getSnapshot().length === 0) {
      settingsStore.add({ ...defaultSettings, ...values });
    } else {
      settingsStore.update("store", values);
    }
    notify("Pengaturan berhasil disimpan");
  });

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-[800px]">
      <Panel className="mb-[16px]">
        <h3 className="text-[14px]">Profil Pemilik</h3>
        <div className="my-[20px] flex items-center gap-[14px]">
          <Image
            src="/images/logo.jpeg"
            alt="Logo GAICREAM"
            width={65}
            height={65}
            className="h-[65px] w-[65px] rounded-full object-cover"
          />
          <div className="flex flex-col items-start gap-[6px]">
            <b className="text-[11px]">Logo & foto profil</b>
            <button
              type="button"
              disabled
              className="rounded-[8px] bg-[#fff0f4] px-[10px] py-[6px] text-[10px] text-[#b15f78] opacity-60"
            >
              Ganti foto
            </button>
            <small className="text-[10px] text-muted">Unggah logo belum tersedia. Logo diganti lewat file di folder public/images.</small>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
          <label className={adminLabel}>
            Nama pemilik
            <input {...register("ownerName")} className={adminInput} />
            {errors.ownerName && <span className={adminError}>{errors.ownerName.message}</span>}
          </label>
          <label className={adminLabel}>
            Email
            <input {...register("email")} type="email" placeholder="nama@email.com" className={adminInput} />
            {errors.email && <span className={adminError}>{errors.email.message}</span>}
          </label>
        </div>
      </Panel>

      <Panel className="mb-[16px]">
        <h3 className="text-[14px]">Informasi Toko</h3>
        <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
          <label className={adminLabel}>
            Nama toko
            <input {...register("storeName")} className={adminInput} />
            {errors.storeName && <span className={adminError}>{errors.storeName.message}</span>}
          </label>
          <label className={adminLabel}>
            Nomor WhatsApp
            <input {...register("whatsapp")} type="tel" className={adminInput} />
            {errors.whatsapp && <span className={adminError}>{errors.whatsapp.message}</span>}
          </label>
        </div>
        <div className="grid grid-cols-2 gap-[14px] max-[520px]:grid-cols-1">
          <label className={adminLabel}>
            Link Instagram
            <input {...register("instagram")} placeholder="https://www.instagram.com/gaicream.id" className={adminInput} />
            {errors.instagram && <span className={adminError}>{errors.instagram.message}</span>}
          </label>
          <label className={adminLabel}>
            Link TikTok (opsional)
            <input {...register("tiktok")} placeholder="https://www.tiktok.com/@akun" className={adminInput} />
            {errors.tiktok && <span className={adminError}>{errors.tiktok.message}</span>}
          </label>
        </div>
        <label className={adminLabel}>
          Alamat toko
          <textarea {...register("address")} rows={3} className={`${adminInput} min-h-[80px] resize-y`} />
          {errors.address && <span className={adminError}>{errors.address.message}</span>}
        </label>
      </Panel>

      <Button type="submit">Simpan Perubahan</Button>
      <p className="mt-[12px] text-[11px] text-muted">
        Nomor WhatsApp, link sosial media, email, dan alamat ditampilkan di website (header, footer, dan tombol chat).
      </p>
    </form>
  );
}

export function SettingsView() {
  const ready = useAdminReady();
  const settings = useAdminSettings();

  if (!ready) return <AdminLoading />;

  return (
    <div>
      <AdminTitle eyebrow="Profil dan toko" title="Pengaturan Akun" />
      <SettingsForm settings={settings ?? defaultSettings} />
    </div>
  );
}
