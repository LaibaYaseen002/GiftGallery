"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Product } from "@/types";
import { productsApi } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { getToken } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productsApi
      .getById(id)
      .then((res) => setProduct(res.data as Product))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data: {
    name: string;
    description: string;
    price: string;
    image_url: string;
    category_id: string;
    in_stock: boolean;
  }) => {
    const token = await getToken();
    if (!token) return;
    await productsApi.update(id, data, token);
    router.push("/admin/products");
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-22" />;
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold mb-4">Product Not Found</h1>
        <Link href="/admin/products" className="btn-primary">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-xs text-medium hover:text-primary mb-4 inline-block"
      >
        &larr; Back to Products
      </Link>
      <h1 className="page-title">Edit Product</h1>

      <div className="max-w-xl">
        <div className="card p-4">
          <ProductForm
            product={product}
            onSubmit={handleUpdate}
            onCancel={() => router.push("/admin/products")}
          />
        </div>
      </div>
    </div>
  );
}
