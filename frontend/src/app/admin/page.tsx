"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { AnalyticsData } from "@/types";
import { analyticsApi } from "@/lib/api";
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await analyticsApi.getDashboard(token);
        setAnalytics(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [getToken]);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (!analytics) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Failed to Load Dashboard</h1>
        <p className="text-medium">Could not load analytics data. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <AnalyticsCards data={analytics} />

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-yellow-600">{analytics.pending_orders}</p>
          <p className="text-sm text-medium">Pending Orders</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-success">{analytics.delivered_orders}</p>
          <p className="text-sm text-medium">Delivered</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xl font-bold text-error">{analytics.pending_returns}</p>
          <p className="text-sm text-medium">Pending Returns</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary hover:text-primary-dark">
              View All
            </Link>
          </div>
          {analytics.recent_orders.length === 0 ? (
            <p className="text-medium text-sm py-4">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.recent_orders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-dark">
                      {order.shipping_name}
                    </p>
                    <p className="text-xs text-medium">{order.user_email}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <OrderStatusBadge status={order.status as import("@/types").OrderStatus} />
                    <span className="text-sm font-medium">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark">Top Selling Products</h2>
            <Link href="/admin/products" className="text-sm text-primary hover:text-primary-dark">
              Manage Products
            </Link>
          </div>
          {analytics.top_products.length === 0 ? (
            <p className="text-medium text-sm py-4">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.top_products.map((product, index) => (
                <div
                  key={product.product_name}
                  className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-dark">
                      {product.product_name}
                    </span>
                  </div>
                  <span className="text-sm text-medium">
                    {product.total_sold} sold
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
        <Link href="/admin/products" className="card p-4 text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-primary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="text-sm font-medium text-dark">Products</p>
        </Link>
        <Link href="/admin/orders" className="card p-4 text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-accent">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <p className="text-sm font-medium text-dark">Orders</p>
        </Link>
        <Link href="/admin/discounts" className="card p-4 text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-success">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <p className="text-sm font-medium text-dark">Discounts</p>
        </Link>
        <Link href="/admin/returns" className="card p-4 text-center hover:shadow-lg transition-shadow">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mx-auto mb-2 text-error">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
          <p className="text-sm font-medium text-dark">Returns</p>
        </Link>
      </div>
    </div>
  );
}
