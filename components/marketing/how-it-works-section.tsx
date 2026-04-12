import { ClipboardList, Users, CheckCircle, Wallet } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "Post Your Task",
    description: "Describe what you need done, set your budget, and add photos. It only takes a minute.",
  },
  {
    icon: Users,
    title: "Get Matched",
    description: "Receive offers from verified local taskers. Review profiles, ratings, and choose your helper.",
  },
  {
    icon: CheckCircle,
    title: "Get It Done",
    description: "Your tasker completes the job. Chat in-app, track progress, and see completion photos.",
  },
  {
    icon: Wallet,
    title: "Pay Securely",
    description: "Payment is held in escrow until you are satisfied. Release funds with one tap.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-card py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-card-foreground md:text-4xl">
            How OzHelper Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting help or earning money is simple, safe, and local.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute left-1/2 top-8 hidden h-0.5 w-full -translate-x-1/2 bg-border lg:block" style={{ display: i === steps.length - 1 ? 'none' : undefined }} />
              <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                Step {i + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
