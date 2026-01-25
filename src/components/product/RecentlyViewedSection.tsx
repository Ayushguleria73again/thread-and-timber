"use client";

import { useRecentlyViewed } from "@/components/product/RecentlyViewedProvider";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";

export default function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="container-pad py-12">
      <SectionHeading
        label="Recently Viewed"
        title="Continue browsing"
        subtitle="Pick up where you left off."
      />
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((product: any, index: number) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
