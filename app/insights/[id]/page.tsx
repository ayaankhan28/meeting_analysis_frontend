"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ChevronLeft, 
  Clock, 
  Users, 
  Video,
  Search,
  ChevronRight,
  Send,
  Bot
} from "lucide-react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface Chapter {
  chapter_title: string;
  timestamp: string;
  content: string;
  thumbnail_url: string | null;
}

interface AnalysisMetadata {
  summary: string;
  chapters: Chapter[];
  description: string;
  video_title: string;
  action_items: string[];
  final_decision: string;
}

interface AnalysisData {
  status: string;
  meta: AnalysisMetadata;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  status: string;
  data: AnalysisData;
}

interface MeetingInsight {
  id: string
  title: string
  date: string
  duration: number
  participants: {
    name: string
    avatar?: string
    speakingTime: number
    role: string
  }[]
  topics: string[]
  actionItems: string[]
  keyDecisions: string[]
  meetingChapters: {
    title: string
    startTime: string
    endTime: string
    summary: string
    content: string
    thumbnail_url?: string | null
  }[]
  transcript: string[]
}

export default function MeetingInsightPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [insight, setInsight] = useState<MeetingInsight | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(0)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! I can help you understand this meeting content. Ask me anything about the discussion!' },
    { id: 2, type: 'user', message: 'What were the main decisions made in this meeting?' },
    { id: 3, type: 'bot', message: 'The main decisions included: setting the launch date for Q2 2024, approving the initial pricing strategy, identifying target market segments, allocating the marketing budget, and finalizing the core feature set.' }
  ])
  const [currentMessage, setCurrentMessage] = useState('')

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(`http://localhost:8000/media/${params.id}/analysis`);
        
        if (response.data.status === 'success' && response.data.data.status === 'done') {
          const analysisData = response.data.data;
          const meta = analysisData.meta;
          
          // Transform API data to match our interface
          setInsight({
            id: params.id as string,
            title: meta.video_title,
            date: analysisData.created_at,
            duration: 0, // Duration not provided in API
            participants: [], // Participants not provided in API
            topics: meta.chapters.map((chapter: Chapter) => chapter.chapter_title),
            actionItems: meta.action_items,
            keyDecisions: [meta.final_decision],
            meetingChapters: meta.chapters.map((chapter: Chapter) => ({
              title: chapter.chapter_title,
              startTime: chapter.timestamp,
              endTime: "", // End time not provided in API
              summary: chapter.content,
              content: chapter.content,
              thumbnail_url: chapter.thumbnail_url
            })),
            transcript: [] // Transcript not provided in API
          });
        } else {
          setError("Analysis not complete or failed");
        }
      } catch (err) {
        console.error('Error fetching meeting insights:', err);
        setError("Failed to load meeting insights");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchInsights();
    }

    return () => {
      // Cleanup if needed
    };
  }, [params.id]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        type: 'user' as const,
        message: currentMessage
      }
      setChatMessages([...chatMessages, newMessage])
      setCurrentMessage('')
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          type: 'bot' as const,
          message: 'I understand your question about the meeting. Based on the content, I can provide insights about the topics discussed, decisions made, and action items assigned.'
        }
        setChatMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error || !insight) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error || "Failed to load meeting insights"}</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Archive
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{insight.title}</h1>
      </div>

      {/* Full Width Layout */}
      <div className="space-y-6">
        {/* Video Player and Chatbot - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          {/* Video Player - 8 columns */}
          <div className="col-span-8">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Video className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Video to watch</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chatbot - 4 columns, sticking to right */}
          <div className="col-span-4">
            <Card className="border border-gray-200 dark:border-gray-700 h-[calc(100vh-24rem)]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">Meeting Assistant</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex flex-col h-[calc(100%-5rem)]">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        msg.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2 mt-auto">
                  <Input
                    placeholder="Ask about the meeting..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Chapters Section - Full Width */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Chapters</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {insight.meetingChapters.map((chapter, index) => (
              <Card 
                key={index} 
                className={`border cursor-pointer hover:shadow-md transition-all ${
                  selectedChapter === index 
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => setSelectedChapter(index)}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-3 flex items-center justify-center overflow-hidden">
                    {insight.meetingChapters[index].thumbnail_url ? (
                      <img 
                        src={insight.meetingChapters[index].thumbnail_url} 
                        alt={`Thumbnail for ${chapter.title}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">Chapter {index + 1}</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                    {chapter.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chapter Content - Full Width */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {insight.meetingChapters[selectedChapter]?.title} Content
              </CardTitle>
              <span className="text-sm text-gray-500">
                {insight.meetingChapters[selectedChapter]?.startTime} - {insight.meetingChapters[selectedChapter]?.endTime}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {insight.meetingChapters[selectedChapter]?.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 2x2 Grid Sections - Using more space */}
        <div className="grid grid-cols-12 gap-6">
          {/* Key Points */}
          <div className="col-span-3">
            <Card className="border border-gray-200 dark:border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Key Points</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="text-gray-700 dark:text-gray-300">• Meeting duration: {formatDuration(insight.duration)}</li>
                  <li className="text-gray-700 dark:text-gray-300">• Participants: {insight.participants.length} attendees</li>
                  <li className="text-gray-700 dark:text-gray-300">• Topics covered: {insight.topics.length} main areas</li>
                  <li className="text-gray-700 dark:text-gray-300">• Action items created: {insight.actionItems.length}</li>
                  <li className="text-gray-700 dark:text-gray-300">• Key decisions made: {insight.keyDecisions.length}</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Decision Made */}
          <div className="col-span-3">
            <Card className="border border-gray-200 dark:border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Decision made</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insight.keyDecisions.map((decision, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      • {decision}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <div className="col-span-3">
            <Card className="border border-gray-200 dark:border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Action Items</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insight.actionItems.map((item, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      • {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="col-span-3">
            <Card className="border border-gray-200 dark:border-gray-700 h-full">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insight.meetingChapters.map((chapter, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300">
                      • {chapter.summary}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Info Row - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          {/* Topics */}
          <div className="col-span-4">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Topics Discussed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {insight.topics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Participants */}
          <div className="col-span-4">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insight.participants.map((participant, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{participant.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{participant.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ask Anything */}
          <div className="col-span-4">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg">Ask Anything</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Ask about the meeting..."
                    className="pr-10"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0 h-full"
                  >
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transcript - Full Width */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transcript</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Scroll support</span>
                <div className="w-4 h-8 border border-gray-300 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-4 bg-gray-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4 bg-gray-50 dark:bg-gray-800">
              <div className="space-y-3">
                {insight.transcript.map((line, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300">
                    • {line}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save As Button at Complete Bottom */}
      <div className="mt-8 flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Save As
              <span className="text-xs">▼</span>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">PDF</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>PDF</DropdownMenuItem>
            <DropdownMenuItem>Word Document</DropdownMenuItem>
            <DropdownMenuItem>Text File</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 