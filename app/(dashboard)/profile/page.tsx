"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { 
  User,
  Star,
  BadgeCheck,
  Shield,
  Camera,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  CheckCircle,
  AlertCircle
} from "lucide-react"

const user = {
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@email.com",
  phone: "0412 345 678",
  suburb: "Bondi",
  postcode: "2026",
  state: "NSW",
  bio: "Friendly neighbour always happy to help out. I enjoy gardening and have experience with various handyman tasks.",
  memberSince: "January 2024",
  rating: 4.9,
  reviewCount: 23,
  tasksCompleted: 31,
  tasksPosted: 12,
  isTasker: true,
  verificationStatus: {
    idVerified: true,
    phoneVerified: true,
    emailVerified: true,
    backgroundCheck: false,
  },
  badges: ["ID Verified", "Top Rated", "Quick Responder"],
  skills: ["Lawn Mowing", "Furniture Assembly", "Dog Walking", "General Errands"],
}

const reviews = [
  {
    id: 1,
    reviewer: "Mary T.",
    rating: 5,
    comment: "John did an amazing job mowing my lawn. Very professional and friendly. Highly recommend!",
    date: "2 weeks ago",
    task: "Lawn Mowing",
  },
  {
    id: 2,
    reviewer: "David L.",
    rating: 5,
    comment: "Great help with moving boxes. Strong and efficient. Would definitely hire again.",
    date: "1 month ago",
    task: "Moving Help",
  },
  {
    id: 3,
    reviewer: "Emma S.",
    rating: 4,
    comment: "Good job assembling the furniture. Took a bit longer than expected but quality work.",
    date: "1 month ago",
    task: "Furniture Assembly",
  },
]

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(user)

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and tasker settings</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </Button>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                  {profile.firstName[0]}{profile.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-xl font-bold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h2>
                {profile.verificationStatus.idVerified && (
                  <BadgeCheck className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="mb-3 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:justify-start">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.suburb}, {profile.state}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {profile.memberSince}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{profile.rating}</span>
                  <span className="text-muted-foreground">({profile.reviewCount} reviews)</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">{profile.tasksCompleted} tasks completed</span>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                {profile.badges.map((badge) => (
                  <Badge key={badge} className="bg-primary/10 text-primary hover:bg-primary/10">
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input 
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input 
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Suburb</Label>
                  <Input 
                    value={profile.suburb}
                    onChange={(e) => setProfile({ ...profile, suburb: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Postcode</Label>
                  <Input 
                    value={profile.postcode}
                    onChange={(e) => setProfile({ ...profile, postcode: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input 
                    value={profile.state}
                    onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {profile.isTasker && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5" />
                  Tasker Settings
                </CardTitle>
                <CardDescription>
                  Manage your availability and skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">Available for Tasks</p>
                    <p className="text-sm text-muted-foreground">Show up in search results when users browse taskers</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Skills</Label>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                        {isEditing && (
                          <button className="ml-1 hover:text-destructive">x</button>
                        )}
                      </Badge>
                    ))}
                    {isEditing && (
                      <Button variant="outline" size="sm">+ Add Skill</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Verification Status
              </CardTitle>
              <CardDescription>
                Complete verifications to build trust and unlock more tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "emailVerified", label: "Email Verified", description: "Confirm your email address" },
                { key: "phoneVerified", label: "Phone Verified", description: "Verify your Australian mobile number" },
                { key: "idVerified", label: "ID Verified", description: "Upload a valid Australian ID" },
                { key: "backgroundCheck", label: "Background Check", description: "Optional police check for higher trust" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div className="flex items-center gap-3">
                    {profile.verificationStatus[item.key as keyof typeof profile.verificationStatus] ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {profile.verificationStatus[item.key as keyof typeof profile.verificationStatus] ? (
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Verified</Badge>
                  ) : (
                    <Button variant="outline" size="sm">Verify</Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Professional Certifications
              </CardTitle>
              <CardDescription>
                Add trade licenses to unlock professional task categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                <Briefcase className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="mb-2 font-medium text-foreground">No certifications added</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Add your ABN, trade licenses, or insurance to become a Pro Tasker
                </p>
                <Button variant="outline">Add Certification</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5" />
                Reviews ({profile.reviewCount})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <span className="font-medium text-foreground">{review.reviewer}</span>
                      <span className="mx-2 text-muted-foreground">for</span>
                      <span className="text-muted-foreground">{review.task}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <div className="mb-2 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
