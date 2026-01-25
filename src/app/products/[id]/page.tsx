"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import CTA from "@/components/ui/CTA";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { formatCurrency } from "@/lib/utils";
import { allProducts, getProductById as getStaticProduct, type Product } from "@/lib/products";
import ProductDetailClient, {
  ProductCardPreview
} from "@/components/product/ProductDetailClient";
import ProductReviews from "@/components/product/ProductReviews";
import ProductPageClient from "@/components/product/ProductPageClient";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/products/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct({
            ...data,
            id: data._id,
            inventory: data.stock,
            tag: data.isFeatured ? "best seller" : "crafted",
            sizes: ["S", "M", "L", "XL"],
          });
        } else {
          // Try static fallback
          const staticProd = getStaticProduct(params.id);
          if (staticProd) setProduct(staticProd);
        }
      } catch (error) {
        const staticProd = getStaticProduct(params.id);
        if (staticProd) setProduct(staticProd);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-sand">
        <p className="text-xs uppercase tracking-widest text-ink/40 animate-pulse">Loading piece...</p>
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
            <p className="text-base text-black/70">{product.materials}</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
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
      <section className="container-pad pb-12">
        <SectionHeading
          label="You might also like"
          title="More handcrafted favorites"
          subtitle="Small-batch pieces with natural textures."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allProducts
            .filter((item) => item.id !== product.id)
            .slice(0, 3)
            .map((item, index) => (
              <div key={item.id} className="h-full">
                <ProductCardPreview product={item} index={index} />
              </div>
            ))}
        </div>
      </section>
      <CTA />
      <Footer />
    </div>
  );
}

