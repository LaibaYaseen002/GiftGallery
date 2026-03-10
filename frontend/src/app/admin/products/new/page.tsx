"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { productsApi } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default function AddNewProductPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const handleCreate = async (data: {
    name: string;
    description: string;
    price: string;
    image_url: string;
    category_id: string;
    in_stock: boolean;
  }) => {
    const token = await getToken();
    if (!token) return;
    await productsApi.create(data, token);
    router.push("/admin/products");
  };

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-xs text-medium hover:text-primary mb-4 inline-block"
      >
        &larr; Back to Products
      </Link>
      <h1 className="page-title">Add New Product</h1>

      <div className="max-w-xl">
        <div className="card p-4">
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => router.push("/admin/products")}
          />
        </div>
      </div>
    </div>
  );
}
