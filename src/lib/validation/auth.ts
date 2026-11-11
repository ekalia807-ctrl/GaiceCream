import { z } from "zod";

const PHONE_PATTERN = /^(\+62|62|0)8[0-9]{8,12}$/;

export const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(2, "Nama minimal 2 huruf"),
    email: z.string().trim().email("Format email tidak valid"),
    whatsapp: z
      .string()
      .trim()
      .refine(
        (value) => PHONE_PATTERN.test(value.replace(/[\s-]/g, "")),
        "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890",
      ),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Konfirmasi password tidak sama",
      });
    }
  });
export type RegisterValues = z.infer<typeof registerSchema>;
