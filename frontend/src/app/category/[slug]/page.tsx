"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Product, Category } from "@/types";
import { categoriesApi } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function CategoryProductsPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    categoriesApi
      .getProducts(slug)
      .then((res) => {
        const response = res as { data: Product[]; category: Category };
        setProducts(response.data || []);
        setCategory(response.category || null);
      })
      .catch((err) => {
        console.error("Failed to fetch category products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  if (!category) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
        <p className="text-medium mb-6">
          The category &quot;{slug}&quot; doesn&apos;t exist.
        </p>
        <Link href="/products" className="btn-primary">
          Browse All Products
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
        <span className="mx-2">/</span>
        <span className="text-dark">{category.name}</span>
      </nav>

      <h1 className="page-title">{category.name}</h1>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-medium mb-4">
            No products in this category yet.
          </p>
          <Link href="/products" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      ) : (
        <>
          <p className="text-medium mb-6">
            {products.length} product{products.length !== 1 ? "s" : ""} in{" "}
            {category.name}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
