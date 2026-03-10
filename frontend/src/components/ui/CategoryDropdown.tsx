"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Category } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  jewelry: "💍",
  clothes: "👗",
  watches: "⌚",
  perfumes: "🧴",
  bags: "👜",
  "other-gifts": "🎁",
  "home-decor": "🏠",
  "chocolates-sweets": "🍫",
  "flowers-plants": "🌸",
  "skincare-beauty": "✨",
  "toys-stuffed-animals": "🧸",
};

interface CategoryDropdownProps {
  categories: Category[];
  selected: string;
  onChange: (slug: string) => void;
}

export default function CategoryDropdown({
  categories,
  selected,
  onChange,
}: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedCat = categories.find((c) => c.slug === selected);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  function handleSelect(slug: string) {
    onChange(slug);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="input-field flex items-center justify-between gap-2 min-w-[180px] cursor-pointer text-left"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedCat ? (
            <>
              <span className="text-sm">{CATEGORY_ICONS[selectedCat.slug] || "📦"}</span>
              <span className="text-xs font-medium text-dark">{selectedCat.name}</span>
            </>
          ) : (
            <>
              <span className="text-sm">🏷️</span>
              <span className="text-xs text-medium">All Categories</span>
            </>
          )}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-3.5 h-3.5 text-medium shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute top-full mt-1 left-0 right-0 sm:left-auto sm:right-0
            z-50 bg-white border border-border shadow-xl overflow-hidden
            rounded-lg w-full sm:w-[320px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-light/50">
            <h3 className="text-xs font-bold text-dark">Choose Category</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-medium hover:text-dark p-0.5"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto max-h-[50vh] sm:max-h-[316px]">
            {/* All Categories option */}
            <button
              onClick={() => handleSelect("")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 sm:py-2 transition-colors text-left ${
                !selected
                  ? "bg-primary/8 border-l-[3px] border-primary"
                  : "hover:bg-light border-l-[3px] border-transparent"
              }`}
            >
              <span className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm shrink-0">
                🏷️
              </span>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${!selected ? "text-primary" : "text-dark"}`}>
                  All Categories
                </p>
                <p className="text-2xs text-medium">Browse everything</p>
              </div>
              {!selected && (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-primary shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </button>

            {/* Divider */}
            <div className="h-px bg-border mx-3" />

            {/* Category items */}
            {categories.map((cat) => {
              const isSelected = selected === cat.slug;
              const icon = CATEGORY_ICONS[cat.slug] || "📦";

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelect(cat.slug)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 sm:py-2 transition-colors text-left ${
                    isSelected
                      ? "bg-primary/8 border-l-[3px] border-primary"
                      : "hover:bg-light border-l-[3px] border-transparent"
                  }`}
                >
                  {/* Category thumbnail */}
                  {cat.image_url ? (
                    <div className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg overflow-hidden border border-border/50 shrink-0 relative">
                      <Image
                        src={cat.image_url}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    </div>
                  ) : (
                    <span className="w-8 h-8 sm:w-7 sm:h-7 rounded-lg bg-light flex items-center justify-center text-sm shrink-0">
                      {icon}
                    </span>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${isSelected ? "text-primary" : "text-dark"}`}>
                      {cat.name}
                    </p>
                  </div>

                  {/* Emoji hint on desktop */}
                  <span className="hidden sm:block text-xs opacity-60 shrink-0">{icon}</span>

                  {isSelected && (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-primary shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
