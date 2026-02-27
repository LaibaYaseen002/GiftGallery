"use client";

import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/Toast";
import ProductImage from "@/components/ui/ProductImage";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  return (
    <div className="card overflow-hidden group">
      <Link href={`/products/${product.id}`}>
        <div className="relative w-full h-56 overflow-hidden">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-dark px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm">
            <WishlistButton productId={product.id} size="sm" />
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-dark text-lg mb-1 hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {product.category && (
          <Link
            href={`/category/${product.category.slug}`}
            className="text-sm text-medium hover:text-primary transition-colors"
          >
            {product.category.name}
          </Link>
        )}
        <p className="text-medium text-sm mt-1 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={() => { addItem(product); showToast("Added to cart!", "success"); }}
            disabled={!product.in_stock}
            className="btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
