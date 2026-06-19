"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type LoadingContextType = {
  /** true enquanto o preloader está na tela (scroll travado, hero ainda escondido) */
  loading: boolean;
  /** chamado pelo Preloader quando o contador chega a 100 e a cortina começa a subir */
  setLoaded: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  loading: true,
  setLoaded: () => {},
});

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const setLoaded = useCallback(() => setLoading(false), []);
  return (
    <LoadingContext.Provider value={{ loading, setLoaded }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
