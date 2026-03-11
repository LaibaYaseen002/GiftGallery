"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { ProductBundle, Product } from "@/types";
import { bundlesApi, productsApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface BundleItemEntry {
  product_id: string;
  quantity: number;
  product?: Product;
}

const OCCASIONS = ["birthday", "wedding", "anniversary", "festival", "custom"];

export default function AdminBundlesPage() {
  const { getToken } = useAuth();
  const { formatPrice } = useLanguage();
  const [bundles, setBundles] = useState<ProductBundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductBundle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formOccasion, setFormOccasion] = useState("");
  const [formDiscount, setFormDiscount] = useState(0);
  const [formItems, setFormItems] = useState<BundleItemEntry[]>([]);
  const [productSearch, setProductSearch] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [bundleRes, prodRes] = await Promise.all([
        bundlesApi.getAll(),
        productsApi.getAll(),
      ]);
      setBundles(bundleRes.data || []);
      setProducts(prodRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormImageUrl("");
    setFormOccasion("");
    setFormDiscount(0);
    setFormItems([]);
    setProductSearch("");
    setError("");
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (bundle: ProductBundle) => {
    setEditing(bundle);
    setFormName(bundle.name);
    setFormDescription(bundle.description || "");
    setFormImageUrl(bundle.image_url || "");
    setFormOccasion(bundle.occasion || "");
    setFormDiscount(bundle.discount_percent);
    setFormItems(
      (bundle.items || []).map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        product: item.product,
      }))
    );
    setProductSearch("");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError("Bundle name is required.");
      return;
    }
    if (formItems.length === 0) {
      setError("Add at least one product to the bundle.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) return;

      const data = {
        name: formName.trim(),
        description: formDescription.trim() || undefined,
        image_url: formImageUrl.trim() || undefined,
        occasion: formOccasion || undefined,
        discount_percent: formDiscount,
        items: formItems.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
        })),
      };

      if (editing) {
        await bundlesApi.update(editing.id, data, token);
      } else {
        await bundlesApi.create(data as Parameters<typeof bundlesApi.create>[0], token);
      }

      setModalOpen(false);
      setEditing(null);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save bundle.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await bundlesApi.delete(id, token);
      setDeleteId(null);
      await fetchData();
    } catch (err) {
      console.error("Failed to delete bundle:", err);
    }
  };

  const handleToggleActive = async (bundle: ProductBundle) => {
    try {
      const token = await getToken();
      if (!token) return;
      await bundlesApi.update(
        bundle.id,
        { is_active: !bundle.is_active },
        token
      );
      await fetchData();
    } catch (err) {
      console.error("Failed to toggle bundle:", err);
    }
  };

  const addProduct = (product: Product) => {
    if (formItems.some((i) => i.product_id === product.id)) return;
    setFormItems([
      ...formItems,
      { product_id: product.id, quantity: 1, product },
    ]);
    setProductSearch("");
  };

  const removeProduct = (productId: string) => {
    setFormItems(formItems.filter((i) => i.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    setFormItems(
      formItems.map((i) =>
        i.product_id === productId ? { ...i, quantity } : i
      )
    );
  };

  const filteredProducts = products.filter(
    (p) =>
      productSearch.trim() &&
      p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !formItems.some((i) => i.product_id === p.id)
  );

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="page-title mb-1">Manage Bundles</h1>
          <p className="text-medium text-xs">
            {bundles.length} bundle{bundles.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create Bundle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-dark">{bundles.length}</p>
          <p className="text-xs text-medium">Total Bundles</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-success">
            {bundles.filter((b) => b.is_active).length}
          </p>
          <p className="text-xs text-medium">Active</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-error">
            {bundles.filter((b) => !b.is_active).length}
          </p>
          <p className="text-xs text-medium">Inactive</p>
        </div>
      </div>

      {/* Bundles List */}
      {bundles.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-border mx-auto mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
            />
          </svg>
          <h2 className="text-xl font-bold text-dark mb-2">
            No bundles yet
          </h2>
          <p className="text-medium mb-4">
            Create your first product bundle to get started.
          </p>
          <button onClick={openCreate} className="btn-primary">
            + Create Bundle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bundles.map((bundle) => (
            <div
              key={bundle.id}
              className={`card p-5 ${!bundle.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex gap-4 flex-1">
                  {bundle.image_url && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                      <Image
                        src={bundle.image_url}
                        alt={bundle.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-dark truncate">
                        {bundle.name}
                      </h3>
                      {bundle.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-medium">
                      {bundle.occasion && (
                        <span className="capitalize">{bundle.occasion}</span>
                      )}
                      <span>
                        {bundle.items?.length || 0} item
                        {(bundle.items?.length || 0) !== 1 ? "s" : ""}
                      </span>
                      <span className="text-primary font-medium">
                        {bundle.discount_percent}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleActive(bundle)}
                    className="px-4 py-2 text-xs font-medium text-medium border border-border rounded-lg hover:text-primary hover:border-primary transition-colors"
                  >
                    {bundle.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEdit(bundle)}
                    className="px-4 py-2 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteId(bundle.id)}
                    className="px-4 py-2 text-xs font-medium text-error border border-error rounded-lg hover:bg-error hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? "Edit Bundle" : "Create Bundle"}
      >
        <div className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Bundle Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="input-field"
              placeholder="e.g. Birthday Surprise Pack"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Describe this bundle..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              className="input-field"
              placeholder="https://images.unsplash.com/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="bundle-occasion" className="block text-xs font-medium text-dark mb-1">
                Occasion
              </label>
              <select
                id="bundle-occasion"
                value={formOccasion}
                onChange={(e) => setFormOccasion(e.target.value)}
                className="input-field"
              >
                <option value="">Select occasion</option>
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o.charAt(0).toUpperCase() + o.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bundle-discount" className="block text-xs font-medium text-dark mb-1">
                Discount %
              </label>
              <input
                id="bundle-discount"
                type="number"
                value={formDiscount}
                onChange={(e) =>
                  setFormDiscount(Math.max(0, Math.min(100, Number(e.target.value))))
                }
                className="input-field"
                min={0}
                max={100}
              />
            </div>
          </div>

          {/* Product Search */}
          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Add Products *
            </label>
            <div className="relative">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="input-field"
                placeholder="Search products to add..."
              />
              {filteredProducts.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredProducts.slice(0, 8).map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => addProduct(product)}
                      className="w-full text-left px-4 py-2 hover:bg-light transition-colors flex items-center gap-3"
                    >
                      <div className="relative w-8 h-8 rounded overflow-hidden shrink-0 bg-gray-100">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      </div>
                      <span className="text-xs text-dark truncate">
                        {product.name}
                      </span>
                      <span className="text-xs text-medium ml-auto">
                        {formatPrice(product.price)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected Items */}
          {formItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-dark">
                Bundle Items ({formItems.length})
              </p>
              {formItems.map((item) => {
                const product =
                  item.product || products.find((p) => p.id === item.product_id);
                return (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-3 bg-light rounded-lg px-3 py-2"
                  >
                    <span className="text-xs text-dark flex-1 truncate">
                      {product?.name || item.product_id}
                    </span>
                    <div className="flex items-center gap-2">
                      <label htmlFor={`qty-${item.product_id}`} className="text-xs text-medium">Qty:</label>
                      <input
                        id={`qty-${item.product_id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.product_id, Number(e.target.value))
                        }
                        className="w-16 text-center text-xs border border-border rounded-lg px-2 py-1"
                        min={1}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeProduct(item.product_id)}
                      aria-label={`Remove ${product?.name || "product"}`}
                      className="text-error hover:text-red-700 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={closeModal}
              className="btn-secondary flex-1"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex-1"
              disabled={saving}
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Bundle"
      >
        <p className="text-medium mb-4">
          Are you sure you want to delete this bundle? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 bg-error text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
