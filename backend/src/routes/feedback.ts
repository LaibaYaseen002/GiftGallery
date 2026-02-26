import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAdmin } from "../middleware/auth";
import { getUserId } from "../middleware/auth";
import { CreateFeedbackRequest } from "../types";
import { createNotification } from "../services/notifications";

const router = Router();

// POST /api/feedback - Submit feedback (Public)
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body as CreateFeedbackRequest;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: "All fields are required" });
      return;
    }

    // Get user_id if authenticated (optional)
    const userId = getUserId(req);

    const { data, error } = await supabase
      .from("feedback")
      .insert({
        user_id: userId || null,
        name,
        email,
        subject,
        message,
        is_read: false,
      })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Create admin notification
    createNotification({
      type: "new_feedback",
      title: "New Feedback",
      message: `Feedback from ${name}: "${subject}"`,
      reference_id: data.id,
    });

    res.status(201).json({
      data,
      message: "Thank you for your feedback! We'll get back to you soon.",
    });
  } catch (err) {
    console.error("Error submitting feedback:", err);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
});

// GET /api/feedback/admin - Get all feedback (Admin)
router.get("/admin", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching feedback:", err);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

// PATCH /api/feedback/admin/:id - Mark as read (Admin)
router.patch("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("feedback")
      .update({ is_read: true })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: "Feedback not found" });
      return;
    }

    res.json({ data, message: "Marked as read" });
  } catch (err) {
    console.error("Error updating feedback:", err);
    res.status(500).json({ error: "Failed to update feedback" });
  }
});

export default router;
