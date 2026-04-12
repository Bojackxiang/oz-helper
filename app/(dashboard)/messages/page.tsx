"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Search,
  Send,
  ImageIcon,
  MapPin,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"

const conversations = [
  {
    id: 1,
    user: { name: "Mary Thompson", initials: "MT" },
    lastMessage: "Great, see you at 2pm!",
    timestamp: "2 min ago",
    unread: true,
    task: "Lawn Mowing",
    taskPrice: "$45",
  },
  {
    id: 2,
    user: { name: "Tom Wilson", initials: "TW" },
    lastMessage: "I've finished the task. Please check the photos.",
    timestamp: "1 hour ago",
    unread: false,
    task: "Furniture Assembly",
    taskPrice: "$60",
  },
  {
    id: 3,
    user: { name: "Emma Stevens", initials: "ES" },
    lastMessage: "Thank you so much for the help!",
    timestamp: "Yesterday",
    unread: false,
    task: "Dog Walking",
    taskPrice: "$25",
  },
]

const messages = [
  {
    id: 1,
    sender: "them",
    content: "Hi! I saw your offer for the lawn mowing task. Can you come this afternoon?",
    timestamp: "10:30 AM",
  },
  {
    id: 2,
    sender: "me",
    content: "Hi Mary! Yes, I can come around 2pm today. Does that work for you?",
    timestamp: "10:32 AM",
  },
  {
    id: 3,
    sender: "them",
    content: "Perfect! The lawn mower is in the shed. You can access through the side gate - the code is 1234.",
    timestamp: "10:35 AM",
  },
  {
    id: 4,
    sender: "me",
    content: "Got it, thank you! I'll be there at 2pm sharp. Should take about an hour.",
    timestamp: "10:36 AM",
  },
  {
    id: 5,
    sender: "them",
    content: "Great, see you at 2pm!",
    timestamp: "10:38 AM",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")
  const [showMobileList, setShowMobileList] = useState(true)

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <Button variant="outline" size="sm" onClick={() => setShowMobileList(!showMobileList)}>
          {showMobileList ? "View Chat" : "View List"}
        </Button>
      </div>

      <div className="hidden lg:block">
        <h1 className="mb-4 text-2xl font-bold text-foreground">Messages</h1>
      </div>

      <Card className="flex h-[calc(100%-3rem)] overflow-hidden">
        {/* Conversation List */}
        <div className={cn(
          "w-full border-r border-border lg:w-80",
          !showMobileList && "hidden lg:block"
        )}>
          <div className="border-b border-border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-10" />
            </div>
          </div>
          <div className="overflow-y-auto">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  setSelectedConversation(conv)
                  setShowMobileList(false)
                }}
                className={cn(
                  "w-full border-b border-border p-4 text-left transition-colors hover:bg-muted/50",
                  selectedConversation.id === conv.id && "bg-muted/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conv.user.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{conv.user.name}</span>
                      <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{conv.lastMessage}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">{conv.task}</Badge>
                      <span className="text-xs font-medium text-accent">{conv.taskPrice}</span>
                    </div>
                  </div>
                  {conv.unread && (
                    <div className="h-2 w-2 rounded-full bg-accent" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex flex-1 flex-col",
          showMobileList && "hidden lg:flex"
        )}>
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {selectedConversation.user.initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-foreground">{selectedConversation.user.name}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{selectedConversation.task}</Badge>
                  <span className="text-xs font-medium text-accent">{selectedConversation.taskPrice}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex",
                  msg.sender === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-2",
                  msg.sender === "me" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted text-foreground"
                )}>
                  <p className="text-sm">{msg.content}</p>
                  <p className={cn(
                    "mt-1 text-xs",
                    msg.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-border p-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="shrink-0">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="shrink-0">
                <MapPin className="h-5 w-5" />
              </Button>
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button 
                size="icon" 
                className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              For your safety, keep all communication within OzHelper
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
