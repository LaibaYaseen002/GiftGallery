"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { ReturnRequest, ReturnStatus } from "@/types";
import { returnsApi } from "@/lib/api";
import ReturnRequestCard from "@/components/admin/ReturnRequestCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminReturnsPage() {
  const { getToken } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | ReturnStatus>("all");

  const fetchReturns = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await returnsApi.getAllAdmin(token);
      setReturns(res.data || []);
    } catch (err) {
      console.error("Failed to fetch returns:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleUpdateStatus = async (
    id: string,
    status: string,
    adminNotes: string
  ) => {
    try {
      const token = await getToken();
      if (!token) return;
      await returnsApi.updateStatus(id, { status, admin_notes: adminNotes }, token);
      await fetchReturns();
    } catch (err) {
      console.error("Failed to update return status:", err);
    }
  };

  const filteredReturns =
    filter === "all"
      ? returns
      : returns.filter((r) => r.status === filter);

  const counts = {
    all: returns.length,
    pending: returns.filter((r) => r.status === "pending").length,
    approved: returns.filter((r) => r.status === "approved").length,
    rejected: returns.filter((r) => r.status === "rejected").length,
    refunded: returns.filter((r) => r.status === "refunded").length,
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div>
      <h1 className="page-title">Return Requests</h1>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "approved", "rejected", "refunded"] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab
                  ? "bg-primary text-white"
                  : "bg-white text-medium border border-border hover:bg-light"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({counts[tab]})
            </button>
          )
        )}
      </div>

      {/* Return Requests List */}
      {filteredReturns.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-border mx-auto mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
            />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">
            No return requests
          </h2>
          <p className="text-medium">
            {filter === "all"
              ? "No return requests have been submitted yet."
              : `No ${filter} return requests found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReturns.map((returnReq) => (
            <ReturnRequestCard
              key={returnReq.id}
              returnRequest={returnReq}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
