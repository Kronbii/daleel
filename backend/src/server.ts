/**
 * Daleel Backend Server
 * Express server with all API routes mounted
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import publicRoutes from "./api/public/index.js";
import adminRoutes from "./api/admin/index.js";
import authRoutes from "./api/auth/index.js";
import { SECURITY_HEADERS } from "../../shared/constants.js";

const app = express();

// Trust proxy for accurate IP detection behind reverse proxy
app.set("trust proxy", 1);

// Security middleware
app.use(helmet());

// Set security headers
app.use((req, res, next) => {
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  next();
});

// CORS configuration
// In Vercel, frontend and backend are on the same domain
// Allow both the Vercel deployment URL and custom FRONTEND_URL if set
const getCorsOrigin = () => {
  if (process.env.FRONTEND_URL) {
    return process.env.FRONTEND_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

app.use(
  cors({
    origin: getCorsOrigin(),
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Mount API routes
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Not found" });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  });
});

// Start server only if not in serverless environment (Vercel)
// In Vercel, the app is exported and handled by the serverless function
if (process.env.VERCEL !== "1" && !process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 4000;
  const HOST = process.env.HOST || "0.0.0.0";

  app.listen(Number(PORT), HOST, () => {
    console.log(`🚀 Daleel Backend running on http://${HOST}:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`   CORS origin: ${corsOrigin}`);
  });
}

export default app;
