"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DefaultIllustration } from "@/components/default-illustration"
import axios from "axios"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"

interface RecentMeeting {
  media_id: string
  file_name: string
  file_type: string
  created_at: string
  title?: string
}

export default function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [recentMeetings, setRecentMeetings] = useState<RecentMeeting[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecentMeetings = async () => {
      try {
        if (user?.id) {
          const response = await axios.get(`${API_BASE_URL}/get-user-media`, {
            params: {
              user_id: user.id,
              recent: true
            }
          })
          
          // Take only the first 3 meetings
          const meetings = response.data.slice(0, 3)
          setRecentMeetings(meetings)
        }
      } catch (error) {
        console.error('Error fetching recent meetings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentMeetings()
  }, [user])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleViewTranscript = (mediaId: string) => {
    router.push(`/insights/${mediaId}`)
  }

  const getIllustrationType = (fileType: string): "audio" | "video" | "meeting" | "document" | "generic" => {
    if (fileType === 'video') return 'video'
    if (fileType === 'audio') return 'audio'
    return 'meeting' // Default to meeting for other types
  }

  // Get user's display name
  const getUserName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'there'
  }

  // Get user's initials for fallback
  const getUserInitials = () => {
    const name = getUserName()
    if (name === 'there') return 'U'
    return name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="relative px-8 py-20 sm:px-16 sm:py-32">
          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Welcome Message - Above illustration */}
            {user && (
              <p className="text-lg text-gray-600 mb-8 font-light">
                Welcome back, {getUserName()}
              </p>
            )}
          </div>

          {/* Background Illustration - Center */}
          <div className="flex items-center justify-center mb-12">
            <div className="relative">
              {/* Meeting table illustration */}
              <div className="flex items-center justify-center space-x-12">
                {/* Person 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full mb-6 flex items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded-full"></div>
                  </div>
                  <div className="w-14 h-20 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-3xl shadow-sm"></div>
                  <div className="w-10 h-3 bg-orange-600 rounded-full mt-1"></div>
                </div>
                
                {/* Person 2 (center) */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full mb-6 flex items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full"></div>
                  </div>
                  <div className="w-14 h-20 bg-gradient-to-b from-gray-500 to-gray-600 rounded-t-3xl shadow-sm"></div>
                  <div className="w-10 h-3 bg-gray-800 rounded-full mt-1"></div>
                </div>
                
                {/* Person 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full mb-6 flex items-center justify-center shadow-sm">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full"></div>
                  </div>
                  <div className="w-14 h-20 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-3xl shadow-sm"></div>
                  <div className="w-10 h-3 bg-gray-700 rounded-full mt-1"></div>
                </div>
              </div>
              
              {/* Table */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="w-56 h-10 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-xl"></div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-gradient-to-b from-gray-100 to-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Get Started Button - Center */}
          <div className="relative z-10 text-center mb-12">
            <Button 
              size="lg" 
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium px-10 py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              onClick={() => router.push('/meetings')}
            >
              Get Started
            </Button>
          </div>

          {/* Main Heading and Description - Below button */}
          <div className="relative z-10 text-center">
            <h1 className="text-5xl sm:text-6xl font-light text-gray-900 mb-6 tracking-tight leading-tight">
              Transform your meetings<br />
              <span className="font-normal">with minutes.ai</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
              Get accurate meeting analysis in few minutes<br />
              Focus on the conversation, not note-taking.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transcripts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900 dark:text-white">Recent Meetings</h2>
          <Button 
            variant="outline" 
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-light"
            onClick={() => router.push('/archive')}
          >
            View All
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : recentMeetings.length > 0 ? (
          <div className="space-y-4">
            {recentMeetings.map((meeting) => (
              <Card key={meeting.media_id} className="bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center">
                        <DefaultIllustration 
                          type={getIllustrationType(meeting.file_type)} 
                          size="sm"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                          {meeting.title || meeting.file_name || 'Untitled Meeting'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-light">
                          {formatDate(meeting.created_at)}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-light"
                      onClick={() => handleViewTranscript(meeting.media_id)}
                    >
                      View Insights
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
            <CardContent className="p-8 text-center">
              <DefaultIllustration type="meeting" size="lg" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-4 mb-2">
                No recent meetings
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Upload your first meeting to get started with transcription and analysis.
              </p>
              <Button 
                onClick={() => router.push('/upload')}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Upload Meeting
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
