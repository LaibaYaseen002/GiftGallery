import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/products - Get all products (with optional search & category filter)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { search, category } = req.query;

    let query = supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .order("created_at", { ascending: false });

    // Filter by category slug
    if (category && typeof category === "string") {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", category)
        .single();

      if (cat) {
        query = query.eq("category_id", cat.id);
      } else {
        res.json({ data: [] });
        return;
      }
    }

    // Search by name or description (sanitized)
    if (search && typeof search === "string") {
      const sanitizedSearch = search.trim().slice(0, 100);
      if (sanitizedSearch.length > 0) {
        query = query.or(
          `name.ilike.%${sanitizedSearch}%,description.ilike.%${sanitizedSearch}%`
        );
      }
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Map categories join to flat category field
    const products = (data || []).map((p: Record<string, unknown>) => ({
      ...p,
      category: p.categories,
      categories: undefined,
    }));

    res.json({ data: products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id - Get single product
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("id", id)
      .single();

    if (error) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const product = {
      ...data,
      category: data.categories,
      categories: undefined,
    };

    res.json({ data: product });
  } catch (err) {
    console.error("Error fetching product:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products - Create product (Admin)
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, price, image_url, category_id, in_stock } = req.body;

    if (!name || !price || !image_url) {
      res.status(400).json({ error: "Name, price, and image_url are required" });
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        description: description || null,
        price: parseFloat(price),
        image_url,
        category_id: category_id || null,
        in_stock: in_stock !== false,
      })
      .select("*, categories(id, name, slug)")
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({
      data: { ...data, category: data.categories, categories: undefined },
      message: "Product created successfully",
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/products/:id - Update product (Admin)
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, category_id, in_stock } = req.body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (price !== undefined) updates.price = parseFloat(price);
    if (image_url !== undefined) updates.image_url = image_url;
    if (category_id !== undefined) updates.category_id = category_id;
    if (in_stock !== undefined) updates.in_stock = in_stock;

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", id)
      .select("*, categories(id, name, slug)")
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({
      data: { ...data, category: data.categories, categories: undefined },
      message: "Product updated successfully",
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// DELETE /api/products/:id - Delete product (Admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
