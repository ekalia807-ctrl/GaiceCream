import { Suspense } from "react";
import { BestSellers } from "@/components/home/BestSellers";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FlavorSection } from "@/components/home/FlavorSection";
import { Hero } from "@/components/home/Hero";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustStrip } from "@/components/home/TrustStrip";
import { AccessNotice } from "@/components/layout/AccessNotice";
import { getProducts } from "@/lib/data/products";
import { getTestimonials } from "@/lib/data/testimonials";

export default async function HomePage() {
  const [products, testimonials] = await Promise.all([getProducts(), getTestimonials()]);

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
      <Suspense fallback={null}>
        <AccessNotice />
      </Suspense>
      <Hero product={products[0]} minPrice={minPrice} />
      <TrustStrip flavorCount={products.length} />
      <BestSellers products={products.slice(0, 3)} />
      <FlavorSection products={products.slice(1, 5)} totalFlavors={products.length} />
      <Testimonials items={testimonials} />
      <CtaBanner />
    </main>
  );
}
