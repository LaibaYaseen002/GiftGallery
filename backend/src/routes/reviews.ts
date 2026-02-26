import { Router, Request, Response } from "express";
import { supabase } from "../services/supabase";
import { requireAuth, requireAdmin, getUserId } from "../middleware/auth";
import { getAuth, clerkClient } from "@clerk/express";
import { createNotification } from "../services/notifications";

const router = Router();

// GET /api/reviews/product/:productId - Get reviews for a product
router.get("/product/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // Calculate average rating
    const ratings = (reviews || []).map((r: { rating: number }) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, r: number) => sum + r, 0) / ratings.length
        : 0;

    res.json({
      data: reviews || [],
      average_rating: Math.round(averageRating * 10) / 10,
      review_count: ratings.length,
    });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /api/reviews/product/:productId - Submit a review (User, one per product)
router.post("/product/:productId", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = getUserId(req)!;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    // Get user name from Clerk
    const auth = getAuth(req);
    const user = await clerkClient.users.getUser(auth.userId!);
    const userName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
      "Anonymous";

    // Check if user already reviewed this product
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    if (existing) {
      res.status(400).json({ error: "You have already reviewed this product" });
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        product_id: productId,
        user_id: userId,
        user_name: userName,
        rating: Math.round(rating),
        comment: comment || null,
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes("duplicate") || error.message.includes("unique")) {
        res.status(400).json({ error: "You have already reviewed this product" });
        return;
      }
      res.status(500).json({ error: error.message });
      return;
    }

    // Create admin notification
    createNotification({
      type: "new_review",
      title: "New Review",
      message: `${userName} left a ${Math.round(rating)}-star review`,
      reference_id: data.id,
    });

    res.status(201).json({ data, message: "Review submitted successfully" });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

// GET /api/reviews/admin - Get all reviews with product info (Admin)
router.get("/admin", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*, products:product_id(name, image_url)")
      .order("created_at", { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allReviews = (reviews || []).map((r: any) => ({
      id: r.id,
      product_id: r.product_id,
      user_id: r.user_id,
      user_name: r.user_name,
      rating: r.rating as number,
      comment: r.comment,
      created_at: r.created_at,
      product_name: r.products?.name || "Unknown Product",
      product_image: r.products?.image_url || null,
    }));

    // Calculate stats
    const ratings = allReviews.map((r) => r.rating);
    const totalReviews = ratings.length;
    const averageRating =
      totalReviews > 0
        ? ratings.reduce((sum, r) => sum + r, 0) / totalReviews
        : 0;

    const distribution = [1, 2, 3, 4, 5].map((star) => ({
      rating: star,
      count: ratings.filter((r) => r === star).length,
    }));

    res.json({
      data: allReviews,
      stats: {
        total_reviews: totalReviews,
        average_rating: Math.round(averageRating * 10) / 10,
        distribution,
      },
    });
  } catch (err) {
    console.error("Error fetching admin reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// DELETE /api/reviews/admin/:id - Delete any review (Admin moderation)
router.delete("/admin/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review (admin):", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

// DELETE /api/reviews/:id - Delete own review (User)
router.delete("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req)!;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ error: "Failed to delete review" });
  }
});

export default router;
