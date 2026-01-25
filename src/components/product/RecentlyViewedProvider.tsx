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

type RecentlyViewedContextValue = {
  items: Product[];
  addProduct: (product: Product) => void;
  clear: () => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(
  null
);

const STORAGE_KEY = "thread-timber-recently-viewed";
const MAX_ITEMS = 6;

export function RecentlyViewedProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addProduct = useCallback((product: Product) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, addProduct, clear }),
    [items, addProduct, clear]
  );

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error(
      "useRecentlyViewed must be used within RecentlyViewedProvider"
    );
  }
  return context;
};
