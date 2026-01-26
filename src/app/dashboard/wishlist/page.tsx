"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import CategorySlider from "@/components/product/CategorySlider";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import { FiHeart, FiArrowLeft } from "react-icons/fi";
import type { Product } from "@/lib/products";

export default function WishlistPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-sand">
      <section className="container-pad py-12">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/" 
            className="group mb-8 flex w-fit items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-black/40 hover:text-black transition-colors"
          >
            <FiArrowLeft className="text-sm transition-transform group-hover:-translate-x-1" />
            Back to Studio
          </Link>
          <SectionHeading
            label="Wishlist"
            title="Saved for later"
            subtitle="Products you've saved to purchase later."
          />
        
          {items.length > 0 ? (
            <div className="mt-10 space-y-4">
              {Object.entries(
                items.reduce((acc: any, product: Product) => {
                  if (!acc[product.category]) acc[product.category] = [];
                  acc[product.category].push(product);
                  return acc;
                }, {})
              ).map(([category, products]: [string, any]) => (
                <CategorySlider 
                  key={category} 
                  category={category} 
                  products={products} 
                />
              ))}
            </div>
          ) : (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white/70 p-12 text-center">
            <FiHeart className="mx-auto mb-4 text-4xl text-black/30" />
            <p className="text-sm text-black/70">Your wishlist is empty</p>
          </div>
        )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
