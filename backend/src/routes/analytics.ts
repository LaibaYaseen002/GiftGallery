import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAdmin } from "../middleware/auth";

const router = Router();

// GET /api/admin/analytics - Get dashboard stats (Admin)
router.get("/", requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Total orders & revenue
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("id, total_amount, status, created_at");

    if (ordersError) {
      res.status(500).json({ error: ordersError.message });
      return;
    }

    const allOrders = orders || [];
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce(
      (sum, o) => sum + Number(o.total_amount),
      0
    );
    const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
    const deliveredOrders = allOrders.filter((o) => o.status === "delivered").length;

    // Total products
    const { count: totalProducts } = await supabase
      .from("products")
      .select("id", { count: "exact", head: true });

    // Total customers (unique user_ids from orders)
    const uniqueCustomers = new Set(allOrders.map((o) => (o as Record<string, unknown>).user_id));

    // Recent orders (last 5)
    const { data: recentOrders } = await supabase
      .from("orders")
      .select("id, user_email, total_amount, status, created_at, shipping_name")
      .order("created_at", { ascending: false })
      .limit(5);

    // Top selling products
    const { data: topProducts } = await supabase
      .from("order_items")
      .select("product_name, quantity");

    const productSales: Record<string, number> = {};
    (topProducts || []).forEach((item) => {
      productSales[item.product_name] =
        (productSales[item.product_name] || 0) + item.quantity;
    });

    const topProductsList = Object.entries(productSales)
      .map(([product_name, total_sold]) => ({ product_name, total_sold }))
      .sort((a, b) => b.total_sold - a.total_sold)
      .slice(0, 5);

    // Return requests count
    const { count: pendingReturns } = await supabase
      .from("return_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending");

    res.json({
      data: {
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        total_products: totalProducts || 0,
        total_customers: uniqueCustomers.size,
        pending_orders: pendingOrders,
        delivered_orders: deliveredOrders,
        pending_returns: pendingReturns || 0,
        recent_orders: recentOrders || [],
        top_products: topProductsList,
      },
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

export default router;
