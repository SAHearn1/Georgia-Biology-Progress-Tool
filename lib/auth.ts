import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. Adapter: Connects NextAuth to your Prisma Database
  adapter: PrismaAdapter(db),

  // 2. Providers: Google
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // 3. Strategy: FORCED to JWT for Vercel Edge compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 4. Pages: Custom sign-in to match our branding
  pages: {
    signIn: "/auth/signin", // FIX: Changed from /api/auth/signin to /auth/signin
    // We rely on the auto-generated Google prompt or our custom button
  },

  // 5. Callbacks: Crucial for passing the User ID to the Dashboard
  callbacks: {
    // A. JWT Callback: Called whenever a token is created/updated
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Persist the Prisma User ID to the token
        // @ts-ignore
        token.role = user.role; // Optional: If you added 'role' to User schema
      }
      return token;
    },
  },
});
