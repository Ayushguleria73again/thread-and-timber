"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";

import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const { products } = await res.json();
          setResults(products.map((p: any) => ({ ...p, id: p._id })));
        }
      } catch (error) {
        console.error("Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <>
      <SectionHeading
        label="Search Results"
        title={query ? `Results for "${query}"` : "Search Products"}
        subtitle={
          results.length > 0
            ? `Found ${results.length} product${results.length > 1 ? "s" : ""}`
            : "No products found"
        }
      />
      {results.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((product: any, index: number) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-black/5 bg-white/70 p-12 text-center">
          <p className="text-sm text-black/70">Try a different search term</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <Suspense fallback={
          <div className="flex h-64 items-center justify-center">
            <p className="text-sm uppercase tracking-widest text-black/40 animate-pulse">Searching the studio...</p>
          </div>
        }>
          <SearchContent />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}
