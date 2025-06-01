"use client"

import React from 'react'

interface DefaultIllustrationProps {
  type?: 'meeting' | 'audio' | 'video' | 'document' | 'generic'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function DefaultIllustration({ 
  type = 'generic', 
  size = 'md',
  className = '' 
}: DefaultIllustrationProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-16 h-16'
      case 'md': return 'w-24 h-24'
      case 'lg': return 'w-32 h-32'
      case 'xl': return 'w-40 h-40'
      default: return 'w-24 h-24'
    }
  }

  const renderMeetingIllustration = () => (
    <div className={`${getSizeClasses()} ${className} relative flex items-center justify-center`}>
      {/* Meeting table with people */}
      <div className="relative scale-75">
        {/* People around table */}
        <div className="flex items-center justify-center space-x-3">
          {/* Person 1 */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full mb-1 shadow-sm"></div>
            <div className="w-4 h-6 bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-lg"></div>
          </div>
          
          {/* Person 2 */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-green-300 to-green-400 rounded-full mb-1 shadow-sm"></div>
            <div className="w-4 h-6 bg-gradient-to-b from-green-400 to-green-500 rounded-t-lg"></div>
          </div>
          
          {/* Person 3 */}
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full mb-1 shadow-sm"></div>
            <div className="w-4 h-6 bg-gradient-to-b from-purple-400 to-purple-500 rounded-t-lg"></div>
          </div>
        </div>
        
        {/* Table */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-3 bg-gradient-to-b from-gray-200 to-gray-300 rounded-full shadow-lg"></div>
        </div>
      </div>
    </div>
  )

  const renderAudioIllustration = () => (
    <div className={`${getSizeClasses()} ${className} relative flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl`}>
      {/* Sound waves */}
      <div className="flex items-center space-x-1">
        <div className="w-1 h-8 bg-orange-400 rounded-full"></div>
        <div className="w-1 h-12 bg-orange-500 rounded-full"></div>
        <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
        <div className="w-1 h-10 bg-orange-500 rounded-full"></div>
        <div className="w-1 h-4 bg-orange-400 rounded-full"></div>
        <div className="w-1 h-14 bg-orange-600 rounded-full"></div>
        <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
        <div className="w-1 h-6 bg-orange-400 rounded-full"></div>
      </div>
      {/* Microphone icon overlay */}
      <div className="absolute bottom-2 right-2 w-4 h-4 bg-orange-600 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-sm"></div>
      </div>
    </div>
  )

  const renderVideoIllustration = () => (
    <div className={`${getSizeClasses()} ${className} relative flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl`}>
      {/* Video player interface */}
      <div className="relative">
        {/* Screen */}
        <div className="w-16 h-12 bg-gradient-to-b from-blue-300 to-blue-400 rounded-lg shadow-lg"></div>
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
            <div className="w-0 h-0 border-l-4 border-l-blue-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
          </div>
        </div>
        {/* Camera icon overlay */}
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-sm"></div>
        </div>
      </div>
    </div>
  )

  const renderDocumentIllustration = () => (
    <div className={`${getSizeClasses()} ${className} relative flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl`}>
      {/* Document stack */}
      <div className="relative">
        <div className="w-12 h-16 bg-white rounded-lg shadow-lg border border-gray-300">
          {/* Text lines */}
          <div className="p-2 space-y-1">
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className="w-6 h-1 bg-gray-300 rounded"></div>
            <div className="w-7 h-1 bg-gray-300 rounded"></div>
            <div className="w-5 h-1 bg-gray-300 rounded"></div>
          </div>
        </div>
        {/* Folded corner */}
        <div className="absolute top-0 right-0 w-3 h-3 bg-gray-300 border-l border-b border-gray-400"></div>
      </div>
    </div>
  )

  const renderGenericIllustration = () => (
    <div className={`${getSizeClasses()} ${className} relative flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl`}>
      {/* Abstract geometric shapes */}
      <div className="relative">
        <div className="w-8 h-8 bg-teal-400 rounded-lg transform rotate-12 shadow-lg"></div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-500 rounded-full shadow-md"></div>
        <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-teal-600 rounded-lg transform -rotate-12"></div>
      </div>
    </div>
  )

  const renderIllustration = () => {
    switch (type) {
      case 'meeting':
        return renderMeetingIllustration()
      case 'audio':
        return renderAudioIllustration()
      case 'video':
        return renderVideoIllustration()
      case 'document':
        return renderDocumentIllustration()
      default:
        return renderGenericIllustration()
    }
  }

  return renderIllustration()
} 