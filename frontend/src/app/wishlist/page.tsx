"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { WishlistItem } from "@/types";
import { wishlistApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function WishlistPage() {
  const { getToken } = useAuth();
  const { addItem } = useCart();
  const { t, formatPrice } = useLanguage();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await wishlistApi.getAll(token);
      setItems((res.data as WishlistItem[]) || []);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (productId: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await wishlistApi.remove(productId, token);
      setItems((prev) => prev.filter((item) => item.product_id !== productId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  const handleMoveToCart = async (item: WishlistItem) => {
    if (!item.product) return;
    addItem(item.product);
    await handleRemove(item.product_id);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">{t("wishlist.title")}</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-border mx-auto mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">
            {t("wishlist.empty")}
          </h2>
          <p className="text-medium mb-6">
            Save your favorite gifts to find them later.
          </p>
          <Link href="/products" className="btn-primary text-lg">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <p className="text-medium mb-6">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {items.map((item) =>
              item.product ? (
                <div key={item.id} className="card overflow-hidden">
                  <Link href={`/products/${item.product.id}`}>
                    <div className="relative w-full h-36 sm:h-44 overflow-hidden">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </Link>
                  <div className="p-2.5 sm:p-3">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold text-dark text-xs sm:text-sm mb-0.5 hover:text-primary transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    {item.product.category && (
                      <p className="text-[10px] sm:text-xs text-medium">
                        {item.product.category.name}
                      </p>
                    )}
                    <p className="text-sm sm:text-base font-bold text-primary mt-1.5">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex gap-1.5 sm:gap-2 mt-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="btn-primary text-[10px] sm:text-xs py-1.5 flex-1"
                      >
                        {t("wishlist.addToCart")}
                      </button>
                      <button
                        onClick={() => handleRemove(item.product_id)}
                        className="btn-secondary text-xs py-1.5 px-2 sm:px-3"
                        title="Remove from Wishlist"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 text-error"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </>
      )}
    </div>
  );
}
