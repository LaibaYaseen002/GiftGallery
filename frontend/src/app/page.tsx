export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary to-accent/10 py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl font-bold text-dark mb-4">
            Welcome to <span className="text-primary">Gift Gallery</span>
          </h1>
          <p className="text-xl text-medium mb-8 max-w-2xl mx-auto">
            Discover the perfect gifts for every occasion. From jewelry to
            watches, perfumes to accessories — find something special for
            everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/products" className="btn-primary text-lg">
              Shop Now
            </a>
            <a href="/category/jewelry" className="btn-secondary text-lg">
              Browse Categories
            </a>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="section-title text-center">Shop by Category</h2>
          <p className="text-medium text-center mb-10">
            Find the perfect gift from our curated collections
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["Jewelry", "Clothes", "Watches", "Perfumes", "Bags", "Other Gifts"].map(
              (cat) => (
                <div key={cat} className="card p-6 text-center cursor-pointer">
                  <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <span className="text-2xl text-primary">🎁</span>
                  </div>
                  <p className="font-medium text-dark">{cat}</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Placeholder */}
      <section className="py-16 bg-light">
        <div className="container-custom">
          <h2 className="section-title text-center">Featured Products</h2>
          <p className="text-medium text-center mb-10">
            Our most popular gifts loved by customers
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-4">
                <div className="w-full h-48 bg-border rounded-lg mb-4 animate-pulse" />
                <div className="h-4 bg-border rounded w-3/4 mb-2 animate-pulse" />
                <div className="h-4 bg-border rounded w-1/2 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
