import type { TaskFilters } from "@/types/task";

export const queryKeys = {
  tasks: {
    all: () => ["tasks"] as const,
    list: (filters: Partial<TaskFilters> & { page?: number }) =>
      ["tasks", "list", filters] as const,
    detail: (id: number) => ["tasks", "detail", id] as const,
  },
  profile: {
    me: () => ["profile", "me"] as const,
  },
  wallet: {
    me: () => ["wallet", "me"] as const,
    transactions: () => ["wallet", "transactions"] as const,
  },
  messages: {
    conversations: () => ["messages", "conversations"] as const,
    thread: (id: number) => ["messages", "thread", id] as const,
  },
} as const;
