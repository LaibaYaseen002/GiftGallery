import { Router } from "express";

const router = Router();

// GET /api/products - Get all products (with optional search & category filter)
router.get("/", async (_req, res) => {
  res.json({ message: "GET /api/products - TODO" });
});

// GET /api/products/:id - Get single product
router.get("/:id", async (_req, res) => {
  res.json({ message: "GET /api/products/:id - TODO" });
});

// POST /api/products - Create product (Admin)
router.post("/", async (_req, res) => {
  res.json({ message: "POST /api/products - TODO" });
});

// PUT /api/products/:id - Update product (Admin)
router.put("/:id", async (_req, res) => {
  res.json({ message: "PUT /api/products/:id - TODO" });
});

// DELETE /api/products/:id - Delete product (Admin)
router.delete("/:id", async (_req, res) => {
  res.json({ message: "DELETE /api/products/:id - TODO" });
});

export default router;
