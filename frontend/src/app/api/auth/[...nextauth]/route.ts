/**
 * NextAuth API route handler
 * Handles session management (JWT tokens)
 * Credential validation is delegated to the backend API
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

