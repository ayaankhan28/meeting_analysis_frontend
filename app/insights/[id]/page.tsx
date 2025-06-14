"use client"

import { useState, useEffect, useRef } from "react"
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
import { DefaultIllustration } from "@/components/default-illustration"
import { ImageWithFallback } from "@/components/image-with-fallback"
import { API_BASE_URL } from "@/lib/config"
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import jsPDF from 'jspdf'

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
  transcription: string;
  created_at: string;
  updated_at: string;
  media_url: string;
}

interface ApiResponse {
  status: string;
  data: AnalysisData;
}

interface MeetingInsight {
  id: string
  title: string
  description: string
  date: string
  duration: number
  mediaUrl: string
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
  transcript: string
  transcriptLines: string[]
}

interface ExportData {
  title: string
  date: string
  summary: string
  decisions: string[]
  actionItems: string[]
  chapters: {
    title: string
    timestamp: string
    content: string
  }[]
  transcript: string[]
  chatHistory: {
    type: string
    message: string
  }[]
}

export default function MeetingInsightPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [insight, setInsight] = useState<MeetingInsight | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<number>(0)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, type: 'bot', message: 'Hello! I can help you understand this meeting content. Ask me anything about the discussion!' }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(`${API_BASE_URL}/media/${params.id}/analysis`);
        
        if (response.data.status === 'success' && response.data.data.status === 'done') {
          const analysisData = response.data.data;
          const meta = analysisData.meta;
          
          // Process transcription - split into lines/sentences for better display
          const processTranscription = (transcription: string): string[] => {
            if (!transcription) return [];
            
            // Split by periods, exclamation marks, or question marks followed by space
            // This creates more readable transcript segments
            return transcription
              .split(/(?<=[.!?])\s+/)
              .filter(line => line.trim().length > 0)
              .map(line => line.trim());
          };
          
          // Transform API data to match our interface
          setInsight({
            id: params.id as string,
            title: meta.video_title || 'Meeting Recording',
            description: meta.description,
            date: analysisData.created_at,
            duration: 0, // Duration not provided in API
            mediaUrl: analysisData.media_url,
            participants: [], // Participants not provided in API
            topics: meta.chapters.map((chapter: Chapter) => chapter.chapter_title),
            actionItems: meta.action_items || [],
            keyDecisions: meta.final_decision ? [meta.final_decision] : [],
            meetingChapters: meta.chapters.map((chapter: Chapter) => ({
              title: chapter.chapter_title,
              startTime: chapter.timestamp,
              endTime: "", // End time not provided in API
              summary: chapter.content,
              content: chapter.content,
              thumbnail_url: chapter.thumbnail_url
            })),
            transcript: analysisData.transcription || '',
            transcriptLines: processTranscription(analysisData.transcription || '')
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

  const handleSendMessage = async () => {
    if (currentMessage.trim() && !isSending) {
      try {
        setIsSending(true)
        const newMessage = {
          id: chatMessages.length + 1,
          type: 'user' as const,
          message: currentMessage
        }
        setChatMessages(prev => [...prev, newMessage])
        setCurrentMessage('')

        // Call the chat API
        const response = await axios.post(`${API_BASE_URL}/chat`, {
          user_id: user?.id,
          media_id: params.id,
          message: currentMessage
        })

        if (response.data.status === 'success') {
          const botResponse = {
            id: chatMessages.length + 2,
            type: 'bot' as const,
            message: response.data.response
          }
          setChatMessages(prev => [...prev, botResponse])
        } else {
          throw new Error('Failed to get response from AI')
        }
      } catch (error) {
        console.error('Chat error:', error)
        const errorMessage = {
          id: chatMessages.length + 2,
          type: 'bot' as const,
          message: 'Sorry, I encountered an error while processing your message. Please try again.'
        }
        setChatMessages(prev => [...prev, errorMessage])
      } finally {
        setIsSending(false)
      }
    }
  }

  // Add keypress handler for Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const navigateToTimestamp = (timestamp: string) => {
    if (!videoRef.current) return
    
    try {
      console.log('Raw timestamp:', timestamp)
      
      let totalSeconds = 0
      
      // Handle different timestamp formats
      if (timestamp.includes(':')) {
        // Format: "HH:MM:SS" or "MM:SS"
        const parts = timestamp.split(':').map(Number)
        if (parts.length === 3) {
          // HH:MM:SS
          totalSeconds = (parts[0] * 3600) + (parts[1] * 60) + parts[2]
        } else if (parts.length === 2) {
          // MM:SS
          totalSeconds = (parts[0] * 60) + parts[1]
        }
      } else {
        // Format: number in seconds
        totalSeconds = parseFloat(timestamp)
      }
      
      console.log('Converted seconds:', totalSeconds)
      
      // Validate the result is a finite number
      if (!isFinite(totalSeconds)) {
        console.error('Invalid timestamp conversion result:', totalSeconds)
        return
      }
      
      // Set video current time
      videoRef.current.currentTime = totalSeconds
      // Start playing from the new position
      videoRef.current.play()
    } catch (error) {
      console.error('Error navigating to timestamp:', error)
    }
  }

  const prepareExportData = (): ExportData => {
    if (!insight) throw new Error('No insight data available')
    
    return {
      title: insight.title,
      date: new Date(insight.date).toLocaleDateString(),
      summary: insight.description,
      decisions: insight.keyDecisions,
      actionItems: insight.actionItems,
      chapters: insight.meetingChapters.map(chapter => ({
        title: chapter.title,
        timestamp: chapter.startTime,
        content: chapter.content
      })),
      transcript: insight.transcriptLines,
      chatHistory: chatMessages.map(msg => ({
        type: msg.type,
        message: msg.message
      }))
    }
  }

  const exportAsPDF = () => {
    try {
      const data = prepareExportData()
      const doc = new jsPDF()
      let yPos = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)

      // Helper function to add text and return the new Y position
      const addText = (text: string, size = 12, isBold = false) => {
        doc.setFontSize(size)
        if (isBold) {
          doc.setFont("helvetica", 'bold')
        } else {
          doc.setFont("helvetica", 'normal')
        }
        
        // Word wrap for long text
        const lines = doc.splitTextToSize(text, contentWidth)
        doc.text(lines, margin, yPos)
        yPos += (lines.length * size * 0.3527) + 5 // Convert pt to mm and add spacing
        
        // Add new page if we're near the bottom
        if (yPos > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage()
          yPos = margin
        }
      }

      // Title
      addText(data.title, 24, true)
      addText(`Date: ${data.date}`, 12)
      yPos += 10

      // Summary
      addText('Summary', 16, true)
      addText(data.summary)
      yPos += 10

      // Key Decisions
      addText('Key Decisions', 16, true)
      data.decisions.forEach(decision => {
        addText(`• ${decision}`)
      })
      yPos += 10

      // Action Items
      addText('Action Items', 16, true)
      data.actionItems.forEach(item => {
        addText(`• ${item}`)
      })
      yPos += 10

      // Chapters
      addText('Chapters', 16, true)
      data.chapters.forEach(chapter => {
        addText(chapter.title, 14, true)
        addText(`Timestamp: ${chapter.timestamp}`)
        addText(chapter.content)
        yPos += 5
      })
      yPos += 10

      // Chat History
      addText('Chat History', 16, true)
      data.chatHistory.forEach(chat => {
        addText(`${chat.type}: ${chat.message}`)
      })
      yPos += 10

      // Transcript
      addText('Transcript', 16, true)
      data.transcript.forEach((line, index) => {
        addText(`${String(index + 1).padStart(3, '0')}: ${line}`)
      })

      // Save the PDF
      doc.save(`${data.title}-insights.pdf`)
    } catch (error) {
      console.error('Error exporting as PDF:', error)
    }
  }

  const exportAsWord = () => {
    try {
      const data = prepareExportData()
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: data.title,
              heading: HeadingLevel.TITLE
            }),
            new Paragraph({
              text: `Date: ${data.date}`,
              spacing: { before: 400 }
            }),
            new Paragraph({
              text: 'Summary',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 }
            }),
            new Paragraph({ text: data.summary }),
            new Paragraph({
              text: 'Key Decisions',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 }
            }),
            ...data.decisions.map(decision => 
              new Paragraph({ 
                text: `• ${decision}`,
                spacing: { before: 200 }
              })
            ),
            new Paragraph({
              text: 'Action Items',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 }
            }),
            ...data.actionItems.map(item => 
              new Paragraph({ 
                text: `• ${item}`,
                spacing: { before: 200 }
              })
            ),
            new Paragraph({
              text: 'Chapters',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 }
            }),
            ...data.chapters.flatMap(chapter => [
              new Paragraph({
                text: chapter.title,
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 300 }
              }),
              new Paragraph({ text: `Timestamp: ${chapter.timestamp}` }),
              new Paragraph({ text: chapter.content, spacing: { before: 200 } })
            ]),
            new Paragraph({
              text: 'Chat History',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 }
            }),
            ...data.chatHistory.map(chat => 
              new Paragraph({ 
                text: `${chat.type}: ${chat.message}`,
                spacing: { before: 200 }
              })
            ),
            new Paragraph({
              text: 'Transcript',
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400 }
            }),
            ...data.transcript.map((line, index) => 
              new Paragraph({ 
                text: `${String(index + 1).padStart(3, '0')}: ${line}`,
                spacing: { before: 100 }
              })
            )
          ]
        }]
      })

      Packer.toBlob(doc).then(blob => {
        saveAs(blob, `${data.title}-insights.docx`)
      })
    } catch (error) {
      console.error('Error exporting as Word:', error)
    }
  }

  const exportAsText = () => {
    try {
      const data = prepareExportData()
      let content = `${data.title}\n`
      content += `Date: ${data.date}\n\n`
      content += `Summary:\n${data.summary}\n\n`
      content += `Key Decisions:\n${data.decisions.map(d => `• ${d}`).join('\n')}\n\n`
      content += `Action Items:\n${data.actionItems.map(i => `• ${i}`).join('\n')}\n\n`
      content += `Chapters:\n${data.chapters.map(c => 
        `## ${c.title}\nTimestamp: ${c.timestamp}\n${c.content}`
      ).join('\n\n')}\n\n`
      content += `Chat History:\n${data.chatHistory.map(c => 
        `${c.type}: ${c.message}`
      ).join('\n')}\n\n`
      content += `Transcript:\n${data.transcript.map((line, index) => 
        `${String(index + 1).padStart(3, '0')}: ${line}`
      ).join('\n')}`

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, `${data.title}-insights.txt`)
    } catch (error) {
      console.error('Error exporting as text:', error)
    }
  }

  const exportAsJson = () => {
    try {
      const data = prepareExportData()
      // Add metadata to the JSON export
      const jsonData = {
        version: "1.0",
        exported_at: new Date().toISOString(),
        meeting_data: data
      }
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
        type: 'application/json;charset=utf-8' 
      })
      saveAs(blob, `${data.title}-insights.json`)
    } catch (error) {
      console.error('Error exporting as JSON:', error)
    }
  }

  const SaveAsButton = () => (
    <div className="mt-8 flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Export Insights
            <span className="text-xs">▼</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={exportAsPDF}>
            <div className="flex items-center gap-2">
              PDF
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">PDF</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsWord}>
            <div className="flex items-center gap-2">
              Word Document
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">DOCX</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsText}>
            <div className="flex items-center gap-2">
              Text File
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">TXT</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportAsJson}>
            <div className="flex items-center gap-2">
              JSON Data
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">JSON</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

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
        {insight.description && (
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            {insight.description}
          </p>
        )}
      </div>

      {/* Full Width Layout */}
      <div className="space-y-6">
        {/* Video Player and Chatbot - Full Width */}
        <div className="grid grid-cols-12 gap-6">
          {/* Video Player - 8 columns */}
          <div className="col-span-8">
            <Card className="border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                {insight.mediaUrl ? (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <video 
                      ref={videoRef}
                      className="w-full h-full"
                      controls
                      preload="metadata"
                      poster={insight.meetingChapters[0]?.thumbnail_url || undefined}
                    >
                      <source src={insight.mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Video not available</p>
                    </div>
                  </div>
                )}
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
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isSending}
                  >
                    {isSending ? (
                      <div className="animate-spin">⌛</div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
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
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => {
                  const container = document.getElementById('chapters-container');
                  if (container) {
                    container.scrollLeft -= container.clientWidth / 2;
                  }
                }}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => {
                  const container = document.getElementById('chapters-container');
                  if (container) {
                    container.scrollLeft += container.clientWidth / 2;
                  }
                }}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div 
            id="chapters-container"
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ 
              scrollBehavior: 'smooth',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none'
            }}
          >
            {insight.meetingChapters.map((chapter, index) => (
              <Card
                key={index} 
                className={`flex-none w-[300px] snap-start cursor-pointer hover:shadow-md transition-all ${
                  selectedChapter === index 
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                    : 'border-gray-200 dark:border-gray-700'
                }`}
                onClick={() => {
                  setSelectedChapter(index)
                  navigateToTimestamp(chapter.startTime)
                }}
              >
                <CardContent className="p-4">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded mb-3 overflow-hidden">
                    <ImageWithFallback
                      src={insight.meetingChapters[index].thumbnail_url}
                      alt={`Thumbnail for ${chapter.title}`}
                      fallbackType="meeting"
                      fallbackSize="md"
                    />
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
          {/* Decision Made */}
          <div className="col-span-6">
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
          <div className="col-span-6">
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
          <div className="col-span-12">
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

        {/* Transcript - Full Width */}
        <Card className="border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Transcript</CardTitle>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{insight.transcriptLines.length > 0 ? `${insight.transcriptLines.length} segments` : 'No transcript available'}</span>
                <div className="w-4 h-8 border border-gray-300 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-4 bg-gray-400 rounded-sm"></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded p-4 bg-gray-50 dark:bg-gray-800">
              {insight.transcriptLines.length > 0 ? (
                <div className="space-y-3">
                  {insight.transcriptLines.map((line, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-xs text-gray-400 font-mono min-w-[3rem] mt-1">
                        {String(index + 1).padStart(3, '0')}
                      </span>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                        {line}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    {insight.transcript ? 'Processing transcript...' : 'No transcript available for this meeting.'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <SaveAsButton />
    </div>
  )
} 