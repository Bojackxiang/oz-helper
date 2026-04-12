import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryImageSeeds } from "@/lib/mocks/tasks";
import type { Task } from "@/types/task";

interface TaskCardProps {
  task: Task;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  const seedKey = categoryImageSeeds[task.category] ?? task.category;
  const imageUrl = `https://picsum.photos/seed/${seedKey}${task.id}/600/400`;
  const priceLabel = `$${task.price}`;

  return (
    <Link
      href="/sign-up"
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary hover:shadow-md",
        className,
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-3/2 overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={task.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Price badge — top right */}
        <span className="absolute right-3 top-3 rounded-full bg-card/85 px-3 py-1 text-sm font-bold text-accent shadow backdrop-blur-sm">
          {priceLabel}
        </span>
        {/* Urgent badge — top left */}
        {task.urgent && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-2.5 py-1 text-xs font-semibold text-white shadow">
            Urgent
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {task.categoryLabel}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 font-semibold text-card-foreground transition-colors group-hover:text-primary">
          {task.title}
        </h3>

        <div className="mt-auto space-y-2 border-t border-border pt-3">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>
              {task.suburb}, {task.state}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {task.poster.name[0]}
              </div>
              <span className="text-sm text-muted-foreground">
                {task.poster.name}
              </span>
              {task.poster.verified && (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
              )}
              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-accent text-accent" />
                {task.poster.rating.toFixed(1)}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {task.postedAgo}
            </span>
          </div>
          {task.offers > 0 && (
            <p className="text-xs text-muted-foreground">
              {task.offers} offer{task.offers !== 1 ? "s" : ""} submitted
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
