"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { returnsApi } from "@/lib/api";

interface ReturnRequestFormProps {
  orderId: string;
  onSuccess: () => void;
}

export default function ReturnRequestForm({
  orderId,
  onSuccess,
}: ReturnRequestFormProps) {
  const { getToken } = useAuth();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!reason.trim()) {
      setError("Please provide a reason for the return");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      await returnsApi.create({ order_id: orderId, reason: reason.trim() }, token);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit return request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-dark mb-1">
          Reason for Return
        </label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please describe why you want to return this order..."
          rows={4}
          className="input-field resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !reason.trim()}
        className="btn-primary w-full"
      >
        {loading ? "Submitting..." : "Submit Return Request"}
      </button>
    </form>
  );
}
