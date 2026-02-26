import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/categories - Get all categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/categories/:slug/products - Get products by category slug
router.get("/:slug/products", async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    // First get the category
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (catError || !category) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    // Then get products in that category
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });

    if (prodError) {
      res.status(500).json({ error: prodError.message });
      return;
    }

    const mapped = (products || []).map((p: Record<string, unknown>) => ({
      ...p,
      category: p.categories,
      categories: undefined,
    }));

    res.json({ data: mapped, category });
  } catch (err) {
    console.error("Error fetching category products:", err);
    res.status(500).json({ error: "Failed to fetch category products" });
  }
});

// POST /api/categories - Create category (Admin)
router.post("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, slug, image_url } = req.body;

    if (!name || !slug) {
      res.status(400).json({ error: "Name and slug are required." });
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert({ name, slug: slug.toLowerCase(), image_url: image_url || null })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        res.status(409).json({ error: "A category with this name or slug already exists." });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Category created successfully." });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).json({ error: "Failed to create category." });
  }
});

// PUT /api/categories/:id - Update category (Admin)
router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, slug, image_url } = req.body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (slug !== undefined) updates.slug = slug.toLowerCase();
    if (image_url !== undefined) updates.image_url = image_url || null;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No fields to update." });
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        res.status(409).json({ error: "A category with this name or slug already exists." });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Category updated successfully." });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ error: "Failed to update category." });
  }
});

// DELETE /api/categories/:id - Delete category (Admin)
router.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if any products use this category
    const { count, error: countError } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      res.status(500).json({ error: countError.message });
      return;
    }

    if (count && count > 0) {
      res.status(409).json({
        error: `Cannot delete: ${count} product${count > 1 ? "s" : ""} belong to this category. Remove or reassign them first.`,
      });
      return;
    }

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).json({ error: "Failed to delete category." });
  }
});

export default router;
