"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { AnalyticsData, ChartDataPoint, CategoryBreakdownItem, ActivityEvent } from "@/types";
import { analyticsApi } from "@/lib/api";
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import RevenueChart from "@/components/admin/RevenueChart";
import CategoryBreakdown from "@/components/admin/CategoryBreakdown";
import ActivityFeed from "@/components/admin/ActivityFeed";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdownItem[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d">("7d");
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async (period: "7d" | "30d" = chartPeriod) => {
    try {
      const token = await getToken();
      if (!token) return;

      const [dashRes, chartRes, catRes, actRes] = await Promise.all([
        analyticsApi.getDashboard(token),
        analyticsApi.getChart(token, period),
        analyticsApi.getCategories(token),
        analyticsApi.getActivity(token),
      ]);

      setAnalytics(dashRes.data);
      setChartData(chartRes.data || []);
      setCategoryData(catRes.data || []);
      setActivity(actRes.data || []);
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getToken]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handlePeriodChange = (period: "7d" | "30d") => {
    setChartPeriod(period);
    const fetchChart = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await analyticsApi.getChart(token, period);
        setChartData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch chart:", err);
      }
    };
    fetchChart();
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (!analytics) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Failed to Load Dashboard</h1>
        <p className="text-medium">Could not load analytics data. Please try again.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Admin Dashboard</h1>

      {/* Stats Cards */}
      <AnalyticsCards data={analytics} />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-8">
        <Link href="/admin/orders?filter=pending" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-600">{analytics.pending_orders}</p>
              <p className="text-xs text-medium mt-1">Pending Orders</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/orders?filter=delivered" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-success">{analytics.delivered_orders}</p>
              <p className="text-xs text-medium mt-1">Delivered</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/returns" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-error">{analytics.pending_returns}</p>
              <p className="text-xs text-medium mt-1">Pending Returns</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-error">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            </div>
          </div>
        </Link>
        <Link href="/admin/feedback" className="card p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">{analytics.unread_feedback}</p>
              <p className="text-xs text-medium mt-1">Unread Feedback</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Revenue Chart + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart
          data={chartData}
          period={chartPeriod}
          onPeriodChange={handlePeriodChange}
        />
        <ActivityFeed events={activity} />
      </div>

      {/* Category Breakdown + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <CategoryBreakdown data={categoryData} />

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
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between py-2 border-b border-border last:border-b-0 hover:bg-light -mx-2 px-2 rounded transition-colors"
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
                </Link>
              ))}
            </div>
          )}
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {analytics.top_products.map((product, index) => (
              <div
                key={product.product_name}
                className="flex items-center gap-3 p-3 rounded-lg bg-light"
              >
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-dark truncate">
                    {product.product_name}
                  </p>
                  <p className="text-xs text-medium">{product.total_sold} sold</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
