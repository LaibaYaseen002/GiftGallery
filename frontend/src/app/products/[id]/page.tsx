import { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getProduct(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Product Not Found | Gift Gallery" };
  }

  const description = product.description
    ? product.description.slice(0, 160)
    : `Shop ${product.name} at Gift Gallery. Find the perfect gift for any occasion.`;

  return {
    title: `${product.name} | Gift Gallery`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.image_url ? [{ url: product.image_url }] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
