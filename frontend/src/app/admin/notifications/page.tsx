"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { notificationsApi } from "@/lib/api";
import { Notification } from "@/types";

export default function NotificationsPage() {
  const { getToken } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await notificationsApi.getAll(token, 100);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  async function handleMarkAllRead() {
    try {
      const token = await getToken();
      if (!token) return;
      await notificationsApi.markAllRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  }

  async function handleMarkRead(id: string) {
    try {
      const token = await getToken();
      if (!token) return;
      await notificationsApi.markRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  function getTypeIcon(type: string) {
    switch (type) {
      case "new_order": return "🛒";
      case "new_return": return "↩️";
      case "new_feedback": return "💬";
      case "new_review": return "⭐";
      default: return "🔔";
    }
  }

  function getTypeBadgeColor(type: string) {
    switch (type) {
      case "new_order": return "bg-blue-100 text-blue-700";
      case "new_return": return "bg-orange-100 text-orange-700";
      case "new_feedback": return "bg-purple-100 text-purple-700";
      case "new_review": return "bg-yellow-100 text-yellow-700";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  function getTypeLabel(type: string) {
    switch (type) {
      case "new_order": return "Order";
      case "new_return": return "Return";
      case "new_feedback": return "Feedback";
      case "new_review": return "Review";
      default: return type;
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.is_read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="page-title mb-1">Notifications</h1>
          <p className="text-medium text-xs">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "All caught up!"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary text-xs">
            Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-white text-medium hover:text-dark border border-border"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary text-white"
              : "bg-white text-medium hover:text-dark border border-border"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-3">🔔</p>
          <p className="text-medium">
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`card p-4 flex items-start gap-4 transition-colors ${
                !n.is_read ? "border-l-4 border-l-primary bg-primary/5" : ""
              }`}
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{getTypeIcon(n.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`text-xs ${!n.is_read ? "font-semibold text-dark" : "text-dark/80"}`}>
                    {n.title}
                  </h3>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getTypeBadgeColor(n.type)}`}>
                    {getTypeLabel(n.type)}
                  </span>
                  {!n.is_read && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-medium">{n.message}</p>
                <p className="text-xs text-medium/60 mt-1">{formatDate(n.created_at)}</p>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="text-xs text-primary hover:text-primary/80 font-medium flex-shrink-0 mt-1"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
