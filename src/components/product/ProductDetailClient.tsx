"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useCart } from "@/components/cart/CartProvider";
import type { Product } from "@/lib/products";

type ProductDetailClientProps = {
  product: Product;
};

export default function ProductDetailClient({
  product
}: ProductDetailClientProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-4">
      {product.inventory > 0 ? (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={product.inventory === 0}
              className="h-10 w-10 rounded-full border border-black/10 text-lg transition-colors hover:bg-black/5 active:scale-95 disabled:opacity-30"
            >
              -
            </button>
            <span className="text-sm border min-w-[50px] text-center py-2 rounded-xl border-black/5 font-serif italic text-black">
              {quantity}
            </span>
            <button
              onClick={() =>
                setQuantity((prev) => Math.min(product.inventory, prev + 1))
              }
              disabled={product.inventory === 0 || quantity >= product.inventory}
              className="h-10 w-10 rounded-full border border-black/10 text-lg transition-colors hover:bg-black/5 active:scale-95 disabled:opacity-30"
            >
              +
            </button>
            <span className="text-[10px] uppercase tracking-widest text-black/40 font-bold ml-2">
                Available: {product.inventory}
            </span>
          </div>
          <button
            onClick={() => addItem(product, quantity)}
            className="rounded-full bg-black px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand shadow-lg transition-all hover:bg-black/90 active:scale-95"
          >
            Add to cart
          </button>
        </>
      ) : (
        <div className="space-y-4">
            <div className="rounded-2xl bg-black/5 p-4 border border-black/5 italic text-black/40 text-sm">
                This handcrafted piece is currently out of the studio collection.
            </div>
            <button
                disabled
                className="w-full rounded-full bg-black/5 border border-black/5 px-6 py-3 text-[10px] uppercase tracking-[0.3em] text-black/20 font-bold cursor-not-allowed"
            >
                Sold Out
            </button>
        </div>
      )}
    </div>
  );
}

type CardPreviewProps = {
  product: Product;
  index: number;
};

export const ProductCardPreview = ({ product, index }: CardPreviewProps) => (
  <ProductCard product={product} index={index} />
);

