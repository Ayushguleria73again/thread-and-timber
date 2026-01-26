"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useRecentlyViewed } from "@/components/product/RecentlyViewedProvider";
import ProductCard from "@/components/product/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

export default function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const scrollTo = direction === "left" 
            ? scrollLeft - clientWidth * 0.8 
            : scrollLeft + clientWidth * 0.8;
        
        scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="container-pad py-20 lg:py-32 overflow-hidden">
      <div className="flex items-end justify-between mb-12">
        <SectionHeading
            label="Recently Viewed"
            title="Continue browsing"
            subtitle="Pick up where you left off."
        />
        
        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden lg:flex items-center gap-3 mb-4">
            <button 
                onClick={() => scroll("left")}
                className="h-12 w-12 flex items-center justify-center rounded-full border border-black/5 bg-white/40 backdrop-blur-xl transition-all hover:bg-black hover:text-sand hover:border-black active:scale-90"
                aria-label="Previous pieces"
            >
                <FiArrowLeft className="text-lg" />
            </button>
            <button 
                onClick={() => scroll("right")}
                className="h-12 w-12 flex items-center justify-center rounded-full border border-black/5 bg-white/40 backdrop-blur-xl transition-all hover:bg-black hover:text-sand hover:border-black active:scale-90"
                aria-label="Next pieces"
            >
                <FiArrowRight className="text-lg" />
            </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-12 pt-4 snap-x no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((product: any, index: number) => (
          <div key={product.id} className="min-w-[300px] w-[300px] sm:w-[350px] sm:min-w-[350px] snap-center first:pl-2">
            <ProductCard product={product} index={index} />
          </div>
        ))}
        {/* Subtle end spacer */}
        <div className="min-w-[40px] h-full" />
      </div>

      {/* Mobile Indicator */}
      <div className="lg:hidden flex justify-center mt-6">
          <div className="h-1 w-24 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-moss rounded-full w-1/3"
                animate={{ x: [0, 60, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
          </div>
      </div>
    </section>
  );
}
