import { Router } from "express";

const router = Router();

// GET /api/wishlist - Get user's wishlist (User)
router.get("/", async (_req, res) => {
  res.json({ message: "GET /api/wishlist - TODO" });
});

// POST /api/wishlist - Add product to wishlist (User)
router.post("/", async (_req, res) => {
  res.json({ message: "POST /api/wishlist - TODO" });
});

// DELETE /api/wishlist/:productId - Remove from wishlist (User)
router.delete("/:productId", async (_req, res) => {
  res.json({ message: "DELETE /api/wishlist/:productId - TODO" });
});

export default router;
