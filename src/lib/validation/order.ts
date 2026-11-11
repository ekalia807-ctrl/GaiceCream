import { z } from "zod";

const PHONE_PATTERN = /^(\+62|62|0)8[0-9]{8,12}$/;

export const orderFormSchema = z
  .object({
    customerName: z.string().trim().min(2, "Nama minimal 2 huruf"),
    whatsapp: z
      .string()
      .trim()
      .refine(
        (value) => PHONE_PATTERN.test(value.replace(/[\s-]/g, "")),
        "Nomor WhatsApp tidak valid. Contoh: 0812 3456 7890",
      ),
    deliveryMethod: z.enum(["pickup", "delivery"]),
    address: z.string().trim().optional(),
    notes: z.string().trim().max(300, "Catatan maksimal 300 karakter").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === "delivery" && (data.address ?? "").length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["address"],
        message: "Alamat lengkap wajib diisi untuk delivery",
      });
    }
  });

export type OrderFormValues = z.infer<typeof orderFormSchema>;
