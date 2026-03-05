"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductBundle } from "@/types";
import { bundlesApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";

const OCCASIONS = ["All", "Birthday", "Wedding", "Anniversary", "Festival"] as const;

function BundleCardSkeleton() {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="h-48 bg-gray-200 rounded-t-lg" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="flex gap-2 mt-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
          <div className="h-10 w-10 bg-gray-200 rounded-full" />
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
        </div>
        <div className="h-10 bg-gray-200 rounded w-full mt-3" />
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <BundleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function BundlesPage() {
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOccasion, setActiveOccasion] = useState<string>("All");
  const [addingBundleId, setAddingBundleId] = useState<string | null>(null);
  const [addedBundleId, setAddedBundleId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    setLoading(true);
    const occasion = activeOccasion === "All" ? undefined : activeOccasion.toLowerCase();

    bundlesApi
      .getAll(occasion)
      .then((res) => {
        setBundles(res.data || []);
      })
      .catch((err) => {
        console.error("Failed to fetch bundles:", err);
        setBundles([]);
      })
      .finally(() => setLoading(false));
  }, [activeOccasion]);

  const handleAddBundleToCart = (bundle: ProductBundle) => {
    if (!bundle.items || bundle.items.length === 0) return;
    setAddingBundleId(bundle.id);

    for (const item of bundle.items) {
      if (item.product) {
        addItem(item.product, item.quantity);
      }
    }

    setAddingBundleId(null);
    setAddedBundleId(bundle.id);
    setTimeout(() => setAddedBundleId(null), 2000);
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
        return "from-[#B76E79] via-[#D4A853]/30 to-[#FFF8F0]";
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="page-title">Gift Bundles</h1>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-lg">
          Curated gift sets for every occasion. Save more when you shop our
          thoughtfully assembled bundles, each wrapped with care and ready to
          delight.
        </p>
      </div>

      {/* Occasion Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {OCCASIONS.map((occasion) => (
          <button
            key={occasion}
            onClick={() => setActiveOccasion(occasion)}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-200 border ${
              activeOccasion === occasion
                ? "bg-[#B76E79] text-white border-[#B76E79] shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#B76E79] hover:text-[#B76E79]"
            }`}
          >
            {occasion}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : bundles.length === 0 ? (
        <div className="text-center py-20">
          <div
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FFF8F0] flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-[#B76E79]"
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
          <p className="text-2xl font-semibold text-gray-700 mb-2">
            No bundles found
          </p>
          <p className="text-gray-500">
            {activeOccasion !== "All"
              ? `No bundles available for "${activeOccasion}" yet. Try browsing all bundles.`
              : "Gift bundles will appear here once they are created."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 mb-6 text-center">
            {bundles.length} bundle{bundles.length !== 1 ? "s" : ""} available
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {bundles.map((bundle) => {
              const totalValue = bundle.total_value || 0;
              const bundlePrice = bundle.bundle_price || 0;
              const savings =
                totalValue > 0
                  ? Math.round(((totalValue - bundlePrice) / totalValue) * 100)
                  : bundle.discount_percent;
              const isAdding = addingBundleId === bundle.id;
              const isAdded = addedBundleId === bundle.id;

              return (
                <div
                  key={bundle.id}
                  className="card overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {/* Bundle Image */}
                  <div className="relative h-52 overflow-hidden">
                    {bundle.image_url ? (
                      <Image
                        src={bundle.image_url}
                        alt={bundle.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${getOccasionGradient(
                          bundle.occasion
                        )} flex items-center justify-center`}
                      >
                        <svg
                          className="w-16 h-16 text-white/70"
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

                    {/* Savings Badge */}
                    {savings > 0 && (
                      <div className="absolute top-3 right-3 bg-[#D4A853] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        You Save {savings}%
                      </div>
                    )}

                    {/* Occasion Badge */}
                    {bundle.occasion && (
                      <div
                        className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1.5 rounded-full border ${getOccasionColor(
                          bundle.occasion
                        )}`}
                      >
                        {bundle.occasion.charAt(0).toUpperCase() +
                          bundle.occasion.slice(1)}
                      </div>
                    )}
                  </div>

                  {/* Bundle Details */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-[#B76E79] transition-colors">
                      {bundle.name}
                    </h3>
                    {bundle.description && (
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                        {bundle.description}
                      </p>
                    )}

                    {/* Included Items */}
                    {bundle.items && bundle.items.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Includes {bundle.items.length} item
                          {bundle.items.length !== 1 ? "s" : ""}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {bundle.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-2 bg-[#FFF8F0] rounded-lg px-2.5 py-1.5 border border-[#D4A853]/20"
                            >
                              {item.product?.image_url ? (
                                <Image
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  width={24}
                                  height={24}
                                  className="rounded-full object-cover w-6 h-6"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#B76E79]/20 flex items-center justify-center">
                                  <span className="text-[10px] text-[#B76E79]">
                                    ?
                                  </span>
                                </div>
                              )}
                              <span className="text-xs text-gray-700 font-medium truncate max-w-[120px]">
                                {item.product?.name || "Product"}
                                {item.quantity > 1 && (
                                  <span className="text-gray-400">
                                    {" "}
                                    x{item.quantity}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Spacer to push pricing and buttons to bottom */}
                    <div className="flex-1" />

                    {/* Pricing */}
                    <div className="flex items-end justify-between mb-4 pt-3 border-t border-gray-100">
                      <div>
                        {totalValue > 0 && totalValue !== bundlePrice && (
                          <p className="text-xs text-gray-400 line-through">
                            Rs. {totalValue.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xl font-bold text-[#B76E79]">
                          Rs.{" "}
                          {bundlePrice > 0
                            ? bundlePrice.toLocaleString()
                            : totalValue.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">Bundle Price</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAddBundleToCart(bundle)}
                        disabled={
                          isAdding ||
                          !bundle.items ||
                          bundle.items.length === 0
                        }
                        className={`btn-primary flex-1 text-sm py-2.5 flex items-center justify-center gap-2 transition-all duration-200 ${
                          isAdded
                            ? "!bg-green-500 !border-green-500"
                            : ""
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isAdded ? (
                          <>
                            <svg
                              className="w-4 h-4"
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
                            Added!
                          </>
                        ) : isAdding ? (
                          "Adding..."
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4"
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
                            Add Bundle to Cart
                          </>
                        )}
                      </button>
                      <Link
                        href={`/bundles/${bundle.id}`}
                        className="btn-secondary text-sm py-2.5 px-4 flex items-center justify-center"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
