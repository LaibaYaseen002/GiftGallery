"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartSummary() {
  const { totalItems, totalPrice } = useCart();

  return (
    <div className="card p-6 sticky top-24">
      <h2 className="text-xl font-bold text-dark mb-4">Order Summary</h2>

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

      <Link
        href="/checkout"
        className="btn-primary w-full text-center block text-lg py-3"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/products"
        className="block text-center text-medium hover:text-primary transition-colors mt-3 text-sm"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
