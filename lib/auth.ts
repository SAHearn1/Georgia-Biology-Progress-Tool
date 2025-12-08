import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export const authOptions: NextAuthConfig = {
  // 1. Adapter: Connects NextAuth to your Prisma Database
  adapter: PrismaAdapter(db),

  // 2. Providers: We only enable Google for Teachers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  // 3. Session Strategy: NextAuth v5 with PrismaAdapter uses JWT
  session: {
    strategy: "jwt",
  },

  // 4. Callbacks: Customize what data is available in the session
  callbacks: {
    async jwt({ token, user }) {
      // On sign in, add user id and role to the token
      if (user) {
        token.id = user.id;
        // @ts-ignore // Role is custom field
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user id and role from token to session
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
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

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
