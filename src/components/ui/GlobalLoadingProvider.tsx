"use client";

import { createContext, useContext, useState, useEffect, ReactNode, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingScreen from "@/components/ui/LoadingScreen";

type GlobalLoadingContextType = {
  setIsLoading: (loading: boolean) => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

// Internal component to handle route-sensitive dismissal safely with Suspense
function RouteDismissalManager({ setIsLoading, pathname }: { setIsLoading: (l: boolean) => void, pathname: string }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname === "/") return;
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [pathname, searchParams, setIsLoading]);

  return null;
}

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Safety timer for any unexpected hang (max 5s)
  useEffect(() => {
    const safety = setTimeout(() => {
        setIsLoading(false);
    }, 5000);
    return () => clearTimeout(safety);
  }, []);

  return (
    <GlobalLoadingContext.Provider value={{ setIsLoading }}>
      <LoadingScreen isLoading={isLoading} />
      <Suspense fallback={null}>
        <RouteDismissalManager setIsLoading={setIsLoading} pathname={pathname} />
      </Suspense>
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
