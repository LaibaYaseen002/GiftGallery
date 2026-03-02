"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { ordersApi, discountsApi } from "@/lib/api";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";

type GiftFont = "classic" | "handwritten" | "elegant" | "playful";

const FONT_OPTIONS: { key: GiftFont; label: string; className: string }[] = [
  { key: "classic", label: "Classic", className: "font-sans" },
  { key: "handwritten", label: "Handwritten", className: "font-[family-name:var(--font-dancing)]" },
  { key: "elegant", label: "Elegant", className: "font-[family-name:var(--font-great-vibes)]" },
  { key: "playful", label: "Playful", className: "font-[family-name:var(--font-pacifico)]" },
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { items, totalPrice, clearCart } = useCart();

  const [shipping, setShipping] = useState({
    shipping_name: "",
    shipping_address: "",
    shipping_city: "",
    shipping_phone: "",
  });
  const [giftMessage, setGiftMessage] = useState("");
  const [giftFont, setGiftFont] = useState<GiftFont>("classic");
  const [flashSales, setFlashSales] = useState<{ code: string; discount_percent: number; expires_at: string }[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  // Phase 2 state
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    discountsApi.getActiveSales()
      .then((res) => setFlashSales(res.data || []))
      .catch(() => {});
  }, []);

  const discountAmount = (totalPrice * discountPercent) / 100;
  const finalTotal = totalPrice - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    setDiscountError("");
    try {
      const token = await getToken();
      if (!token) return;
      const res = await discountsApi.validate(discountCode, token);
      const data = res.data as { discount_percent: number };
      setDiscountPercent(data.discount_percent);
      setDiscountApplied(true);
    } catch (err) {
      setDiscountPercent(0);
      setDiscountApplied(false);
      setDiscountError(err instanceof Error ? err.message : "Invalid code");
    }
  };

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!shipping.shipping_name || !shipping.shipping_address || !shipping.shipping_city || !shipping.shipping_phone) {
      setError("Please fill in all shipping fields");
      return;
    }

    setPlacing(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Please sign in to place an order");
        return;
      }

      const orderData = {
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        ...shipping,
        gift_message: giftMessage || undefined,
        gift_font: giftMessage ? giftFont : undefined,
        discount_code: discountApplied ? discountCode : undefined,
      };

      const res = await ordersApi.create(orderData, token);
      const order = res.data as unknown as { id: string; clientSecret: string };
      setOrderId(order.id);
      setClientSecret(order.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = () => {
    clearCart();
    router.push(`/orders/${orderId}?success=true`);
  };

  if (items.length === 0 && !clientSecret) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-medium mb-6">Add some items before checking out.</p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  // Phase 2: Payment form
  if (clientSecret) {
    return (
      <div className="container-custom py-8">
        <h1 className="page-title">Payment</h1>

        <div className="max-w-lg mx-auto">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-dark mb-4">
              Complete Your Payment
            </h2>
            <p className="text-medium text-sm mb-6">
              Enter your card details below to complete your order. Use test card{" "}
              <span className="font-mono bg-light px-1.5 py-0.5 rounded text-dark">
                4242 4242 4242 4242
              </span>{" "}
              with any future expiry and any CVC.
            </p>

            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#B76E79",
                    colorBackground: "#FFF8F0",
                    fontFamily: "inherit",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <StripePaymentForm
                amount={finalTotal}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>

          {/* Order total reminder */}
          <div className="card p-4">
            <div className="flex justify-between items-center">
              <span className="text-medium">Order Total</span>
              <span className="text-lg font-bold text-primary">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 1: Shipping + Gift + Discount form
  return (
    <div className="container-custom py-8">
      <h1 className="page-title">Checkout</h1>

      <form onSubmit={handleContinueToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Shipping + Gift + Discount */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Details */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4">
                Shipping Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={shipping.shipping_name}
                    onChange={(e) =>
                      setShipping({ ...shipping, shipping_name: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={shipping.shipping_phone}
                    onChange={(e) =>
                      setShipping({ ...shipping, shipping_phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={shipping.shipping_address}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shipping_address: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="Street address, apartment, suite"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={shipping.shipping_city}
                    onChange={(e) =>
                      setShipping({ ...shipping, shipping_city: e.target.value })
                    }
                    className="input-field"
                    placeholder="City name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Gift Message */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">
                Gift Message (Optional)
              </h2>
              <p className="text-sm text-medium mb-3">
                Add a personal message to include with your gift.
              </p>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Write a heartfelt message for the recipient..."
                maxLength={500}
              />
              <p className="text-xs text-medium mt-1 text-right">
                {giftMessage.length}/500
              </p>

              {/* Font Style Selector */}
              <div className="mt-4">
                <p className="text-sm font-medium text-dark mb-2">Font Style</p>
                <div className="flex flex-wrap gap-2">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.key}
                      type="button"
                      onClick={() => setGiftFont(font.key)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${font.className} ${
                        giftFont === font.key
                          ? "bg-primary text-white"
                          : "bg-light text-dark border border-border hover:border-primary"
                      }`}
                    >
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              {giftMessage.trim() && (
                <div className="mt-4 bg-secondary border-l-4 border-accent rounded-lg p-4">
                  <p className="text-xs text-medium mb-2 uppercase tracking-wide">Preview</p>
                  <p
                    className={`text-lg text-dark italic ${
                      FONT_OPTIONS.find((f) => f.key === giftFont)?.className || "font-sans"
                    }`}
                  >
                    &ldquo;{giftMessage}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Discount Code */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">
                Discount Code
              </h2>
              {flashSales.length > 0 && !discountApplied && (
                <div className="mb-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm font-medium text-primary">
                    Flash Sale Active! Try code{" "}
                    <span className="font-bold font-mono bg-white px-1.5 py-0.5 rounded">
                      {flashSales[0].code}
                    </span>
                    {" "}for {flashSales[0].discount_percent}% off
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    if (discountApplied) {
                      setDiscountApplied(false);
                      setDiscountPercent(0);
                    }
                    setDiscountError("");
                  }}
                  className="input-field flex-1"
                  placeholder="Enter discount code"
                  disabled={discountApplied}
                />
                <button
                  type="button"
                  onClick={
                    discountApplied
                      ? () => {
                          setDiscountCode("");
                          setDiscountApplied(false);
                          setDiscountPercent(0);
                        }
                      : handleApplyDiscount
                  }
                  className={
                    discountApplied ? "btn-secondary" : "btn-accent"
                  }
                >
                  {discountApplied ? "Remove" : "Apply"}
                </button>
              </div>
              {discountApplied && (
                <p className="text-success text-sm mt-2">
                  {discountPercent}% discount applied! You save $
                  {discountAmount.toFixed(2)}
                </p>
              )}
              {discountError && (
                <p className="text-error text-sm mt-2">{discountError}</p>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 items-center"
                  >
                    <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-border">
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-medium">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-medium text-sm">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-success text-sm">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-medium text-sm">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {error && (
                <p className="text-error text-sm mt-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={placing}
                className="btn-primary w-full text-lg py-3 mt-4"
              >
                {placing ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />
                    Creating Order...
                  </span>
                ) : (
                  "Continue to Payment"
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
