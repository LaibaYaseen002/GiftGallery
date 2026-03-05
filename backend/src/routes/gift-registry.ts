import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, getUserId } from "../middleware/auth";
import crypto from "crypto";

const router = Router();

// GET /api/gift-registry/my - Get current user's registries
router.get("/my", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data, error } = await supabase
      .from("gift_registries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data });
  } catch (err) {
    console.error("Error fetching registries:", err);
    res.status(500).json({ error: "Failed to fetch registries" });
  }
});

// GET /api/gift-registry/shared/:shareCode - Get registry by share code (public)
router.get("/shared/:shareCode", async (req: Request, res: Response) => {
  try {
    const { shareCode } = req.params;

    const { data: registry, error: registryError } = await supabase
      .from("gift_registries")
      .select("*")
      .eq("share_code", shareCode)
      .eq("is_public", true)
      .single();

    if (registryError || !registry) {
      res.status(404).json({ error: "Registry not found" });
      return;
    }

    const { data: items, error: itemsError } = await supabase
      .from("gift_registry_items")
      .select("*, products(*)")
      .eq("registry_id", registry.id);

    if (itemsError) {
      res.status(500).json({ error: itemsError.message });
      return;
    }

    res.json({ data: { ...registry, items: items || [] } });
  } catch (err) {
    console.error("Error fetching shared registry:", err);
    res.status(500).json({ error: "Failed to fetch shared registry" });
  }
});

// GET /api/gift-registry/:id - Get registry by id (owner only)
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { id } = req.params;

    const { data: registry, error: registryError } = await supabase
      .from("gift_registries")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (registryError || !registry) {
      res.status(404).json({ error: "Registry not found" });
      return;
    }

    const { data: items, error: itemsError } = await supabase
      .from("gift_registry_items")
      .select("*, products(*)")
      .eq("registry_id", registry.id);

    if (itemsError) {
      res.status(500).json({ error: itemsError.message });
      return;
    }

    res.json({ data: { ...registry, items: items || [] } });
  } catch (err) {
    console.error("Error fetching registry:", err);
    res.status(500).json({ error: "Failed to fetch registry" });
  }
});

// POST /api/gift-registry - Create a new registry
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { event_name, event_date, event_type, description } = req.body;

    if (!event_name) {
      res.status(400).json({ error: "event_name is required" });
      return;
    }

    const share_code = crypto.randomBytes(4).toString("hex");

    const { data, error } = await supabase
      .from("gift_registries")
      .insert({
        user_id: userId,
        event_name,
        event_date,
        event_type,
        description,
        share_code,
        is_public: true,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Registry created" });
  } catch (err) {
    console.error("Error creating registry:", err);
    res.status(500).json({ error: "Failed to create registry" });
  }
});

// POST /api/gift-registry/:id/items - Add item to registry (owner only)
router.post("/:id/items", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { id } = req.params;
    const { product_id, quantity_requested } = req.body;

    if (!product_id || !quantity_requested) {
      res.status(400).json({ error: "product_id and quantity_requested are required" });
      return;
    }

    // Verify ownership
    const { data: registry, error: registryError } = await supabase
      .from("gift_registries")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (registryError || !registry) {
      res.status(404).json({ error: "Registry not found" });
      return;
    }

    const { data, error } = await supabase
      .from("gift_registry_items")
      .insert({
        registry_id: id,
        product_id,
        quantity_requested,
        quantity_purchased: 0,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Item added to registry" });
  } catch (err) {
    console.error("Error adding item to registry:", err);
    res.status(500).json({ error: "Failed to add item to registry" });
  }
});

// DELETE /api/gift-registry/:id/items/:itemId - Remove item from registry (owner only)
router.delete("/:id/items/:itemId", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { id, itemId } = req.params;

    // Verify ownership
    const { data: registry, error: registryError } = await supabase
      .from("gift_registries")
      .select("id")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (registryError || !registry) {
      res.status(404).json({ error: "Registry not found" });
      return;
    }

    const { error } = await supabase
      .from("gift_registry_items")
      .delete()
      .eq("id", itemId)
      .eq("registry_id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Item removed from registry" });
  } catch (err) {
    console.error("Error removing item from registry:", err);
    res.status(500).json({ error: "Failed to remove item from registry" });
  }
});

// POST /api/gift-registry/shared/:shareCode/purchase/:itemId - Purchase an item from a registry
router.post("/shared/:shareCode/purchase/:itemId", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { shareCode, itemId } = req.params;

    // Verify registry exists and is public
    const { data: registry, error: registryError } = await supabase
      .from("gift_registries")
      .select("id")
      .eq("share_code", shareCode)
      .eq("is_public", true)
      .single();

    if (registryError || !registry) {
      res.status(404).json({ error: "Registry not found" });
      return;
    }

    // Get the item and check it belongs to this registry
    const { data: item, error: itemError } = await supabase
      .from("gift_registry_items")
      .select("*")
      .eq("id", itemId)
      .eq("registry_id", registry.id)
      .single();

    if (itemError || !item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    if (item.quantity_purchased >= item.quantity_requested) {
      res.status(400).json({ error: "Item already fully purchased" });
      return;
    }

    const { data, error } = await supabase
      .from("gift_registry_items")
      .update({
        quantity_purchased: item.quantity_purchased + 1,
        purchased_by: userId,
      })
      .eq("id", itemId)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Item purchased" });
  } catch (err) {
    console.error("Error purchasing registry item:", err);
    res.status(500).json({ error: "Failed to purchase registry item" });
  }
});

// DELETE /api/gift-registry/:id - Delete registry (owner only)
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { id } = req.params;

    const { error } = await supabase
      .from("gift_registries")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Registry deleted" });
  } catch (err) {
    console.error("Error deleting registry:", err);
    res.status(500).json({ error: "Failed to delete registry" });
  }
});

export default router;
