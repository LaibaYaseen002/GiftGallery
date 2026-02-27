import { Router, Request, Response } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { getAuth } from "@clerk/express";
import { sendOrderConfirmationEmail, sendCustomEmail, sendFeedbackReplyEmail } from "../services/resend";
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

// POST /api/email/admin/send - Send custom email (Admin)
router.post("/admin/send", requireAdmin, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const { to_email, to_name, subject, message } = req.body;

    if (!to_email || !subject || !message) {
      res.status(400).json({ error: "Email, subject, and message are required" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to_email)) {
      res.status(400).json({ error: "Invalid email address format" });
      return;
    }

    if (subject.trim().length > 300) {
      res.status(400).json({ error: "Subject is too long (max 300 characters)" });
      return;
    }

    if (message.trim().length > 10000) {
      res.status(400).json({ error: "Message is too long (max 10000 characters)" });
      return;
    }

    const result = await sendCustomEmail({
      to: to_email,
      toName: to_name || undefined,
      subject,
      message,
    });

    if (!result) {
      res.status(500).json({ error: "Failed to send email. Check RESEND_API_KEY configuration." });
      return;
    }

    // Log sent email
    await supabase.from("sent_emails").insert({
      to_email,
      to_name: to_name || null,
      subject,
      message,
      type: "custom",
      sent_by: auth.userId || "admin",
    });

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending custom email:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// POST /api/email/admin/reply-feedback/:id - Reply to feedback (Admin)
router.post("/admin/reply-feedback/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "Reply message is required" });
      return;
    }

    // Fetch feedback
    const { data: feedback, error: feedbackError } = await supabase
      .from("feedback")
      .select("*")
      .eq("id", id)
      .single();

    if (feedbackError || !feedback) {
      res.status(404).json({ error: "Feedback not found" });
      return;
    }

    const result = await sendFeedbackReplyEmail({
      to: feedback.email,
      customerName: feedback.name,
      originalSubject: feedback.subject,
      replyMessage: message,
    });

    if (!result) {
      res.status(500).json({ error: "Failed to send reply. Check RESEND_API_KEY configuration." });
      return;
    }

    // Mark feedback as read
    await supabase
      .from("feedback")
      .update({ is_read: true })
      .eq("id", id);

    // Log sent email
    await supabase.from("sent_emails").insert({
      to_email: feedback.email,
      to_name: feedback.name,
      subject: `Re: ${feedback.subject}`,
      message,
      type: "feedback_reply",
      reference_id: id,
      sent_by: auth.userId || "admin",
    });

    res.json({ message: "Reply sent successfully" });
  } catch (err) {
    console.error("Error replying to feedback:", err);
    res.status(500).json({ error: "Failed to send reply" });
  }
});

// GET /api/email/admin/history - Get sent email history (Admin)
router.get("/admin/history", requireAdmin, async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;

    const { data, error } = await supabase
      .from("sent_emails")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching email history:", err);
    res.status(500).json({ error: "Failed to fetch email history" });
  }
});

export default router;
