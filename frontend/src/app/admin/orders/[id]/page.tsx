"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import { ordersApi } from "@/lib/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ALL_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getToken } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesSaved, setNotesSaved] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await ordersApi.getAdminDetail(id, token);
      setOrder(res.data);
      setNotes(res.data.admin_notes || "");
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  }, [id, getToken]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const token = await getToken();
      if (!token) return;
      await ordersApi.updateStatus(id, newStatus, token);
      await fetchOrder();
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    setNotesSaved(false);
    try {
      const token = await getToken();
      if (!token) return;
      await ordersApi.updateNotes(id, notes, token);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-dark mb-2">Order not found</h2>
        <button onClick={() => router.push("/admin/orders")} className="btn-primary mt-4">
          Back to Orders
        </button>
      </div>
    );
  }

  const subtotal = Number(order.total_amount) + Number(order.discount_amount);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div>
          <Link
            href="/admin/orders"
            className="text-xs text-medium hover:text-primary transition-colors mb-2 inline-flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Back to Orders
          </Link>
          <h1 className="page-title mb-1">Order #{order.id.slice(0, 8)}</h1>
          <p className="text-xs text-medium">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <select
            value={order.status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            disabled={updatingStatus}
            className="input-field text-xs py-2 w-40"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          {updatingStatus && <LoadingSpinner size="sm" />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Items */}
          <div className="card p-5">
            <h2 className="font-semibold text-dark mb-4">
              Order Items ({order.items?.length || 0})
            </h2>
            <div className="divide-y divide-border">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-dark">{item.product_name}</p>
                    <p className="text-xs text-medium">
                      ${Number(item.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-dark">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border mt-3 pt-3 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-medium">Subtotal</span>
                <span className="text-dark">${subtotal.toFixed(2)}</span>
              </div>
              {order.discount_code && (
                <div className="flex justify-between text-xs">
                  <span className="text-success">
                    Discount ({order.discount_code})
                  </span>
                  <span className="text-success">
                    -${Number(order.discount_amount).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-1">
                <span className="text-dark">Total</span>
                <span className="text-primary">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Gift Message */}
          {order.gift_message && (
            <div className="card p-5">
              <h2 className="font-semibold text-dark mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                Gift Message
                {order.gift_font && order.gift_font !== "classic" && (
                  <span className="text-xs font-normal text-medium capitalize">({order.gift_font})</span>
                )}
              </h2>
              <div className="bg-secondary border-l-4 border-accent rounded-lg p-4">
                <p
                  className={`text-base italic ${
                    order.gift_font === "handwritten"
                      ? "font-[family-name:var(--font-dancing)]"
                      : order.gift_font === "elegant"
                      ? "font-[family-name:var(--font-great-vibes)]"
                      : order.gift_font === "playful"
                      ? "font-[family-name:var(--font-pacifico)]"
                      : "font-sans"
                  }`}
                >
                  &ldquo;{order.gift_message}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div className="card p-5">
            <h2 className="font-semibold text-dark mb-3">Admin Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field w-full h-28 resize-none"
              placeholder="Add internal notes about this order..."
            />
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="btn-primary text-xs"
              >
                {savingNotes ? "Saving..." : "Save Notes"}
              </button>
              {notesSaved && (
                <span className="text-xs text-success">Notes saved!</span>
              )}
            </div>
          </div>

          {/* Status History */}
          {order.status_history && order.status_history.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold text-dark mb-4">Status History</h2>
              <div className="space-y-3">
                {order.status_history.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.old_status && (
                          <>
                            <span className="text-medium capitalize">
                              {entry.old_status}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-medium">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </>
                        )}
                        <span className="font-medium text-dark capitalize">
                          {entry.new_status}
                        </span>
                      </div>
                      <p className="text-medium text-xs mt-0.5">
                        {new Date(entry.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Customer & Shipping */}
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="card p-5">
            <h2 className="font-semibold text-dark mb-3">Customer</h2>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-medium">Name</p>
                <p className="text-dark font-medium">{order.shipping_name}</p>
              </div>
              <div>
                <p className="text-medium">Email</p>
                <p className="text-dark font-medium">{order.user_email}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="card p-5">
            <h2 className="font-semibold text-dark mb-3">Shipping Address</h2>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-medium">Address</p>
                <p className="text-dark font-medium">{order.shipping_address}</p>
              </div>
              <div>
                <p className="text-medium">City</p>
                <p className="text-dark font-medium">{order.shipping_city}</p>
              </div>
              <div>
                <p className="text-medium">Phone</p>
                <p className="text-dark font-medium">{order.shipping_phone}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-5">
            <h2 className="font-semibold text-dark mb-3">Order Summary</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-medium">Order ID</span>
                <span className="text-dark font-mono text-xs">{order.id.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Status</span>
                <span className="text-dark capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Items</span>
                <span className="text-dark">{order.items?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Total</span>
                <span className="text-dark font-bold">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
              {order.discount_code && (
                <div className="flex justify-between">
                  <span className="text-medium">Discount</span>
                  <span className="text-success">{order.discount_code}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-medium">Created</span>
                <span className="text-dark">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium">Updated</span>
                <span className="text-dark">
                  {new Date(order.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
