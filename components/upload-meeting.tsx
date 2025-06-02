"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Upload, Video, Mic, Camera, Monitor } from "lucide-react"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { DefaultIllustration } from "@/components/default-illustration"
import { useRouter } from "next/navigation"
import { API_BASE_URL } from "@/lib/config"
import { Input } from "@/components/ui/input"

export function UploadMeeting() {
  const router = useRouter()
  const { user } = useAuth()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [fileType, setFileType] = useState<'video' | 'audio' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [mediaId, setMediaId] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingType, setRecordingType] = useState<'audio' | 'screen' | null>(null)
  const [recordingName, setRecordingName] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const webcamVideoRef = useRef<HTMLVideoElement>(null)
  const screenVideoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
      uploadResponse = await axios.get(`${API_BASE_URL}/generate-presigned-url`, {
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
      await axios.post(`${API_BASE_URL}/update-media-status`, {
        media_id: media_id,
        upload_status: 'completed',
        language: selectedLanguage,
        duration: Math.round(mediaDuration)
      })

      // Start processing the file immediately after successful upload
      await axios.post(`${API_BASE_URL}/media/${media_id}/analyze`)

      // Reset state after successful upload
      setIsUploading(false)
      setUploadProgress(100)
      setSelectedFile(null)
      setMediaId(null)
      setFileType(null)
      
      // Navigate to archive page after successful upload
      setTimeout(() => {
        router.push('/archive')
      }, 1500) // Add a small delay to show the 100% progress

      // You might want to store the file_url for later use
      console.log('File uploaded successfully. Public URL:', file_url)
    } catch (error) {
      console.error('Error uploading file:', error)
      setIsUploading(false)
      // Update media status to failed if upload fails
      if (mediaId) {
        try {
          await axios.post(`${API_BASE_URL}/update-media-status`, {
            media_id: mediaId,
            upload_status: 'failed'
          })
        } catch (updateError) {
          console.error('Error updating media status:', updateError)
        }
      }
    }
  }

  const startRecording = async (type: 'audio' | 'screen') => {
    try {
      let stream: MediaStream | null = null;
      
      if (type === 'audio') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } else if (type === 'screen') {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const tracks = [...screenStream.getTracks(), ...audioStream.getTracks()];
        stream = new MediaStream(tracks);
      }

      if (!stream) {
        throw new Error('Failed to initialize media stream');
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { 
          type: type === 'audio' ? 'audio/webm' : 'video/webm' 
        });
        const file = new File([blob], `${recordingName || 'recording'}.webm`, { 
          type: type === 'audio' ? 'audio/webm' : 'video/webm' 
        });
        setSelectedFile(file);
        setFileType(type === 'audio' ? 'audio' : 'video');
        
        // Clean up all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingType(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload a meeting</h1>
      </div>

      {/* Upload Tabs */}
      <Tabs defaultValue="upload-file" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800">
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
                {selectedFile ? (
                  <div className="mx-auto">
                    <DefaultIllustration 
                      type={fileType === 'video' ? 'video' : fileType === 'audio' ? 'audio' : 'generic'} 
                      size="xl"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-blue-500" />
                  </div>
                )}
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
        </TabsContent>

        <TabsContent value="live-recording" className="space-y-8 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Only Recording */}
            <Card className="border bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Audio Only</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Record audio from your microphone</p>
                {!isRecording ? (
                  <Button 
                    onClick={() => startRecording('audio')}
                    className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                  >
                    Start Recording
                  </Button>
                ) : recordingType === 'audio' && (
                  <div className="space-y-4">
                    <div className="animate-pulse flex justify-center">
                      <span className="text-orange-500">Recording...</span>
                    </div>
                    <Button 
                      onClick={stopRecording}
                      variant="destructive"
                      className="w-full"
                    >
                      Stop Recording
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Screen + Audio Recording */}
            <Card className="border bg-white dark:bg-gray-800">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Screen + Audio</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Record your screen with audio</p>
                {!isRecording ? (
                  <Button 
                    onClick={() => startRecording('screen')}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full"
                  >
                    Start Recording
                  </Button>
                ) : recordingType === 'screen' && (
                  <div className="space-y-4">
                    <div className="animate-pulse flex justify-center">
                      <span className="text-blue-500">Recording...</span>
                    </div>
                    <Button 
                      onClick={stopRecording}
                      variant="destructive"
                      className="w-full"
                    >
                      Stop Recording
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recording Name Input and Upload Section */}
          {selectedFile && !isRecording && (
            <Card className="border-0 bg-white dark:bg-gray-800 mt-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="recordingName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Recording Name
                    </label>
                    <Input
                      id="recordingName"
                      placeholder="Enter a name for your recording"
                      value={recordingName}
                      onChange={(e) => setRecordingName(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button 
                    onClick={uploadFile}
                    className="bg-green-500 hover:bg-green-600 text-white w-full"
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Recording'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
        </TabsContent>
      </Tabs>

      {/* Hidden elements for recording */}
      <div className="hidden">
        <video ref={webcamVideoRef} muted playsInline />
        <video ref={screenVideoRef} muted playsInline />
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
