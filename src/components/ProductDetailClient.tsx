"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/components/CartProvider";
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
      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="h-10 w-10 rounded-full border border-ink/10 text-lg"
        >
          -
        </button>
        <span className="text-sm uppercase tracking-[0.24em] text-ink">
          {quantity}
        </span>
        <button
          onClick={() =>
            setQuantity((prev) => Math.min(product.inventory, prev + 1))
          }
          className="h-10 w-10 rounded-full border border-ink/10 text-lg"
        >
          +
        </button>
      </div>
      <button
        onClick={() => addItem(product, quantity)}
        className="rounded-full bg-ink px-6 py-3 text-xs uppercase tracking-[0.3em] text-sand"
      >
        Add to cart
      </button>
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

