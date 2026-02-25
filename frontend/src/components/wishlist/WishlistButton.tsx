"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { wishlistApi } from "@/lib/api";

interface WishlistButtonProps {
  productId: string;
  size?: "sm" | "md";
}

export default function WishlistButton({
  productId,
  size = "md",
}: WishlistButtonProps) {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizes = { sm: "w-5 h-5", md: "w-6 h-6" };

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (!isSignedIn) return;

    const checkWishlist = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await wishlistApi.getAll(token);
        const items = res.data || [];
        setIsWishlisted(
          items.some((item) => item.product_id === productId)
        );
      } catch {
        // Silently fail — wishlist check is non-critical
      }
    };
    checkWishlist();
  }, [isSignedIn, productId, getToken]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn || loading) return;

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      if (isWishlisted) {
        await wishlistApi.remove(productId, token);
        setIsWishlisted(false);
      } else {
        await wishlistApi.add(productId, token);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) return null;

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`transition-all duration-200 ${
        loading ? "opacity-50" : "hover:scale-110"
      }`}
      title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isWishlisted ? "#B76E79" : "none"}
        stroke={isWishlisted ? "#B76E79" : "currentColor"}
        strokeWidth={1.5}
        className={`${sizes[size]} ${
          isWishlisted ? "text-primary" : "text-medium hover:text-primary"
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
