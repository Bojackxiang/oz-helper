import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { TaskCardSkeleton } from "@/components/tasks/task-card-skeleton";

export default function HomeLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        {/* Hero placeholder */}
        <section className="border-b border-border bg-background py-10">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
              <div className="mx-auto h-10 w-72 animate-pulse rounded-lg bg-muted" />
              <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-muted" />
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="h-10 flex-1 animate-pulse rounded-lg bg-muted" />
                <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
          </div>
        </section>

        {/* Category pill strip placeholder */}
        <div className="border-b border-border py-3">
          <div className="container mx-auto flex gap-2 overflow-hidden px-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-muted"
              />
            ))}
          </div>
        </div>

        {/* Task grid skeleton */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* State tabs placeholder */}
            <div className="mb-6 flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
