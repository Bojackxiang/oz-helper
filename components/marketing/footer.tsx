import Link from "next/link"

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">Oz</span>
              </div>
              <span className="text-xl font-bold text-foreground">OzHelper</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Connecting Australian communities through trusted local help. From students to professionals.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">For Requesters</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Post a Task</Link></li>
              <li><Link href="#" className="hover:text-foreground">How It Works</Link></li>
              <li><Link href="#" className="hover:text-foreground">Pricing Guide</Link></li>
              <li><Link href="#" className="hover:text-foreground">Safety Tips</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">For Taskers</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Become a Tasker</Link></li>
              <li><Link href="#" className="hover:text-foreground">Verification Process</Link></li>
              <li><Link href="#" className="hover:text-foreground">Pro Badge</Link></li>
              <li><Link href="#" className="hover:text-foreground">Earnings Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-foreground">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground">Help Centre</Link></li>
              <li><Link href="#" className="hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 OzHelper. All rights reserved. Made with care in Australia.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Proudly Australian</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
