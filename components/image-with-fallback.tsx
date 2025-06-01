"use client"

import React, { useState } from 'react'
import { DefaultIllustration } from '@/components/default-illustration'

interface ImageWithFallbackProps {
  src?: string | null
  alt: string
  className?: string
  fallbackType?: 'meeting' | 'audio' | 'video' | 'document' | 'generic'
  fallbackSize?: 'sm' | 'md' | 'lg' | 'xl'
  onError?: () => void
}

export function ImageWithFallback({
  src,
  alt,
  className = '',
  fallbackType = 'generic',
  fallbackSize = 'md',
  onError
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleError = () => {
    setImageError(true)
    onError?.()
  }

  const handleLoad = () => {
    setImageLoaded(true)
  }

  // If no src or image failed to load, show fallback
  if (!src || imageError) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <DefaultIllustration 
          type={fallbackType}
          size={fallbackSize}
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        onLoad={handleLoad}
        style={{ 
          display: imageLoaded ? 'block' : 'none'
        }}
      />
      {/* Show fallback while loading */}
      {!imageLoaded && (
        <div className="w-full h-full flex items-center justify-center">
          <DefaultIllustration 
            type={fallbackType}
            size={fallbackSize}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  )
} 