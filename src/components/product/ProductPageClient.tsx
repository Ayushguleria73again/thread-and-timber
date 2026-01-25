"use client";

import { useEffect } from "react";
import { FiShare2, FiHeart } from "react-icons/fi";
import { useRecentlyViewed } from "@/components/product/RecentlyViewedProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import type { Product } from "@/lib/products";

type ProductPageClientProps = {
  product: Product;
};

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const { addProduct } = useRecentlyViewed();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    addProduct(product);
  }, [product, addProduct]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggleWishlist(product)}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] ${
          isInWishlist(product.id)
            ? "border-moss bg-moss text-sand"
            : "border-black/10 text-black"
        }`}
      >
        <FiHeart className={isInWishlist(product.id) ? "fill-current" : ""} />{" "}
        {isInWishlist(product.id) ? "Saved" : "Save"}
      </button>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black"
      >
        <FiShare2 /> Share
      </button>
    </div>
  );
}
