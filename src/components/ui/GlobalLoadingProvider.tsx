"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";

type GlobalLoadingContextType = {
  setIsLoading: (loading: boolean) => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Route change detection to prevent hanging
  useEffect(() => {
    // If we're on the homepage, let the page component handle it for high-fidelity sync
    if (pathname === "/") return;

    // For all other pages, provide a cinematic 1.2s reveal then dismiss
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  // Safety timer for homepage or any unexpected hang
  useEffect(() => {
    const safety = setTimeout(() => {
        setIsLoading(false);
    }, 5000); // Max 5s safety registry
    return () => clearTimeout(safety);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ setIsLoading }}>
      <LoadingScreen isLoading={isLoading} />
      {children}
    </GlobalLoadingContext.Provider>
  );
}

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error("useGlobalLoading must be used within GlobalLoadingProvider");
  }
  return context;
};
