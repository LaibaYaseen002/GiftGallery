"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { AnalyticsData, ChartDataPoint, CategoryBreakdownItem, ActivityEvent } from "@/types";
import { analyticsApi } from "@/lib/api";
import AnalyticsCards from "@/components/admin/AnalyticsCards";
import RevenueChart from "@/components/admin/RevenueChart";
import CategoryBreakdown from "@/components/admin/CategoryBreakdown";
import ActivityFeed from "@/components/admin/ActivityFeed";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

const avatarColors = [
  "bg-primary text-white",
  "bg-accent text-white",
  "bg-success text-white",
  "bg-blue-500 text-white",
  "bg-purple-500 text-white",
];

function TrophyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-2.27.797m0 0a6.003 6.003 0 01-2.27-.797" />
    </svg>
  );
}

const medalGradients = [
  "from-[#FFD700] to-[#FFA500]", // gold
  "from-[#C0C0C0] to-[#A0A0A0]", // silver
  "from-[#CD7F32] to-[#A0522D]", // bronze
];

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryBreakdownItem[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d">("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async (period: "7d" | "30d" = chartPeriod) => {
    try {
      const token = await getToken();
      if (!token) {
        setError("No auth token available. Please sign in again.");
        setLoading(false);
        return;
      }

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
      setError(err instanceof Error ? err.message : "Unknown error");
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
        <p className="text-medium mb-4">Could not load analytics data. Please try again.</p>
        {error && (
          <p className="text-error text-sm bg-error/10 inline-block px-4 py-2 rounded-lg">{error}</p>
        )}
        <div className="mt-4">
          <button onClick={() => { setLoading(true); setError(null); fetchAll(); }} className="btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#B76E79] via-[#9A4C5A] to-[#D4A853] p-6 mb-6 text-white">
        {/* Decorative circles */}
        <div className="absolute top-4 right-10 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">{todayStr}</p>
          <h1 className="text-2xl font-bold mb-1">
            {getGreeting()}, {user?.firstName || "Admin"}!
          </h1>
          <p className="text-white/80 text-sm">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <AnalyticsCards data={analytics} />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 mb-8">
        <Link href="/admin/orders?filter=pending" className="card p-4 border-l-4 border-l-yellow-400 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
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
        <Link href="/admin/orders?filter=delivered" className="card p-4 border-l-4 border-l-success hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
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
        <Link href="/admin/returns" className="card p-4 border-l-4 border-l-error hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
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
        <Link href="/admin/feedback" className="card p-4 border-l-4 border-l-blue-400 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
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
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h2 className="text-lg font-bold text-dark">Recent Orders</h2>
            </div>
            <Link href="/admin/orders" className="text-sm text-primary hover:text-primary-dark">
              View All
            </Link>
          </div>
          {analytics.recent_orders.length === 0 ? (
            <p className="text-medium text-sm py-4">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.recent_orders.map((order) => {
                const name = order.shipping_name || "";
                const initial = name.charAt(0).toUpperCase() || "?";
                const colorIdx = name.charCodeAt(0) % 5;
                return (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between py-2 border-b border-border last:border-b-0 hover:bg-light -mx-2 px-2 rounded transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${avatarColors[colorIdx]}`}>
                        {initial}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-dark">
                          {order.shipping_name}
                        </p>
                        <p className="text-xs text-medium">{order.user_email}</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <OrderStatusBadge status={order.status as import("@/types").OrderStatus} />
                      <span className="text-sm font-medium">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <h2 className="text-lg font-bold text-dark">Top Selling Products</h2>
          </div>
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
                className="flex items-center gap-3 p-3 rounded-lg bg-light hover:bg-border/50 transition-colors"
              >
                {index < 3 ? (
                  <span className={`w-7 h-7 rounded-full bg-gradient-to-br ${medalGradients[index]} text-white text-xs font-bold flex items-center justify-center shrink-0`}>
                    <TrophyIcon />
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                )}
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
