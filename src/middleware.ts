import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Edge middleware from the DB-free base config. The `authorized` callback gates
// every /admin route except the login page.
const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: ["/admin/:path*"],
};
