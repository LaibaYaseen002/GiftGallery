export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="container-custom py-8">
      <h1 className="page-title">Order Detail</h1>
      <p className="text-medium">Viewing order #{id}. Detailed order information, tracking, and status updates coming soon. Will be implemented in feature-orders branch.</p>
    </div>
  );
}
