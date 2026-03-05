"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ShoppingSession, SessionMessage, Product } from "@/types";
import { socialShoppingApi, productsApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ShopTogetherSessionPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const { getToken, isSignedIn, userId } = useAuth();
  const { user } = useUser();
  const { addItem } = useCart();

  const [session, setSession] = useState<ShoppingSession | null>(null);
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [needsJoin, setNeedsJoin] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch session info
  const fetchSession = async () => {
    try {
      const res = await socialShoppingApi.getSession(code);
      setSession(res.data);

      // Check if current user is a participant
      if (userId && res.data.participants) {
        const isParticipant = res.data.participants.some(
          (p) => p.user_id === userId
        );
        const isHost = res.data.host_id === userId;
        if (!isParticipant && !isHost) {
          setNeedsJoin(true);
        }
      }
    } catch (err) {
      setError("Session not found or could not be loaded.");
      console.error("Failed to fetch session:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await socialShoppingApi.getMessages(code, token);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  };

  // Fetch products
  const fetchProducts = async (search?: string) => {
    setSearchLoading(true);
    try {
      const res = await productsApi.getAll({
        search: search || undefined,
        limit: 12,
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchSession();
      fetchMessages();
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, code]);

  // Poll for messages every 3 seconds
  useEffect(() => {
    if (!isSignedIn || needsJoin || !session?.is_active) return;

    intervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, needsJoin, session?.is_active]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleJoinSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoining(true);
    try {
      const token = await getToken();
      if (!token) return;
      await socialShoppingApi.joinSession(
        code,
        { display_name: displayName || user?.firstName || "Guest" },
        token
      );
      setNeedsJoin(false);
      fetchSession();
      fetchMessages();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to join session"
      );
    } finally {
      setJoining(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setSendingMessage(true);
    try {
      const token = await getToken();
      if (!token) return;
      await socialShoppingApi.sendMessage(
        code,
        { message: messageInput.trim(), message_type: "text" },
        token
      );
      setMessageInput("");
      fetchMessages();
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleShareProduct = async (product: Product) => {
    try {
      const token = await getToken();
      if (!token) return;
      await socialShoppingApi.sendMessage(
        code,
        {
          message: `Shared a product: ${product.name}`,
          message_type: "product_share",
          product_id: product.id,
        },
        token
      );
      fetchMessages();
    } catch (err) {
      console.error("Failed to share product:", err);
    }
  };

  const handleEndSession = async () => {
    if (!confirm("Are you sure you want to end this session?")) return;
    try {
      const token = await getToken();
      if (!token) return;
      await socialShoppingApi.endSession(code, token);
      fetchSession();
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (!isSignedIn) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#B76E79" }}>
          Shop Together
        </h1>
        <p className="text-gray-600 mb-6">
          Please sign in to join this shopping session.
        </p>
        <Link href="/sign-in" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container-custom py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Session Not Found
        </h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/shop-together" className="btn-primary">
          Back to Shop Together
        </Link>
      </div>
    );
  }

  // Join prompt
  if (needsJoin && session) {
    return (
      <div className="container-custom py-20 max-w-md mx-auto">
        <div className="card p-8 text-center">
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "#B76E79" }}
          >
            Join Session
          </h1>
          <p className="text-gray-600 mb-1 text-lg">
            {session.title || "Shopping Session"}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Code: <span className="font-mono" style={{ color: "#D4A853" }}>{session.session_code}</span>
          </p>
          {session.participants && session.participants.length > 0 && (
            <p className="text-gray-500 text-sm mb-4">
              {session.participants.length} participant
              {session.participants.length !== 1 ? "s" : ""} already in session
            </p>
          )}
          <form onSubmit={handleJoinSession} className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Display Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder={user?.firstName || "Enter your name"}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={joining}
            >
              {joining ? "Joining..." : "Join Session"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isHost = session.host_id === userId;
  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="container-custom py-6">
      {/* Session Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/shop-together"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1
              className="text-2xl font-bold"
              style={{ color: "#B76E79" }}
            >
              {session.title || "Shopping Session"}
            </h1>
            {session.is_active ? (
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{ backgroundColor: "#B76E7920", color: "#B76E79" }}
              >
                Live
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                Ended
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-1 ml-8">
            Code:{" "}
            <span className="font-mono" style={{ color: "#D4A853" }}>
              {session.session_code}
            </span>
          </p>
        </div>
        {isHost && session.is_active && (
          <button
            onClick={handleEndSession}
            className="text-sm px-4 py-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
          >
            End Session
          </button>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6" style={{ minHeight: "calc(100vh - 220px)" }}>
        {/* Left Panel - Products (2/3 width) */}
        <div className="lg:w-2/3">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search products to share with the group..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Products Grid */}
          {searchLoading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : products.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="card overflow-hidden group">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative aspect-square bg-gray-100">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-medium text-gray-800 text-sm truncate hover:text-[#B76E79] transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p
                      className="font-semibold text-sm mt-1"
                      style={{ color: "#B76E79" }}
                    >
                      Rs. {product.price.toLocaleString()}
                    </p>
                    {session.is_active && (
                      <button
                        onClick={() => handleShareProduct(product)}
                        className="mt-2 w-full text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1"
                        style={{
                          backgroundColor: "#D4A85320",
                          color: "#D4A853",
                          border: "1px solid #D4A85340",
                        }}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share to Chat
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel - Chat (1/3 width) */}
        <div className="lg:w-1/3">
          <div
            className="card flex flex-col"
            style={{
              height: "calc(100vh - 220px)",
              minHeight: "500px",
            }}
          >
            {/* Participants */}
            <div
              className="p-4 border-b"
              style={{ borderColor: "#B76E7920" }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Participants ({session.participants?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {session.participants?.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#FFF8F0" }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: "#B76E79" }}
                    >
                      {p.display_name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700">{p.display_name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ backgroundColor: "#FFF8F0" }}
            >
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">
                  No messages yet. Start chatting or share a product!
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwnMessage = msg.sender_id === userId;

                  if (msg.message_type === "product_share" && msg.product) {
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isOwnMessage ? "items-end" : "items-start"
                        }`}
                      >
                        <span className="text-[10px] text-gray-400 mb-1 px-1">
                          {msg.sender_name} shared a product
                        </span>
                        <div
                          className="rounded-xl overflow-hidden shadow-sm max-w-[260px]"
                          style={{
                            backgroundColor: "#ffffff",
                            border: "1px solid #D4A85330",
                          }}
                        >
                          <div className="relative w-full h-32">
                            <Image
                              src={msg.product.image_url}
                              alt={msg.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-3">
                            <h4 className="text-sm font-semibold text-gray-800 truncate">
                              {msg.product.name}
                            </h4>
                            <p
                              className="text-sm font-bold mt-1"
                              style={{ color: "#B76E79" }}
                            >
                              Rs. {msg.product.price.toLocaleString()}
                            </p>
                            <button
                              onClick={() =>
                                handleAddToCart(msg.product as Product)
                              }
                              className="btn-primary w-full mt-2 text-xs py-1.5"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 px-1">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isOwnMessage ? "items-end" : "items-start"
                      }`}
                    >
                      {!isOwnMessage && (
                        <span className="text-[10px] text-gray-500 mb-0.5 px-3">
                          {msg.sender_name}
                        </span>
                      )}
                      <div
                        className="px-3.5 py-2 rounded-2xl max-w-[85%] shadow-sm"
                        style={
                          isOwnMessage
                            ? {
                                backgroundColor: "#B76E79",
                                color: "#ffffff",
                                borderBottomRightRadius: "4px",
                              }
                            : {
                                backgroundColor: "#ffffff",
                                color: "#374151",
                                borderBottomLeftRadius: "4px",
                                border: "1px solid #e5e7eb",
                              }
                        }
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {msg.message}
                        </p>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5 px-3">
                        {formatTime(msg.created_at)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            {session.is_active ? (
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t flex gap-2"
                style={{ borderColor: "#B76E7920" }}
              >
                <input
                  type="text"
                  className="input-field flex-1 text-sm"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !messageInput.trim()}
                  className="p-2.5 rounded-xl transition-colors disabled:opacity-40"
                  style={{
                    backgroundColor: "#B76E79",
                    color: "#ffffff",
                  }}
                >
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <div
                className="p-4 text-center text-sm text-gray-500 border-t"
                style={{ borderColor: "#B76E7920" }}
              >
                This session has ended.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
