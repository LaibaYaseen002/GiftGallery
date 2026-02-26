"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Feedback } from "@/types";
import { feedbackApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminFeedbackPage() {
  const { getToken } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");

  const fetchFeedback = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await feedbackApi.getAll(token);
      setFeedbacks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [getToken]);

  const handleMarkRead = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await feedbackApi.markRead(id, token);
      await fetchFeedback();
    } catch (err) {
      console.error("Failed to mark feedback as read:", err);
    }
  };

  const filteredFeedbacks =
    filter === "all"
      ? feedbacks
      : filter === "unread"
      ? feedbacks.filter((f) => !f.is_read)
      : feedbacks.filter((f) => f.is_read);

  const unreadCount = feedbacks.filter((f) => !f.is_read).length;

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="page-title mb-0">
          Customer Feedback
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {unreadCount} new
            </span>
          )}
        </h1>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "unread", "read"] as const).map((tab) => {
          const count =
            tab === "all"
              ? feedbacks.length
              : tab === "unread"
              ? unreadCount
              : feedbacks.length - unreadCount;
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === tab
                  ? "bg-primary text-white"
                  : "bg-white text-medium border border-border hover:bg-light"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({count})
            </button>
          );
        })}
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
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
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">No feedback</h2>
          <p className="text-medium">
            {filter === "all"
              ? "No customer feedback has been submitted yet."
              : `No ${filter} feedback found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFeedbacks.map((fb) => (
            <div
              key={fb.id}
              className={`card p-5 ${!fb.is_read ? "border-l-4 border-l-primary" : ""}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-dark">{fb.subject}</h3>
                    {!fb.is_read && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-3 text-sm text-medium mb-3">
                    <span className="font-medium">{fb.name}</span>
                    <span>{fb.email}</span>
                    <span>
                      {new Date(fb.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-dark leading-relaxed">
                    {fb.message}
                  </p>
                </div>

                {!fb.is_read && (
                  <button
                    onClick={() => handleMarkRead(fb.id)}
                    className="px-3 py-1.5 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors flex-shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
