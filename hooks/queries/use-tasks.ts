import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchTasks, fetchTask } from "@/lib/api/tasks";
import { queryKeys } from "@/lib/query-keys";
import type { TaskFilters } from "@/types/task";

const PAGE_SIZE = 9;

export function useTasks(filters: Partial<TaskFilters> = {}, page = 1) {
  return useQuery({
    queryKey: queryKeys.tasks.list({ ...filters, page }),
    queryFn: () => fetchTasks({ ...filters, page, pageSize: PAGE_SIZE }),
    placeholderData: keepPreviousData,
  });
}

export function useTask(id: number) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => fetchTask(id),
    enabled: !!id,
  });
}
