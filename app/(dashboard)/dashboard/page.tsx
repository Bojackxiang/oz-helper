"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Tasks Posted", value: "12", icon: Plus, change: "+2 this week" },
  { label: "Tasks Completed", value: "8", icon: CheckCircle, change: "+3 this week" },
  { label: "Total Spent", value: "$485", icon: DollarSign, change: "This month" },
  { label: "Avg. Rating Given", value: "4.8", icon: Star, change: "Across 8 tasks" },
]

const myTasks = [
  { 
    id: 1,
    title: "Backyard Lawn Mowing", 
    status: "in_progress", 
    price: "$45",
    tasker: "Tom W.",
    taskerRating: 4.9,
    dueDate: "Today, 2pm"
  },
  { 
    id: 2,
    title: "Furniture Assembly - IKEA Bookshelf", 
    status: "pending", 
    price: "$60",
    offers: 3,
    dueDate: "Tomorrow"
  },
  { 
    id: 3,
    title: "Dog Walking - Golden Retriever", 
    status: "completed", 
    price: "$25",
    tasker: "Sarah K.",
    taskerRating: 5.0,
    completedDate: "2 days ago"
  },
]

const nearbyTasks = [
  { 
    id: 4,
    title: "Help Moving Boxes", 
    category: "Removals",
    price: "$80",
    distance: "2.5km",
    suburb: "Bondi, NSW",
    postedAgo: "15 min ago"
  },
  { 
    id: 5,
    title: "Garden Weeding - Front Yard", 
    category: "Garden",
    price: "$35",
    distance: "1.2km",
    suburb: "Randwick, NSW",
    postedAgo: "32 min ago"
  },
  { 
    id: 6,
    title: "Grocery Pickup from Woolworths", 
    category: "Errands",
    price: "$20",
    distance: "0.8km",
    suburb: "Coogee, NSW",
    postedAgo: "1 hour ago"
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "in_progress":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/10">In Progress</Badge>
    case "pending":
      return <Badge className="bg-accent/10 text-accent-foreground hover:bg-accent/10">Pending Offers</Badge>
    case "completed":
      return <Badge variant="outline" className="text-muted-foreground">Completed</Badge>
    default:
      return null
  }
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, John</h1>
          <p className="text-muted-foreground">Here is what is happening in your neighbourhood</p>
        </div>
        <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" />
            Post a Task
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-primary" />
                    {stat.change}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* My Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">My Tasks</CardTitle>
            <Link href="/tasks" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {myTasks.map((task) => (
              <Link 
                key={task.id} 
                href={`/tasks/${task.id}`}
                className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="font-medium text-foreground">{task.title}</h3>
                  {getStatusBadge(task.status)}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-accent">{task.price}</span>
                  {task.tasker && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-accent text-accent" />
                      {task.tasker} ({task.taskerRating})
                    </span>
                  )}
                  {task.offers && (
                    <span className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {task.offers} offers
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.dueDate || task.completedDate}
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Nearby Tasks (for Taskers) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Tasks Near You</CardTitle>
            <Link href="/tasks" className="text-sm text-primary hover:underline">
              Browse all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {nearbyTasks.map((task) => (
              <Link 
                key={task.id} 
                href={`/tasks/${task.id}`}
                className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="mb-2 flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1 text-xs">
                      {task.category}
                    </Badge>
                    <h3 className="font-medium text-foreground">{task.title}</h3>
                  </div>
                  <span className="text-lg font-bold text-accent">{task.price}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {task.suburb} ({task.distance})
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.postedAgo}
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
