"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { GroupGift } from "@/types";
import { groupGiftsApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ContributePage() {
  const { getToken } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const [groupGift, setGroupGift] = useState<GroupGift | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [contributorName, setContributorName] = useState("");
  const [contributorEmail, setContributorEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchGroupGift = async () => {
    try {
      const res = await groupGiftsApi.getPublic(id);
      setGroupGift(res.data);
    } catch (err) {
      console.error("Failed to fetch group gift:", err);
      setError("This group gift could not be found or is no longer available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchGroupGift();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributorName.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!contributorEmail.trim()) {
      setFormError("Please enter your email.");
      return;
    }
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      const token = await getToken();
      await groupGiftsApi.contribute(
        id,
        {
          contributor_name: contributorName.trim(),
          contributor_email: contributorEmail.trim(),
          amount: numAmount,
        },
        token || ""
      );

      setSuccess(true);
      // Refresh gift data
      await fetchGroupGift();
    } catch (err) {
      console.error("Failed to contribute:", err);
      setFormError(
        err instanceof Error ? err.message : "Failed to submit contribution."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (error || !groupGift) {
    return (
      <div className="container-custom py-20 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-20 h-20 mx-auto mb-6 text-gray-300"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-dark mb-2">
          Group Gift Not Found
        </h2>
        <p className="text-medium mb-6">
          {error || "This group gift could not be found."}
        </p>
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    );
  }

  const percentage =
    groupGift.target_amount > 0
      ? Math.min(
          Math.round(
            (groupGift.current_amount / groupGift.target_amount) * 100
          ),
          100
        )
      : 0;
  const remaining = Math.max(
    groupGift.target_amount - groupGift.current_amount,
    0
  );
  const isActive = groupGift.status === "active";

  return (
    <div className="container-custom py-8">
      <Link
        href="/group-gift"
        className="inline-flex items-center gap-1 text-medium hover:text-dark transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back to Group Gifts
      </Link>

      <div className="max-w-3xl mx-auto">
        {/* Gift Details Card */}
        <div className="card overflow-hidden mb-8">
          {/* Product Section */}
          {groupGift.product && (
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-64 h-64 flex-shrink-0">
                <Image
                  src={groupGift.product.image_url}
                  alt={groupGift.product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 256px"
                />
              </div>
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h1 className="text-2xl font-bold text-dark">
                    {groupGift.product.name}
                  </h1>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                      groupGift.status === "active"
                        ? "bg-blue-100 text-blue-800"
                        : groupGift.status === "funded"
                        ? "bg-green-100 text-green-800"
                        : groupGift.status === "purchased"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {groupGift.status}
                  </span>
                </div>
                <p className="text-2xl font-bold mb-4" style={{ color: "#B76E79" }}>
                  ${groupGift.product.price.toFixed(2)}
                </p>
                <p className="text-medium text-sm">
                  A group gift for{" "}
                  <span className="font-semibold text-dark">
                    {groupGift.recipient_name}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-medium">
                ${groupGift.current_amount.toFixed(2)} raised of $
                {groupGift.target_amount.toFixed(2)}
              </span>
              <span className="font-semibold" style={{ color: "#B76E79" }}>
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${percentage}%`,
                  backgroundColor:
                    percentage >= 100 ? "#22c55e" : "#B76E79",
                }}
              />
            </div>
            {isActive && remaining > 0 && (
              <p className="text-sm text-medium mt-2">
                <span className="font-medium" style={{ color: "#D4A853" }}>
                  ${remaining.toFixed(2)}
                </span>{" "}
                still needed to reach the goal
              </p>
            )}
          </div>

          {/* Organizer Message */}
          {groupGift.message && (
            <div className="px-6 py-4 border-t border-gray-100" style={{ backgroundColor: "#FFF8F0" }}>
              <h3 className="text-sm font-medium text-dark mb-1">
                Message from the organizer
              </h3>
              <p className="text-medium text-sm italic">
                &ldquo;{groupGift.message}&rdquo;
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contribution Form */}
          <div>
            {success ? (
              <div className="card p-6 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: "#22c55e" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-dark mb-2">
                  Thank you for contributing!
                </h2>
                <p className="text-medium mb-4">
                  Your contribution has been recorded. Together we can make this
                  gift happen!
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setContributorName("");
                    setContributorEmail("");
                    setAmount("");
                  }}
                  className="btn-secondary text-sm"
                >
                  Make Another Contribution
                </button>
              </div>
            ) : isActive && remaining > 0 ? (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark mb-4">
                  Contribute to this Gift
                </h2>
                <form onSubmit={handleContribute} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={contributorName}
                      onChange={(e) => setContributorName(e.target.value)}
                      placeholder="Enter your name"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={contributorEmail}
                      onChange={(e) => setContributorEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">
                      Amount ($) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder={`Up to $${remaining.toFixed(2)} remaining`}
                      className="input-field"
                      min="0.01"
                      max={remaining}
                      step="0.01"
                      required
                    />
                    <p className="text-xs text-medium mt-1">
                      ${remaining.toFixed(2)} still needed to reach the goal
                    </p>
                  </div>

                  {formError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                  >
                    {submitting ? "Submitting..." : "Contribute"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="card p-6 text-center">
                <h2 className="text-xl font-bold text-dark mb-2">
                  {groupGift.status === "funded" || groupGift.status === "purchased"
                    ? "This gift has been fully funded!"
                    : groupGift.status === "cancelled"
                    ? "This group gift has been cancelled."
                    : "Contributions are closed."}
                </h2>
                <p className="text-medium">
                  {groupGift.status === "funded" || groupGift.status === "purchased"
                    ? "Thank you to all contributors who made this possible."
                    : "This group gift is no longer accepting contributions."}
                </p>
              </div>
            )}
          </div>

          {/* Contributors List */}
          <div>
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4">
                Contributors
                {groupGift.contributions && groupGift.contributions.length > 0 && (
                  <span className="text-sm font-normal text-medium ml-2">
                    ({groupGift.contributions.length})
                  </span>
                )}
              </h2>
              {groupGift.contributions && groupGift.contributions.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {groupGift.contributions.map((contrib) => (
                    <div
                      key={contrib.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-dark text-sm">
                          {contrib.contributor_name}
                        </p>
                        <p className="text-xs text-medium">
                          {new Date(contrib.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: "#D4A853" }}
                      >
                        ${contrib.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-medium text-sm text-center py-4">
                  No contributions yet. Be the first to contribute!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
