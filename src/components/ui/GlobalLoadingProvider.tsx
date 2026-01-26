"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import LoadingScreen from "@/components/ui/LoadingScreen";

type GlobalLoadingContextType = {
  setIsLoading: (loading: boolean) => void;
};

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export function GlobalLoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

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
