import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. Adapter: Connects to Postgres to create/update the User record
  adapter: PrismaAdapter(db),

  // 2. Providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  // 3. Strategy: JWT is required for Vercel Edge compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 4. Pages
  pages: {
    signIn: "/auth/signin",
  },

  // 5. CRITICAL CALLBACKS
  callbacks: {
    // A. JWT Callback: Runs when a token is created/updated.
    // We must capture the Database ID (user.id) and put it into the token.
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // Map the Prisma User ID to the standard 'sub' field
      }
      return token;
    },

    // B. Session Callback: Runs when the client/server asks "Who is logged in?"
    // We must copy the ID from the Token into the Session object.
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // Pass the ID to the app
      }
      return session;
    }
  },

  // 6. Secret
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
