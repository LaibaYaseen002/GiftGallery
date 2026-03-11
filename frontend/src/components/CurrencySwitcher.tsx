"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function CurrencySwitcher() {
  const { currencyCode, setCurrencyCode, allCurrencies } = useLanguage();
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

  const current = allCurrencies.find((c) => c.code === currencyCode) || allCurrencies[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-xs hover:bg-primary/10 transition-colors border border-border"
        title="Change Currency"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="font-medium text-dark">{current.code}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-3 h-3 text-medium"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-border py-1 z-50 min-w-[180px]">
          {allCurrencies.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                setCurrencyCode(c.code);
                setOpen(false);
              }}
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-xs hover:bg-primary/5 transition-colors ${
                currencyCode === c.code ? "bg-primary/10 text-primary font-medium" : "text-dark"
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium">{c.code}</p>
                <p className="text-2xs text-medium">{c.name} ({c.symbol})</p>
              </div>
              {currencyCode === c.code && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 text-primary"
                >
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
