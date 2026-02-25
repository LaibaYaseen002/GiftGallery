import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";

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

export default router;
