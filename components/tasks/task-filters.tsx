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
      <div className="sticky top-16 z-30 border-b border-white/5 bg-[#080808]/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 active:scale-95",
                    isActive
                      ? "bg-[#D4AF37] text-black"
                      : "bg-white/5 text-[#A6A6A6] ring-1 ring-white/10 hover:bg-white/10 hover:text-white",
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
      <div className="container mx-auto mb-6 flex flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => onStateChange(s)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-150",
                activeState === s
                  ? "bg-[#163266] text-white"
                  : "text-[#A6A6A6] hover:text-white",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="shrink-0 text-sm text-[#A6A6A6]">
          <span className="font-mono text-white">{resultCount}</span> task
          {resultCount !== 1 ? "s" : ""} found
        </p>
      </div>
    </>
  );
}
