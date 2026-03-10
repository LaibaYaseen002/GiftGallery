"use client";

import { Review } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { reviewsApi } from "@/lib/api";
import StarRating from "./StarRating";

interface ReviewListProps {
  reviews: Review[];
  onReviewDeleted: () => void;
}

export default function ReviewList({
  reviews,
  onReviewDeleted,
}: ReviewListProps) {
  const { userId, getToken } = useAuth();

  const handleDelete = async (reviewId: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await reviewsApi.delete(reviewId, token);
      onReviewDeleted();
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };

  if (reviews.length === 0) {
    return (
      <p className="text-medium py-4">
        No reviews yet. Be the first to review this product!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="border-b border-border pb-4 last:border-b-0 last:pb-0"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold text-dark">
                  {review.user_name}
                </span>
                <StarRating rating={review.rating} size="sm" />
              </div>
              <p className="text-xs text-medium">
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            {userId === review.user_id && (
              <button
                onClick={() => handleDelete(review.id)}
                className="text-xs text-error hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
          {review.comment && (
            <p className="text-medium mt-2">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
