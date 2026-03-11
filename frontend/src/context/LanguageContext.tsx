"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Locale, LOCALES, translations, CurrencyCode, ALL_CURRENCIES } from "@/lib/i18n/translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  currencyCode: CurrencyCode;
  setCurrencyCode: (code: CurrencyCode) => void;
  currency: { code: string; symbol: string; rate: number };
  formatPrice: (usdPrice: number) => string;
  locales: typeof LOCALES;
  allCurrencies: typeof ALL_CURRENCIES;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [currencyCode, setCurrencyCodeState] = useState<CurrencyCode>("USD");

  useEffect(() => {
    const savedLocale = localStorage.getItem("gift-gallery-locale") as Locale;
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    }
    const savedCurrency = localStorage.getItem("gift-gallery-currency") as CurrencyCode;
    if (savedCurrency && ALL_CURRENCIES.find((c) => c.code === savedCurrency)) {
      setCurrencyCodeState(savedCurrency);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("gift-gallery-locale", newLocale);
    document.documentElement.dir = LOCALES.find((l) => l.code === newLocale)?.dir || "ltr";
    document.documentElement.lang = newLocale;
  };

  const setCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCodeState(code);
    localStorage.setItem("gift-gallery-currency", code);
  };

  const t = (key: string): string => {
    const trans = translations[locale];
    return (trans as Record<string, string>)[key] || key;
  };

  const currentLocale = LOCALES.find((l) => l.code === locale)!;
  const currency = ALL_CURRENCIES.find((c) => c.code === currencyCode) || ALL_CURRENCIES[0];

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
        currencyCode,
        setCurrencyCode,
        currency,
        formatPrice,
        locales: LOCALES,
        allCurrencies: ALL_CURRENCIES,
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
