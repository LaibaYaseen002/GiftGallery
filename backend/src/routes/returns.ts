import { Router } from "express";

const router = Router();

// POST /api/returns - Submit return request (User)
router.post("/", async (_req, res) => {
  res.json({ message: "POST /api/returns - TODO" });
});

// GET /api/returns - Get user's return requests (User)
router.get("/", async (_req, res) => {
  res.json({ message: "GET /api/returns - TODO" });
});

// GET /api/returns/admin - Get all return requests (Admin)
router.get("/admin", async (_req, res) => {
  res.json({ message: "GET /api/returns/admin - TODO" });
});

// PATCH /api/returns/admin/:id - Update return status (Admin)
router.patch("/admin/:id", async (_req, res) => {
  res.json({ message: "PATCH /api/returns/admin/:id - TODO" });
});

export default router;
