"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function MeetingInsights() {
  const topicTags = [
    "Project Alpha",
    "Client Feedback",
    "Product Roadmap",
    "Marketing Strategy",
    "Sales Targets",
    "Customer Support",
    "Team Collaboration",
    "Innovation",
    "Market Trends",
    "Competitive Analysis",
  ]

  const actionItemsData = [
    { assignee: "Team A", week1: 5, week2: 3, week3: 7, week4: 2 },
    { assignee: "Team B", week1: 2, week2: 6, week3: 4, week4: 8 },
    { assignee: "Team C", week1: 8, week2: 1, week3: 5, week4: 3 },
  ]

  const speakers = [
    { name: "Speaker A", percentage: 25 },
    { name: "Speaker B", percentage: 30 },
    { name: "Speaker C", percentage: 25 },
    { name: "Speaker D", percentage: 20 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meeting Insights</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze meeting trends and performance across your organization
        </p>
      </div>

      {/* Sentiment Analysis */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Meeting Sentiment Over Time</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Positive</h3>
              <p className="text-sm text-green-600">Last 30 Days +12%</p>
            </div>
          </div>

          {/* Sentiment Chart Placeholder */}
          <div className="h-48 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <path
                d="M 20 100 Q 60 80 100 90 T 180 85 T 260 95 T 340 70 T 380 80"
                stroke="#10b981"
                strokeWidth="3"
                fill="none"
                className="drop-shadow-sm"
              />
              <circle cx="60" cy="85" r="3" fill="#10b981" />
              <circle cx="120" cy="88" r="3" fill="#10b981" />
              <circle cx="180" cy="85" r="3" fill="#10b981" />
              <circle cx="240" cy="92" r="3" fill="#10b981" />
              <circle cx="300" cy="75" r="3" fill="#10b981" />
              <circle cx="360" cy="78" r="3" fill="#10b981" />
            </svg>
            <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 text-xs text-gray-500">
              <span>Meeting 1</span>
              <span>Meeting 2</span>
              <span>Meeting 3</span>
              <span>Meeting 4</span>
              <span>Meeting 5</span>
              <span>Meeting 6</span>
              <span>Meeting 7</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Talk Time Distribution */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Talk Time Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Talk Time by Speaker</span>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Balanced</h3>
              <p className="text-sm text-blue-600">Last 30 Days +5%</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {speakers.map((speaker, index) => (
              <div key={speaker.name} className="space-y-2">
                <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-end p-2">
                  <div className="w-full bg-blue-500 rounded-sm" style={{ height: `${speaker.percentage * 2}%` }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{speaker.name}</p>
                  <p className="text-xs text-gray-500">{speaker.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Topic Cloud */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Topic Cloud</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {topicTags.map((topic, index) => (
              <Badge
                key={topic}
                variant="secondary"
                className={`text-sm ${
                  index % 3 === 0
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : index % 3 === 1
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                }`}
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items Heatmap */}
      <Card className="border-0 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Action Items Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium text-gray-600 dark:text-gray-400">
              <div>Assignee</div>
              <div className="text-center">Week 1</div>
              <div className="text-center">Week 2</div>
              <div className="text-center">Week 3</div>
              <div className="text-center">Week 4</div>
            </div>

            {actionItemsData.map((row) => (
              <div key={row.assignee} className="grid grid-cols-5 gap-4 items-center">
                <div className="font-medium text-gray-900 dark:text-white">{row.assignee}</div>
                <div className="text-center">
                  <span
                    className={`inline-block w-8 h-8 rounded text-sm leading-8 ${
                      row.week1 > 5
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : row.week1 > 3
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {row.week1}
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block w-8 h-8 rounded text-sm leading-8 ${
                      row.week2 > 5
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : row.week2 > 3
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {row.week2}
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block w-8 h-8 rounded text-sm leading-8 ${
                      row.week3 > 5
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : row.week3 > 3
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {row.week3}
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-block w-8 h-8 rounded text-sm leading-8 ${
                      row.week4 > 5
                        ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                        : row.week4 > 3
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                          : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    }`}
                  >
                    {row.week4}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
