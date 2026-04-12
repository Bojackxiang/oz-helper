import { ApiError } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("oz_access_token")
      : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers as Record<string, string>),
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("oz_access_token");
      window.location.href = "/sign-in?reason=session_expired";
    }
    throw new ApiError(401, "UNAUTHORIZED", "Session expired. Please sign in.");
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      (body as { code?: string }).code ?? "UNKNOWN_ERROR",
      (body as { message?: string }).message ?? `HTTP ${res.status}`,
    );
  }

  return res.json() as Promise<T>;
}
