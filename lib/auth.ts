import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // 1. Adapter: Connects NextAuth to your Prisma Database
  adapter: PrismaAdapter(db),

  // 2. Providers: We only enable Google for Teachers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 3. Session Strategy: We use database sessions for security
  session: {
    strategy: "database",
  },

  // 4. Callbacks: Customize what data is available in the session
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Attach the User ID to the session so we can query classes later
        session.user.id = user.id;
        // @ts-ignore // Role is custom field
        session.user.role = user.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect teachers to the dashboard after login
      return `${baseUrl}/dashboard`;
    },
  },

  // 5. Pages: Custom login pages (optional, using default for now)
  pages: {
    signIn: '/auth/signin',
  }
};

const handler = NextAuth(authOptions);

export const handlers = { GET: handler, POST: handler };
