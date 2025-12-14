import { authMiddleware } from "@clerk/nextjs";

// Allow the home page to be public, protect all other routes
export default authMiddleware({
  publicRoutes: ["/"], // '/' is accessible to both signed in and signed out users
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // protect everything else
    "/(api|trpc)(.*)", // include API routes
  ],
};
