import { Metadata } from "next";
import CategoryProductsClient from "./CategoryProductsClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getCategory(slug: string) {
  try {
    const res = await fetch(`${API_URL}/categories/${slug}/products`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.category || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Category Not Found | Gift Gallery" };
  }

  return {
    title: `${category.name} | Gift Gallery`,
    description: `Browse ${category.name} gifts and accessories at Gift Gallery. Find the perfect gift for any occasion.`,
  };
}

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryProductsClient slug={slug} />;
}
