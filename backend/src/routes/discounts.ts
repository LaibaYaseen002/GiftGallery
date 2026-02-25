import { Router } from "express";

const router = Router();

// POST /api/discounts/validate - Validate & apply discount code (User)
router.post("/validate", async (_req, res) => {
  res.json({ message: "POST /api/discounts/validate - TODO" });
});

// GET /api/discounts/admin - Get all discount codes (Admin)
router.get("/admin", async (_req, res) => {
  res.json({ message: "GET /api/discounts/admin - TODO" });
});

// POST /api/discounts/admin - Create discount code (Admin)
router.post("/admin", async (_req, res) => {
  res.json({ message: "POST /api/discounts/admin - TODO" });
});

// PUT /api/discounts/admin/:id - Update discount code (Admin)
router.put("/admin/:id", async (_req, res) => {
  res.json({ message: "PUT /api/discounts/admin/:id - TODO" });
});

// DELETE /api/discounts/admin/:id - Delete discount code (Admin)
router.delete("/admin/:id", async (_req, res) => {
  res.json({ message: "DELETE /api/discounts/admin/:id - TODO" });
});

export default router;
