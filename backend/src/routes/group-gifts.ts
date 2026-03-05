import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, getUserId } from "../middleware/auth";

const router = Router();

// GET /api/group-gifts/my - Get user's group gifts (organized by them)
router.get("/my", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data, error } = await supabase
      .from("group_gifts")
      .select("*, products(*)")
      .eq("organizer_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching group gifts:", err);
    res.status(500).json({ error: "Failed to fetch group gifts" });
  }
});

// GET /api/group-gifts/contribute/:id - Public - Get group gift details for contribution page
router.get("/contribute/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("group_gifts")
      .select("id, recipient_name, target_amount, current_amount, message, status, expires_at, organizer_id, products(id, name, price, image_url)")
      .eq("id", id)
      .single();

    if (error) {
      res.status(404).json({ error: "Group gift not found" });
      return;
    }

    res.json({
      data: {
        id: data.id,
        recipient_name: data.recipient_name,
        target_amount: data.target_amount,
        current_amount: data.current_amount,
        message: data.message,
        status: data.status,
        expires_at: data.expires_at,
        product: data.products,
      },
    });
  } catch (err) {
    console.error("Error fetching group gift for contribution:", err);
    res.status(500).json({ error: "Failed to fetch group gift" });
  }
});

// GET /api/group-gifts/:id - Auth - Get single group gift with contributions and product info
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("group_gifts")
      .select("*, products(*)")
      .eq("id", id)
      .single();

    if (error) {
      res.status(404).json({ error: "Group gift not found" });
      return;
    }

    const { data: contributions, error: contribError } = await supabase
      .from("group_gift_contributions")
      .select("*")
      .eq("group_gift_id", id)
      .order("created_at", { ascending: false });

    if (contribError) {
      res.status(500).json({ error: contribError.message });
      return;
    }

    res.json({
      data: {
        ...data,
        contributions: contributions || [],
      },
    });
  } catch (err) {
    console.error("Error fetching group gift:", err);
    res.status(500).json({ error: "Failed to fetch group gift" });
  }
});

// POST /api/group-gifts - Auth - Create group gift
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { product_id, recipient_name, recipient_email, message, expires_at } = req.body;

    if (!product_id || !recipient_name || !recipient_email) {
      res.status(400).json({ error: "product_id, recipient_name, and recipient_email are required" });
      return;
    }

    // Get product price for target_amount
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("price")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const { data, error } = await supabase
      .from("group_gifts")
      .insert({
        organizer_id: userId,
        product_id,
        recipient_name,
        recipient_email,
        target_amount: product.price,
        current_amount: 0,
        message: message || null,
        status: "active",
        expires_at: expires_at || null,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({ data, message: "Group gift created successfully" });
  } catch (err) {
    console.error("Error creating group gift:", err);
    res.status(500).json({ error: "Failed to create group gift" });
  }
});

// POST /api/group-gifts/:id/contribute - Auth - Add contribution
router.post("/:id/contribute", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req)!;
    const { contributor_name, contributor_email, amount } = req.body;

    if (!contributor_name || !contributor_email || !amount) {
      res.status(400).json({ error: "contributor_name, contributor_email, and amount are required" });
      return;
    }

    if (amount <= 0) {
      res.status(400).json({ error: "Amount must be greater than 0" });
      return;
    }

    // Check group gift exists and is active
    const { data: groupGift, error: giftError } = await supabase
      .from("group_gifts")
      .select("id, target_amount, current_amount, status")
      .eq("id", id)
      .single();

    if (giftError || !groupGift) {
      res.status(404).json({ error: "Group gift not found" });
      return;
    }

    if (groupGift.status !== "active") {
      res.status(400).json({ error: "Group gift is no longer accepting contributions" });
      return;
    }

    // Create contribution
    const { data: contribution, error: contribError } = await supabase
      .from("group_gift_contributions")
      .insert({
        group_gift_id: id,
        contributor_id: userId,
        contributor_name,
        contributor_email,
        amount,
        status: "paid",
      })
      .select()
      .single();

    if (contribError) {
      res.status(500).json({ error: contribError.message });
      return;
    }

    // Update current_amount on group gift
    const newAmount = groupGift.current_amount + amount;
    const newStatus = newAmount >= groupGift.target_amount ? "funded" : "active";

    const { error: updateError } = await supabase
      .from("group_gifts")
      .update({ current_amount: newAmount, status: newStatus })
      .eq("id", id);

    if (updateError) {
      res.status(500).json({ error: updateError.message });
      return;
    }

    res.status(201).json({ data: contribution, message: "Contribution added successfully" });
  } catch (err) {
    console.error("Error adding contribution:", err);
    res.status(500).json({ error: "Failed to add contribution" });
  }
});

// PATCH /api/group-gifts/:id/cancel - Auth (organizer) - Cancel group gift
router.patch("/:id/cancel", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req)!;

    // Verify organizer
    const { data: groupGift, error: giftError } = await supabase
      .from("group_gifts")
      .select("id, organizer_id, status")
      .eq("id", id)
      .single();

    if (giftError || !groupGift) {
      res.status(404).json({ error: "Group gift not found" });
      return;
    }

    if (groupGift.organizer_id !== userId) {
      res.status(403).json({ error: "Only the organizer can cancel this group gift" });
      return;
    }

    if (groupGift.status === "cancelled") {
      res.status(400).json({ error: "Group gift is already cancelled" });
      return;
    }

    const { error } = await supabase
      .from("group_gifts")
      .update({ status: "cancelled" })
      .eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Group gift cancelled successfully" });
  } catch (err) {
    console.error("Error cancelling group gift:", err);
    res.status(500).json({ error: "Failed to cancel group gift" });
  }
});

export default router;
