import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🎁</span>
              <span className="text-xl font-bold text-primary">Gift Gallery</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your one-stop shop for unique gifts and accessories. Find the
              perfect present for every occasion.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
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
            <h3 className="font-semibold mb-4 text-white">Customer Service</h3>
            <ul className="space-y-2 text-sm text-gray-400">
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
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: support@giftgallery.com</li>
              <li>Phone: +92 300 1234567</li>
              <li>Rahim Yar Khan, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Gift Gallery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
