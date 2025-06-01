"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Upload, Video, Mic } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"

export function UploadMeeting() {
  const { user } = useAuth()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [fileType, setFileType] = useState<'video' | 'audio' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mediaId, setMediaId] = useState<string | null>(null)
  // TODO: Replace this with actual user ID from your auth system
  const user_id = "00000000-0000-0000-0000-000000000000" 

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setSelectedFile(file)
      setFileType(file.type.startsWith('video/') ? 'video' : 'audio')
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const file = event.dataTransfer.files[0]
      if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        setSelectedFile(file)
        setFileType(file.type.startsWith('video/') ? 'video' : 'audio')
      } else {
        // You might want to show an error message here
        console.error('Please upload only video or audio files')
      }
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // Get media duration for both video and audio
  const getMediaDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const element = file.type.startsWith('video/') ? 
        document.createElement('video') : 
        document.createElement('audio')
      
      element.preload = 'metadata'
      element.onloadedmetadata = () => {
        window.URL.revokeObjectURL(element.src)
        resolve(element.duration)
      }
      element.onerror = () => reject('Error loading media file')
      element.src = URL.createObjectURL(file)
    })
  }

  const uploadFile = async () => {
    if (!selectedFile || !user || !fileType) return

    let uploadResponse;
    try {
      setIsUploading(true)
      setUploadProgress(0)

      // Get media duration
      const mediaDuration = await getMediaDuration(selectedFile)

      // Get presigned URL from backend
      uploadResponse = await axios.get(`http://localhost:8000/generate-presigned-url`, {
        params: {
          file_name: selectedFile.name,
          file_type: fileType,
          user_id: user.id
        }
      })
      const { upload_url, file_url, media_id } = uploadResponse.data
      setMediaId(media_id)

      // Upload file using presigned URL
      await axios.put(upload_url, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total 
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0
          setUploadProgress(progress)
        },
      })

      // Update media status after successful upload
      await axios.post('http://localhost:8000/update-media-status', {
        media_id: media_id,
        upload_status: 'completed',
        language: selectedLanguage,
        duration: Math.round(mediaDuration)
      })

      // Start processing the file immediately after successful upload
      await axios.post(`http://localhost:8000/media/${media_id}/analyze`)

      // Reset state after successful upload
      setIsUploading(false)
      setUploadProgress(100)
      setSelectedFile(null)
      setMediaId(null)
      setFileType(null)
      
      // You might want to store the file_url for later use
      console.log('File uploaded successfully. Public URL:', file_url)
    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
      // Update media status to failed if upload fails
      if (mediaId) {
        try {
          await axios.post('http://localhost:8000/update-media-status', {
            media_id: mediaId,
            upload_status: 'failed'
          })
        } catch (updateError) {
          console.error('Error updating media status:', updateError)
        }
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload a meeting</h1>
      </div>

      {/* Upload Tabs */}
      <Tabs defaultValue="upload-file" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-800">
          <TabsTrigger
            value="upload-file"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:border-b-2 data-[state=active]:border-green-500"
          >
            Upload File
          </TabsTrigger>
          <TabsTrigger
            value="live-recording"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Start Live Recording
          </TabsTrigger>
          <TabsTrigger
            value="connect-platform"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            Connect Google Meet/Zoom
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload-file" className="space-y-8 mt-8">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            accept="video/*,audio/*"
          />

          {/* Upload Zone */}
          <Card 
            className={`border-2 border-dashed ${
              selectedFile ? 'border-green-400' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
            } transition-colors duration-200`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <CardContent className="p-16 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                  {fileType === 'video' ? (
                    <Video className="w-8 h-8 text-blue-500" />
                  ) : fileType === 'audio' ? (
                    <Mic className="w-8 h-8 text-blue-500" />
                  ) : (
                    <Upload className="w-8 h-8 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    {selectedFile ? selectedFile.name : 'Drag and drop files here'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {selectedFile ? `Selected ${fileType} file` : 'Upload video or audio files from your computer'}
                  </p>
                  {selectedFile ? (
                    <Button 
                      className="bg-green-500 hover:bg-green-600 text-white"
                      onClick={uploadFile}
                      disabled={isUploading}
                    >
                      {isUploading ? 'Uploading...' : 'Start Upload'}
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={handleBrowseClick}
                    >
                      Browse files
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {(isUploading || uploadProgress === 100) && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {uploadProgress === 100 ? 'Upload Complete' : 'Uploading'}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{uploadProgress}% complete</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          )}

          {/* Meeting Details Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="meeting-title" className="text-sm font-medium text-gray-900 dark:text-white">
                  Meeting title
                </Label>
                <Input
                  id="meeting-title"
                  placeholder="Enter meeting title"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speakers" className="text-sm font-medium text-gray-900 dark:text-white">
                  Speakers
                </Label>
                <Input
                  id="speakers"
                  placeholder="Enter speaker names"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm font-medium text-gray-900 dark:text-white">
                  Language
                </Label>
                <select 
                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-gray-900 dark:text-white">
                  Tags
                </Label>
                <Input
                  id="tags"
                  placeholder="Add tags"
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Advanced Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-900 dark:text-white">Advanced</Label>
                  <Switch />
                </div>

                <div className="space-y-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="ocr" defaultChecked />
                    <Label htmlFor="ocr" className="text-sm text-gray-700 dark:text-gray-300">
                      OCR
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="emotion-detection" />
                    <Label htmlFor="emotion-detection" className="text-sm text-gray-700 dark:text-gray-300">
                      Real-time emotion detection
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="live-recording" className="space-y-8 mt-8">
          <Card className="border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mic className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Start Live Recording</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Begin real-time transcription and AI analysis</p>
              <Button className="bg-green-500 hover:bg-green-600 text-white">Start Recording</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connect-platform" className="space-y-8 mt-8">
          <Card className="border-0 bg-white dark:bg-gray-800">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Connect Platform</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Integrate with Google Meet, Zoom, or Teams</p>
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">Connect Now</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
