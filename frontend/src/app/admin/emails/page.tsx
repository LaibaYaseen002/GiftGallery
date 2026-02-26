"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { emailsApi } from "@/lib/api";
import { SentEmail } from "@/types";

export default function EmailsPage() {
  const { getToken } = useAuth();
  const [tab, setTab] = useState<"compose" | "history">("compose");
  const [history, setHistory] = useState<SentEmail[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Compose form
  const [toEmail, setToEmail] = useState("");
  const [toName, setToName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (tab === "history") fetchHistory();
  }, [tab]);

  async function fetchHistory() {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;
      const res = await emailsApi.getHistory(token);
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch email history:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSending(true);

    try {
      const token = await getToken();
      if (!token) return;

      await emailsApi.send(
        { to_email: toEmail, to_name: toName || undefined, subject, message },
        token
      );

      setSuccess("Email sent successfully!");
      setToEmail("");
      setToName("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
    } finally {
      setSending(false);
    }
  }

  function getTypeBadge(type: string) {
    switch (type) {
      case "custom":
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Custom</span>;
      case "feedback_reply":
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Feedback Reply</span>;
      default:
        return <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{type}</span>;
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="page-title mb-1">Email Management</h1>
        <p className="text-medium text-sm">Send emails to customers and view sent history</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("compose")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "compose"
              ? "bg-primary text-white"
              : "bg-white text-medium hover:text-dark border border-border"
          }`}
        >
          Compose Email
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "history"
              ? "bg-primary text-white"
              : "bg-white text-medium hover:text-dark border border-border"
          }`}
        >
          Sent History
        </button>
      </div>

      {/* Compose Tab */}
      {tab === "compose" && (
        <div className="card p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-dark mb-4">Compose New Email</h2>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Recipient Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  required
                  className="input-field"
                  placeholder="customer@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Subject <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="input-field"
                placeholder="Email subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={8}
                className="input-field resize-y"
                placeholder="Write your message here..."
              />
              <p className="text-xs text-medium mt-1">
                The email will be sent with Gift Gallery branding.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={sending}
                className="btn-primary disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Email"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setToEmail(""); setToName(""); setSubject(""); setMessage("");
                  setSuccess(""); setError("");
                }}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Tab */}
      {tab === "history" && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : history.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-4xl mb-3">📧</p>
              <p className="text-medium">No emails sent yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((email) => (
                <div key={email.id} className="card p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h3 className="font-medium text-dark text-sm truncate">
                        {email.subject}
                      </h3>
                      {getTypeBadge(email.type)}
                    </div>
                    <span className="text-xs text-medium flex-shrink-0">
                      {formatDate(email.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-medium mb-2">
                    <span>
                      To: <span className="text-dark">{email.to_name ? `${email.to_name} (${email.to_email})` : email.to_email}</span>
                    </span>
                  </div>
                  <p className="text-sm text-medium line-clamp-2">{email.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
