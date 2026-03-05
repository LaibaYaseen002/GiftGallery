"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, LOCALES, CURRENCIES, translations } from "@/lib/i18n/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  currency: { code: string; symbol: string; rate: number };
  formatPrice: (usdPrice: number) => string;
  locales: typeof LOCALES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = localStorage.getItem("gift-gallery-locale") as Locale;
    if (saved && translations[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("gift-gallery-locale", newLocale);
    document.documentElement.dir = LOCALES.find((l) => l.code === newLocale)?.dir || "ltr";
    document.documentElement.lang = newLocale;
  };

  const t = (key: string): string => {
    const trans = translations[locale];
    return (trans as Record<string, string>)[key] || key;
  };

  const currentLocale = LOCALES.find((l) => l.code === locale)!;
  const currency = CURRENCIES[locale];

  const formatPrice = (usdPrice: number): string => {
    const converted = usdPrice * currency.rate;
    return `${currency.symbol}${converted.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        dir: currentLocale.dir,
        currency,
        formatPrice,
        locales: LOCALES,
      }}
    >
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
