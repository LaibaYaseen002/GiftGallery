"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Order } from "@/types";
import { ordersApi } from "@/lib/api";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await ordersApi.getAll(token);
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [getToken]);

  if (!isLoaded || loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (!user) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Not Signed In</h1>
        <p className="text-medium mb-6">Please sign in to view your profile.</p>
        <Link href="/sign-in" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  );
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  ).length;
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card p-4 sm:p-6 text-center">
            {/* Avatar */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto mb-3 sm:mb-4 overflow-hidden border-4 border-primary/20 relative">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.fullName || "Avatar"}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {(user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || "U").toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Name & Email */}
            <h2 className="text-base sm:text-xl font-bold text-dark">
              {user.fullName || "User"}
            </h2>
            <p className="text-medium text-sm mt-1">
              {user.emailAddresses[0]?.emailAddress}
            </p>

            {/* Member Since */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-medium">Member since</p>
              <p className="text-sm font-medium text-dark">
                {new Date(user.createdAt!).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Quick Links */}
            <div className="mt-4 space-y-2">
              <Link
                href="/orders"
                className="btn-secondary w-full block text-center text-sm"
              >
                View All Orders
              </Link>
              <Link
                href="/wishlist"
                className="btn-secondary w-full block text-center text-sm"
              >
                My Wishlist
              </Link>
            </div>
          </div>
        </div>

        {/* Stats & Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="card p-3 sm:p-4 text-center">
              <p className="text-lg sm:text-2xl font-bold text-primary">
                {orders.length}
              </p>
              <p className="text-sm text-medium">Total Orders</p>
            </div>
            <div className="card p-3 sm:p-4 text-center">
              <p className="text-lg sm:text-2xl font-bold text-success">
                {deliveredOrders}
              </p>
              <p className="text-sm text-medium">Delivered</p>
            </div>
            <div className="card p-3 sm:p-4 text-center">
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {pendingOrders}
              </p>
              <p className="text-sm text-medium">In Progress</p>
            </div>
            <div className="card p-3 sm:p-4 text-center">
              <p className="text-lg sm:text-2xl font-bold text-accent">
                ${totalSpent.toFixed(2)}
              </p>
              <p className="text-sm text-medium">Total Spent</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-dark">Recent Orders</h2>
              {orders.length > 3 && (
                <Link
                  href="/orders"
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  View All
                </Link>
              )}
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-medium mb-4">
                  You haven&apos;t placed any orders yet.
                </p>
                <Link href="/products" className="btn-primary text-sm">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between py-3 border-b border-border last:border-b-0 hover:bg-light -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-dark text-sm">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="text-xs text-medium">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <span className="font-medium text-primary">
                      ${Number(order.total_amount).toFixed(2)}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Account Info */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark mb-4">
              Account Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-medium mb-1">First Name</p>
                <p className="text-dark font-medium">
                  {user.firstName || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-medium mb-1">Last Name</p>
                <p className="text-dark font-medium">
                  {user.lastName || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-medium mb-1">Email</p>
                <p className="text-dark font-medium">
                  {user.emailAddresses[0]?.emailAddress || "—"}
                </p>
              </div>
              <div>
                <p className="text-sm text-medium mb-1">Username</p>
                <p className="text-dark font-medium">
                  {user.username || "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-medium mt-4">
              To update your account details, click your avatar in the top
              right corner and select &quot;Manage Account&quot;.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
