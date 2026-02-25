"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function ShoppingCartPage() {
  const { items, clearCart } = useCart();

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-20 h-20 text-border mx-auto mb-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold text-dark mb-2">
            Your cart is empty
          </h2>
          <p className="text-medium mb-6">
            Looks like you haven&apos;t added any gifts yet.
          </p>
          <Link href="/products" className="btn-primary text-lg">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-dark">
                  {items.length} item{items.length !== 1 ? "s" : ""} in cart
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-error hover:text-red-700 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
              {items.map((item) => (
                <CartItem key={item.product.id} item={item} />
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
}
