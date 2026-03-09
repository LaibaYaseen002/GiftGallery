"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductBundle } from "@/types";
import { bundlesApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

export default function BundleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [bundle, setBundle] = useState<ProductBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { formatPrice } = useLanguage();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    bundlesApi
      .getById(id)
      .then((res) => {
        setBundle(res.data || null);
        if (!res.data) setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!bundle?.items || bundle.items.length === 0) return;
    for (const item of bundle.items) {
      if (item.product) {
        addItem(item.product, item.quantity);
      }
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalValue = bundle?.total_value || 0;
  const bundlePrice = bundle?.bundle_price || 0;
  const savings =
    totalValue > 0
      ? Math.round(((totalValue - bundlePrice) / totalValue) * 100)
      : bundle?.discount_percent || 0;

  const getOccasionGradient = (occasion: string | null) => {
    switch (occasion?.toLowerCase()) {
      case "birthday":
        return "from-pink-300 via-rose-200 to-pink-100";
      case "wedding":
        return "from-purple-200 via-violet-100 to-pink-100";
      case "anniversary":
        return "from-red-200 via-rose-100 to-orange-100";
      case "festival":
        return "from-amber-200 via-yellow-100 to-orange-100";
      default:
        return "from-[#B76E79]/30 via-[#D4A853]/20 to-[#FFF8F0]";
    }
  };

  const getOccasionColor = (occasion: string | null) => {
    switch (occasion?.toLowerCase()) {
      case "birthday":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "wedding":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "anniversary":
        return "bg-red-100 text-red-700 border-red-200";
      case "festival":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-72 bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !bundle) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bundle Not Found
        </h1>
        <p className="text-gray-500 mb-6">
          This bundle may have been removed or is no longer available.
        </p>
        <Link
          href="/bundles"
          className="btn-primary inline-block px-6 py-2.5"
        >
          Browse Bundles
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#B76E79] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/bundles"
          className="hover:text-[#B76E79] transition-colors"
        >
          Bundles
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{bundle.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Bundle Image */}
        <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          {bundle.image_url ? (
            <Image
              src={bundle.image_url}
              alt={bundle.name}
              fill
              className="object-cover"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${getOccasionGradient(
                bundle.occasion
              )} flex items-center justify-center`}
            >
              <svg
                className="w-24 h-24 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                />
              </svg>
            </div>
          )}

          {/* Occasion Badge */}
          {bundle.occasion && (
            <div
              className={`absolute top-4 left-4 text-sm font-semibold px-4 py-2 rounded-full border ${getOccasionColor(
                bundle.occasion
              )}`}
            >
              {bundle.occasion.charAt(0).toUpperCase() +
                bundle.occasion.slice(1)}
            </div>
          )}

          {/* Savings Badge */}
          {savings > 0 && (
            <div className="absolute top-4 right-4 bg-[#D4A853] text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
              Save {savings}%
            </div>
          )}
        </div>

        {/* Bundle Info */}
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {bundle.name}
          </h1>

          {bundle.description && (
            <p className="text-gray-500 mb-6">{bundle.description}</p>
          )}

          {/* Pricing */}
          <div className="bg-[#FFF8F0] rounded-xl p-5 mb-6 border border-[#D4A853]/20">
            <div className="flex items-end gap-3 mb-1">
              <span className="text-3xl font-bold text-[#B76E79]">
                {formatPrice(bundlePrice > 0 ? bundlePrice : totalValue)}
              </span>
              {totalValue > 0 && totalValue !== bundlePrice && (
                <span className="text-lg text-gray-400 line-through mb-0.5">
                  {formatPrice(totalValue)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="text-sm text-[#D4A853] font-medium">
                You save {formatPrice(totalValue - bundlePrice)} ({savings}%
                off)
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={!bundle.items || bundle.items.length === 0}
            className={`btn-primary w-full text-base py-3 flex items-center justify-center gap-2 mb-6 transition-all duration-200 ${
              added ? "!bg-green-500 !border-green-500" : ""
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {added ? (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added to Cart!
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                Add All Items to Cart
              </>
            )}
          </button>

          <Link
            href="/bundles"
            className="text-sm text-[#B76E79] hover:underline text-center"
          >
            Back to all bundles
          </Link>
        </div>
      </div>

      {/* Included Items Section */}
      {bundle.items && bundle.items.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Items in This Bundle ({bundle.items.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bundle.items.map((item) => (
              <div
                key={item.id}
                className="card flex items-center gap-4 p-4 hover:shadow-md transition-shadow"
              >
                {item.product?.image_url ? (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    width={80}
                    height={80}
                    className="rounded-xl object-cover w-20 h-20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-[#B76E79]/10 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-8 h-8 text-[#B76E79]/40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {item.product?.name || "Product"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatPrice(item.product?.price || 0)}
                    {item.quantity > 1 && (
                      <span className="text-gray-400">
                        {" "}
                        x {item.quantity}
                      </span>
                    )}
                  </p>
                  {item.product && (
                    <Link
                      href={`/products/${item.product.id}`}
                      className="text-xs text-[#B76E79] hover:underline mt-1 inline-block"
                    >
                      View Product
                    </Link>
                  )}
                </div>
                {item.quantity > 1 && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-700">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
