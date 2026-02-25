import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, getUserId } from "../middleware/auth";

const router = Router();

// GET /api/wishlist - Get user's wishlist with product details
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data, error } = await supabase
      .from("wishlist")
      .select("*, products(*, categories(id, name, slug))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Map the joined data
    const items = (data || []).map((item: Record<string, unknown>) => {
      const product = item.products as Record<string, unknown> | null;
      return {
        id: item.id,
        user_id: item.user_id,
        product_id: item.product_id,
        created_at: item.created_at,
        product: product
          ? {
              ...product,
              category: product.categories,
              categories: undefined,
            }
          : null,
      };
    });

    res.json({ data: items });
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
});

// POST /api/wishlist - Add product to wishlist
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { product_id } = req.body;

    if (!product_id) {
      res.status(400).json({ error: "product_id is required" });
      return;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .insert({ user_id: userId, product_id })
      .select()
      .single();

    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        res.status(400).json({ error: "Product already in wishlist" });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Added to wishlist" });
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
});

// DELETE /api/wishlist/:productId - Remove from wishlist
router.delete("/:productId", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { productId } = req.params;

    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
});

export default router;
