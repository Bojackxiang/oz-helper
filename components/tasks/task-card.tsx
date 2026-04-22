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
        "group flex flex-col overflow-hidden rounded-[20px] border border-white/5 bg-[#111111] transition-all duration-300 hover:border-[#D4AF37]/40 hover:ring-1 hover:ring-[#D4AF37]/20",
        className,
      )}
    >
      {/* Cover image */}
      <div className="relative aspect-3/2 overflow-hidden bg-[#111]">
        <Image
          src={imageUrl}
          alt={task.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        {/* Price badge — top right */}
        <span className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 font-mono text-sm font-bold text-[#D4AF37] backdrop-blur-sm">
          {priceLabel}
        </span>
        {/* Urgent badge — top left */}
        {task.urgent && (
          <span className="absolute left-3 top-3 rounded-full bg-[#EC4899] px-2.5 py-1 text-xs font-semibold text-white">
            Urgent
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2.5">
          <span className="rounded-full bg-[#163266]/60 px-3 py-1 text-xs font-medium text-[#A6A6A6]">
            {task.categoryLabel}
          </span>
        </div>

        <h3 className="mb-3 line-clamp-2 font-semibold text-white transition-colors group-hover:text-[#D4AF37]">
          {task.title}
        </h3>

        <div className="mt-auto space-y-2 border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5 text-sm text-[#A6A6A6]">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span>
              {task.suburb}, {task.state}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#163266] text-xs font-semibold text-white">
                {task.poster.name[0]}
              </div>
              <span className="text-sm text-[#A6A6A6]">{task.poster.name}</span>
              {task.poster.verified && (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#EC4899]" />
              )}
              <span className="flex items-center gap-0.5 text-xs text-[#A6A6A6]">
                <Star className="h-3 w-3 fill-[#EC4899] text-[#EC4899]" />
                {task.poster.rating.toFixed(1)}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs text-[#A6A6A6]">
              <Clock className="h-3 w-3" />
              {task.postedAgo}
            </span>
          </div>
          {task.offers > 0 && (
            <p className="text-xs text-[#A6A6A6]">
              {task.offers} offer{task.offers !== 1 ? "s" : ""} submitted
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
