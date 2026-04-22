import Link from "next/link";
import { Search, MapPin, Plus, Users, TrendingUp } from "lucide-react";

const TOTAL_TASKS = "2,340";
const TOTAL_TASKERS = "15,000+";

export function TaskDiscoveryHero() {
  return (
    <section
      className="px-4 pb-16 pt-20 md:pb-24 md:pt-28"
      style={{
        background: "radial-gradient(ellipse at top, #0D1829 0%, #080808 60%)",
      }}
    >
      <div className="container mx-auto">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold text-[#D4AF37]">
            <TrendingUp className="h-3.5 w-3.5" />
            {TOTAL_TASKS} tasks posted today
          </div>

          {/* Heading */}
          <h1
            className="mb-5 text-balance text-5xl font-black text-white md:text-6xl lg:text-7xl"
            style={{
              fontFamily: "DM Sans, sans-serif",
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
            }}
          >
            Australia&apos;s <span className="text-[#D4AF37]">Tradie</span>
            <br />
            Marketplace
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base text-[#A6A6A6] md:text-lg">
            Browse {TOTAL_TASKS}+ active tasks across Australia — or post your
            own.
          </p>

          {/* Search row */}
          <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A6A6A6]" />
              <input
                placeholder="Search tasks, category or suburb…"
                className="w-full rounded-full border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder-[#A6A6A6] outline-none transition-all duration-150 focus:border-[#D4AF37]/40 focus:ring-2 focus:ring-[#D4AF37]/20"
                readOnly
              />
            </div>
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition-all duration-150 hover:bg-[#D4AF37]/90 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Post a Task
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-[#A6A6A6]">
            <span className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-[#163266]" />
              {TOTAL_TASKERS} verified taskers
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#163266]" />
              All Australian states
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
