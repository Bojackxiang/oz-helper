import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="bg-primary py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Join thousands of Australians already using OzHelper to get things done 
            or earn extra income in their local community.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 bg-accent px-8 text-accent-foreground hover:bg-accent/90">
              <Link href="/sign-up">Post Your First Task</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/sign-up?mode=tasker">Start Earning Today</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
