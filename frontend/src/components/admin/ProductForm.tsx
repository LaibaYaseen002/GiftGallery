"use client";

import { useState, useEffect } from "react";
import { Product, Category } from "@/types";
import { categoriesApi } from "@/lib/api";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: {
    name: string;
    description: string;
    price: string;
    image_url: string;
    category_id: string;
    in_stock: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [inStock, setInStock] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!product;

  useEffect(() => {
    categoriesApi.getAll().then((res) => setCategories(res.data || []));
  }, []);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description || "");
      setPrice(String(product.price));
      setImageUrl(product.image_url);
      setCategoryId(product.category_id || "");
      setInStock(product.in_stock);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !price || !imageUrl.trim()) {
      setError("Name, price, and image URL are required");
      return;
    }

    if (parseFloat(price) <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        price,
        image_url: imageUrl.trim(),
        category_id: categoryId,
        in_stock: inStock,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-dark mb-1">
          Product Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Gold Pearl Necklace"
          className="input-field"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="desc" className="block text-sm font-medium text-dark mb-1">
          Description <span className="text-medium font-normal">(optional)</span>
        </label>
        <textarea
          id="desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product description..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      {/* Price & Category row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-dark mb-1">
            Price ($)
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="29.99"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-dark mb-1">
            Category
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input-field"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-dark mb-1">
          Image URL
        </label>
        <input
          id="image"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://images.unsplash.com/..."
          className="input-field"
        />
        {imageUrl && (
          <div className="mt-2 rounded-lg overflow-hidden border border-border w-24 h-24">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* In Stock Toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-success"></div>
        </label>
        <span className="text-sm font-medium text-dark">
          {inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {error && <p className="text-sm text-error">{error}</p>}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  );
}
