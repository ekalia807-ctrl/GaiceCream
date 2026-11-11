export type Product = {
  id: string;
  name: string;
  category: string;
  /** harga per pcs dalam Rupiah */
  price: number;
  /** modal (HPP) per pcs dalam Rupiah, dipakai untuk laporan keuntungan */
  cost: number;
  stock: number;
  /** path gambar, mis. /images/products/matcha.jpeg */
  image: string;
  tag: string;
  /** warna aksen rasa (hex) */
  color: string;
  description: string;
  /** false = disembunyikan dari website */
  active: boolean;
  /** urutan tampil (kecil = lebih dulu) */
  sortOrder: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
};
