"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { ordersApi, discountsApi, giftWrappingApi, charitiesApi } from "@/lib/api";
import { GiftWrappingOption, Charity } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import StripePaymentForm from "@/components/checkout/StripePaymentForm";

type GiftFont = "classic" | "handwritten" | "elegant" | "playful";

const FONT_OPTIONS: { key: GiftFont; label: string; className: string }[] = [
  { key: "classic", label: "Classic", className: "font-sans" },
  { key: "handwritten", label: "Handwritten", className: "font-[family-name:var(--font-dancing)]" },
  { key: "elegant", label: "Elegant", className: "font-[family-name:var(--font-great-vibes)]" },
  { key: "playful", label: "Playful", className: "font-[family-name:var(--font-pacifico)]" },
];

interface Recipient {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  message: string;
  itemIndices: number[];
}

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const { t, formatPrice } = useLanguage();

  // Shipping
  const [shipping, setShipping] = useState({
    shipping_name: "",
    shipping_address: "",
    shipping_city: "",
    shipping_phone: "",
  });

  // Gift Message (3.2.18)
  const [giftMessage, setGiftMessage] = useState("");
  const [giftFont, setGiftFont] = useState<GiftFont>("classic");

  // Flash Sales & Discounts (3.2.27)
  const [flashSales, setFlashSales] = useState<{ code: string; discount_percent: number; expires_at: string }[]>([]);
  const [discountCode, setDiscountCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountError, setDiscountError] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  // Gift Wrapping (3.2.15) & Packaging (3.2.19)
  const [wrappingOptions, setWrappingOptions] = useState<GiftWrappingOption[]>([]);
  const [packagingOptions, setPackagingOptions] = useState<GiftWrappingOption[]>([]);
  const [selectedWrapping, setSelectedWrapping] = useState<GiftWrappingOption | null>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<GiftWrappingOption | null>(null);

  // Charity Integration (3.2.23)
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string>("");
  const [charityPercent, setCharityPercent] = useState(5);

  // Scheduled Delivery (3.2.25)
  const [scheduledDate, setScheduledDate] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  // Multi-Destination (3.2.20 + 3.2.26)
  const [multiDestEnabled, setMultiDestEnabled] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  // General
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Fetch all options on mount
  useEffect(() => {
    discountsApi.getActiveSales()
      .then((res) => setFlashSales(res.data || []))
      .catch(() => {});

    giftWrappingApi.getAll("wrapping")
      .then((res) => setWrappingOptions(res.data || []))
      .catch(() => {});

    giftWrappingApi.getAll("packaging")
      .then((res) => setPackagingOptions(res.data || []))
      .catch(() => {});

    charitiesApi.getAll()
      .then((res) => setCharities(res.data || []))
      .catch(() => {});
  }, []);

  // Calculate totals
  const wrappingCost = selectedWrapping?.price || 0;
  const packagingCost = selectedPackaging?.price || 0;
  const subtotalWithExtras = totalPrice + wrappingCost + packagingCost;
  const discountAmount = (subtotalWithExtras * discountPercent) / 100;
  const afterDiscount = subtotalWithExtras - discountAmount;
  const charityAmount = selectedCharity ? (afterDiscount * charityPercent) / 100 : 0;
  const finalTotal = afterDiscount + charityAmount;

  // Min date for scheduling (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

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

  const addRecipient = () => {
    setRecipients([...recipients, {
      name: "", address: "", city: "", phone: "", email: "", message: "", itemIndices: [],
    }]);
  };

  const updateRecipient = (index: number, field: keyof Recipient, value: string | number[]) => {
    const updated = [...recipients];
    updated[index] = { ...updated[index], [field]: value };
    setRecipients(updated);
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
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
        wrapping_id: selectedWrapping?.id || undefined,
        packaging_id: selectedPackaging?.id || undefined,
        charity_id: selectedCharity || undefined,
        charity_percent: selectedCharity ? charityPercent : undefined,
        scheduled_delivery_date: scheduledDate || undefined,
        delivery_note: deliveryNote || undefined,
        recipients: multiDestEnabled && recipients.length > 0 ? recipients : undefined,
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
        <h1 className="page-title">{t("checkout.payment")}</h1>
        <div className="max-w-lg mx-auto">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold text-dark mb-4">Complete Your Payment</h2>
            <p className="text-sm text-medium mb-6">
              Enter your card details below. Use test card{" "}
              <span className="font-mono bg-light px-1.5 py-0.5 rounded text-dark">4242 4242 4242 4242</span>{" "}
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
              <StripePaymentForm amount={finalTotal} onSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
          <div className="card p-4">
            <div className="flex justify-between items-center">
              <span className="text-medium">{t("checkout.total")}</span>
              <span className="text-lg font-bold text-primary">{formatPrice(finalTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Phase 1: Full checkout form
  return (
    <div className="container-custom py-8">
      <h1 className="page-title">{t("checkout.title")}</h1>

      <form onSubmit={handleContinueToPayment}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: All checkout sections */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Shipping Details */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-4">{t("checkout.shipping")}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("checkout.fullName")}</label>
                  <input type="text" value={shipping.shipping_name}
                    onChange={(e) => setShipping({ ...shipping, shipping_name: e.target.value })}
                    className="input-field" placeholder="Enter your full name" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("checkout.phone")}</label>
                  <input type="tel" value={shipping.shipping_phone}
                    onChange={(e) => setShipping({ ...shipping, shipping_phone: e.target.value })}
                    className="input-field" placeholder="Enter phone number" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-dark mb-1">{t("checkout.address")}</label>
                  <input type="text" value={shipping.shipping_address}
                    onChange={(e) => setShipping({ ...shipping, shipping_address: e.target.value })}
                    className="input-field" placeholder="Street address, apartment, suite" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">{t("checkout.city")}</label>
                  <input type="text" value={shipping.shipping_city}
                    onChange={(e) => setShipping({ ...shipping, shipping_city: e.target.value })}
                    className="input-field" placeholder="City name" required />
                </div>
              </div>
            </div>

            {/* 2. Gift Wrapping (3.2.15) */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">{t("checkout.giftWrapping")}</h2>
              <p className="text-sm text-medium mb-4">{t("checkout.selectWrapping")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button type="button"
                  onClick={() => setSelectedWrapping(null)}
                  className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${
                    !selectedWrapping ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                  <span className="block text-2xl mb-1">-</span>
                  <span className="font-medium">No Wrapping</span>
                  <span className="block text-xs text-medium">Free</span>
                </button>
                {wrappingOptions.map((opt) => (
                  <button key={opt.id} type="button"
                    onClick={() => setSelectedWrapping(opt)}
                    className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${
                      selectedWrapping?.id === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: opt.color || "#ccc" }} />
                    <span className="font-medium block truncate">{opt.name}</span>
                    <span className="block text-xs text-medium">{formatPrice(opt.price)}</span>
                    {opt.is_eco_friendly && (
                      <span className="inline-block mt-1 text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full">Eco</span>
                    )}
                  </button>
                ))}
              </div>
              {selectedWrapping && (
                <div className="mt-3 p-3 bg-primary/5 rounded-lg">
                  <p className="text-sm font-medium text-dark">Selected: {selectedWrapping.name}</p>
                  <p className="text-xs text-medium">{selectedWrapping.description}</p>
                </div>
              )}
            </div>

            {/* 3. Gift Packaging (3.2.19) */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">{t("checkout.packaging")}</h2>
              <p className="text-sm text-medium mb-4">{t("checkout.selectPackaging")}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button type="button"
                  onClick={() => setSelectedPackaging(null)}
                  className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${
                    !selectedPackaging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}>
                  <span className="block text-2xl mb-1">-</span>
                  <span className="font-medium">Standard</span>
                  <span className="block text-xs text-medium">Free</span>
                </button>
                {packagingOptions.map((opt) => (
                  <button key={opt.id} type="button"
                    onClick={() => setSelectedPackaging(opt)}
                    className={`p-3 rounded-lg border-2 text-center text-sm transition-all ${
                      selectedPackaging?.id === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-1 bg-accent/20 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-accent">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                      </svg>
                    </div>
                    <span className="font-medium block truncate">{opt.name}</span>
                    <span className="block text-xs text-medium">{formatPrice(opt.price)}</span>
                    {opt.is_eco_friendly && (
                      <span className="inline-block mt-1 text-[10px] bg-success/10 text-success px-1.5 py-0.5 rounded-full">Eco</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Gift Message (3.2.18) */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">{t("checkout.giftMessage")}</h2>
              <p className="text-sm text-medium mb-3">Add a personal message to include with your gift.</p>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                className="input-field resize-none"
                rows={3}
                placeholder="Write a heartfelt message for the recipient..."
                maxLength={500}
              />
              <p className="text-xs text-medium mt-1 text-right">{giftMessage.length}/500</p>

              {/* Font Style Selector */}
              <div className="mt-4">
                <p className="text-sm font-medium text-dark mb-2">Font Style</p>
                <div className="flex flex-wrap gap-2">
                  {FONT_OPTIONS.map((font) => (
                    <button key={font.key} type="button"
                      onClick={() => setGiftFont(font.key)}
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${font.className} ${
                        giftFont === font.key
                          ? "bg-primary text-white"
                          : "bg-light text-dark border border-border hover:border-primary"
                      }`}>
                      {font.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview */}
              {giftMessage.trim() && (
                <div className="mt-4 bg-secondary border-l-4 border-accent rounded-lg p-4">
                  <p className="text-xs text-medium mb-2 uppercase tracking-wide">Preview</p>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-border">
                    <p className={`text-lg text-dark italic ${
                      FONT_OPTIONS.find((f) => f.key === giftFont)?.className || "font-sans"
                    }`}>
                      &ldquo;{giftMessage}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 5. Charity Integration (3.2.23) */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">Donate to Charity</h2>
              <p className="text-sm text-medium mb-4">Donate a percentage of your purchase to a charity.</p>
              <div className="space-y-3">
                {charities.map((charity) => (
                  <label key={charity.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedCharity === charity.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}>
                    <input type="radio" name="charity"
                      checked={selectedCharity === charity.id}
                      onChange={() => setSelectedCharity(charity.id)}
                      className="accent-primary" />
                    {charity.logo_url && (
                      <Image src={charity.logo_url} alt={charity.name} width={40} height={40} className="rounded object-contain" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-dark">{charity.name}</p>
                      <p className="text-xs text-medium">{charity.description}</p>
                    </div>
                  </label>
                ))}
                <label className={`flex items-center gap-4 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  !selectedCharity ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                }`}>
                  <input type="radio" name="charity"
                    checked={!selectedCharity}
                    onChange={() => setSelectedCharity("")}
                    className="accent-primary" />
                  <span className="text-medium">No donation</span>
                </label>
              </div>
              {selectedCharity && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-dark mb-1">
                    Donation: {charityPercent}% (${charityAmount.toFixed(2)})
                  </label>
                  <input type="range" min="1" max="25" value={charityPercent}
                    onChange={(e) => setCharityPercent(Number(e.target.value))}
                    className="w-full accent-primary" />
                  <div className="flex justify-between text-xs text-medium">
                    <span>1%</span><span>25%</span>
                  </div>
                </div>
              )}
            </div>

            {/* 6. Scheduled Delivery (3.2.25) */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">Schedule Delivery</h2>
              <p className="text-sm text-medium mb-4">Want your gift delivered on a specific date?</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Delivery Date</label>
                  <input type="date" value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={minDate}
                    className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Delivery Note</label>
                  <input type="text" value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                    className="input-field" placeholder="e.g., Leave at front door" />
                </div>
              </div>
              {scheduledDate && (
                <p className="mt-2 text-sm text-success">
                  Your gift will be delivered on {new Date(scheduledDate).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
            </div>

            {/* 7. Multi-Destination Checkout (3.2.20 + 3.2.26) */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-dark">Multiple Destinations</h2>
                  <p className="text-sm text-medium">Send items to different addresses</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={multiDestEnabled}
                    onChange={(e) => {
                      setMultiDestEnabled(e.target.checked);
                      if (!e.target.checked) setRecipients([]);
                    }}
                    className="accent-primary w-5 h-5" />
                  <span className="text-sm font-medium text-dark">Enable</span>
                </label>
              </div>

              {multiDestEnabled && (
                <div className="space-y-4">
                  {recipients.map((r, i) => (
                    <div key={i} className="bg-light rounded-lg p-4 border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-dark">Recipient {i + 1}</h3>
                        <button type="button" onClick={() => removeRecipient(i)}
                          className="text-error text-sm hover:underline">Remove</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" value={r.name} placeholder="Recipient Name"
                          onChange={(e) => updateRecipient(i, "name", e.target.value)}
                          className="input-field" />
                        <input type="email" value={r.email} placeholder="Email"
                          onChange={(e) => updateRecipient(i, "email", e.target.value)}
                          className="input-field" />
                        <input type="text" value={r.address} placeholder="Address"
                          onChange={(e) => updateRecipient(i, "address", e.target.value)}
                          className="input-field sm:col-span-2" />
                        <input type="text" value={r.city} placeholder="City"
                          onChange={(e) => updateRecipient(i, "city", e.target.value)}
                          className="input-field" />
                        <input type="tel" value={r.phone} placeholder="Phone"
                          onChange={(e) => updateRecipient(i, "phone", e.target.value)}
                          className="input-field" />
                        <textarea value={r.message} placeholder="Personal message for this recipient..."
                          onChange={(e) => updateRecipient(i, "message", e.target.value)}
                          className="input-field resize-none sm:col-span-2" rows={2} />
                      </div>
                      {/* Item assignment */}
                      <div className="mt-3">
                        <p className="text-sm font-medium text-dark mb-2">Assign Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {items.map((item, idx) => (
                            <label key={idx} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
                              r.itemIndices.includes(idx) ? "bg-primary/10 border-primary text-primary" : "border-border text-medium hover:border-primary/50"
                            }`}>
                              <input type="checkbox"
                                checked={r.itemIndices.includes(idx)}
                                onChange={(e) => {
                                  const indices = e.target.checked
                                    ? [...r.itemIndices, idx]
                                    : r.itemIndices.filter((x) => x !== idx);
                                  updateRecipient(i, "itemIndices", indices);
                                }}
                                className="hidden" />
                              {item.product.name}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={addRecipient}
                    className="btn-secondary w-full flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Recipient
                  </button>
                </div>
              )}
            </div>

            {/* 8. Discount Code (3.2.27 with flash sale) */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark mb-2">Discount Code</h2>
              {flashSales.length > 0 && !discountApplied && (
                <div className="mb-3 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg animate-pulse">*</span>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Flash Sale Active! Try code{" "}
                        <span className="font-bold font-mono bg-white px-1.5 py-0.5 rounded">{flashSales[0].code}</span>
                        {" "}for {flashSales[0].discount_percent}% off
                      </p>
                      <FlashSaleTimer expiresAt={flashSales[0].expires_at} />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <input type="text" value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value.toUpperCase());
                    if (discountApplied) {
                      setDiscountApplied(false);
                      setDiscountPercent(0);
                    }
                    setDiscountError("");
                  }}
                  className="input-field flex-1" placeholder="Enter discount code" disabled={discountApplied} />
                <button type="button"
                  onClick={discountApplied
                    ? () => { setDiscountCode(""); setDiscountApplied(false); setDiscountPercent(0); }
                    : handleApplyDiscount}
                  className={discountApplied ? "btn-secondary" : "btn-accent"}>
                  {discountApplied ? "Remove" : "Apply"}
                </button>
              </div>
              {discountApplied && (
                <p className="text-success text-sm mt-2">{discountPercent}% discount applied! You save ${discountAmount.toFixed(2)}</p>
              )}
              {discountError && (
                <p className="text-error text-sm mt-2">{discountError}</p>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded overflow-hidden shrink-0 border border-border">
                      <Image src={item.product.image_url} alt={item.product.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-medium">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-medium">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                {selectedWrapping && (
                  <div className="flex justify-between text-medium">
                    <span>Wrapping: {selectedWrapping.name}</span>
                    <span>${wrappingCost.toFixed(2)}</span>
                  </div>
                )}
                {selectedPackaging && (
                  <div className="flex justify-between text-medium">
                    <span>Packaging: {selectedPackaging.name}</span>
                    <span>${packagingCost.toFixed(2)}</span>
                  </div>
                )}
                {discountApplied && (
                  <div className="flex justify-between text-success">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-medium">
                  <span>Shipping</span>
                  <span className="text-success">Free</span>
                </div>
                {selectedCharity && (
                  <div className="flex justify-between text-accent">
                    <span>Charity ({charityPercent}%)</span>
                    <span>+${charityAmount.toFixed(2)}</span>
                  </div>
                )}
                {scheduledDate && (
                  <div className="flex justify-between text-medium">
                    <span>Delivery Date</span>
                    <span className="text-xs">{new Date(scheduledDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="border-t border-border pt-2 flex justify-between">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className="text-error text-sm mt-3">{error}</p>}

              <button type="submit" disabled={placing}
                className="btn-primary w-full text-lg py-3 mt-4">
                {placing ? (
                  <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner size="sm" />Creating Order...
                  </span>
                ) : "Continue to Payment"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// Flash Sale Countdown Timer (3.2.27)
function FlashSaleTimer({ expiresAt }: { expiresAt: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s remaining`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <p className="text-xs text-primary/70 font-mono mt-0.5">{timeLeft}</p>
  );
}
