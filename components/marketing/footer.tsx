import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "For Requesters",
    links: [
      { label: "Post a Task", href: "#" },
      { label: "How It Works", href: "#" },
      { label: "Pricing Guide", href: "#" },
      { label: "Safety Tips", href: "#" },
    ],
  },
  {
    heading: "For Taskers",
    links: [
      { label: "Become a Tasker", href: "#" },
      { label: "Verification Process", href: "#" },
      { label: "Pro Badge", href: "#" },
      { label: "Earnings Guide", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Centre", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#080808]">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]">
                <span className="text-sm font-black text-black">Oz</span>
              </div>
              <span
                className="font-black tracking-[-0.03em] text-white"
                style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "1.125rem",
                }}
              >
                OzHelper
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[#A6A6A6]">
              Connecting Australian communities through trusted local help. From
              students to professionals.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#A6A6A6] transition-colors duration-150 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
          <p className="text-sm text-[#A6A6A6]">
            &copy; 2026 OzHelper. All rights reserved. Made with care in
            Australia.
          </p>
          <span className="text-xs text-[#A6A6A6]">Proudly Australian</span>
        </div>
      </div>
    </footer>
  );
}
