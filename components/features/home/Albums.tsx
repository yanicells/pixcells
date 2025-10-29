"use client"

import React from 'react'
import Link from 'next/link'
import { useAlbumsStore } from '@/store'
import { AlbumCarousel } from './AlbumCarousel'

function Albums() {
  const albums = useAlbumsStore((state) => state.albums)

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
      {albums.map(({ name }, index) => (
        <div key={index}>
          <Link 
            href={`/albums/${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-2 px-2 sm:px-5 lg:px-7 mb-1 text-lg sm:text-xl md:text-2xl font-bold text-white hover:text-white/80 transition-colors duration-200 group"
          >
            {name}
            <span className="text-base sm:text-lg md:text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">›</span>
          </Link>
          <AlbumCarousel album={name} />
        </div>
      ))}
    </div>
  )
}

export default Albums