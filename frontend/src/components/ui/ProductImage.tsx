"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

type ProductImageProps = Omit<ImageProps, "onError">;

export default function ProductImage({ alt, ...rest }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (error || !rest.src) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 ${rest.className || ""}`}
        style={rest.fill ? { position: "absolute", inset: 0 } : undefined}
      >
        {/* Gift box icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-12 h-12 text-gray-400"
        >
          <rect x="3" y="8" width="18" height="4" rx="1" />
          <path d="M12 8v13" />
          <path d="M3 12v8a1 1 0 001 1h16a1 1 0 001-1v-8" />
          <path d="M7.5 8a2.5 2.5 0 010-5C9 3 12 8 12 8" />
          <path d="M16.5 8a2.5 2.5 0 000-5C15 3 12 8 12 8" />
        </svg>
      </div>
    );
  }

  return <Image alt={alt} {...rest} onError={() => setError(true)} />;
}
