import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // 1. Adapter: Still used to create/update User records in Postgres
  adapter: PrismaAdapter(db),

  // 2. Providers: Google
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 3. Strategy: FORCED to JWT for Vercel Edge compatibility
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // 4. Pages: Custom sign-in to match our branding
  pages: {
    signIn: "/api/auth/signin",
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

    // B. Session Callback: Called whenever useSession() or auth() is used
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub; // Make User ID available in the app
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },

    // C. Redirect: Always send to dashboard after login
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard`;
    },
  },

  // 6. Secret: Required for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
});
