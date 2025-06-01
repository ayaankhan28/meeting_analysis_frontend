"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export function ArchiveSearch() {
  const [searchQuery, setSearchQuery] = useState("")

  const meetings = [
    {
      id: 1,
      date: "2023-06-15",
      title: "Project Alpha Kickoff",
      type: "Team Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "done"
    },
    {
      id: 2,
      date: "2023-06-10",
      title: "Client Presentation",
      type: "Client Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "processing"
    },
    {
      id: 3,
      date: "2023-06-05",
      title: "Sprint Review",
      type: "Team Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "failed"
    },
    {
      id: 4,
      date: "2023-07-08",
      title: "Budget Planning",
      type: "Finance Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "done"
    },
    {
      id: 5,
      date: "2023-07-25",
      title: "Product Roadmap Discussion",
      type: "Product Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "processing"
    },
    {
      id: 6,
      date: "2023-07-02",
      title: "Marketing Strategy Review",
      type: "Marketing Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "done"
    },
    {
      id: 7,
      date: "2023-07-19",
      title: "Sales Team Alignment",
      type: "Sales Meeting",
      thumbnail: "/placeholder.svg?height=120&width=160",
      status: "done"
    },
  ]

  const savedSearches = ["All Meetings", "Important Meetings", "Follow-up Required"]

  const smartFolders = ["Action Items", "Decisions"]

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <div className="w-64 space-y-6">
        {/* Filters */}
        <Card className="border-0 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Date Range</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                  <option>Last year</option>
                  <option>All time</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Speaker</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                  <option>All speakers</option>
                  <option>John Doe</option>
                  <option>Jane Smith</option>
                  <option>Mike Johnson</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Keywords</label>
                <Input
                  placeholder="Search keywords..."
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Sentiment</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                  <option>All sentiments</option>
                  <option>Positive</option>
                  <option>Neutral</option>
                  <option>Negative</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Tags</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                  <option>All tags</option>
                  <option>Important</option>
                  <option>Follow-up</option>
                  <option>Decision</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Meeting Type</label>
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                  <option>All types</option>
                  <option>Team Meeting</option>
                  <option>Client Meeting</option>
                  <option>One-on-One</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Saved Searches */}
        <Card className="border-0 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Saved Searches</h3>
            <div className="space-y-2">
              {savedSearches.map((search) => (
                <button
                  key={search}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Smart Folders */}
        <Card className="border-0 bg-white dark:bg-gray-800">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Smart Folders</h3>
            <div className="space-y-2">
              {smartFolders.map((folder) => (
                <button
                  key={folder}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  {folder}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Archive & Search</h1>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search meetings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Results</h2>

          <div className="space-y-4">
            {meetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="border-0 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-16 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg flex items-center justify-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-800/40 dark:to-orange-700/40 rounded-lg"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{meeting.date}</p>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {meeting.type}
                            </Badge>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                meeting.status === 'processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                                meeting.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              }`}
                            >
                              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
