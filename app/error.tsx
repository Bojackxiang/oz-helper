"use client";

import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";
import { MarketingHeader } from "@/components/marketing/header";
import { MarketingFooter } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";

export default function HomeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message =
    !error.message || error.message === "Failed to fetch"
      ? "We couldn't load the page. It might be a network hiccup or a temporary issue on our end."
      : error.message;

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-24">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-destructive/7 blur-[130px]" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-primary/5 blur-[90px]" />

        <div className="relative z-10 flex max-w-md flex-col items-center text-center">
          {/* Icon badge */}
          <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/8 shadow-sm ring-4 ring-destructive/5">
            <AlertCircle className="h-7 w-7 text-destructive/75" />
          </div>

          {/* Heading */}
          <h1 className="mb-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mb-10 max-w-sm text-pretty text-base text-muted-foreground">
            {message}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={reset}
              className="gap-2 rounded-xl bg-primary px-7 text-primary-foreground hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" />
              Try again
            </Button>
            <Button
              variant="outline"
              asChild
              className="gap-2 rounded-xl bg-transparent px-7"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
            </Button>
          </div>

          {/* Debug ref */}
          {error.digest && (
            <p className="mt-10 font-mono text-xs text-muted-foreground/40">
              ref: {error.digest}
            </p>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
