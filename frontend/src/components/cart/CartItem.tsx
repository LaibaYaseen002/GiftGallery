"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 py-3 border-b border-border last:border-b-0">
      <div className="flex gap-3 flex-1 min-w-0">
        {/* Product Image */}
        <Link href={`/products/${product.id}`} className="shrink-0">
          <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-lg overflow-hidden border border-border">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 64px, 96px"
            />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="font-semibold text-dark text-xs hover:text-primary transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          {product.category && (
            <p className="text-xs text-medium">{product.category.name}</p>
          )}
          <p className="text-primary font-bold text-xs mt-1">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Quantity + Subtotal + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="px-2 py-0.5 text-xs text-medium hover:text-dark hover:bg-light transition-colors rounded-l-lg"
          >
            -
          </button>
          <span className="px-2 py-0.5 text-xs font-medium text-dark min-w-[28px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="px-2 py-0.5 text-xs text-medium hover:text-dark hover:bg-light transition-colors rounded-r-lg"
          >
            +
          </button>
        </div>

        {/* Subtotal + Remove */}
        <div className="flex flex-col items-end gap-1">
          <span className="font-bold text-dark text-xs">
            ${(product.price * quantity).toFixed(2)}
          </span>
          <button
            onClick={() => removeItem(product.id)}
            className="text-xs text-error hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
