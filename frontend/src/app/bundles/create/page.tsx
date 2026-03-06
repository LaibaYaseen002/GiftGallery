"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { productsApi, bundlesApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface BundleItemDraft {
  product: Product;
  quantity: number;
}

export default function CreateBundlePage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { addItem } = useCart();
  const { t, formatPrice } = useLanguage();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bundleName, setBundleName] = useState("");
  const [bundleItems, setBundleItems] = useState<BundleItemDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    productsApi
      .getAll({ limit: 100 })
      .then((res) => setProducts(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      p.in_stock
  );

  const isInBundle = (productId: string) =>
    bundleItems.some((item) => item.product.id === productId);

  const addToBundle = (product: Product) => {
    if (isInBundle(product.id)) return;
    setBundleItems([...bundleItems, { product, quantity: 1 }]);
  };

  const removeFromBundle = (productId: string) => {
    setBundleItems(bundleItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setBundleItems(
      bundleItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalValue = bundleItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountPercent = 10;
  const bundlePrice = totalValue * (1 - discountPercent / 100);
  const savings = totalValue - bundlePrice;

  const handleSaveBundle = async () => {
    setError("");
    if (!bundleName.trim()) {
      setError("Please give your bundle a name");
      return;
    }
    if (bundleItems.length < 2) {
      setError("Add at least 2 items to create a bundle");
      return;
    }

    setSaving(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Please sign in to create a bundle");
        return;
      }

      await bundlesApi.createCustom(
        {
          name: bundleName.trim(),
          items: bundleItems.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        },
        token
      );

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bundle");
    } finally {
      setSaving(false);
    }
  };

  const handleAddBundleToCart = () => {
    for (const item of bundleItems) {
      addItem(item.product, item.quantity);
    }
    router.push("/cart");
  };

  if (success) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
          <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-dark mb-2">{t("bundles.title")} Created!</h1>
        <p className="text-medium mb-2">
          &quot;{bundleName}&quot; with {bundleItems.length} items
        </p>
        <p className="text-lg font-bold text-primary mb-8">
          {formatPrice(bundlePrice)}
          <span className="text-sm text-success ml-2">({t("bundles.youSave")} {formatPrice(savings)})</span>
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={handleAddBundleToCart} className="btn-primary px-8 py-3">
            {t("products.addToCart")}
          </button>
          <Link href="/bundles" className="btn-secondary px-8 py-3">
            {t("bundles.title")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title mb-1">{t("bundles.createCustom")}</h1>
          <p className="text-medium">
            Pick any products you want and get {discountPercent}% off the total!
          </p>
        </div>
        <Link href="/bundles" className="btn-secondary text-sm">
          {t("common.back")}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Product browser */}
        <div className="lg:col-span-2">
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field w-full"
              placeholder={t("products.search")}
            />
          </div>

          {/* Products grid */}
          {loading ? (
            <div className="py-20 text-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-medium py-10">{t("products.noResults")}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map((product) => {
                const inBundle = isInBundle(product.id);
                return (
                  <div
                    key={product.id}
                    className={`card overflow-hidden transition-all ${
                      inBundle ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="relative h-32">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                      {inBundle && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-white rounded-full p-1.5">
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-dark line-clamp-1">{product.name}</p>
                      <p className="text-sm text-primary font-bold mt-1">{formatPrice(product.price)}</p>
                      <button
                        onClick={() =>
                          inBundle ? removeFromBundle(product.id) : addToBundle(product)
                        }
                        className={`w-full mt-2 text-xs py-2 rounded-lg font-medium transition-colors ${
                          inBundle
                            ? "bg-error/10 text-error hover:bg-error/20"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {inBundle ? t("cart.remove") : "+ Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Bundle summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-dark mb-4">Your Bundle</h2>

            {/* Bundle name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-dark mb-1">Bundle Name</label>
              <input
                type="text"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
                className="input-field w-full"
                placeholder="e.g., Birthday Surprise"
                maxLength={100}
              />
            </div>

            {/* Items list */}
            {bundleItems.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg mb-4">
                <svg className="w-10 h-10 mx-auto text-medium mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <p className="text-sm text-medium">Add products from the left</p>
                <p className="text-xs text-medium mt-1">Minimum 2 items required</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {bundleItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-light rounded-lg p-2.5">
                    <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-medium">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded bg-border text-dark flex items-center justify-center text-sm hover:bg-primary/20"
                      >
                        -
                      </button>
                      <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded bg-border text-dark flex items-center justify-center text-sm hover:bg-primary/20"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromBundle(item.product.id)}
                      className="text-error hover:text-error/80 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing */}
            {bundleItems.length > 0 && (
              <div className="border-t border-border pt-4 space-y-2 text-sm mb-4">
                <div className="flex justify-between text-medium">
                  <span>{t("bundles.totalValue")}</span>
                  <span className="line-through">{formatPrice(totalValue)}</span>
                </div>
                <div className="flex justify-between text-success">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(savings)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-lg font-bold">{t("bundles.bundlePrice")}</span>
                  <span className="text-lg font-bold text-primary">{formatPrice(bundlePrice)}</span>
                </div>
                {savings > 0 && (
                  <p className="text-xs text-success text-center font-medium">
                    {t("bundles.youSave")} {formatPrice(savings)}!
                  </p>
                )}
              </div>
            )}

            {error && <p className="text-error text-sm mb-3">{error}</p>}

            <div className="space-y-2">
              <button
                onClick={handleSaveBundle}
                disabled={saving || bundleItems.length < 2}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Creating...
                  </span>
                ) : (
                  `Create Bundle (${bundleItems.length} items)`
                )}
              </button>
              <button
                onClick={handleAddBundleToCart}
                disabled={bundleItems.length === 0}
                className="btn-secondary w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("products.addToCart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
