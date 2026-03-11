"use client";

import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import ProductImage from "@/components/ui/ProductImage";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { formatPrice } = useLanguage();

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-secondary to-light">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Out of Stock overlay */}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center">
              <span className="bg-white/90 text-dark px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                Sold Out
              </span>
            </div>
          )}

          {/* Category badge */}
          {product.category && (
            <div className="absolute top-2 left-2">
              <span className="bg-white/85 backdrop-blur-sm text-dark px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm">
                {product.category.name}
              </span>
            </div>
          )}

          {/* Wishlist button */}
          <div className="absolute top-2 right-2 bg-white/85 backdrop-blur-sm rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <WishlistButton productId={product.id} size="sm" />
          </div>
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-3">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark text-xs leading-tight hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-medium text-[10px] mt-1 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Price + Cart row */}
        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-border/40">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary leading-none">
              {formatPrice(product.price)}
            </span>
          </div>
          <button
            onClick={() => { addItem(product); showToast("Added to cart!", "success"); }}
            disabled={!product.in_stock}
            className="bg-primary hover:bg-primary-dark text-white text-[10px] font-medium px-2.5 py-1 rounded-full
                       disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200 hover:shadow-md active:scale-95"
          >
            + Cart
          </button>
        </div>
      </div>
    </div>
  );
}
