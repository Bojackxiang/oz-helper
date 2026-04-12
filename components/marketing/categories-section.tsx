import { 
  Trees, 
  Dog, 
  Wrench, 
  Truck, 
  Sparkles, 
  Zap,
  Paintbrush,
  ShoppingBag
} from "lucide-react"
import Link from "next/link"

const categories = [
  { icon: Trees, name: "Garden & Lawn", count: "2,340 tasks", color: "bg-primary/10 text-primary" },
  { icon: Dog, name: "Pet Care", count: "1,250 tasks", color: "bg-accent/10 text-accent-foreground" },
  { icon: Wrench, name: "Handyman", count: "3,100 tasks", color: "bg-primary/10 text-primary" },
  { icon: Truck, name: "Removals", count: "890 tasks", color: "bg-accent/10 text-accent-foreground" },
  { icon: Sparkles, name: "Cleaning", count: "2,780 tasks", color: "bg-primary/10 text-primary" },
  { icon: Zap, name: "Electrical", count: "1,450 tasks", color: "bg-accent/10 text-accent-foreground" },
  { icon: Paintbrush, name: "Painting", count: "1,120 tasks", color: "bg-primary/10 text-primary" },
  { icon: ShoppingBag, name: "Errands", count: "980 tasks", color: "bg-accent/10 text-accent-foreground" },
]

export function CategoriesSection() {
  return (
    <section id="categories" className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Popular Categories
          </h2>
          <p className="text-lg text-muted-foreground">
            From quick errands to professional trades, find help for any task.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <Link
              key={i}
              href="/tasks"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
