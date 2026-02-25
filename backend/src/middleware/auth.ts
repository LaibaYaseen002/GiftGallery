import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/express";

// Global Clerk middleware - attach to Express app
export const clerkAuth = clerkMiddleware();

// Middleware: Require authenticated user
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized. Please sign in." });
    return;
  }
  next();
};

// Middleware: Require admin role
export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized. Please sign in." });
    return;
  }

  try {
    // Fetch user from Clerk to check publicMetadata.role
    const user = await clerkClient.users.getUser(auth.userId);
    const role = (user.publicMetadata as Record<string, unknown>)?.role;

    if (role !== "admin") {
      res.status(403).json({ error: "Forbidden. Admin access required." });
      return;
    }

    next();
  } catch {
    res.status(500).json({ error: "Failed to verify admin role." });
  }
};

// Helper: Get current user ID from request
export const getUserId = (req: Request): string | null => {
  const auth = getAuth(req);
  return auth?.userId || null;
};
