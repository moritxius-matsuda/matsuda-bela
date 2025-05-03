import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // alle Seiten außer statische Dateien und _next
    "/", 
    "/(api|trpc)(.*)",
  ],
};
