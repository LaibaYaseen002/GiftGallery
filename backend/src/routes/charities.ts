import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin, getUserId } from "../middleware/auth";

const router = Router();

// GET /api/charities - Get all active charities (Public)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching charities:", err);
    res.status(500).json({ error: "Failed to fetch charities" });
  }
});

// GET /api/charities/donations/my - Get user's donation history (Auth)
router.get("/donations/my", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data, error } = await supabase
      .from("charity_donations")
      .select("*, charities(id, name, description, logo_url, website_url)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    const donations = (data || []).map((item: Record<string, unknown>) => ({
      id: item.id,
      order_id: item.order_id,
      charity_id: item.charity_id,
      user_id: item.user_id,
      amount: item.amount,
      percentage: item.percentage,
      created_at: item.created_at,
      charity: item.charities,
    }));

    res.json({ data: donations });
  } catch (err) {
    console.error("Error fetching donation history:", err);
    res.status(500).json({ error: "Failed to fetch donation history" });
  }
});

// POST /api/charities/admin - Create charity (Admin)
router.post("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, logo_url, website_url } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      res.status(400).json({ error: "Name is required" });
      return;
    }

    const { data, error } = await supabase
      .from("charities")
      .insert({
        name: name.trim(),
        description: description || null,
        logo_url: logo_url || null,
        website_url: website_url || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Charity created" });
  } catch (err) {
    console.error("Error creating charity:", err);
    res.status(500).json({ error: "Failed to create charity" });
  }
});

// PUT /api/charities/admin/:id - Update charity (Admin)
router.put("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, logo_url, website_url, is_active } = req.body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      res.status(400).json({ error: "Name must be a non-empty string" });
      return;
    }

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description;
    if (logo_url !== undefined) updates.logo_url = logo_url;
    if (website_url !== undefined) updates.website_url = website_url;
    if (is_active !== undefined) updates.is_active = is_active;

    const { data, error } = await supabase
      .from("charities")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Charity updated" });
  } catch (err) {
    console.error("Error updating charity:", err);
    res.status(500).json({ error: "Failed to update charity" });
  }
});

// DELETE /api/charities/admin/:id - Delete charity (Admin)
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("charities")
      .delete()
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Charity deleted" });
  } catch (err) {
    console.error("Error deleting charity:", err);
    res.status(500).json({ error: "Failed to delete charity" });
  }
});

export default router;
