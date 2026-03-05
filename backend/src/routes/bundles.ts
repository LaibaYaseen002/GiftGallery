import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin, getUserId } from "../middleware/auth";

const router = Router();

// GET /api/bundles - Get all active bundles (Public)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { occasion } = req.query;

    let query = supabase
      .from("product_bundles")
      .select("*, bundle_items(id, bundle_id, product_id, quantity, products(id, name, price, image_url))")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (occasion && typeof occasion === "string") {
      query = query.eq("occasion", occasion);
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching bundles:", err);
    res.status(500).json({ error: "Failed to fetch bundles" });
  }
});

// GET /api/bundles/:id - Get single bundle with items (Public)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("product_bundles")
      .select("*, bundle_items(id, bundle_id, product_id, quantity, products(id, name, price, image_url))")
      .eq("id", id)
      .single();

    if (error) {
      res.status(404).json({ error: "Bundle not found" });
      return;
    }

    res.json({ data });
  } catch (err) {
    console.error("Error fetching bundle:", err);
    res.status(500).json({ error: "Failed to fetch bundle" });
  }
});

// POST /api/bundles/admin - Create bundle with items (Admin)
router.post("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, image_url, occasion, discount_percent, items } = req.body;

    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Name and at least one item are required" });
      return;
    }

    const userId = getUserId(req);

    // Insert the bundle
    const { data: bundle, error: bundleError } = await supabase
      .from("product_bundles")
      .insert({
        name,
        description: description || null,
        image_url: image_url || null,
        occasion: occasion || null,
        discount_percent: discount_percent || 0,
        is_active: true,
        created_by: userId,
      })
      .select()
      .single();

    if (bundleError) {
      res.status(500).json({ error: bundleError.message });
      return;
    }

    // Insert bundle items
    const bundleItems = items.map((item: { product_id: string; quantity: number }) => ({
      bundle_id: bundle.id,
      product_id: item.product_id,
      quantity: item.quantity || 1,
    }));

    const { error: itemsError } = await supabase
      .from("bundle_items")
      .insert(bundleItems);

    if (itemsError) {
      // Clean up the bundle if items insertion fails
      await supabase.from("product_bundles").delete().eq("id", bundle.id);
      res.status(500).json({ error: itemsError.message });
      return;
    }

    // Fetch the complete bundle with items
    const { data: fullBundle } = await supabase
      .from("product_bundles")
      .select("*, bundle_items(id, bundle_id, product_id, quantity, products(id, name, price, image_url))")
      .eq("id", bundle.id)
      .single();

    res.status(201).json({ data: fullBundle, message: "Bundle created successfully" });
  } catch (err) {
    console.error("Error creating bundle:", err);
    res.status(500).json({ error: "Failed to create bundle" });
  }
});

// PUT /api/bundles/admin/:id - Update bundle (Admin)
router.put("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, occasion, discount_percent, is_active, items } = req.body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (occasion !== undefined) updates.occasion = occasion;
    if (discount_percent !== undefined) updates.discount_percent = discount_percent;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data: bundle, error: bundleError } = await supabase
      .from("product_bundles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (bundleError) {
      res.status(500).json({ error: bundleError.message });
      return;
    }

    // Optionally update items (delete old, insert new)
    if (items && Array.isArray(items)) {
      const { error: deleteError } = await supabase
        .from("bundle_items")
        .delete()
        .eq("bundle_id", id);

      if (deleteError) {
        res.status(500).json({ error: deleteError.message });
        return;
      }

      const bundleItems = items.map((item: { product_id: string; quantity: number }) => ({
        bundle_id: id,
        product_id: item.product_id,
        quantity: item.quantity || 1,
      }));

      const { error: insertError } = await supabase
        .from("bundle_items")
        .insert(bundleItems);

      if (insertError) {
        res.status(500).json({ error: insertError.message });
        return;
      }
    }

    // Fetch the complete updated bundle
    const { data: fullBundle } = await supabase
      .from("product_bundles")
      .select("*, bundle_items(id, bundle_id, product_id, quantity, products(id, name, price, image_url))")
      .eq("id", id)
      .single();

    res.json({ data: fullBundle, message: "Bundle updated successfully" });
  } catch (err) {
    console.error("Error updating bundle:", err);
    res.status(500).json({ error: "Failed to update bundle" });
  }
});

// DELETE /api/bundles/admin/:id - Delete bundle (Admin)
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("product_bundles")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Bundle deleted successfully" });
  } catch (err) {
    console.error("Error deleting bundle:", err);
    res.status(500).json({ error: "Failed to delete bundle" });
  }
});

export default router;
