/**
 * API client for fetching data from the backend
 * 
 * In production (Vercel), if NEXT_PUBLIC_API_URL is not set, uses relative URLs
 * for same-origin requests (frontend and backend on same domain).
 * In development, defaults to http://localhost:4000
 */
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In production (Vercel), use relative URLs (empty string)
  // In development, use localhost
  if (process.env.NODE_ENV === "production") {
    return "";
  }
  return "http://localhost:4000";
};

const API_URL = getApiUrl();

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, cache, next } = options;

  const fetchOptions: RequestInit & { next?: NextFetchRequestConfig } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    credentials: "include", // Include cookies for auth
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  if (cache) {
    fetchOptions.cache = cache;
  }

  if (next) {
    fetchOptions.next = next;
  }

  const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// PUBLIC API
// ============================================================================

export async function getCycles() {
  const response = await request<{ success: true; data: any[] }>("/api/public/cycles", {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  return response.data;
}

export async function getDistricts(params?: { page?: number; pageSize?: number; cycleId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.cycleId) searchParams.set("cycleId", params.cycleId);

  const query = searchParams.toString();
  const response = await request<{
    success: true;
    data: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/api/public/districts${query ? `?${query}` : ""}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  return response;
}

export async function getDistrictById(id: string) {
  const response = await request<{ success: true; data: any }>(
    `/api/public/districts/${encodeURIComponent(id)}`,
    {
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );
  return response.data;
}

export async function getLists(params?: {
  page?: number;
  pageSize?: number;
  cycleId?: string;
  districtId?: string;
  status?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.cycleId) searchParams.set("cycleId", params.cycleId);
  if (params?.districtId) searchParams.set("districtId", params.districtId);
  if (params?.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  const response = await request<{
    success: true;
    data: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/api/public/lists${query ? `?${query}` : ""}`, {
    next: { revalidate: 300 }, // Cache for 5 minutes
  });
  return response;
}

export async function getListById(id: string) {
  const response = await request<{ success: true; data: any }>(
    `/api/public/lists/${encodeURIComponent(id)}`,
    {
      next: { revalidate: 300 }, // Cache for 5 minutes
    }
  );
  return response.data;
}

export async function getCandidates(params?: {
  page?: number;
  pageSize?: number;
  cycleId?: string;
  districtId?: string;
  listId?: string;
  status?: string;
  q?: string;
}) {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize));
  if (params?.cycleId) searchParams.set("cycleId", params.cycleId);
  if (params?.districtId) searchParams.set("districtId", params.districtId);
  if (params?.listId) searchParams.set("listId", params.listId);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.q) searchParams.set("q", params.q);

  const query = searchParams.toString();
  const response = await request<{
    success: true;
    data: any[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/api/public/candidates${query ? `?${query}` : ""}`, {
    next: { revalidate: 60 }, // Cache for 1 minute
  });
  return response;
}

export async function getCandidateBySlug(slug: string) {
  const response = await request<{ success: true; data: any }>(
    `/api/public/candidates/${encodeURIComponent(slug)}`,
    {
      next: { revalidate: 60 }, // Cache for 1 minute
    }
  );
  return response.data;
}

export async function getCenters(params?: { districtId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.districtId) searchParams.set("districtId", params.districtId);

  const query = searchParams.toString();
  const response = await request<{ data: any[] }>(
    `/api/public/centers${query ? `?${query}` : ""}`,
    {
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );
  return response.data;
}

// ============================================================================
// AUTH API (for admin)
// ============================================================================

export async function login(email: string, password: string) {
  const response = await request<{
    success: true;
    data: {
      user: { id: string; email: string; role: string };
      csrfToken: string;
    };
  }>("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return response.data;
}

export async function logout() {
  const response = await request<{ success: true; data: { message: string } }>("/api/auth/logout", {
    method: "POST",
  });
  return response.data;
}

export async function getSession() {
  try {
    const response = await request<{
      success: true;
      data: { user: { id: string; email: string; role: string } };
    }>("/api/auth/session");
    return response.data;
  } catch {
    return null;
  }
}

export async function getCSRFToken() {
  const response = await request<{ success: true; data: { csrfToken: string } }>("/api/auth/csrf");
  return response.data.csrfToken;
}

// ============================================================================
// ADMIN API
// ============================================================================

export async function createSource(data: {
  title: string;
  publisher: string;
  originalUrl: string;
  archivedUrl: string;
  archivedAt: Date;
  archiveMethod: string;
  contentType?: string;
  checksum?: string;
  notes?: string;
  csrfToken: string;
}) {
  const response = await request<{ success: true; data: any }>("/api/admin/sources", {
    method: "POST",
    body: data,
  });
  return response.data;
}

