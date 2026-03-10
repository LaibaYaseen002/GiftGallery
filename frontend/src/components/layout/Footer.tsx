"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container-custom py-6 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-base">🎁</span>
              <span className="text-sm font-bold text-primary">Gift Gallery</span>
            </div>
            <p className="text-gray-400 text-xs">
              Your one-stop shop for unique gifts and accessories. Find the
              perfect present for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/products" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/jewelry" className="hover:text-primary transition-colors">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/category/watches" className="hover:text-primary transition-colors">
                  Watches
                </Link>
              </li>
              <li>
                <Link href="/category/perfumes" className="hover:text-primary transition-colors">
                  Perfumes
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xs font-semibold mb-3 text-white">Customer Service</h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>
                <Link href="/faq" className="hover:text-primary transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary transition-colors">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xs font-semibold mb-3 text-white">Contact</h3>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li>Email: support@giftgallery.com</li>
              <li>Phone: +92 300 1234567</li>
              <li>Lahore, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-5 pt-5 text-center text-2xs sm:text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Gift Gallery. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
