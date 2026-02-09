"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import type { Product } from "@/lib/products";

type ShopClientProps = {
  products: Product[];
  categories: string[];
};

export default function ShopClient({ products, categories }: ShopClientProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <section className="container-pad py-12">
      <SectionHeading
        label="Shop"
        title="Handcrafted apparel and home goods"
        subtitle="Browse tees, jackets, accessories, and slow-made essentials."
      />
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-3">
          {["All", ...categories].map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${
                activeCategory === category
                  ? "border-ink/30 bg-ink text-sand"
                  : "border-ink/10 text-ink/70"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search items"
          className="w-full rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-sm text-ink outline-none md:w-64"
        />
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

