"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Category } from "@/types";
import { productsApi, categoriesApi } from "@/lib/api";
import ProductCard from "@/components/products/ProductCard";
import FlashSaleBanner from "@/components/FlashSaleBanner";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    categoriesApi
      .getAll()
      .then((res) => setCategories((res.data as Category[]) || []))
      .catch(() => setCategories([]));

    productsApi
      .getAll()
      .then((res) => {
        const all = (res.data as Product[]) || [];
        setFeaturedProducts(all.slice(0, 8));
      })
      .catch(() => setFeaturedProducts([]));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-dark mb-4">
            Welcome to <span className="text-primary">Gift Gallery</span>
          </h1>
          <p className="text-xl text-medium mb-8 max-w-2xl mx-auto">
            Discover the perfect gifts for every occasion. From jewelry to
            watches, perfumes to accessories — find something special for
            everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg">
              Shop Now
            </Link>
            <Link href="/products" className="btn-secondary text-lg">
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Flash Sale Banner */}
      <FlashSaleBanner />

      {/* Categories */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center">Shop by Category</h2>
          <p className="text-medium text-center mb-10">
            Find the perfect gift from our curated collections
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {categories.length > 0
              ? categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="card p-4 text-center cursor-pointer group"
                  >
                    <div className="relative w-full h-28 rounded-lg overflow-hidden mb-3">
                      {cat.image_url ? (
                        <Image
                          src={cat.image_url}
                          alt={cat.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <span className="text-3xl">🎁</span>
                        </div>
                      )}
                    </div>
                    <p className="font-medium text-dark group-hover:text-primary transition-colors text-sm">
                      {cat.name}
                    </p>
                  </Link>
                ))
              : // Skeleton placeholders while loading
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <div key={i} className="card p-4 text-center">
                    <div className="w-full h-28 bg-border rounded-lg mb-3 animate-pulse" />
                    <div className="h-4 bg-border rounded w-3/4 mx-auto animate-pulse" />
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <h2 className="section-title text-center">Featured Products</h2>
          <p className="text-medium text-center mb-10">
            Our most popular gifts loved by customers
          </p>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-4">
                  <div className="w-full h-56 bg-border rounded-lg mb-4 animate-pulse" />
                  <div className="h-4 bg-border rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-border rounded w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link href="/products" className="btn-primary text-lg">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center">Why Choose Gift Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Curated Gifts</h3>
              <p className="text-medium">Handpicked products for every occasion and every budget.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75M3.375 14.25h2.25M3.375 14.25V4.875c0-.621.504-1.125 1.125-1.125h14.25c.621 0 1.125.504 1.125 1.125v5.25M18.75 14.25h-2.25m0 0V9.375" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-medium">Quick and reliable shipping to your doorstep.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Shopping</h3>
              <p className="text-medium">Safe and secure checkout with easy returns.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
