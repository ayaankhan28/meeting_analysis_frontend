"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Settings, HelpCircle, LogOut, Search, Zap, Brain } from "lucide-react"
import { MeetingInsights } from "@/components/meeting-insights"
import { UploadMeeting } from "@/components/upload-meeting"
import { SettingsPage } from "@/components/settings-page"
import { ArchiveSearch } from "@/components/archive-search"
import { MeetingSummary } from "@/components/meeting-summary"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

export default function MeetingIQDashboard() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  const upcomingMeetings = [
    {
      id: 1,
      title: "Product Strategy Review",
      time: "2:00 PM - 3:00 PM",
      date: "Today",
      source: "Google Meet",
      participants: 5,
      type: "review",
    },
    {
      id: 2,
      title: "Weekly Team Standup",
      time: "9:00 AM - 9:30 AM",
      date: "Tomorrow",
      source: "Zoom",
      participants: 8,
      type: "standup",
    },
    {
      id: 3,
      title: "Client Presentation",
      time: "3:00 PM - 4:00 PM",
      date: "Dec 3",
      source: "Google Meet",
      participants: 3,
      type: "presentation",
    },
  ]

  const recentSummaries = [
    {
      id: 1,
      title: "Q4 Planning Session",
      duration: "45 min",
      speakers: 6,
      actionItems: 8,
      sentiment: "positive",
      preview:
        "Discussed Q4 goals, budget allocation, and team restructuring. Key decisions made on product roadmap...",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 2,
      title: "Design System Review",
      duration: "30 min",
      speakers: 4,
      actionItems: 5,
      sentiment: "neutral",
      preview: "Reviewed component library updates, accessibility improvements, and design token standardization...",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
    {
      id: 3,
      title: "Customer Feedback Analysis",
      duration: "60 min",
      speakers: 7,
      actionItems: 12,
      sentiment: "mixed",
      preview: "Analyzed user feedback from Q3, identified pain points, and prioritized feature requests...",
      thumbnail: "/placeholder.svg?height=120&width=200",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-900/80 dark:border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900 dark:text-white">MeetingIQ Pro</span>
            </div>

            {/* Navigation Tabs */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab("home")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "home"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setActiveTab("meetings")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "meetings"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Meetings
              </button>
              <button
                onClick={() => setActiveTab("archive")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "archive"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Archive
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "insights"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Insights
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`text-sm font-medium transition-colors ${
                  activeTab === "settings"
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Settings
              </button>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
            </div>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata?.avatar_url || user.user_metadata?.picture || "/placeholder.svg?height=40&width=40"} alt={user.user_metadata?.full_name || "Profile"} />
                    <AvatarFallback>{user.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('') || user.email?.[0].toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user.user_metadata?.full_name && (
                      <p className="font-medium text-sm text-gray-900 dark:text-white">{user.user_metadata.full_name}</p>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Zap className="mr-2 h-4 w-4" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="home" className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Welcome back, {user.user_metadata?.full_name || user.email}</h1>
            </div>

            {/* Upcoming Meetings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Upcoming Meetings</h2>
            </div>

            {/* Quick Upload */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Upload</h2>
              <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors duration-200">
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Drag and drop a file here</h3>
                    <p className="text-gray-600 dark:text-gray-400">Or click to browse</p>
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white">Upload</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Summaries */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Summaries</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: "Project Alpha Kickoff", subtitle: "Summary of the kickoff meeting" },
                  { title: "Client Presentation", subtitle: "Highlights from the client presentation" },
                  { title: "Team Sync", subtitle: "Key takeaways from the team sync" },
                ].map((summary, index) => (
                  <Card
                    key={summary.title}
                    className="border-0 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg mb-4 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-800/40 dark:to-orange-700/40 rounded-lg"></div>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{summary.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{summary.subtitle}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meetings" className="space-y-8">
            <UploadMeeting />
          </TabsContent>

          <TabsContent value="archive" className="space-y-8">
            <ArchiveSearch />
          </TabsContent>

          <TabsContent value="insights" className="space-y-8">
            <MeetingInsights />
          </TabsContent>

          <TabsContent value="settings" className="space-y-8">
            <SettingsPage />
          </TabsContent>

          <TabsContent value="meeting-summary" className="space-y-8">
            <MeetingSummary />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
