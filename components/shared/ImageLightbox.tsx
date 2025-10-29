"use client"

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { X } from 'lucide-react'
import type { AlbumImage } from '@/store'
import DownloadButton from './DownloadButton'

interface ImageLightboxProps {
  image: AlbumImage
  alt: string
  isOpen: boolean
  onClose: () => void
}

function ImageLightbox({ image, alt, isOpen, onClose }: ImageLightboxProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        aria-label="Close lightbox"
      >
        <X size={24} />
      </button>
      
      <div
        className="relative flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.url}
          alt={alt}
          width={1200}
          height={1200}
          className="h-auto w-auto max-h-[70vh] max-w-[70vw] object-contain"
          quality={100}
          unoptimized
          priority
        />
        <div className="flex gap-4">
          <DownloadButton imageUrl={image.url} />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ImageLightbox