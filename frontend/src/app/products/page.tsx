"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category, PaginationInfo } from "@/types";
import { productsApi, categoriesApi } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/products/ProductCard";
import Pagination from "@/components/ui/Pagination";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ProductCardSkeletonGrid } from "@/components/ui/Skeleton";

function ProductsContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    categoriesApi.getAll().then((res) => {
      setCategories((res.data as Category[]) || []);
    });
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedCategory]);

  useEffect(() => {
    setLoading(true);
    const params: { search?: string; category?: string; page?: number } = { page };
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory) params.category = selectedCategory;

    productsApi
      .getAll(params)
      .then((res) => {
        setProducts((res.data as Product[]) || []);
        setPagination(res.pagination || null);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearch, selectedCategory, page]);

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">{t("products.title")}</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <input
            type="text"
            placeholder={t("products.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="sr-only">Filter by category</label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field min-w-[180px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <ProductCardSkeletonGrid count={8} />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl mb-2">{t("products.noResults")}</p>
          <p className="text-medium">
            {search || selectedCategory
              ? "Try adjusting your search or filters."
              : "Products will appear here once they are added."}
          </p>
        </div>
      ) : (
        <>
          <p className="text-medium mb-4">
            {pagination
              ? `${pagination.total} product${pagination.total !== 1 ? "s" : ""} found`
              : `${products.length} product${products.length !== 1 ? "s" : ""} found`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {pagination && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function AllProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="py-22" />}>
      <ProductsContent />
    </Suspense>
  );
}
