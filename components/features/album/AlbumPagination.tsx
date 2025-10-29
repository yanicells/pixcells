'use client';

import { useAlbumsStore } from "@/store"
import { useRouter, usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AlbumPagination() {
  const router = useRouter()
  const pathname = usePathname()
  const albums = useAlbumsStore((state) => state.albums)

  // Get current album from pathname
  const currentAlbumName = useMemo(() => {
    const match = pathname.match(/\/albums\/(.+)/)
    return match ? decodeURIComponent(match[1]) : null
  }, [pathname])

  // Find current album index
  const currentIndex = useMemo(() => {
    return albums.findIndex(album => album.name === currentAlbumName)
  }, [albums, currentAlbumName])

  // Get previous and next albums
  const prevAlbum = currentIndex > 0 ? albums[currentIndex - 1] : null
  const nextAlbum = currentIndex < albums.length - 1 ? albums[currentIndex + 1] : null
  const currentAlbum = currentIndex !== -1 ? albums[currentIndex] : null

  const handlePrevious = () => {
    if (prevAlbum) {
      router.push(`/albums/${encodeURIComponent(prevAlbum.name)}`)
    }
  }

  const handleNext = () => {
    if (nextAlbum) {
      router.push(`/albums/${encodeURIComponent(nextAlbum.name)}`)
    }
  }

  if (currentIndex === -1) return null

  return (
    <div className="w-full max-w-[90vw] md:max-w-[52rem] lg:max-w-[56rem] mx-auto p-4">
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={!prevAlbum}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white/80 text-sm font-medium transition-all duration-300 hover:bg-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/20"
        >
          <ChevronLeft className="w-4 h-4 flex-shrink-0" />
          <span className="leading-none">{prevAlbum?.name || 'Previous'}</span>
        </button>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!nextAlbum}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 shadow-lg text-white/80 text-sm font-medium transition-all duration-300 hover:bg-white/30 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/20"
        >
          <span className="leading-none">{nextAlbum?.name || 'Next'}</span>
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        </button>
      </div>
    </div>
  )
}
