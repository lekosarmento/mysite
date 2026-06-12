"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import ptBRDict from "./dictionaries/pt-BR.json";
import enDict from "./dictionaries/en.json";
import esDict from "./dictionaries/es.json";

type Locale = "pt-BR" | "en" | "es";

type Dictionary = typeof ptBRDict;

const dictionaries: Record<Locale, Dictionary> = {
  "pt-BR": ptBRDict,
  en: enDict as Dictionary,
  es: esDict as Dictionary,
};

type LanguageContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => any;
  dict: Dictionary;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("leko-locale") as Locale | null;
    if (saved && (saved === "pt-BR" || saved === "en" || saved === "es")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("leko-locale", newLocale);
  }, []);

  const dict = dictionaries[locale];

  const t = useCallback(
    (path: string): any => {
      const value = getNestedValue(dict, path);
      // Fallback to pt-BR if value is empty string or undefined
      if (value === undefined || value === "") {
        const fallback = getNestedValue(dictionaries["pt-BR"], path);
        if (fallback !== undefined) return fallback;
        console.warn(`[i18n] Missing key: "${path}" for locale "${locale}"`);
        return path;
      }
      return value;
    },
    [dict, locale]
  );

  // Prevent hydration mismatch by rendering PT-BR on server, then switching on client
  if (!mounted) {
    const serverDict = dictionaries["pt-BR"];
    const serverT = (path: string) => getNestedValue(serverDict, path) ?? path;
    return (
      <LanguageContext.Provider value={{ locale: "pt-BR", setLocale, t: serverT, dict: serverDict }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dict }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
