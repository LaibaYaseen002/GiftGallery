"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { GiftRegistry, GiftRegistryItem, Product } from "@/types";
import { registryApi, productsApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type EventType = "birthday" | "wedding" | "baby_shower" | "anniversary" | "other";

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  birthday: "Birthday",
  wedding: "Wedding",
  baby_shower: "Baby Shower",
  anniversary: "Anniversary",
  other: "Other",
};

const EVENT_TYPE_COLORS: Record<EventType, string> = {
  birthday: "bg-pink-100 text-pink-700",
  wedding: "bg-purple-100 text-purple-700",
  baby_shower: "bg-blue-100 text-blue-700",
  anniversary: "bg-amber-100 text-amber-700",
  other: "bg-gray-100 text-gray-700",
};

interface CreateRegistryForm {
  event_name: string;
  event_type: EventType;
  event_date: string;
  description: string;
}

export default function GiftRegistryPage() {
  const { getToken } = useAuth();
  const [registries, setRegistries] = useState<GiftRegistry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<CreateRegistryForm>({
    event_name: "",
    event_type: "birthday",
    event_date: "",
    description: "",
  });

  // Manage items state
  const [managingRegistryId, setManagingRegistryId] = useState<string | null>(null);
  const [managingRegistry, setManagingRegistry] = useState<GiftRegistry | null>(null);
  const [managingLoading, setManagingLoading] = useState(false);

  // Add items state
  const [showAddItems, setShowAddItems] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchRegistries = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await registryApi.getMy(token);
      setRegistries(res.data || []);
    } catch (err) {
      console.error("Failed to fetch registries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.event_name.trim()) return;
    setCreating(true);
    try {
      const token = await getToken();
      if (!token) return;
      await registryApi.create(
        {
          event_name: form.event_name,
          event_type: form.event_type,
          event_date: form.event_date || undefined,
          description: form.description || undefined,
        },
        token
      );
      setForm({ event_name: "", event_type: "birthday", event_date: "", description: "" });
      setShowCreateForm(false);
      await fetchRegistries();
    } catch (err) {
      console.error("Failed to create registry:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registry?")) return;
    try {
      const token = await getToken();
      if (!token) return;
      await registryApi.delete(id, token);
      setRegistries((prev) => prev.filter((r) => r.id !== id));
      if (managingRegistryId === id) {
        setManagingRegistryId(null);
        setManagingRegistry(null);
      }
    } catch (err) {
      console.error("Failed to delete registry:", err);
    }
  };

  const handleManageItems = async (registry: GiftRegistry) => {
    if (managingRegistryId === registry.id) {
      setManagingRegistryId(null);
      setManagingRegistry(null);
      setShowAddItems(false);
      return;
    }
    setManagingRegistryId(registry.id);
    setManagingLoading(true);
    setShowAddItems(false);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await registryApi.getById(registry.id, token);
      setManagingRegistry(res.data);
    } catch (err) {
      console.error("Failed to fetch registry details:", err);
    } finally {
      setManagingLoading(false);
    }
  };

  const handleSearchProducts = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError(null);
    setHasSearched(false);
    try {
      const res = await productsApi.getAll({ search: searchQuery, limit: 12 });
      setSearchResults(res.data || []);
      setHasSearched(true);
    } catch (err) {
      console.error("Failed to search products:", err);
      setSearchError("Failed to search products. Please try again.");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddItem = async (productId: string) => {
    if (!managingRegistryId) return;
    try {
      const token = await getToken();
      if (!token) return;
      await registryApi.addItem(managingRegistryId, { product_id: productId, quantity_requested: 1 }, token);
      // Refresh the managed registry
      const res = await registryApi.getById(managingRegistryId, token);
      setManagingRegistry(res.data);
      await fetchRegistries();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    if (!managingRegistryId) return;
    try {
      const token = await getToken();
      if (!token) return;
      await registryApi.removeItem(managingRegistryId, itemId, token);
      const res = await registryApi.getById(managingRegistryId, token);
      setManagingRegistry(res.data);
      await fetchRegistries();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const copyShareLink = (shareCode: string) => {
    const url = `${window.location.origin}/gift-registry/${shareCode}`;
    navigator.clipboard.writeText(url);
    setCopiedCode(shareCode);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getItemStats = (registry: GiftRegistry) => {
    const items = registry.items || [];
    const totalItems = items.length;
    const totalPurchased = items.filter((i) => i.quantity_purchased >= i.quantity_requested).length;
    return { totalItems, totalPurchased };
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="page-title mb-0">My Gift Registries</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="btn-primary flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Registry
        </button>
      </div>

      {/* Create Registry Form */}
      {showCreateForm && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-dark mb-4">Create New Registry</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="event-name" className="block text-sm font-medium text-dark mb-1">Event Name *</label>
              <input
                id="event-name"
                type="text"
                value={form.event_name}
                onChange={(e) => setForm({ ...form, event_name: e.target.value })}
                className="input-field"
                placeholder="e.g., Sarah's Birthday Party"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="event-type" className="block text-sm font-medium text-dark mb-1">Event Type</label>
                <select
                  id="event-type"
                  value={form.event_type}
                  onChange={(e) => setForm({ ...form, event_type: e.target.value as EventType })}
                  className="input-field"
                  title="Select an event type"
                >
                  <option value="birthday">Birthday</option>
                  <option value="wedding">Wedding</option>
                  <option value="baby_shower">Baby Shower</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-dark mb-1">Event Date</label>
                <input
                  id="event-date"
                  type="date"
                  value={form.event_date}
                  onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div>
              <label htmlFor="registry-description" className="block text-sm font-medium text-dark mb-1">Description</label>
              <textarea
                id="registry-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field"
                rows={3}
                placeholder="Tell your guests about the event..."
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={creating}>
                {creating ? "Creating..." : "Create Registry"}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Registries List */}
      {registries.length === 0 ? (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-border mx-auto mb-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">No registries yet</h2>
          <p className="text-medium mb-6">
            Create a gift registry for your special event and share it with friends and family.
          </p>
          <button onClick={() => setShowCreateForm(true)} className="btn-primary text-lg">
            Create Your First Registry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {registries.map((registry) => {
            const { totalItems, totalPurchased } = getItemStats(registry);
            const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/gift-registry/${registry.share_code}`;

            return (
              <div key={registry.id} className="card overflow-hidden">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-dark">{registry.event_name}</h3>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                          EVENT_TYPE_COLORS[registry.event_type as EventType] || EVENT_TYPE_COLORS.other
                        }`}
                      >
                        {EVENT_TYPE_LABELS[registry.event_type as EventType] || registry.event_type}
                      </span>
                    </div>
                    {registry.event_date && (
                      <div className="text-right text-sm text-medium">
                        <span className="block font-medium">
                          {new Date(registry.event_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {registry.description && (
                    <p className="text-medium text-sm mb-4 line-clamp-2">{registry.description}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="text-dark font-medium">
                      {totalItems} item{totalItems !== 1 ? "s" : ""}
                    </span>
                    <span className="text-medium">
                      {totalPurchased} purchased
                    </span>
                  </div>

                  {/* Progress bar */}
                  {totalItems > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round((totalPurchased / totalItems) * 100)}%`,
                          backgroundColor: "#B76E79",
                        }}
                      />
                    </div>
                  )}

                  {/* Share Link */}
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: "#FFF8F0" }}>
                    <label htmlFor={`share-link-${registry.id}`} className="block text-xs font-medium text-medium mb-1">Share Link</label>
                    <div className="flex items-center gap-2">
                      <input
                        id={`share-link-${registry.id}`}
                        type="text"
                        value={shareUrl}
                        readOnly
                        title="Share link for this registry"
                        className="flex-1 bg-white border border-gray-200 rounded px-2 py-1 text-xs text-medium truncate"
                      />
                      <button
                        onClick={() => copyShareLink(registry.share_code)}
                        className="px-3 py-1 text-xs font-medium rounded transition-colors"
                        style={{
                          backgroundColor: copiedCode === registry.share_code ? "#22c55e" : "#D4A853",
                          color: "white",
                        }}
                      >
                        {copiedCode === registry.share_code ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleManageItems(registry)}
                      className="btn-primary text-sm py-2 flex-1"
                    >
                      {managingRegistryId === registry.id ? "Close Items" : "Manage Items"}
                    </button>
                    <button
                      onClick={() => handleDelete(registry.id)}
                      className="btn-secondary text-sm py-2 px-3"
                      title="Delete Registry"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Manage Items Panel */}
                {managingRegistryId === registry.id && (
                  <div className="border-t border-gray-200 p-6">
                    {managingLoading ? (
                      <LoadingSpinner size="md" className="py-8" />
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-dark">Registry Items</h4>
                          <button
                            onClick={() => setShowAddItems(!showAddItems)}
                            className="btn-secondary text-sm py-1.5 flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            Add Items
                          </button>
                        </div>

                        {/* Add Items Search */}
                        {showAddItems && (
                          <div className="mb-6 p-4 rounded-lg border border-gray-200" style={{ backgroundColor: "#FFF8F0" }}>
                            <h5 className="font-medium text-dark text-sm mb-3">Search Products to Add</h5>
                            <div className="flex gap-2 mb-3">
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearchProducts()}
                                className="input-field flex-1"
                                placeholder="Search for products..."
                                aria-label="Search products to add to registry"
                              />
                              <button
                                onClick={handleSearchProducts}
                                className="btn-primary text-sm py-2"
                                disabled={searching}
                              >
                                {searching ? "..." : "Search"}
                              </button>
                            </div>
                            {searchError && (
                              <p className="text-red-500 text-sm text-center py-3">{searchError}</p>
                            )}
                            {searchResults.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                {searchResults.map((product) => {
                                  const alreadyAdded = managingRegistry?.items?.some(
                                    (i) => i.product_id === product.id
                                  );
                                  return (
                                    <div
                                      key={product.id}
                                      className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-100"
                                    >
                                      <div className="relative w-10 h-10 flex-shrink-0 rounded overflow-hidden">
                                        <Image
                                          src={product.image_url}
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                          sizes="40px"
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-dark truncate">{product.name}</p>
                                        <p className="text-xs" style={{ color: "#B76E79" }}>${product.price.toFixed(2)}</p>
                                      </div>
                                      <button
                                        onClick={() => handleAddItem(product.id)}
                                        disabled={alreadyAdded}
                                        className="text-xs px-2 py-1 rounded font-medium transition-colors"
                                        style={{
                                          backgroundColor: alreadyAdded ? "#e5e7eb" : "#B76E79",
                                          color: alreadyAdded ? "#9ca3af" : "white",
                                          cursor: alreadyAdded ? "not-allowed" : "pointer",
                                        }}
                                      >
                                        {alreadyAdded ? "Added" : "Add"}
                                      </button>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              hasSearched && !searchError && (
                                <p className="text-medium text-sm text-center py-3">
                                  No products found for &quot;{searchQuery}&quot;. Try a different search term.
                                </p>
                              )
                            )}
                          </div>
                        )}

                        {/* Items List */}
                        {(!managingRegistry?.items || managingRegistry.items.length === 0) ? (
                          <p className="text-medium text-sm text-center py-6">
                            No items in this registry yet. Add some products above!
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {managingRegistry.items.map((item: GiftRegistryItem) => {
                              const progress =
                                item.quantity_requested > 0
                                  ? Math.min(100, Math.round((item.quantity_purchased / item.quantity_requested) * 100))
                                  : 0;
                              return (
                                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-white">
                                  {item.product && (
                                    <div className="relative w-14 h-14 flex-shrink-0 rounded overflow-hidden">
                                      <Image
                                        src={item.product.image_url}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover"
                                        sizes="56px"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-dark text-sm truncate">
                                      {item.product?.name || "Unknown Product"}
                                    </p>
                                    <p className="text-xs" style={{ color: "#B76E79" }}>
                                      ${item.product?.price.toFixed(2) || "0.00"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div
                                          className="h-1.5 rounded-full transition-all"
                                          style={{
                                            width: `${progress}%`,
                                            backgroundColor: progress >= 100 ? "#22c55e" : "#D4A853",
                                          }}
                                        />
                                      </div>
                                      <span className="text-xs text-medium whitespace-nowrap">
                                        {item.quantity_purchased}/{item.quantity_requested}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="p-1.5 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                                    title="Remove item"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-500">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
