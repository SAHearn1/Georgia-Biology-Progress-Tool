import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "@/lib/env";

/**
 * NextAuth Configuration with Validated Environment Variables
 *
 * Environment variables are validated in lib/env.ts
 * If any required variables are missing, the app will fail fast with a clear error
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  // Using JWT strategy without database adapter
  // This simplifies auth and avoids database connection issues
  // User info will be stored in the JWT token instead of the database

  // 1. Providers
  providers: [
    Google({
      clientId: env.google.clientId,
      clientSecret: env.google.clientSecret,
      // Explicitly set authorization parameters for better OAuth flow
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // 2. Strategy: JWT is required for Vercel Edge compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 3. Pages
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error page for OAuth errors
  },

  // 4. CRITICAL CALLBACKS
  callbacks: {
    // A. JWT Callback: Runs when a token is created/updated.
    async jwt({ token, user, account }) {
      if (user) {
        // Store user info in the token
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    // B. Session Callback: Runs when the client/server asks "Who is logged in?"
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },

    // C. Redirect Callback: Controls where users go after sign in/out
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  // 5. Secret: Validated in lib/env.ts
  secret: env.auth.secret,

  // 6. Debug mode (only enable in development)
  debug: process.env.NODE_ENV === "development",
});
