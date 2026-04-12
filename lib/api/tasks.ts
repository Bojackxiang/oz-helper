import { apiClient } from "./client";
import { mockTasks, mockTasksPage } from "@/lib/mocks/tasks";
import type { Task, TaskFilters } from "@/types/task";
import type { PaginatedResponse } from "@/types/api";

const PAGE_SIZE = 9;

function buildParams(
  filters: Partial<TaskFilters> & { page?: number; pageSize?: number },
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.categoryId && filters.categoryId !== "all")
    params.set("category", filters.categoryId);
  if (filters.state && filters.state !== "All States")
    params.set("state", filters.state);
  if (filters.search) params.set("q", filters.search);
  if (filters.sortBy) params.set("sort", filters.sortBy);
  if (filters.page) params.set("page", String(filters.page));
  params.set("pageSize", String(filters.pageSize ?? PAGE_SIZE));
  return params;
}

export async function fetchTasks(
  filters: Partial<TaskFilters> & { page?: number; pageSize?: number } = {},
): Promise<PaginatedResponse<Task>> {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    await new Promise((r) => setTimeout(r, 400));

    // Apply filters client-side against mock data
    const q = (filters.search ?? "").toLowerCase();
    const filtered = mockTasks.filter((t) => {
      const matchesCat =
        !filters.categoryId ||
        filters.categoryId === "all" ||
        t.category === filters.categoryId;
      const matchesState =
        !filters.state ||
        filters.state === "All States" ||
        t.state === filters.state;
      const matchesQ =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.suburb.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesState && matchesQ;
    });

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? PAGE_SIZE;
    const start = (page - 1) * pageSize;
    const slice = filtered.slice(start, start + pageSize);

    return {
      data: slice,
      total: filtered.length,
      page,
      pageSize,
      hasMore: start + pageSize < filtered.length,
    };
  }

  return apiClient(`/tasks?${buildParams(filters).toString()}`);
}

export async function fetchTask(id: number): Promise<Task> {
  if (process.env.NEXT_PUBLIC_USE_MOCKS === "true") {
    await new Promise((r) => setTimeout(r, 200));
    const task = mockTasks.find((t) => t.id === id);
    if (!task) throw new Error(`Task ${id} not found`);
    return task;
  }
  return apiClient(`/tasks/${id}`);
}

export async function createTask(
  payload: Omit<
    Task,
    "id" | "postedAt" | "postedAgo" | "status" | "offers" | "poster"
  >,
): Promise<Task> {
  return apiClient("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitOffer(
  taskId: number,
  payload: { message: string; price: number },
): Promise<void> {
  return apiClient(`/tasks/${taskId}/offers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
