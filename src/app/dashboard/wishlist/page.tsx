"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";
import { useAuth } from "@/components/auth/AuthProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import { FiHeart } from "react-icons/fi";

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
        <SectionHeading
          label="Wishlist"
          title="Saved for later"
          subtitle="Products you've saved to purchase later."
        />
        {items.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(items || []).map((product: any, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-black/5 bg-white/70 p-12 text-center">
            <FiHeart className="mx-auto mb-4 text-4xl text-black/30" />
            <p className="text-sm text-black/70">Your wishlist is empty</p>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
