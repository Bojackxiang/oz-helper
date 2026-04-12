import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute — data stays fresh
        gcTime: 5 * 60 * 1000, // 5 minutes — keep in cache after unmount
        retry: (failureCount, error: unknown) => {
          // Don't retry on client errors (4xx)
          if (error instanceof ApiError && error.status < 500) return false;
          return failureCount < 2;
        },
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
