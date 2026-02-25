"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { productsApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productsApi
      .getById(id)
      .then((res) => {
        setProduct(res.data as Product);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-medium mb-6">
          The product you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link href="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-medium mb-6">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary">
          Products
        </Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-primary"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-dark">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-border">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-dark px-4 py-2 rounded-full text-lg font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {product.category && (
            <Link
              href={`/category/${product.category.slug}`}
              className="text-sm text-primary font-medium hover:text-primary-dark"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold text-dark mt-1 mb-4">
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-primary mb-6">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-medium leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className={`w-3 h-3 rounded-full ${
                product.in_stock ? "bg-success" : "bg-error"
              }`}
            />
            <span className={product.in_stock ? "text-success" : "text-error"}>
              {product.in_stock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          {product.in_stock && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-lg hover:bg-light transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 font-medium min-w-[50px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-lg hover:bg-light transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn-primary flex-1 text-lg py-3"
              >
                {added ? "Added!" : "Add to Cart"}
              </button>
            </div>
          )}

          {/* Product Meta */}
          <div className="border-t border-border pt-6 mt-6 space-y-2 text-sm text-medium">
            <p>
              <span className="font-medium text-dark">Category:</span>{" "}
              {product.category ? product.category.name : "Uncategorized"}
            </p>
            <p>
              <span className="font-medium text-dark">Product ID:</span>{" "}
              {product.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
