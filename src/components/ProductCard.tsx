"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/components/CartProvider";
import type { Product } from "@/lib/products";

type ProductCardProps = {
  product: Product;
  index: number;
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addItem } = useCart();
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.45 }}
      viewport={{ once: true }}
      className="group flex h-full flex-col gap-4 rounded-3xl border border-black/5 bg-white/80 p-5 shadow-soft backdrop-blur"
    >
      <div className="flex items-start justify-between">
        <span className="text-xs uppercase tracking-[0.28em] text-moss">
          {product.category}
        </span>
        <span className="rounded-full bg-clay px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink">
          {product.tag}
        </span>
      </div>
      <Link
        href={`/products/${product.id}`}
        className="relative h-52 overflow-hidden rounded-2xl border border-black/5 bg-sand/60"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
          {product.palette.map((color) => (
            <span
              key={`${product.id}-${color}`}
              className="h-6 w-6 rounded-full border border-black/10"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <h3 className="text-xl font-semibold text-ink">{product.name}</h3>
        <p className="text-sm text-ink/70">{product.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold text-ink">${product.price}</span>
        <button
          onClick={() => addItem(product)}
          className="flex items-center gap-2 rounded-full border border-ink/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-ink transition hover:border-ink/30"
        >
          <FiShoppingBag /> Add to cart
        </button>
      </div>
    </motion.article>
  );
}

