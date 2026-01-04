/**
 * Backend Adapter for Vercel Serverless Functions
 * Bridges Next.js API routes to Express backend handlers
 */

import type { NextRequest, NextResponse } from "next/server";
import type { Request, Response, NextFunction } from "express";
import { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
// Import backend Express app from compiled output
// Backend is built before frontend, so we can import from dist
import app from "../backend/dist/server.js";

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
  incoming.socket = {
    remoteAddress: nextReq.ip || nextReq.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
  } as any;
  
  // Create Express Request by extending IncomingMessage
  const req = incoming as any as Request;
  
  // Add Express-specific properties
  req.path = path;
  req.query = Object.fromEntries(searchParams.entries());
  req.body = body;
  req.cookies = Object.fromEntries(
    nextReq.cookies.getAll().map(c => [c.name, c.value])
  );
  req.ip = nextReq.ip || nextReq.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  req.get = (name: string) => nextReq.headers.get(name) || undefined;
  req.header = (name: string) => nextReq.headers.get(name) || undefined;
  req.protocol = url.protocol.slice(0, -1);
  req.hostname = url.hostname;
  req.secure = url.protocol === "https:";
  req.originalUrl = path + url.search;
  req.baseUrl = "";
  req.params = {};
  
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
  
  // Dispatch to Express app
  try {
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

