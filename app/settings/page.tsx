"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { SettingsPage } from "@/components/settings-page"

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account preferences and integrations.
          </p>
        </div>
        
        <SettingsPage />
      </div>
    </DashboardLayout>
  )
} 