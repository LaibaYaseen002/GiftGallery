import { Router } from "express";

const router = Router();

// GET /api/categories - Get all categories
router.get("/", async (_req, res) => {
  res.json({ message: "GET /api/categories - TODO" });
});

// GET /api/categories/:slug/products - Get products by category
router.get("/:slug/products", async (_req, res) => {
  res.json({ message: "GET /api/categories/:slug/products - TODO" });
});

export default router;
