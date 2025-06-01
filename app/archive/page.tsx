"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ArchiveSearch } from "@/components/archive-search"

export default function ArchivePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Archive
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search and browse through your archived meeting summaries.
          </p>
        </div>
        
        <ArchiveSearch />
      </div>
    </DashboardLayout>
  )
} 