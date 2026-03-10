"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { customersApi, CustomerDetail } from "@/lib/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminCustomerDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const router = useRouter();
  const { getToken } = useAuth();

  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "returns" | "reviews">("orders");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await customersApi.getById(userId, token);
        setCustomer(res.data);
      } catch (err) {
        console.error("Failed to fetch customer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId, getToken]);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  if (!customer) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-dark mb-2">Customer not found</h2>
        <button onClick={() => router.push("/admin/customers")} className="btn-primary mt-4">
          Back to Customers
        </button>
      </div>
    );
  }

  const tabs = [
    { key: "orders" as const, label: "Orders", count: customer.stats.total_orders },
    { key: "returns" as const, label: "Returns", count: customer.stats.total_returns },
    { key: "reviews" as const, label: "Reviews", count: customer.stats.total_reviews },
  ];

  return (
    <div>
      {/* Header */}
      <Link
        href="/admin/customers"
        className="text-xs text-medium hover:text-primary transition-colors mb-4 inline-flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Customers
      </Link>

      {/* Profile + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Profile Card */}
        <div className="card p-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
              {customer.image_url ? (
                <Image
                  src={customer.image_url}
                  alt={customer.name}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-lg font-bold text-dark">{customer.name}</h1>
              <p className="text-xs text-medium">{customer.email}</p>
            </div>
          </div>
          <div className="text-xs text-medium">
            <p>
              Member since{" "}
              {customer.member_since
                ? new Date(customer.member_since).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-primary">{customer.stats.total_orders}</p>
            <p className="text-xs text-medium mt-1">Total Orders</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-primary">
              ${customer.stats.total_spent.toFixed(2)}
            </p>
            <p className="text-xs text-medium mt-1">Total Spent</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-primary">
              ${customer.stats.avg_order_value.toFixed(2)}
            </p>
            <p className="text-xs text-medium mt-1">Avg. Order</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-xl font-bold text-primary">{customer.stats.total_reviews}</p>
            <p className="text-xs text-medium mt-1">Reviews</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "bg-white text-medium border border-border hover:bg-light"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "orders" && (
        <div className="space-y-2">
          {customer.orders.length === 0 ? (
            <div className="card p-4 text-center text-medium">No orders found.</div>
          ) : (
            customer.orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="card p-4 block hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-dark">
                        Order #{order.id.slice(0, 8)}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-medium">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                      {" · "}
                      {order.shipping_city}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ${Number(order.total_amount).toFixed(2)}
                    </p>
                    {order.discount_code && (
                      <p className="text-xs text-success">{order.discount_code}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {activeTab === "returns" && (
        <div className="space-y-2">
          {customer.returns.length === 0 ? (
            <div className="card p-4 text-center text-medium">No return requests.</div>
          ) : (
            customer.returns.map((ret) => (
              <div key={ret.id} className="card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-dark">
                        Order #{ret.order_id.slice(0, 8)}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          ret.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : ret.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : ret.status === "refunded"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ret.status.charAt(0).toUpperCase() + ret.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-xs text-medium">{ret.reason}</p>
                    <p className="text-xs text-medium mt-1">
                      {new Date(ret.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-2">
          {customer.reviews.length === 0 ? (
            <div className="card p-4 text-center text-medium">No reviews yet.</div>
          ) : (
            customer.reviews.map((review) => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={star <= review.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={star <= review.rating ? 0 : 1.5}
                        className={`w-4 h-4 ${
                          star <= review.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-medium">
                    {new Date(review.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-xs text-dark">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
