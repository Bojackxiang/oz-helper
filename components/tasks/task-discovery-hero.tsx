import Link from "next/link";
import { Search, MapPin, Plus, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TOTAL_TASKS = "2,340";
const TOTAL_TASKERS = "15,000+";

interface TaskDiscoveryHeroProps {
  onSearchChange?: (value: string) => void;
  search?: string;
}

export function TaskDiscoveryHero() {
  return (
    <section className="border-b border-border bg-background py-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-2 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Find tasks in your area
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Browse {TOTAL_TASKS}+ active tasks across Australia — or post your
            own
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks, category or suburb…"
                className="pl-9"
                readOnly
              />
            </div>
            <Button
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90 sm:w-auto"
            >
              <Link href="/sign-up">
                <Plus className="mr-2 h-4 w-4" />
                Post a Task
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-primary" />
              {TOTAL_TASKS} tasks posted today
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              {TOTAL_TASKERS} verified taskers
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              All Australian states
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
