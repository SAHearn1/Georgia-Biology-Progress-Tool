import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

// Log warnings for missing environment variables (but don't throw errors)
// NextAuth will handle these gracefully
if (process.env.NODE_ENV === "development") {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.warn(
      "⚠️  Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET."
    );
  }
  if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
    console.warn(
      "⚠️  Missing authentication secret. Please set AUTH_SECRET or NEXTAUTH_SECRET."
    );
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  // 1. Adapter: Connects to Postgres to create/update the User record
  adapter: PrismaAdapter(db),

  // 1. Providers
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

  // 5. Secret: Try AUTH_SECRET first, then fall back to NEXTAUTH_SECRET
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // 6. Debug mode (only enable in development)
  debug: process.env.NODE_ENV === "development",
});
