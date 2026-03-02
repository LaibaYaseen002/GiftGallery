import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin, getUserId } from "../middleware/auth";
import { getAuth, clerkClient } from "@clerk/express";
import { CreateOrderRequest } from "../types";
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "../services/resend";
import { createNotification } from "../services/notifications";
import { createPaymentIntent } from "../services/stripe";

const router = Router();

// POST /api/orders - Create new order (User)
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const auth = getAuth(req);
    const user = await clerkClient.users.getUser(auth.userId!);
    const userEmail =
      user.emailAddresses[0]?.emailAddress || "unknown@email.com";

    const {
      items,
      shipping_name,
      shipping_address,
      shipping_city,
      shipping_phone,
      gift_message,
      gift_font,
      discount_code,
    } = req.body as CreateOrderRequest;

    if (!items || items.length === 0) {
      res.status(400).json({ error: "Order must contain at least one item" });
      return;
    }

    // Validate item quantities
    for (const item of items) {
      if (!item.product_id || typeof item.product_id !== "string") {
        res.status(400).json({ error: "Each item must have a valid product_id" });
        return;
      }
      if (!Number.isInteger(item.quantity) || item.quantity < 1) {
        res.status(400).json({ error: "Each item quantity must be a positive integer" });
        return;
      }
    }

    if (!shipping_name || !shipping_address || !shipping_city || !shipping_phone) {
      res.status(400).json({ error: "All shipping fields are required" });
      return;
    }

    // Validate shipping fields
    if (shipping_name.trim().length > 200) {
      res.status(400).json({ error: "Shipping name is too long (max 200 characters)" });
      return;
    }

    const phoneRegex = /^[\d\s\-+()]{7,20}$/;
    if (!phoneRegex.test(shipping_phone)) {
      res.status(400).json({ error: "Invalid phone number format" });
      return;
    }

    if (gift_message && gift_message.length > 500) {
      res.status(400).json({ error: "Gift message is too long (max 500 characters)" });
      return;
    }

    const validFonts = ["classic", "handwritten", "elegant", "playful"];
    if (gift_font && !validFonts.includes(gift_font)) {
      res.status(400).json({ error: `Invalid gift font. Must be one of: ${validFonts.join(", ")}` });
      return;
    }

    // Fetch product details and calculate total
    const productIds = items.map((item) => item.product_id);
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("id, name, price, in_stock")
      .in("id", productIds);

    if (prodError || !products) {
      res.status(500).json({ error: "Failed to fetch product details" });
      return;
    }

    // Check all products are in stock
    const outOfStock = products.filter((p) => !p.in_stock);
    if (outOfStock.length > 0) {
      res.status(400).json({
        error: `The following items are out of stock: ${outOfStock.map((p) => p.name).join(", ")}`,
      });
      return;
    }

    let subtotal = 0;
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.product_id);
      if (!product) throw new Error(`Product ${item.product_id} not found`);
      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;
      return {
        product_id: product.id,
        product_name: product.name,
        price: product.price,
        quantity: item.quantity,
      };
    });

    // Apply discount if provided
    let discountAmount = 0;
    if (discount_code) {
      const { data: discount } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", discount_code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (discount) {
        const now = new Date();
        const notExpired = !discount.expires_at || new Date(discount.expires_at) > now;
        const hasUses = !discount.max_uses || discount.current_uses < discount.max_uses;

        if (notExpired && hasUses) {
          discountAmount = (subtotal * discount.discount_percent) / 100;
          // Increment usage
          await supabase
            .from("discount_codes")
            .update({ current_uses: discount.current_uses + 1 })
            .eq("id", discount.id);
        }
      }
    }

    const totalAmount = subtotal - discountAmount;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        user_email: userEmail,
        total_amount: totalAmount,
        discount_code: discount_code?.toUpperCase() || null,
        discount_amount: discountAmount,
        status: "pending",
        shipping_name,
        shipping_address,
        shipping_city,
        shipping_phone,
        gift_message: gift_message || null,
        gift_font: gift_message ? (gift_font || "classic") : null,
      })
      .select()
      .single();

    if (orderError || !order) {
      res.status(500).json({ error: orderError?.message || "Failed to create order" });
      return;
    }

    // Create order items
    const itemsWithOrderId = orderItems.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsWithOrderId);

    if (itemsError) {
      res.status(500).json({ error: "Order created but failed to save items" });
      return;
    }

    // Create Stripe PaymentIntent
    const amountInCents = Math.round(totalAmount * 100);
    const clientSecret = await createPaymentIntent(amountInCents, order.id);

    // Store payment_intent_id on the order
    const paymentIntentId = clientSecret.split("_secret_")[0];
    await supabase
      .from("orders")
      .update({ payment_intent_id: paymentIntentId, payment_status: "pending" })
      .eq("id", order.id);

    // Send confirmation email (non-blocking — don't fail the order if email fails)
    sendOrderConfirmationEmail({
      to: userEmail,
      orderId: order.id,
      customerName: shipping_name,
      items: orderItems,
      subtotal,
      discountCode: discount_code?.toUpperCase() || null,
      discountAmount,
      totalAmount,
      shippingName: shipping_name,
      shippingAddress: shipping_address,
      shippingCity: shipping_city,
      shippingPhone: shipping_phone,
      giftMessage: gift_message || null,
      giftFont: gift_message ? (gift_font || "classic") : null,
    }).catch((err) => console.error("Email send failed:", err));

    // Create admin notification
    createNotification({
      type: "new_order",
      title: "New Order Received",
      message: `New order from ${shipping_name} — $${totalAmount.toFixed(2)}`,
      reference_id: order.id,
    });

    res.status(201).json({
      data: { ...order, items: itemsWithOrderId, clientSecret },
      message: "Order placed successfully!",
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// GET /api/orders - Get user's orders (User)
router.get("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: orders || [] });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/admin/all - Get all orders (Admin)
// NOTE: Admin routes must be defined BEFORE /:id to avoid wildcard matching
router.get("/admin/all", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: orders || [] });
  } catch (err) {
    console.error("Error fetching admin orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET /api/orders/admin/:id - Get full order detail (Admin)
router.get("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    // Fetch status history
    const { data: history } = await supabase
      .from("status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false });

    res.json({
      data: {
        ...order,
        items: items || [],
        status_history: history || [],
      },
    });
  } catch (err) {
    console.error("Error fetching admin order detail:", err);
    res.status(500).json({ error: "Failed to fetch order detail" });
  }
});

// GET /api/orders/:id - Get order detail (User)
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)!;
    const { id } = req.params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Fetch order items
    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id);

    // Fetch status history
    const { data: history } = await supabase
      .from("status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true });

    res.json({ data: { ...order, items: items || [], status_history: history || [] } });
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// PATCH /api/orders/:id/status - Update order status (Admin)
router.patch("/:id/status", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const auth = getAuth(req);

    const validStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` });
      return;
    }

    // Get current order status and user info
    const { data: currentOrder } = await supabase
      .from("orders")
      .select("status, user_email, shipping_name")
      .eq("id", id)
      .single();

    if (!currentOrder) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const oldStatus = currentOrder.status || null;

    const { data, error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Log status change in history
    await supabase.from("status_history").insert({
      order_id: id,
      old_status: oldStatus,
      new_status: status,
      changed_by: auth.userId || "admin",
    });

    // Send status update email to customer (non-blocking)
    if (currentOrder.user_email) {
      sendOrderStatusEmail({
        to: currentOrder.user_email,
        customerName: currentOrder.shipping_name,
        orderId: id as string,
        oldStatus: oldStatus || "pending",
        newStatus: status as string,
      }).catch((err) => console.error("Status email send failed:", err));
    }

    res.json({ data, message: `Order status updated to ${status}` });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// PATCH /api/orders/:id/notes - Update admin notes (Admin)
router.patch("/:id/notes", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;

    const { data, error } = await supabase
      .from("orders")
      .update({ admin_notes, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data, message: "Admin notes updated" });
  } catch (err) {
    console.error("Error updating admin notes:", err);
    res.status(500).json({ error: "Failed to update admin notes" });
  }
});

export default router;
