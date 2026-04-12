"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Shield, Star } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pb-16 pt-12 md:pb-24 md:pt-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <MapPin className="h-4 w-4" />
            <span>Trusted by 50,000+ Australians</span>
          </div>
          
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Your Neighbourhood,{" "}
            <span className="text-primary">Your Helpers</span>
          </h1>
          
          <p className="mx-auto mb-8 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Connect with trusted neighbours for everyday tasks. From lawn mowing to professional trades, 
            find reliable help or earn money in your local Australian community.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="h-12 bg-accent px-8 text-accent-foreground hover:bg-accent/90">
              <Link href="/sign-up">Post a Task</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-transparent">
              <Link href="/sign-up?mode=tasker">Become a Tasker</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>ID Verified Users</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              <span>4.9 Average Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <span>All Australian States</span>
            </div>
          </div>
        </div>

        {/* Task Preview Cards */}
        <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { title: "Backyard Mowing", suburb: "Bondi, NSW", price: "$45", category: "Garden" },
            { title: "Furniture Assembly", suburb: "Melbourne, VIC", price: "$60", category: "Handyman" },
            { title: "Dog Walking", suburb: "Brisbane, QLD", price: "$25", category: "Pets" },
          ].map((task, i) => (
            <div key={i} className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {task.category}
                </span>
                <span className="text-lg font-bold text-accent">{task.price}</span>
              </div>
              <h3 className="mb-1 font-semibold text-card-foreground">{task.title}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {task.suburb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
