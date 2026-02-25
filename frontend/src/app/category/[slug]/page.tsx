export default async function CategoryProductsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">Category Products</h1>
      <p className="text-medium">Browsing products in the &quot;{slug}&quot; category. Filtered product listings coming soon. Will be implemented in feature-categories branch.</p>
    </div>
  );
}
