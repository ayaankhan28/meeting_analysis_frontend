"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { API_BASE_URL } from "@/lib/config"

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
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      fetchUserMedia()
    }
  }, [user?.id])

  useEffect(() => {
    filterMedia()
  }, [searchQuery, userMedia])

  const filterMedia = () => {
    if (!searchQuery.trim()) {
      setFilteredMedia(userMedia)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = userMedia.filter(media => {
      const title = (media.title || '').toLowerCase()
      const fileName = (media.file_name || '').toLowerCase()
      const language = (media.language || '').toLowerCase()
      const type = media.file_type.toLowerCase()

      return title.includes(query) || 
             fileName.includes(query) || 
             language.includes(query) || 
             type.includes(query)
    })
    setFilteredMedia(filtered)
  }

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
      const response = await axios.get(`${API_BASE_URL}/get-user-media?user_id=${user.id}`)
      console.log('User media response:', response.data)
      setUserMedia(response.data)
      setFilteredMedia(response.data)
    } catch (err) {
      setError("Failed to fetch media")
      console.error("Error fetching user media:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Results {filteredMedia.length > 0 && `(${filteredMedia.length})`}
        </h2>
        
        {loading && <div className="text-center py-4">Loading...</div>}
        {error && <div className="text-red-500 py-4">{error}</div>}
        
        {!loading && filteredMedia.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No results found for "{searchQuery}"
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMedia.map((media) => (
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
  )
}
