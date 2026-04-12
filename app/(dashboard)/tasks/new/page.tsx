"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft,
  ArrowRight,
  Upload,
  MapPin,
  Calendar,
  DollarSign,
  Camera,
  Info,
  Check
} from "lucide-react"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const categories = [
  { id: "garden", name: "Garden & Lawn", subcategories: ["Lawn Mowing", "Weeding", "Hedge Trimming", "Tree Pruning", "Landscaping"] },
  { id: "pets", name: "Pet Care", subcategories: ["Dog Walking", "Pet Sitting", "Pet Grooming", "Pet Transport"] },
  { id: "handyman", name: "Handyman", subcategories: ["Furniture Assembly", "TV Mounting", "Shelf Installation", "Minor Repairs"] },
  { id: "removals", name: "Removals", subcategories: ["Moving Boxes", "Furniture Moving", "Junk Removal", "Delivery Help"] },
  { id: "cleaning", name: "Cleaning", subcategories: ["House Cleaning", "Window Cleaning", "End of Lease", "Carpet Cleaning"] },
  { id: "electrical", name: "Electrical", subcategories: ["Light Installation", "Power Points", "Fan Installation", "General Electrical"] },
  { id: "painting", name: "Painting", subcategories: ["Interior Painting", "Exterior Painting", "Touch-ups", "Wallpaper"] },
  { id: "errands", name: "Errands", subcategories: ["Grocery Pickup", "Package Delivery", "Queuing", "General Errands"] },
]

const steps = [
  { id: 1, name: "Category", description: "What type of task?" },
  { id: 2, name: "Details", description: "Describe your task" },
  { id: 3, name: "Location & Time", description: "When and where?" },
  { id: 4, name: "Budget", description: "Set your price" },
  { id: 5, name: "Review", description: "Confirm and post" },
]

export default function NewTaskPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    title: "",
    description: "",
    hasTools: "no",
    photos: [] as string[],
    suburb: "",
    postcode: "",
    dateType: "specific",
    specificDate: "",
    flexibleDays: "3",
    budget: "",
  })

  const selectedCategory = categories.find(c => c.id === formData.category)

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // Handle task submission
    window.location.href = "/dashboard"
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Post a Task</h1>
          <p className="text-muted-foreground">Get help from your local community</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                currentStep > step.id 
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === step.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground"
              }`}>
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <span className={`mt-2 hidden text-xs sm:block ${
                currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
              }`}>
                {step.name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mx-2 h-0.5 w-8 sm:w-16 ${
                currentStep > step.id ? "bg-primary" : "bg-border"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Step 1: Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id, subcategory: "" })}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      formData.category === cat.id
                        ? "border-primary bg-primary/5 ring-2 ring-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </button>
                ))}
              </div>
              {selectedCategory && (
                <div className="space-y-3">
                  <Label>Subcategory</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.subcategories.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => setFormData({ ...formData, subcategory: sub })}
                        className={`rounded-full px-4 py-2 text-sm transition-all ${
                          formData.subcategory === sub
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Backyard lawn mowing, approximately 50sqm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Be specific! Good titles get more offers.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what needs to be done. Include any important details like size, quantity, or special requirements."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-3">
                <Label>Do you have the required tools?</Label>
                <RadioGroup
                  value={formData.hasTools}
                  onValueChange={(value) => setFormData({ ...formData, hasTools: value })}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="tools-yes" />
                    <Label htmlFor="tools-yes" className="cursor-pointer">Yes, I have tools</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="tools-no" />
                    <Label htmlFor="tools-no" className="cursor-pointer">No, tasker must bring</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-3">
                <Label>Photos (recommended)</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[0, 1, 2].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="flex aspect-square flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50"
                    >
                      <Camera className="mb-1 h-6 w-6" />
                      <span className="text-xs">Add photo</span>
                    </button>
                  ))}
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  Tasks with photos get 3x more offers
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Location & Time */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="suburb">Suburb</Label>
                    <Input
                      id="suburb"
                      placeholder="e.g., Bondi"
                      value={formData.suburb}
                      onChange={(e) => setFormData({ ...formData, suburb: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      placeholder="e.g., 2026"
                      value={formData.postcode}
                      onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Exact address will only be shared after you accept an offer
                </p>
              </div>
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  When do you need this done?
                </Label>
                <RadioGroup
                  value={formData.dateType}
                  onValueChange={(value) => setFormData({ ...formData, dateType: value })}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <div className={`flex items-start gap-3 rounded-lg border p-4 ${
                    formData.dateType === "specific" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <RadioGroupItem value="specific" id="date-specific" className="mt-0.5" />
                    <div>
                      <Label htmlFor="date-specific" className="cursor-pointer font-medium">Specific Date</Label>
                      <p className="text-sm text-muted-foreground">I need this done on a particular day</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 rounded-lg border p-4 ${
                    formData.dateType === "flexible" ? "border-primary bg-primary/5" : "border-border"
                  }`}>
                    <RadioGroupItem value="flexible" id="date-flexible" className="mt-0.5" />
                    <div>
                      <Label htmlFor="date-flexible" className="cursor-pointer font-medium">Flexible</Label>
                      <p className="text-sm text-muted-foreground">Within the next few days is fine</p>
                    </div>
                  </div>
                </RadioGroup>
                {formData.dateType === "specific" && (
                  <Input
                    type="date"
                    value={formData.specificDate}
                    onChange={(e) => setFormData({ ...formData, specificDate: e.target.value })}
                  />
                )}
                {formData.dateType === "flexible" && (
                  <Select value={formData.flexibleDays} onValueChange={(value) => setFormData({ ...formData, flexibleDays: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">Within 3 days</SelectItem>
                      <SelectItem value="7">Within 1 week</SelectItem>
                      <SelectItem value="14">Within 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Budget */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Your Budget (AUD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="0"
                    className="pl-8 text-2xl font-bold"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">Suggested prices for {formData.subcategory || "this task"}:</p>
                <div className="flex gap-2">
                  {["$30", "$45", "$60"].map((price) => (
                    <Button
                      key={price}
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData({ ...formData, budget: price.replace("$", "") })}
                    >
                      {price}
                    </Button>
                  ))}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Based on similar tasks in your area. Fair pricing attracts quality taskers faster.
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="rounded-lg border border-border p-4">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{selectedCategory?.name}</Badge>
                    <h3 className="text-lg font-semibold text-foreground">{formData.title || "Your Task Title"}</h3>
                  </div>
                  <span className="text-2xl font-bold text-accent">${formData.budget || "0"}</span>
                </div>
                <p className="mb-4 text-muted-foreground">{formData.description || "Task description..."}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {formData.suburb || "Location"}, {formData.postcode || "Postcode"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formData.dateType === "specific" ? formData.specificDate || "Date" : `Flexible (${formData.flexibleDays} days)`}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-primary/5 p-4">
                <p className="mb-2 text-sm font-medium text-foreground">Payment Protection</p>
                <p className="text-sm text-muted-foreground">
                  Your payment of ${formData.budget || "0"} will be held securely until you confirm the task is complete. 
                  You are not charged until you accept an offer.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        {currentStep < 5 ? (
          <Button onClick={handleNext} className="bg-primary text-primary-foreground">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="bg-accent text-accent-foreground hover:bg-accent/90">
            Post Task
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
