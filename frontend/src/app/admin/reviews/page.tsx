"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { reviewsApi, AdminReview, ReviewStats } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

type RatingFilter = "all" | 1 | 2 | 3 | 4 | 5;

export default function AdminReviewsPage() {
  const { getToken } = useAuth();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RatingFilter>("all");
  const [deleting, setDeleting] = useState<AdminReview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchReviews = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const res = await reviewsApi.getAllAdmin(token);
      setReviews(res.data || []);
      setStats(res.stats);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [getToken]);

  const handleDelete = async () => {
    if (!deleting) return;
    setIsDeleting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await reviewsApi.deleteAdmin(deleting.id, token);
      setDeleting(null);
      await fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered =
    filter === "all"
      ? reviews
      : reviews.filter((r) => r.rating === filter);

  const ratingCounts = {
    all: reviews.length,
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div>
      <h1 className="page-title mb-6">Review Moderation</h1>

      {/* Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.total_reviews}</p>
            <p className="text-xs text-medium mt-1">Total Reviews</p>
          </div>
          <div className="card p-4 text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl font-bold text-primary">{stats.average_rating}</p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-yellow-400">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-xs text-medium mt-1">Average Rating</p>
          </div>

          {/* Rating Distribution */}
          <div className="card p-4 col-span-2">
            <p className="text-xs text-medium mb-2 font-medium">Rating Distribution</p>
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const dist = stats.distribution.find((d) => d.rating === star);
                const count = dist?.count || 0;
                const pct = stats.total_reviews > 0 ? (count / stats.total_reviews) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="w-3 text-medium">{star}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", 5, 4, 3, 2, 1] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab
                ? "bg-primary text-white"
                : "bg-white text-medium border border-border hover:bg-light"
            }`}
          >
            {tab === "all" ? "All" : `${tab} Star`} ({ratingCounts[tab]})
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-medium">
            {filter === "all" ? "No reviews yet." : `No ${filter}-star reviews.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((review) => (
            <div key={review.id} className="card p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {review.product_image ? (
                    <Image
                      src={review.product_image}
                      alt={review.product_name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">
                      🎁
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <div>
                      <p className="font-medium text-dark text-sm truncate">
                        {review.product_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-medium">{review.user_name}</span>
                        <span className="text-xs text-medium">
                          {new Date(review.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Stars */}
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill={star <= review.rating ? "currentColor" : "none"}
                            stroke="currentColor"
                            strokeWidth={star <= review.rating ? 0 : 1.5}
                            className={`w-4 h-4 ${
                              star <= review.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => setDeleting(review)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-border text-medium hover:text-error hover:border-error transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {review.comment && (
                    <p className="text-sm text-dark mt-1">{review.comment}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleting}
        onClose={() => setDeleting(null)}
        title="Delete Review"
      >
        <div className="space-y-4">
          <p className="text-medium">
            Are you sure you want to delete this review by{" "}
            <strong className="text-dark">{deleting?.user_name}</strong> on{" "}
            <strong className="text-dark">{deleting?.product_name}</strong>?
          </p>
          {deleting?.comment && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-medium italic">
              &ldquo;{deleting.comment}&rdquo;
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setDeleting(null)}
              className="btn-secondary flex-1"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-error text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
