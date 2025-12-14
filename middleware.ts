import { authMiddleware } from "@clerk/nextjs";

// No public routes — all pages require login
export default authMiddleware({});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // protect everything except _next/static files
    "/(api|trpc)(.*)", // protect API routes
  ],
};
