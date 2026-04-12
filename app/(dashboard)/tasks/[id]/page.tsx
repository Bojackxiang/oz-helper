"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  ArrowLeft,
  MapPin, 
  Clock, 
  Calendar,
  Star,
  Shield,
  BadgeCheck,
  MessageSquare,
  DollarSign,
  CheckCircle,
  User
} from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock task data
const task = {
  id: 1,
  title: "Backyard Lawn Mowing - Approximately 80sqm",
  category: "Garden & Lawn",
  subcategory: "Lawn Mowing",
  price: "$45",
  status: "open",
  description: `Need someone to mow my backyard lawn. It's approximately 80 square meters of grass.

I have a lawn mower you can use (petrol, self-propelled). Just need someone who knows how to use it properly.

The grass is a bit overgrown (about 10cm) so might need a double pass in some areas. Please also edge along the fence line if possible.

Easy access through the side gate - no need to come through the house.`,
  hasTools: true,
  photos: [],
  suburb: "Bondi",
  postcode: "2026",
  state: "NSW",
  dateType: "flexible",
  flexibleDays: "3",
  postedAt: "2 hours ago",
  poster: {
    name: "Mary Thompson",
    initials: "MT",
    rating: 4.8,
    tasksPosted: 15,
    memberSince: "2024",
    verified: true,
  },
  offers: [
    {
      id: 1,
      tasker: {
        name: "Tom Wilson",
        initials: "TW",
        rating: 4.9,
        tasksCompleted: 47,
        verified: true,
        badges: ["ID Verified"],
      },
      message: "Hi Mary! I can come by this afternoon and have this done in about an hour. I'm experienced with lawn mowers and have done lots of similar jobs in the area.",
      price: "$45",
      submittedAt: "1 hour ago",
    },
    {
      id: 2,
      tasker: {
        name: "Jake Chen",
        initials: "JC",
        rating: 4.7,
        tasksCompleted: 23,
        verified: true,
        badges: ["ID Verified", "Student"],
      },
      message: "Hello! I'm a uni student in Bondi and can help with this tomorrow morning. I've mowed lawns before and am comfortable with all types of mowers.",
      price: "$40",
      submittedAt: "45 min ago",
    },
  ],
}

export default function TaskDetailPage() {
  const [offerMessage, setOfferMessage] = useState("")
  const [offerSubmitted, setOfferSubmitted] = useState(false)

  const handleSubmitOffer = () => {
    setOfferSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/tasks">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline">{task.category}</Badge>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Open</Badge>
          </div>
          <h1 className="text-xl font-bold text-foreground sm:text-2xl">{task.title}</h1>
        </div>
        <span className="text-2xl font-bold text-accent">{task.price}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Task Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="whitespace-pre-line text-muted-foreground">{task.description}</p>
              
              <div className="flex flex-wrap gap-4 border-t border-border pt-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{task.suburb}, {task.state} {task.postcode}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Flexible (within {task.flexibleDays} days)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Posted {task.postedAt}</span>
                </div>
              </div>

              {task.hasTools && (
                <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Tools provided by poster</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Offers Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Offers ({task.offers.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.offers.map((offer) => (
                <div key={offer.id} className="rounded-lg border border-border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {offer.tasker.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{offer.tasker.name}</span>
                          {offer.tasker.verified && (
                            <BadgeCheck className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          <span>{offer.tasker.rating}</span>
                          <span>|</span>
                          <span>{offer.tasker.tasksCompleted} tasks completed</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-accent">{offer.price}</span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{offer.message}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {offer.tasker.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Message
                      </Button>
                      <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Accept Offer
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Poster Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posted by</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-muted text-muted-foreground">
                    {task.poster.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{task.poster.name}</span>
                    {task.poster.verified && (
                      <BadgeCheck className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3 w-3 fill-accent text-accent" />
                    <span>{task.poster.rating}</span>
                    <span>|</span>
                    <span>{task.poster.tasksPosted} tasks</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Member since {task.poster.memberSince}
              </p>
            </CardContent>
          </Card>

          {/* Make an Offer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Make an Offer</CardTitle>
            </CardHeader>
            <CardContent>
              {offerSubmitted ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">Offer Submitted!</p>
                  <p className="text-sm text-muted-foreground">
                    You will be notified when the poster responds.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Introduce yourself and explain why you are a good fit for this task.
                    </p>
                    <Textarea
                      placeholder="Hi! I'd love to help with this task..."
                      rows={4}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">Your offer</span>
                    <span className="text-lg font-bold text-accent">{task.price}</span>
                  </div>
                  <Button 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={handleSubmitOffer}
                    disabled={!offerMessage}
                  >
                    Submit Offer
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Safety Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Payment Protection</p>
                  <p className="text-sm text-muted-foreground">
                    Payment is held securely until the task is completed and confirmed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
