"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import AuthModal from "@/components/auth/AuthModal";

export default function CartSummary() {
  const { totalItems, totalPrice } = useCart();
  const { isSignedIn } = useUser();
  const router = useRouter();
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
      <div className="card p-4 sm:p-6 sticky top-20 sm:top-24">
        <h2 className="text-lg sm:text-xl font-bold text-dark mb-3 sm:mb-4">Order Summary</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-medium">
            <span>Items ({totalItems})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-medium">
            <span>Shipping</span>
            <span className="text-success">Free</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between">
            <span className="text-lg font-bold text-dark">Total</span>
            <span className="text-lg font-bold text-primary">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="btn-primary w-full text-center text-sm sm:text-lg py-2.5 sm:py-3"
        >
          Proceed to Checkout
        </button>

        <Link
          href="/products"
          className="block text-center text-medium hover:text-primary transition-colors mt-3 text-sm"
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
