import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // memuat hanya ikon/grafik yang dipakai (bundle JS lebih kecil, halaman lebih cepat terbuka di HP)
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  images: {
    // gambar yang sudah dioptimasi disimpan 30 hari agar tidak diproses ulang
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // gambar produk yang diunggah ke Supabase Storage
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
