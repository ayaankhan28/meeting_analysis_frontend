"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Video, Mic, Brain } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { DefaultIllustration } from "@/components/default-illustration"
import { ImageWithFallback } from "@/components/image-with-fallback"

type MediaType = "video" | "audio"
type UploadStatus = "pending" | "processing" | "completed" | "failed"
type AnalysisStatus = "pending" | "processing" | "completed" | "failed"

interface Media {
  media_id: string
  user_id: string
  file_type: MediaType
  upload_status: UploadStatus
  analysis_status: AnalysisStatus
  duration?: number
  language?: string
  url: string
  created_at: string
  updated_at: string
  thumbnail?: string
  title?: string
  file_name?: string
}

export function ArchiveSearch() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [userMedia, setUserMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchUserMedia()
    }
  }, [user?.id])

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Unknown duration'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const fetchUserMedia = async () => {
    if (!user?.id) return
    
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/get-user-media?user_id=${user.id}`)
      console.log('User media response:', response.data)
      setUserMedia(response.data)
    } catch (err) {
      setError("Failed to fetch media")
      console.error("Error fetching user media:", err)
    } finally {
      setLoading(false)
    }
  }

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
          
          {loading && <div className="text-center py-4">Loading...</div>}
          {error && <div className="text-red-500 py-4">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userMedia.map((media) => (
              <Card 
                key={media.media_id} 
                className={`overflow-hidden ${
                  media.analysis_status === "failed" ? "opacity-60 grayscale" : ""
                } ${
                  media.analysis_status === "processing" ? "animate-pulse" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div 
                    className={`aspect-video bg-gray-50 dark:bg-gray-800 rounded-md mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      media.analysis_status === "processing" ? "animate-pulse" : ""
                    }`}
                    onClick={() => router.push(`/insights/${media.media_id}`)}
                  >
                    <ImageWithFallback
                      src={media.thumbnail}
                      alt={`${media.file_type} thumbnail`}
                      fallbackType={media.file_type === 'video' ? 'video' : 'audio'}
                      fallbackSize="lg"
                      className="rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={media.file_type === "video" ? "default" : "secondary"}>
                        {media.file_type}
                      </Badge>
                      <Badge 
                        variant={
                          media.analysis_status === "completed" ? "default" :
                          media.analysis_status === "failed" ? "destructive" :
                          media.analysis_status === "processing" ? "secondary" : "outline"
                        }
                        className={
                          media.analysis_status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
                          media.analysis_status === "failed" ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" :
                          media.analysis_status === "processing" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
                        }
                      >
                        {media.analysis_status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {media.title || media.file_name || 'Untitled Meeting'}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(media.created_at).toLocaleDateString()}</span>
                      <span>{formatDuration(media.duration)}</span>
                    </div>
                    {media.language && (
                      <Badge variant="outline" className="text-xs">
                        Language: {media.language}
                      </Badge>
                    )}
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
