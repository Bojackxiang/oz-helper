export function TaskCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-white/5 bg-[#111111]">
      {/* Image area */}
      <div className="aspect-3/2 w-full animate-pulse bg-white/5" />
      {/* Content */}
      <div className="space-y-3 p-4">
        <div className="h-5 w-24 animate-pulse rounded-full bg-white/5" />
        <div className="h-5 w-full animate-pulse rounded-full bg-white/5" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-white/5" />
        <div className="space-y-2 border-t border-white/5 pt-3">
          <div className="h-4 w-32 animate-pulse rounded-full bg-white/5" />
          <div className="flex justify-between">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-16 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
      </div>
    </div>
  );
}
