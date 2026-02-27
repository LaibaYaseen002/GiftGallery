import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin } from "../middleware/auth";

const router = Router();

// POST /api/discounts/validate - Validate & apply discount code (User)
router.post("/validate", requireAuth, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ error: "Discount code is required" });
      return;
    }

    const { data: discount, error } = await supabase
      .from("discount_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !discount) {
      res.status(404).json({ error: "Invalid discount code" });
      return;
    }

    // Check expiry
    if (discount.expires_at && new Date(discount.expires_at) < new Date()) {
      res.status(400).json({ error: "This discount code has expired" });
      return;
    }

    // Check usage limit
    if (discount.max_uses && discount.current_uses >= discount.max_uses) {
      res.status(400).json({ error: "This discount code has reached its usage limit" });
      return;
    }

    res.json({
      data: {
        code: discount.code,
        discount_percent: discount.discount_percent,
      },
      message: `Discount code applied! ${discount.discount_percent}% off`,
    });
  } catch (err) {
    console.error("Error validating discount:", err);
    res.status(500).json({ error: "Failed to validate discount code" });
  }
});

// GET /api/discounts/admin - Get all discount codes (Admin)
router.get("/admin", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching discounts:", err);
    res.status(500).json({ error: "Failed to fetch discount codes" });
  }
});

// POST /api/discounts/admin - Create discount code (Admin)
router.post("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { code, discount_percent, expires_at, max_uses } = req.body;

    if (!code || discount_percent === undefined || discount_percent === null) {
      res.status(400).json({ error: "Code and discount_percent are required" });
      return;
    }

    if (typeof code !== "string" || code.trim().length === 0 || code.trim().length > 50) {
      res.status(400).json({ error: "Discount code must be between 1 and 50 characters" });
      return;
    }

    if (typeof discount_percent !== "number" || discount_percent < 1 || discount_percent > 100) {
      res.status(400).json({ error: "Discount percent must be between 1 and 100" });
      return;
    }

    if (max_uses !== undefined && max_uses !== null && (!Number.isInteger(max_uses) || max_uses < 1)) {
      res.status(400).json({ error: "Max uses must be a positive integer" });
      return;
    }

    if (expires_at) {
      const expiryDate = new Date(expires_at);
      if (isNaN(expiryDate.getTime())) {
        res.status(400).json({ error: "Invalid expiry date format" });
        return;
      }
    }

    const { data, error } = await supabase
      .from("discount_codes")
      .insert({
        code: code.trim().toUpperCase(),
        discount_percent,
        expires_at: expires_at || null,
        max_uses: max_uses || null,
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes("duplicate")) {
        res.status(400).json({ error: "A discount code with this name already exists" });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Discount code created" });
  } catch (err) {
    console.error("Error creating discount:", err);
    res.status(500).json({ error: "Failed to create discount code" });
  }
});

// PUT /api/discounts/admin/:id - Update discount code (Admin)
router.put("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, discount_percent, is_active, expires_at, max_uses } = req.body;

    if (discount_percent !== undefined && (typeof discount_percent !== "number" || discount_percent < 1 || discount_percent > 100)) {
      res.status(400).json({ error: "Discount percent must be between 1 and 100" });
      return;
    }

    if (max_uses !== undefined && max_uses !== null && (!Number.isInteger(max_uses) || max_uses < 1)) {
      res.status(400).json({ error: "Max uses must be a positive integer" });
      return;
    }

    if (code !== undefined && (typeof code !== "string" || code.trim().length === 0 || code.trim().length > 50)) {
      res.status(400).json({ error: "Discount code must be between 1 and 50 characters" });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (code !== undefined) updates.code = code.trim().toUpperCase();
    if (discount_percent !== undefined) updates.discount_percent = discount_percent;
    if (is_active !== undefined) updates.is_active = is_active;
    if (expires_at !== undefined) updates.expires_at = expires_at;
    if (max_uses !== undefined) updates.max_uses = max_uses;

    const { data, error } = await supabase
      .from("discount_codes")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Discount code updated" });
  } catch (err) {
    console.error("Error updating discount:", err);
    res.status(500).json({ error: "Failed to update discount code" });
  }
});

// DELETE /api/discounts/admin/:id - Delete discount code (Admin)
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("discount_codes")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Discount code deleted" });
  } catch (err) {
    console.error("Error deleting discount:", err);
    res.status(500).json({ error: "Failed to delete discount code" });
  }
});

export default router;
