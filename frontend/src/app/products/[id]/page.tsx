export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">Product Detail</h1>
      <p className="text-medium">Viewing product #{id}. Detailed product information, images, and add-to-cart functionality coming soon. Will be implemented in feature-products branch.</p>
    </div>
  );
}
