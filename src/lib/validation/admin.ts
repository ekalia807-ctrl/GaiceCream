import { z } from "zod";

const PHONE_PATTERN = /^(\+62|62|0)8[0-9]{8,12}$/;

export const productFormSchema = z.object({
  name: z.string().trim().min(2, "Nama produk minimal 2 huruf"),
  category: z.string().trim().min(2, "Kategori wajib diisi"),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka" })
    .int("Harga harus bilangan bulat")
    .min(1, "Harga harus lebih dari 0"),
  cost: z
    .number({ invalid_type_error: "Modal harus berupa angka" })
    .int("Modal harus bilangan bulat")
    .min(0, "Modal tidak boleh negatif"),
  stock: z
    .number({ invalid_type_error: "Stok harus berupa angka" })
    .int("Stok harus bilangan bulat")
    .min(0, "Stok tidak boleh negatif"),
  tag: z.string().trim().max(20, "Label maksimal 20 karakter"),
  description: z.string().trim().max(200, "Deskripsi maksimal 200 karakter"),
  image: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || value.startsWith("/") || /^https?:\/\//.test(value),
      "Isi dengan path (/images/...) atau URL yang diawali https://",
    ),
  active: z.boolean(),
});
export type ProductFormValues = z.infer<typeof productFormSchema>;

export const transactionFormSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  category: z.string().min(1, "Pilih kategori"),
  amount: z
    .number({ invalid_type_error: "Nominal harus berupa angka" })
    .int("Nominal harus bilangan bulat")
    .min(1, "Nominal harus lebih dari 0"),
  description: z.string().trim().min(2, "Keterangan wajib diisi"),
});
export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const settingsFormSchema = z.object({
  ownerName: z.string().trim().max(60, "Maksimal 60 karakter"),
  email: z
    .string()
    .trim()
    .refine((value) => value === "" || /^\S+@\S+\.\S+$/.test(value), "Format email tidak valid"),
  storeName: z.string().trim().min(2, "Nama toko minimal 2 huruf"),
  whatsapp: z
    .string()
    .trim()
    .refine(
      (value) => PHONE_PATTERN.test(value.replace(/[\s-]/g, "")),
      "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890",
    ),
  address: z.string().trim().max(200, "Maksimal 200 karakter"),
  instagram: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\//.test(value), "Isi dengan URL lengkap, mis. https://www.instagram.com/gaicream.id"),
  tiktok: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\//.test(value), "Isi dengan URL lengkap, mis. https://www.tiktok.com/@akun"),
});
export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const poFormSchema = z.object({
  name: z.string().trim().min(2, "Nama PO minimal 2 huruf"),
  readyDate: z.string(),
  quota: z
    .number({ invalid_type_error: "Kuota harus berupa angka" })
    .int("Kuota harus bilangan bulat")
    .min(1, "Kuota minimal 1")
    .nullable(),
  note: z.string().trim().max(200, "Catatan maksimal 200 karakter"),
});
export type PoFormValues = z.infer<typeof poFormSchema>;
