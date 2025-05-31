"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, CheckSquare } from "lucide-react"

export function MeetingSummary() {
  const speakers = [
    { name: "Ethan Carter", role: "Admin", avatar: "/placeholder.svg?height=40&width=40", initials: "EC" },
    { name: "Sophia Bennett", role: "Attendee", avatar: "/placeholder.svg?height=40&width=40", initials: "SB" },
    { name: "Liam Harper", role: "Admin", avatar: "/placeholder.svg?height=40&width=40", initials: "LH" },
    { name: "Olivia Foster", role: "", avatar: "/placeholder.svg?height=40&width=40", initials: "OF" },
    { name: "Noah Parker", role: "Attendee", avatar: "/placeholder.svg?height=40&width=40", initials: "NP" },
  ]

  const keyTopics = ["Product Launch", "Marketing Strategy", "Target Audience", "Launch Markets", "Sales Coordination"]

  const decisions = [
    "Confirmed the target audience as young professionals aged 25-35.",
    "Selected North America and Europe as the initial launch markets.",
  ]

  const actionItems = [
    "Ethan Carter: Finalize marketing materials by May 22.",
    "Sophia Bennett: Coordinate with the sales team by May 29.",
  ]

  return (
    <div className="flex gap-8">
      {/* Left Sidebar - Speakers */}
      <div className="w-64 space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search transcript"
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Speakers */}
        <Card className="border-0 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Speakers</h3>
            <div className="space-y-3">
              {speakers.map((speaker) => (
                <div key={speaker.name} className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={speaker.avatar || "/placeholder.svg"} alt={speaker.name} />
                    <AvatarFallback className="text-xs">{speaker.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{speaker.name}</p>
                    {speaker.role && <p className="text-xs text-gray-500 dark:text-gray-400">{speaker.role}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meeting Summary</h1>
          <p className="text-gray-600 dark:text-gray-400">May 15, 2024 • 10:00 AM - 11:00 AM</p>
        </div>

        {/* Executive Summary */}
        <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Executive Summary</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This team discussed the progress on the new product launch, focusing on the marketing strategy and
                  timeline. Key decisions were made regarding the target audience and initial launch markets. Action
                  items were assigned to finalize the marketing materials and coordinate with the sales team.
                </p>
              </div>
              <div className="w-32 h-24 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-800/20 dark:to-blue-800/20 rounded-lg flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-200 to-blue-200 dark:from-green-700/40 dark:to-blue-700/40 rounded-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Topics */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Key Topics</h2>
          <div className="flex flex-wrap gap-2">
            {keyTopics.map((topic) => (
              <Badge key={topic} variant="secondary" className="text-sm">
                {topic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Decisions Made */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Decisions Made</h2>
          <div className="space-y-2">
            {decisions.map((decision, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {decision}
              </p>
            ))}
          </div>
        </div>

        {/* Action Items */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Action Items</h2>
          <div className="space-y-3">
            {actionItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckSquare className="w-5 h-5 text-blue-500 mt-0.5" />
                <p className="text-gray-700 dark:text-gray-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Emotion Timeline */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Emotion Timeline</h2>
          <Card className="border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-2 mb-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Overall Sentiment</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Positive</h3>
                  <p className="text-sm text-green-600">Last 60 minutes +15%</p>
                </div>
              </div>

              {/* Emotion Chart */}
              <div className="h-32 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 100">
                  <path
                    d="M 20 70 Q 60 50 100 60 T 180 55 T 260 65 T 340 40 T 380 50"
                    stroke="#10b981"
                    strokeWidth="3"
                    fill="none"
                    className="drop-shadow-sm"
                  />
                </svg>
                <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
                  <span>10:00 AM</span>
                  <span>10:15 AM</span>
                  <span>10:30 AM</span>
                  <span>10:45 AM</span>
                  <span>11:00 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transcript */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Transcript</h2>
          <Card className="border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Ethan Carter" />
                    <AvatarFallback className="text-xs">EC</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900 dark:text-white">Ethan Carter</span>
                      <span className="text-xs text-gray-500">10:00 AM</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      Good morning, everyone. {"Let's"} start by reviewing the progress on the new product launch.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
