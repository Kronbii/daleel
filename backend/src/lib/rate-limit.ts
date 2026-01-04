/**
 * Rate limiting implementation
 * Simple in-memory for dev, can be swapped with Redis adapter
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

class InMemoryRateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      Object.keys(this.store).forEach((key) => {
        if (this.store[key].resetAt < now) {
          delete this.store[key];
        }
      });
    }, 5 * 60 * 1000);
  }

  async check(
    identifier: string,
    windowMs: number,
    maxRequests: number
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    const now = Date.now();
    const key = identifier;
    const entry = this.store[key];

    if (!entry || entry.resetAt < now) {
      // New window or expired
      this.store[key] = {
        count: 1,
        resetAt: now + windowMs,
      };
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetAt: now + windowMs,
      };
    }

    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: entry.resetAt,
      };
    }

    entry.count += 1;
    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetAt: entry.resetAt,
    };
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Singleton instance
let rateLimiter: InMemoryRateLimiter | null = null;

export function getRateLimiter(): InMemoryRateLimiter {
  if (!rateLimiter) {
    rateLimiter = new InMemoryRateLimiter();
  }
  return rateLimiter;
}

export async function rateLimit(
  identifier: string,
  windowMs: number,
  maxRequests: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const limiter = getRateLimiter();
  return limiter.check(identifier, windowMs, maxRequests);
}

// Helper to get client identifier (IP or user ID)
export function getClientIdentifier(req: { headers: Record<string, string | string[] | undefined>; ip?: string }): string {
  // In production, extract from headers (X-Forwarded-For, etc.)
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedStr = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  const ip = forwardedStr ? forwardedStr.split(",")[0] : req.ip || "unknown";
  return ip;
}

