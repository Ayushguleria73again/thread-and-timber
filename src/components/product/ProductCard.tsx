"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/auth/WishlistProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  index: number;
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const requiresSize = product.category === "T-Shirts" || product.category === "Jackets" || product.category === "Apparel";
  const availableSizes = product.sizes || ["S", "M", "L", "XL"];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inventory === 0) return;
    if (requiresSize && !selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    addItem(product, 1, selectedSize || undefined);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      className="group relative flex h-full flex-col gap-6 rounded-[2.5rem] border border-black/[0.03] bg-white/60 p-6 shadow-soft transition-all duration-700 hover:bg-white hover:shadow-massive hover:-translate-y-2 lg:p-7"
    >
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-10 rounded-[2.5rem]" aria-label={`View ${product.name}`} />
      
      {/* Visual Header */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-sand/40 transition-all duration-700">
        {/* Main Product Image (Placeholder logic exists in parent) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-tr from-clay/5 to-moss/5 transition-transform duration-[2s] ease-out group-hover:scale-110" />
        
        {/* Artisan Badges */}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between z-20">
          <span className="rounded-full bg-white/40 px-3 py-1.5 text-[8px] uppercase tracking-[0.3em] font-bold text-black/40 backdrop-blur-md border border-white/20">
            {product.category}
          </span>
          <div className="flex flex-col gap-2 items-end">
            {user && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                    }}
                    className={`h-9 w-9 flex items-center justify-center rounded-full transition-all active:scale-75 ${
                        isInWishlist(product.id)
                        ? "bg-moss text-sand shadow-lg"
                        : "bg-white/60 text-black/40 backdrop-blur-md hover:bg-white hover:text-black"
                    }`}
                >
                    <FiHeart className={isInWishlist(product.id) ? "fill-current" : "text-lg"} />
                </button>
            )}
            <span className="rounded-full bg-black text-sand px-3 py-1.5 text-[8px] uppercase tracking-[0.3em] font-bold shadow-lg">
                {product.tag}
            </span>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="absolute inset-x-4 bottom-4 z-20">
            {product.inventory === 0 ? (
                <div className="w-full rounded-2xl bg-black/80 py-3 text-center backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-sand">Studio Depleted</p>
                </div>
            ) : product.inventory > 0 && product.inventory <= 5 ? (
                <div className="inline-block rounded-full bg-red-800/90 px-4 py-2 backdrop-blur-sm animate-pulse shadow-lg">
                    <p className="text-[8px] uppercase tracking-[0.2em] font-black text-white">Only {product.inventory} pieces left</p>
                </div>
            ) : null}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2">
          {(product.palette || []).slice(0, 3).map((color: string) => (
            <div
              key={`${product.id}-${color}`}
              className="h-3 w-3 rounded-full border border-black/5 shadow-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          {product.palette && product.palette.length > 3 && (
              <span className="text-[8px] uppercase tracking-widest font-bold text-black/20">+{product.palette.length - 3} more</span>
          )}
        </div>

        <div className="space-y-1">
            <h3 className="font-serif text-2xl italic font-light text-black transition-colors group-hover:text-black">
                {product.name}
            </h3>
            <p className="line-clamp-2 text-xs leading-relaxed text-black/40 font-medium">
                {product.description}
            </p>
        </div>

        {(product.rating || 0) > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex text-moss">
                {[1,2,3,4,5].map((s) => (
                    <span key={s} className={`text-[10px] ${s <= Math.round(product.rating || 0) ? 'opacity-100' : 'opacity-20'}`}>★</span>
                ))}
            </div>
            <span className="text-[9px] font-bold text-black/30">({product.reviews || 0} reviews)</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-2 space-y-4">
        {requiresSize && product.inventory > 0 && (
          <div className="flex flex-wrap gap-2 z-20 relative">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-xl border text-[9px] font-black transition-all active:scale-90 ${
                  selectedSize === size
                    ? "border-black bg-black text-sand shadow-xl shadow-black/20"
                    : "border-black/[0.03] bg-white text-black/30 hover:border-black/10 hover:text-black"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between z-20 relative">
          <p className="font-serif text-xl italic font-light text-black">
            {formatCurrency(product.price)}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.inventory === 0}
            className={`flex items-center gap-3 rounded-full border px-6 py-3 text-[10px] uppercase tracking-[0.3em] font-bold transition-all active:scale-95 ${
              product.inventory === 0 
                  ? "border-black/5 bg-black/5 text-black/10 cursor-not-allowed" 
                  : "border-black/10 bg-white text-black hover:bg-black hover:text-sand hover:border-black shadow-soft"
            }`}
          >
            <FiShoppingBag className="text-xs" /> {product.inventory === 0 ? "Empty" : "Acquire"}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

