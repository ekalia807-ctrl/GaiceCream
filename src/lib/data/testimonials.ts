import type { Testimonial } from "@/types/product";

/**
 * Testimoni dikosongkan sesuai permintaan: bagian "Kata mereka" di Home
 * tidak tampil sampai ada data asli (Tahap 6: tabel `testimonials`).
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  return [];
}
