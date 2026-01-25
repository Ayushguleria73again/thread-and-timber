"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiX } from "react-icons/fi";
import { allProducts } from "@/lib/products";
import type { Product } from "@/lib/products";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 0) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const res = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`);
          if (res.ok) {
            const { products } = await res.json();
            const transformed = products.map((p: any) => ({ ...p, id: p._id }));
            setSuggestions(transformed);
            setIsOpen(true);
          }
        } catch (error) {
          console.error("Search fetch error:", error);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleSuggestionClick = (productId: string) => {
    router.push(`/products/${productId}`);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className="relative hidden md:block">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-64 rounded-full border border-black/10 bg-white/80 px-4 py-2 pl-10 pr-8 text-sm text-black outline-none focus:border-black/30"
        />
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50"
          >
            <FiX />
          </button>
        )}
      </form>
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-64 rounded-2xl border border-black/5 bg-white shadow-soft">
          {suggestions.map((product: any) => (
            <button
              key={product.id}
              onClick={() => handleSuggestionClick(product.id)}
              className="w-full px-4 py-3 text-left text-sm text-black hover:bg-sand/50 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <p className="font-medium">{product.name}</p>
              <p className="text-xs text-black/60">{product.category}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
