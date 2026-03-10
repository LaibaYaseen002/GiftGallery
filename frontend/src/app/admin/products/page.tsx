"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { productsApi } from "@/lib/api";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminProductsPage() {
  const { getToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await productsApi.getAll({ limit: 200 });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await productsApi.delete(id, token);
      setDeleteId(null);
      await fetchProducts();
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  };

  const filteredProducts = search
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <h1 className="page-title mb-0">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          className="input-field max-w-md"
        />
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-dark mb-2">
            {search ? "No products match your search" : "No products yet"}
          </h2>
          <p className="text-medium mb-4">
            {search
              ? "Try a different search term."
              : "Add your first product to get started."}
          </p>
          {!search && (
            <Link href="/admin/products/new" className="btn-primary">
              + Add Product
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="card p-4">
              <div className="flex items-center gap-4">
                {/* Image */}
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0 relative">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-dark truncate">
                      {product.name}
                    </h3>
                    {!product.in_stock && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-4 text-xs text-medium">
                    <span className="font-medium text-primary">
                      ${Number(product.price).toFixed(2)}
                    </span>
                    {product.category && (
                      <span>{product.category.name}</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="px-3 py-1.5 text-xs font-medium text-error border border-error rounded-lg hover:bg-error hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Product"
      >
        <p className="text-medium mb-4">
          Are you sure you want to delete this product? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => deleteId && handleDelete(deleteId)}
            className="flex-1 bg-error text-white px-4 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Delete
          </button>
          <button
            onClick={() => setDeleteId(null)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}
