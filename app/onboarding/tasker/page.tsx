"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  ArrowLeft,
  ArrowRight,
  Upload,
  User,
  CreditCard,
  Shield,
  CheckCircle,
  Camera,
  Briefcase,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, name: "Profile Photo", icon: Camera },
  { id: 2, name: "ID Verification", icon: Shield },
  { id: 3, name: "Bank Account", icon: CreditCard },
  { id: 4, name: "Skills", icon: Briefcase },
]

const skillCategories = [
  { id: "garden", name: "Garden & Lawn", skills: ["Lawn Mowing", "Weeding", "Hedge Trimming", "Landscaping"] },
  { id: "pets", name: "Pet Care", skills: ["Dog Walking", "Pet Sitting", "Pet Grooming"] },
  { id: "handyman", name: "Handyman", skills: ["Furniture Assembly", "TV Mounting", "Minor Repairs"] },
  { id: "cleaning", name: "Cleaning", skills: ["House Cleaning", "Window Cleaning", "End of Lease"] },
  { id: "errands", name: "Errands", skills: ["Grocery Pickup", "Package Delivery", "General Errands"] },
]

export default function TaskerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isUnder18, setIsUnder18] = useState(false)
  const [parentConsent, setParentConsent] = useState(false)

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleComplete = () => {
    window.location.href = "/dashboard"
  }

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">Oz</span>
            </div>
            <span className="text-xl font-bold text-foreground">OzHelper</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Become a Tasker</h1>
          <p className="text-muted-foreground">Complete your profile to start earning</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                currentStep > step.id 
                  ? "bg-primary text-primary-foreground"
                  : currentStep === step.id
                  ? "bg-primary/10 text-primary ring-2 ring-primary"
                  : "bg-muted text-muted-foreground"
              }`}>
                {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
              </div>
              {i < steps.length - 1 && (
                <div className={`mx-2 h-0.5 w-8 ${currentStep > step.id ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "Add a clear photo of yourself to build trust"}
              {currentStep === 2 && "Verify your identity with a valid Australian ID"}
              {currentStep === 3 && "Add your bank account for payouts"}
              {currentStep === 4 && "Select the types of tasks you can help with"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Profile Photo */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-muted">
                      <User className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <button className="absolute bottom-0 right-0 rounded-full bg-primary p-3 text-primary-foreground shadow-lg">
                      <Camera className="h-5 w-5" />
                    </button>
                  </div>
                  <Button variant="outline">Upload Photo</Button>
                </div>
                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground">Photo Guidelines:</p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Clear photo of your face</li>
                    <li>Good lighting, no sunglasses</li>
                    <li>Professional appearance preferred</li>
                    <li>Just you in the photo (no group shots)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 2: ID Verification */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      id="under18"
                      checked={isUnder18}
                      onCheckedChange={(checked) => setIsUnder18(checked as boolean)}
                    />
                    <Label htmlFor="under18" className="cursor-pointer">
                      I am under 18 years old
                    </Label>
                  </div>
                  
                  {isUnder18 && (
                    <div className="rounded-lg border border-accent bg-accent/10 p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 text-accent-foreground" />
                        <div>
                          <p className="mb-2 font-medium text-accent-foreground">Parental Consent Required</p>
                          <p className="mb-3 text-sm text-muted-foreground">
                            Taskers aged 14-17 need parental consent. Some task categories will be restricted for your safety.
                          </p>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              id="parentConsent"
                              checked={parentConsent}
                              onCheckedChange={(checked) => setParentConsent(checked as boolean)}
                            />
                            <Label htmlFor="parentConsent" className="cursor-pointer text-sm">
                              My parent/guardian has given consent
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label>Select ID Type</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {["Driver Licence", "Passport", "Photo ID Card", "Proof of Age Card"].map((idType) => (
                      <button
                        key={idType}
                        className="rounded-lg border border-border p-4 text-left transition-all hover:border-primary hover:bg-primary/5"
                      >
                        <span className="font-medium text-foreground">{idType}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="mb-2 font-medium text-foreground">Upload your ID</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Take a clear photo or upload a scan of your ID
                  </p>
                  <Button variant="outline">Choose File</Button>
                </div>
              </div>
            )}

            {/* Step 3: Bank Account */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name</Label>
                    <Input id="accountName" placeholder="John Smith" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bsb">BSB</Label>
                      <Input id="bsb" placeholder="000-000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" placeholder="12345678" />
                    </div>
                  </div>
                </div>
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Your details are secure</p>
                      <p className="text-sm text-muted-foreground">
                        Bank details are encrypted and only used for payouts. We never share your information.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Skills */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Select the tasks you are comfortable doing. You can change these anytime.
                </p>
                {skillCategories.map((category) => (
                  <div key={category.id} className="space-y-3">
                    <h3 className="font-medium text-foreground">{category.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`rounded-full px-4 py-2 text-sm transition-all ${
                            selectedSkills.includes(skill)
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {selectedSkills.length > 0 && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="mb-2 text-sm font-medium text-foreground">
                      Selected skills ({selectedSkills.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} className="bg-primary/10 text-primary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="bg-primary text-primary-foreground">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleComplete} 
              className="bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={selectedSkills.length === 0}
            >
              Complete Setup
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/dashboard" className="text-primary hover:underline">
            Skip for now
          </Link>
          {" - "}you can complete verification later
        </p>
      </div>
    </div>
  )
}
