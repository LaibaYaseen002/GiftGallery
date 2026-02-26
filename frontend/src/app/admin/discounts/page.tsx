"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { DiscountCode } from "@/types";
import { discountsApi } from "@/lib/api";
import DiscountForm from "@/components/admin/DiscountForm";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDiscountsPage() {
  const { getToken } = useAuth();
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(
    null
  );
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchDiscounts = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await discountsApi.getAll(token);
      setDiscounts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch discounts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [getToken]);

  const handleCreate = async (data: {
    code: string;
    discount_percent: number;
    is_active: boolean;
    expires_at: string | null;
    max_uses: number | null;
  }) => {
    const token = await getToken();
    if (!token) return;
    await discountsApi.create(data, token);
    setShowModal(false);
    await fetchDiscounts();
  };

  const handleUpdate = async (data: {
    code: string;
    discount_percent: number;
    is_active: boolean;
    expires_at: string | null;
    max_uses: number | null;
  }) => {
    if (!editingDiscount) return;
    const token = await getToken();
    if (!token) return;
    await discountsApi.update(editingDiscount.id, data, token);
    setEditingDiscount(null);
    setShowModal(false);
    await fetchDiscounts();
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await discountsApi.delete(id, token);
      setDeleteId(null);
      await fetchDiscounts();
    } catch (err) {
      console.error("Failed to delete discount:", err);
    }
  };

  const openCreate = () => {
    setEditingDiscount(null);
    setShowModal(true);
  };

  const openEdit = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDiscount(null);
  };

  const isExpired = (d: DiscountCode) =>
    d.expires_at && new Date(d.expires_at) < new Date();

  const isMaxedOut = (d: DiscountCode) =>
    d.max_uses !== null && d.current_uses >= d.max_uses;

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="page-title mb-0">Discount Codes</h1>
        <button onClick={openCreate} className="btn-primary">
          + Create Discount
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-dark">{discounts.length}</p>
          <p className="text-sm text-medium">Total Codes</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-success">
            {discounts.filter((d) => d.is_active && !isExpired(d)).length}
          </p>
          <p className="text-sm text-medium">Active</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-error">
            {discounts.filter((d) => !d.is_active || isExpired(d)).length}
          </p>
          <p className="text-sm text-medium">Inactive / Expired</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-primary">
            {discounts.reduce((sum, d) => sum + d.current_uses, 0)}
          </p>
          <p className="text-sm text-medium">Total Uses</p>
        </div>
      </div>

      {/* Discount List */}
      {discounts.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-border mx-auto mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">
            No discount codes yet
          </h2>
          <p className="text-medium mb-6">
            Create your first discount code to get started.
          </p>
          <button onClick={openCreate} className="btn-primary">
            + Create Discount
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {discounts.map((discount) => {
            const expired = isExpired(discount);
            const maxedOut = isMaxedOut(discount);
            const inactive = !discount.is_active || expired || maxedOut;

            return (
              <div
                key={discount.id}
                className={`card p-5 ${inactive ? "opacity-60" : ""}`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Code & Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-lg font-bold text-dark bg-light px-3 py-1 rounded-lg">
                        {discount.code}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {discount.discount_percent}% OFF
                      </span>
                      {/* Status badges */}
                      {!discount.is_active && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Disabled
                        </span>
                      )}
                      {expired && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Expired
                        </span>
                      )}
                      {maxedOut && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Max Used
                        </span>
                      )}
                      {discount.is_active && !expired && !maxedOut && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-medium">
                      <span>
                        Uses: {discount.current_uses}
                        {discount.max_uses !== null
                          ? ` / ${discount.max_uses}`
                          : " (unlimited)"}
                      </span>
                      {discount.expires_at && (
                        <span>
                          Expires:{" "}
                          {new Date(discount.expires_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                      <span>
                        Created:{" "}
                        {new Date(discount.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(discount)}
                      className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(discount.id)}
                      className="px-4 py-2 text-sm font-medium text-error border border-error rounded-lg hover:bg-error hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        title={editingDiscount ? "Edit Discount Code" : "Create Discount Code"}
      >
        <DiscountForm
          discount={editingDiscount}
          onSubmit={editingDiscount ? handleUpdate : handleCreate}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Discount Code"
      >
        <p className="text-medium mb-6">
          Are you sure you want to delete this discount code? This action cannot
          be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 bg-error text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
