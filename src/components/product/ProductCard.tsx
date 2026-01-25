"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingBag, FiHeart } from "react-icons/fi";
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
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      viewport={{ once: true }}
      className="group relative flex h-full flex-col gap-4 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-soft backdrop-blur transition-hover hover:border-black/10"
    >
      <Link href={`/products/${product.id}`} className="absolute inset-0 z-0 rounded-3xl" aria-label={`View ${product.name}`} />
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-[0.28em] text-moss">
          {product.category}
        </span>
        <div className="flex items-center gap-2 z-10">
          {user && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className={`rounded-full p-2 ${
                isInWishlist(product.id)
                  ? "bg-moss text-sand"
                  : "bg-white/80 text-black/60"
              }`}
            >
              <FiHeart
                className={isInWishlist(product.id) ? "fill-current" : ""}
              />
            </button>
          )}
          <span className="rounded-full bg-clay px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-black">
            {product.tag}
          </span>
        </div>
      </div>
      <div className="relative h-52 overflow-hidden rounded-2xl border border-black/5 bg-sand/60 z-0">
        {product.inventory === 0 ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-sand/40 backdrop-blur-[2px]">
            <div className="rounded-full bg-black/80 px-6 py-2 text-[10px] uppercase tracking-[0.3em] font-bold text-sand shadow-lg">
              Sold Out
            </div>
          </div>
        ) : product.inventory > 0 && product.inventory <= 5 ? (
          <div className="absolute bottom-3 right-3 rounded-full bg-red-800/90 px-3 py-1 text-[8px] uppercase tracking-[0.2em] font-bold text-white shadow-sm backdrop-blur-sm animate-pulse">
            Only {product.inventory} left
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
          {(product.palette || []).map((color: string) => (
            <span
              key={`${product.id}-${color}`}
              className="h-6 w-6 rounded-full border border-black/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <h3 className="text-xl font-serif italic font-medium text-black transition-colors group-hover:text-moss">{product.name}</h3>
        <p className="text-sm text-black/70">{product.description}</p>
        {(product.rating || 0) > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-moss">★</span>
            <span className="text-[10px] font-bold text-black">{product.rating}</span>
            <span className="text-[10px] text-black/40">({product.reviews || 0})</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between z-10">
        <span className="text-lg font-serif italic font-medium text-black">
          {formatCurrency(product.price)}
        </span>
        <button
          onClick={(e) => { 
            if (product.inventory > 0) {
                e.preventDefault(); 
                e.stopPropagation(); 
                addItem(product); 
            }
          }}
          disabled={product.inventory === 0}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition-all ${
            product.inventory === 0 
                ? "border-black/5 bg-black/5 text-black/20 cursor-not-allowed" 
                : "border-black/10 bg-white text-black hover:border-black/30"
          }`}
        >
          <FiShoppingBag /> {product.inventory === 0 ? "Unavailable" : "Add to cart"}
        </button>
      </div>
    </motion.article>
  );
}

