import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin, getUserId } from "../middleware/auth";
import { CreateReturnRequest } from "../types";

const router = Router();

// POST /api/returns - Submit return request (User)
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { order_id, reason } = req.body as CreateReturnRequest;

    if (!order_id || !reason) {
      res.status(400).json({ error: "Order ID and reason are required" });
      return;
    }

    // Verify the order belongs to this user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", order_id)
      .eq("user_id", userId)
      .single();

    if (orderError || !order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Only allow returns for delivered or confirmed orders
    if (!["delivered", "confirmed", "shipped"].includes(order.status)) {
      res.status(400).json({
        error: "Returns can only be requested for confirmed, shipped, or delivered orders",
      });
      return;
    }

    // Check if a return request already exists for this order
    const { data: existing } = await supabase
      .from("return_requests")
      .select("id")
      .eq("order_id", order_id)
      .eq("user_id", userId)
      .single();

    if (existing) {
      res.status(400).json({ error: "A return request already exists for this order" });
      return;
    }

    // Create return request
    const { data: returnRequest, error } = await supabase
      .from("return_requests")
      .insert({
        order_id,
        user_id: userId,
        reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json({
      data: returnRequest,
      message: "Return request submitted successfully",
    });
  } catch (err) {
    console.error("Error creating return request:", err);
    res.status(500).json({ error: "Failed to create return request" });
  }
});

// GET /api/returns - Get user's return requests (User)
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data: returns, error } = await supabase
      .from("return_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Fetch associated orders for each return
    const orderIds = [...new Set((returns || []).map((r) => r.order_id))];
    let orders: Record<string, unknown> = {};

    if (orderIds.length > 0) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("id, total_amount, status, created_at, shipping_name")
        .in("id", orderIds);

      if (orderData) {
        orders = Object.fromEntries(orderData.map((o) => [o.id, o]));
      }
    }

    const returnsWithOrders = (returns || []).map((r) => ({
      ...r,
      order: orders[r.order_id] || null,
    }));

    res.json({ data: returnsWithOrders });
  } catch (err) {
    console.error("Error fetching return requests:", err);
    res.status(500).json({ error: "Failed to fetch return requests" });
  }
});

// GET /api/returns/admin - Get all return requests (Admin)
router.get("/admin", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { data: returns, error } = await supabase
      .from("return_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Fetch associated orders
    const orderIds = [...new Set((returns || []).map((r) => r.order_id))];
    let orders: Record<string, unknown> = {};

    if (orderIds.length > 0) {
      const { data: orderData } = await supabase
        .from("orders")
        .select("id, user_email, total_amount, status, created_at, shipping_name")
        .in("id", orderIds);

      if (orderData) {
        orders = Object.fromEntries(orderData.map((o) => [o.id, o]));
      }
    }

    const returnsWithOrders = (returns || []).map((r) => ({
      ...r,
      order: orders[r.order_id] || null,
    }));

    res.json({ data: returnsWithOrders });
  } catch (err) {
    console.error("Error fetching admin return requests:", err);
    res.status(500).json({ error: "Failed to fetch return requests" });
  }
});

// PATCH /api/returns/admin/:id - Update return status (Admin)
router.patch("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, admin_notes } = req.body;

    const validStatuses = ["pending", "approved", "rejected", "refunded"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
      return;
    }

    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (admin_notes !== undefined) {
      updateData.admin_notes = admin_notes;
    }

    const { data, error } = await supabase
      .from("return_requests")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: "Return request not found" });
      return;
    }

    res.json({ data, message: `Return request ${status}` });
  } catch (err) {
    console.error("Error updating return request:", err);
    res.status(500).json({ error: "Failed to update return request" });
  }
});

export default router;
