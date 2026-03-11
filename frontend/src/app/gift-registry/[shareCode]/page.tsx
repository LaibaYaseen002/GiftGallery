"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GiftRegistry, GiftRegistryItem } from "@/types";
import { registryApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLanguage } from "@/context/LanguageContext";

const EVENT_TYPE_LABELS: Record<string, string> = {
  birthday: "Birthday",
  wedding: "Wedding",
  baby_shower: "Baby Shower",
  anniversary: "Anniversary",
  other: "Other",
};

const EVENT_TYPE_ICONS: Record<string, string> = {
  birthday: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265z",
  wedding: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
  baby_shower: "M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z",
  anniversary: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
  other: "M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z",
};

export default function SharedRegistryPage() {
  const params = useParams();
  const shareCode = params.shareCode as string;
  const { getToken, isSignedIn } = useAuth();
  const { formatPrice } = useLanguage();

  const [registry, setRegistry] = useState<GiftRegistry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingItemId, setPurchasingItemId] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  const fetchRegistry = async () => {
    try {
      const res = await registryApi.getShared(shareCode);
      setRegistry(res.data);
    } catch (err) {
      console.error("Failed to fetch shared registry:", err);
      setError("Registry not found or no longer available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shareCode) {
      fetchRegistry();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shareCode]);

  const handlePurchase = async (itemId: string) => {
    if (!isSignedIn) {
      alert("Please sign in to purchase a gift from this registry.");
      return;
    }
    setPurchasingItemId(itemId);
    try {
      const token = await getToken();
      if (!token) return;
      await registryApi.purchaseItem(shareCode, itemId, token);
      setPurchaseSuccess(itemId);
      setTimeout(() => setPurchaseSuccess(null), 3000);
      // Refresh to get updated quantities
      await fetchRegistry();
    } catch (err) {
      console.error("Failed to purchase item:", err);
      alert("Could not complete the purchase. Please try again.");
    } finally {
      setPurchasingItemId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (error || !registry) {
    return (
      <div className="container-custom py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 mx-auto mb-6" style={{ color: "#B76E79" }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
        <h1 className="text-xl font-bold text-dark mb-2">Registry Not Found</h1>
        <p className="text-medium mb-4">{error || "This gift registry does not exist."}</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  const eventIcon = EVENT_TYPE_ICONS[registry.event_type] || EVENT_TYPE_ICONS.other;
  const items = registry.items || [];
  const totalItems = items.length;
  const fulfilledItems = items.filter((i) => i.quantity_purchased >= i.quantity_requested).length;
  const overallProgress = totalItems > 0 ? Math.round((fulfilledItems / totalItems) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF8F0" }}>
      {/* Hero Header */}
      <div
        className="relative py-16 px-4"
        style={{
          background: "linear-gradient(135deg, #B76E79 0%, #d4919b 50%, #D4A853 100%)",
        }}
      >
        <div className="container-custom text-center text-white relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d={eventIcon} />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{registry.event_name}</h1>
          <span className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-medium mb-3">
            {EVENT_TYPE_LABELS[registry.event_type] || registry.event_type}
          </span>
          {registry.event_date && (
            <p className="text-white/90 text-base">
              {new Date(registry.event_date).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
          {registry.description && (
            <p className="mt-4 text-white/80 max-w-xl mx-auto">{registry.description}</p>
          )}
        </div>
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 -right-10 w-56 h-56 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/4 w-20 h-20 rounded-full bg-white/5" />
        </div>
      </div>

      {/* Progress Summary */}
      <div className="container-custom -mt-6 relative z-10 mb-6">
        <div className="card p-4 text-center">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div>
              <p className="text-2xl font-bold" style={{ color: "#B76E79" }}>{totalItems}</p>
              <p className="text-xs text-medium">Total Gifts</p>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden sm:block" />
            <div>
              <p className="text-2xl font-bold" style={{ color: "#22c55e" }}>{fulfilledItems}</p>
              <p className="text-xs text-medium">Purchased</p>
            </div>
            <div className="w-px h-10 bg-gray-200 hidden sm:block" />
            <div>
              <p className="text-2xl font-bold" style={{ color: "#D4A853" }}>{totalItems - fulfilledItems}</p>
              <p className="text-xs text-medium">Still Needed</p>
            </div>
          </div>
          <div className="mt-4 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${overallProgress}%`,
                  backgroundColor: overallProgress >= 100 ? "#22c55e" : "#B76E79",
                }}
              />
            </div>
            <p className="text-xs text-medium mt-1">{overallProgress}% fulfilled</p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="container-custom pb-16">
        {items.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-medium text-base">No items in this registry yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: GiftRegistryItem) => {
              const remaining = Math.max(0, item.quantity_requested - item.quantity_purchased);
              const isFulfilled = remaining === 0;
              const progress =
                item.quantity_requested > 0
                  ? Math.min(100, Math.round((item.quantity_purchased / item.quantity_requested) * 100))
                  : 0;

              return (
                <div
                  key={item.id}
                  className={`card overflow-hidden transition-all duration-200 ${
                    isFulfilled ? "opacity-75" : "hover:shadow-lg"
                  }`}
                >
                  {/* Product Image */}
                  {item.product && (
                    <Link href={`/products/${item.product.id}`}>
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        {isFulfilled && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                              Purchased
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  )}

                  <div className="p-4">
                    {/* Product Info */}
                    <Link href={`/products/${item.product?.id || "#"}`}>
                      <h3 className="font-semibold text-dark text-base mb-1 hover:transition-colors line-clamp-1" style={{ color: isFulfilled ? "#9ca3af" : undefined }}>
                        {item.product?.name || "Unknown Product"}
                      </h3>
                    </Link>
                    <p className="text-lg font-bold mb-3" style={{ color: "#B76E79" }}>
                      {item.product ? formatPrice(item.product.price) : "0.00"}
                    </p>

                    {/* Quantity Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-medium">Requested</span>
                        <span className="font-medium text-dark">{item.quantity_requested}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-medium">Purchased</span>
                        <span className="font-medium" style={{ color: "#22c55e" }}>{item.quantity_purchased}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-medium">Still Needed</span>
                        <span className="font-bold" style={{ color: remaining > 0 ? "#D4A853" : "#22c55e" }}>
                          {remaining}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: isFulfilled ? "#22c55e" : "#D4A853",
                          }}
                        />
                      </div>
                    </div>

                    {/* Purchase Button */}
                    {!isFulfilled && (
                      <button
                        onClick={() => handlePurchase(item.id)}
                        disabled={purchasingItemId === item.id}
                        className="w-full py-1.5 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
                        style={{
                          backgroundColor: purchaseSuccess === item.id ? "#22c55e" : "#B76E79",
                        }}
                      >
                        {purchasingItemId === item.id ? (
                          <>
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                          </>
                        ) : purchaseSuccess === item.id ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Purchased!
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                            </svg>
                            Purchase This Gift
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-medium text-xs mb-4">Want to create your own gift registry?</p>
          <Link href="/gift-registry" className="btn-secondary">
            Create a Registry
          </Link>
        </div>
      </div>
    </div>
  );
}
