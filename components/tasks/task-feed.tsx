"use client";

import { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/hooks/queries/use-tasks";
import { TaskCard } from "./task-card";
import { TaskCardSkeleton } from "./task-card-skeleton";
import { TaskFeedError } from "./task-feed-error";
import { TaskFilters } from "./task-filters";
import type { TaskFilters as TaskFiltersType } from "@/types/task";

const PAGE_SIZE = 9;

export function TaskFeed() {
  const [filters, setFilters] = useState<Partial<TaskFiltersType>>({});
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching } = useTasks(
    filters,
    page,
  );

  function handleCategoryChange(categoryId: string) {
    setFilters((prev) => ({
      ...prev,
      categoryId: categoryId as TaskFiltersType["categoryId"],
    }));
    setPage(1);
  }

  function handleStateChange(state: string) {
    setFilters((prev) => ({ ...prev, state }));
    setPage(1);
  }

  function handleSearchChange(search: string) {
    setFilters((prev) => ({ ...prev, search }));
    setPage(1);
  }

  function resetFilters() {
    setFilters({});
    setPage(1);
  }

  const resultCount = data?.total ?? 0;
  const tasks = data?.data ?? [];
  const hasMore = data?.hasMore ?? false;

  return (
    <>
      <TaskFilters
        activeCategory={filters.categoryId ?? "all"}
        activeState={filters.state ?? "All States"}
        resultCount={isLoading ? 0 : resultCount}
        onCategoryChange={handleCategoryChange}
        onStateChange={handleStateChange}
      />

      <section className="py-8">
        <div className="container mx-auto px-4">
          {isError ? (
            <TaskFeedError error={error} />
          ) : isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          ) : tasks.length > 0 ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    className="bg-transparent px-8"
                    disabled={isFetching}
                    onClick={() => setPage((n) => n + 1)}
                  >
                    {isFetching ? "Loading…" : "Load More Tasks"}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                No tasks found
              </h3>
              <p className="mb-6 text-muted-foreground">
                Try a different category, state, or search term
              </p>
              <Button
                variant="outline"
                className="bg-transparent"
                onClick={resetFilters}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
