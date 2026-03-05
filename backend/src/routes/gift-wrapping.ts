import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/gift-wrapping - Get all active wrapping/packaging options (Public)
router.get("/", async (req: Request, res: Response) => {
  try {
    let query = supabase
      .from("gift_wrapping_options")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const { type } = req.query;
    if (type === "wrapping" || type === "packaging") {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching gift wrapping options:", err);
    res.status(500).json({ error: "Failed to fetch gift wrapping options" });
  }
});

// GET /api/gift-wrapping/:id - Get single option by id (Public)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("gift_wrapping_options")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: "Gift wrapping option not found" });
      return;
    }

    res.json({ data });
  } catch (err) {
    console.error("Error fetching gift wrapping option:", err);
    res.status(500).json({ error: "Failed to fetch gift wrapping option" });
  }
});

// POST /api/gift-wrapping/admin - Create new option (Admin)
router.post("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, image_url, price, type, color, theme, is_eco_friendly } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    if (price === undefined || price === null || typeof price !== "number" || price < 0) {
      res.status(400).json({ error: "Price must be a non-negative number" });
      return;
    }

    const validTypes = ["wrapping", "packaging"];
    if (!type || !validTypes.includes(type)) {
      res.status(400).json({ error: `Type is required and must be one of: ${validTypes.join(", ")}` });
      return;
    }

    const { data, error } = await supabase
      .from("gift_wrapping_options")
      .insert({
        name: name.trim(),
        description: description || null,
        image_url: image_url || null,
        price,
        type,
        color: color || null,
        theme: theme || null,
        is_eco_friendly: !!is_eco_friendly,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Gift wrapping option created" });
  } catch (err) {
    console.error("Error creating gift wrapping option:", err);
    res.status(500).json({ error: "Failed to create gift wrapping option" });
  }
});

// PUT /api/gift-wrapping/admin/:id - Update option (Admin)
router.put("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, price, type, color, theme, is_eco_friendly, is_active } = req.body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      res.status(400).json({ error: "Name must be a non-empty string" });
      return;
    }

    if (price !== undefined && (typeof price !== "number" || price < 0)) {
      res.status(400).json({ error: "Price must be a non-negative number" });
      return;
    }

    const validTypes = ["wrapping", "packaging"];
    if (type !== undefined && !validTypes.includes(type)) {
      res.status(400).json({ error: `Type must be one of: ${validTypes.join(", ")}` });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (image_url !== undefined) updates.image_url = image_url;
    if (price !== undefined) updates.price = price;
    if (type !== undefined) updates.type = type;
    if (color !== undefined) updates.color = color;
    if (theme !== undefined) updates.theme = theme;
    if (is_eco_friendly !== undefined) updates.is_eco_friendly = is_eco_friendly;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from("gift_wrapping_options")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Gift wrapping option updated" });
  } catch (err) {
    console.error("Error updating gift wrapping option:", err);
    res.status(500).json({ error: "Failed to update gift wrapping option" });
  }
});

// DELETE /api/gift-wrapping/admin/:id - Delete option (Admin)
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("gift_wrapping_options")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Gift wrapping option deleted" });
  } catch (err) {
    console.error("Error deleting gift wrapping option:", err);
    res.status(500).json({ error: "Failed to delete gift wrapping option" });
  }
});

export default router;
