"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { FiChevronRight } from "react-icons/fi";
import type { Product } from "@/lib/products";

type CategorySliderProps = {
  category: string;
  products: Product[];
};

export default function CategorySlider({ category, products }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <div className="container-pad">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif italic font-medium text-black">
              {category}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-black/40 mt-1">
              {products.length} handcrafted piece{products.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href={`/shop?category=${encodeURIComponent(category)}`}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-moss hover:text-black transition-colors"
          >
            View All <FiChevronRight className="text-sm" />
          </Link>
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
