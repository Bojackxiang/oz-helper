"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Clock, 
  Filter,
  SlidersHorizontal,
  Map,
  List,
  Star,
  ChevronDown
} from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  "All Categories",
  "Garden & Lawn",
  "Pet Care",
  "Handyman",
  "Removals",
  "Cleaning",
  "Electrical",
  "Painting",
  "Errands",
]

const tasks = [
  { 
    id: 1,
    title: "Backyard Lawn Mowing - Approximately 80sqm", 
    category: "Garden",
    price: "$45",
    distance: "1.2km",
    suburb: "Bondi, NSW",
    postedAgo: "15 min ago",
    description: "Need someone to mow my backyard. Approximately 80 square meters. I have a lawn mower you can use.",
    posterName: "Mary T.",
    posterRating: 4.8,
    hasPhoto: true,
    offers: 2
  },
  { 
    id: 2,
    title: "Help Moving Boxes to Storage Unit", 
    category: "Removals",
    price: "$80",
    distance: "2.5km",
    suburb: "Randwick, NSW",
    postedAgo: "32 min ago",
    description: "Need help moving about 15 boxes from my apartment to a storage unit. Ground floor to ground floor.",
    posterName: "David L.",
    posterRating: 5.0,
    hasPhoto: true,
    offers: 5
  },
  { 
    id: 3,
    title: "Dog Walking - Friendly Golden Retriever", 
    category: "Pet Care",
    price: "$25",
    distance: "0.8km",
    suburb: "Coogee, NSW",
    postedAgo: "1 hour ago",
    description: "Need someone to walk my Golden Retriever for about 30-45 minutes. Very friendly dog, good on leash.",
    posterName: "Emma S.",
    posterRating: 4.9,
    hasPhoto: true,
    offers: 3
  },
  { 
    id: 4,
    title: "IKEA Furniture Assembly - 2 Bookshelves", 
    category: "Handyman",
    price: "$60",
    distance: "3.1km",
    suburb: "Maroubra, NSW",
    postedAgo: "2 hours ago",
    description: "Need help assembling 2 IKEA Billy bookshelves. All parts and instructions included.",
    posterName: "Chris P.",
    posterRating: 4.7,
    hasPhoto: false,
    offers: 1
  },
  { 
    id: 5,
    title: "Grocery Pickup from Woolworths", 
    category: "Errands",
    price: "$20",
    distance: "1.5km",
    suburb: "Bondi Junction, NSW",
    postedAgo: "3 hours ago",
    description: "Need someone to pick up my online order from Woolworths Bondi Junction and deliver to my home.",
    posterName: "Sophie M.",
    posterRating: 4.6,
    hasPhoto: false,
    offers: 0
  },
  { 
    id: 6,
    title: "Window Cleaning - 2 Story House", 
    category: "Cleaning",
    price: "$120",
    distance: "4.2km",
    suburb: "Bronte, NSW",
    postedAgo: "4 hours ago",
    description: "Need all windows cleaned inside and out for a 2 story house. Approximately 20 windows total.",
    posterName: "James H.",
    posterRating: 5.0,
    hasPhoto: true,
    offers: 4
  },
]

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("newest")

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All Categories" || task.category === selectedCategory.replace(" & ", " & ")
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Browse Tasks</h1>
          <p className="text-muted-foreground">Find tasks near you and start earning</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="mr-1 h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="mr-1 h-4 w-4" />
            Map
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="closest">Closest</SelectItem>
                  <SelectItem value="highest">Highest Price</SelectItem>
                  <SelectItem value="lowest">Lowest Price</SelectItem>
                </SelectContent>
              </Select>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    More Filters
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuCheckboxItem checked>Within 5km</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Within 10km</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Any distance</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} tasks near Sydney, NSW
      </p>

      {/* Task List */}
      {viewMode === "list" ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTasks.map((task) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                <CardContent className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <Badge variant="outline" className="text-xs">
                      {task.category}
                    </Badge>
                    <span className="text-xl font-bold text-accent">{task.price}</span>
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground line-clamp-2">{task.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {task.suburb}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.postedAgo}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {task.posterName.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="text-sm text-foreground">{task.posterName}</span>
                      <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        {task.posterRating}
                      </span>
                    </div>
                    {task.offers > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {task.offers} offers
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="h-[600px]">
          <CardContent className="flex h-full items-center justify-center p-0">
            <div className="text-center text-muted-foreground">
              <Map className="mx-auto mb-4 h-16 w-16 opacity-50" />
              <p className="text-lg font-medium">Map View</p>
              <p className="text-sm">Interactive map with task locations would appear here</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
