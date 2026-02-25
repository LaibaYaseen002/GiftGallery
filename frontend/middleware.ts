// Clerk auth middleware - will be configured in feature-auth branch
// For now, this is a placeholder that allows all routes

export default function middleware() {
  // Will be replaced with Clerk's authMiddleware in feature-auth
}

export const config = {
  matcher: [
    // Protected routes that will require authentication
    "/checkout/:path*",
    "/orders/:path*",
    "/wishlist/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
