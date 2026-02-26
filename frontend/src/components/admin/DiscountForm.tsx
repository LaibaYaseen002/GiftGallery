"use client";

import { useState, useEffect } from "react";
import { DiscountCode } from "@/types";

interface DiscountFormProps {
  discount?: DiscountCode | null;
  onSubmit: (data: {
    code: string;
    discount_percent: number;
    is_active: boolean;
    expires_at: string | null;
    max_uses: number | null;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function DiscountForm({
  discount,
  onSubmit,
  onCancel,
}: DiscountFormProps) {
  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!discount;

  useEffect(() => {
    if (discount) {
      setCode(discount.code);
      setDiscountPercent(String(discount.discount_percent));
      setIsActive(discount.is_active);
      setExpiresAt(
        discount.expires_at
          ? new Date(discount.expires_at).toISOString().slice(0, 16)
          : ""
      );
      setMaxUses(discount.max_uses ? String(discount.max_uses) : "");
    }
  }, [discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Discount code is required");
      return;
    }

    const percent = parseInt(discountPercent);
    if (!percent || percent < 1 || percent > 100) {
      setError("Discount percent must be between 1 and 100");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        code: code.trim().toUpperCase(),
        discount_percent: percent,
        is_active: isActive,
        expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
        max_uses: maxUses ? parseInt(maxUses) : null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save discount code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Code */}
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-dark mb-1">
          Discount Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. SUMMER25"
          className="input-field uppercase"
        />
      </div>

      {/* Discount Percent */}
      <div>
        <label htmlFor="percent" className="block text-sm font-medium text-dark mb-1">
          Discount Percentage
        </label>
        <div className="relative">
          <input
            id="percent"
            type="number"
            min="1"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="e.g. 15"
            className="input-field pr-8"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-medium">
            %
          </span>
        </div>
      </div>

      {/* Expiry Date */}
      <div>
        <label htmlFor="expires" className="block text-sm font-medium text-dark mb-1">
          Expiry Date <span className="text-medium font-normal">(optional)</span>
        </label>
        <input
          id="expires"
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="input-field"
        />
      </div>

      {/* Max Uses */}
      <div>
        <label htmlFor="maxUses" className="block text-sm font-medium text-dark mb-1">
          Max Uses <span className="text-medium font-normal">(optional, leave empty for unlimited)</span>
        </label>
        <input
          id="maxUses"
          type="number"
          min="1"
          value={maxUses}
          onChange={(e) => setMaxUses(e.target.value)}
          placeholder="Unlimited"
          className="input-field"
        />
      </div>

      {/* Active Toggle */}
      {isEditing && (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
          <span className="text-sm font-medium text-dark">
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      )}

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading
            ? "Saving..."
            : isEditing
            ? "Update Discount"
            : "Create Discount"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
}
