"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Charity } from "@/types";
import { charitiesApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

export default function AdminCharitiesPage() {
  const { getToken } = useAuth();
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Charity | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [formWebsiteUrl, setFormWebsiteUrl] = useState("");

  const fetchCharities = useCallback(async () => {
    try {
      const res = await charitiesApi.getAll();
      setCharities(res.data || []);
    } catch (err) {
      console.error("Failed to fetch charities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharities();
  }, [fetchCharities]);

  const resetForm = () => {
    setFormName("");
    setFormDescription("");
    setFormLogoUrl("");
    setFormWebsiteUrl("");
    setError("");
  };

  const openCreate = () => {
    setEditing(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (charity: Charity) => {
    setEditing(charity);
    setFormName(charity.name);
    setFormDescription(charity.description || "");
    setFormLogoUrl(charity.logo_url || "");
    setFormWebsiteUrl(charity.website_url || "");
    setError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      setError("Charity name is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const token = await getToken();
      if (!token) return;

      const data: Partial<Charity> = {
        name: formName.trim(),
        description: formDescription.trim() || null,
        logo_url: formLogoUrl.trim() || null,
        website_url: formWebsiteUrl.trim() || null,
      };

      if (editing) {
        await charitiesApi.update(editing.id, data, token);
      } else {
        await charitiesApi.create(data, token);
      }

      setModalOpen(false);
      setEditing(null);
      await fetchCharities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save charity.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await charitiesApi.delete(id, token);
      setDeleteId(null);
      await fetchCharities();
    } catch (err) {
      console.error("Failed to delete charity:", err);
    }
  };

  const handleToggleActive = async (charity: Charity) => {
    try {
      const token = await getToken();
      if (!token) return;
      await charitiesApi.update(
        charity.id,
        { is_active: !charity.is_active },
        token
      );
      await fetchCharities();
    } catch (err) {
      console.error("Failed to toggle charity:", err);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <h1 className="page-title mb-1">Charity Partners</h1>
          <p className="text-medium text-xs">
            {charities.length} charit{charities.length !== 1 ? "ies" : "y"}{" "}
            total
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Charity
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-dark">{charities.length}</p>
          <p className="text-xs text-medium">Total Partners</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-success">
            {charities.filter((c) => c.is_active).length}
          </p>
          <p className="text-xs text-medium">Active</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-error">
            {charities.filter((c) => !c.is_active).length}
          </p>
          <p className="text-xs text-medium">Inactive</p>
        </div>
      </div>

      {/* Charities Grid */}
      {charities.length === 0 ? (
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
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <h2 className="text-xl font-bold text-dark mb-2">
            No charity partners yet
          </h2>
          <p className="text-medium mb-4">
            Add your first charity partner to get started.
          </p>
          <button onClick={openCreate} className="btn-primary">
            + Add Charity
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {charities.map((charity) => (
            <div
              key={charity.id}
              className={`card p-4 ${!charity.is_active ? "opacity-60" : ""}`}
            >
              <div className="flex gap-4">
                {/* Logo */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {charity.logo_url ? (
                    <Image
                      src={charity.logo_url}
                      alt={charity.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8 h-8 text-border"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark truncate">
                    {charity.name}
                  </h3>
                  {charity.description && (
                    <p className="text-xs text-medium mt-1 line-clamp-2">
                      {charity.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {charity.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                    {charity.website_url && (
                      <a
                        href={charity.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => handleToggleActive(charity)}
                  className="flex-1 text-xs py-1.5 px-3 rounded-lg border border-border text-medium hover:text-primary hover:border-primary transition-colors"
                >
                  {charity.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => openEdit(charity)}
                  className="flex-1 text-xs py-1.5 px-3 rounded-lg border border-border text-medium hover:text-primary hover:border-primary transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteId(charity.id)}
                  className="flex-1 text-xs py-1.5 px-3 rounded-lg border border-border text-medium hover:text-error hover:border-error transition-colors"
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
        title={editing ? "Edit Charity" : "Add Charity"}
      >
        <div className="space-y-3">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Charity Name *
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="input-field"
              placeholder="e.g. Save the Children"
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
              placeholder="Describe this charity's mission..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Logo URL
            </label>
            <input
              type="url"
              value={formLogoUrl}
              onChange={(e) => setFormLogoUrl(e.target.value)}
              className="input-field"
              placeholder="https://example.com/logo.png"
            />
            {formLogoUrl && (
              <div className="relative w-full h-32 rounded-lg overflow-hidden mt-2 bg-gray-100">
                <Image
                  src={formLogoUrl}
                  alt="Preview"
                  fill
                  className="object-contain"
                  sizes="400px"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-dark mb-1">
              Website URL
            </label>
            <input
              type="url"
              value={formWebsiteUrl}
              onChange={(e) => setFormWebsiteUrl(e.target.value)}
              className="input-field"
              placeholder="https://www.charity.org"
            />
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
        title="Delete Charity"
      >
        <p className="text-medium mb-4">
          Are you sure you want to delete this charity partner? This action
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
            className="flex-1 bg-error text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
