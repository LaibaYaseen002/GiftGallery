"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎁</span>
            <span className="text-xl font-bold text-primary">Gift Gallery</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-medium hover:text-primary transition-colors"
            >
              Products
            </Link>
            <Link
              href="/faq"
              className="text-medium hover:text-primary transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="text-medium hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <SignedIn>
              <Link
                href="/orders"
                className="text-medium hover:text-primary transition-colors"
              >
                My Orders
              </Link>
              <Link
                href="/profile"
                className="text-medium hover:text-primary transition-colors"
              >
                Profile
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Admin
                </Link>
              )}
            </SignedIn>
          </div>

          {/* Right Side: Wishlist, Cart, Auth */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <SignedIn>
              <Link
                href="/wishlist"
                className="text-medium hover:text-primary transition-colors"
                title="Wishlist"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </Link>
            </SignedIn>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative text-medium hover:text-primary transition-colors"
              title="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            <SignedOut>
              <Link href="/sign-in" className="btn-primary text-sm py-2 px-4">
                Sign In
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden border-t border-border">
        <div className="container-custom py-2 flex items-center gap-4 overflow-x-auto text-sm">
          <Link href="/products" className="text-medium hover:text-primary whitespace-nowrap">
            Products
          </Link>
          <Link href="/faq" className="text-medium hover:text-primary whitespace-nowrap">
            FAQ
          </Link>
          <Link href="/contact" className="text-medium hover:text-primary whitespace-nowrap">
            Contact
          </Link>
          <SignedIn>
            <Link href="/orders" className="text-medium hover:text-primary whitespace-nowrap">
              Orders
            </Link>
            <Link href="/profile" className="text-medium hover:text-primary whitespace-nowrap">
              Profile
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-primary font-medium whitespace-nowrap">
                Admin
              </Link>
            )}
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}
