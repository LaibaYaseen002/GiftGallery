import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkAuth } from "./middleware/auth";

import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import orderRoutes from "./routes/orders";
import reviewRoutes from "./routes/reviews";
import wishlistRoutes from "./routes/wishlist";
import discountRoutes from "./routes/discounts";
import returnRoutes from "./routes/returns";
import feedbackRoutes from "./routes/feedback";
import analyticsRoutes from "./routes/analytics";
import customerRoutes from "./routes/customers";
import emailRoutes from "./routes/email";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

// Clerk authentication - makes auth available on all routes
app.use(clerkAuth);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "Gift Gallery API is running" });
});

// Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/email", emailRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
