"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GroupGift, Product } from "@/types";
import { groupGiftsApi, productsApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function GroupGiftPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [groupGifts, setGroupGifts] = useState<GroupGift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchGroupGifts = async () => {
    try {
      const token = await getToken();
      if (!token) {
        router.push("/sign-in");
        return;
      }
      const res = await groupGiftsApi.getMy(token);
      setGroupGifts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch group gifts:", err);
      setError("Failed to load your group gifts.");
    } finally {
      setLoading(false);
    }
  };

  const searchProducts = async (search: string) => {
    try {
      const res = await productsApi.getAll({ search, limit: 10 });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to search products:", err);
    }
  };

  useEffect(() => {
    fetchGroupGifts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productSearch.length >= 2) {
      const timeout = setTimeout(() => {
        searchProducts(productSearch);
        setShowProductDropdown(true);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setProducts([]);
      setShowProductDropdown(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setFormError("Please select a product.");
      return;
    }
    if (!recipientName.trim()) {
      setFormError("Please enter the recipient's name.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const token = await getToken();
      if (!token) return;

      await groupGiftsApi.create(
        {
          product_id: selectedProduct.id,
          recipient_name: recipientName.trim(),
          recipient_email: recipientEmail.trim() || undefined,
          message: message.trim() || undefined,
          expires_at: expiryDate || undefined,
        },
        token
      );

      // Reset form
      setSelectedProduct(null);
      setProductSearch("");
      setRecipientName("");
      setRecipientEmail("");
      setMessage("");
      setExpiryDate("");
      setShowForm(false);

      // Refresh list
      await fetchGroupGifts();
    } catch (err) {
      console.error("Failed to create group gift:", err);
      setFormError(err instanceof Error ? err.message : "Failed to create group gift.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this group gift?")) return;
    try {
      const token = await getToken();
      if (!token) return;
      await groupGiftsApi.cancel(id, token);
      setGroupGifts((prev) =>
        prev.map((g) => (g.id === id ? { ...g, status: "cancelled" as const } : g))
      );
    } catch (err) {
      console.error("Failed to cancel group gift:", err);
    }
  };

  const getShareLink = (id: string) => {
    return `${window.location.origin}/group-gift/${id}/contribute`;
  };

  const copyShareLink = (id: string) => {
    navigator.clipboard.writeText(getShareLink(id));
    alert("Share link copied to clipboard!");
  };

  const getStatusColor = (status: GroupGift["status"]) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "funded":
        return "bg-green-100 text-green-800";
      case "purchased":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="page-title mb-0">Group Gifting</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? "Cancel" : "Start a Group Gift"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-dark mb-4">
            Start a Group Gift
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Product Selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-dark mb-1">
                Select Product
              </label>
              {selectedProduct ? (
                <div className="flex items-center gap-3 p-3 border border-[#B76E79]/30 rounded-lg bg-[#FFF8F0]">
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      fill
                      className="object-cover rounded"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-dark">{selectedProduct.name}</p>
                    <p className="text-sm" style={{ color: "#B76E79" }}>
                      ${selectedProduct.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      setProductSearch("");
                    }}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setSelectedProduct(null);
                    }}
                    placeholder="Type to search, then select from dropdown..."
                    className="input-field"
                    onFocus={() => {
                      if (products.length > 0) setShowProductDropdown(true);
                    }}
                    onBlur={() => {
                      setTimeout(() => setShowProductDropdown(false), 300);
                    }}
                  />
                  {productSearch.length >= 2 && !showProductDropdown && products.length === 0 && (
                    <p className="text-medium text-xs mt-1">No products found. Try a different search term.</p>
                  )}
                  {productSearch.length >= 2 && products.length > 0 && !showProductDropdown && !selectedProduct && (
                    <p className="text-amber-600 text-xs mt-1">Click on a product from the list to select it.</p>
                  )}
                  {showProductDropdown && products.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {products.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSelectedProduct(product);
                            setProductSearch(product.name);
                            setShowProductDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-[#FFF8F0] transition-colors text-left"
                        >
                          <div className="relative w-10 h-10 flex-shrink-0">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                              sizes="40px"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-dark">
                              {product.name}
                            </p>
                            <p className="text-xs" style={{ color: "#B76E79" }}>
                              ${product.price.toFixed(2)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Recipient Name */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Recipient Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Who is this gift for?"
                className="input-field"
                required
              />
            </div>

            {/* Recipient Email */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Recipient Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com (optional)"
                className="input-field"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write a message for the recipient..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="input-field"
                min={new Date().toISOString().split("T")[0]}
                title="Select the expiry date for this group gift"
                placeholder="Select a date"
              />
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {formError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? "Creating..." : "Create Group Gift"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Group Gifts List */}
      {groupGifts.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 mx-auto mb-6"
            style={{ color: "#B76E79" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.25-9.75h16.5"
            />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">
            No group gifts yet
          </h2>
          <p className="text-medium mb-6">
            Start a group gift and invite friends to contribute together!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary text-lg"
          >
            Start a Group Gift
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {groupGifts.map((gift) => {
            const percentage =
              gift.target_amount > 0
                ? Math.min(
                    Math.round((gift.current_amount / gift.target_amount) * 100),
                    100
                  )
                : 0;
            const remaining = Math.max(gift.target_amount - gift.current_amount, 0);

            return (
              <div key={gift.id} className="card overflow-hidden">
                {/* Product Info */}
                <div className="flex gap-4 p-4 border-b border-gray-100">
                  {gift.product && (
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={gift.product.image_url}
                        alt={gift.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {gift.product && (
                          <h3 className="font-semibold text-dark text-lg line-clamp-1">
                            {gift.product.name}
                          </h3>
                        )}
                        <p className="text-sm text-medium">
                          For: <span className="font-medium">{gift.recipient_name}</span>
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(gift.status)}`}
                      >
                        {gift.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-medium">
                      ${gift.current_amount.toFixed(2)} of ${gift.target_amount.toFixed(2)}
                    </span>
                    <span className="font-semibold" style={{ color: "#B76E79" }}>
                      {percentage}% funded
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          percentage >= 100 ? "#22c55e" : "#B76E79",
                      }}
                    />
                  </div>
                  {gift.status === "active" && remaining > 0 && (
                    <p className="text-xs text-medium mt-1">
                      ${remaining.toFixed(2)} still needed
                    </p>
                  )}
                </div>

                {/* Contributors */}
                {gift.contributions && gift.contributions.length > 0 && (
                  <div className="px-4 pb-3">
                    <h4 className="text-sm font-medium text-dark mb-2">
                      Contributors ({gift.contributions.length})
                    </h4>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {gift.contributions.map((contrib) => (
                        <div
                          key={contrib.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-medium">{contrib.contributor_name}</span>
                          <span className="font-medium" style={{ color: "#D4A853" }}>
                            ${contrib.amount.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 border-t border-gray-100 flex flex-wrap gap-2">
                  {gift.status === "active" && (
                    <>
                      <button
                        onClick={() => copyShareLink(gift.id)}
                        className="btn-accent text-sm py-2 flex items-center gap-1.5"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0-12.814a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0 12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                          />
                        </svg>
                        Share Link
                      </button>
                      <button
                        onClick={() => handleCancel(gift.id)}
                        className="btn-secondary text-sm py-2 text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  <Link
                    href={`/group-gift/${gift.id}/contribute`}
                    className="btn-secondary text-sm py-2"
                  >
                    View Page
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
