"use client";

import { useState } from "react";
import { WifiOff, RotateCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { queryKeys } from "@/lib/query-keys";

interface TaskFeedErrorProps {
  error: unknown;
}

export function TaskFeedError({ error }: TaskFeedErrorProps) {
  const queryClient = useQueryClient();
  const [isRetrying, setIsRetrying] = useState(false);

  const raw = error instanceof Error ? error.message : "Unable to load tasks";
  const message =
    raw === "Failed to fetch"
      ? "Can't reach the server right now. Check your connection and try again."
      : raw;

  async function handleRetry() {
    setIsRetrying(true);
    await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all() });
    setTimeout(() => setIsRetrying(false), 800);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card py-16 text-center shadow-sm">
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-transparent" />

      <div className="relative flex flex-col items-center px-8">
        {/* Icon */}
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/8 ring-4 ring-destructive/5">
          <WifiOff className="h-6 w-6 text-destructive/75" />
        </div>

        <h3 className="mb-1.5 text-base font-semibold text-foreground">
          Failed to load tasks
        </h3>
        <p className="mb-7 max-w-xs text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-xl border-border/70 bg-background px-5 hover:bg-muted"
          onClick={handleRetry}
          disabled={isRetrying}
        >
          <RotateCcw
            className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")}
          />
          {isRetrying ? "Retrying…" : "Try again"}
        </Button>
      </div>
    </div>
  );
}
