import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-custom py-20 text-center">
      <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-bold text-dark mb-4">Page Not Found</h2>
      <p className="text-medium mb-8 max-w-md mx-auto">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved. Let&apos;s get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/" className="btn-primary">
          Go Home
        </Link>
        <Link href="/products" className="btn-secondary">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
