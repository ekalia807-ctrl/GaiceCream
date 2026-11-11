/** "082146376899" -> "6282146376899" (format yang dipakai wa.me) */
export function toInternationalPhone(local: string) {
  const digits = local.replace(/\D/g, "");
  return digits.startsWith("0") ? `62${digits.slice(1)}` : digits;
}

/** "082146376899" -> "0821 4637 6899" */
export function formatLocalPhone(local: string) {
  const digits = local.replace(/\D/g, "");
  return [digits.slice(0, 4), digits.slice(4, 8), digits.slice(8)]
    .filter(Boolean)
    .join(" ");
}

/** "+62 812-3456-7890" / "6281234567890" / "081234567890" -> "081234567890" */
export function normalizeLocalPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.startsWith("62")) return `0${digits.slice(2)}`;
  if (digits.startsWith("8")) return `0${digits}`;
  return digits;
}
