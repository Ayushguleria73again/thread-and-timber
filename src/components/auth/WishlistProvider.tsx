"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useCallback,
  useState
} from "react";
import type { Product } from "@/lib/products";
import { allProducts } from "@/lib/products";
import { useAuth } from "./AuthProvider";
import { toast } from "sonner";

type WishlistContextValue = {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "thread-timber-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    // If not logged in, use localStorage
    if (!user) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch {
          setItems([]);
        }
      }
      return;
    }

    // If logged in, items will be populated from user object or fetched
    if (user && user.wishlist) {
        // Handle both ID array and Populated Object array
        const list = user.wishlist as any[];
        if (list.length > 0 && typeof list[0] === 'object') {
            const transformed = list.map((p: any) => ({
                ...p,
                id: p._id || p.id,
                inventory: p.stock ?? p.inventory,
                tag: p.isFeatured ? "best seller" : (p.tag || "crafted"),
                sizes: p.sizes || ["S", "M", "L", "XL"]
            }));
            setItems(transformed);
        } else {
            // Fallback for ID array
            const favoriteProducts = allProducts.filter((p: any) => list.includes(p.id) || list.includes(p._id));
            setItems(favoriteProducts);
        }
    } else if (user) {
        setItems([]);
    }
  }, [user]);

  // Sync to localStorage only if for guests
  useEffect(() => {
    if (!user) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, user]);

  const toggleWishlist = useCallback(async (product: Product) => {
    // If guest, standard local behavior
    if (!user) {
      setItems((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          toast.info(`${product.name} removed from favorites`);
          return prev.filter((item) => item.id !== product.id);
        }
        toast.success(`${product.name} saved to favorites`);
        return [...prev, product];
      });
      return;
    }

    // If logged in, sync with backend
    const token = localStorage.getItem("thread-timber-token");
    try {
      const res = await fetch("http://localhost:5001/api/auth/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product.id })
      });

      if (res.ok) {
        const updatedWishlist = await res.json();
        const wasInWishlist = items.some(i => i.id === product.id);
        
        if (wasInWishlist) {
          toast.info(`${product.name} removed from favorites`);
        } else {
          toast.success(`${product.name} saved to favorites`);
        }

        // Result is already populated from our new controller fix
        const transformed = updatedWishlist.map((p: any) => ({
            ...p,
            id: p._id || p.id,
            inventory: p.stock ?? p.inventory,
            tag: p.isFeatured ? "best seller" : (p.tag || "crafted"),
            sizes: p.sizes || ["S", "M", "L", "XL"]
        }));
        setItems(transformed);
      }
    } catch (error) {
      console.error("Wishlist sync error:", error);
    }
  }, [items, user]);

  const isInWishlist = useCallback((productId: string) => {
    return items.some((item) => item.id === productId);
  }, [items]);

  const addToWishlist = useCallback((product: Product) => {
      if (!isInWishlist(product.id)) toggleWishlist(product);
  }, [isInWishlist, toggleWishlist]);

  const removeFromWishlist = useCallback((productId: string) => {
      const item = items.find(i => i.id === productId);
      if (item) toggleWishlist(item);
  }, [items, toggleWishlist]);

  const value = useMemo(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }),
    [items, addToWishlist, removeFromWishlist, isInWishlist, toggleWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
};
