/**
 * NextAuth configuration for admin authentication
 * Validates credentials via backend API
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// User role type
export type UserRole = "ADMIN" | "EDITOR" | "VIEWER";

// Use relative URLs in production (same origin), localhost in development
const getApiUrl = () => {
  if (process.env.API_URL) {
    return process.env.API_URL;
  }
  // In production (Vercel), use relative URLs
  if (process.env.NODE_ENV === "production") {
    return "";
  }
  return "http://localhost:4000";
};

const API_URL = getApiUrl();

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Call backend API to validate credentials
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.success || !data.user) {
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email,
            role: data.user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// Type augmentation for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
    };
  }

  interface User {
    role: UserRole;
  }

  interface JWT {
    id: string;
    role: UserRole;
  }
}

