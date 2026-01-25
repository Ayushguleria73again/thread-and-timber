"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import CTA from "@/components/ui/CTA";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatCurrency } from "@/lib/utils";
import { type Product, allProducts } from "@/lib/products";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductReviews from "@/components/product/ProductReviews";
import ProductPageClient from "@/components/product/ProductPageClient";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Fetch main product
        const res = await fetch(`${apiUrl}/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct({
            ...data,
            id: data._id,
            inventory: data.stock,
            tag: data.isFeatured ? "best seller" : "crafted",
            sizes: data.sizes || ["S", "M", "L", "XL"],
          });
        }

        // Fetch recommendations (just all products for now)
        const recRes = await fetch(`${apiUrl}/products`);
        if (recRes.ok) {
          const data = await recRes.json();
          const rawProducts = Array.isArray(data) ? data : (data.products || []);
          setRecommendations(rawProducts
            .map((p: any) => ({
              ...p,
              id: p._id || p.id,
              inventory: p.stock ?? p.inventory,
              tag: p.isFeatured ? "best seller" : (p.tag || "crafted"),
              sizes: p.sizes || ["S", "M", "L", "XL"]
            }))
            .filter((p: any) => p.id !== params.id)
            .slice(0, 3)
          );
        }
      } catch (error) {
        console.error("Failed to fetch product data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sand">
        <p className="text-xs uppercase tracking-widest text-black/40 animate-pulse">Loading piece...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div className="relative h-[420px] overflow-hidden rounded-3xl border border-black/5 bg-white/70 sm:h-[520px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading
              label={product.category}
              title={product.name}
              subtitle={product.description}
            />
            <p className="text-sm uppercase tracking-[0.3em] text-moss">
              Materials
            </p>
            <p className="text-base text-black/70">{product.materials || "Natural Fibers"}</p>
            <div className="flex flex-wrap gap-2">
              {(product.sizes || ["S", "M", "L", "XL"]).map((size: string) => (
                <span
                  key={size}
                  className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black/70"
                >
                  {size}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-serif italic font-medium text-black">
                {formatCurrency(product.price)}
              </span>
              <span className="text-xs uppercase tracking-[0.24em] text-black/50">
                {product.inventory} in stock
              </span>
            </div>
            <ProductPageClient product={product} />
            <ProductDetailClient product={product} />
          </div>
        </div>
        <ProductReviews productId={product.id} />
      </section>

      {recommendations.length > 0 && (
        <section className="container-pad pb-20">
          <SectionHeading
            label="You might also like"
            title="More handcrafted favorites"
            subtitle="Small-batch pieces with natural textures."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {/* Note: In a real app we'd use a real ProductCard here, but for brevity using simple preview logic */}
             {recommendations.map((item: any) => (
                <div key={item.id} className="group relative rounded-2xl border border-black/5 bg-white p-4">
                    <div className="relative aspect-square overflow-hidden rounded-xl">
                        <Image src={item.image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                    </div>
                    <h4 className="mt-4 font-serif text-lg">{item.name}</h4>
                    <p className="text-sm text-black/60">{formatCurrency(item.price)}</p>
                    <a href={`/products/${item.id}`} className="absolute inset-0" />
                </div>
             ))}
          </div>
        </section>
      )}

      <CTA />
      <Footer />
    </div>
  );
}
