import { auth } from "@/lib/auth"

export default auth((req) => {
  // Simple logic: If not logged in and trying to access dashboard, redirect
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  // Protects dashboard routes matching this pattern
  matcher: ["/dashboard/:path*"],
}
