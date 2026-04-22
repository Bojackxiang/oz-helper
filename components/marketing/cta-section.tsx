import Link from "next/link";

export function CTASection() {
  return (
    <section className="border-t border-white/5 bg-[#080808] py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-[#D4AF37]">
            Join OzHelper
          </p>

          <h2
            className="mb-5 text-balance text-4xl font-black text-white md:text-5xl"
            style={{
              fontFamily: "DM Sans, sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            Ready to get things done?
          </h2>

          <p className="mb-10 text-lg text-[#A6A6A6]">
            Join thousands of Australians already using OzHelper to get tasks
            done or earn extra income in their community.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="rounded-full bg-[#D4AF37] px-8 py-3.5 text-sm font-bold text-black transition-all duration-150 hover:bg-[#D4AF37]/90 active:scale-95"
            >
              Post Your First Task
            </Link>
            <Link
              href="/sign-up?mode=tasker"
              className="rounded-full border border-white/15 px-8 py-3.5 text-sm font-medium text-white transition-all duration-150 hover:border-white/30 hover:bg-white/5 active:scale-95"
            >
              Start Earning Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
