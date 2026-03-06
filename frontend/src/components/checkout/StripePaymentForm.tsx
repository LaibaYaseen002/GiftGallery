"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useLanguage } from "@/context/LanguageContext";

interface StripePaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

export default function StripePaymentForm({
  amount,
  onSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { formatPrice } = useLanguage();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [ready, setReady] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !ready) return;

    setProcessing(true);
    setError("");

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Payment failed. Please try again.");
        setProcessing(false);
        return;
      }

      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed. Please try again.");
        setProcessing(false);
      } else {
        onSuccess();
      }
    } catch {
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement
        options={{
          layout: "tabs",
        }}
        onReady={() => setReady(true)}
      />

      {error && <p className="text-error text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || !ready || processing}
        className="btn-primary w-full text-lg py-3"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" />
            Processing...
          </span>
        ) : (
          formatPrice(amount)
        )}
      </button>
    </form>
  );
}
