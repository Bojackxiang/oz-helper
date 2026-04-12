"use client";

import {
  Trees,
  Dog,
  Wrench,
  Truck,
  Sparkles,
  Zap,
  Paintbrush,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskFilters } from "@/types/task";

const categories = [
  { id: "all", name: "All Tasks", icon: null },
  { id: "garden", name: "Garden & Lawn", icon: Trees },
  { id: "pets", name: "Pet Care", icon: Dog },
  { id: "handyman", name: "Handyman", icon: Wrench },
  { id: "removals", name: "Removals", icon: Truck },
  { id: "cleaning", name: "Cleaning", icon: Sparkles },
  { id: "electrical", name: "Electrical", icon: Zap },
  { id: "painting", name: "Painting", icon: Paintbrush },
  { id: "errands", name: "Errands", icon: ShoppingBag },
] as const;

const states = [
  "All States",
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "ACT",
  "NT",
] as const;

interface TaskFiltersProps {
  activeCategory: string;
  activeState: string;
  resultCount: number;
  onCategoryChange: (categoryId: string) => void;
  onStateChange: (state: string) => void;
}

export function TaskFilters({
  activeCategory,
  activeState,
  resultCount,
  onCategoryChange,
  onStateChange,
}: TaskFiltersProps) {
  return (
    <>
      {/* Category pills (sticky) */}
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary",
                  )}
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* State tabs + result count */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => onStateChange(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                activeState === s
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          {resultCount} task{resultCount !== 1 ? "s" : ""} found
        </p>
      </div>
    </>
  );
}
