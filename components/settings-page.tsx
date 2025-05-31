"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Calendar, FileText, MessageSquare, Settings, Hash } from "lucide-react"

export function SettingsPage() {
  const connectedAccounts = [
    {
      name: "Calendar",
      description: "Connect your calendar to automatically import meetings",
      icon: Calendar,
      connected: false,
    },
    {
      name: "Notes",
      description: "Connect your notes app to automatically export meeting notes",
      icon: FileText,
      connected: false,
    },
    {
      name: "Messaging",
      description: "Connect your messaging app to automatically send meeting summaries",
      icon: MessageSquare,
      connected: false,
    },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Connected Accounts */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedAccounts.map((account) => (
            <div
              key={account.name}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <account.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{account.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{account.description}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Connect
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Audio & Video Processing */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Audio & Video Processing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Automatic Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically process audio and video recordings after meetings
                </p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Transcription Model */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Transcription Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Whisper</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">High accuracy, slower processing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Fast Whisper</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Lower accuracy, faster processing</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Language</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </CardContent>
      </Card>

      {/* Export Settings */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Export Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm">
            <option>PDF</option>
            <option>Markdown</option>
            <option>JSON</option>
            <option>Word Document</option>
          </select>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Branding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Branding</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add MeetingIQ Pro branding to exported notes</p>
              </div>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
