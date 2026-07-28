import type { NextAuthConfig } from "next-auth";

// Edge-safe base config (NO database / bcrypt here) so it can be imported by
// middleware. The Credentials provider with DB access lives in auth.ts.
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    // Gate every /admin route (except the login page) on a valid session.
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      const isAdmin = pathname.startsWith("/admin");
      const isLogin = pathname === "/admin/login";
      if (isAdmin && !isLogin) return Boolean(auth?.user);
      return true;
    },
  },
} satisfies NextAuthConfig;

export default authConfig;
