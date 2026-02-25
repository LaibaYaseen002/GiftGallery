import { Router } from "express";

const router = Router();

// POST /api/orders - Create new order (User)
router.post("/", async (_req, res) => {
  res.json({ message: "POST /api/orders - TODO" });
});

// GET /api/orders - Get user's orders (User)
router.get("/", async (_req, res) => {
  res.json({ message: "GET /api/orders - TODO" });
});

// GET /api/orders/:id - Get order detail (User)
router.get("/:id", async (_req, res) => {
  res.json({ message: "GET /api/orders/:id - TODO" });
});

// PATCH /api/orders/:id/status - Update order status (Admin)
router.patch("/:id/status", async (_req, res) => {
  res.json({ message: "PATCH /api/orders/:id/status - TODO" });
});

export default router;
