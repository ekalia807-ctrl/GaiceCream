import { BestSellers } from "@/components/home/BestSellers";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FlavorSection } from "@/components/home/FlavorSection";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustStrip } from "@/components/home/TrustStrip";
import { getFeaturedProducts, getProducts } from "@/lib/data/products";
import { getTestimonials } from "@/lib/data/testimonials";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ akses?: string }>;
}) {
  const { akses } = await searchParams;
  const [products, featured, testimonials] = await Promise.all([
    getProducts(),
    getFeaturedProducts(3),
    getTestimonials(),
  ]);

  if (products.length === 0) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-[20px] text-center text-muted">
        Produk belum tersedia.
      </main>
    );
  }

  const minPrice = Math.min(...products.map((product) => product.price));

  return (
    <main>
      {akses === "ditolak" && (
        <p role="alert" className="bg-[#f9e3df] px-[16px] py-[10px] text-center text-[12px] text-[#a8493a]">
          Akun ini tidak memiliki akses ke dashboard admin.
        </p>
      )}
      <Hero product={products[0]} minPrice={minPrice} />
      <TrustStrip flavorCount={products.length} />
      <BestSellers products={featured} />
      <FlavorSection products={products.slice(1, 5)} totalFlavors={products.length} />
      <Testimonials items={testimonials} />
      <CtaBanner />
    </main>
  );
}
