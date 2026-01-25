"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import ShopClient from "@/components/shop/ShopClient";
import { allProducts, categories as staticCategories, type Product } from "@/lib/products";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(staticCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
        const res = await fetch(`${apiUrl}/products`);
        if (res.ok) {
          const data = await res.json();
          // Transform backend _id to frontend id if needed
          const transformed = data.map((p: any) => ({
            ...p,
            id: p._id,
            inventory: p.stock,
            tag: p.isFeatured ? "best seller" : "crafted",
            sizes: p.sizes || ["S", "M", "L", "XL"],
          }));
          setProducts(transformed.length > 0 ? transformed : allProducts);
          if (transformed.length > 0) {
            const cats = Array.from(new Set(transformed.map((p: any) => p.category))) as string[];
            setCategories(cats);
          }
        } else {
          setProducts(allProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products, falling back to static data.");
        setProducts(allProducts);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-sand">
      {loading ? (
        <div className="flex h-screen items-center justify-center">
            <p className="text-xs uppercase tracking-widest text-ink/40 animate-pulse">Loading collection...</p>
        </div>
      ) : (
        <ShopClient products={products} categories={categories} />
      )}
      <Footer />
    </div>
  );
}

