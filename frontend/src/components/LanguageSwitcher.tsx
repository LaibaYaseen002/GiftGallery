"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const FLAG_EMOJI: Record<string, string> = {
  GB: "\uD83C\uDDEC\uD83C\uDDE7",
  PK: "\uD83C\uDDF5\uD83C\uDDF0",
  SA: "\uD83C\uDDF8\uD83C\uDDE6",
  FR: "\uD83C\uDDEB\uD83C\uDDF7",
};

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, currency } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const current = locales.find((l) => l.code === locale)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 px-1.5 py-1 rounded-md text-xs hover:bg-primary/10 transition-colors border border-border"
        title="Change Language"
      >
        <span className="text-sm">{FLAG_EMOJI[current.flag]}</span>
        <span className="hidden sm:inline text-2xs font-medium text-dark">
          {current.code.toUpperCase()}
        </span>
        <span className="hidden sm:inline text-2xs text-medium">
          ({currency.code})
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-medium">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-md shadow-lg border border-border py-0.5 z-50 min-w-[160px]">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLocale(l.code);
                setOpen(false);
              }}
              className={`flex items-center gap-2 w-full px-2.5 py-1.5 text-xs hover:bg-primary/5 transition-colors ${
                locale === l.code ? "bg-primary/10 text-primary font-medium" : "text-dark"
              }`}
            >
              <span className="text-sm">{FLAG_EMOJI[l.flag]}</span>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium">{l.name}</p>
                <p className="text-2xs text-medium">{CURRENCIES_DISPLAY[l.code]}</p>
              </div>
              {locale === l.code && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CURRENCIES_DISPLAY: Record<string, string> = {
  en: "USD ($)",
  ur: "PKR (Rs)",
  ar: "SAR (SR)",
  fr: "EUR (\u20AC)",
};
