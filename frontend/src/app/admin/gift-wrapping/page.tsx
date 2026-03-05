"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { GiftWrappingOption } from "@/types";
import { giftWrappingApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

type TabType = "wrapping" | "packaging";

export default function AdminGiftWrappingPage() {
  const { getToken } = useAuth();
  const [options, setOptions] = useState<GiftWrappingOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("wrapping");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<GiftWrappingOption | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formColor, setFormColor] = useState("#B76E79");
  const [formTheme, setFormTheme] = useState("");
  const [formEcoFriendly, setFormEcoFriendly] = useState(false);

  const fetchOptions = useCallback(async () => {
    try {
      const res = await giftWrappingApi.getAll();
      setOptions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch gift wrapping options:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const filteredOptions = options.filter((o) => o.type === activeTab);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormImageUrl("");
    setFormPrice(0);
    setFormColor("#B76E79");
    setFormTheme("");
    setFormEcoFriendly(false);
    setError("");
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (option: GiftWrappingOption) => {
    setEditing(option);
    setFormName(option.name);
    setFormDescription(option.description || "");
    setFormImageUrl(option.image_url || "");
    setFormPrice(option.price);
    setFormColor(option.color || "#B76E79");
    setFormTheme(option.theme || "");
    setFormEcoFriendly(option.is_eco_friendly);
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError("Name is required.");
      return;
    }
    if (formPrice < 0) {
      setError("Price must be 0 or greater.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) return;

      const data: Partial<GiftWrappingOption> = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        image_url: formImageUrl.trim() || null,
        price: formPrice,
        type: activeTab,
        color: formColor || null,
        theme: formTheme.trim() || null,
        is_eco_friendly: formEcoFriendly,
      };

      if (editing) {
        await giftWrappingApi.update(editing.id, data, token);
      } else {
        await giftWrappingApi.create(data, token);
      }

      setModalOpen(false);
      setEditing(null);
      await fetchOptions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save option.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await giftWrappingApi.delete(id, token);
      setDeleteId(null);
      await fetchOptions();
    } catch (err) {
      console.error("Failed to delete option:", err);
    }
  };

  const handleToggleActive = async (option: GiftWrappingOption) => {
    try {
      const token = await getToken();
      if (!token) return;
      await giftWrappingApi.update(
        option.id,
        { is_active: !option.is_active },
        token
      );
      await fetchOptions();
    } catch (err) {
      console.error("Failed to toggle option:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title mb-1">Gift Wrapping & Packaging</h1>
          <p className="text-medium text-sm">
            {options.length} option{options.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Option
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-light rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("wrapping")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "wrapping"
              ? "bg-white text-primary shadow-sm"
              : "text-medium hover:text-dark"
          }`}
        >
          Wrapping
          <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {options.filter((o) => o.type === "wrapping").length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("packaging")}
          className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "packaging"
              ? "bg-white text-primary shadow-sm"
              : "text-medium hover:text-dark"
          }`}
        >
          Packaging
          <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {options.filter((o) => o.type === "packaging").length}
          </span>
        </button>
      </div>

      {/* Options Grid */}
      {filteredOptions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-medium">
            No {activeTab} options yet. Add your first one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`card p-4 ${!option.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex gap-4">
                {/* Color Swatch / Image */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                  {option.image_url ? (
                    <Image
                      src={option.image_url}
                      alt={option.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-lg border border-border"
                      style={{ backgroundColor: option.color || "#B76E79" }}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-dark truncate">
                      {option.name}
                    </h3>
                    {option.is_eco_friendly && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Eco
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-medium">
                    <span className="font-medium text-dark">
                      ${option.price.toFixed(2)}
                    </span>
                    {option.theme && <span>{option.theme}</span>}
                    {option.color && (
                      <span className="flex items-center gap-1">
                        <span
                          className="inline-block w-3 h-3 rounded-full border border-border"
                          style={{ backgroundColor: option.color }}
                        />
                        {option.color}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    {option.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => handleToggleActive(option)}
                  className="flex-1 text-sm py-1.5 px-3 rounded-lg border border-border text-medium hover:text-primary hover:border-primary transition-colors"
                >
                  {option.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => openEdit(option)}
                  className="flex-1 text-sm py-1.5 px-3 rounded-lg border border-border text-medium hover:text-primary hover:border-primary transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(option.id)}
                  className="flex-1 text-sm py-1.5 px-3 rounded-lg border border-border text-medium hover:text-error hover:border-error transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editing
            ? `Edit ${activeTab === "wrapping" ? "Wrapping" : "Packaging"} Option`
            : `Add ${activeTab === "wrapping" ? "Wrapping" : "Packaging"} Option`
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="input-field"
              placeholder="e.g. Rose Gold Ribbon Wrap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Description
            </label>
            <textarea
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="input-field"
              rows={3}
              placeholder="Describe this option..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formImageUrl}
              onChange={(e) => setFormImageUrl(e.target.value)}
              className="input-field"
              placeholder="https://images.unsplash.com/..."
            />
            {formImageUrl && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mt-2 bg-gray-100">
                <Image
                  src={formImageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="400px"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Price *
              </label>
              <input
                type="number"
                value={formPrice}
                onChange={(e) => setFormPrice(Math.max(0, Number(e.target.value)))}
                className="input-field"
                min={0}
                step={0.01}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                />
                <input
                  type="text"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="input-field flex-1"
                  placeholder="#B76E79"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Theme
            </label>
            <input
              type="text"
              value={formTheme}
              onChange={(e) => setFormTheme(e.target.value)}
              className="input-field"
              placeholder="e.g. Floral, Minimalist, Festive"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="ecoFriendly"
              checked={formEcoFriendly}
              onChange={(e) => setFormEcoFriendly(e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="ecoFriendly" className="text-sm font-medium text-dark">
              Eco-Friendly Option
            </label>
          </div>

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
        title="Delete Option"
      >
        <p className="text-medium mb-6">
          Are you sure you want to delete this {activeTab} option? This action
          cannot be undone.
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
            className="flex-1 bg-error text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
