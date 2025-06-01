"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { UploadMeeting } from "@/components/upload-meeting"

export default function MeetingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Meetings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload and manage your meeting recordings.
          </p>
        </div>
        
        <UploadMeeting />
      </div>
    </DashboardLayout>
  )
} 