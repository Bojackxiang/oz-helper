import { Shield, BadgeCheck, Lock, Users } from "lucide-react"

const features = [
  {
    icon: BadgeCheck,
    title: "ID Verification",
    description: "All taskers verify their identity with Australian ID. Blue badge means verified, Gold badge means licensed professional.",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    description: "Your money is held safely in escrow until you confirm the job is done to your satisfaction.",
  },
  {
    icon: Shield,
    title: "Public Liability Insurance",
    description: "Platform-wide coverage protects you if anything goes wrong during a task.",
  },
  {
    icon: Users,
    title: "Youth Protection",
    description: "Parental consent required for under-18 taskers. High-risk tasks automatically blocked for minors.",
  },
]

export function SafetySection() {
  return (
    <section id="safety" className="bg-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Your Safety, Our Priority
          </h2>
          <p className="text-lg text-muted-foreground">
            Built from the ground up with trust and security in mind.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {features.map((feature, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
