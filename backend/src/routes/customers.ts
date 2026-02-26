import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAdmin } from "../middleware/auth";
import { clerkClient } from "@clerk/express";

const router = Router();

// GET /api/admin/customers - Get all customers (Admin)
router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Get unique customers from orders, aggregated
    const { data: customerData, error } = await supabase
      .from("orders")
      .select("user_id, user_email, total_amount, created_at");

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Aggregate by user_id
    const customerMap = new Map<
      string,
      {
        user_id: string;
        user_email: string;
        total_orders: number;
        total_spent: number;
        first_order: string;
        last_order: string;
      }
    >();

    for (const row of customerData || []) {
      const existing = customerMap.get(row.user_id);
      if (existing) {
        existing.total_orders += 1;
        existing.total_spent += Number(row.total_amount);
        if (row.created_at < existing.first_order) existing.first_order = row.created_at;
        if (row.created_at > existing.last_order) existing.last_order = row.created_at;
      } else {
        customerMap.set(row.user_id, {
          user_id: row.user_id,
          user_email: row.user_email,
          total_orders: 1,
          total_spent: Number(row.total_amount),
          first_order: row.created_at,
          last_order: row.created_at,
        });
      }
    }

    // Fetch Clerk user details for each customer
    const customers = [];
    for (const [userId, stats] of customerMap) {
      let name = stats.user_email;
      let imageUrl = null;
      let createdAt = stats.first_order;

      try {
        const user = await clerkClient.users.getUser(userId);
        name = [user.firstName, user.lastName].filter(Boolean).join(" ") || stats.user_email;
        imageUrl = user.imageUrl;
        createdAt = user.createdAt
          ? new Date(user.createdAt).toISOString()
          : stats.first_order;
      } catch {
        // User may have been deleted from Clerk
      }

      customers.push({
        user_id: userId,
        name,
        email: stats.user_email,
        image_url: imageUrl,
        total_orders: stats.total_orders,
        total_spent: stats.total_spent,
        first_order: stats.first_order,
        last_order: stats.last_order,
        member_since: createdAt,
      });
    }

    // Sort by total spent descending
    customers.sort((a, b) => b.total_spent - a.total_spent);

    res.json({ data: customers });
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// GET /api/admin/customers/:userId - Get customer detail (Admin)
router.get("/:userId", requireAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId as string;

    // Fetch user info from Clerk
    let name = "Unknown";
    let email = "";
    let imageUrl = null;
    let memberSince = "";

    try {
      const user = await clerkClient.users.getUser(userId);
      name = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown";
      email = user.emailAddresses[0]?.emailAddress || "";
      imageUrl = user.imageUrl;
      memberSince = user.createdAt
        ? new Date(user.createdAt).toISOString()
        : "";
    } catch {
      // User may have been deleted
    }

    // Fetch all orders for this customer
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Fetch return requests
    const { data: returns } = await supabase
      .from("return_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    // Fetch reviews
    const { data: reviews } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    const orderList = orders || [];
    const totalSpent = orderList.reduce((sum, o) => sum + Number(o.total_amount), 0);
    const avgOrderValue = orderList.length > 0 ? totalSpent / orderList.length : 0;

    if (!email && orderList.length > 0) {
      email = orderList[0].user_email;
    }
    if (!memberSince && orderList.length > 0) {
      memberSince = orderList[orderList.length - 1].created_at;
    }

    res.json({
      data: {
        user_id: userId,
        name,
        email,
        image_url: imageUrl,
        member_since: memberSince,
        stats: {
          total_orders: orderList.length,
          total_spent: totalSpent,
          avg_order_value: avgOrderValue,
          total_returns: (returns || []).length,
          total_reviews: (reviews || []).length,
        },
        orders: orderList,
        returns: returns || [],
        reviews: reviews || [],
      },
    });
  } catch (err) {
    console.error("Error fetching customer detail:", err);
    res.status(500).json({ error: "Failed to fetch customer detail" });
  }
});

export default router;
