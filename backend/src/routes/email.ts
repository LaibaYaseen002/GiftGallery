import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { sendOrderConfirmationEmail } from "../services/resend";
import { supabase } from "../services/supabase";

const router = Router();

// POST /api/email/order-confirmation - Resend order confirmation email
router.post("/order-confirmation", requireAuth, async (req: Request, res: Response) => {
  try {
    const { order_id, email } = req.body;

    if (!order_id || !email) {
      res.status(400).json({ error: "order_id and email are required" });
      return;
    }

    // Fetch order with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", order_id)
      .single();

    if (orderError || !order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    const { data: items } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order_id);

    const subtotal = Number(order.total_amount) + Number(order.discount_amount);

    const result = await sendOrderConfirmationEmail({
      to: email,
      orderId: order.id,
      customerName: order.shipping_name,
      items: (items || []).map((item: Record<string, unknown>) => ({
        product_name: item.product_name as string,
        price: Number(item.price),
        quantity: Number(item.quantity),
      })),
      subtotal,
      discountCode: order.discount_code,
      discountAmount: Number(order.discount_amount),
      totalAmount: Number(order.total_amount),
      shippingName: order.shipping_name,
      shippingAddress: order.shipping_address,
      shippingCity: order.shipping_city,
      shippingPhone: order.shipping_phone,
      giftMessage: order.gift_message,
    });

    if (result) {
      res.json({ message: "Order confirmation email sent" });
    } else {
      res.status(500).json({ error: "Failed to send email. Check RESEND_API_KEY configuration." });
    }
  } catch (err) {
    console.error("Error sending confirmation email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
