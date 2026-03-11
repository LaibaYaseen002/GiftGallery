"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { Order, ReturnRequest } from "@/types";
import { ordersApi, returnsApi } from "@/lib/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import ReturnRequestForm from "@/components/returns/ReturnRequestForm";
import ReturnStatusBadge from "@/components/returns/ReturnStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLanguage } from "@/context/LanguageContext";

function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isSuccess = searchParams.get("success") === "true";
  const { getToken } = useAuth();
  const { formatPrice } = useLanguage();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [returnRequest, setReturnRequest] = useState<ReturnRequest | null>(null);
  const [showReturnForm, setShowReturnForm] = useState(false);

  const fetchReturnRequest = useCallback(async (token: string) => {
    try {
      const res = await returnsApi.getAll(token);
      const match = res.data.find((r: ReturnRequest) => r.order_id === id);
      setReturnRequest(match || null);
    } catch {
      // No return request exists — that's fine
    }
  }, [id]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await ordersApi.getById(id, token);
        setOrder(res.data as Order);
        await fetchReturnRequest(token);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, getToken, fetchReturnRequest]);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  if (!order) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-medium mb-4">
          This order doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link href="/orders" className="btn-primary">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Success Banner */}
      {isSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-4 mb-4 sm:mb-6 text-center">
          <h2 className="text-base sm:text-xl font-bold text-green-800 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-green-700">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
        <div>
          <Link
            href="/orders"
            className="text-xs sm:text-xs text-medium hover:text-primary mb-2 inline-block"
          >
            &larr; Back to Orders
          </Link>
          <h1 className="text-lg sm:text-2xl font-bold text-dark">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-medium mt-1">
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
        <div className="mt-4 sm:mt-0">
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card p-3 sm:p-4">
            <h2 className="text-base font-bold text-dark mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-dark">
                      {item.product_name}
                    </p>
                    <p className="text-xs text-medium">
                      {formatPrice(Number(item.price))} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-medium">
                <span>Subtotal</span>
                <span>
                  {formatPrice(
                    Number(order.total_amount) + Number(order.discount_amount)
                  )}
                </span>
              </div>
              {order.discount_code && (
                <div className="flex justify-between text-success">
                  <span>
                    Discount ({order.discount_code})
                  </span>
                  <span>-{formatPrice(Number(order.discount_amount))}</span>
                </div>
              )}
              <div className="flex justify-between text-medium">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-base font-bold">Total</span>
                <span className="text-base font-bold text-primary">
                  {formatPrice(Number(order.total_amount))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Order Timeline */}
          <OrderTimeline status={order.status} updatedAt={order.updated_at} statusHistory={order.status_history} />

          {/* Shipping Info */}
          <div className="card p-4">
            <h2 className="text-base font-bold text-dark mb-3">
              Shipping Details
            </h2>
            <div className="space-y-2 text-xs">
              <p>
                <span className="text-medium">Name:</span>{" "}
                <span className="text-dark">{order.shipping_name}</span>
              </p>
              <p>
                <span className="text-medium">Address:</span>{" "}
                <span className="text-dark">{order.shipping_address}</span>
              </p>
              <p>
                <span className="text-medium">City:</span>{" "}
                <span className="text-dark">{order.shipping_city}</span>
              </p>
              <p>
                <span className="text-medium">Phone:</span>{" "}
                <span className="text-dark">{order.shipping_phone}</span>
              </p>
            </div>
          </div>

          {/* Gift Message */}
          {order.gift_message && (
            <div className="card p-4">
              <h2 className="text-base font-bold text-dark mb-3">
                Gift Message
              </h2>
              <div className="bg-secondary border-l-4 border-accent rounded-lg p-4">
                <p
                  className={`text-base text-dark italic ${
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

          {/* Return Request Section */}
          {returnRequest ? (
            <div className="card p-4">
              <h2 className="text-base font-bold text-dark mb-3">
                Return Request
              </h2>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-medium">Status:</span>
                  <ReturnStatusBadge status={returnRequest.status} />
                </div>
                <div>
                  <p className="text-xs text-medium">Reason:</p>
                  <p className="text-xs text-dark mt-1">{returnRequest.reason}</p>
                </div>
                {returnRequest.admin_notes && (
                  <div>
                    <p className="text-xs text-medium">Admin Response:</p>
                    <p className="text-xs text-dark mt-1">{returnRequest.admin_notes}</p>
                  </div>
                )}
                <p className="text-xs text-medium">
                  Submitted{" "}
                  {new Date(returnRequest.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ) : ["delivered", "confirmed", "shipped"].includes(order.status) ? (
            <div className="card p-4">
              <h2 className="text-base font-bold text-dark mb-3">
                Request a Return
              </h2>
              {showReturnForm ? (
                <ReturnRequestForm
                  orderId={order.id}
                  onSuccess={async () => {
                    setShowReturnForm(false);
                    const token = await getToken();
                    if (token) await fetchReturnRequest(token);
                  }}
                />
              ) : (
                <div>
                  <p className="text-xs text-medium mb-3">
                    Not satisfied with your order? You can request a return.
                  </p>
                  <button
                    onClick={() => setShowReturnForm(true)}
                    className="btn-secondary w-full"
                  >
                    Request Return
                  </button>
                </div>
              )}
            </div>
          ) : null}

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/products"
              className="btn-primary w-full text-center block"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="btn-secondary w-full text-center block"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="py-22" />}>
      <OrderDetailContent />
    </Suspense>
  );
}
