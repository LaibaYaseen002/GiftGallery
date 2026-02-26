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
      .select("id, total_amount, status, created_at, user_id");

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
    const uniqueCustomers = new Set(allOrders.map((o) => o.user_id));

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

    // Unread feedback count
    const { count: unreadFeedback } = await supabase
      .from("feedback")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false);

    res.json({
      data: {
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        total_products: totalProducts || 0,
        total_customers: uniqueCustomers.size,
        pending_orders: pendingOrders,
        delivered_orders: deliveredOrders,
        pending_returns: pendingReturns || 0,
        unread_feedback: unreadFeedback || 0,
        recent_orders: recentOrders || [],
        top_products: topProductsList,
      },
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Failed to fetch analytics data" });
  }
});

// GET /api/admin/analytics/chart - Revenue & orders by day (Admin)
router.get("/chart", requireAdmin, async (req: Request, res: Response) => {
  try {
    const period = req.query.period === "30d" ? 30 : 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const { data: orders, error } = await supabase
      .from("orders")
      .select("total_amount, created_at")
      .gte("created_at", startDate.toISOString())
      .order("created_at", { ascending: true });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Group by day
    const dailyData: Record<string, { revenue: number; orders: number }> = {};

    // Initialize all days with zero
    for (let i = 0; i < period; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (period - 1 - i));
      const key = d.toISOString().split("T")[0];
      dailyData[key] = { revenue: 0, orders: 0 };
    }

    // Fill in actual data
    for (const order of orders || []) {
      const key = new Date(order.created_at).toISOString().split("T")[0];
      if (dailyData[key]) {
        dailyData[key].revenue += Number(order.total_amount);
        dailyData[key].orders += 1;
      }
    }

    const chart = Object.entries(dailyData).map(([date, data]) => ({
      date,
      revenue: Math.round(data.revenue * 100) / 100,
      orders: data.orders,
    }));

    res.json({ data: chart });
  } catch (err) {
    console.error("Error fetching chart data:", err);
    res.status(500).json({ error: "Failed to fetch chart data" });
  }
});

// GET /api/admin/analytics/categories - Sales breakdown by category (Admin)
router.get("/categories", requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Get all categories
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name");

    // Get products with their categories
    const { data: products } = await supabase
      .from("products")
      .select("id, category_id");

    // Get all order items
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity, price");

    const catMap = new Map<string, { name: string; total_orders: number; total_revenue: number; product_count: number }>();

    for (const cat of categories || []) {
      catMap.set(cat.id, {
        name: cat.name,
        total_orders: 0,
        total_revenue: 0,
        product_count: 0,
      });
    }

    // Count products per category
    const productCatMap = new Map<string, string>();
    for (const p of products || []) {
      if (p.category_id && catMap.has(p.category_id)) {
        catMap.get(p.category_id)!.product_count += 1;
        productCatMap.set(p.id, p.category_id);
      }
    }

    // Aggregate order items by category
    for (const item of orderItems || []) {
      const catId = productCatMap.get(item.product_id);
      if (catId && catMap.has(catId)) {
        const cat = catMap.get(catId)!;
        cat.total_orders += item.quantity;
        cat.total_revenue += Number(item.price) * item.quantity;
      }
    }

    const result = Array.from(catMap.values())
      .map((c) => ({
        ...c,
        total_revenue: Math.round(c.total_revenue * 100) / 100,
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue);

    res.json({ data: result });
  } catch (err) {
    console.error("Error fetching category analytics:", err);
    res.status(500).json({ error: "Failed to fetch category analytics" });
  }
});

// GET /api/admin/analytics/activity - Recent activity feed (Admin)
router.get("/activity", requireAdmin, async (_req: Request, res: Response) => {
  try {
    // Fetch recent events from multiple tables
    const [ordersRes, returnsRes, feedbackRes, reviewsRes] = await Promise.all([
      supabase
        .from("orders")
        .select("id, shipping_name, total_amount, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("return_requests")
        .select("id, order_id, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("feedback")
        .select("id, name, email, subject, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("reviews")
        .select("id, user_name, rating, created_at, products:product_id(name)")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const events: { type: string; message: string; timestamp: string }[] = [];

    for (const o of ordersRes.data || []) {
      events.push({
        type: "order",
        message: `New order from ${o.shipping_name} — $${Number(o.total_amount).toFixed(2)}`,
        timestamp: o.created_at,
      });
    }

    for (const r of returnsRes.data || []) {
      events.push({
        type: "return",
        message: `New return request for order #${r.order_id.slice(0, 8)}`,
        timestamp: r.created_at,
      });
    }

    for (const f of feedbackRes.data || []) {
      events.push({
        type: "feedback",
        message: `New feedback from ${f.name}: "${f.subject}"`,
        timestamp: f.created_at,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const rv of (reviewsRes.data || []) as any[]) {
      const productName = rv.products?.name || "a product";
      events.push({
        type: "review",
        message: `${rv.user_name} left a ${rv.rating}-star review on ${productName}`,
        timestamp: rv.created_at,
      });
    }

    // Sort by timestamp descending, take top 20
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({ data: events.slice(0, 20) });
  } catch (err) {
    console.error("Error fetching activity feed:", err);
    res.status(500).json({ error: "Failed to fetch activity feed" });
  }
});

export default router;
