"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { useCart } from "@/context/CartContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user } = useUser();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.publicMetadata?.role === "admin";

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🎁</span>
            <span className="text-xl font-bold text-primary">Gift Gallery</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-5">
            <Link
              href="/products"
              className="text-sm text-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {t("nav.products")}
            </Link>
            <Link
              href="/bundles"
              className="text-sm text-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {t("nav.bundles")}
            </Link>
            <Link
              href="/faq"
              className="text-sm text-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {t("nav.faq")}
            </Link>
            <Link
              href="/contact"
              className="text-sm text-medium hover:text-primary transition-colors whitespace-nowrap"
            >
              {t("nav.contact")}
            </Link>
            <SignedIn>
              <Link
                href="/orders"
                className="text-sm text-medium hover:text-primary transition-colors whitespace-nowrap"
              >
                {t("nav.orders")}
              </Link>
              {/* More dropdown for extra links */}
              <div className="relative" ref={moreRef}>
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className="flex items-center gap-1 text-sm text-medium hover:text-primary transition-colors whitespace-nowrap"
                >
                  {t("nav.more")}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className={`w-3.5 h-3.5 transition-transform ${moreOpen ? "rotate-180" : ""}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {moreOpen && (
                  <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border border-border py-1 z-50 min-w-[180px] right-0">
                    <Link
                      href="/gift-registry"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm text-medium hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {t("nav.registry")}
                    </Link>
                    <Link
                      href="/group-gift"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm text-medium hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {t("nav.groupGift")}
                    </Link>
                    <Link
                      href="/shop-together"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm text-medium hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {t("nav.shopTogether")}
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setMoreOpen(false)}
                      className="block px-4 py-2.5 text-sm text-medium hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {t("nav.profile")}
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="border-t border-border my-1" />
                        <Link
                          href="/admin"
                          onClick={() => setMoreOpen(false)}
                          className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                        >
                          {t("nav.admin")}
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </SignedIn>
          </div>

          {/* Right Side: Language, Wishlist, Cart, Auth, Hamburger */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <SignedIn>
              <Link
                href="/wishlist"
                className="text-medium hover:text-primary transition-colors"
                title={t("nav.wishlist")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </Link>
            </SignedIn>

            <Link
              href="/cart"
              className="relative text-medium hover:text-primary transition-colors"
              title={t("nav.cart")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
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

            <SignedOut>
              <Link href="/sign-in" className="btn-primary text-sm py-2 px-4">
                {t("nav.signIn")}
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8",
                  },
                }}
              />
            </SignedIn>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden text-medium hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="container-custom py-4 space-y-1">
            <Link href="/products" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
              {t("nav.products")}
            </Link>
            <Link href="/bundles" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
              {t("nav.bundles")}
            </Link>
            <Link href="/faq" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
              {t("nav.faq")}
            </Link>
            <Link href="/contact" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
              {t("nav.contact")}
            </Link>
            <SignedIn>
              <div className="border-t border-border pt-3 mt-3 space-y-1">
                <Link href="/orders" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
                  {t("nav.orders")}
                </Link>
                <Link href="/wishlist" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
                  {t("nav.wishlist")}
                </Link>
                <Link href="/gift-registry" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
                  {t("nav.registry")}
                </Link>
                <Link href="/group-gift" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
                  {t("nav.groupGift")}
                </Link>
                <Link href="/shop-together" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
                  {t("nav.shopTogether")}
                </Link>
                <Link href="/profile" onClick={closeMobile} className="block text-medium hover:text-primary transition-colors py-2.5">
                  {t("nav.profile")}
                </Link>
                {isAdmin && (
                  <Link href="/admin" onClick={closeMobile} className="block text-primary font-medium hover:text-primary-dark transition-colors py-2.5">
                    {t("nav.admin")}
                  </Link>
                )}
              </div>
            </SignedIn>
            <SignedOut>
              <div className="border-t border-border pt-3 mt-3">
                <Link href="/sign-in" onClick={closeMobile} className="btn-primary block text-center">
                  {t("nav.signIn")}
                </Link>
              </div>
            </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
