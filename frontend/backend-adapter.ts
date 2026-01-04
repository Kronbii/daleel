/**
 * Backend Adapter for Vercel Serverless Functions
 * Bridges Next.js API routes to Express backend handlers
 */

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Request, Response, NextFunction } from "express";
import { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";

// Lazy load backend app to avoid build-time resolution issues
// Use dynamic import with path relative to frontend directory
let appPromise: Promise<any> | null = null;

async function getBackendApp() {
  if (!appPromise) {
    // Path resolution: Since Turbopack root is set to repo root (parent of frontend/)
    // and we're in frontend/backend-adapter.ts, we need to go up to repo root
    // From frontend/backend-adapter.ts: ../backend/dist/server.js
    // But Turbopack resolves from its root, so: backend/dist/server.js
    const backendPath = "backend/dist/server.js";
    
    appPromise = import(backendPath).then((mod) => mod.default).catch((err: any) => {
      // Fallback: try relative path from current file location
      console.warn("Failed to load backend from Turbopack root, trying relative path:", err.message);
      return import("../backend/dist/server.js").then((mod) => mod.default);
    }).catch((err: any) => {
      console.error("Failed to load backend app from all paths:", err);
      console.error("Current working directory:", process.cwd());
      throw err;
    });
  }
  return appPromise;
}

/**
 * Convert Next.js Request to Express-compatible Request
 */
async function createExpressRequest(nextReq: NextRequest, path: string): Promise<Request> {
  const url = new URL(nextReq.url);
  const searchParams = url.searchParams;
  
  // Parse body
  let body: any = undefined;
  const contentType = nextReq.headers.get("content-type") || "";
  
  if (nextReq.method !== "GET" && nextReq.method !== "HEAD" && nextReq.method !== "OPTIONS") {
    if (contentType.includes("application/json")) {
      try {
        body = await nextReq.json();
      } catch {
        body = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await nextReq.text();
      const params = new URLSearchParams(text);
      body = Object.fromEntries(params);
    }
  }
  
  // Create IncomingMessage
  const incoming = Object.create(IncomingMessage.prototype);
  incoming.method = nextReq.method;
  incoming.url = path + url.search;
  incoming.headers = Object.fromEntries(nextReq.headers.entries());
  
  // Extract IP address from headers (NextRequest doesn't have .ip property)
  const forwardedFor = nextReq.headers.get("x-forwarded-for");
  const realIp = nextReq.headers.get("x-real-ip");
  const remoteAddress = forwardedFor?.split(",")[0]?.trim() || realIp || "unknown";
  
  incoming.socket = {
    remoteAddress,
  } as any;
  
  // Create Express Request by extending IncomingMessage
  const req = incoming as any as Request;
  
  // Add Express-specific properties (use defineProperty for read-only properties)
  Object.defineProperty(req, "path", { value: path, writable: true, configurable: true });
  Object.defineProperty(req, "query", { value: Object.fromEntries(searchParams.entries()), writable: true, configurable: true });
  Object.defineProperty(req, "body", { value: body, writable: true, configurable: true });
  Object.defineProperty(req, "cookies", { value: Object.fromEntries(
    nextReq.cookies.getAll().map(c => [c.name, c.value])
  ), writable: true, configurable: true });
  Object.defineProperty(req, "ip", { value: remoteAddress, writable: true, configurable: true });
  Object.defineProperty(req, "get", { value: (name: string) => nextReq.headers.get(name) || undefined, writable: true, configurable: true });
  Object.defineProperty(req, "header", { value: (name: string) => nextReq.headers.get(name) || undefined, writable: true, configurable: true });
  Object.defineProperty(req, "protocol", { value: url.protocol.slice(0, -1), writable: true, configurable: true });
  Object.defineProperty(req, "hostname", { value: url.hostname, writable: true, configurable: true });
  Object.defineProperty(req, "secure", { value: url.protocol === "https:", writable: true, configurable: true });
  Object.defineProperty(req, "originalUrl", { value: path + url.search, writable: true, configurable: true });
  Object.defineProperty(req, "baseUrl", { value: "", writable: true, configurable: true });
  Object.defineProperty(req, "params", { value: {}, writable: true, configurable: true });
  
  return req;
}

/**
 * Create Express Response wrapper that captures output for Next.js
 */
function createExpressResponse(): { res: Response; promise: Promise<NextResponse> } {
  let statusCode = 200;
  const headers: Record<string, string | string[]> = {};
  const cookies: string[] = [];
  let body: any = null;
  let finished = false;
  let headersSent = false;
  
  // Create ServerResponse
  const serverRes = Object.create(ServerResponse.prototype);
  serverRes.statusCode = 200;
  serverRes.headersSent = false;
  
  const res = serverRes as any as Response;
  
  // Override methods to capture output
  res.status = function(code: number) {
    statusCode = code;
    serverRes.statusCode = code;
    return this;
  };
  
  res.json = function(data: any) {
    if (headersSent) return this;
    body = data;
    headers["content-type"] = "application/json";
    finished = true;
    headersSent = true;
    return this;
  };
  
  res.send = function(data: any) {
    if (headersSent) return this;
    body = data;
    finished = true;
    headersSent = true;
    return this;
  };
  
  res.setHeader = function(name: string, value: string | string[]) {
    if (name.toLowerCase() === "set-cookie") {
      if (Array.isArray(value)) {
        cookies.push(...value);
      } else {
        cookies.push(value);
      }
    } else {
      headers[name.toLowerCase()] = value;
    }
    return this;
  };
  
  res.getHeader = function(name: string) {
    return headers[name.toLowerCase()];
  };
  
  res.cookie = function(name: string, value: string, options?: any) {
    const cookieParts = [`${name}=${value}`];
    if (options?.httpOnly) cookieParts.push("HttpOnly");
    if (options?.secure) cookieParts.push("Secure");
    if (options?.sameSite) cookieParts.push(`SameSite=${options.sameSite}`);
    if (options?.path) cookieParts.push(`Path=${options.path}`);
    if (options?.maxAge) cookieParts.push(`Max-Age=${options.maxAge}`);
    cookies.push(cookieParts.join("; "));
    return this;
  };
  
  res.clearCookie = function(name: string, options?: any) {
    const cookieParts = [`${name}=`];
    cookieParts.push("Max-Age=0");
    if (options?.path) cookieParts.push(`Path=${options.path}`);
    cookies.push(cookieParts.join("; "));
    return this;
  };
  
  res.end = function(chunk?: any) {
    if (!finished && chunk) {
      body = chunk;
    }
    finished = true;
    headersSent = true;
    return this;
  };
  
  const promise = new Promise<NextResponse>((resolve) => {
    // Poll for completion
    const checkFinished = () => {
      if (finished) {
        const nextHeaders = new Headers();
        Object.entries(headers).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => nextHeaders.append(key, v));
          } else {
            nextHeaders.set(key, value);
          }
        });
        cookies.forEach(cookie => {
          nextHeaders.append("Set-Cookie", cookie);
        });
        
        resolve(new NextResponse(
          typeof body === "string" ? body : body !== null ? JSON.stringify(body) : null,
          {
            status: statusCode,
            headers: nextHeaders,
          }
        ));
      } else {
        setTimeout(checkFinished, 5);
      }
    };
    
    checkFinished();
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!finished) {
        finished = true;
        resolve(new NextResponse(
          JSON.stringify({ success: false, error: "Request timeout" }),
          { status: 504, headers: new Headers() }
        ));
      }
    }, 30000);
  });
  
  return { res, promise };
}

/**
 * Handle request by dispatching to Express app
 */
export async function handleBackendRequest(
  nextReq: NextRequest,
  path: string
): Promise<NextResponse> {
  // Create Express request/response
  const req = await createExpressRequest(nextReq, path);
  const { res, promise } = createExpressResponse();
  
  // Handle errors
  const errorHandler = (err: Error) => {
    console.error("Backend error:", err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
      });
    }
  };
  
  // Load backend app dynamically (runtime import to avoid build-time resolution)
  try {
    const app = await getBackendApp();
    app(req, res, (err?: Error) => {
      if (err) {
        errorHandler(err);
      }
    });
  } catch (err) {
    errorHandler(err instanceof Error ? err : new Error(String(err)));
  }
  
  return promise;
}

