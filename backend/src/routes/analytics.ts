import { Router } from "express";

const router = Router();

// GET /api/admin/analytics - Get dashboard stats (Admin)
router.get("/", async (_req, res) => {
  res.json({ message: "GET /api/admin/analytics - TODO" });
});

export default router;
