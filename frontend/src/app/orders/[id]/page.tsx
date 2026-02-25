"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Suspense } from "react";
import { Order } from "@/types";
import { ordersApi } from "@/lib/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import OrderTimeline from "@/components/orders/OrderTimeline";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function OrderDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const isSuccess = searchParams.get("success") === "true";
  const { getToken } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await ordersApi.getById(id, token);
        setOrder(res.data as Order);
      } catch (err) {
        console.error("Failed to fetch order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, getToken]);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (!order) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Order Not Found</h1>
        <p className="text-medium mb-6">
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
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Order Placed Successfully!
          </h2>
          <p className="text-green-700">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <Link
            href="/orders"
            className="text-sm text-medium hover:text-primary mb-2 inline-block"
          >
            &larr; Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-dark">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-dark">
                      {item.product_name}
                    </p>
                    <p className="text-sm text-medium">
                      ${Number(item.price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-border mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-medium">
                <span>Subtotal</span>
                <span>
                  $
                  {(
                    Number(order.total_amount) + Number(order.discount_amount)
                  ).toFixed(2)}
                </span>
              </div>
              {order.discount_code && (
                <div className="flex justify-between text-success">
                  <span>
                    Discount ({order.discount_code})
                  </span>
                  <span>-${Number(order.discount_amount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-medium">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-primary">
                  ${Number(order.total_amount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Timeline */}
          <OrderTimeline status={order.status} updatedAt={order.updated_at} />

          {/* Shipping Info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark mb-3">
              Shipping Details
            </h2>
            <div className="space-y-2 text-sm">
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
            <div className="card p-6">
              <h2 className="text-lg font-bold text-dark mb-3">
                Gift Message
              </h2>
              <p className="text-medium text-sm italic">
                &ldquo;{order.gift_message}&rdquo;
              </p>
            </div>
          )}

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
    <Suspense fallback={<LoadingSpinner size="lg" className="py-32" />}>
      <OrderDetailContent />
    </Suspense>
  );
}
