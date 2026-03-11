"use client";

import { useState } from "react";
import { ReturnRequest } from "@/types";
import ReturnStatusBadge from "@/components/returns/ReturnStatusBadge";
import { useLanguage } from "@/context/LanguageContext";

interface ReturnRequestCardProps {
  returnRequest: ReturnRequest;
  onUpdateStatus: (
    id: string,
    status: string,
    adminNotes: string
  ) => Promise<void>;
}

export default function ReturnRequestCard({
  returnRequest,
  onUpdateStatus,
}: ReturnRequestCardProps) {
  const { formatPrice } = useLanguage();
  const [adminNotes, setAdminNotes] = useState(returnRequest.admin_notes || "");
  const [loading, setLoading] = useState(false);

  const handleAction = async (status: string) => {
    setLoading(true);
    try {
      await onUpdateStatus(returnRequest.id, status, adminNotes);
    } finally {
      setLoading(false);
    }
  };

  const order = returnRequest.order as unknown as Record<string, unknown> | null;

  return (
    <div className="card p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-dark">
              Return #{returnRequest.id.slice(0, 8)}
            </h3>
            <ReturnStatusBadge status={returnRequest.status} />
          </div>
          <p className="text-sm text-medium">
            Order #{returnRequest.order_id.slice(0, 8)}
            {order && (
              <span>
                {" "}&middot; {String(order.user_email || "")}
                {" "}&middot; {formatPrice(Number(order.total_amount || 0))}
              </span>
            )}
          </p>
          <p className="text-xs text-medium mt-1">
            Submitted{" "}
            {new Date(returnRequest.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Reason */}
      <div className="bg-light rounded-lg p-4 mb-4">
        <p className="text-sm font-medium text-dark mb-1">Customer Reason:</p>
        <p className="text-sm text-medium">{returnRequest.reason}</p>
      </div>

      {/* Admin Notes & Actions */}
      {returnRequest.status === "pending" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-dark mb-1">
              Admin Notes (optional)
            </label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this return..."
              rows={2}
              className="input-field resize-none text-sm"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleAction("approved")}
              disabled={loading}
              className="flex-1 bg-success text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "..." : "Approve"}
            </button>
            <button
              onClick={() => handleAction("rejected")}
              disabled={loading}
              className="flex-1 bg-error text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "..." : "Reject"}
            </button>
            <button
              onClick={() => handleAction("refunded")}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "..." : "Refund"}
            </button>
          </div>
        </div>
      )}

      {/* Show admin notes for processed requests */}
      {returnRequest.status !== "pending" && returnRequest.admin_notes && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</p>
          <p className="text-sm text-blue-700">{returnRequest.admin_notes}</p>
        </div>
      )}
    </div>
  );
}
