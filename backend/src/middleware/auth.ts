import { Request, Response, NextFunction } from "express";
import { clerkMiddleware, getAuth } from "@clerk/express";

// Re-export Clerk middleware for use in index.ts if needed globally
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
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const auth = getAuth(req);
  if (!auth?.userId) {
    res.status(401).json({ error: "Unauthorized. Please sign in." });
    return;
  }

  // Admin check will be done via Clerk session claims
  // For now, we check sessionClaims for the admin role
  const role = (auth.sessionClaims as Record<string, unknown>)?.metadata as Record<string, unknown> | undefined;
  if (role?.role !== "admin") {
    res.status(403).json({ error: "Forbidden. Admin access required." });
    return;
  }
  next();
};
