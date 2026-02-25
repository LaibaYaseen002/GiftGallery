"use client";

import { useState } from "react";
import { useAuth, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { reviewsApi } from "@/lib/api";
import StarRating from "./StarRating";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({
  productId,
  onReviewSubmitted,
}: ReviewFormProps) {
  const { getToken } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      if (!token) return;
      await reviewsApi.create(productId, { rating, comment }, token);
      setSuccess(true);
      setRating(0);
      setComment("");
      onReviewSubmitted();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-bold text-dark mb-4">Write a Review</h3>

      <SignedOut>
        <p className="text-medium">
          <Link href="/sign-in" className="text-primary hover:text-primary-dark font-medium">
            Sign in
          </Link>{" "}
          to leave a review.
        </p>
      </SignedOut>

      <SignedIn>
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">
              Review submitted successfully!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark mb-2">
                Your Rating
              </label>
              <StarRating
                rating={rating}
                size="lg"
                interactive
                onChange={setRating}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark mb-1">
                Your Review (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Share your experience with this product..."
                maxLength={1000}
              />
            </div>

            {error && <p className="text-error text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="btn-primary"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}
      </SignedIn>
    </div>
  );
}
