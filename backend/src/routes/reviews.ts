import { Router } from "express";

const router = Router();

// GET /api/reviews/product/:productId - Get reviews for a product
router.get("/product/:productId", async (_req, res) => {
  res.json({ message: "GET /api/reviews/product/:productId - TODO" });
});

// POST /api/reviews/product/:productId - Submit a review (User)
router.post("/product/:productId", async (_req, res) => {
  res.json({ message: "POST /api/reviews/product/:productId - TODO" });
});

// DELETE /api/reviews/:id - Delete own review (User)
router.delete("/:id", async (_req, res) => {
  res.json({ message: "DELETE /api/reviews/:id - TODO" });
});

export default router;
