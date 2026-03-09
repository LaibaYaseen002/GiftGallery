"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingSession } from "@/types";
import { socialShoppingApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ShopTogetherPage() {
  const { getToken, isSignedIn } = useAuth();
  const router = useRouter();

  const [sessions, setSessions] = useState<ShoppingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchSessions = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await socialShoppingApi.getMySessions(token);
      setSessions(res.data || []);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchSessions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) return;
      const res = await socialShoppingApi.createSession(
        { title: sessionTitle || undefined },
        token
      );
      setShowCreateForm(false);
      setSessionTitle("");
      router.push(`/shop-together/${res.data.session_code}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create session");
    } finally {
      setCreating(false);
    }
  };

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (joinCode.trim()) {
      router.push(`/shop-together/${joinCode.trim()}`);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#B76E79" }}>
          Shop Together
        </h1>
        <p className="text-gray-600 mb-6">
          Please sign in to use the social shopping feature.
        </p>
        <Link href="/sign-in" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  const activeSessions = sessions.filter((s) => s.is_active);
  const endedSessions = sessions.filter((s) => !s.is_active);

  return (
    <div className="container-custom py-10">
      {/* Hero Section */}
      <div
        className="rounded-2xl p-8 md:p-12 mb-10 text-center"
        style={{
          background: "linear-gradient(135deg, #FFF8F0 0%, #f9e8e0 50%, #FFF8F0 100%)",
          border: "1px solid #B76E7930",
        }}
      >
        <h1
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#B76E79" }}
        >
          Shop Together
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-2 text-lg">
          Browse gifts with friends and family in real time. Create a session,
          share the code, and explore products together while chatting and
          sharing your favorites.
        </p>
        <p className="text-gray-500 text-sm max-w-xl mx-auto">
          Perfect for picking group gifts, planning events, or simply getting a
          second opinion on your choices.
        </p>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Create Session */}
        <div className="card p-6">
          <h2
            className="text-xl font-semibold mb-3"
            style={{ color: "#B76E79" }}
          >
            Create a Session
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Start a new shopping session and invite others with a unique code.
          </p>

          {showCreateForm ? (
            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Title (optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Birthday Gift Ideas for Sarah"
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Session"}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setError("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              className="btn-primary w-full"
              onClick={() => setShowCreateForm(true)}
            >
              Create Session
            </button>
          )}
        </div>

        {/* Join Session */}
        <div className="card p-6">
          <h2
            className="text-xl font-semibold mb-3"
            style={{ color: "#B76E79" }}
          >
            Join a Session
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Enter a session code shared by a friend to start shopping together.
          </p>
          <form onSubmit={handleJoinSession} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Code
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter session code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-secondary w-full">
              Join Session
            </button>
          </form>
        </div>
      </div>

      {/* My Sessions */}
      <div>
        <h2
          className="text-2xl font-bold mb-6"
          style={{ color: "#B76E79" }}
        >
          My Sessions
        </h2>

        {loading ? (
          <LoadingSpinner />
        ) : sessions.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-gray-500">
              You have not created or joined any sessions yet. Start one above!
            </p>
          </div>
        ) : (
          <>
            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Active Sessions
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            )}

            {/* Ended Sessions */}
            {endedSessions.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Past Sessions
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {endedSessions.map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: ShoppingSession }) {
  const participantCount = session.participants?.length || 0;
  const createdDate = new Date(session.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link href={`/shop-together/${session.session_code}`}>
      <div
        className="card p-5 hover:shadow-lg transition-shadow cursor-pointer"
        style={{
          borderLeft: session.is_active
            ? "4px solid #B76E79"
            : "4px solid #d1d5db",
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-semibold text-gray-800 truncate pr-2">
            {session.title || "Untitled Session"}
          </h4>
          <span
            className="text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: session.is_active ? "#B76E7920" : "#f3f4f6",
              color: session.is_active ? "#B76E79" : "#6b7280",
            }}
          >
            {session.is_active ? "Active" : "Ended"}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
            <span className="font-mono text-xs" style={{ color: "#D4A853" }}>
              {session.session_code}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>
              {participantCount} participant{participantCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{createdDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
