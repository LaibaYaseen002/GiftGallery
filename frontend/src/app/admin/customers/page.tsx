"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { customersApi, CustomerSummary } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type SortKey = "total_spent" | "total_orders" | "last_order" | "name";

export default function AdminCustomersPage() {
  const { getToken } = useAuth();
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("total_spent");

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const res = await customersApi.getAll(token);
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [getToken]);

  const filtered = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "total_spent":
          return b.total_spent - a.total_spent;
        case "total_orders":
          return b.total_orders - a.total_orders;
        case "last_order":
          return new Date(b.last_order).getTime() - new Date(a.last_order).getTime();
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="page-title mb-1">Customer Management</h1>
          <p className="text-medium text-sm">{customers.length} customers total</p>
        </div>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field w-full"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortKey)}
          className="input-field w-full sm:w-48"
        >
          <option value="total_spent">Highest Spending</option>
          <option value="total_orders">Most Orders</option>
          <option value="last_order">Recent Activity</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Customer List */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-medium">
            {search ? "No customers match your search." : "No customers yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-2 text-xs font-medium text-medium uppercase tracking-wide">
            <div className="col-span-4">Customer</div>
            <div className="col-span-2 text-center">Orders</div>
            <div className="col-span-2 text-center">Total Spent</div>
            <div className="col-span-2 text-center">Last Order</div>
            <div className="col-span-2 text-center">Member Since</div>
          </div>

          {filtered.map((customer) => (
            <Link
              key={customer.user_id}
              href={`/admin/customers/${customer.user_id}`}
              className="card p-4 md:p-5 block hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Customer Info */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {customer.image_url ? (
                      <Image
                        src={customer.image_url}
                        alt={customer.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-semibold text-sm">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-dark truncate">{customer.name}</p>
                    <p className="text-xs text-medium truncate">{customer.email}</p>
                  </div>
                </div>

                {/* Orders */}
                <div className="col-span-2 text-center">
                  <span className="md:hidden text-xs text-medium mr-2">Orders:</span>
                  <span className="font-medium text-dark">{customer.total_orders}</span>
                </div>

                {/* Total Spent */}
                <div className="col-span-2 text-center">
                  <span className="md:hidden text-xs text-medium mr-2">Spent:</span>
                  <span className="font-semibold text-primary">
                    ${customer.total_spent.toFixed(2)}
                  </span>
                </div>

                {/* Last Order */}
                <div className="col-span-2 text-center">
                  <span className="md:hidden text-xs text-medium mr-2">Last Order:</span>
                  <span className="text-sm text-medium">
                    {new Date(customer.last_order).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Member Since */}
                <div className="col-span-2 text-center">
                  <span className="md:hidden text-xs text-medium mr-2">Member:</span>
                  <span className="text-sm text-medium">
                    {new Date(customer.member_since).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
