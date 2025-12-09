import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables."
  );
}

if (!process.env.AUTH_SECRET && !process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "Missing authentication secret. Please set AUTH_SECRET or NEXTAUTH_SECRET in environment variables."
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,

  // 1. Adapter: Connects to Postgres to create/update the User record
  adapter: PrismaAdapter(db),

  // 2. Providers
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

  // 3. Strategy: JWT is required for Vercel Edge compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 4. Pages
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Error page for OAuth errors
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

  // 6. Secret: Try AUTH_SECRET first, then fall back to NEXTAUTH_SECRET
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,

  // 7. Debug mode (only enable in development)
  debug: process.env.NODE_ENV === "development",
});
