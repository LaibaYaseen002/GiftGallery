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
    <div className="flex gap-4 py-4 border-b border-border last:border-b-0">
      {/* Product Image */}
      <Link href={`/products/${product.id}`} className="shrink-0">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product.id}`}
          className="font-semibold text-dark hover:text-primary transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        {product.category && (
          <p className="text-sm text-medium">{product.category.name}</p>
        )}
        <p className="text-primary font-bold mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="px-3 py-1 text-medium hover:text-dark hover:bg-light transition-colors rounded-l-lg"
          >
            -
          </button>
          <span className="px-3 py-1 font-medium text-dark min-w-[40px] text-center">
            {quantity}
          </span>
          <button
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="px-3 py-1 text-medium hover:text-dark hover:bg-light transition-colors rounded-r-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Subtotal + Remove */}
      <div className="flex flex-col items-end justify-between">
        <span className="font-bold text-dark">
          ${(product.price * quantity).toFixed(2)}
        </span>
        <button
          onClick={() => removeItem(product.id)}
          className="text-sm text-error hover:text-red-700 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
