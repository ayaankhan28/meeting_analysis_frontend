"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Upload, Video, Mic } from "lucide-react"

export function UploadMeeting() {
  const [uploadProgress, setUploadProgress] = useState(20)
  const [isUploading, setIsUploading] = useState(true)

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
          {/* Upload Zone */}
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors duration-200">
            <CardContent className="p-16 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Drag and drop files here</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Or, browse files from your computer</p>
                  <Button className="bg-gray-900 hover:bg-gray-800 text-white">Browse files</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Uploading</span>
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
                <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
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
