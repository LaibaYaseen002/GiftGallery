import { Router } from "express";

const router = Router();

// POST /api/email/order-confirmation - Send confirmation email (Internal)
router.post("/order-confirmation", async (_req, res) => {
  res.json({ message: "POST /api/email/order-confirmation - TODO" });
});

export default router;
