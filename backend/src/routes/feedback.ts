import { Router } from "express";

const router = Router();

// POST /api/feedback - Submit feedback (Public)
router.post("/", async (_req, res) => {
  res.json({ message: "POST /api/feedback - TODO" });
});

// GET /api/feedback/admin - Get all feedback (Admin)
router.get("/admin", async (_req, res) => {
  res.json({ message: "GET /api/feedback/admin - TODO" });
});

// PATCH /api/feedback/admin/:id - Mark as read (Admin)
router.patch("/admin/:id", async (_req, res) => {
  res.json({ message: "PATCH /api/feedback/admin/:id - TODO" });
});

export default router;
