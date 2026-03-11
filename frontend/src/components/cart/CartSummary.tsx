"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/auth/AuthModal";
import { useLanguage } from "@/context/LanguageContext";

export default function CartSummary() {
  const { totalItems, totalPrice } = useCart();
  const { isSignedIn } = useUser();
  const router = useRouter();
  const { formatPrice } = useLanguage();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckout = () => {
    if (isSignedIn) {
      router.push("/checkout");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <div className="card p-4 sticky top-16 sm:top-20">
        <h2 className="text-base font-bold text-dark mb-3">Order Summary</h2>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-medium">
            <span>Items ({totalItems})</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-medium">
            <span>Shipping</span>
            <span className="text-success">Free</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-sm font-bold text-dark">Total</span>
            <span className="text-sm font-bold text-primary">
              {formatPrice(totalPrice)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="btn-primary w-full text-center text-xs sm:text-sm py-2"
        >
          Proceed to Checkout
        </button>

        <Link
          href="/products"
          className="block text-center text-medium hover:text-primary transition-colors mt-2 text-xs"
        >
          Continue Shopping
        </Link>
      </div>

      {/* Auth Modal - appears when unauthenticated user clicks checkout */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        redirectUrl="/checkout"
      />
    </>
  );
}
