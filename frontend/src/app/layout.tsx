import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Gift Gallery - Online Gift & Accessories Store",
    template: "%s | Gift Gallery",
  },
  description:
    "Browse and shop unique gifts, jewelry, watches, perfumes, bags, and more at Gift Gallery. Free shipping on all orders.",
  keywords: ["gifts", "jewelry", "watches", "perfumes", "bags", "accessories", "online store"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#B76E79",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
