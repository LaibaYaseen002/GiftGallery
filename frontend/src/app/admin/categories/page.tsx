"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { Category } from "@/types";
import { categoriesApi, productsApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface CategoryWithCount extends Category {
  product_count: number;
}

export default function AdminCategoriesPage() {
  const { getToken } = useAuth();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryWithCount | null>(null);
  const [deleting, setDeleting] = useState<CategoryWithCount | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formImage, setFormImage] = useState("");

  const fetchCategories = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        categoriesApi.getAll(),
        productsApi.getAll(),
      ]);

      const products = prodRes.data || [];
      const cats = (catRes.data || []).map((cat) => ({
        ...cat,
        product_count: products.filter((p) => p.category_id === cat.id).length,
      }));

      setCategories(cats);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const openCreate = () => {
    setEditing(null);
    setFormName("");
    setFormSlug("");
    setFormImage("");
    setError("");
    setModalOpen(true);
  };

  const openEdit = (cat: CategoryWithCount) => {
    setEditing(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormImage(cat.image_url || "");
    setError("");
    setModalOpen(true);
  };

  const handleNameChange = (value: string) => {
    setFormName(value);
    if (!editing) {
      setFormSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!formName.trim() || !formSlug.trim()) {
      setError("Name and slug are required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) return;

      const data = {
        name: formName.trim(),
        slug: formSlug.trim(),
        image_url: formImage.trim() || undefined,
      };

      if (editing) {
        await categoriesApi.update(editing.id, data, token);
      } else {
        await categoriesApi.create(data as { name: string; slug: string; image_url?: string }, token);
      }

      setModalOpen(false);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;

    setSaving(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) return;

      await categoriesApi.delete(deleting.id, token);
      setDeleting(null);
      await fetchCategories();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete category.");
    } finally {
      setSaving(false);
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
          <h1 className="page-title mb-1">Category Management</h1>
          <p className="text-medium text-sm">{categories.length} categories total</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Categories Grid */}
      {categories.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-medium">No categories yet. Create your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="card p-4">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {cat.image_url ? (
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-2xl">🎁</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark truncate">{cat.name}</h3>
                  <p className="text-xs text-medium mt-0.5">/{cat.slug}</p>
                  <p className="text-sm text-medium mt-1">
                    {cat.product_count} product{cat.product_count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => openEdit(cat)}
                  className="flex-1 text-sm py-1.5 px-3 rounded-lg border border-border text-medium hover:text-primary hover:border-primary transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setError("");
                    setDeleting(cat);
                  }}
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
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "Add Category"}
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Category Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="input-field"
              placeholder="e.g. Home Decor"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Slug *
            </label>
            <input
              type="text"
              value={formSlug}
              onChange={(e) => setFormSlug(e.target.value)}
              className="input-field"
              placeholder="e.g. home-decor"
            />
            <p className="text-xs text-medium mt-1">
              Used in URL: /category/{formSlug || "slug"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              className="input-field"
              placeholder="https://images.unsplash.com/..."
            />
            {formImage && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mt-2 bg-gray-100">
                <Image
                  src={formImage}
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

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setModalOpen(false)}
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
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Category"
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <p className="text-medium">
            Are you sure you want to delete <strong className="text-dark">{deleting?.name}</strong>?
          </p>

          {deleting && deleting.product_count > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg px-4 py-3 text-sm">
              This category has {deleting.product_count} product{deleting.product_count > 1 ? "s" : ""}. You must remove or reassign them before deleting.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setDeleting(null)}
              className="btn-secondary flex-1"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-error text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
