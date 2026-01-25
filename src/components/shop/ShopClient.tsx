"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiFilter, FiSearch, FiSliders } from "react-icons/fi";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/products";

type ShopClientProps = {
  products: Product[];
  categories: string[];
};

type SortOption = "default" | "price-low" | "price-high" | "newest";

export default function ShopClient({ products, categories }: ShopClientProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam);
    } else {
      setActiveCategory("All");
    }
  }, [categoryParam]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    materials: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    priceRange: [0, 25000] as [number, number],
  });
  
  // Re-adding states needed for main view
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  
  const tags = ["best seller", "new", "limited", "crafted"];

  const availableMaterials = useMemo(() => 
    Array.from(new Set(products.map(p => p.materials).filter(Boolean))), 
    [products]
  );

  const availableColors = useMemo(() => 
    Array.from(new Set(products.flatMap(p => p.palette || []))),
    [products]
  );

  const availableSizes = useMemo(() => 
    Array.from(new Set(products.flatMap(p => p.sizes || []))),
    [products]
  );

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      const matchesCategory =
        activeCategory === "All" || product.category === activeCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());
      const matchesPrice =
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
      const matchesTag = !activeTag || product.tag === activeTag;
      
      const matchesMaterial = filters.materials.length === 0 || 
        (product.materials && filters.materials.includes(product.materials));
      
      const matchesColor = filters.colors.length === 0 || 
        (product.palette && product.palette.some(c => filters.colors.includes(c)));

      const matchesSize = filters.sizes.length === 0 ||
        (product.sizes && product.sizes.some(s => filters.sizes.includes(s)));

      return matchesCategory && matchesSearch && matchesPrice && matchesTag && matchesMaterial && matchesColor && matchesSize;
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => {
        const aNew = a.tag === "new" ? 1 : 0;
        const bNew = b.tag === "new" ? 1 : 0;
        return bNew - aNew;
      });
    }

    return result;
  }, [products, activeCategory, search, filters, activeTag, sortBy]);

  return (
    <section className="container-pad py-12">
      <SectionHeading
        label="Shop"
        title="Handcrafted apparel and home goods"
        subtitle="Browse tees, jackets, accessories, and slow-made essentials."
      />
      <div className="mt-8 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-3">
            {["All", ...categories].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${
                  activeCategory === category
                    ? "border-black/30 bg-black text-sand"
                    : "border-black/10 text-black/70"
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
            className="w-full rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm text-black outline-none md:w-64"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-black/5 bg-white/70 p-4 backdrop-blur-xl">
            <button
               onClick={() => setIsFilterOpen(true)}
               className="flex items-center gap-2 rounded-full bg-black px-6 py-2 text-[10px] uppercase tracking-widest text-sand shadow-lg hover:bg-black/90 transition-all"
            >
              <FiFilter /> Filters {(filters.materials.length + filters.colors.length + filters.sizes.length) > 0 ? `(${filters.materials.length + filters.colors.length + filters.sizes.length})` : ''}
            </button>
            <div className="h-6 w-px bg-black/10 mx-2" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`rounded-full border px-4 py-1.5 text-[10px] uppercase tracking-widest transition-all ${
                    activeTag === tag
                      ? "border-moss bg-moss text-sand shadow-sm"
                      : "border-black/10 text-black/60 hover:border-black/30"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none rounded-full border border-black/10 bg-white px-8 py-3 text-[10px] uppercase tracking-[0.2em] text-black outline-none cursor-pointer pr-12 focus:border-moss transition-colors shadow-soft"
              >
                <option value="default">Default Sequence</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Latest Drops</option>
              </select>
              <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none group-hover:text-black/40 transition-colors" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
      <FilterSidebar 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        availableMaterials={availableMaterials}
        availableColors={availableColors}
        availableSizes={availableSizes}
        priceBounds={[0, 25000]}
      />
    </section>
  );
}

